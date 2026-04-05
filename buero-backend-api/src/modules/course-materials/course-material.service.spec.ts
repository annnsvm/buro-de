import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CourseMaterialType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCourseMaterialDto } from "./dto/create-course-material.dto";
import { CourseMaterialService } from "./course-material.service";

const courseId = "c1000000-0000-0000-0000-000000000001";
const moduleId = "m1000000-0000-0000-0000-000000000001";
const materialId = "mat10000-0000-0000-0000-000000000001";
const now = new Date("2026-01-01T12:00:00.000Z");

function materialRow(overrides: Record<string, unknown> = {}) {
  return {
    id: materialId,
    moduleId,
    type: CourseMaterialType.video,
    title: "Lesson 1",
    content: { youtube_video_id: "abc" },
    orderIndex: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("CourseMaterialService", () => {
  let service: CourseMaterialService;
  let prisma: {
    course: { findUnique: jest.Mock };
    courseModule: { findFirst: jest.Mock };
    courseMaterial: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    userCourseAccess: { findUnique: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      course: { findUnique: jest.fn() },
      courseModule: { findFirst: jest.fn() },
      courseMaterial: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userCourseAccess: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseMaterialService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(CourseMaterialService);
  });

  describe("findAllByModuleId (перевірка пари courseId + moduleId)", () => {
    it("повертає матеріали, коли модуль належить курсу", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      const rows = [materialRow()];
      prisma.courseMaterial.findMany.mockResolvedValue(rows);

      const out = await service.findAllByModuleId(courseId, moduleId);
      expect(out).toEqual(rows);
      expect(prisma.courseMaterial.findMany).toHaveBeenCalledWith({
        where: { moduleId },
        orderBy: { orderIndex: "asc" },
      });
      expect(prisma.courseModule.findFirst).toHaveBeenCalledWith({
        where: { id: moduleId, courseId },
      });
    });

    it("404, якщо moduleId не належить courseId", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce(null);
      await expect(service.findAllByModuleId(courseId, moduleId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.courseMaterial.findMany).not.toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("повертає матеріал за id у межах модуля", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      const row = materialRow();
      prisma.courseMaterial.findFirst.mockResolvedValueOnce(row);

      const out = await service.findOne(courseId, moduleId, materialId);
      expect(out).toEqual(row);
      expect(prisma.courseMaterial.findFirst).toHaveBeenCalledWith({
        where: { id: materialId, moduleId },
      });
    });

    it("404, якщо матеріал не знайдено в модулі", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      prisma.courseMaterial.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.findOne(courseId, moduleId, materialId),
      ).rejects.toThrow(NotFoundException);
    });

    it("404, якщо модуль не з курсу", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.findOne(courseId, moduleId, materialId),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.courseMaterial.findFirst).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("створює матеріал у модулі курсу", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      const created = materialRow();
      prisma.courseMaterial.create.mockResolvedValueOnce(created);

      const dto: CreateCourseMaterialDto = {
        type: CourseMaterialType.video,
        title: "New",
        content: { youtube_video_id: "x" },
        order_index: 1,
      };

      const out = await service.create(courseId, moduleId, dto);
      expect(out).toEqual(created);
      expect(prisma.courseMaterial.create).toHaveBeenCalledWith({
        data: {
          moduleId,
          type: dto.type,
          title: dto.title,
          content: dto.content,
          orderIndex: dto.order_index,
        },
      });
    });

    it("404 при невалідній парі courseId/moduleId", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce(null);
      const dto: CreateCourseMaterialDto = {
        type: CourseMaterialType.text,
        title: "T",
        content: {},
        order_index: 0,
      };
      await expect(service.create(courseId, moduleId, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.courseMaterial.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("оновлює після findOne", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      prisma.courseMaterial.findFirst.mockResolvedValueOnce(materialRow());
      const updated = materialRow({ title: "Updated" });
      prisma.courseMaterial.update.mockResolvedValueOnce(updated);

      const out = await service.update(courseId, moduleId, materialId, {
        title: "Updated",
      });
      expect(out.title).toBe("Updated");
      expect(prisma.courseMaterial.update).toHaveBeenCalledWith({
        where: { id: materialId },
        data: { title: "Updated" },
      });
    });

    it("404, якщо матеріал не існує", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      prisma.courseMaterial.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.update(courseId, moduleId, materialId, { title: "X" }),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.courseMaterial.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("видаляє після findOne", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      prisma.courseMaterial.findFirst.mockResolvedValueOnce(materialRow());
      prisma.courseMaterial.delete.mockResolvedValueOnce(materialRow());

      const out = await service.delete(courseId, moduleId, materialId);
      expect(out).toEqual({ deleted: true, id: materialId });
      expect(prisma.courseMaterial.delete).toHaveBeenCalledWith({
        where: { id: materialId },
      });
    });

    it("404 без delete, якщо матеріал не знайдено", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      prisma.courseMaterial.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.delete(courseId, moduleId, materialId),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.courseMaterial.delete).not.toHaveBeenCalled();
    });
  });

  describe("mapError", () => {
    it("findMany кидає BadRequestException", async () => {
      prisma.courseModule.findFirst.mockResolvedValueOnce({
        id: moduleId,
        courseId,
      });
      prisma.courseMaterial.findMany.mockRejectedValueOnce(new Error("db"));
      await expect(service.findAllByModuleId(courseId, moduleId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
