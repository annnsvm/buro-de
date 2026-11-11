import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseModuleService } from "./course-module.service";

describe("CourseModuleService", () => {
  let service: CourseModuleService;
  let prisma: {
    course: { findUnique: jest.Mock };
    courseModule: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUniqueOrThrow: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    courseMaterial: { update: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock };
    $transaction: jest.Mock;
  };

  const courseId = "cccccccc-cccc-cccc-cccc-cccccccccccc";
  const moduleId = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";

  beforeEach(async () => {
    prisma = {
      course: { findUnique: jest.fn() },
      courseModule: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      courseMaterial: { update: jest.fn() },
      userCourseAccess: { findUnique: jest.fn() },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseModuleService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(CourseModuleService);
  });

  describe("assertCanAccessCourse", () => {
    it("throws NotFound when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.assertCanAccessCourse("u1", Role.teacher, courseId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("allows teacher without access row", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      await expect(
        service.assertCanAccessCourse("u1", Role.teacher, courseId),
      ).resolves.toBeUndefined();
    });

    it("forbids student without access", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);
      await expect(
        service.assertCanAccessCourse("u1", Role.student, courseId),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("findAllByCourseId", () => {
    it("throws when course not found", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.findAllByCourseId(courseId, "u1", Role.teacher),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("returns all modules for teacher", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.courseModule.findMany.mockResolvedValue([
        { id: moduleId, courseId, title: "M1", orderIndex: 0 },
      ]);

      const list = await service.findAllByCourseId(
        courseId,
        "u1",
        Role.teacher,
      );
      expect(list).toHaveLength(1);
      expect(prisma.courseModule.findMany).toHaveBeenCalledWith({
        where: { courseId },
        orderBy: { orderIndex: "asc" },
      });
    });

    it("trial student sees the two opening modules", async () => {
      const secondModuleId = "mod-second";
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });
      // First call resolves the trial scope, the second returns those modules.
      prisma.courseModule.findMany
        .mockResolvedValueOnce([{ id: moduleId }, { id: secondModuleId }])
        .mockResolvedValueOnce([
          { id: moduleId, courseId, title: "Instructions", orderIndex: 0 },
          { id: secondModuleId, courseId, title: "First", orderIndex: 1 },
        ]);

      const list = await service.findAllByCourseId(
        courseId,
        "stu",
        Role.student,
      );
      expect(list).toHaveLength(2);
      expect(prisma.courseModule.findMany).toHaveBeenLastCalledWith({
        where: { courseId, id: { in: [moduleId, secondModuleId] } },
        orderBy: { orderIndex: "asc" },
      });
    });

    /**
     * The course that sells from its first module. Before the trial count belonged to the
     * course this could not happen, and the code read an empty scope as "nothing to
     * restrict" - which would list the whole course to anyone who had merely registered.
     */
    it("trial student sees nothing when the course opens no modules", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        trialModuleCount: 0,
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });
      prisma.courseModule.findMany.mockResolvedValue([]);

      const list = await service.findAllByCourseId(courseId, "stu", Role.student);

      expect(list).toEqual([]);
      expect(prisma.courseModule.findMany).toHaveBeenLastCalledWith({
        where: { courseId, id: { in: [] } },
        orderBy: { orderIndex: "asc" },
      });
    });

    it("trial student sees only the one module a short course opens", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        trialModuleCount: 1,
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });
      prisma.courseModule.findMany
        .mockResolvedValueOnce([{ id: moduleId }])
        .mockResolvedValueOnce([
          { id: moduleId, courseId, title: "Instructions", orderIndex: 0 },
        ]);

      const list = await service.findAllByCourseId(courseId, "stu", Role.student);

      expect(list).toHaveLength(1);
      expect(prisma.courseModule.findMany).toHaveBeenLastCalledWith({
        where: { courseId, id: { in: [moduleId] } },
        orderBy: { orderIndex: "asc" },
      });
    });
  });

  describe("findOne", () => {
    it("throws when module not in course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.findOne(courseId, moduleId, "u1", Role.teacher),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("returns module for teacher", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseModule.findUniqueOrThrow.mockResolvedValue({
        id: moduleId,
        courseId,
        title: "M",
        orderIndex: 0,
      });

      const row = await service.findOne(courseId, moduleId, "u1", Role.teacher);
      expect(row.id).toBe(moduleId);
    });
  });

  describe("create", () => {
    it("throws when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.create(courseId, { title: "A", order_index: 0 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("creates module in course", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.courseModule.create.mockResolvedValue({
        id: moduleId,
        courseId,
        title: "A",
        orderIndex: 1,
      });

      const out = await service.create(courseId, {
        title: "A",
        order_index: 1,
      });
      expect(prisma.courseModule.create).toHaveBeenCalledWith({
        data: { courseId, title: "A", orderIndex: 1 },
      });
      expect(out.title).toBe("A");
    });
  });

  describe("update", () => {
    it("throws when module wrong course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.update(courseId, moduleId, { title: "X" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseModule.update.mockResolvedValue({
        id: moduleId,
        title: "New",
        orderIndex: 2,
      });

      await service.update(courseId, moduleId, {
        title: "New",
        order_index: 2,
      });
      expect(prisma.courseModule.update).toHaveBeenCalledWith({
        where: { id: moduleId },
        data: { title: "New", orderIndex: 2 },
      });
    });
  });


  /**
   * Moving a practice between lessons.
   *
   * The author reported that practices could not be dragged at all. The order was being
   * saved, but the list is drawn as a tree and puts every practice back under the lesson in
   * its `parentMaterialId`, so the row sprang back. The order was never the thing to change
   * here - the lesson was - and so the payload now carries it.
   */
  describe("reorderStructure: which lesson a practice hangs under", () => {
    const otherModuleId = "nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn";
    const lessonOne = "11111111-1111-1111-1111-111111111111";
    const lessonTwo = "22222222-2222-2222-2222-222222222222";
    const practice = "33333333-3333-3333-3333-333333333333";
    const faraway = "44444444-4444-4444-4444-444444444444";

    /** One module with two lessons and a practice on the first, plus a lesson elsewhere. */
    const tree = () => [
      {
        id: moduleId,
        orderIndex: 0,
        materials: [
          {
            id: lessonOne,
            orderIndex: 0,
            moduleId,
            parentMaterialId: null,
            type: "video",
          },
          {
            id: practice,
            orderIndex: 1,
            moduleId,
            parentMaterialId: lessonOne,
            type: "practice",
          },
          {
            id: lessonTwo,
            orderIndex: 2,
            moduleId,
            parentMaterialId: null,
            type: "video",
          },
        ],
      },
      {
        id: otherModuleId,
        orderIndex: 1,
        materials: [
          {
            id: faraway,
            orderIndex: 0,
            moduleId: otherModuleId,
            parentMaterialId: null,
            type: "video",
          },
        ],
      },
    ];

    const rows = (
      items: { id: string; order_index: number; parent_material_id?: string | null }[],
    ) => ({
      modules: [{ id: moduleId, order_index: 0, materials: items }],
    });

    beforeEach(() => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.courseModule.findMany.mockResolvedValue(tree());
      prisma.$transaction.mockImplementation(
        async (fn: (tx: unknown) => Promise<void>) => fn(prisma),
      );
    });

    it("writes the new lesson when a practice is moved to another", async () => {
      await service.reorderStructure(
        courseId,
        rows([
          { id: lessonOne, order_index: 0 },
          { id: lessonTwo, order_index: 1 },
          { id: practice, order_index: 2, parent_material_id: lessonTwo },
        ]),
      );

      expect(prisma.courseMaterial.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: practice },
          data: expect.objectContaining({ parentMaterialId: lessonTwo }),
        }),
      );
    });

    it("detaches a practice when the lesson is given as null", async () => {
      await service.reorderStructure(
        courseId,
        rows([
          { id: lessonOne, order_index: 0 },
          { id: practice, order_index: 1, parent_material_id: null },
        ]),
      );

      expect(prisma.courseMaterial.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: practice },
          data: expect.objectContaining({ parentMaterialId: null }),
        }),
      );
    });

    /** Order alone must not quietly rewrite a lesson the author never touched. */
    it("leaves the lesson alone when the payload omits it", async () => {
      await service.reorderStructure(
        courseId,
        rows([
          { id: practice, order_index: 0 },
          { id: lessonOne, order_index: 1 },
        ]),
      );

      const calls = prisma.courseMaterial.update.mock.calls as {
        0: { where: { id: string }; data: Record<string, unknown> };
      }[];
      const forPractice = calls.find((call) => call[0].where.id === practice);
      expect(forPractice).toBeDefined();
      expect(forPractice![0].data).not.toHaveProperty("parentMaterialId");
    });

    it("refuses a lesson that is in a different module", async () => {
      await expect(
        service.reorderStructure(
          courseId,
          rows([{ id: practice, order_index: 0, parent_material_id: faraway }]),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.courseMaterial.update).not.toHaveBeenCalled();
    });

    it("refuses a material hung under itself", async () => {
      await expect(
        service.reorderStructure(
          courseId,
          rows([{ id: practice, order_index: 0, parent_material_id: practice }]),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    /** The list draws one level, so a practice under a practice has nowhere to be drawn. */
    it("refuses hanging one practice under another", async () => {
      await expect(
        service.reorderStructure(
          courseId,
          rows([
            { id: lessonOne, order_index: 0 },
            { id: practice, order_index: 1, parent_material_id: lessonOne },
            {
              id: lessonTwo,
              order_index: 2,
              parent_material_id: practice,
            },
          ]),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("refuses a lesson that is not in this course at all", async () => {
      await expect(
        service.reorderStructure(
          courseId,
          rows([
            {
              id: practice,
              order_index: 0,
              parent_material_id: "99999999-9999-9999-9999-999999999999",
            },
          ]),
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("delete", () => {
    it("throws when module wrong course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(service.delete(courseId, moduleId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("deletes module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseModule.delete.mockResolvedValue({});

      const out = await service.delete(courseId, moduleId);
      expect(out).toEqual({ deleted: true, id: moduleId });
      expect(prisma.courseModule.delete).toHaveBeenCalledWith({
        where: { id: moduleId },
      });
    });
  });
});
