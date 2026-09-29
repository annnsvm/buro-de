"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const payment_fulfillment_service_1 = require("./payment-fulfillment.service");
const payment_service_1 = require("./payment.service");
const payments_controller_1 = require("./payments.controller");
const prisma_module_1 = require("src/prisma/prisma.module");
const subscriptions_controller_1 = require("./subscriptions.controller");
const subscriptions_service_1 = require("./subscriptions.service");
const webhook_controller_1 = require("./webhook.controller");
const webhook_service_1 = require("./webhook.service");
let SubscriptionsModule = class SubscriptionsModule {
};
exports.SubscriptionsModule = SubscriptionsModule;
exports.SubscriptionsModule = SubscriptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, user_module_1.UserModule],
        controllers: [
            subscriptions_controller_1.SubscriptionsController,
            payments_controller_1.PaymentsController,
            webhook_controller_1.WebhookController,
        ],
        providers: [
            subscriptions_service_1.SubscriptionsService,
            payment_service_1.PaymentService,
            payment_fulfillment_service_1.PaymentFulfillmentService,
            webhook_service_1.WebhookService,
        ],
        exports: [subscriptions_service_1.SubscriptionsService, payment_service_1.PaymentService, payment_fulfillment_service_1.PaymentFulfillmentService],
    })
], SubscriptionsModule);
//# sourceMappingURL=subscriptions.module.js.map