import { Test, TestingModule } from "@nestjs/testing";
import { QuestionType, QuizMode, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { QuizService } from "./quiz.service";

/**
 * A finished test is still finished when the student comes back to it.
 *
 * What went wrong: a sitting counted as this quiz's only if it had answered exactly the
 * material's published questions. A test whose Hören recording has no file yet does not
 * ask those questions, so the sitting held thirteen answers against eighteen questions and
 * never matched. The student passed, left for the next module, came back - and was told the
 * quiz had changed since they took it and offered it again, with the result they had earned
 * gone.
 *
 * The comparison now uses the set the student was actually shown.
 */
const MATERIAL = "material-1";

describe("coming back to a finished test", () => {
  let service: QuizService;
  let prisma: Record<string, { findMany: jest.Mock; findUnique?: jest.Mock; count?: jest.Mock }>;

  /** Eighteen points published; the five about the silent recording are never asked. */
  const asked = ["G1", "G2", "L1"];
  const silent = ["H1", "H2"];

  const question = (id: string, block: string, elementId: string | null) => ({
    id,
    materialId: MATERIAL,
    type: QuestionType.single_choice,
    prompt: `Питання ${id}`,
    payload: { options: [{ id: "a", text: "A" }] },
    acceptedAnswers: ["a"],
    explanation: null,
    points: 1,
    partTitle: null,
    reviewLesson: null,
    block,
    elementId,
    orderIndex: 0,
  });

  beforeEach(async () => {
    const sitting = {
      id: "attempt-1",
      userId: "stu",
      courseMaterialId: MATERIAL,
      block: null,
      score: 100,
      completedAt: new Date("2026-11-04T10:00:00Z"),
      createdAt: new Date("2026-11-04T09:50:00Z"),
      answersSnapshot: null,
      /** Exactly what was on the screen: the three askable questions. */
      questionAttempts: asked.map((id) => ({ questionId: id })),
    };

    prisma = {
      courseMaterial: {
        findMany: jest.fn(),
        findUnique: jest.fn().mockResolvedValue({
          id: MATERIAL,
          type: "quiz",
          quizMode: QuizMode.test,
          passingScore: 60,
          moduleId: "module-1",
          module: { id: "module-1", courseId: "course-1" },
        }),
      },
      question: {
        findMany: jest.fn().mockResolvedValue([
          ...asked.map((id, i) => question(id, i < 2 ? "grammatik" : "lesen", i < 2 ? null : "text-1")),
          ...silent.map((id) => question(id, "horen", "silent-audio")),
        ]),
      },
      practiceElement: {
        findMany: jest.fn().mockResolvedValue([
          { id: "text-1", kind: "text", audioUrl: null },
          { id: "silent-audio", kind: "audio", audioUrl: null },
        ]),
      },
      quizAttempt: {
        findMany: jest.fn().mockResolvedValue([sitting]),
        count: jest.fn().mockResolvedValue(1),
      },
      questionAttempt: {
        findMany: jest.fn().mockResolvedValue(
          asked.map((id) => ({ questionId: id, isCorrect: true, rawAnswer: "a" })),
        ),
      },
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
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
    service = moduleRef.get(QuizService);
  });

  const reopen = () => service.getLastAttempt(MATERIAL, "stu", Role.student);

  it("gives the result back rather than calling the quiz changed", async () => {
    const out = await reopen();

    expect(out).not.toMatchObject({ outdated: true });
    expect(out).toMatchObject({ score: 100, passed: true });
  });

  it("marks it out of the points that were offered", async () => {
    const out = await reopen();

    expect(out).toMatchObject({ total_points: asked.length });
  });

  it("says nothing about the part it never asked", async () => {
    const out = await reopen();
    const titles = ((out as { parts?: Array<{ title: string }> }).parts ?? []).map(
      (part) => part.title,
    );

    expect(titles).not.toContain("horen");
  });
});

/**
 * The last few goes, so a student can see a direction.
 *
 * Three, because 40 then 55 then 72 says the work is paying off and that is the whole
 * value of the list. A tenth row says nothing the last three do not, and a student on
 * their tenth attempt is the last person who needs a column of their own failures.
 */
describe("the history of attempts", () => {
  const MAT = "material-2";

  const build = async (scores: number[]) => {
    const sittings = scores.map((score, i) => ({
      id: `a${i}`,
      userId: "stu",
      courseMaterialId: MAT,
      block: null,
      score,
      /** Oldest first in the input; the response must come back newest first. */
      completedAt: new Date(Date.UTC(2026, 10, 1 + i, 10)),
      createdAt: new Date(Date.UTC(2026, 10, 1 + i, 9)),
      answersSnapshot: null,
      questionAttempts: [{ questionId: "Q1" }],
    }));

    const prisma = {
      courseMaterial: {
        findUnique: jest.fn().mockResolvedValue({
          id: MAT,
          type: "quiz",
          quizMode: QuizMode.test,
          passingScore: 60,
          moduleId: "m",
          module: { id: "m", courseId: "c" },
        }),
      },
      question: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: "Q1",
            materialId: MAT,
            type: QuestionType.single_choice,
            prompt: "Q",
            payload: { options: [{ id: "a", text: "A" }] },
            acceptedAnswers: ["a"],
            explanation: null,
            points: 1,
            partTitle: null,
            reviewLesson: null,
            block: "grammatik",
            elementId: null,
            orderIndex: 0,
          },
        ]),
      },
      practiceElement: { findMany: jest.fn().mockResolvedValue([]) },
      quizAttempt: {
        /** Best first, the way the real query orders it. */
        findMany: jest
          .fn()
          .mockResolvedValue([...sittings].sort((a, b) => b.score - a.score)),
        count: jest.fn().mockResolvedValue(sittings.length),
      },
      questionAttempt: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ questionId: "Q1", isCorrect: true, rawAnswer: "a" }]),
      },
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
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

    const service = moduleRef.get(QuizService);
    return (await service.getLastAttempt(MAT, "stu", Role.student)) as {
      recent_attempts?: Array<{ score: number; completed_at: string }>;
    };
  };

  it("keeps at most three, however many were taken", async () => {
    const out = await build([20, 35, 50, 65, 80]);

    expect(out.recent_attempts).toHaveLength(3);
  });

  it("gives them newest first, not best first", async () => {
    const out = await build([20, 90, 50]);

    expect(out.recent_attempts?.map((a) => a.score)).toEqual([50, 90, 20]);
  });

  it("carries only the percentage and when it was taken", async () => {
    const out = await build([70]);

    expect(Object.keys(out.recent_attempts?.[0] ?? {}).sort()).toEqual([
      "completed_at",
      "score",
    ]);
  });

  /** Nothing taken, nothing to replay: the whole response is null, history included. */
  it("is absent before anything has been finished", async () => {
    await expect(build([])).resolves.toBeNull();
  });
});
