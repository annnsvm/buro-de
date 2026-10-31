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
 * When the student may read what they were supposed to hear.
 *
 * A transcript shown beside the player turns a listening task into a reading one - the ear
 * is never used, because the words are already on screen. It opens once every question about
 * that recording has been answered, which is the moment it stops being a shortcut and starts
 * being the explanation.
 */
describe("the transcript of a listening task", () => {
  const MATERIAL = "practice-1";
  const COURSE = "course-1";

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

  const element = {
    id: "audio-1",
    block: PracticeBlock.horen,
    kind: PracticeElementKind.audio,
    title: "Am Telefon",
    body: null,
    audioUrl: "https://res.cloudinary.com/x/audio.mp3",
    transcript: "Guten Tag, hier ist Frau Müller.",
    orderIndex: 0,
  };

  const QUESTIONS = [question("h1", "audio-1"), question("h2", "audio-1")];

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

  /** Says which of these questions this student has already answered. */
  const answered = (...ids: string[]) =>
    prisma.questionAttempt.findMany.mockResolvedValue(
      ids.map((questionId) => ({ questionId })),
    );

  beforeEach(async () => {
    prisma = {
      question: { findMany: jest.fn().mockResolvedValue(QUESTIONS) },
      practiceElement: { findMany: jest.fn().mockResolvedValue([element]) },
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

  it("sends the recording so it can be played", async () => {
    const loaded = await load();
    expect(loaded.elements[0].audio_url).toBe(element.audioUrl);
  });

  it("keeps the transcript back before anything is answered", async () => {
    const loaded = await load();
    expect(loaded.elements[0].transcript).toBeNull();
    /** But the player may say one is coming, so the student is not left guessing. */
    expect(loaded.elements[0].has_transcript).toBe(true);
  });

  it("still keeps it back when only some questions are answered", async () => {
    answered("h1");
    const loaded = await load();
    expect(loaded.elements[0].transcript).toBeNull();
  });

  it("opens it once every question about that recording is answered", async () => {
    answered("h1", "h2");
    const loaded = await load();
    expect(loaded.elements[0].transcript).toBe(element.transcript);
  });

  /** Work done in an earlier sitting counts: coming back must not close it again. */
  it("counts answers from any sitting", async () => {
    answered("h2", "h1");
    const loaded = await load();
    expect(loaded.elements[0].transcript).toBe(element.transcript);
  });

  describe("two recordings in one block", () => {
    const second = { ...element, id: "audio-2", transcript: "Zweiter Text." };

    beforeEach(() => {
      prisma.question.findMany.mockResolvedValue([
        ...QUESTIONS,
        question("h3", "audio-2"),
      ]);
      prisma.practiceElement.findMany.mockResolvedValue([element, second]);
    });

    /** Finishing one recording must not hand over the other's words. */
    it("opens only the one that was finished", async () => {
      answered("h1", "h2");
      const loaded = await load();
      const byId = new Map(loaded.elements.map((e) => [e.id, e.transcript]));
      expect(byId.get("audio-1")).toBe(element.transcript);
      expect(byId.get("audio-2")).toBeNull();
    });
  });

  /** A question belonging to no recording unlocks nothing, and breaks nothing either. */
  it("ignores questions that are not about any recording", async () => {
    prisma.question.findMany.mockResolvedValue([question("free", null)]);
    prisma.practiceElement.findMany.mockResolvedValue([]);
    await expect(load()).resolves.toMatchObject({ elements: [] });
  });
});
