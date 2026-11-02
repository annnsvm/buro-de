import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { QuizService } from "./quiz.service";

/**
 * Keeping what a student typed into a long test.
 *
 * A module test is answered as a whole, so until it is submitted nothing has ever reached
 * the server - and a closed tab took twenty answers with it. On a paid course that is the
 * kind of loss a student does not come back from.
 *
 * The answers are kept as a draft and nothing more: not marked, and not written as real
 * answers. Marking them would hand over the result mid-test, and recording them would have
 * them counted twice at the end.
 */
describe("the answers a student has typed into a test", () => {
  const ATTEMPT = "attempt-1";

  let service: QuizService;
  let prisma: { quizAttempt: { findUnique: jest.Mock; update: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      quizAttempt: {
        findUnique: jest.fn().mockResolvedValue({
          id: ATTEMPT,
          userId: "user-1",
          completedAt: null,
        }),
        update: jest.fn().mockResolvedValue({ id: ATTEMPT }),
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

  const save = (answers: Array<{ question_id: string; answer: string | string[] }>) =>
    service.saveDraft(ATTEMPT, "user-1", answers);

  it("keeps them against the sitting they belong to", async () => {
    await save([{ question_id: "q1", answer: "b" }]);

    expect(prisma.quizAttempt.update).toHaveBeenCalledWith({
      where: { id: ATTEMPT },
      data: {
        answersSnapshot: {
          question_q1: { question_id: "q1", answer: "b" },
        },
      },
    });
  });

  it("keeps an answer made of several choices", async () => {
    await save([{ question_id: "q1", answer: ["a", "c"] }]);

    expect(prisma.quizAttempt.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          answersSnapshot: {
            question_q1: { question_id: "q1", answer: ["a", "c"] },
          },
        },
      }),
    );
  });

  /** The draft is the whole of what the student has, so a cleared answer clears too. */
  it("replaces what was there rather than adding to it", async () => {
    await save([]);

    expect(prisma.quizAttempt.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { answersSnapshot: {} } }),
    );
  });

  /** Not marked. Nothing about being right or wrong is written, or returned. */
  it("writes no mark of any kind", async () => {
    const result = await save([{ question_id: "q1", answer: "b" }]);

    const written = prisma.quizAttempt.update.mock.calls[0][0].data;
    expect(written).not.toHaveProperty("score");
    expect(written).not.toHaveProperty("completedAt");
    expect(result).toEqual({ attempt_id: ATTEMPT, saved: 1 });
  });

  /**
   * A finished sitting is a record. Writing over it would let a student change the answers
   * behind a mark they already hold.
   */
  it("refuses to touch a sitting that is already finished", async () => {
    prisma.quizAttempt.findUnique.mockResolvedValue({
      id: ATTEMPT,
      userId: "user-1",
      completedAt: new Date("2026-11-02T10:00:00Z"),
    });

    await expect(save([{ question_id: "q1", answer: "b" }])).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.quizAttempt.update).not.toHaveBeenCalled();
  });

  /** Someone else's sitting is not found, rather than forbidden: the id is not confirmed. */
  it("does not let one student write into another's sitting", async () => {
    prisma.quizAttempt.findUnique.mockResolvedValue({
      id: ATTEMPT,
      userId: "someone-else",
      completedAt: null,
    });

    await expect(save([{ question_id: "q1", answer: "b" }])).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.quizAttempt.update).not.toHaveBeenCalled();
  });

  it("reports a sitting that does not exist as not found", async () => {
    prisma.quizAttempt.findUnique.mockResolvedValue(null);

    await expect(save([])).rejects.toBeInstanceOf(NotFoundException);
  });
});
