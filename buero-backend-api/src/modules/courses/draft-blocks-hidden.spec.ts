import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { Role } from "../../generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { UserService } from "../user/user.service";
import { PaymentFulfillmentService } from "../subscriptions/payment-fulfillment.service";
import { CourseService } from "./course.service";

/**
 * Which parts of a practice a student is told exist.
 *
 * The lesson list names a practice's blocks underneath it - "Grammatik, Lesen" - and the
 * list came from counting questions, every question, drafts included. So the teacher could
 * publish a practice that had no Grammatik, add Grammatik a week later, and a student would
 * see the word appear in the list with nothing behind it: a task promised and an empty
 * screen delivered, which is the same broken look as an empty practice.
 *
 * The teacher's own count still includes drafts. She has to see the block to publish it.
 */
const COURSE = "cccccccc-cccc-cccc-cccc-cccccccccccc";

describe("the blocks a practice says it has", () => {
  let service: CourseService;
  let prisma: {
    course: { findUnique: jest.Mock };
    courseModule: { findMany: jest.Mock };
    courseMaterial: { findMany: jest.Mock; groupBy: jest.Mock };
    question: { groupBy: jest.Mock };
    materialAttachment: { findMany: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock };
    quizAttempt: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      course: {
        findUnique: jest.fn().mockResolvedValue({
          id: COURSE,
          isPublished: true,
          trialModuleCount: 2,
        }),
      },
      courseModule: { findMany: jest.fn().mockResolvedValue([]) },
      courseMaterial: {
        findMany: jest.fn().mockResolvedValue([]),
        groupBy: jest.fn().mockResolvedValue([]),
      },
      question: { groupBy: jest.fn().mockResolvedValue([]) },
      materialAttachment: { findMany: jest.fn().mockResolvedValue([]) },
      userCourseAccess: { findUnique: jest.fn().mockResolvedValue(null) },
      quizAttempt: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: CloudinaryService, useValue: {} },
        { provide: ConfigService, useValue: { get: () => undefined } },
        { provide: UserService, useValue: {} },
        { provide: PaymentFulfillmentService, useValue: {} },
      ],
    }).compile();
    service = mod.get(CourseService);
  });

  const blockFilterOf = () =>
    prisma.question.groupBy.mock.calls[0][0].where as Record<string, unknown>;

  it("counts only published questions for a student", async () => {
    await service.findById(COURSE, true, { id: "stu", role: Role.student });

    expect(blockFilterOf()).toMatchObject({ publishedAt: { not: null } });
  });

  it("counts drafts too for the teacher, so she can publish them", async () => {
    await service.findById(COURSE, true, { id: "t1", role: Role.teacher });

    expect(blockFilterOf()).not.toHaveProperty("publishedAt");
  });

  /** A guest is not a teacher either. */
  it("counts only published questions when nobody is signed in", async () => {
    await service.findById(COURSE, true, null);

    expect(blockFilterOf()).toMatchObject({ publishedAt: { not: null } });
  });

  it("hides a draft material from a student and keeps it for the teacher", async () => {
    await service.findById(COURSE, true, { id: "stu", role: Role.student });
    expect(prisma.courseMaterial.findMany.mock.calls[0][0].where).toMatchObject({
      publishedAt: { not: null },
    });

    prisma.courseMaterial.findMany.mockClear();
    await service.findById(COURSE, true, { id: "t1", role: Role.teacher });
    expect(prisma.courseMaterial.findMany.mock.calls[0][0].where).not.toHaveProperty(
      "publishedAt",
    );
  });
});
