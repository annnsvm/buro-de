"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentFulfillmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentFulfillmentService = exports.PAYMENT_STATUS = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("src/generated/prisma/enums");
const prisma_service_1 = require("src/prisma/prisma.service");
const wayforpay_service_1 = require("../wayforpay/wayforpay.service");
exports.PAYMENT_STATUS = {
    pending: "pending",
    paid: "paid",
    failed: "failed",
    refunded: "refunded",
};
const PENDING_RECONCILE_WINDOW_MS = 24 * 60 * 60 * 1000;
const PENDING_RECONCILE_LIMIT = 5;
let PaymentFulfillmentService = PaymentFulfillmentService_1 = class PaymentFulfillmentService {
    constructor(prisma, wayForPay) {
        this.prisma = prisma;
        this.wayForPay = wayForPay;
        this.logger = new common_1.Logger(PaymentFulfillmentService_1.name);
    }
    async reconcilePendingForUser(userId) {
        if (!this.wayForPay.isConfigured())
            return;
        try {
            const pending = await this.prisma.payment.findMany({
                where: {
                    userId,
                    provider: "wayforpay",
                    status: exports.PAYMENT_STATUS.pending,
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
                if (!orderReference)
                    continue;
                const result = await this.wayForPay.checkStatus(orderReference);
                if (this.wayForPay.isApproved(result.transactionStatus)) {
                    await this.markPaid({
                        orderReference,
                        amount: result.amount != null ? Number(result.amount) : undefined,
                        currency: result.currency,
                    });
                }
                else if (!this.wayForPay.isPendingStatus(result.transactionStatus)) {
                    await this.markFailed(orderReference, result.reason);
                }
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.warn(`Failed to reconcile pending payments for user ${userId}: ${msg}`);
        }
    }
    async markPaid(params) {
        const payment = await this.prisma.payment.findUnique({
            where: { orderReference: params.orderReference },
        });
        if (!payment) {
            this.logger.warn(`Payment for order ${params.orderReference} not found, nothing to fulfil`);
            return { granted: false };
        }
        const needsStatusUpdate = payment.status !== exports.PAYMENT_STATUS.paid;
        const paidData = Object.assign(Object.assign({ status: exports.PAYMENT_STATUS.paid }, (params.amount != null && { amount: params.amount })), (params.currency && { currency: params.currency.toLowerCase() }));
        if (!payment.courseId) {
            if (needsStatusUpdate) {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: paidData,
                });
            }
            this.logger.warn(`Payment ${payment.id} has no course, access not granted`);
            return { granted: false };
        }
        const courseId = payment.courseId;
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
                    accessType: enums_1.UserCourseAccessType.purchase,
                    paymentId: payment.id,
                },
                update: {
                    accessType: enums_1.UserCourseAccessType.purchase,
                    paymentId: payment.id,
                    trialEndsAt: null,
                },
            });
        });
        this.logger.log(`Course ${payment.courseId} unlocked for user ${payment.userId} (order ${params.orderReference})`);
        return { granted: true };
    }
    async markFailed(orderReference, reason) {
        const updated = await this.prisma.payment.updateMany({
            where: { orderReference, status: exports.PAYMENT_STATUS.pending },
            data: { status: exports.PAYMENT_STATUS.failed },
        });
        if (updated.count > 0) {
            this.logger.log(`Payment ${orderReference} marked as failed${reason ? `: ${reason}` : ""}`);
        }
    }
};
exports.PaymentFulfillmentService = PaymentFulfillmentService;
exports.PaymentFulfillmentService = PaymentFulfillmentService = PaymentFulfillmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wayforpay_service_1.WayForPayService])
], PaymentFulfillmentService);
//# sourceMappingURL=payment-fulfillment.service.js.map