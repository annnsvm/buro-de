import { Test, TestingModule } from "@nestjs/testing";
import { QuestionType, QuizMode } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { QuizService } from "./quiz.service";

/**
 * What a finished test does to the student's record and what it tells them.
 *
 * Two rules meet here and used to contradict each other: a test below its threshold is
 * not finished, and a student who failed still deserves to be told why. Before, the
 * opposite of both held — a failed test was ticked off as done, and came back with
 * nothing but red marks.
 */
describe("QuizService.submitQuiz", () => {
  const MATERIAL = "material-1";
  const ATTEMPT = "attempt-1";
  const COURSE = "course-1";

  /** Three points across two tasks, so the weights actually matter. */
  const questions = [
    {
      id: "T1",
      materialId: MATERIAL,
      type: QuestionType.fill_blank,
      prompt: "Ich bleibe zu Hause, weil ich krank ___.",
      payload: {},
      acceptedAnswers: ["bin"],
      explanation: "після weil дієслово стоїть у самому кінці.",
      points: 1,
      partTitle: "ЧАСТИНА 1 · weil і denn",
      reviewLesson: "4.1",
      orderIndex: 0,
    },
    {
      id: "T2",
      materialId: MATERIAL,
      type: QuestionType.fill_blank,
      prompt: "Ich hoffe, dass du morgen ___.",
      payload: {},
      acceptedAnswers: ["kommst"],
      explanation: "підмет du → kommst.",
      points: 2,
      partTitle: "ЧАСТИНА 2 · dass і das",
      reviewLesson: "4.4",
      orderIndex: 1,
    },
  ];

  let service: QuizService;
  let prisma: {
    quizAttempt: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    question: { findMany: jest.Mock };
    questionAttempt: { createMany: jest.Mock };
    courseMaterial: { findUnique: jest.Mock };
    courseProgress: { upsert: jest.Mock };
  };

  const material = (quizMode: QuizMode, passingScore: number | null) => ({
    id: MATERIAL,
    type: "quiz",
    quizMode,
    passingScore,
    moduleId: "module-1",
    module: { id: "module-1", courseId: COURSE },
  });

  const setUp = (quizMode: QuizMode, passingScore: number | null) => {
    prisma.quizAttempt.findUnique.mockResolvedValue({
      id: ATTEMPT,
      userId: "user-1",
      courseMaterialId: MATERIAL,
      completedAt: null,
      createdAt: new Date(),
      answersSnapshot: null,
      score: null,
      courseMaterial: material(quizMode, passingScore),
    });
    prisma.courseMaterial.findUnique.mockResolvedValue(
      material(quizMode, passingScore),
    );
  };

  beforeEach(async () => {
    prisma = {
      quizAttempt: {
        findUnique: jest.fn(),
        // No earlier attempt, so this one sets the result.
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn((args: { data: unknown }) => ({
          id: ATTEMPT,
          courseMaterialId: MATERIAL,
          createdAt: new Date(),
          ...(args.data as object),
        })),
        count: jest.fn().mockResolvedValue(1),
      },
      question: { findMany: jest.fn().mockResolvedValue(questions) },
      questionAttempt: { createMany: jest.fn() },
      courseMaterial: { findUnique: jest.fn() },
      courseProgress: { upsert: jest.fn() },
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: CourseMaterialService,
          useValue: { assertCanAccessCourse: jest.fn(), assertCanAccessModule: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get(QuizService);
  });

  /** Only the one-point task right: 1 of 3 points, well under a 60% threshold. */
  const failing = () =>
    service.submitQuiz(ATTEMPT, "user-1", {
      answers: [
        { question_id: "T1", answer: "bin" },
        { question_id: "T2", answer: "kommen" },
      ],
    });

  /** Both right: 3 of 3 points. */
  const passing = () =>
    service.submitQuiz(ATTEMPT, "user-1", {
      answers: [
        { question_id: "T1", answer: "bin" },
        { question_id: "T2", answer: "kommst" },
      ],
    });

  describe("a test below its threshold", () => {
    beforeEach(() => setUp(QuizMode.test, 60));

    it("is not marked as done", async () => {
      const result = await failing();

      expect(result.passed).toBe(false);
      expect(prisma.courseProgress.upsert).not.toHaveBeenCalled();
    });

    it("still records the attempt and its answers", async () => {
      await failing();

      expect(prisma.quizAttempt.update).toHaveBeenCalled();
      expect(prisma.questionAttempt.createMany).toHaveBeenCalled();
    });

    it("scores it on points, not on the number of tasks", async () => {
      const result = await failing();

      // One of two tasks right, but only one of three points.
      expect(result.correct).toBe(1);
      expect(result.earned_points).toBe(1);
      expect(result.total_points).toBe(3);
      expect(result.score).toBeCloseTo(33.33, 1);
    });

    it("explains every question, right or wrong", async () => {
      const result = await failing();

      expect(result.results.map((item) => item.explanation)).toEqual([
        "після weil дієслово стоїть у самому кінці.",
        "підмет du → kommst.",
      ]);
    });

    it("still keeps the answer key back, so a retake is not copying", async () => {
      const result = await failing();

      expect(result.reveal_answers).toBe(false);
      expect(result.results.every((item) => item.accepted_answers.length === 0)).toBe(
        true,
      );
    });

    it("names the part that let them down, and the lesson for it", async () => {
      const result = await failing();

      const weak = result.parts.filter((part) => part.weak);
      expect(weak).toHaveLength(1);
      expect(weak[0]).toMatchObject({
        title: "ЧАСТИНА 2 · dass і das",
        review_lesson: "4.4",
        earned_points: 0,
        total_points: 2,
      });
    });
  });

  describe("a test at or above its threshold", () => {
    beforeEach(() => setUp(QuizMode.test, 60));

    it("is marked as done", async () => {
      const result = await passing();

      expect(result.passed).toBe(true);
      expect(prisma.courseProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId_courseId_courseMaterialId: {
              userId: "user-1",
              courseId: COURSE,
              courseMaterialId: MATERIAL,
            },
          },
        }),
      );
    });

    it("hands over the answer key", async () => {
      const result = await passing();

      expect(result.reveal_answers).toBe(true);
    });
  });

  describe("a practice quiz", () => {
    beforeEach(() => setUp(QuizMode.practice, null));

    it("is done however it went — there is nothing to fail", async () => {
      await failing();

      expect(prisma.courseProgress.upsert).toHaveBeenCalled();
    });

    it("counts questions rather than points, and reports no points", async () => {
      const result = await failing();

      expect(result.score).toBe(50);
      expect(result.earned_points).toBeNull();
      expect(result.total_points).toBeNull();
    });

    it("is not broken into parts; it follows one lesson already", async () => {
      const result = await failing();

      expect(result.parts).toEqual([]);
    });
  });
});
