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
exports.SubscriptionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("src/generated/prisma/enums");
class SubscriptionResponseDto {
}
exports.SubscriptionResponseDto = SubscriptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID підписки" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID курсу" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "course_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Stripe Subscription ID" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "stripe_subscription_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Статус підписки", enum: enums_1.SubscriptionStatus }),
    (0, class_validator_1.IsEnum)(enums_1.SubscriptionStatus),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Дата початку поточного періоду" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "current_period_start", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Дата закінчення поточного періоду" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "current_period_end", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Дата скасування підписки" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "canceled_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Причина скасування підписки" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "cancellation_reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Дата створення" }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Дата оновлення" }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "updated_at", void 0);
//# sourceMappingURL=subscription-response.dto.js.map