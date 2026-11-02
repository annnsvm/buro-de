import { Test, TestingModule } from "@nestjs/testing";
import {
  PracticeBlock,
  PracticeElementKind,
  QuestionType,
  QuizMode,
} from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { QuizService } from "./quiz.service";

/**
 * A recording the author has described but not uploaded.
 *
 * Her file names the mp3 and the mp3 follows later, as a separate piece of work. In between
 * the element exists with nothing to play, and the student used to be shown a heading over an
 * empty frame with the questions underneath it - questions about a recording they could not
 * hear, whose wrong answers went into their record all the same.
 */
describe("a listening task whose recording has not been uploaded", () => {
  const MATERIAL = "practice-1";

  const question = (id: string, elementId: string | null) => ({
    id,
    materialId: MATERIAL,
    block: PracticeBlock.horen,
    elementId,
    type: QuestionType.single_choice,
    prompt: id,
    payload: {},
    acceptedAnswers: ["a"],
    explanation: null,
    points: 1,
    orderIndex: 0,
  });

  const audio = (id: string, audioUrl: string | null) => ({
    id,
    block: PracticeBlock.horen,
    kind: PracticeElementKind.audio,
    title: "Розмова в офісі",
    body: null,
    audioUrl,
    audioFileName: "A2.1-2.1-hoeren-1.mp3",
    transcript: "OLHA: Markus, hast du kurz Zeit?",
    orderIndex: 0,
  });

  let service: QuizService;
  let prisma: {
    question: { findMany: jest.Mock };
    practiceElement: { findMany: jest.Mock };
    questionAttempt: { findMany: jest.Mock };
    courseMaterial: { findUnique: jest.Mock };
  };

  const load = () =>
    service.getQuestions(
      MATERIAL,
      "user-1",
      "student" as never,
      PracticeBlock.horen,
    );

  beforeEach(async () => {
    prisma = {
      question: {
        findMany: jest
          .fn()
          .mockResolvedValue([question("h1", "ha1"), question("h2", "ha1")]),
      },
      practiceElement: {
        findMany: jest.fn().mockResolvedValue([audio("ha1", null)]),
      },
      questionAttempt: { findMany: jest.fn().mockResolvedValue([]) },
      courseMaterial: {
        findUnique: jest.fn().mockResolvedValue({
          id: MATERIAL,
          type: "practice",
          quizMode: QuizMode.practice,
          passingScore: null,
          moduleId: "module-1",
          module: { id: "module-1", courseId: "course-1" },
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

  /** The task is named, not hidden: the student is told it is still being prepared. */
  it("still sends the task, marked as waiting for its recording", async () => {
    const result = await load();

    expect(result.elements).toHaveLength(1);
    expect(result.elements[0]).toMatchObject({
      id: "ha1",
      title: "Розмова в офісі",
      audio_url: null,
      awaiting_audio: true,
    });
  });

  it("asks none of its questions", async () => {
    expect((await load()).questions).toEqual([]);
  });

  /**
   * The trap this guards.
   *
   * The transcript opens once every question about a recording has been answered. With the
   * questions held back there are none to answer, so "all answered" is vacuously true - and
   * handing over the transcript would print the whole dialogue for a recording that does not
   * exist yet, which is the one thing a listening task must never do.
   */
  it("does not hand over the transcript", async () => {
    expect((await load()).elements[0]).toMatchObject({
      transcript: null,
      has_transcript: true,
    });
  });

  it("counts nothing towards a test's total", async () => {
    prisma.courseMaterial.findUnique.mockResolvedValue({
      id: MATERIAL,
      type: "practice",
      quizMode: QuizMode.test,
      passingScore: 60,
      moduleId: "module-1",
      module: { id: "module-1", courseId: "course-1" },
    });

    expect((await load()).total_points).toBe(0);
  });

  describe("beside a recording that has been uploaded", () => {
    beforeEach(() => {
      prisma.practiceElement.findMany.mockResolvedValue([
        audio("ha1", "https://res.cloudinary.com/x/one.mp3"),
        audio("ha2", null),
      ]);
      prisma.question.findMany.mockResolvedValue([
        question("h1", "ha1"),
        question("h2", "ha1"),
        question("h3", "ha2"),
      ]);
    });

    it("asks only the questions whose recording exists", async () => {
      expect((await load()).questions.map((q) => q.id)).toEqual(["h1", "h2"]);
    });

    it("marks each task with its own state", async () => {
      const result = await load();

      expect(result.elements.map((e) => e.awaiting_audio)).toEqual([
        false,
        true,
      ]);
    });

    /** The one that exists behaves exactly as before: answer both, read the transcript. */
    it("still opens the transcript of the one that exists", async () => {
      prisma.questionAttempt.findMany.mockResolvedValue([
        { questionId: "h1" },
        { questionId: "h2" },
      ]);

      const result = await load();

      expect(result.elements[0].transcript).toBe(
        "OLHA: Markus, hast du kurz Zeit?",
      );
      expect(result.elements[1].transcript).toBeNull();
    });
  });

  /** A question that is about nothing in particular is unaffected. */
  it("still asks a question with no recording behind it", async () => {
    prisma.question.findMany.mockResolvedValue([
      question("h1", "ha1"),
      question("free", null),
    ]);

    expect((await load()).questions.map((q) => q.id)).toEqual(["free"]);
  });
});
