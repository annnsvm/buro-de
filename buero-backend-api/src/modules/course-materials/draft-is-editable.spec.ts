import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CourseMaterialType } from "../../generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "./course-material.service";

/**
 * A material nobody can see yet is still the teacher's to change and to throw away.
 *
 * This is the regression it guards. Hiding drafts from students was done by filtering the
 * read, and `update` and `delete` happened to check existence through that same read - so
 * the moment drafts existed, the rows most likely to need correcting or deleting were the
 * only ones that could not be. The editor answered "Матеріал не знайдено" for a practice
 * sitting in front of her in the list.
 *
 * Editing and deleting are the teacher's own acts, already behind the roles guard. They
 * ask whether the material exists, never whether a student may read it.
 */
const COURSE = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const MODULE = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";
const DRAFT = "ce6429a2-3468-4d02-96cc-9d069e4383d1";

describe("a draft material", () => {
  let service: CourseMaterialService;
  let prisma: {
    courseModule: { findFirst: jest.Mock };
    courseMaterial: {
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      courseModule: { findFirst: jest.fn().mockResolvedValue({ id: MODULE }) },
      courseMaterial: {
        /** A draft: it is there, and `published_at` is null. */
        findFirst: jest.fn().mockResolvedValue({
          id: DRAFT,
          moduleId: MODULE,
          type: CourseMaterialType.practice,
          title: "2.3 - Mir gefällt das!",
          content: {},
          publishedAt: null,
        }),
        update: jest.fn().mockResolvedValue({ id: DRAFT, title: "Renamed" }),
        delete: jest.fn().mockResolvedValue({ id: DRAFT }),
      },
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        CourseMaterialService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();
    service = mod.get(CourseMaterialService);
  });

  /** The exact failure reported: deleting an unpublished practice. */
  it("can be deleted", async () => {
    await expect(service.delete(COURSE, MODULE, DRAFT)).resolves.toMatchObject({
      deleted: true,
      id: DRAFT,
    });
    expect(prisma.courseMaterial.delete).toHaveBeenCalledWith({ where: { id: DRAFT } });
  });

  it("can be renamed", async () => {
    await expect(
      service.update(COURSE, MODULE, DRAFT, { title: "Renamed" }),
    ).resolves.toBeDefined();
    expect(prisma.courseMaterial.update).toHaveBeenCalled();
  });

  /**
   * Neither act may ask about publication. Asserted on the query rather than on the
   * outcome, because a filter that happened to match today would reintroduce the bug the
   * first time a draft was involved.
   */
  it("is looked up without asking whether students can see it", async () => {
    await service.delete(COURSE, MODULE, DRAFT);
    await service.update(COURSE, MODULE, DRAFT, { title: "Renamed" });

    const lookups = prisma.courseMaterial.findFirst.mock.calls.map(
      (call) => call[0].where as Record<string, unknown>,
    );
    expect(lookups.length).toBeGreaterThanOrEqual(2);
    for (const where of lookups) {
      expect(where).not.toHaveProperty("publishedAt");
    }
  });

  it("is still refused when it belongs to another module", async () => {
    prisma.courseMaterial.findFirst.mockResolvedValue(null);

    await expect(service.delete(COURSE, MODULE, DRAFT)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.courseMaterial.delete).not.toHaveBeenCalled();
  });

  /** And a student still cannot read it, which is the whole reason for the filter. */
  it("stays unreadable for a student", async () => {
    await service.findOne(COURSE, MODULE, DRAFT).catch(() => undefined);

    expect(prisma.courseMaterial.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ publishedAt: { not: null } }),
      }),
    );
  });
});
