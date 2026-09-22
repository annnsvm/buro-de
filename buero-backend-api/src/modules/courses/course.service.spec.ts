import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Language, Level, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { PaymentFulfillmentService } from "../subscriptions/payment-fulfillment.service";
import { UserService } from "../user/user.service";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import {
  ListCoursesQueryDto,
  PublicationStatus,
} from "./dto/list-courses-query.dto";

describe("CourseService", () => {
  let service: CourseService;
  let prisma: {
    course: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      aggregate: jest.Mock;
    };
    courseModule: { findMany: jest.Mock };
    courseMaterial: { groupBy: jest.Mock; findMany: jest.Mock };
    materialAttachment: { findMany: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock };
    $queryRaw: jest.Mock;
  };
  const courseRow = (over: Record<string, unknown> = {}) => ({
    id: "course-1",
    teacherId: null,
    title: "Test Course",
    description: "Desc",
    language: "en",
    isPublished: true,
    price: { toString: () => "19.99" },
    tags: ["Language"],
    level: "A1",
    durationHours: 10,
    imageUrl: null,
    stripeProductId: null,
    stripePriceId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  });

  beforeEach(async () => {
    prisma = {
      course: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _max: { orderIndex: null } }),
      },
      courseModule: { findMany: jest.fn().mockResolvedValue([]) },
      courseMaterial: { groupBy: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
      materialAttachment: { findMany: jest.fn().mockResolvedValue([]) },
      userCourseAccess: { findUnique: jest.fn() },
      $queryRaw: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: ConfigService, useValue: { get: jest.fn(() => "eur") } },
        { provide: UserService, useValue: { findUserById: jest.fn() } },
        {
          provide: CloudinaryService,
          useValue: { uploadImage: jest.fn() },
        },
        {
          provide: PaymentFulfillmentService,
          useValue: { reconcilePendingForUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(CourseService);
    (
      service as unknown as { clearCourseCaches: () => void }
    ).clearCourseCaches();
  });

  describe("findAll", () => {
    beforeEach(() => {
      prisma.$queryRaw.mockResolvedValue([]);
      (
        service as unknown as { clearCourseCaches: () => void }
      ).clearCourseCaches();
    });

    it("filters published only by default (catalog)", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublished: true }),
        }),
      );
    });

    it("filters unpublished when requested", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        publicationFilter: PublicationStatus.unpublished,
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublished: false }),
        }),
      );
    });

    it("does not set isPublished when publicationFilter is all", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      await service.findAll(undefined, { publicationFilter: PublicationStatus.all });
      const arg = prisma.course.findMany.mock.calls[0][0];
      expect(arg.where.isPublished).toBeUndefined();
    });

    it("applies search, language, level, tags", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      const q: ListCoursesQueryDto = {
        search: "  German  ",
        language: Language.de,
        level: Level.B1,
        tags: "A, B",
      };
      await service.findAll(q, { publicationFilter: PublicationStatus.all });
      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: {
          language: Language.de,
          level: Level.B1,
          OR: [
            { title: { contains: "German", mode: "insensitive" } },
            { description: { contains: "German", mode: "insensitive" } },
          ],
          tags: { hasSome: ["A", "B"] },
        },
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
      });
    });

    it("adds videoLessonCount from groupBy", async () => {
      prisma.course.findMany.mockResolvedValue([courseRow({ id: "c1" })]);
      prisma.$queryRaw.mockResolvedValue([
        { course_id: "c1", lessons: 3, videos: 3 },
      ]);

      const list = await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(list[0].videoLessonCount).toBe(3);
      expect(list[0].lessonsCount).toBe(3);
      expect(list[0].avgVideoLessonMinutes).toBeNull();
      expect((list[0] as unknown as { price: number }).price).toBeCloseTo(
        19.99,
        2,
      );
    });

    it("does not load video content JSON for catalog averages", async () => {
      prisma.course.findMany.mockResolvedValue([courseRow({ id: "c1" })]);
      prisma.$queryRaw.mockResolvedValue([
        { course_id: "c1", lessons: 2, videos: 2 },
      ]);

      const list = await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(prisma.courseMaterial.findMany).not.toHaveBeenCalled();
      expect(list[0].avgVideoLessonMinutes).toBeNull();
    });
  });

  describe("findById", () => {
    it("throws NotFoundException when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.findById("missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("returns serialized course with modules when no userId", async () => {
      prisma.course.findUnique.mockResolvedValue(courseRow());
      prisma.courseModule.findMany.mockResolvedValue([]);
      const result = await service.findById("course-1", true);
      expect(result).toMatchObject({
        id: "course-1",
        title: "Test Course",
        image_url: null,
      });
      expect((result as { modules?: unknown }).modules).toEqual([]);
    });

    it("adds my_access when user has course access", async () => {
      const modId = "mod-first";
      prisma.course.findUnique.mockResolvedValue(courseRow());
      prisma.courseModule.findMany.mockResolvedValue([
        { id: modId, orderIndex: 0 },
      ]);
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });

      const result = await service.findById("course-1", true, {
        id: "user-1",
        role: Role.student,
      });
      expect(result).toMatchObject({
        my_access: expect.objectContaining({
          access_type: "trial",
          first_module_id: modId,
        }),
      });
    });
  });

  describe("findById content access", () => {
    const FIRST = "mod-1";
    const SECOND = "mod-2";

    /** Two modules, one quiz material each, so locking can be observed per module. */
    const arrangeTree = () => {
      prisma.course.findUnique.mockResolvedValue(courseRow());
      prisma.courseModule.findMany.mockResolvedValue([
        { id: FIRST, orderIndex: 0 },
        { id: SECOND, orderIndex: 1 },
      ]);
      prisma.courseMaterial.findMany.mockResolvedValue([
        {
          id: "mat-1",
          moduleId: FIRST,
          type: "quiz",
          title: "Check 1",
          orderIndex: 0,
          content: {
            duration: "05:00",
            questions: [{ id: "q1", text: "Warum?", correct: "a" }],
          },
        },
        {
          id: "mat-2",
          moduleId: SECOND,
          type: "video",
          title: "Lesson 2",
          orderIndex: 0,
          content: { youtube_video_id: "secret", duration: "07:30" },
        },
      ]);
    };

    type Material = {
      id: string;
      locked: boolean;
      duration: string | null;
      content: Record<string, unknown> | null;
    };
    const materialsOf = (result: unknown): Material[] =>
      (result as { modules: Array<{ materials: Material[] }> }).modules.flatMap(
        (mod) => mod.materials,
      );

    it("gives a guest the structure but no content at all", async () => {
      arrangeTree();

      const materials = materialsOf(await service.findById("course-1", true));

      expect(materials).toHaveLength(2);
      expect(materials.every((mat) => mat.content === null)).toBe(true);
      expect(materials.every((mat) => mat.locked)).toBe(true);
      // Duration is showcase data and survives the lock so the lesson list stays useful.
      expect(materials.map((mat) => mat.duration)).toEqual(["05:00", "07:30"]);
    });

    it("hides the answer key from a student who owns the course", async () => {
      arrangeTree();
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "purchase",
        trialEndsAt: null,
      });

      const materials = materialsOf(
        await service.findById("course-1", true, {
          id: "user-1",
          role: Role.student,
        }),
      );
      const questions = (
        materials[0].content as { questions: Array<Record<string, unknown>> }
      ).questions;

      expect(materials[0].locked).toBe(false);
      expect(questions[0]).toHaveProperty("text", "Warum?");
      expect(questions[0]).not.toHaveProperty("correct");
    });

    it("keeps the answer key for a teacher so the editor can prefill it", async () => {
      arrangeTree();

      const materials = materialsOf(
        await service.findById("course-1", true, {
          id: "teacher-1",
          role: Role.teacher,
        }),
      );
      const questions = (
        materials[0].content as { questions: Array<Record<string, unknown>> }
      ).questions;

      expect(prisma.userCourseAccess.findUnique).toHaveBeenCalled();
      expect(questions[0]).toHaveProperty("correct", "a");
    });

    it("unlocks the two opening modules during a live trial", async () => {
      arrangeTree();
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });

      const result = await service.findById("course-1", true, {
        id: "user-1",
        role: Role.student,
      });

      // Module 0 carries the course instructions, module 1 the first real lessons.
      expect(materialsOf(result).every((mat) => mat.locked === false)).toBe(true);
      expect(result).toMatchObject({
        my_access: expect.objectContaining({
          trial_module_ids: [FIRST, SECOND],
          first_module_id: FIRST,
        }),
      });
    });

    it("locks the third module during a trial", async () => {
      prisma.course.findUnique.mockResolvedValue(courseRow());
      prisma.courseModule.findMany.mockResolvedValue([
        { id: FIRST, orderIndex: 0 },
        { id: SECOND, orderIndex: 1 },
        { id: "mod-3", orderIndex: 2 },
      ]);
      prisma.courseMaterial.findMany.mockResolvedValue([
        {
          id: "mat-3",
          moduleId: "mod-3",
          type: "video",
          title: "Lesson 3",
          orderIndex: 0,
          content: { youtube_video_id: "paid", duration: "09:00" },
        },
      ]);
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });

      const materials = materialsOf(
        await service.findById("course-1", true, {
          id: "user-1",
          role: Role.student,
        }),
      );

      expect(materials).toHaveLength(1);
      expect(materials[0].locked).toBe(true);
      expect(materials[0].content).toBeNull();
    });

    it("keeps a trial open even when an old end date is still stored", async () => {
      arrangeTree();
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2000-01-01"),
      });

      const materials = materialsOf(
        await service.findById("course-1", true, {
          id: "user-1",
          role: Role.student,
        }),
      );

      // Trials are a standing free tier; rows written before that decision must not lock out.
      expect(materials.every((mat) => mat.locked === false)).toBe(true);
    });

    it("hides an unpublished course from everyone but a teacher", async () => {
      prisma.course.findUnique.mockResolvedValue(
        courseRow({ isPublished: false }),
      );
      prisma.courseModule.findMany.mockResolvedValue([]);

      await expect(service.findById("course-1", true)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(
        service.findById("course-1", true, {
          id: "teacher-1",
          role: Role.teacher,
        }),
      ).resolves.toMatchObject({ id: "course-1" });
    });
  });

  describe("create", () => {
    it("creates course and returns serialized row", async () => {
      prisma.course.create.mockResolvedValue(
        courseRow({ title: "New", price: null, isPublished: false }),
      );

      const dto: CreateCourseDto = {
        title: "New",
        language: Language.en,
        is_published: false,
      };
      const out = await service.create(dto);

      expect(prisma.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "New",
          language: Language.en,
          isPublished: false,
        }),
      });
      expect(out.title).toBe("New");
      expect(out.price).toBeNull();
    });
  });

  describe("update", () => {
    it("throws NotFoundException when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.update("x", { title: "y" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates fields of an already published course", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: "c1",
        title: "Old",
        price: { toString: () => "10" },
        isPublished: true,
      });
      prisma.course.update.mockResolvedValue(
        courseRow({ title: "Updated", isPublished: true }),
      );

      const out = await service.update("c1", { title: "Updated" });

      expect(out.title).toBe("Updated");
    });

    it("publishes a course with a price without any external calls", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: "c1",
        title: "Sell me",
        price: null,
        isPublished: false,
      });
      prisma.course.update.mockResolvedValue(
        courseRow({ isPublished: true, price: { toString: () => "25" } }),
      );

      const out = await service.update("c1", { is_published: true, price: 25 });

      expect(prisma.course.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "c1" },
          data: expect.objectContaining({ isPublished: true, price: 25 }),
        }),
      );
      expect(out.price).toBe(25);
    });
  });

  describe("delete", () => {
    it("throws when course not found", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.delete("nope")).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.course.delete).not.toHaveBeenCalled();
    });

    it("deletes after findById succeeds", async () => {
      prisma.course.findUnique.mockResolvedValue({ ...courseRow(), modules: [] });
      prisma.course.delete.mockResolvedValue({});

      const out = await service.delete("course-1");
      expect(out).toEqual({ deleted: true, id: "course-1" });
      expect(prisma.course.delete).toHaveBeenCalledWith({
        where: { id: "course-1" },
      });
    });
  });

  describe("mapPrismaError", () => {
    it("wraps unknown errors as BadRequestException", async () => {
      prisma.course.findMany.mockRejectedValue(new Error("db down"));
      await expect(
        service.findAll(undefined, { publicationFilter: PublicationStatus.all }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
