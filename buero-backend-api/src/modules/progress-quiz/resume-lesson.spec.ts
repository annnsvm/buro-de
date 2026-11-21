import { ForbiddenException, NotFoundException } from "@nestjs/common";
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
    courseResumePoint: { findFirst: jest.Mock };
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
      /** No bookmark by default: these cases are about the fallback rule. */
      courseResumePoint: { findFirst: jest.fn().mockResolvedValue(null) },
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


/**
 * Where the student was actually reading.
 *
 * Progress records only what was *finished*, so it could never see a lesson opened and left
 * half-read: the card pointed at the first unfinished lesson, often one already read past.
 * Every lesson a student opens now writes a resume point, and that is the answer when there
 * is one. The author asked for exactly this: the last lesson opened, not the last finished.
 */
describe("continue, when the student has a bookmark", () => {
  let service: ProgressService;
  let prisma: {
    courseProgress: { findMany: jest.Mock };
    studentProfile: { findUnique: jest.Mock };
    courseModule: { findMany: jest.Mock };
    courseResumePoint: { findFirst: jest.Mock };
  };

  const bookmark = (courseId: string, materialId: string, title: string) => ({
    courseId,
    courseMaterialId: materialId,
    course: { title, level: "A2" },
  });

  beforeEach(async () => {
    prisma = {
      courseProgress: { findMany: jest.fn().mockResolvedValue([]) },
      studentProfile: { findUnique: jest.fn().mockResolvedValue(null) },
      courseModule: { findMany: jest.fn().mockImplementation(
        (args: { select?: { _count?: unknown } }) => {
          if (args.select && "_count" in args.select) return Promise.resolve([]);
          return Promise.resolve([
            {
              materials: [
                { id: "a21-m1", title: "Lesson 1" },
                { id: "a21-m2", title: "Lesson 2" },
                { id: "a21-m3", title: "Lesson 3" },
              ],
            },
          ]);
        },
      ) },
      courseResumePoint: { findFirst: jest.fn().mockResolvedValue(null) },
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

  it("offers the lesson they last opened, not the next unfinished one", async () => {
    prisma.courseResumePoint.findFirst.mockResolvedValue(
      bookmark(A21, "a21-m3", "Deutsch A2.1"),
    );
    prisma.courseProgress.findMany.mockResolvedValue([]);

    await expect(resume()).resolves.toMatchObject({
      course_id: A21,
      material_id: "a21-m3",
      lesson_number: 3,
    });
  });

  /**
   * The case the author described: lesson 3 opened and left half-read while lessons 1 and 2
   * are finished. The old rule offered lesson 3 as "first unfinished" by luck; this one
   * offers it because that is where they were - and it still works when they have read
   * ahead to a lesson they never finished.
   */
  it("offers a lesson read past, which the old rule could not", async () => {
    prisma.courseResumePoint.findFirst.mockResolvedValue(
      bookmark(A21, "a21-m1", "Deutsch A2.1"),
    );
    prisma.courseProgress.findMany.mockResolvedValue([
      {
        courseId: A21,
        courseMaterialId: "a21-m1",
        completedAt: new Date(Date.UTC(2026, 9, 20)),
        course: { id: A21, title: "Deutsch A2.1", level: "A2" },
        courseMaterial: { id: "a21-m1" },
      },
    ]);

    /** Lesson 1 is finished, so the old rule would have said lesson 2. */
    await expect(resume()).resolves.toMatchObject({ material_id: "a21-m1" });
  });

  it("takes the course from the bookmark as well as the lesson", async () => {
    prisma.courseResumePoint.findFirst.mockResolvedValue(
      bookmark(A21, "a21-m2", "Deutsch A2.1"),
    );
    prisma.courseProgress.findMany.mockResolvedValue([
      {
        courseId: A1,
        courseMaterialId: "a1-m1",
        completedAt: new Date(Date.UTC(2026, 9, 29)),
        course: { id: A1, title: "Deutsch A1", level: "A1" },
        courseMaterial: { id: "a1-m1" },
      },
    ]);

    await expect(resume()).resolves.toMatchObject({
      course_id: A21,
      course_title: "Deutsch A2.1",
      material_id: "a21-m2",
    });
  });

  /** A lesson deleted since it was opened must not leave the card blank. */
  it("falls back to the old rule when the bookmarked lesson is gone", async () => {
    prisma.courseResumePoint.findFirst.mockResolvedValue(
      bookmark(A21, "deleted-material", "Deutsch A2.1"),
    );
    prisma.courseProgress.findMany.mockResolvedValue([]);

    await expect(resume()).resolves.toMatchObject({ material_id: "a21-m1" });
  });

  it("offers nothing to a student with neither a bookmark nor progress", async () => {
    await expect(resume()).resolves.toBeNull();
  });
});


/**
 * Reporting that a lesson was opened.
 *
 * The first attempt hung this on `GET .../course-materials/:id`, which only the editor
 * calls: a student receives the whole course tree in one request and moves between lessons
 * inside the page, asking the server for nothing. So nothing was ever written, and
 * "continue" went on guessing from finished work - exactly the bug it was meant to fix.
 *
 * Hence a route of its own, and these tests check it writes, and refuses what it should.
 */
describe('reporting that a lesson was opened', () => {
  let service: ProgressService;
  let prisma: {
    courseMaterial: { findFirst: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock };
    courseResumePoint: { upsert: jest.Mock };
  };

  const COURSE = 'course-a21';
  const MATERIAL = 'a21-m3';

  beforeEach(async () => {
    prisma = {
      courseMaterial: { findFirst: jest.fn().mockResolvedValue({ id: MATERIAL }) },
      userCourseAccess: { findUnique: jest.fn().mockResolvedValue({ id: 'access-1' }) },
      courseResumePoint: { upsert: jest.fn() },
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

  it('writes the bookmark for this course', async () => {
    await service.markLessonOpened(USER, COURSE, MATERIAL);

    expect(prisma.courseResumePoint.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_courseId: { userId: USER, courseId: COURSE } },
        create: { userId: USER, courseId: COURSE, courseMaterialId: MATERIAL },
      }),
    );
  });

  /** One bookmark per course: opening a second lesson moves it, it does not add a row. */
  it('moves the bookmark rather than adding another', async () => {
    await service.markLessonOpened(USER, COURSE, MATERIAL);
    const call = prisma.courseResumePoint.upsert.mock.calls[0][0] as {
      update: { courseMaterialId: string; openedAt: Date };
    };
    expect(call.update.courseMaterialId).toBe(MATERIAL);
    expect(call.update.openedAt).toBeInstanceOf(Date);
  });

  /** A bookmark is read back later, so it must never name a lesson of another course. */
  it('refuses a material that is not in that course', async () => {
    prisma.courseMaterial.findFirst.mockResolvedValue(null);
    await expect(
      service.markLessonOpened(USER, COURSE, 'someone-elses-lesson'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.courseResumePoint.upsert).not.toHaveBeenCalled();
  });

  it('refuses a course the student has no access to', async () => {
    prisma.userCourseAccess.findUnique.mockResolvedValue(null);
    await expect(
      service.markLessonOpened(USER, COURSE, MATERIAL),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.courseResumePoint.upsert).not.toHaveBeenCalled();
  });
});
