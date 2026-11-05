import { Injectable, Logger } from "@nestjs/common";
import { UserCourseAccessType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { buildPurchaseEmail } from "../auth/auth-email.templates";
import { WayForPayService } from "../wayforpay/wayforpay.service";

export const PAYMENT_STATUS = {
  pending: "pending",
  paid: "paid",
  failed: "failed",
  refunded: "refunded",
} as const;

/** Скільки часу після створення платежу ще має сенс перепитувати WayForPay. */
const PENDING_RECONCILE_WINDOW_MS = 24 * 60 * 60 * 1000;
const PENDING_RECONCILE_LIMIT = 5;

/**
 * Спільна логіка нарахування доступу після оплати.
 * Використовується і webhook-ом WayForPay, і ручною синхронізацією (sync-checkout).
 */
@Injectable()
export class PaymentFulfillmentService {
  private readonly logger = new Logger(PaymentFulfillmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wayForPay: WayForPayService,
    private readonly mailer: MailerService,
  ) {}

  /**
   * Догортає платежі, які WayForPay підтвердив уже після того, як студент пішов
   * зі сторінки успіху (callback міг не дійти - напр. на локальному оточенні).
   * Ніколи не кидає помилку: список курсів має відкриватись і без WayForPay.
   */
  async reconcilePendingForUser(userId: string): Promise<void> {
    if (!this.wayForPay.isConfigured()) return;

    try {
      const pending = await this.prisma.payment.findMany({
        where: {
          userId,
          provider: "wayforpay",
          status: PAYMENT_STATUS.pending,
          orderReference: { not: null },
          createdAt: {
            gte: new Date(Date.now() - PENDING_RECONCILE_WINDOW_MS),
          },
        },
        select: { orderReference: true },
        orderBy: { createdAt: "desc" },
        take: PENDING_RECONCILE_LIMIT,
      });

      for (const { orderReference } of pending) {
        if (!orderReference) continue;

        const result = await this.wayForPay.checkStatus(orderReference);

        if (this.wayForPay.isApproved(result.transactionStatus)) {
          await this.markPaid({
            orderReference,
            amount: result.amount != null ? Number(result.amount) : undefined,
            currency: result.currency,
          });
        } else if (!this.wayForPay.isPendingStatus(result.transactionStatus)) {
          await this.markFailed(orderReference, result.reason);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `Failed to reconcile pending payments for user ${userId}: ${msg}`,
      );
    }
  }

  /**
   * Позначає платіж оплаченим і відкриває доступ до курсу.
   * Ідемпотентна: повторний виклик для вже оплаченого платежу лише гарантує наявність доступу.
   */
  async markPaid(params: {
    orderReference: string;
    amount?: number;
    currency?: string;
  }): Promise<{ granted: boolean }> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderReference: params.orderReference },
    });

    if (!payment) {
      this.logger.warn(
        `Payment for order ${params.orderReference} not found, nothing to fulfil`,
      );
      return { granted: false };
    }

    const needsStatusUpdate = payment.status !== PAYMENT_STATUS.paid;
    const paidData = {
      status: PAYMENT_STATUS.paid,
      ...(params.amount != null && { amount: params.amount }),
      ...(params.currency && { currency: params.currency.toLowerCase() }),
    };

    if (!payment.courseId) {
      if (needsStatusUpdate) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: paidData,
        });
      }
      this.logger.warn(
        `Payment ${payment.id} has no course, access not granted`,
      );
      return { granted: false };
    }

    const courseId = payment.courseId;

    /**
     * Marking the payment paid and granting course access must succeed or fail together.
     * Outside a transaction, a crash between them leaves money collected with no course
     * unlocked, and webhook idempotency (payment_webhook_events.event_key) means the
     * callback is never replayed to repair it.
     */
    await this.prisma.$transaction(async (tx) => {
      if (needsStatusUpdate) {
        await tx.payment.update({
          where: { id: payment.id },
          data: paidData,
        });
      }

      await tx.userCourseAccess.upsert({
        where: {
          userId_courseId: {
            userId: payment.userId,
            courseId,
          },
        },
        create: {
          userId: payment.userId,
          courseId,
          accessType: UserCourseAccessType.purchase,
          paymentId: payment.id,
        },
        update: {
          accessType: UserCourseAccessType.purchase,
          paymentId: payment.id,
          trialEndsAt: null,
        },
      });
    });

    this.logger.log(
      `Course ${payment.courseId} unlocked for user ${payment.userId} (order ${params.orderReference})`,
    );

    /**
     * Only the first time this payment turns paid.
     *
     * `markPaid` is called by the webhook and again by the reconciliation that runs when a
     * student comes back to the success page, so without this the same purchase would be
     * announced twice. `needsStatusUpdate` was false on the second pass, and that is
     * already the signal that nothing changed.
     */
    if (needsStatusUpdate) {
      await this.announcePurchase(payment.id, payment.userId, courseId);
    }

    return { granted: true };
  }

  /**
   * Tells the student their course is open.
   *
   * WayForPay confirms that money moved; nothing confirmed what they had bought or where
   * it now was, so a purchase ended in silence and the course simply appeared for whoever
   * thought to go and look.
   *
   * Sent after the transaction rather than inside it, and swallowed if it fails. A mail
   * server that is down must not undo a payment, and must not make the webhook retry a
   * fulfilment that has already happened - the student has their course either way, and a
   * missing receipt is a smaller problem than a course that locked itself again.
   */
  private async announcePurchase(
    paymentId: string,
    userId: string,
    courseId: string,
  ): Promise<void> {
    try {
      const [user, course, payment] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true, language: true },
        }),
        this.prisma.course.findUnique({
          where: { id: courseId },
          select: { title: true },
        }),
        this.prisma.payment.findUnique({
          where: { id: paymentId },
          select: { amount: true, currency: true },
        }),
      ]);
      if (!user || !course || !payment) return;

      const siteUrl = this.mailer.getSiteUrl();
      const { logoUrl } = this.mailer.resolveLogo();
      const mail = buildPurchaseEmail({
        name: user.name,
        courseTitle: course.title,
        amount: Number(payment.amount).toFixed(2),
        currency: payment.currency,
        courseUrl: `${siteUrl.replace(/\/$/, "")}/courses/${courseId}`,
        /** The language the account is set to; the emails know only these two. */
        locale: user.language === "de" ? "en" : "uk",
        logoUrl,
        siteUrl,
      });
      await this.mailer.send({
        to: user.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (error) {
      this.logger.error(
        `Course is open but the receipt did not go out for payment ${paymentId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /** Фіксує неуспішний платіж; доступ не змінюється. */
  async markFailed(orderReference: string, reason?: string): Promise<void> {
    const updated = await this.prisma.payment.updateMany({
      where: { orderReference, status: PAYMENT_STATUS.pending },
      data: { status: PAYMENT_STATUS.failed },
    });

    if (updated.count > 0) {
      this.logger.log(
        `Payment ${orderReference} marked as failed${reason ? `: ${reason}` : ""}`,
      );
    }
  }
}
