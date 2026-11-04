import { Test, TestingModule } from "@nestjs/testing";
import { QuizMode } from "../../../generated/prisma/enums";
import { PrismaService } from "../../../prisma/prisma.service";
import { QuestionImportService } from "./question-import.service";

/**
 * What a student sees the moment a CSV lands: nothing.
 *
 * The questions and texts an import brings in were drafts from the start, but the material
 * around them was not - so uploading eight practices put eight empty practices into every
 * student's lesson list at once. An empty practice is worse than a missing one: it reads as
 * the course being broken rather than as a course still being written.
 *
 * So a material an import creates is a draft too, and the module is released as one act.
 */
const COURSE = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const MODULE = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";

describe("a freshly imported material", () => {
  let service: QuestionImportService;
  let created: Array<Record<string, unknown>>;
  let prisma: Record<string, unknown>;

  beforeEach(async () => {
    created = [];
    const tx = {
      courseMaterial: {
        update: jest.fn(),
        create: jest.fn((args: { data: Record<string, unknown> }) => {
          created.push(args.data);
          return Promise.resolve({ id: `mat-${created.length}` });
        }),
      },
      question: {
        deleteMany: jest.fn(),
        upsert: jest.fn(),
        createMany: jest.fn(),
        updateMany: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
      practiceElement: {
        upsert: jest.fn().mockResolvedValue({ id: "el-1" }),
        deleteMany: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    prisma = {
      courseModule: { findFirst: jest.fn().mockResolvedValue({ id: MODULE }) },
      courseMaterial: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        aggregate: jest.fn().mockResolvedValue({ _max: { orderIndex: 2 } }),
      },
      $transaction: jest.fn(
        (fn: (t: typeof tx) => Promise<unknown>) => fn(tx) as Promise<unknown>,
      ),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionImportService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();
    service = mod.get(QuestionImportService);
  });

  /** Her own column names, so the parser is the real one and not a stand-in. */
  const csv = [
    "ID,Урок,Тип,Питання,A,B,C,D,Правильна відповідь,Пояснення,Блок,Матеріал",
    "2.1.G1,2.1 - Dativ,ONE,Wem hilfst du?,dem Mann,der Mann,den Mann,,A) dem Mann,Dativ після helfen.,Grammatik,",
  ].join("\n");

  const commit = () =>
    service.commit(COURSE, MODULE, csv, QuizMode.practice);

  it("is created as a draft, so no student sees it", async () => {
    await commit().catch(() => undefined);

    /**
     * The assertion that matters: not "the questions are hidden" - they always were - but
     * that the material carries no publication date of its own.
     */
    expect(created.length).toBeGreaterThan(0);
    for (const data of created) {
      expect(data.publishedAt).toBeNull();
    }
  });
});
