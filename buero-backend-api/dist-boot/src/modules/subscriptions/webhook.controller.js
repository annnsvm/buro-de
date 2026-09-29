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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const wayforpay_service_1 = require("../wayforpay/wayforpay.service");
const webhook_service_1 = require("./webhook.service");
let WebhookController = WebhookController_1 = class WebhookController {
    constructor(webhookService, wayForPay, configService) {
        this.webhookService = webhookService;
        this.wayForPay = wayForPay;
        this.configService = configService;
        this.logger = new common_1.Logger(WebhookController_1.name);
    }
    async handleWayForPay(req) {
        return this.webhookService.handleWayForPayCallback(req.body);
    }
    handleReturnPost(req, res) {
        this.redirectToFrontend(req, res);
    }
    handleReturnGet(req, res) {
        this.redirectToFrontend(req, res);
    }
    redirectToFrontend(req, res) {
        var _a, _b, _c;
        let orderReference;
        let status;
        try {
            const payload = this.webhookService.normalizePayload(req.body);
            orderReference = payload.orderReference;
            status = payload.transactionStatus;
        }
        catch (_d) {
        }
        orderReference !== null && orderReference !== void 0 ? orderReference : (orderReference = this.firstQueryValue(req, "orderReference"));
        status !== null && status !== void 0 ? status : (status = this.firstQueryValue(req, "transactionStatus"));
        const baseUrl = (_c = (_b = (_a = this.configService.get("CORS_ORIGIN")) === null || _a === void 0 ? void 0 : _a.split(",")[0]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "http://localhost:5173";
        this.logger.log(`WayForPay return: orderReference=${orderReference !== null && orderReference !== void 0 ? orderReference : "-"} status=${status !== null && status !== void 0 ? status : "-"}`);
        const failed = status !== undefined &&
            !this.wayForPay.isApproved(status) &&
            !this.wayForPay.isPendingStatus(status);
        const path = failed ? "/purchase/cancel" : "/purchase/success";
        const query = orderReference
            ? `?orderReference=${encodeURIComponent(orderReference)}`
            : "";
        res.redirect(303, `${baseUrl}${path}${query}`);
    }
    firstQueryValue(req, key) {
        var _a;
        const value = (_a = req.query) === null || _a === void 0 ? void 0 : _a[key];
        if (typeof value === "string")
            return value;
        if (Array.isArray(value) && typeof value[0] === "string")
            return value[0];
        return undefined;
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)("wayforpay"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleWayForPay", null);
__decorate([
    (0, common_1.Post)("wayforpay/return"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "handleReturnPost", null);
__decorate([
    (0, common_1.Get)("wayforpay/return"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "handleReturnGet", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)("webhooks"),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        wayforpay_service_1.WayForPayService,
        config_1.ConfigService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map