import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CourseMaterialType, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { QuestionSyncService } from "../exercises/question-sync.service";
import { CourseMaterialService } from "./course-material.service";

describe("CourseMaterialService", () => {
  let service: CourseMaterialService;
  let questionSync: { syncMaterial: jest.Mock };
  let prisma: {
    course: { findUnique: jest.Mock };
    courseModule: { findFirst: jest.Mock; findMany: jest.Mock };
    courseMaterial: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    userCourseAccess: { findUnique: jest.Mock };
  };

  const courseId = "cccccccc-cccc-cccc-cccc-cccccccccccc";
  const moduleId = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";
  const materialId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

  beforeEach(async () => {
    prisma = {
      course: { findUnique: jest.fn() },
      courseModule: { findFirst: jest.fn(), findMany: jest.fn() },
      courseMaterial: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userCourseAccess: { findUnique: jest.fn() },
    };

    questionSync = { syncMaterial: jest.fn().mockResolvedValue(0) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseMaterialService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: QuestionSyncService,
          useValue: questionSync as unknown as QuestionSyncService,
        },
      ],
    }).compile();

    service = module.get(CourseMaterialService);
  });

  describe("courseId / moduleId validation", () => {
    it("findAllByModuleId throws when module not in course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.findAllByModuleId(courseId, moduleId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("findOne throws when material not in module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue(null);
      await expect(
        service.findOne(courseId, moduleId, materialId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("create throws when module belongs to another course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.create(courseId, moduleId, {
          type: CourseMaterialType.video,
          title: "L1",
          content: { youtube_video_id: "x" },
          order_index: 0,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("findAllByModuleId", () => {
    it("returns ordered materials", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findMany.mockResolvedValue([
        {
          id: materialId,
          moduleId,
          type: "video",
          title: "V1",
          content: {},
          orderIndex: 0,
        },
      ]);

      const list = await service.findAllByModuleId(courseId, moduleId);
      expect(list).toHaveLength(1);
      expect(prisma.courseMaterial.findMany).toHaveBeenCalledWith({
        where: { moduleId },
        orderBy: { orderIndex: "asc" },
        include: { attachments: { orderBy: { orderIndex: "asc" } } },
      });
    });
  });

  describe("findOne", () => {
    it("returns material when found", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue({
        id: materialId,
        moduleId,
        type: "text",
        title: "T",
        content: {},
        orderIndex: 0,
      });

      const row = await service.findOne(courseId, moduleId, materialId);
      expect(row.id).toBe(materialId);
    });
  });

  describe("create", () => {
    it("creates material in module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.create.mockResolvedValue({
        id: materialId,
        moduleId,
        type: CourseMaterialType.video,
        title: "Intro",
        content: { youtube_video_id: "abc" },
        orderIndex: 0,
      });

      const dto = {
        type: CourseMaterialType.video,
        title: "Intro",
        content: { youtube_video_id: "abc" },
        order_index: 0,
      };
      const out = await service.create(courseId, moduleId, dto);
      expect(prisma.courseMaterial.create).toHaveBeenCalledWith({
        data: {
          moduleId,
          type: CourseMaterialType.video,
          title: "Intro",
          content: { youtube_video_id: "abc" },
          orderIndex: 0,
        },
      });
      expect(out.title).toBe("Intro");
    });

    it("rebuilds the questions table for the saved material", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      const content = { questions: [{ id: "q1", text: "?", correct: "a" }] };
      prisma.courseMaterial.create.mockResolvedValue({
        id: materialId,
        moduleId,
        type: CourseMaterialType.quiz,
        title: "Check",
        content,
        orderIndex: 0,
      });

      await service.create(courseId, moduleId, {
        type: CourseMaterialType.quiz,
        title: "Check",
        content,
        order_index: 0,
      });

      expect(questionSync.syncMaterial).toHaveBeenCalledWith(materialId, content);
    });

    it("clears the questions of a material that is not a quiz", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.create.mockResolvedValue({
        id: materialId,
        moduleId,
        type: CourseMaterialType.video,
        title: "Intro",
        content: { youtube_video_id: "abc" },
        orderIndex: 0,
      });

      await service.create(courseId, moduleId, {
        type: CourseMaterialType.video,
        title: "Intro",
        content: { youtube_video_id: "abc" },
        order_index: 0,
      });

      expect(questionSync.syncMaterial).toHaveBeenCalledWith(materialId, null);
    });
  });

  describe("update", () => {
    it("throws when material missing", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue(null);
      await expect(
        service.update(courseId, moduleId, materialId, { title: "x" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates material", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue({ id: materialId });
      prisma.courseMaterial.update.mockResolvedValue({
        id: materialId,
        title: "New title",
      });

      await service.update(courseId, moduleId, materialId, {
        title: "New title",
      });
      expect(prisma.courseMaterial.update).toHaveBeenCalledWith({
        where: { id: materialId },
        data: { title: "New title" },
      });
    });
  });

  describe("delete", () => {
    it("deletes after findOne", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue({ id: materialId });
      prisma.courseMaterial.delete.mockResolvedValue({});

      const out = await service.delete(courseId, moduleId, materialId);
      expect(out).toEqual({ deleted: true, id: materialId });
    });
  });

  describe("assertCanAccessModule", () => {
    /** Module 0 holds the course instructions, module 1 the first real lessons. */
    const arrangeTrial = (trialEndsAt: Date) => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt,
      });
      prisma.courseModule.findMany.mockResolvedValue([
        { id: "mod-0" },
        { id: "mod-1" },
      ]);
    };
    const anyDate = new Date("2099-01-01");

    it("allows both opening modules during a trial", async () => {
      arrangeTrial(anyDate);

      await expect(
        service.assertCanAccessModule("stu", Role.student, courseId, "mod-0"),
      ).resolves.toBeUndefined();
      await expect(
        service.assertCanAccessModule("stu", Role.student, courseId, "mod-1"),
      ).resolves.toBeUndefined();
    });

    it("forbids a later module during a trial", async () => {
      arrangeTrial(anyDate);

      await expect(
        service.assertCanAccessModule("stu", Role.student, courseId, "mod-2"),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("still allows the opening modules when an old end date is stored", async () => {
      arrangeTrial(new Date("2000-01-01"));

      await expect(
        service.assertCanAccessModule("stu", Role.student, courseId, "mod-0"),
      ).resolves.toBeUndefined();
    });
  });

  describe("assertCanAccessCourse", () => {
    it("allows teacher without DB access row", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      await expect(
        service.assertCanAccessCourse("t1", Role.teacher, courseId),
      ).resolves.toBeUndefined();
      expect(prisma.userCourseAccess.findUnique).not.toHaveBeenCalled();
    });

    it("forbids student without course access", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);

      await expect(
        service.assertCanAccessCourse("stu", Role.student, courseId),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("allows a student whose trial row carries an old end date", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2000-01-01"),
      });

      // Trials are a standing free tier; a stored date must not revoke access.
      await expect(
        service.assertCanAccessCourse("stu", Role.student, courseId),
      ).resolves.toBeUndefined();
    });
  });
});

