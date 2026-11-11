import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role, UserCourseAccessType } from "src/generated/prisma/enums";
import { getTrialModuleIds } from "../../common/access/trial-scope";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCourseModuleDto } from "./dto/create-course-module.dto";
import { ReorderCourseStructureDto } from "./dto/reorder-course-structure.dto";
import { UpdateCourseModuleDto } from "./dto/update-course-module.dto";

@Injectable()
export class CourseModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCanAccessCourse(
    userId: string,
    role: Role,
    courseId: string
  ): Promise<void> {
    await this.ensureCourseExists(courseId);
    if (role === Role.teacher) return;
    const access = await this.prisma.userCourseAccess.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!access) {
      throw new ForbiddenException("Немає доступу до цього курсу");
    }
  }

  /** Перевірка доступу до конкретного модуля; при trial доступні лише вступні модулі. */
  async assertCanAccessModule(
    userId: string,
    role: Role,
    courseId: string,
    moduleId: string
  ): Promise<void> {
    await this.ensureCourseExists(courseId);
    if (role === Role.teacher) return;
    const access = await this.prisma.userCourseAccess.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!access) {
      throw new ForbiddenException("Немає доступу до цього курсу");
    }
    if (access.accessType === UserCourseAccessType.trial) {
      /**
       * An empty list means the trial opens nothing, not that nothing is restricted.
       * The check used to be skipped on an empty list, which was harmless while the
       * count was a constant 2 - the list was only ever empty for a course with no
       * modules. Now that a teacher can set the count to 0, skipping would hand the
       * whole course to anyone who registered.
       */
      const trialModuleIds = await getTrialModuleIds(this.prisma, courseId);
      if (!trialModuleIds.includes(moduleId)) {
        throw new ForbiddenException(
          "На пробному періоді доступні лише вступні модулі курсу"
        );
      }
    }
  }

  private async ensureCourseExists(courseId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Курс з id ${courseId} не знайдено`);
    }
  }

  private async ensureModuleBelongsToCourse(
    moduleId: string,
    courseId: string
  ): Promise<void> {
    const module = await this.prisma.courseModule.findFirst({
      where: { id: moduleId, courseId },
    });
    if (!module) {
      throw new NotFoundException(
        `Модуль з id ${moduleId} не знайдено або не належить курсу`
      );
    }
  }

  async findAllByCourseId(courseId: string, userId?: string, role?: Role) {
    try {
      await this.ensureCourseExists(courseId);
      if (userId && role === Role.student) {
        const access = await this.prisma.userCourseAccess.findUnique({
          where: { userId_courseId: { userId, courseId } },
        });
        if (access?.accessType === UserCourseAccessType.trial) {
          /**
           * Listed unconditionally, including when the list is empty: a course whose
           * trial opens nothing shows no modules to a trial, rather than all of them.
           */
          const trialModuleIds = await getTrialModuleIds(this.prisma, courseId);
          return this.prisma.courseModule.findMany({
            where: { courseId, id: { in: trialModuleIds } },
            orderBy: { orderIndex: "asc" },
          });
        }
      }
      return this.prisma.courseModule.findMany({
        where: { courseId },
        orderBy: { orderIndex: "asc" },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async findOne(
    courseId: string,
    moduleId: string,
    userId?: string,
    role?: Role
  ) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      if (userId && role !== undefined) {
        await this.assertCanAccessModule(userId, role, courseId, moduleId);
      }
      return this.prisma.courseModule.findUniqueOrThrow({
        where: { id: moduleId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw this.mapError(error);
    }
  }

  async create(courseId: string, dto: CreateCourseModuleDto) {
    try {
      await this.ensureCourseExists(courseId);
      return this.prisma.courseModule.create({
        data: {
          courseId,
          title: dto.title,
          orderIndex: dto.order_index,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async update(courseId: string, moduleId: string, dto: UpdateCourseModuleDto) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      return this.prisma.courseModule.update({
        where: { id: moduleId },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.order_index !== undefined && { orderIndex: dto.order_index }),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  /**
   * Persists the whole course structure in one transaction: module order plus,
   * for every listed material, its position and owning module (cross-module drag).
   */
  async reorderStructure(courseId: string, dto: ReorderCourseStructureDto) {
    try {
      await this.ensureCourseExists(courseId);

      const courseModules = await this.prisma.courseModule.findMany({
        where: { courseId },
        select: {
          id: true,
          orderIndex: true,
          materials: {
            select: {
              id: true,
              orderIndex: true,
              moduleId: true,
              parentMaterialId: true,
              type: true,
            },
          },
        },
      });
      const knownModuleIds = new Set(courseModules.map((m) => m.id));
      const knownMaterialIds = new Set(
        courseModules.flatMap((m) => m.materials.map((mat) => mat.id))
      );
      const currentModuleById = new Map(
        courseModules.map((m) => [m.id, m.orderIndex])
      );
      const currentMaterialById = new Map(
        courseModules.flatMap((m) =>
          m.materials.map((mat) => [mat.id, mat] as const)
        )
      );

      const seenModuleIds = new Set<string>();
      const seenMaterialIds = new Set<string>();

      for (const moduleItem of dto.modules) {
        if (!knownModuleIds.has(moduleItem.id)) {
          throw new NotFoundException(
            `Module ${moduleItem.id} not found in this course`
          );
        }
        if (seenModuleIds.has(moduleItem.id)) {
          throw new BadRequestException(
            `Duplicate module ${moduleItem.id} in payload`
          );
        }
        seenModuleIds.add(moduleItem.id);

        for (const materialItem of moduleItem.materials ?? []) {
          if (!knownMaterialIds.has(materialItem.id)) {
            throw new NotFoundException(
              `Material ${materialItem.id} not found in this course`
            );
          }
          if (seenMaterialIds.has(materialItem.id)) {
            throw new BadRequestException(
              `Duplicate material ${materialItem.id} in payload`
            );
          }
          seenMaterialIds.add(materialItem.id);
        }
      }

      const moduleUpdates = dto.modules.filter(
        (moduleItem) =>
          currentModuleById.get(moduleItem.id) !== moduleItem.order_index
      );
      /**
       * Where each material ends up, so a practice's new lesson can be checked against the
       * module it is landing in rather than the one it came from.
       */
      const moduleIdAfter = new Map<string, string>();
      for (const moduleItem of dto.modules) {
        for (const materialItem of moduleItem.materials ?? []) {
          moduleIdAfter.set(materialItem.id, moduleItem.id);
        }
      }

      /**
       * A practice hangs under a lesson, and the list that draws it assumes exactly one
       * level. So a parent has to be a material that ends up in the same module, must not
       * be the practice itself, and must not already hang under something else - otherwise
       * the tree gains a depth the editor cannot draw or the author cannot undo.
       */
      const checkParent = (
        materialId: string,
        parentId: string,
        landsIn: string
      ): void => {
        if (parentId === materialId) {
          throw new BadRequestException(
            `Material ${materialId} cannot hang under itself`
          );
        }
        const parent = currentMaterialById.get(parentId);
        if (!parent) {
          throw new NotFoundException(
            `Material ${parentId} not found in this course`
          );
        }
        if ((moduleIdAfter.get(parentId) ?? parent.moduleId) !== landsIn) {
          throw new BadRequestException(
            `Material ${parentId} is not in the same module as ${materialId}`
          );
        }
        const parentsParent =
          dto.modules
            .flatMap((moduleItem) => moduleItem.materials ?? [])
            .find((item) => item.id === parentId)?.parent_material_id ??
          parent.parentMaterialId;
        if (parentsParent) {
          throw new BadRequestException(
            `Material ${parentId} already hangs under another, so nothing can hang under it`
          );
        }
      };

      const materialUpdates = dto.modules.flatMap((moduleItem) =>
        (moduleItem.materials ?? [])
          .map((materialItem) => {
            const current = currentMaterialById.get(materialItem.id);
            /** Omitted means "leave the lesson alone"; null means "detach". */
            const parentGiven = materialItem.parent_material_id !== undefined;
            const nextParent = parentGiven
              ? materialItem.parent_material_id
              : (current?.parentMaterialId ?? null);

            if (parentGiven && nextParent) {
              checkParent(materialItem.id, nextParent, moduleItem.id);
            }

            const moved =
              !current ||
              current.moduleId !== moduleItem.id ||
              current.orderIndex !== materialItem.order_index ||
              (parentGiven &&
                (current.parentMaterialId ?? null) !== (nextParent ?? null));
            if (!moved) return null;

            return {
              id: materialItem.id,
              moduleId: moduleItem.id,
              orderIndex: materialItem.order_index,
              ...(parentGiven && { parentMaterialId: nextParent ?? null }),
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      );

      if (moduleUpdates.length > 0 || materialUpdates.length > 0) {
        await this.prisma.$transaction(
          async (tx) => {
            for (const moduleItem of moduleUpdates) {
              await tx.courseModule.update({
                where: { id: moduleItem.id },
                data: { orderIndex: moduleItem.order_index },
              });
            }
            for (const materialItem of materialUpdates) {
              await tx.courseMaterial.update({
                where: { id: materialItem.id },
                data: {
                  moduleId: materialItem.moduleId,
                  orderIndex: materialItem.orderIndex,
                  ...("parentMaterialId" in materialItem && {
                    parentMaterialId: materialItem.parentMaterialId,
                  }),
                },
              });
            }
          },
          { timeout: 20000, maxWait: 10000 }
        );
      }

      return this.prisma.courseModule.findMany({
        where: { courseId },
        orderBy: { orderIndex: "asc" },
        include: {
          materials: {
            orderBy: { orderIndex: "asc" },
            include: {
              attachments: { orderBy: { orderIndex: "asc" } },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw this.mapError(error);
    }
  }

  async delete(courseId: string, moduleId: string) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      await this.prisma.courseModule.delete({
        where: { id: moduleId },
      });
      return { deleted: true, id: moduleId };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new BadRequestException(message);
  }
}
