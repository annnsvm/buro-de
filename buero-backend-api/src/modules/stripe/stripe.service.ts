import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

/**
 * Централізований сервіс для роботи з Stripe API.
 * Всі виклики Stripe проходять через цей сервіс для можливості масштабування.
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly client: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!secret) {
      throw new Error("STRIPE_SECRET_KEY is required for StripeService");
    }
    this.client = new Stripe(secret);
  }

  /** Доступ до Stripe-клієнта для випадків, коли потрібні специфічні виклики */
  getClient(): Stripe {
    return this.client;
  }

  async createCustomer(params: {
    email: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    try {
      return await this.client.customers.create({
        email: params.email,
        metadata: params.metadata ?? {},
      });
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        this.logger.error(`Stripe createCustomer failed: ${err.message}`);
        throw new BadRequestException(err.message);
      }
      this.logger.error(`createCustomer unexpected error`, err instanceof Error ? err.stack : undefined);
      throw err;
    }
  }

  async createCheckoutSession(params: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.client.checkout.sessions.create({
        mode: "payment",
        customer: params.customerId,
        line_items: [{ price: params.priceId, quantity: 1 }],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
      });
      return session;
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        this.logger.error(`Stripe createCheckoutSession failed: ${err.message}`);
        throw new BadRequestException(err.message);
      }
      this.logger.error(`createCheckoutSession unexpected error`, err instanceof Error ? err.stack : undefined);
      throw err;
    }
  }

  async createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    try {
      return await this.client.billingPortal.sessions.create({
        customer: params.customerId,
        return_url: params.returnUrl,
      });
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        this.logger.error(`Stripe createBillingPortalSession failed: ${err.message}`);
        throw new BadRequestException(err.message);
      }
      this.logger.error(`createBillingPortalSession unexpected error`, err instanceof Error ? err.stack : undefined);
      throw err;
    }
  }

  /**
   * Створює Stripe Product (для курсу).
   * Використовується при публікації курсу з ціною.
   */
  async createProduct(params: { name: string }): Promise<Stripe.Product> {
    try {
      return await this.client.products.create({
        name: params.name,
      });
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        this.logger.error(`Stripe createProduct failed: ${err.message}`);
        throw new BadRequestException(err.message);
      }
      this.logger.error(`createProduct unexpected error`, err instanceof Error ? err.stack : undefined);
      throw err;
    }
  }

  /**
   * Створює Stripe Price (одноразова оплата).
   * unitAmountCents — сума в центах (напр. 2999 для 29.99€).
   */
  async createPrice(params: {
    productId: string;
    unitAmountCents: number;
    currency: string;
  }): Promise<Stripe.Price> {
    try {
      return await this.client.prices.create({
        product: params.productId,
        unit_amount: Math.round(params.unitAmountCents),
        currency: params.currency.toLowerCase(),
      });
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError) {
        this.logger.error(`Stripe createPrice failed: ${err.message}`);
        throw new BadRequestException(err.message);
      }
      this.logger.error(`createPrice unexpected error`, err instanceof Error ? err.stack : undefined);
      throw err;
    }
  }

  /**
   * Перевірка підпису webhook і парсинг події.
   */
  constructWebhookEvent(
    rawBody: Buffer | string,
    signature: string,
  ): Stripe.Event {
    const secret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");
    if (!secret) {
      throw new BadRequestException("Webhook secret not configured");
    }
    try {
      return this.client.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid signature";
      this.logger.error(`Webhook constructEvent failed: ${message}`);
      throw new BadRequestException(message);
    }
  }
}
