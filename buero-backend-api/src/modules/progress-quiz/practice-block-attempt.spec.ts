import { Test, TestingModule } from "@nestjs/testing";
import {
  PracticeBlock,
  QuestionType,
  QuizMode,
} from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { QuizService } from "./quiz.service";

/**
 * A sitting belongs to one block of a practice, not to the whole practice.
 *
 * This is the rule that broke the moment a reading text was added to a lesson that already
 * had grammar questions. The practice then held eight Grammatik questions and three Lesen
 * ones, but an attempt was still measured against all eleven - so answering Grammatik in
 * full never completed the sitting, no result was ever shown, and returning to the block
 * was told the quiz had changed and had to be done again.
 */
describe("a sitting of one practice block", () => {
  const MATERIAL = "practice-1";
  const ATTEMPT = "attempt-1";
  const COURSE = "course-1";

  const question = (id: string, block: PracticeBlock) => ({
    id,
    materialId: MATERIAL,
    block,
    type: QuestionType.fill_blank,
    prompt: id,
    payload: {},
    acceptedAnswers: ["bin"],
    explanation: null,
    points: 1,
    orderIndex: 0,
  });

  /** Eight questions of grammar and three about a text - one practice, two blocks. */
  const GRAMMATIK = Array.from({ length: 8 }, (_, i) =>
    question(`g${i}`, PracticeBlock.grammatik),
  );
  const LESEN = Array.from({ length: 3 }, (_, i) =>
    question(`l${i}`, PracticeBlock.lesen),
  );
  const ALL = [...GRAMMATIK, ...LESEN];

  let service: QuizService;
  let prisma: {
    quizAttempt: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    question: { findFirst: jest.Mock; findMany: jest.Mock; count: jest.Mock };
    questionAttempt: { findFirst: jest.Mock; findMany: jest.Mock; create: jest.Mock };
    courseMaterial: { findUnique: jest.Mock };
    courseProgress: { upsert: jest.Mock };
  };

  const inBlock = (block?: PracticeBlock) =>
    block ? ALL.filter((q) => q.block === block) : ALL;

  beforeEach(async () => {
    prisma = {
      quizAttempt: {
        create: jest.fn((args: { data: unknown }) => ({
          id: ATTEMPT,
          createdAt: new Date("2026-09-30T10:00:00Z"),
          completedAt: null,
          score: null,
          ...(args.data as object),
        })),
        findUnique: jest.fn().mockResolvedValue({
          id: ATTEMPT,
          userId: "user-1",
          courseMaterialId: MATERIAL,
          block: PracticeBlock.grammatik,
          completedAt: null,
        }),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
      },
      question: {
        findFirst: jest.fn((args: { where: { id: string } }) =>
          Promise.resolve(ALL.find((q) => q.id === args.where.id) ?? null),
        ),
        /** Answers the way the database would: only the block that was asked for. */
        findMany: jest.fn((args: { where: { block?: PracticeBlock } }) =>
          Promise.resolve(inBlock(args.where.block)),
        ),
        count: jest.fn((args: { where: { block?: PracticeBlock } }) =>
          Promise.resolve(inBlock(args.where.block).length),
        ),
      },
      questionAttempt: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn(),
      },
      courseMaterial: {
        findUnique: jest.fn().mockResolvedValue({
          id: MATERIAL,
          type: "practice",
          quizMode: QuizMode.practice,
          passingScore: null,
          moduleId: "module-1",
          module: { id: "module-1", courseId: COURSE },
        }),
      },
      courseProgress: { upsert: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: CourseMaterialService,
          useValue: {
            assertCanAccessCourse: jest.fn(),
            assertCanAccessModule: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(QuizService);
  });

  it("records which block the sitting is for", async () => {
    await service.startAttempt("user-1", "student" as never, MATERIAL, PracticeBlock.lesen);
    expect(prisma.quizAttempt.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ block: PracticeBlock.lesen }),
    });
  });

  it("leaves a quiz, which has no blocks, unmarked", async () => {
    await service.startAttempt("user-1", "student" as never, MATERIAL);
    expect(prisma.quizAttempt.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ block: null }),
    });
  });

  /**
   * The failure the student actually saw: eight of eight answered, and nothing happened,
   * because three questions from another block were counted as still owing.
   */
  it("finishes the sitting when its own block is fully answered", async () => {
    prisma.questionAttempt.findMany.mockResolvedValue(
      GRAMMATIK.map(() => ({ isCorrect: true })),
    );

    const response = await service.answerQuestion(ATTEMPT, "user-1", {
      question_id: "g7",
      answer: "bin",
    });

    expect(response.total).toBe(8);
    expect(response.summary).not.toBeNull();
    expect(response.summary?.score).toBe(100);
  });

  /** And the count it reports is the block's, so "5 of 8" never reads as "5 of 11". */
  it("counts only its own block's questions", async () => {
    prisma.questionAttempt.findMany.mockResolvedValue([{ isCorrect: true }]);
    const response = await service.answerQuestion(ATTEMPT, "user-1", {
      question_id: "g0",
      answer: "bin",
    });
    expect(response.total).toBe(8);
    expect(response.summary).toBeNull();
  });

  describe("coming back to a block that was already done", () => {
    const finishedGrammatik = {
      id: "old",
      score: 100,
      block: PracticeBlock.grammatik,
      questionAttempts: GRAMMATIK.map((q) => ({ questionId: q.id })),
    };

    it("replays it instead of calling it out of date", async () => {
      prisma.quizAttempt.findMany.mockResolvedValue([finishedGrammatik]);
      prisma.questionAttempt.findMany.mockResolvedValue(
        GRAMMATIK.map((q) => ({ questionId: q.id, isCorrect: true, rawAnswer: "bin" })),
      );

      const last = await service.getLastAttempt(
        MATERIAL,
        "user-1",
        "student" as never,
        PracticeBlock.grammatik,
      );

      expect(last).not.toBeNull();
      expect(last).not.toMatchObject({ outdated: true });
      expect(prisma.quizAttempt.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ block: PracticeBlock.grammatik }, { block: null }],
          }),
        }),
      );
    });

    /**
     * Sittings recorded before blocks existed answered what was then the whole practice -
     * all of Grammatik. They belong to Grammatik, and the student must not be told their
     * work is out of date because the column that would have said so did not exist yet.
     */
    it("still replays a sitting recorded before blocks existed", async () => {
      prisma.quizAttempt.findMany.mockResolvedValue([
        { ...finishedGrammatik, block: null },
      ]);
      prisma.questionAttempt.findMany.mockResolvedValue(
        GRAMMATIK.map((q) => ({ questionId: q.id, isCorrect: true, rawAnswer: "bin" })),
      );

      const last = await service.getLastAttempt(
        MATERIAL,
        "user-1",
        "student" as never,
        PracticeBlock.grammatik,
      );
      expect(last).not.toBeNull();
      expect(last).not.toMatchObject({ outdated: true });
    });

    /**
     * And it belongs to the block it answered, and to no other. Opening Lesen for the first
     * time must find it empty - not be told to redo work that was never about Lesen.
     */
    it("leaves another block untouched by that old sitting", async () => {
      prisma.quizAttempt.findMany.mockResolvedValue([
        { ...finishedGrammatik, block: null },
      ]);
      const last = await service.getLastAttempt(
        MATERIAL,
        "user-1",
        "student" as never,
        PracticeBlock.lesen,
      );
      expect(last).toBeNull();
    });

    /** The real "it changed" case still speaks: same block, a question since added. */
    it("says a block changed when its own sitting no longer covers it", async () => {
      prisma.quizAttempt.findMany.mockResolvedValue([
        {
          ...finishedGrammatik,
          questionAttempts: GRAMMATIK.slice(0, 5).map((q) => ({ questionId: q.id })),
        },
      ]);
      const last = await service.getLastAttempt(
        MATERIAL,
        "user-1",
        "student" as never,
        PracticeBlock.grammatik,
      );
      expect(last).toMatchObject({ outdated: true });
    });

    /** A block never started is empty, not out of date - there is nothing to redo. */
    it("does not offer another block's sitting as this one's", async () => {
      prisma.quizAttempt.findMany.mockResolvedValue([]);
      const last = await service.getLastAttempt(
        MATERIAL,
        "user-1",
        "student" as never,
        PracticeBlock.lesen,
      );
      expect(last).toBeNull();
    });
  });
});
