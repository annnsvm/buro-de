import { Test, TestingModule } from "@nestjs/testing";
import { PracticeElementKind, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { SpeakingService, splitHints } from "./speaking.service";

/**
 * The speaking block, and the one rule that makes it a task rather than a reading exercise.
 *
 * The author's model answer is held back until the student has recorded something. Handing it
 * over first turns "say three sentences about who you helped today" into "read this sentence
 * aloud" - and finding the words yourself is the entire point of the task.
 */
describe("the speaking block", () => {
  const PRACTICE = "practice-1";
  const TASK = "2.1.S1";
  const USER = "user-1";

  const recElement = (overrides: Record<string, unknown> = {}) => ({
    id: TASK,
    materialId: PRACTICE,
    kind: PracticeElementKind.rec,
    title: "Запишіть 3–4 речення: кому ви сьогодні допомагали.",
    sampleAnswer: "Heute habe ich dem Techniker geholfen.",
    hints: "Ich helfe …\nIch danke …",
    orderIndex: 0,
    ...overrides,
  });

  let service: SpeakingService;
  let prisma: {
    courseMaterial: { findUnique: jest.Mock };
    practiceElement: { findUnique: jest.Mock; findMany: jest.Mock };
    speakingRecording: { findMany: jest.Mock; upsert: jest.Mock };
  };
  let cloudinary: { uploadFile: jest.Mock };

  const file = (size = 50_000) =>
    ({ buffer: Buffer.alloc(size), size, originalname: "rec.webm" }) as
      Express.Multer.File;

  beforeEach(async () => {
    prisma = {
      courseMaterial: {
        findUnique: jest.fn().mockResolvedValue({
          id: PRACTICE,
          type: "practice",
          moduleId: "module-1",
          module: { id: "module-1", courseId: "course-1" },
        }),
      },
      practiceElement: {
        findUnique: jest.fn().mockResolvedValue(recElement()),
        findMany: jest.fn().mockResolvedValue([recElement()]),
      },
      speakingRecording: {
        findMany: jest.fn().mockResolvedValue([]),
        upsert: jest.fn().mockResolvedValue({
          audioUrl: "https://cdn/rec.webm",
          durationSeconds: 12,
          createdAt: new Date("2026-10-30T10:00:00.000Z"),
        }),
      },
    };
    cloudinary = {
      uploadFile: jest.fn().mockResolvedValue({
        url: "https://cdn/rec.webm",
        publicId: "p",
        resourceType: "video",
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeakingService,
        { provide: PrismaService, useValue: prisma },
        { provide: CloudinaryService, useValue: cloudinary },
        {
          provide: CourseMaterialService,
          useValue: { assertCanAccessModule: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    service = module.get(SpeakingService);
  });

  it("shows the prompt", async () => {
    const { tasks } = await service.getTasks(PRACTICE, USER, Role.student);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].task).toContain("кому ви сьогодні допомагали");
  });

  /** The rule. Without it the task teaches copying. */
  it("withholds the model answer until something has been recorded", async () => {
    const { tasks } = await service.getTasks(PRACTICE, USER, Role.student);
    expect(tasks[0].answer_open).toBe(false);
    expect(tasks[0].sample_answer).toBeNull();
    expect(tasks[0].hints).toEqual([]);
    expect(tasks[0].recording).toBeNull();
  });

  it("opens it once there is a recording", async () => {
    prisma.speakingRecording.findMany.mockResolvedValue([
      {
        practiceElementId: TASK,
        audioUrl: "https://cdn/rec.webm",
        durationSeconds: 12,
        createdAt: new Date("2026-10-30T10:00:00.000Z"),
      },
    ]);

    const { tasks } = await service.getTasks(PRACTICE, USER, Role.student);
    expect(tasks[0].answer_open).toBe(true);
    expect(tasks[0].sample_answer).toContain("dem Techniker geholfen");
    expect(tasks[0].hints).toEqual(["Ich helfe …", "Ich danke …"]);
    expect(tasks[0].recording?.audio_url).toBe("https://cdn/rec.webm");
  });

  /** Saving a recording earns the answer in the same response, with no second request. */
  it("returns the model answer with the saved recording", async () => {
    const saved = await service.saveRecording(TASK, USER, Role.student, file(), 12);
    expect(saved.answer_open).toBe(true);
    expect(saved.sample_answer).toContain("dem Techniker geholfen");
    expect(cloudinary.uploadFile).toHaveBeenCalledTimes(1);
  });

  /** Re-recording is the normal way to use this, so it replaces rather than piles up. */
  it("replaces the previous recording for the same task", async () => {
    await service.saveRecording(TASK, USER, Role.student, file(), 9);
    expect(prisma.speakingRecording.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_practiceElementId: { userId: USER, practiceElementId: TASK } },
      }),
    );
  });

  /**
   * An all-but-empty recording is refused outright. It would otherwise satisfy the module
   * test's "something was recorded" check while being nothing at all - and the student would
   * have been told the task was done.
   */
  it("refuses an empty recording, and pays nothing to store it", async () => {
    await expect(
      service.saveRecording(TASK, USER, Role.student, file(200), 0),
    ).rejects.toMatchObject({ status: 400 });
    expect(cloudinary.uploadFile).not.toHaveBeenCalled();
  });

  it("refuses a request with no file at all", async () => {
    await expect(
      service.saveRecording(TASK, USER, Role.student, undefined),
    ).rejects.toMatchObject({ status: 400 });
  });

  /** A writing task is not a speaking one, whatever id arrives in the URL. */
  it("refuses a task of another kind", async () => {
    prisma.practiceElement.findUnique.mockResolvedValue(
      recElement({ kind: PracticeElementKind.write }),
    );
    await expect(
      service.saveRecording(TASK, USER, Role.student, file()),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("refuses a student who may not open the module", async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeakingService,
        { provide: PrismaService, useValue: prisma },
        { provide: CloudinaryService, useValue: cloudinary },
        {
          provide: CourseMaterialService,
          useValue: {
            assertCanAccessModule: jest.fn().mockRejectedValue(new Error("no access")),
          },
        },
      ],
    }).compile();

    await expect(
      module.get(SpeakingService).getTasks(PRACTICE, USER, Role.student),
    ).rejects.toThrow("no access");
  });
});

/**
 * The author's prompts, read back as a list.
 *
 * Module 2 separates them with a slash on one line; a person writing a new file puts one per
 * line. Both are read, because refusing the first would reject nine rows that already exist.
 */
describe("the words to lean on", () => {
  it("reads one per line", () => {
    expect(splitHints("Ich helfe …\nIch danke …")).toEqual([
      "Ich helfe …",
      "Ich danke …",
    ]);
  });

  it("reads them separated by a slash, as module 2 writes them", () => {
    expect(splitHints("Ich helfe … / Ich danke … / Ich gratuliere …")).toEqual([
      "Ich helfe …",
      "Ich danke …",
      "Ich gratuliere …",
    ]);
  });

  it("strips list numbering, and has nothing to say about nothing", () => {
    expect(splitHints("1. Erste\n2. Zweite")).toEqual(["Erste", "Zweite"]);
    expect(splitHints(null)).toEqual([]);
    expect(splitHints("   ")).toEqual([]);
  });
});
