import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { PaymentService } from "./payment.service";

describe("PaymentService", () => {
  let service: PaymentService;
  let prisma: {
    payment: { findMany: jest.Mock };
  };

  const userId = "u1000000-0000-0000-0000-000000000001";

  beforeEach(async () => {
    prisma = {
      payment: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(PaymentService);
  });

  describe("getMyPayments", () => {
    it("повертає порожній масив", async () => {
      prisma.payment.findMany.mockResolvedValue([]);
      const out = await service.getMyPayments(userId);
      expect(out).toEqual([]);
      expect(prisma.payment.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    });

    it("мапить amount у number і snake_case поля", async () => {
      const created = new Date("2026-01-01T00:00:00.000Z");
      prisma.payment.findMany.mockResolvedValue([
        {
          id: "pay1",
          userId,
          courseId: "c1",
          subscriptionId: null,
          stripeInvoiceId: "in_1",
          amount: { toString: () => "29.99" },
          currency: "eur",
          status: "paid",
          createdAt: created,
        },
      ]);

      const out = await service.getMyPayments(userId);
      expect(out[0]).toMatchObject({
        id: "pay1",
        user_id: userId,
        course_id: "c1",
        stripe_invoice_id: "in_1",
        amount: 29.99,
        currency: "eur",
        status: "paid",
      });
    });
  });
});
