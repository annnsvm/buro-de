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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
const wayforpay_service_1 = require("../wayforpay/wayforpay.service");
const wayforpay_types_1 = require("../wayforpay/wayforpay.types");
const payment_fulfillment_service_1 = require("./payment-fulfillment.service");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(prisma, wayForPay, fulfillment) {
        this.prisma = prisma;
        this.wayForPay = wayForPay;
        this.fulfillment = fulfillment;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    normalizePayload(body) {
        if (typeof body === "string") {
            return this.parseJson(body);
        }
        if (body && typeof body === "object") {
            const record = body;
            const keys = Object.keys(record);
            if (keys.length === 1 && keys[0].trim().startsWith("{")) {
                return this.parseJson(keys[0]);
            }
            return record;
        }
        throw new common_1.BadRequestException("Empty WayForPay callback body");
    }
    parseJson(raw) {
        try {
            return JSON.parse(raw);
        }
        catch (_a) {
            throw new common_1.BadRequestException("Malformed WayForPay callback body");
        }
    }
    async handleWayForPayCallback(body) {
        var _a;
        const payload = this.normalizePayload(body);
        const orderReference = payload.orderReference;
        if (!orderReference) {
            throw new common_1.BadRequestException("WayForPay callback without orderReference");
        }
        if (!this.wayForPay.verifyServiceUrlSignature(payload)) {
            this.logger.warn(`Invalid WayForPay signature for order ${orderReference}, ignoring`);
            throw new common_1.BadRequestException("Invalid WayForPay signature");
        }
        const status = payload.transactionStatus;
        const eventKey = `${orderReference}:${status !== null && status !== void 0 ? status : "unknown"}:${(_a = payload.reasonCode) !== null && _a !== void 0 ? _a : ""}`;
        try {
            await this.prisma.paymentWebhookEvent.create({
                data: { provider: "wayforpay", eventKey },
            });
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) === "P2002") {
                this.logger.debug(`WayForPay event ${eventKey} already processed`);
                return this.wayForPay.buildAcceptResponse(orderReference);
            }
            throw err;
        }
        if (this.wayForPay.isApproved(status)) {
            await this.fulfillment.markPaid({
                orderReference,
                amount: payload.amount != null ? Number(payload.amount) : undefined,
                currency: payload.currency,
            });
        }
        else if (this.wayForPay.isPendingStatus(status)) {
            this.logger.log(`Order ${orderReference} still in progress: ${status}`);
        }
        else if (status === wayforpay_types_1.WAYFORPAY_STATUS.refunded) {
            this.logger.log(`Order ${orderReference} refunded, access left untouched`);
        }
        else {
            await this.fulfillment.markFailed(orderReference, payload.reason);
        }
        return this.wayForPay.buildAcceptResponse(orderReference);
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wayforpay_service_1.WayForPayService,
        payment_fulfillment_service_1.PaymentFulfillmentService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map