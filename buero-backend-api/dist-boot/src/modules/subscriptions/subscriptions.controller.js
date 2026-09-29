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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const course_access_response_dto_1 = require("./dto/course-access-response.dto");
const create_checkout_dto_1 = require("./dto/create-checkout.dto");
const sync_checkout_dto_1 = require("./dto/sync-checkout.dto");
const subscriptions_service_1 = require("./subscriptions.service");
let SubscriptionsController = class SubscriptionsController {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    async createCheckoutSession(userId, body) {
        return this.subscriptionsService.createCheckoutSession(userId, body);
    }
    async syncCheckout(userId, body) {
        return this.subscriptionsService.syncCheckout(userId, body);
    }
    async getMyCourseAccess(userId) {
        return this.subscriptionsService.getMyCourseAccess(userId);
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Post)("checkout"),
    (0, swagger_1.ApiOperation)({
        summary: "Створити оплату курсу (WayForPay)",
        description: "Створює платіжну сторінку WayForPay для разової оплати курсу та pending-платіж з orderReference. Повертає URL для редіректу на оплату.",
    }),
    (0, swagger_1.ApiBody)({ type: create_checkout_dto_1.CreateCheckoutDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "URL для редіректу та orderReference",
        schema: {
            type: "object",
            properties: {
                url: { type: "string" },
                order_reference: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Курс не опублікований, без уроків, без ціни або помилка WayForPay",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User або курс не знайдено" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "Вже є повний доступ до курсу (купівля або підписка). Trial не блокує покупку",
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_checkout_dto_1.CreateCheckoutDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)("sync-checkout"),
    (0, swagger_1.ApiOperation)({
        summary: "Синхронізувати статус оплати",
        description: "Запитує CHECK_STATUS у WayForPay і відкриває доступ, якщо оплата пройшла. Потрібно, коли студент повернувся на сайт раніше за serviceUrl-callback.",
    }),
    (0, swagger_1.ApiBody)({ type: sync_checkout_dto_1.SyncCheckoutDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Результат синхронізації",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean" },
                status: { type: "string", example: "paid" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Платіж не знайдено" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sync_checkout_dto_1.SyncCheckoutDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "syncCheckout", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, swagger_1.ApiOperation)({
        summary: "Мої курси (доступ)",
        description: "Список курсів, до яких є доступ: trial, purchase (разова купівля), subscription. Поля course_id, access_type, trial_ends_at, payment_id, subscription_id.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Масив доступів до курсів",
        type: [course_access_response_dto_1.CourseAccessResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "getMyCourseAccess", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)("subscriptions"),
    (0, common_1.Controller)("subscriptions"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map