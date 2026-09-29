import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { ProgressService } from "./progress.service";

/**
 * Which lesson "continue" offers.
 *
 * `course_progress` holds only what has been finished, so the newest row is the lesson the
 * student just left behind. Offering that one sent them back into a lesson they had already
 * done, while opening the course itself landed on the next one — two different answers to
 * "where did I stop".
 */
describe("ProgressService resume lesson", () => {
  const COURSE = "course-1";
  const OTHER = "course-2";

  /** Eight lessons across two modules, in the order a student meets them. */
  const moduleMaterials = [
    {
      materials: [
        { id: "m1", title: "Hallo!" },
        { id: "m2", title: "Zahlen" },
        { id: "m3", title: "Ich heiße" },
      ],
    },
    {
      materials: [
        { id: "m4", title: "Mein Alltag" },
        { id: "m5", title: "Beim Arzt" },
      ],
    },
  ];

  let service: ProgressService;
  let prisma: {
    courseProgress: { findMany: jest.Mock };
    studentProfile: { findUnique: jest.Mock };
    courseModule: { findMany: jest.Mock };
  };

  const done = (materialId: string, at: string, courseId = COURSE) => ({
    courseId,
    courseMaterialId: materialId,
    completedAt: new Date(at),
    score: null,
    course: { id: courseId, title: "Deutsch A2.1", level: "A2" },
    courseMaterial: { id: materialId },
  });

  beforeEach(async () => {
    prisma = {
      courseProgress: { findMany: jest.fn().mockResolvedValue([]) },
      studentProfile: { findUnique: jest.fn().mockResolvedValue({ level: "A2" }) },
      /**
       * `getMyProgress` asks for modules twice and for different things: once to count a
       * course's materials, once for the materials themselves. The mock answers by which
       * of the two was asked.
       */
      courseModule: {
        findMany: jest.fn((args: { select?: Record<string, unknown> }) =>
          Promise.resolve(
            args.select?._count
              ? [{ courseId: COURSE, _count: { materials: 5 } }]
              : moduleMaterials,
          ),
        ),
      },
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: CourseMaterialService,
          useValue: { assertCanAccessCourse: jest.fn(), assertCanAccessModule: jest.fn() },
        },
      ],
    }).compile();
    service = moduleRef.get(ProgressService);
  });

  const resume = async () => (await service.getMyProgress("user-1")).resume;

  it("offers the first lesson not yet finished, not the one just finished", async () => {
    prisma.courseProgress.findMany.mockResolvedValue([
      done("m1", "2026-09-01"),
      done("m2", "2026-09-02"),
    ]);

    expect(await resume()).toMatchObject({
      material_id: "m3",
      material_title: "Ich heiße",
      lesson_number: 3,
      lesson_total: 5,
    });
  });

  it("skips over a gap, so a lesson done out of order is not offered again", async () => {
    // The student jumped ahead to m3; m2 is still the one waiting.
    prisma.courseProgress.findMany.mockResolvedValue([
      done("m1", "2026-09-01"),
      done("m3", "2026-09-03"),
    ]);

    expect(await resume()).toMatchObject({ material_id: "m2", lesson_number: 2 });
  });

  it("follows the course worked in most recently", async () => {
    prisma.courseProgress.findMany.mockResolvedValue([
      done("x1", "2026-09-10", OTHER),
      done("m1", "2026-09-01"),
    ]);

    expect(await resume()).toMatchObject({ course_id: OTHER });
  });

  it("points at the last lesson once the whole course is done", async () => {
    prisma.courseProgress.findMany.mockResolvedValue(
      ["m1", "m2", "m3", "m4", "m5"].map((id, index) =>
        done(id, `2026-09-0${index + 1}`),
      ),
    );

    expect(await resume()).toMatchObject({ material_id: "m5", lesson_number: 5 });
  });

  it("carries the course name and level for the card", async () => {
    prisma.courseProgress.findMany.mockResolvedValue([done("m1", "2026-09-01")]);

    expect(await resume()).toMatchObject({
      course_title: "Deutsch A2.1",
      course_level: "A2",
    });
  });

  describe("when there is nothing to continue", () => {
    it("says so for a student who has finished nothing", async () => {
      expect(await resume()).toBeNull();
    });

    it("says so when the course has no lessons at all", async () => {
      prisma.courseProgress.findMany.mockResolvedValue([done("m1", "2026-09-01")]);
      prisma.courseModule.findMany.mockImplementation(() => Promise.resolve([]));

      expect(await resume()).toBeNull();
    });
  });
});
