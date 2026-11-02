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
 * A listening block whose recordings have been described but not uploaded.
 *
 * The author's file names the mp3; the mp3 arrives later, as a separate piece of work. In
 * between, the element exists with nothing to play. The hub must not count that as work the
 * student has failed to do: Hören counts towards finishing a lesson, so a block waiting for
 * its audio would make the lesson impossible to close - and the questions about a recording
 * nobody can hear are not questions.
 */
describe("a listening block still waiting for its recordings", () => {
  const MATERIAL = "practice-1";

  const question = (
    id: string,
    block: PracticeBlock,
    elementId: string | null = null,
  ) => ({ id, block, points: 1, elementId });

  const element = (
    id: string,
    block: PracticeBlock,
    kind: PracticeElementKind = PracticeElementKind.text,
    audioUrl: string | null = null,
  ) => ({ id, block, kind, audioUrl });

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
  const blockNamed = async (block: PracticeBlock) =>
    (await overview()).blocks.find((entry) => entry.block === block);

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
      /** One grammar question, and three about a recording that has no file. */
      question: {
        findMany: jest.fn().mockResolvedValue([
          question("g1", PracticeBlock.grammatik),
          question("h1", PracticeBlock.horen, "ha1"),
          question("h2", PracticeBlock.horen, "ha1"),
          question("h3", PracticeBlock.horen, "ha1"),
        ]),
      },
      practiceElement: {
        findMany: jest
          .fn()
          .mockResolvedValue([
            element("ha1", PracticeBlock.horen, PracticeElementKind.audio),
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

  it("is still shown, so the student knows the work is coming", async () => {
    expect(await blockNamed(PracticeBlock.horen)).toBeTruthy();
  });

  it("says how many recordings it is waiting for", async () => {
    expect(await blockNamed(PracticeBlock.horen)).toMatchObject({
      awaiting_audio: 1,
      ready: false,
    });
  });

  /** Three questions nobody can answer must not read as three questions to answer. */
  it("counts none of the questions about a recording with no file", async () => {
    expect(await blockNamed(PracticeBlock.horen)).toMatchObject({
      total: 0,
      answered: 0,
    });
  });

  it("is not called done, because nothing was done", async () => {
    expect((await blockNamed(PracticeBlock.horen))?.done).toBe(false);
  });

  /**
   * The figure at the top of the hub. Counting the unready block would leave the student at
   * "1 of 2" with no way to reach 2.
   */
  it("is left out of the lesson's figure entirely", async () => {
    const result = await overview();

    expect(result.total_count).toBe(1);
    expect(result.done_count).toBe(0);
  });

  it("lets the lesson be finished on the blocks that are ready", async () => {
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "g1", isCorrect: true, createdAt: new Date() },
    ]);

    const result = await overview();

    expect(result.done_count).toBe(1);
    expect(result.total_count).toBe(1);
  });

  describe("once the recording is uploaded", () => {
    beforeEach(() => {
      prisma.practiceElement.findMany.mockResolvedValue([
        element(
          "ha1",
          PracticeBlock.horen,
          PracticeElementKind.audio,
          "https://files.example/ha1.mp3",
        ),
      ]);
    });

    it("counts its questions like any other block", async () => {
      expect(await blockNamed(PracticeBlock.horen)).toMatchObject({
        awaiting_audio: 0,
        ready: true,
        total: 3,
      });
    });

    it("joins the lesson's figure", async () => {
      expect((await overview()).total_count).toBe(2);
    });
  });

  /**
   * A block with two recordings where only one has arrived.
   *
   * It is work the student can start, so it counts - but only for the half that exists.
   */
  it("counts the half of a block that is ready", async () => {
    prisma.practiceElement.findMany.mockResolvedValue([
      element(
        "ha1",
        PracticeBlock.horen,
        PracticeElementKind.audio,
        "https://files.example/ha1.mp3",
      ),
      element("ha2", PracticeBlock.horen, PracticeElementKind.audio),
    ]);
    prisma.question.findMany.mockResolvedValue([
      question("h1", PracticeBlock.horen, "ha1"),
      question("h2", PracticeBlock.horen, "ha1"),
      question("h3", PracticeBlock.horen, "ha2"),
    ]);
    prisma.questionAttempt.findMany.mockResolvedValue([
      { questionId: "h1", isCorrect: true, createdAt: new Date() },
      { questionId: "h2", isCorrect: true, createdAt: new Date() },
    ]);

    expect(await blockNamed(PracticeBlock.horen)).toMatchObject({
      awaiting_audio: 1,
      ready: true,
      total: 2,
      answered: 2,
      /** Answering everything that exists finishes the block as it stands today. */
      done: true,
    });
  });
});
