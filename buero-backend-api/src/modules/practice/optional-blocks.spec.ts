import { Test, TestingModule } from "@nestjs/testing";
import {
  PracticeBlock,
  PracticeElementKind,
  Role,
} from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { PracticeService } from "./practice.service";

/**
 * Which blocks the practice counts, and which it merely offers.
 *
 * Speaking is marked by the student and writing costs a paid check, so neither can fairly
 * decide whether a lesson is behind them. Both are still worth doing, so they are shown - just
 * kept out of the figure, and never reported as finished on their own.
 */
describe("the two blocks that do not count", () => {
  const MATERIAL = "practice-1";

  const question = (id: string, block: PracticeBlock) => ({
    id,
    block,
    points: 1,
  });

  const element = (
    id: string,
    block: PracticeBlock,
    kind: PracticeElementKind = PracticeElementKind.text,
  ) => ({ id, block, kind });

  let service: PracticeService;
  let prisma: {
    courseMaterial: { findUnique: jest.Mock };
    question: { findMany: jest.Mock };
    practiceElement: { findMany: jest.Mock };
    questionAttempt: { findMany: jest.Mock };
    writingSubmission: { findMany: jest.Mock };
    speakingRecording: { findMany: jest.Mock };
  };

  const overview = () => service.getOverview(MATERIAL, "user-1", Role.student);

  beforeEach(async () => {
    prisma = {
      courseMaterial: {
        findUnique: jest.fn().mockResolvedValue({
          id: MATERIAL,
          type: "practice",
          title: "Praktische Übungen",
          moduleId: "module-1",
          module: { id: "module-1", courseId: "course-1", title: "Modul 2" },
          parentMaterial: { title: "2.1" },
        }),
      },
      question: {
        findMany: jest
          .fn()
          .mockResolvedValue([
            question("g1", PracticeBlock.grammatik),
            question("l1", PracticeBlock.lesen),
          ]),
      },
      /** One speaking task and one writing task, neither of which asks a question. */
      practiceElement: {
        findMany: jest
          .fn()
          .mockResolvedValue([
            element("lt1", PracticeBlock.lesen),
            element("s1", PracticeBlock.sprechen, PracticeElementKind.rec),
            element("w1", PracticeBlock.schreiben, PracticeElementKind.write),
          ]),
      },
      questionAttempt: { findMany: jest.fn().mockResolvedValue([]) },
      writingSubmission: { findMany: jest.fn().mockResolvedValue([]) },
      speakingRecording: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticeService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: CourseMaterialService,
          useValue: { assertCanAccessModule: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(PracticeService);
  });

  /**
   * The failure this replaces: a block was counted by its questions alone, so a speaking task
   * with none simply did not appear and the student never learned the work existed.
   */
  it("shows a block that is one task and no questions", async () => {
    const result = await overview();
    const names = result.blocks.map((entry) => entry.block);
    expect(names).toContain(PracticeBlock.sprechen);
    expect(names).toContain(PracticeBlock.schreiben);
  });

  it("marks those two as optional and the rest as not", async () => {
    const byBlock = new Map(
      (await overview()).blocks.map((entry) => [entry.block, entry.optional]),
    );
    expect(byBlock.get(PracticeBlock.sprechen)).toBe(true);
    expect(byBlock.get(PracticeBlock.schreiben)).toBe(true);
    expect(byBlock.get(PracticeBlock.grammatik)).toBe(false);
    expect(byBlock.get(PracticeBlock.lesen)).toBe(false);
  });

  /** Two countable blocks, so the practice is "of 2" however many optional ones sit beside it. */
  it("counts only the blocks that can be marked", async () => {
    const result = await overview();
    expect(result.total_count).toBe(2);
    expect(result.blocks).toHaveLength(4);
  });

  /** Otherwise a speaking task would read as finished before it had been spoken. */
  it("never calls a block with no questions done", async () => {
    const byBlock = new Map(
      (await overview()).blocks.map((entry) => [entry.block, entry.done]),
    );
    expect(byBlock.get(PracticeBlock.sprechen)).toBe(false);
    expect(byBlock.get(PracticeBlock.schreiben)).toBe(false);
  });

  /**
   * Writing is the one optional block that can be marked, so it is the one that can be
   * finished. Before this, a student could write the letter, be marked 5 of 6, return to the
   * hub and find the block as untouched as it was before they started.
   */
  describe("once the letter has been written", () => {
    beforeEach(() => {
      prisma.writingSubmission.findMany.mockResolvedValue([
        { practiceElementId: "w1", score: 4, maxScore: 6 },
        /** The best attempt is the one that counts, as it is for a quiz. */
        { practiceElementId: "w1", score: 5, maxScore: 6 },
      ]);
    });

    it("calls the writing block done", async () => {
      const byBlock = new Map(
        (await overview()).blocks.map((entry) => [entry.block, entry.done]),
      );
      expect(byBlock.get(PracticeBlock.schreiben)).toBe(true);
      /** Nothing was recorded, so speaking is untouched by it. */
      expect(byBlock.get(PracticeBlock.sprechen)).toBe(false);
    });

    /** Out of criteria, not out of questions - of which this block has none. */
    it("reports the best mark rather than 0 of 0", async () => {
      const block = (await overview()).blocks.find(
        (entry) => entry.block === PracticeBlock.schreiben,
      );
      expect(block?.points).toEqual({ score: 5, max: 6 });
      expect(block?.total).toBe(0);
    });

    /** Done, and still not part of the figure: the practice is finished without it. */
    it("still keeps it out of the count", async () => {
      const result = await overview();
      expect(result.done_count).toBe(0);
      expect(result.total_count).toBe(2);
    });

    /**
     * Speaking is the other block with no questions, and it is done the same way: every
     * prompt recorded. No score is reported, because none would be honest.
     */
    it("calls the speaking block done once every prompt is recorded", async () => {
      prisma.speakingRecording.findMany.mockResolvedValue([
        { practiceElementId: "s1" },
      ]);
      const block = (await overview()).blocks.find(
        (entry) => entry.block === PracticeBlock.sprechen,
      );
      expect(block?.done).toBe(true);
      /** Nothing is invented to show in place of a mark. */
      expect(block?.points).toBeNull();
    });

    it("waits for every prompt in the speaking block", async () => {
      prisma.practiceElement.findMany.mockResolvedValue([
        element("s1", PracticeBlock.sprechen, PracticeElementKind.rec),
        element("s2", PracticeBlock.sprechen, PracticeElementKind.rec),
      ]);
      prisma.speakingRecording.findMany.mockResolvedValue([
        { practiceElementId: "s1" },
      ]);
      const block = (await overview()).blocks.find(
        (entry) => entry.block === PracticeBlock.sprechen,
      );
      expect(block?.done).toBe(false);
    });

    /** A second letter in the same block means the block is only half written. */
    it("waits for every letter in the block", async () => {
      prisma.practiceElement.findMany.mockResolvedValue([
        element("w1", PracticeBlock.schreiben, PracticeElementKind.write),
        element("w2", PracticeBlock.schreiben, PracticeElementKind.write),
      ]);
      const block = (await overview()).blocks.find(
        (entry) => entry.block === PracticeBlock.schreiben,
      );
      expect(block?.done).toBe(false);
    });
  });

  it("reaches full marks on the countable blocks alone", async () => {
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "g1", isCorrect: true, answeredAt: new Date() },
      { questionId: "l1", isCorrect: true, answeredAt: new Date() },
    ]);
    const result = await overview();
    expect(result.done_count).toBe(2);
    expect(result.total_count).toBe(2);
  });
});
