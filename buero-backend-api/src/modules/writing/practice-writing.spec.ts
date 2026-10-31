import { Test, TestingModule } from "@nestjs/testing";
import { PracticeElementKind, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { WritingService } from "./writing.service";

/**
 * Writing as a block of the practice rather than a material of its own.
 *
 * The rubric moves onto the task, and the attempt window moves with it. That second half is
 * the part that could quietly go wrong: a practice may hold several letters, and counting
 * attempts by material would let the first letter spend the second one's goes - a student
 * would open task two and find it already used up, with nothing on screen to explain why.
 */
describe("a writing task inside a practice block", () => {
  const PRACTICE = "practice-1";
  const TASK = "2.1.W1";
  const USER = "user-1";

  /** A task as the import leaves it: prompt, rubric, counted length, model answer. */
  const writeElement = (overrides: Record<string, unknown> = {}) => ({
    id: TASK,
    materialId: PRACTICE,
    kind: PracticeElementKind.write,
    title: "Напишіть колезі лист на 6–8 речень.",
    body: null,
    criteria: [
      "У тілі листа 6–8 речень; є звертання і формула прощання",
      "Є речення з weil, побудоване правильно",
    ],
    minSentences: 6,
    maxSentences: 8,
    sampleAnswer: "Liebe Frau Berg, herzlichen Glückwunsch!",
    orderIndex: 0,
    material: {
      id: PRACTICE,
      moduleId: "module-1",
      module: { id: "module-1", courseId: "course-1" },
    },
    ...overrides,
  });

  let service: WritingService;
  let prisma: {
    courseMaterial: { findUnique: jest.Mock };
    practiceElement: { findUnique: jest.Mock; findMany: jest.Mock };
    writingSubmission: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
    };
  };

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
        findUnique: jest.fn().mockResolvedValue(writeElement()),
        findMany: jest.fn().mockResolvedValue([writeElement()]),
      },
      writingSubmission: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WritingService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: CourseMaterialService,
          useValue: { assertCanAccessModule: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    service = module.get(WritingService);
  });

  it("reads the author's rubric off the task itself", async () => {
    const { tasks } = await service.getPracticeTasks(PRACTICE, USER, Role.student);

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      element_id: TASK,
      task: "Напишіть колезі лист на 6–8 речень.",
      min_sentences: 6,
      max_sentences: 8,
      /** The mark is out of the number of criteria the author wrote, not a fixed total. */
      max_score: 2,
      can_submit: true,
    });
    expect(tasks[0].criteria).toEqual([
      "У тілі листа 6–8 речень; є звертання і формула прощання",
      "Є речення з weil, побудоване правильно",
    ]);
  });

  /**
   * The attempt window is the task's, not the practice's.
   *
   * Without `practiceElementId` in the filter, two letters in one lesson would share three
   * goes between them.
   */
  it("counts attempts against the one task, not the whole practice", async () => {
    await service.getPracticeTasks(PRACTICE, USER, Role.student);

    for (const call of prisma.writingSubmission.findMany.mock.calls) {
      expect(call[0].where).toMatchObject({
        userId: USER,
        practiceElementId: TASK,
      });
      expect(call[0].where.courseMaterialId).toBeUndefined();
    }
  });

  /**
   * And the other way round: a writing material's own attempts must not count the letters
   * written inside a practice that happens to share its id space.
   */
  it("keeps a writing material's attempts clear of any practice task", async () => {
    prisma.courseMaterial.findUnique.mockResolvedValue({
      id: "writing-1",
      type: "writing",
      moduleId: "module-1",
      module: { id: "module-1", courseId: "course-1" },
      content: {
        task: "Напишіть листа керівникові.",
        minSentences: 6,
        maxSentences: 8,
        criteria: ["Перший критерій", "Другий критерій"],
      },
    });

    await service.getTask("writing-1", USER, Role.student);

    expect(prisma.writingSubmission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: USER,
          courseMaterialId: "writing-1",
          practiceElementId: null,
        },
      }),
    );
  });

  /** Sending the same letter twice is answered from the record, against the right task. */
  it("recognises a letter already graded for this task", async () => {
    prisma.writingSubmission.findFirst.mockResolvedValue({
      score: 2,
      maxScore: 2,
      assessment: { criteria: [] },
    });

    const result = await service.submitElement(
      TASK,
      USER,
      Role.student,
      "Liebe Frau Berg, herzlichen Glückwunsch zum Geburtstag!",
    );

    expect(result).toMatchObject({ status: "graded", repeated: true });
    expect(prisma.writingSubmission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ practiceElementId: TASK }),
      }),
    );
    /** Nothing was sent to be graded, so nothing was paid for. */
    expect(prisma.writingSubmission.create).not.toHaveBeenCalled();
  });

  /**
   * An unfinished task is named, not hidden and not fatal.
   *
   * One task with no rubric used to be enough to take the whole block down with a 500. The
   * student now sees the rest of the block, and the one that is not ready says so.
   */
  it("reports a task with no rubric instead of failing the block", async () => {
    prisma.practiceElement.findMany.mockResolvedValue([
      writeElement(),
      writeElement({ id: "2.1.W2", criteria: [], title: "Другий лист" }),
    ]);

    const { tasks, unusable } = await service.getPracticeTasks(
      PRACTICE,
      USER,
      Role.student,
    );

    expect(tasks.map((task) => task.element_id)).toEqual([TASK]);
    expect(unusable).toEqual([
      expect.objectContaining({ element_id: "2.1.W2", title: "Другий лист" }),
    ]);
  });

  /** A task reached directly without a rubric is the author's mistake, not a server fault. */
  it("answers 400, not 500, for a task that cannot be marked", async () => {
    prisma.practiceElement.findUnique.mockResolvedValue(
      writeElement({ criteria: [] }),
    );

    await expect(
      service.submitElement(TASK, USER, Role.student, "Liebe Frau Berg,"),
    ).rejects.toMatchObject({ status: 400 });
  });

  /** The access check is the module's, exactly as it is for a material of its own. */
  it("refuses a student who may not open the module", async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WritingService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: CourseMaterialService,
          useValue: {
            assertCanAccessModule: jest
              .fn()
              .mockRejectedValue(new Error("no access")),
          },
        },
      ],
    }).compile();

    await expect(
      module.get(WritingService).getPracticeTasks(PRACTICE, USER, Role.student),
    ).rejects.toThrow("no access");
  });
});
