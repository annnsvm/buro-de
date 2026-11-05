import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import { PaymentFulfillmentService } from "./payment-fulfillment.service";

describe("PaymentFulfillmentService", () => {
  let service: PaymentFulfillmentService;
  let prisma: {
    payment: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    userCourseAccess: { upsert: jest.Mock };
    /** Read after the transaction, for the receipt. */
    user: { findUnique: jest.Mock };
    course: { findUnique: jest.Mock };
    $transaction: jest.Mock;
  };
  let wayForPay: {
    isConfigured: jest.Mock;
    checkStatus: jest.Mock;
    isApproved: jest.Mock;
    isPendingStatus: jest.Mock;
  };
  let mailer: { send: jest.Mock; resolveLogo: jest.Mock; getSiteUrl: jest.Mock };

  const userId = "11111111-1111-1111-1111-111111111111";
  const courseId = "22222222-2222-2222-2222-222222222222";
  const paymentId = "33333333-3333-3333-3333-333333333333";
  const orderReference = "bd-1700000000000-abcd1234";

  beforeEach(async () => {
    prisma = {
      payment: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({
          id: paymentId,
          userId,
          courseId,
          status: "pending",
        }),
        update: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      userCourseAccess: { upsert: jest.fn() },
      /** Read after the transaction, for the receipt. */
      user: {
        findUnique: jest.fn().mockResolvedValue({
          email: "anna@example.com",
          name: "Anna",
          language: "uk",
        }),
      },
      course: {
        findUnique: jest.fn().mockResolvedValue({ title: "Deutsch A2.1" }),
      },
      /**
       * markPaid writes the payment status and the course access inside one transaction.
       * Run the callback against the same mock so assertions keep seeing the calls.
       */
      $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
        callback(prisma),
      ),
    };

    mailer = {
      send: jest.fn().mockResolvedValue(undefined),
      resolveLogo: jest.fn().mockReturnValue({ logoUrl: "https://x/logo.png" }),
      getSiteUrl: jest.fn().mockReturnValue("https://buero.de"),
    };

    wayForPay = {
      isConfigured: jest.fn(() => true),
      checkStatus: jest.fn(),
      isApproved: jest.fn((status: string) => status === "Approved"),
      isPendingStatus: jest.fn((status: string) => status === "InProcessing"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentFulfillmentService,
        {
          provide: PrismaService,
          useValue: prisma as unknown as PrismaService,
        },
        { provide: WayForPayService, useValue: wayForPay },
        {
          provide: MailerService,
          useValue: mailer as unknown as MailerService,
        },
      ],
    }).compile();

    service = module.get(PaymentFulfillmentService);
  });

  describe("reconcilePendingForUser", () => {
    const queuePending = () =>
      prisma.payment.findMany.mockResolvedValue([{ orderReference }]);

    it("grants access when WayForPay confirms the payment after the user left", async () => {
      queuePending();
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "Approved",
        amount: 1,
        currency: "EUR",
      });

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: paymentId },
          data: expect.objectContaining({ status: "paid" }),
        }),
      );
      expect(prisma.userCourseAccess.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_courseId: { userId, courseId } },
        }),
      );
    });

    it("leaves still-processing payments untouched", async () => {
      queuePending();
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "InProcessing",
      });

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.update).not.toHaveBeenCalled();
      expect(prisma.payment.updateMany).not.toHaveBeenCalled();
      expect(prisma.userCourseAccess.upsert).not.toHaveBeenCalled();
    });

    it("marks declined payments as failed without granting access", async () => {
      queuePending();
      wayForPay.checkStatus.mockResolvedValue({
        transactionStatus: "Declined",
        reason: "Insufficient funds",
      });

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { orderReference, status: "pending" },
          data: { status: "failed" },
        }),
      );
      expect(prisma.userCourseAccess.upsert).not.toHaveBeenCalled();
    });

    it("never breaks the course list when WayForPay is unreachable", async () => {
      queuePending();
      wayForPay.checkStatus.mockRejectedValue(new Error("network down"));

      await expect(
        service.reconcilePendingForUser(userId),
      ).resolves.toBeUndefined();
    });

    it("skips the WayForPay round trip when it is not configured", async () => {
      wayForPay.isConfigured.mockReturnValue(false);

      await service.reconcilePendingForUser(userId);

      expect(prisma.payment.findMany).not.toHaveBeenCalled();
    });
  });

  /**
   * The receipt a student gets when a course opens for them.
   *
   * WayForPay confirms that money moved; nothing said what had been bought or where it
   * now was, so a purchase ended in silence and the course simply appeared for whoever
   * thought to go and look.
   */
  describe("telling the student the course is open", () => {
    const paid = () =>
      service.markPaid({ orderReference, amount: 30, currency: "EUR" });

    beforeEach(() => {
      prisma.payment.findUnique.mockImplementation(
        (args: { select?: unknown }) =>
          Promise.resolve(
            args.select
              ? { amount: 30, currency: "eur" }
              : { id: paymentId, userId, courseId, status: "pending" },
          ),
      );
    });

    it("sends it to the address on the account", async () => {
      await paid();

      expect(mailer.send).toHaveBeenCalledTimes(1);
      expect(mailer.send.mock.calls[0][0].to).toBe("anna@example.com");
    });

    it("names the course and what was paid", async () => {
      await paid();

      const text = mailer.send.mock.calls[0][0].text as string;
      expect(text).toContain("Deutsch A2.1");
      expect(text).toContain("30.00 EUR");
    });

    it("links straight to the course, not to the catalogue", async () => {
      await paid();

      expect(mailer.send.mock.calls[0][0].text as string).toContain(
        `https://buero.de/courses/${courseId}`,
      );
    });

    /**
     * `markPaid` runs from the webhook and again from the reconciliation that fires when
     * the student returns to the success page. Without the guard the same purchase is
     * announced twice.
     */
    it("says it once, however many times the payment is confirmed", async () => {
      await paid();
      prisma.payment.findUnique.mockImplementation(
        (args: { select?: unknown }) =>
          Promise.resolve(
            args.select
              ? { amount: 30, currency: "eur" }
              : { id: paymentId, userId, courseId, status: "paid" },
          ),
      );

      await paid();

      expect(mailer.send).toHaveBeenCalledTimes(1);
    });

    /**
     * The one that matters most. A mail server that is down must not undo a payment, nor
     * make the webhook retry a fulfilment that already happened: the student has their
     * course either way, and a missing receipt is the smaller problem.
     */
    it("still opens the course when the email cannot be sent", async () => {
      mailer.send.mockRejectedValue(new Error("smtp is down"));

      await expect(paid()).resolves.toEqual({ granted: true });
      expect(prisma.userCourseAccess.upsert).toHaveBeenCalled();
    });

    it("sends nothing when the payment bought no course", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: paymentId,
        userId,
        courseId: null,
        status: "pending",
      });

      await service.markPaid({ orderReference });

      expect(mailer.send).not.toHaveBeenCalled();
    });
  });
});
