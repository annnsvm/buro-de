import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { Request } from "express";
import { WebhookService } from "./webhook.service";

@SkipThrottle()
@Controller("webhooks")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("stripe")
  @HttpCode(HttpStatus.OK)
  async handleStripe(@Req() req: Request): Promise<{ received: boolean }> {
    const rawBody = (req as any).rawBody as Buffer | undefined;
    const signature = req.headers["stripe-signature"] as string | undefined;

    if (!rawBody || !signature) {
      throw new BadRequestException("Missing raw body or Stripe-Signature header");
    }

    await this.webhookService.handleStripeWebhook(rawBody, signature);
    return { received: true };
  }
}
