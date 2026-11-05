import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { ProgressService } from "./progress.service";

/**
 * "Continue where you left off", and which course that is.
 *
 * `course_progress` holds two kinds of row: one that names a material the student
 * finished, and one that names only the course. The second kind is older and says no more
 * than "something happened here, then" - but that is exactly the question being asked, and
 * skipping those rows meant the newest thing a student had done could lose to an older
 * one. The card offered an A1 lesson already finished on the 28th while the newest row,
 * for A2.1 on the 29th, was thrown away for having no material id.
 *
 * The rows that name a material still decide what counts as *done*; only the choice of
 * course reads them all.
 */
const USER = "u1";
const A1 = "course-a1";
const A21 = "course-a21";

describe("the lesson offered as continue", () => {
  let service: ProgressService;
  let prisma: {
    courseProgress: { findMany: jest.Mock };
    studentProfile: { findUnique: jest.Mock };
    courseModule: { findMany: jest.Mock };
  };

  const row = (
    courseId: string,
    title: string,
    materialId: string | null,
    day: number,
  ) => ({
    courseId,
    courseMaterialId: materialId,
    completedAt: new Date(Date.UTC(2026, 9, day)),
    course: { id: courseId, title, level: "A1" },
    courseMaterial: materialId ? { id: materialId } : null,
  });

  const arrange = (rows: ReturnType<typeof row>[]) => {
    prisma.courseProgress.findMany.mockResolvedValue(rows);
    prisma.courseModule.findMany.mockImplementation(
      (args: { where: { courseId?: string }; select?: { _count?: unknown } }) => {
        /** The counting query, which only needs a shape. */
        if (args.select && "_count" in args.select) return Promise.resolve([]);
        const forA21 = args.where.courseId === A21;
        return Promise.resolve([
          {
            materials: forA21
              ? [
                  { id: "a21-m1", title: "Lesson 1" },
                  { id: "a21-m2", title: "Lesson 2" },
                ]
              : [{ id: "a1-m1", title: "Begrüßung" }],
          },
        ]);
      },
    );
  };

  beforeEach(async () => {
    prisma = {
      courseProgress: { findMany: jest.fn().mockResolvedValue([]) },
      studentProfile: { findUnique: jest.fn().mockResolvedValue(null) },
      courseModule: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: CourseMaterialService, useValue: {} },
      ],
    }).compile();
    service = mod.get(ProgressService);
  });

  const resume = async () => (await service.getMyProgress(USER)).resume;

  /** The exact reported case: the newest row names no material, and used to be ignored. */
  it("follows the newest row even when it names no material", async () => {
    arrange([
      row(A21, "Deutsch A2.1", null, 29),
      row(A1, "Deutsch A1", "a1-m1", 28),
    ]);

    await expect(resume()).resolves.toMatchObject({ course_id: A21 });
  });

  it("offers the first lesson of that course not yet finished", async () => {
    arrange([
      row(A21, "Deutsch A2.1", null, 29),
      row(A21, "Deutsch A2.1", "a21-m1", 20),
    ]);

    await expect(resume()).resolves.toMatchObject({
      material_id: "a21-m2",
      lesson_number: 2,
      lesson_total: 2,
    });
  });

  /**
   * A row with no material says where the student was, never what they finished. Counting
   * it as done would skip a lesson nobody had taken.
   */
  it("does not count a row with no material as a finished lesson", async () => {
    arrange([row(A21, "Deutsch A2.1", null, 29)]);

    await expect(resume()).resolves.toMatchObject({
      material_id: "a21-m1",
      lesson_number: 1,
    });
  });

  it("still prefers a material row when it is the newest", async () => {
    arrange([
      row(A1, "Deutsch A1", "a1-m1", 30),
      row(A21, "Deutsch A2.1", null, 29),
    ]);

    await expect(resume()).resolves.toMatchObject({ course_id: A1 });
  });

  it("offers nothing to a student who has done nothing", async () => {
    arrange([]);

    await expect(resume()).resolves.toBeNull();
  });
});
