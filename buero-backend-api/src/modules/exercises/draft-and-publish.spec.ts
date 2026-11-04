import { Test, TestingModule } from "@nestjs/testing";
import { PracticeBlock } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { QuestionEditorService } from "./question-editor.service";

/**
 * When work the teacher has done becomes work a student can see.
 *
 * Those used to be the same moment: a CSV of fifty questions was on a student's screen
 * before the teacher had read one of them back. They are now two moments, and the second
 * one is a button.
 *
 * The line the author drew: something new is hidden until she publishes it, and a
 * correction to something already published reaches the student at once. Holding back
 * corrections too would mean keeping two copies of every question, which is a different
 * and much larger machine.
 */
describe("publishing a material", () => {
  const COURSE = "course-1";
  const MODULE = "module-1";
  const MATERIAL = "material-1";

  let service: QuestionEditorService;
  let prisma: {
    courseMaterial: { findFirst: jest.Mock };
    question: { updateMany: jest.Mock; update: jest.Mock; create: jest.Mock; findFirst: jest.Mock };
    practiceElement: { updateMany: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      courseMaterial: {
        findFirst: jest.fn().mockResolvedValue({
          id: MATERIAL,
          type: "practice",
          moduleId: MODULE,
        }),
      },
      question: {
        updateMany: jest.fn().mockResolvedValue({ count: 12 }),
        update: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
      },
      practiceElement: { updateMany: jest.fn().mockResolvedValue({ count: 3 }) },
      $transaction: jest.fn((calls: Promise<unknown>[]) => Promise.all(calls)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionEditorService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: CloudinaryService, useValue: {} },
      ],
    }).compile();

    service = module.get(QuestionEditorService);
  });

  it("reports how much became visible", async () => {
    const result = await service.publish(COURSE, MODULE, MATERIAL);

    expect(result).toMatchObject({ questions: 12, elements: 3 });
    expect(result.published_at).toEqual(expect.any(String));
  });

  /** Texts and recordings are as hidden as questions, and are published with them. */
  it("publishes the texts and recordings too", async () => {
    await service.publish(COURSE, MODULE, MATERIAL);

    expect(prisma.practiceElement.updateMany).toHaveBeenCalledWith({
      where: { materialId: MATERIAL, publishedAt: null },
      data: { publishedAt: expect.any(Date) },
    });
  });

  /**
   * Only what is still hidden. A question published three weeks ago keeps the date it
   * actually appeared, so "when did the student first see this" stays answerable.
   */
  it("leaves the date of anything already published alone", async () => {
    await service.publish(COURSE, MODULE, MATERIAL);

    for (const call of [
      prisma.question.updateMany.mock.calls[0][0],
      prisma.practiceElement.updateMany.mock.calls[0][0],
    ]) {
      expect(call.where.publishedAt).toBeNull();
    }
  });

  /** Both halves or neither: a material half-published is a material in two states. */
  it("publishes the questions and the texts together", async () => {
    await service.publish(COURSE, MODULE, MATERIAL);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  /**
   * The author's own example: five grammar tasks published, then ten reading tasks added.
   * The reading ones wait; the grammar ones are already in front of students and stay
   * there. Publishing is per block so that finishing one does not drag a half-written
   * other onto the screen with it.
   */
  describe("one block at a time", () => {
    it("touches only the block it was asked for", async () => {
      await service.publish(COURSE, MODULE, MATERIAL, PracticeBlock.lesen);

      for (const call of [
        prisma.question.updateMany.mock.calls[0][0],
        prisma.practiceElement.updateMany.mock.calls[0][0],
      ]) {
        expect(call.where).toMatchObject({
          materialId: MATERIAL,
          publishedAt: null,
          block: PracticeBlock.lesen,
        });
      }
    });

    it("says which block it published", async () => {
      const result = await service.publish(
        COURSE,
        MODULE,
        MATERIAL,
        PracticeBlock.horen,
      );

      expect(result.block).toBe(PracticeBlock.horen);
    });

    /** Grammatik already on screen is untouched: it has a date of its own. */
    it("cannot reach a block it was not given", async () => {
      await service.publish(COURSE, MODULE, MATERIAL, PracticeBlock.lesen);

      expect(prisma.question.updateMany.mock.calls[0][0].where.block).not.toBe(
        PracticeBlock.grammatik,
      );
    });

    /** Without a block, the whole material: the same button from the material's own page. */
    it("publishes everything when no block is named", async () => {
      await service.publish(COURSE, MODULE, MATERIAL);

      expect(prisma.question.updateMany.mock.calls[0][0].where).not.toHaveProperty(
        "block",
      );
    });
  });

  it("refuses a material that is not this course's", async () => {
    prisma.courseMaterial.findFirst.mockResolvedValue(null);

    await expect(service.publish(COURSE, MODULE, MATERIAL)).rejects.toBeDefined();
    expect(prisma.question.updateMany).not.toHaveBeenCalled();
  });
});
