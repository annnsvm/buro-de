import { Test, TestingModule } from "@nestjs/testing";
import { PracticeElementKind, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { UnreadableMarkingError } from "./mark-writing";
import { WritingService } from "./writing.service";

const markWriting = jest.fn();
jest.mock("./mark-writing", () => {
  const actual = jest.requireActual("./mark-writing") as Record<string, unknown>;
  return { ...actual, markWriting: (...args: unknown[]) => markWriting(...args) };
});

/**
 * What the service actually sends, and what it keeps afterwards.
 *
 * The marking path and the free checks were both written and tested on their own, and both sat
 * unused: the service still called the old grader. This file is the join - the only place that
 * can tell whether the author's note reaches the checker, whether a copied text is turned away
 * before anything is spent, and whether a reply we could not read costs the student a check.
 */
describe("sending a writing task to be checked", () => {
  const PRACTICE = "practice-1";
  const TASK = "2.1.W1";
  const USER = "user-1";
  const NOTE = "Рахування: привітання, підпис і «Und du?» не рахуються.";

  const LETTER =
    "Hallo Lena!\nAm Samstag habe ich meine Wohnung geputzt. Dann habe ich mit meinem " +
    "Bruder telefoniert. Wir haben zusammen Pizza gegessen. Am Abend habe ich ein Buch " +
    "gelesen. Vielen Dank für deine Nachricht.\nViele Grüße\nOlha";

  const SAMPLE =
    "Hallo Lena!\nIch habe am Samstag bis drei Uhr gearbeitet. Ich habe im Supermarkt Obst " +
    "gekauft. Ich habe lange auf den Bus gewartet. Meine Schwester hat eine Suppe gekocht.\n" +
    "Viele Grüße\nOlha";

  const element = (overrides: Record<string, unknown> = {}) => ({
    id: TASK,
    materialId: PRACTICE,
    kind: PracticeElementKind.write,
    title: "Напишіть Lena відповідь - що ви робили в суботу.",
    body: "Напишіть Lena відповідь - що ви робили в суботу, 4-6 речень.",
    criteria: [
      "4-6 речень про вашу суботу",
      "Щонайменше 4 речення в Perfekt",
      "haben на 2-му місці",
    ],
    minSentences: 4,
    maxSentences: null,
    sampleAnswer: SAMPLE,
    checkerNote: NOTE,
    orderIndex: 0,
    material: {
      id: PRACTICE,
      moduleId: "module-1",
      module: { id: "module-1", courseId: "course-1" },
    },
    ...overrides,
  });

  const marked = {
    score: 2,
    maxScore: 3,
    marked: {
      criteria: [
        { n: 1, point: 1, comment: "" },
        { n: 2, point: 1, comment: "" },
        { n: 3, point: 0, comment: "haben стоїть у кінці." },
      ],
      corrections: [{ wrong: "gearbeitet habe", right: "habe gearbeitet", why: "дієслово друге" }],
      praise: "Гарні речення в Perfekt.",
      summary: "Попрацюйте над порядком слів.",
    },
    usage: {
      model: "claude-sonnet-5-5",
      inputTokens: 150,
      outputTokens: 260,
      cacheWriteTokens: 1950,
      cacheReadTokens: 0,
    },
  };

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
    writingCheckGrant: { aggregate: jest.Mock };
  };

  beforeEach(async () => {
    markWriting.mockReset();
    markWriting.mockResolvedValue(marked);
    process.env.ANTHROPIC_API_KEY = "test-key";

    prisma = {
      courseMaterial: {
        findUnique: jest.fn().mockResolvedValue({
          id: PRACTICE,
          moduleId: "module-1",
          module: { id: "module-1", courseId: "course-1", course: { writingChecksPerTask: 3 } },
        }),
      },
      practiceElement: {
        findUnique: jest.fn().mockResolvedValue(element()),
        findMany: jest.fn().mockResolvedValue([element()]),
      },
      writingSubmission: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockResolvedValue({}),
      },
      writingCheckGrant: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { extra: 0 } }),
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

  const send = (text = LETTER) => service.submitElement(TASK, USER, Role.student, text);

  const sentToChecker = () => markWriting.mock.calls[0][0] as Record<string, unknown>;

  describe("what reaches the checker", () => {
    it("marks the text and reports the score", async () => {
      await expect(send()).resolves.toMatchObject({
        status: "graded",
        score: 2,
        max_score: 3,
      });
    });

    /** The whole reason a per-lesson counting rule can exist without a code change. */
    it("carries the author's note for this task", async () => {
      await send();
      expect(sentToChecker().checkerNote).toBe(NOTE);
    });

    it("carries the rubric and the sample", async () => {
      await send();
      expect(sentToChecker().criteria).toHaveLength(3);
      expect(sentToChecker().sampleAnswer).toBe(SAMPLE);
    });

    it("sends the long form of the task, not the heading", async () => {
      await send();
      expect(String(sentToChecker().task)).toContain("4-6 речень");
    });
  });

  describe("what is kept afterwards", () => {
    it("stores the feedback in the shape the author asked for", async () => {
      await send();
      const stored = prisma.writingSubmission.create.mock.calls[0][0].data;
      expect(stored.assessment.criteria[2]).toMatchObject({ n: 3, point: 0 });
      expect(stored.assessment.corrections).toHaveLength(1);
      expect(stored.assessment.praise).toBeTruthy();
      expect(stored.assessment.summary).toBeTruthy();
    });

    /** Point 6 of the amendment: a month's spend has to be reportable, not estimated. */
    it("stores the model and every token count", async () => {
      await send();
      const stored = prisma.writingSubmission.create.mock.calls[0][0].data;
      expect(stored).toMatchObject({
        model: "claude-sonnet-5-5",
        inputTokens: 150,
        outputTokens: 260,
        cacheWriteTokens: 1950,
        cacheReadTokens: 0,
      });
    });
  });

  describe("what never reaches the checker", () => {
    it("turns away the sample sent as a student text", async () => {
      await expect(send(SAMPLE)).resolves.toMatchObject({
        status: "needs_more",
        reason: "copied",
      });
      expect(markWriting).not.toHaveBeenCalled();
    });

    it("turns away a text in Ukrainian", async () => {
      const ukrainian =
        "У суботу я прибрала квартиру. Потім я подзвонила братові. " +
        "Ми разом їли піцу. Увечері я читала книжку.";
      await expect(send(ukrainian)).resolves.toMatchObject({
        status: "needs_more",
        reason: "not_german",
      });
      expect(markWriting).not.toHaveBeenCalled();
    });

    it("turns away a text that is too short", async () => {
      await expect(send("Ich war zu Hause.")).resolves.toMatchObject({
        status: "needs_more",
        reason: "too_short",
      });
      expect(markWriting).not.toHaveBeenCalled();
    });

    /** The same letter with the punctuation fiddled is not a rewrite. */
    it("turns away a near-copy of an earlier attempt", async () => {
      prisma.writingSubmission.findMany.mockResolvedValue([{ text: LETTER, createdAt: new Date(0) }]);
      const fiddled = LETTER.replace(/\./g, " ...");
      await expect(send(fiddled)).resolves.toMatchObject({
        status: "needs_more",
        reason: "already_sent",
      });
      expect(markWriting).not.toHaveBeenCalled();
    });

    it("records nothing for a text it turned away", async () => {
      await send(SAMPLE);
      expect(prisma.writingSubmission.create).not.toHaveBeenCalled();
    });
  });

  /**
   * The one failure that must not be charged for. Two unreadable replies is our fault, and
   * spending the student's check on it would make our fault their problem.
   */
  describe("when the checker's answer cannot be read", () => {
    beforeEach(() => {
      markWriting.mockRejectedValue(new UnreadableMarkingError("двічі не розібрано"));
    });

    it("says the check is unavailable rather than failing", async () => {
      await expect(send()).resolves.toMatchObject({ status: "unavailable" });
    });

    it("keeps the student's check", async () => {
      const result = (await send()) as { attempts_left: number };
      expect(result.attempts_left).toBe(3);
      expect(prisma.writingSubmission.create).not.toHaveBeenCalled();
    });
  });
});
