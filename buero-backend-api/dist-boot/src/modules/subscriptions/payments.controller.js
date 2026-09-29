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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const payment_response_dto_1 = require("./dto/payment-response.dto");
const payment_service_1 = require("./payment.service");
let PaymentsController = class PaymentsController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async getMyPayments(userId) {
        return this.paymentService.getMyPayments(userId);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)("me"),
    (0, swagger_1.ApiOperation)({
        summary: "Історія платежів",
        description: "Список платежів/інвойсів поточного користувача (з course_id).",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Масив платежів",
        type: [payment_response_dto_1.PaymentResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMyPayments", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)("payments"),
    (0, common_1.Controller)("payments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map