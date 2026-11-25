import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PaymentFulfillmentService } from "../subscriptions/payment-fulfillment.service";
import { UserService } from "../user/user.service";
import { CourseService } from "./course.service";

/**
 * A duration the author typed is not quietly replaced by the arithmetic.
 *
 * Course length is normally worked out rather than written: the editor adds up every
 * video and saves the total whenever the structure changes - and on merely opening the
 * course, because it syncs on load. That is right nearly always, and wrong in the cases a
 * sum cannot see: a course whose work is in the writing tasks rather than the watching, or
 * one still being filmed, where the honest figure is what the author intends and not what
 * has been uploaded so far.
 *
 * So the author can set the number, and `duration_hours_manual` marks that they did.
 * Without the mark, the next automatic save would undo it, and - because the sync runs on
 * load - it would be undone by nothing more than opening the course to look at it.
 *
 * The rule lives on the server rather than in the editor because it is about the course,
 * not about one screen: a second browser tab left open would otherwise be enough.
 */
const COURSE = "cccccccc-cccc-cccc-cccc-cccccccccccc";

describe("a course duration set by hand", () => {
  let service: CourseService;
  let prisma: {
    course: {
      findUnique: jest.Mock;
      update: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
      aggregate: jest.Mock;
    };
    courseModule: { findMany: jest.Mock };
    courseMaterial: { groupBy: jest.Mock; findMany: jest.Mock };
    materialAttachment: { findMany: jest.Mock };
    question: { groupBy: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock };
    $queryRaw: jest.Mock;
  };

  const existing = (manual: boolean) => ({
    id: COURSE,
    title: "Deutsch A1",
    price: 100,
    isPublished: true,
    durationHoursManual: manual,
  });

  /** What Prisma was actually asked to write. */
  const written = () =>
    prisma.course.update.mock.calls[0]?.[0]?.data as Record<string, unknown>;

  beforeEach(async () => {
    prisma = {
      course: {
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({ id: COURSE, price: 100 }),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _max: { orderIndex: null } }),
      },
      courseModule: { findMany: jest.fn().mockResolvedValue([]) },
      courseMaterial: {
        groupBy: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
      materialAttachment: { findMany: jest.fn().mockResolvedValue([]) },
      question: { groupBy: jest.fn().mockResolvedValue([]) },
      userCourseAccess: { findUnique: jest.fn() },
      $queryRaw: jest.fn().mockResolvedValue([]),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: ConfigService, useValue: { get: jest.fn(() => "eur") } },
        { provide: UserService, useValue: { findUserById: jest.fn() } },
        { provide: CloudinaryService, useValue: { uploadImage: jest.fn() } },
        {
          provide: PaymentFulfillmentService,
          useValue: { reconcilePendingForUser: jest.fn() },
        },
      ],
    }).compile();
    service = mod.get(CourseService);
  });

  describe("while the course is on automatic", () => {
    it("takes the sum the editor worked out", async () => {
      prisma.course.findUnique.mockResolvedValue(existing(false));

      await service.update(COURSE, { duration_hours: 9 });

      expect(written()).toMatchObject({ durationHours: 9 });
    });
  });

  describe("once the author has set it", () => {
    /** The regression this exists for: the sync that runs on load, undoing their figure. */
    it("ignores the sum the editor worked out", async () => {
      prisma.course.findUnique.mockResolvedValue(existing(true));

      await service.update(COURSE, { duration_hours: 9 });

      expect(written()).not.toHaveProperty("durationHours");
    });

    /** Everything else in the same request still goes through. */
    it("saves the rest of the request as usual", async () => {
      prisma.course.findUnique.mockResolvedValue(existing(true));

      await service.update(COURSE, { duration_hours: 9, title: "Deutsch A2" });

      expect(written()).toMatchObject({ title: "Deutsch A2" });
      expect(written()).not.toHaveProperty("durationHours");
    });

    /** The author changing their own number is not the sum, and is always obeyed. */
    it("takes a new number from the author", async () => {
      prisma.course.findUnique.mockResolvedValue(existing(true));

      await service.update(COURSE, {
        duration_hours: 14,
        duration_hours_manual: true,
      });

      expect(written()).toMatchObject({
        durationHours: 14,
        durationHoursManual: true,
      });
    });

    /** And handing it back to the arithmetic takes the figure that comes with it. */
    it("goes back to automatic when asked, with the sum of the moment", async () => {
      prisma.course.findUnique.mockResolvedValue(existing(true));

      await service.update(COURSE, {
        duration_hours: 9,
        duration_hours_manual: false,
      });

      expect(written()).toMatchObject({
        durationHours: 9,
        durationHoursManual: false,
      });
    });
  });
});
