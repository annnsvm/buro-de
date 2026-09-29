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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
let PaymentService = class PaymentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyPayments(userId) {
        const payments = await this.prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return payments.map((p) => {
            var _a, _b, _c, _d;
            return ({
                id: p.id,
                user_id: p.userId,
                course_id: (_a = p.courseId) !== null && _a !== void 0 ? _a : undefined,
                subscription_id: (_b = p.subscriptionId) !== null && _b !== void 0 ? _b : undefined,
                provider: p.provider,
                order_reference: (_c = p.orderReference) !== null && _c !== void 0 ? _c : undefined,
                stripe_invoice_id: (_d = p.stripeInvoiceId) !== null && _d !== void 0 ? _d : undefined,
                amount: Number(p.amount),
                currency: p.currency,
                status: p.status,
                created_at: p.createdAt,
            });
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map