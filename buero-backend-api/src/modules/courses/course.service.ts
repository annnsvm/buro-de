import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Language,
  Level,
  Role,
  UserCourseAccessType,
} from "../../generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { stripQuizAnswers } from "../../common/content/strip-quiz-answers";
import { TRIAL_FREE_MODULE_COUNT } from "../../common/access/trial-scope";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import {
  ListCoursesQueryDto,
  PublicationStatus,
} from "./dto/list-courses-query.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ReorderCoursesDto } from "./dto/reorder-courses.dto";
import { UserService } from "../user/user.service";
import { PaymentFulfillmentService } from "../subscriptions/payment-fulfillment.service";

type LessonCountRow = {
  course_id: string;
  lessons: number;
  videos: number;
};

const LIST_FRESH_MS = 30_000;
const LIST_STALE_MS = 5 * 60_000;

type CourseListItem = Record<string, unknown>;

/** Who is asking for a course, so content can be scoped to what they paid for. */
export type CourseViewer = { id: string; role: Role };

/** Modules whose `content` may be serialized: every one, or an explicit allow-list. */
type ReadableModules = "all" | ReadonlySet<string>;

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);
  private readonly listCache = new Map<
    string,
    { at: number; data: CourseListItem[] }
  >();
  private readonly listInflight = new Map<string, Promise<CourseListItem[]>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly paymentFulfillment: PaymentFulfillmentService
  ) {}

  /** Курси, до яких у користувача є доступ (trial, purchase, subscription). */
  async findMyAccessibleCourses(userId: string) {
    try {
      void this.paymentFulfillment.reconcilePendingForUser(userId);

      const [accesses, { videos: videoByCourse, lessons: lessonsByCourse }] =
        await Promise.all([
          this.prisma.userCourseAccess.findMany({
            where: { userId },
            include: { course: true },
            orderBy: { createdAt: "desc" },
          }),
          this.countLessonsByCourseIds(),
        ]);
      // A trial never lapses, so every access row stays in the list.
      return accesses.map((a) => ({
        ...this.serializeCourse(a.course as Record<string, unknown>),
        videoLessonCount: videoByCourse.get(a.courseId) ?? 0,
        lessonsCount: lessonsByCourse.get(a.courseId) ?? 0,
        avgVideoLessonMinutes: null,
        my_access: {
          access_type: a.accessType,
        },
      }));
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async findAll(
    filters?: ListCoursesQueryDto,
    opts?: { publicationFilter?: PublicationStatus },
  ) {
    try {
      const pubFilter = opts?.publicationFilter ?? PublicationStatus.published;
      const where: {
        isPublished?: boolean;
        language?: Language;
        tags?: { hasSome: string[] };
        level?: Level;
        OR?: Array<
          | { title: { contains: string; mode: "insensitive" } }
          | { description: { contains: string; mode: "insensitive" } }
        >;
      } = {};
      if (pubFilter === PublicationStatus.published) where.isPublished = true;
      else if (pubFilter === PublicationStatus.unpublished)
        where.isPublished = false;
      if (filters?.language) where.language = filters.language;
      if (filters?.level) where.level = filters.level;
      const searchTrim = filters?.search?.trim();
      if (searchTrim) {
        where.OR = [
          { title: { contains: searchTrim, mode: "insensitive" } },
          { description: { contains: searchTrim, mode: "insensitive" } },
        ];
      }
      if (filters?.tags) {
        const tagsArray = filters.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (tagsArray.length > 0) where.tags = { hasSome: tagsArray };
      }

      const cacheKey = JSON.stringify({ pubFilter, filters: filters ?? {} });
      const cached = this.listCache.get(cacheKey);
      const age = cached ? Date.now() - cached.at : Number.POSITIVE_INFINITY;
      if (cached && age < LIST_FRESH_MS) {
        return cached.data;
      }
      if (cached && age < LIST_STALE_MS) {
        void this.refreshCourseList(cacheKey, where).catch((error) => {
          this.logger.warn(
            `Catalog refresh failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        });
        return cached.data;
      }
      return await this.refreshCourseList(cacheKey, where);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async findById(
    id: string,
    includeModules = true,
    viewer?: CourseViewer | null,
  ) {
    try {
      const userId = viewer?.id ?? null;
      const [course, access] = await Promise.all([
        includeModules
          ? this.loadCourseTree(id)
          : this.prisma.course.findUnique({ where: { id } }),
        userId
          ? this.prisma.userCourseAccess.findUnique({
              where: { userId_courseId: { userId, courseId: id } },
            })
          : Promise.resolve(null),
      ]);
      if (!course) {
        throw new NotFoundException(`Курс з id ${id} не знайдено`);
      }

      /**
       * Drafts are teacher-only. Without this an unpublished course stays readable
       * by anyone who knows (or guesses) its id, which is how unfinished content leaks.
       * 404 rather than 403 so the id itself is not confirmed.
       */
      const isTeacher = viewer?.role === Role.teacher;
      if (course.isPublished !== true && !isTeacher) {
        throw new NotFoundException(`Курс з id ${id} не знайдено`);
      }

      /**
       * The tree is already ordered by order_index, so the trial scope can be read
       * off it without a second query.
       */
      const orderedModules =
        "modules" in course && Array.isArray(course.modules)
          ? (course.modules as Array<{ id?: unknown }>)
          : [];
      const trialModuleIds = orderedModules
        .slice(0, TRIAL_FREE_MODULE_COUNT)
        .map((mod) => (typeof mod.id === "string" ? mod.id : null))
        .filter((moduleId): moduleId is string => moduleId !== null);

      const scoped = this.applyContentAccess(
        course as Record<string, unknown>,
        this.resolveReadableModules(access, isTeacher, trialModuleIds),
        isTeacher,
      );
      const serialized = this.serializeCourse(scoped);

      if (!access) return serialized as any;

      const my_access = {
        access_type: access.accessType,
        ...(access.accessType === "trial" &&
          trialModuleIds.length > 0 && {
            /** Kept for older clients; trial_module_ids is the full list. */
            first_module_id: trialModuleIds[0],
            trial_module_ids: trialModuleIds,
          }),
      };

      return { ...serialized, my_access } as any;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  /**
   * Which modules of this course may have their `content` and attachments served.
   * "all" for teachers and paid access, the opening modules on a trial, nothing for
   * guests and for users with no access row. Trials do not lapse.
   */
  private resolveReadableModules(
    access: { accessType: string } | null,
    isTeacher: boolean,
    trialModuleIds: string[],
  ): ReadableModules {
    if (isTeacher) return "all";
    if (!access) return new Set<string>();
    if (access.accessType === UserCourseAccessType.trial) {
      return new Set(trialModuleIds);
    }
    return "all";
  }

  /** Drops `content` and attachments of every module the viewer may not read. */
  private applyContentAccess(
    course: Record<string, unknown>,
    readable: ReadableModules,
    isTeacher: boolean,
  ): Record<string, unknown> {
    const modules = course.modules;
    if (!Array.isArray(modules)) return course;
    return {
      ...course,
      modules: modules.map((mod: Record<string, unknown>) => {
        const materials = mod.materials;
        if (!Array.isArray(materials)) return mod;
        const moduleId = typeof mod.id === "string" ? mod.id : "";
        const unlocked = readable === "all" || readable.has(moduleId);
        return {
          ...mod,
          materials: materials.map((mat: Record<string, unknown>) =>
            this.applyMaterialAccess(mat, unlocked, isTeacher),
          ),
        };
      }),
    };
  }

  private applyMaterialAccess(
    material: Record<string, unknown>,
    unlocked: boolean,
    isTeacher: boolean,
  ): Record<string, unknown> {
    const { content, attachments, ...rest } = material;
    /**
     * Duration is showcase data, not paid content — the catalog and the lesson list
     * show it for locked lessons too. Lift it out before `content` is dropped.
     */
    const base = {
      ...rest,
      duration: this.extractDuration(content),
      locked: !unlocked,
    };
    if (!unlocked) {
      return { ...base, content: null, attachments: [] };
    }
    /**
     * Teachers author the quizzes, and the material editor pre-selects the right
     * options from `correct` — stripping it for them would blank the answer key on
     * the next save. Everyone else gets the content without the key.
     */
    return {
      ...base,
      content: isTeacher ? (content ?? null) : stripQuizAnswers(content),
      attachments: attachments ?? [],
    };
  }

  private extractDuration(content: unknown): string | null {
    if (!content || typeof content !== "object") return null;
    const value = (content as { duration?: unknown }).duration;
    return typeof value === "string" && value.trim() ? value : null;
  }

  async create(dto: CreateCourseDto) {
    try {
      const maxOrder = await this.prisma.course.aggregate({
        _max: { orderIndex: true },
      });
      const nextOrderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

      const course = await this.prisma.course.create({
        data: {
          title: dto.title,
          description: dto.description ?? null,
          language: dto.language,
          isPublished: dto.is_published ?? false,
          orderIndex: nextOrderIndex,
          ...(dto.price !== undefined && { price: dto.price }),
          tags: dto.tags ?? [],
          ...(dto.level !== undefined && { level: dto.level }),
          ...(dto.duration_hours !== undefined && {
            durationHours: dto.duration_hours,
          }),
        },
      });
      this.clearCourseCaches();
      return this.serializeCourse(course as Record<string, unknown>);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async reorderCourses(dto: ReorderCoursesDto) {
    try {
      const ids = dto.items.map((item) => item.id);
      const existingCount = await this.prisma.course.count({
        where: { id: { in: ids } },
      });
      if (existingCount !== ids.length) {
        throw new NotFoundException("Один або кілька курсів не знайдено");
      }

      await this.prisma.$transaction(
        dto.items.map((item) =>
          this.prisma.course.update({
            where: { id: item.id },
            data: { orderIndex: item.order_index },
          }),
        ),
      );

      this.clearCourseCaches();
      return { updated: dto.items.length };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  async update(id: string, dto: UpdateCourseDto) {
    try {
      const existing = await this.prisma.course.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          price: true,
          isPublished: true,
        },
      });
      if (!existing) {
        throw new NotFoundException(`Курс з id ${id} не знайдено`);
      }

      const updateData: Record<string, unknown> = {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(dto.language !== undefined && { language: dto.language }),
        ...(dto.is_published !== undefined && {
          isPublished: dto.is_published,
        }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.level !== undefined && { level: dto.level }),
        ...(dto.duration_hours !== undefined && {
          durationHours: dto.duration_hours,
        }),
      };

      const course = await this.prisma.course.update({
        where: { id },
        data: updateData as Parameters<
          typeof this.prisma.course.update
        >[0]["data"],
      });
      this.clearCourseCaches();
      return this.serializeCourse(course as Record<string, unknown>);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      this.logger.error(
        `Course update failed for id ${id}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw this.mapPrismaError(error);
    }
  }

  /** Конвертує Prisma Decimal price в number */
  private priceToNumber(price: unknown): number | null {
    if (price == null) return null;
    if (typeof price === "number" && Number.isFinite(price)) return price;
    if (typeof price === "object" && "toString" in price) {
      const n = Number((price as { toString: () => string }).toString());
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }

  async delete(id: string) {
    try {
      const existing = await this.prisma.course.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existing) {
        throw new NotFoundException(`Курс з id ${id} не знайдено`);
      }
      await this.prisma.course.delete({
        where: { id },
      });
      this.clearCourseCaches();
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  /**
   * Завантажує обкладинку в Cloudinary і зберігає secure_url у courses.image_url.
   */
  async uploadCover(courseId: string, file: Express.Multer.File) {
    try {
      /**
       * A direct existence check, not findById: covers are uploaded while the course
       * is still a draft, and findById now hides drafts from anyone but a teacher.
       */
      const existing = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true },
      });
      if (!existing) {
        throw new NotFoundException(`Курс з id ${courseId} не знайдено`);
      }

      const secureUrl = await this.cloudinaryService.uploadImage(file.buffer, {
        folder: "courses",
        publicId: courseId,
      });

      const course = await this.prisma.course.update({
        where: { id: courseId },
        data: { imageUrl: secureUrl },
      });
      this.clearCourseCaches();
      return this.serializeCourse(course as Record<string, unknown>);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw error;
    }
  }

  async startTrial(userId: string, courseId: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, isPublished: true },
      });
      if (!course) {
        throw new NotFoundException(`Курс з id ${courseId} не знайдено`);
      }
      if (course.isPublished !== true) {
        throw new BadRequestException("Курс не опублікований");
      }

      const lessonsCount = await this.getCourseMaterialsCount(courseId);
      if (lessonsCount < 1) {
        throw new BadRequestException(
          "Курс ще не містить уроків і недоступний для trial",
        );
      }

      const user = await this.userService.findUserById(userId);
      if (!user)
        throw new NotFoundException(`Користувач з id ${userId} не знайдено`);
      if (user.role !== Role.student) {
        throw new BadRequestException("Тільки студент може активувати trial");
      }

      const existingAccess = await this.prisma.userCourseAccess.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      if (existingAccess) {
        throw new ConflictException(
          "У вас вже є доступ до цього курсу (trial, купівля або підписка)"
        );
      }

      /**
       * No trialEndsAt: the trial is a standing free tier, not a countdown, so it
       * is never given an end date.
       */
      await this.prisma.userCourseAccess.create({
        data: {
          userId,
          courseId,
          accessType: UserCourseAccessType.trial,
        },
      });

      return {
        course_id: courseId,
        access_type: "trial" as const,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw this.mapPrismaError(error);
    }
  }

  private clearCourseCaches(): void {
    this.listCache.clear();
    this.listInflight.clear();
  }

  private refreshCourseList(
    cacheKey: string,
    where: {
      isPublished?: boolean;
      language?: Language;
      tags?: { hasSome: string[] };
      level?: Level;
      OR?: Array<
        | { title: { contains: string; mode: "insensitive" } }
        | { description: { contains: string; mode: "insensitive" } }
      >;
    },
  ): Promise<CourseListItem[]> {
    const inflight = this.listInflight.get(cacheKey);
    if (inflight) return inflight;

    const task = (async () => {
      const [courses, { videos: videoByCourse, lessons: lessonsByCourse }] =
        await Promise.all([
          this.prisma.course.findMany({
            where,
            orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
          }),
          this.countLessonsByCourseIds(),
        ]);
      const list: CourseListItem[] = courses.map((c) => ({
        ...this.serializeCourse(c as Record<string, unknown>),
        videoLessonCount: videoByCourse.get(c.id) ?? 0,
        lessonsCount: lessonsByCourse.get(c.id) ?? 0,
        avgVideoLessonMinutes: null,
      }));
      this.listCache.set(cacheKey, { at: Date.now(), data: list });
      return list;
    })().finally(() => {
      this.listInflight.delete(cacheKey);
    });

    this.listInflight.set(cacheKey, task);
    return task;
  }

  /**
   * Nested Prisma include walks course → modules → materials → attachments
   * sequentially (4 RTTs to remote Postgres). Fetch all four in parallel.
   */
  private async loadCourseTree(id: string): Promise<Record<string, unknown> | null> {
    const [course, modules, materials, attachments] = await Promise.all([
      this.prisma.course.findUnique({ where: { id } }),
      this.prisma.courseModule.findMany({
        where: { courseId: id },
        orderBy: { orderIndex: "asc" },
      }),
      this.prisma.courseMaterial.findMany({
        where: { module: { courseId: id } },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          moduleId: true,
          type: true,
          title: true,
          content: true,
          /**
           * Whether a quiz is the practice after a lesson or the test after a module,
           * and the percentage its test needs. Both are properties of the material, so
           * the editor has to be able to read back what it set; without them it would
           * open every quiz on its defaults and quietly reset the mode on save.
           */
          quizMode: true,
          passingScore: true,
          orderIndex: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.materialAttachment.findMany({
        where: { material: { module: { courseId: id } } },
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          materialId: true,
          kind: true,
          title: true,
          url: true,
          fileName: true,
          mimeType: true,
          sizeBytes: true,
          orderIndex: true,
        },
      }),
    ]);
    if (!course) return null;

    const attachmentsByMaterial = new Map<string, Array<Record<string, unknown>>>();
    for (const item of attachments) {
      const { materialId, ...rest } = item;
      const list = attachmentsByMaterial.get(materialId) ?? [];
      list.push(rest);
      attachmentsByMaterial.set(materialId, list);
    }

    const materialsByModule = new Map<string, Array<Record<string, unknown>>>();
    for (const material of materials) {
      const list = materialsByModule.get(material.moduleId) ?? [];
      list.push({
        ...material,
        attachments: attachmentsByMaterial.get(material.id) ?? [],
      });
      materialsByModule.set(material.moduleId, list);
    }

    return {
      ...(course as Record<string, unknown>),
      modules: modules.map((mod) => ({
        ...mod,
        materials: materialsByModule.get(mod.id) ?? [],
      })),
    };
  }

  /** Один SQL замість двох Prisma-запитів — критично при remote Render DB. */
  private async countLessonsByCourseIds(): Promise<{
    lessons: Map<string, number>;
    videos: Map<string, number>;
  }> {
    const rows = await this.prisma.$queryRaw<LessonCountRow[]>`
      SELECT
        m.course_id AS course_id,
        COUNT(mat.id)::int AS lessons,
        COUNT(mat.id) FILTER (WHERE mat.type = 'video')::int AS videos
      FROM course_modules m
      LEFT JOIN course_materials mat ON mat.module_id = m.id
      GROUP BY m.course_id
    `;
    const lessons = new Map<string, number>();
    const videos = new Map<string, number>();
    for (const row of rows) {
      lessons.set(row.course_id, Number(row.lessons));
      videos.set(row.course_id, Number(row.videos));
    }
    return { lessons, videos };
  }

  private async getCourseMaterialsCount(courseId: string): Promise<number> {
    return this.prisma.courseMaterial.count({
      where: { module: { courseId } },
    });
  }

  /** Перетворює Decimal price на number для JSON-відповіді */
  private serializeCourse<T extends Record<string, unknown>>(course: T): T {
    if (course == null || typeof course !== "object") return course;
    const price = course.price;
    const priceAsNumber =
      price != null && typeof price === "object" && "toString" in price
        ? Number((price as { toString: () => string }).toString())
        : price != null
          ? Number(price)
          : null;
    const { imageUrl, ...rest } = course as T & {
      imageUrl?: string | null;
    };
    return {
      ...this.stripAttachmentStorageKeys(rest as Record<string, unknown>),
      price: priceAsNumber,
      image_url: imageUrl ?? null,
    } as unknown as T;
  }

  private stripAttachmentStorageKeys(
    course: Record<string, unknown>,
  ): Record<string, unknown> {
    const modules = course.modules;
    if (!Array.isArray(modules)) return course;
    return {
      ...course,
      modules: modules.map((mod: Record<string, unknown>) => {
        const materials = mod.materials;
        if (!Array.isArray(materials)) return mod;
        return {
          ...mod,
          materials: materials.map((mat: Record<string, unknown>) => {
            const attachments = mat.attachments;
            if (!Array.isArray(attachments)) return mat;
            return {
              ...mat,
              attachments: attachments.map(
                (item: Record<string, unknown>) => {
                  const { storageKey: _storageKey, ...rest } = item;
                  return rest;
                },
              ),
            };
          }),
        };
      }),
    };
  }

  private mapPrismaError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new BadRequestException(message);
  }
}
