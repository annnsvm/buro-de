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
 * Coming back to a block that was started and not finished.
 *
 * Only finished sittings were ever replayed, so a student who answered three questions of
 * eight and closed the tab came back to a blank block - the three answers were in the
 * database the whole time, with nothing reading them. That is the same loss as a letter
 * vanishing from the writing box: work done, and gone without a word.
 */
describe("a block the student left half done", () => {
  const MATERIAL = "practice-1";
  const COURSE = "course-1";

  const question = (id: string) => ({
    id,
    materialId: MATERIAL,
    block: PracticeBlock.grammatik,
    type: QuestionType.fill_blank,
    prompt: id,
    payload: {},
    acceptedAnswers: ["dem"],
    explanation: `Пояснення ${id}`,
    points: 1,
    orderIndex: 0,
    partTitle: null,
    reviewLesson: null,
  });

  const QUESTIONS = ["g1", "g2", "g3"].map(question);

  /** A sitting, with the ids it answered. */
  const sitting = (
    id: string,
    answered: string[],
    completedAt: Date | null,
    createdAt = new Date("2026-11-01T10:00:00Z"),
    answersSnapshot: Record<string, unknown> | null = null,
  ) => ({
    id,
    userId: "user-1",
    courseMaterialId: MATERIAL,
    block: PracticeBlock.grammatik,
    score: completedAt ? 100 : null,
    completedAt,
    createdAt,
    answersSnapshot,
    questionAttempts: answered.map((questionId) => ({ questionId })),
  });

  let service: QuizService;
  let prisma: {
    quizAttempt: { findMany: jest.Mock; count: jest.Mock };
    question: { findMany: jest.Mock };
    practiceElement: { findMany: jest.Mock };
    questionAttempt: { findMany: jest.Mock };
    courseMaterial: { findUnique: jest.Mock };
  };

  const last = () =>
    service.getLastAttempt(
      MATERIAL,
      "user-1",
      "student" as never,
      PracticeBlock.grammatik,
    );

  beforeEach(async () => {
    prisma = {
      quizAttempt: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      question: { findMany: jest.fn().mockResolvedValue(QUESTIONS) },
      /** No recordings here, so nothing is held back from the askable set. */
      practiceElement: { findMany: jest.fn().mockResolvedValue([]) },
      questionAttempt: { findMany: jest.fn().mockResolvedValue([]) },
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

  /** The failure this replaces: one answer given, and nothing to come back to. */
  it("gives back the sitting that was never finished", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("half", ["g1"], null),
    ]);
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "g1", isCorrect: true, rawAnswer: "dem" },
    ]);

    const result = await last();

    expect(result).toMatchObject({ attempt_id: "half", completed_at: null });
    expect(result?.answers).toHaveLength(1);
  });

  /** The same sitting, so the next answer joins the three already in it. */
  it("names the sitting to carry on with", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("half", ["g1", "g2"], null),
    ]);
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "g1", isCorrect: true, rawAnswer: "dem" },
      { questionId: "g2", isCorrect: false, rawAnswer: "der" },
    ]);

    expect((await last())?.attempt_id).toBe("half");
  });

  /**
   * A finished sitting still wins. It has a score and the unfinished one does not, and the
   * student's best work is what they came back to see.
   */
  it("prefers a finished sitting over one in progress", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("done", ["g1", "g2", "g3"], new Date("2026-11-01T11:00:00Z")),
      sitting("half", ["g1"], null, new Date("2026-11-02T10:00:00Z")),
    ]);
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "g1", isCorrect: true, rawAnswer: "dem" },
    ]);

    expect((await last())?.attempt_id).toBe("done");
  });

  /** The newest of several, because that is the one the student was in. */
  it("takes the one started most recently", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("newer", ["g2"], null, new Date("2026-11-02T10:00:00Z")),
      sitting("older", ["g1"], null, new Date("2026-11-01T10:00:00Z")),
    ]);
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "g2", isCorrect: true, rawAnswer: "dem" },
    ]);

    expect((await last())?.attempt_id).toBe("newer");
  });

  /** An empty sitting is not work; it is a row created and walked away from. */
  it("ignores a sitting with no answers in it", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([sitting("empty", [], null)]);

    expect(await last()).toBeNull();
  });

  /**
   * A test keeps its work somewhere else.
   *
   * Nothing in a test is marked until it is handed in, so a half-done test has no answers
   * recorded at all - only the draft. Judging a sitting by its recorded answers locked
   * every test draft out of being resumed, which is the very loss the draft prevents.
   */
  it("gives back a test whose work is only a draft", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("drafted", [], null, new Date("2026-11-02T10:00:00Z"), {
        question_g1: { question_id: "g1", answer: "dem" },
      }),
    ]);

    const result = await last();

    expect(result).toMatchObject({ attempt_id: "drafted", completed_at: null });
    expect(result?.draft_answers).toEqual([
      { question_id: "g1", answer: "dem" },
    ]);
  });

  /** An empty draft is still an empty sitting. */
  it("ignores a sitting whose draft holds nothing", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("empty", [], null, new Date("2026-11-02T10:00:00Z"), {}),
    ]);

    expect(await last()).toBeNull();
  });

  /**
   * A sitting from before the block changed answers questions that are gone. Replaying it
   * would put answers against questions the student never saw.
   */
  it("ignores a sitting that answered questions this block no longer has", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("stale", ["removed-1"], null),
    ]);

    expect(await last()).toBeNull();
  });

  /** Half-done is not out of date: it is this block, with work still in it. */
  it("does not call a sitting in progress an outdated one", async () => {
    prisma.quizAttempt.findMany.mockResolvedValue([
      sitting("old", ["removed-1"], new Date("2026-10-01T10:00:00Z")),
      sitting("half", ["g1"], null, new Date("2026-11-02T10:00:00Z")),
    ]);
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "g1", isCorrect: true, rawAnswer: "dem" },
    ]);

    const result = await last();

    expect(result).not.toEqual({ outdated: true });
    expect(result).toMatchObject({ attempt_id: "half" });
  });
});
