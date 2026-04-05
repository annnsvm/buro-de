import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { UserCourseAccessType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeService } from "../stripe/stripe.service";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { SubscriptionsService } from "./subscriptions.service";

describe("SubscriptionsService", () => {
  let service: SubscriptionsService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    course: { findUnique: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock; findMany: jest.Mock };
  };
  let configGet: jest.Mock;
  let stripeService: {
    createCustomer: jest.Mock;
    createCheckoutSession: jest.Mock;
    createBillingPortalSession: jest.Mock;
  };

  const userId = "u1000000-0000-0000-0000-000000000001";
  const courseId = "c1000000-0000-0000-0000-000000000001";

  beforeEach(async () => {
    configGet = jest.fn((key: string) => {
      if (key === "CORS_ORIGIN") return "http://localhost:5173";
      if (key === "STRIPE_PORTAL_RETURN_URL") return "http://localhost:5173/account";
      return undefined;
    });

    prisma = {
      user: { findUnique: jest.fn(), update: jest.fn() },
      course: { findUnique: jest.fn() },
      userCourseAccess: { findUnique: jest.fn(), findMany: jest.fn() },
    };

    stripeService = {
      createCustomer: jest.fn().mockResolvedValue({ id: "cus_test" }),
      createCheckoutSession: jest
        .fn()
        .mockResolvedValue({ url: "https://checkout.stripe.com/test" }),
      createBillingPortalSession: jest
        .fn()
        .mockResolvedValue({ url: "https://billing.stripe.com/test" }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: ConfigService, useValue: { get: configGet } },
        { provide: StripeService, useValue: stripeService },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
  });

  describe("createCheckoutSession", () => {
    const dto: CreateCheckoutDto = { course_id: courseId };

    it("404 якщо користувача немає", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.createCheckoutSession(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("404 якщо курсу немає", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "a@b.c",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.createCheckoutSession(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("409 якщо вже є purchase", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "a@b.c",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: "price_1",
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: UserCourseAccessType.purchase,
      });
      await expect(service.createCheckoutSession(userId, dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it("400 якщо у курсу немає stripe_price_id", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "a@b.c",
        stripeCustomerId: "cus_x",
      });
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: null,
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);
      await expect(service.createCheckoutSession(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("створює customer і повертає url", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "a@b.c",
        stripeCustomerId: null,
      });
      prisma.user.update.mockResolvedValue({});
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        stripePriceId: "price_1",
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);

      const out = await service.createCheckoutSession(userId, dto);
      expect(out.url).toBe("https://checkout.stripe.com/test");
      expect(stripeService.createCustomer).toHaveBeenCalled();
      expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: "cus_test",
          priceId: "price_1",
        }),
      );
    });
  });

  describe("getMyCourseAccess (аналог «getMySubscription» — доступи до курсів)", () => {
    it("мапить записи user_course_access", async () => {
      const created = new Date("2026-01-01T00:00:00.000Z");
      prisma.userCourseAccess.findMany.mockResolvedValue([
        {
          id: "acc1",
          courseId,
          accessType: UserCourseAccessType.trial,
          trialEndsAt: null,
          paymentId: null,
          subscriptionId: null,
          createdAt: created,
        },
      ]);

      const list = await service.getMyCourseAccess(userId);
      expect(list).toHaveLength(1);
      expect(list[0]).toMatchObject({
        course_id: courseId,
        access_type: UserCourseAccessType.trial,
        created_at: created,
      });
    });
  });

  describe("createPortalSession", () => {
    it("404 якщо user не знайдено", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.createPortalSession(userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("400 якщо немає stripe customer", async () => {
      prisma.user.findUnique.mockResolvedValue({ stripeCustomerId: null });
      await expect(service.createPortalSession(userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("повертає url порталу", async () => {
      prisma.user.findUnique.mockResolvedValue({
        stripeCustomerId: "cus_test",
      });
      const out = await service.createPortalSession(userId);
      expect(out.url).toBe("https://billing.stripe.com/test");
      expect(stripeService.createBillingPortalSession).toHaveBeenCalledWith(
        expect.objectContaining({ customerId: "cus_test" }),
      );
    });
  });
});
