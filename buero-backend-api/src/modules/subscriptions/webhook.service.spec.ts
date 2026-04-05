import { Test, TestingModule } from "@nestjs/testing";
import type Stripe from "stripe";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeService } from "../stripe/stripe.service";
import { WebhookService } from "./webhook.service";

describe("WebhookService", () => {
  let service: WebhookService;
  let prisma: {
    stripeWebhookEvent: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let stripeService: {
    constructWebhookEvent: jest.Mock;
    getClient: jest.Mock;
  };

  const rawBody = Buffer.from("{}");
  const signature = "sig_test";

  function makeEvent(
    id: string,
    type: string,
  ): Pick<Stripe.Event, "id" | "type" | "data"> {
    return {
      id,
      type,
      data: { object: {} } as Stripe.Event["data"],
    } as Stripe.Event;
  }

  beforeEach(async () => {
    prisma = {
      stripeWebhookEvent: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    stripeService = {
      constructWebhookEvent: jest.fn(),
      getClient: jest.fn().mockReturnValue({
        subscriptions: {
          retrieve: jest.fn(),
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: StripeService, useValue: stripeService },
      ],
    }).compile();

    service = module.get(WebhookService);
  });

  describe("handleStripeWebhook — ідемпотентність", () => {
    it("друга доставка того самого event.id не викликає create вдруге", async () => {
      const event = makeEvent("evt_idem_1", "charge.succeeded");
      stripeService.constructWebhookEvent.mockReturnValue(event);

      prisma.stripeWebhookEvent.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: "db1",
          stripeEventId: event.id,
        });
      prisma.stripeWebhookEvent.create.mockResolvedValue({});

      await service.handleStripeWebhook(rawBody, signature);
      await service.handleStripeWebhook(rawBody, signature);

      expect(prisma.stripeWebhookEvent.create).toHaveBeenCalledTimes(1);
      expect(prisma.stripeWebhookEvent.create).toHaveBeenCalledWith({
        data: { stripeEventId: event.id },
      });
    });

    it("P2002 при create трактується як вже оброблено (race)", async () => {
      const event = makeEvent("evt_p2002_1", "charge.succeeded");
      stripeService.constructWebhookEvent.mockReturnValue(event);

      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockRejectedValue({ code: "P2002" });

      await expect(
        service.handleStripeWebhook(rawBody, signature),
      ).resolves.toBeUndefined();
    });
  });

  describe("handleStripeWebhook — події", () => {
    it("checkout.session.completed без metadata — не кидає після запису події", async () => {
      const event = makeEvent("evt_cs_1", "checkout.session.completed");
      (event as any).data = {
        object: {
          id: "cs_1",
          metadata: {},
        },
      };
      stripeService.constructWebhookEvent.mockReturnValue(event);

      prisma.stripeWebhookEvent.findUnique.mockResolvedValue(null);
      prisma.stripeWebhookEvent.create.mockResolvedValue({});

      await expect(
        service.handleStripeWebhook(rawBody, signature),
      ).resolves.toBeUndefined();
    });
  });
});
