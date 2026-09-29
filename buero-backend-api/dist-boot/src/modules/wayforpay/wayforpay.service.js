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
var WayForPayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WayForPayService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const wayforpay_types_1 = require("./wayforpay.types");
const PAY_OFFLINE_URL = "https://secure.wayforpay.com/pay?behavior=offline";
const API_URL = "https://api.wayforpay.com/api";
let WayForPayService = WayForPayService_1 = class WayForPayService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(WayForPayService_1.name);
    }
    isConfigured() {
        return Boolean(this.configService.get("WAYFORPAY_MERCHANT_ACCOUNT") &&
            this.configService.get("WAYFORPAY_MERCHANT_SECRET"));
    }
    getDefaultCurrency() {
        var _a;
        return ((_a = this.configService.get("WAYFORPAY_CURRENCY")) !== null && _a !== void 0 ? _a : "EUR").toUpperCase();
    }
    getServiceUrl() {
        const url = this.configService.get("WAYFORPAY_SERVICE_URL");
        if (!url) {
            throw new common_1.BadRequestException("WayForPay не налаштовано: відсутній WAYFORPAY_SERVICE_URL");
        }
        return url;
    }
    getReturnUrl() {
        var _a;
        return ((_a = this.configService.get("WAYFORPAY_RETURN_URL")) !== null && _a !== void 0 ? _a : `${this.getServiceUrl()}/return`);
    }
    generateOrderReference() {
        return `bd-${Date.now()}-${(0, crypto_1.randomUUID)().slice(0, 8)}`;
    }
    formatAmount(value) {
        return String(Number(value.toFixed(2)));
    }
    getMerchantAccount() {
        const account = this.configService.get("WAYFORPAY_MERCHANT_ACCOUNT");
        if (!account) {
            throw new common_1.BadRequestException("WayForPay не налаштовано: відсутній WAYFORPAY_MERCHANT_ACCOUNT");
        }
        return account;
    }
    getMerchantSecret() {
        const secret = this.configService.get("WAYFORPAY_MERCHANT_SECRET");
        if (!secret) {
            throw new common_1.BadRequestException("WayForPay не налаштовано: відсутній WAYFORPAY_MERCHANT_SECRET");
        }
        return secret;
    }
    getMerchantDomain() {
        var _a;
        return ((_a = this.configService.get("WAYFORPAY_MERCHANT_DOMAIN")) !== null && _a !== void 0 ? _a : "localhost");
    }
    sign(line) {
        return (0, crypto_1.createHmac)("md5", this.getMerchantSecret())
            .update(line, "utf8")
            .digest("hex");
    }
    buildPurchaseSignature(params) {
        return this.sign([
            params.merchantAccount,
            params.merchantDomainName,
            params.orderReference,
            String(params.orderDate),
            params.amount,
            params.currency,
            ...params.productNames,
            ...params.productCounts.map(String),
            ...params.productPrices,
        ].join(";"));
    }
    verifyServiceUrlSignature(payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const received = payload.merchantSignature;
        if (typeof received !== "string" || received.length === 0)
            return false;
        const expected = this.sign([
            (_a = payload.merchantAccount) !== null && _a !== void 0 ? _a : "",
            (_b = payload.orderReference) !== null && _b !== void 0 ? _b : "",
            String((_c = payload.amount) !== null && _c !== void 0 ? _c : ""),
            (_d = payload.currency) !== null && _d !== void 0 ? _d : "",
            (_e = payload.authCode) !== null && _e !== void 0 ? _e : "",
            (_f = payload.cardPan) !== null && _f !== void 0 ? _f : "",
            (_g = payload.transactionStatus) !== null && _g !== void 0 ? _g : "",
            String((_h = payload.reasonCode) !== null && _h !== void 0 ? _h : ""),
        ].join(";"));
        return expected === received;
    }
    buildAcceptResponse(orderReference) {
        const time = Math.floor(Date.now() / 1000);
        return {
            orderReference,
            status: "accept",
            time,
            signature: this.sign([orderReference, "accept", String(time)].join(";")),
        };
    }
    isApproved(status) {
        return status === wayforpay_types_1.WAYFORPAY_STATUS.approved;
    }
    isPendingStatus(status) {
        return (status === wayforpay_types_1.WAYFORPAY_STATUS.inProcessing ||
            status === wayforpay_types_1.WAYFORPAY_STATUS.pending ||
            status === wayforpay_types_1.WAYFORPAY_STATUS.waitingAuthComplete);
    }
    async createPaymentPageUrl(params) {
        var _a, _b, _c;
        const merchantAccount = this.getMerchantAccount();
        const merchantDomainName = this.getMerchantDomain();
        const productCount = (_a = params.productCount) !== null && _a !== void 0 ? _a : 1;
        const amount = this.formatAmount(params.amount);
        const productPrice = this.formatAmount(params.productPrice);
        const merchantSignature = this.buildPurchaseSignature({
            merchantAccount,
            merchantDomainName,
            orderReference: params.orderReference,
            orderDate: params.orderDate,
            amount,
            currency: params.currency,
            productNames: [params.productName],
            productCounts: [productCount],
            productPrices: [productPrice],
        });
        const body = new URLSearchParams();
        body.set("merchantAccount", merchantAccount);
        body.set("merchantAuthType", "SimpleSignature");
        body.set("merchantDomainName", merchantDomainName);
        body.set("merchantTransactionSecureType", "AUTO");
        body.set("merchantSignature", merchantSignature);
        body.set("apiVersion", "1");
        body.set("orderReference", params.orderReference);
        body.set("orderDate", String(params.orderDate));
        body.set("amount", amount);
        body.set("currency", params.currency);
        body.append("productName[]", params.productName);
        body.append("productPrice[]", productPrice);
        body.append("productCount[]", String(productCount));
        body.set("returnUrl", params.returnUrl);
        body.set("serviceUrl", params.serviceUrl);
        if (params.clientEmail)
            body.set("clientEmail", params.clientEmail);
        if (params.clientAccountId) {
            body.set("clientAccountId", params.clientAccountId);
        }
        body.set("language", (_b = params.language) !== null && _b !== void 0 ? _b : "EN");
        let raw;
        try {
            const response = await fetch(PAY_OFFLINE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: body.toString(),
            });
            raw = await response.text();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.error(`WayForPay purchase request failed: ${message}`);
            throw new common_1.InternalServerErrorException("Не вдалося звʼязатися з платіжним сервісом");
        }
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch (_d) {
            this.logger.error(`WayForPay returned non-JSON response: ${raw}`);
            throw new common_1.InternalServerErrorException("Платіжний сервіс повернув некоректну відповідь");
        }
        if (!parsed.url) {
            this.logger.error(`WayForPay did not return payment url: ${raw} (order ${params.orderReference})`);
            throw new common_1.BadRequestException((_c = parsed.reason) !== null && _c !== void 0 ? _c : "Платіжний сервіс не повернув посилання на оплату");
        }
        return parsed.url;
    }
    async checkStatus(orderReference) {
        const merchantAccount = this.getMerchantAccount();
        const payload = {
            transactionType: "CHECK_STATUS",
            merchantAccount,
            orderReference,
            apiVersion: 1,
            merchantSignature: this.sign([merchantAccount, orderReference].join(";")),
        };
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return (await response.json());
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.error(`WayForPay checkStatus failed: ${message}`);
            throw new common_1.InternalServerErrorException("Не вдалося перевірити статус платежу");
        }
    }
};
exports.WayForPayService = WayForPayService;
exports.WayForPayService = WayForPayService = WayForPayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WayForPayService);
//# sourceMappingURL=wayforpay.service.js.map