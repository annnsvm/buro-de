import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { PrismaService } from "../../prisma/prisma.service";
import { QuestionEditorService } from "./question-editor.service";

/**
 * Letting a whole module out at once, which is the act that matches an import.
 *
 * A CSV brings in eight practices together, each with its questions, its texts and its
 * recordings. Before this, the questions waited for the teacher but the materials did not -
 * so the moment she uploaded, a student's lesson list filled with empty practices and the
 * course looked broken rather than unfinished. Publishing them one block at a time would
 * have been two dozen button presses to release a single upload.
 */
const COURSE = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const MODULE = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";

describe("publishing a whole module", () => {
  let service: QuestionEditorService;
  let prisma: {
    courseModule: { findFirst: jest.Mock };
    courseMaterial: { updateMany: jest.Mock };
    question: { updateMany: jest.Mock };
    practiceElement: { updateMany: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      courseModule: { findFirst: jest.fn().mockResolvedValue({ id: MODULE }) },
      courseMaterial: { updateMany: jest.fn().mockResolvedValue({ count: 8 }) },
      question: { updateMany: jest.fn().mockResolvedValue({ count: 191 }) },
      practiceElement: { updateMany: jest.fn().mockResolvedValue({ count: 43 }) },
      $transaction: jest.fn((calls: Promise<unknown>[]) => Promise.all(calls)),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionEditorService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        /** Only the audio upload touches it, and publishing moves no files. */
        {
          provide: CloudinaryService,
          useValue: {} as unknown as CloudinaryService,
        },
      ],
    }).compile();
    service = mod.get(QuestionEditorService);
  });

  it("reports everything that became visible", async () => {
    await expect(service.publishModule(COURSE, MODULE)).resolves.toMatchObject({
      materials: 8,
      questions: 191,
      elements: 43,
    });
  });

  /**
   * The materials themselves, which is the whole point. Publishing the questions of a
   * material a student cannot reach publishes nothing anyone can find.
   */
  it("publishes the draft materials of the module", async () => {
    await service.publishModule(COURSE, MODULE);

    expect(prisma.courseMaterial.updateMany).toHaveBeenCalledWith({
      where: { moduleId: MODULE, publishedAt: null },
      data: { publishedAt: expect.any(Date) },
    });
  });

  it("publishes the questions and the texts of those materials", async () => {
    await service.publishModule(COURSE, MODULE);

    for (const table of [prisma.question, prisma.practiceElement]) {
      expect(table.updateMany).toHaveBeenCalledWith({
        where: { publishedAt: null, material: { moduleId: MODULE } },
        data: { publishedAt: expect.any(Date) },
      });
    }
  });

  /**
   * Only the drafts. A material published three weeks ago keeps the date it actually
   * appeared, so the next import cannot rewrite the history of what students already had.
   */
  it("leaves anything already published alone", async () => {
    await service.publishModule(COURSE, MODULE);

    for (const call of [
      prisma.courseMaterial.updateMany,
      prisma.question.updateMany,
      prisma.practiceElement.updateMany,
    ]) {
      expect(call.mock.calls[0][0].where).toMatchObject({ publishedAt: null });
    }
  });

  it("gives every draft in the module the same timestamp", async () => {
    await service.publishModule(COURSE, MODULE);

    const dates = [
      prisma.courseMaterial.updateMany,
      prisma.question.updateMany,
      prisma.practiceElement.updateMany,
    ].map((call) => (call.mock.calls[0][0].data.publishedAt as Date).getTime());

    expect(new Set(dates).size).toBe(1);
  });

  it("publishes all three together or not at all", async () => {
    await service.publishModule(COURSE, MODULE);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  /** A module id from another course must not publish anything. */
  it("refuses a module that does not belong to the course", async () => {
    prisma.courseModule.findFirst.mockResolvedValue(null);

    await expect(service.publishModule(COURSE, MODULE)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.courseMaterial.updateMany).not.toHaveBeenCalled();
  });
});
