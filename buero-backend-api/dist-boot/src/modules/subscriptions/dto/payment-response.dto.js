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
exports.PaymentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PaymentResponseDto {
}
exports.PaymentResponseDto = PaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID платежу" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID користувача" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "ID курсу" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "course_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "ID підписки" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "subscription_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Платіжний провайдер", example: "wayforpay" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "orderReference WayForPay",
        example: "bd-1755600000000-1a2b3c4d",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "order_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "ID Stripe Invoice (історичні платежі до міграції)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "stripe_invoice_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Сума платежа" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Валюта" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Статус платежа" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Дата створення" }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], PaymentResponseDto.prototype, "created_at", void 0);
//# sourceMappingURL=payment-response.dto.js.map