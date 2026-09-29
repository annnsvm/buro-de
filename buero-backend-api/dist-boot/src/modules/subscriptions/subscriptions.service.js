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
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
const wayforpay_service_1 = require("../wayforpay/wayforpay.service");
const payment_fulfillment_service_1 = require("./payment-fulfillment.service");
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    constructor(prisma, wayForPay, fulfillment) {
        this.prisma = prisma;
        this.wayForPay = wayForPay;
        this.fulfillment = fulfillment;
        this.logger = new common_1.Logger(SubscriptionsService_1.name);
    }
    async createCheckoutSession(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true },
        });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const course = await this.prisma.course.findUnique({
            where: { id: dto.course_id },
        });
        if (!course)
            throw new common_1.NotFoundException("Course not found");
        if (course.isPublished !== true) {
            throw new common_1.BadRequestException("Course is not published");
        }
        const materialsCount = await this.prisma.courseMaterial.count({
            where: { module: { courseId: dto.course_id } },
        });
        if (materialsCount < 1) {
            throw new common_1.BadRequestException("Course is not available for purchase yet");
        }
        const existingAccess = await this.prisma.userCourseAccess.findUnique({
            where: { userId_courseId: { userId, courseId: dto.course_id } },
        });
        if ((existingAccess === null || existingAccess === void 0 ? void 0 : existingAccess.accessType) === "purchase") {
            throw new common_1.ConflictException("You already own this course");
        }
        if ((existingAccess === null || existingAccess === void 0 ? void 0 : existingAccess.accessType) === "subscription") {
            throw new common_1.ConflictException("You already have access to this course via subscription");
        }
        const price = course.price != null ? Number(course.price) : null;
        if (price == null || !Number.isFinite(price) || price <= 0) {
            this.logger.warn(`Checkout failed: course ${dto.course_id} has no price`);
            throw new common_1.BadRequestException("Курс не має налаштованої ціни. Вкажіть ціну курсу перед публікацією.");
        }
        const currency = this.wayForPay.getDefaultCurrency();
        const orderReference = this.wayForPay.generateOrderReference();
        const payment = await this.prisma.payment.create({
            data: {
                userId,
                courseId: dto.course_id,
                provider: "wayforpay",
                orderReference,
                amount: price,
                currency: currency.toLowerCase(),
                status: payment_fulfillment_service_1.PAYMENT_STATUS.pending,
            },
        });
        try {
            const url = await this.wayForPay.createPaymentPageUrl({
                orderReference,
                orderDate: Math.floor(Date.now() / 1000),
                amount: price,
                currency,
                productName: course.title,
                productPrice: price,
                productCount: 1,
                returnUrl: this.wayForPay.getReturnUrl(),
                serviceUrl: this.wayForPay.getServiceUrl(),
                clientEmail: user.email,
                clientAccountId: userId,
            });
            return { url, order_reference: orderReference };
        }
        catch (err) {
            await this.prisma.payment.delete({ where: { id: payment.id } });
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.error(`Checkout failed for course ${dto.course_id}, user ${userId}: ${msg}`, err instanceof Error ? err.stack : undefined);
            throw err;
        }
    }
    async syncCheckout(userId, dto) {
        const payment = await this.prisma.payment.findUnique({
            where: { orderReference: dto.order_reference },
            select: { id: true, userId: true, status: true },
        });
        if (!payment || payment.userId !== userId) {
            throw new common_1.NotFoundException("Payment not found");
        }
        if (payment.status === payment_fulfillment_service_1.PAYMENT_STATUS.paid) {
            await this.fulfillment.markPaid({ orderReference: dto.order_reference });
            return { ok: true, status: payment_fulfillment_service_1.PAYMENT_STATUS.paid };
        }
        const result = await this.wayForPay.checkStatus(dto.order_reference);
        if (this.wayForPay.isApproved(result.transactionStatus)) {
            await this.fulfillment.markPaid({
                orderReference: dto.order_reference,
                amount: result.amount != null ? Number(result.amount) : undefined,
                currency: result.currency,
            });
            return { ok: true, status: payment_fulfillment_service_1.PAYMENT_STATUS.paid };
        }
        if (this.wayForPay.isPendingStatus(result.transactionStatus)) {
            return { ok: false, status: payment_fulfillment_service_1.PAYMENT_STATUS.pending };
        }
        await this.fulfillment.markFailed(dto.order_reference, result.reason);
        return { ok: false, status: payment_fulfillment_service_1.PAYMENT_STATUS.failed };
    }
    async getMyCourseAccess(userId) {
        void this.fulfillment.reconcilePendingForUser(userId);
        const list = await this.prisma.userCourseAccess.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return list.map((a) => {
            var _a, _b;
            return ({
                id: a.id,
                course_id: a.courseId,
                access_type: a.accessType,
                payment_id: (_a = a.paymentId) !== null && _a !== void 0 ? _a : undefined,
                subscription_id: (_b = a.subscriptionId) !== null && _b !== void 0 ? _b : undefined,
                created_at: a.createdAt,
            });
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wayforpay_service_1.WayForPayService,
        payment_fulfillment_service_1.PaymentFulfillmentService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map