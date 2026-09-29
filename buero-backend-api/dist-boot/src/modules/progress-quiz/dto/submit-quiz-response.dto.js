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
exports.SubmitQuizResponseDto = exports.SubmitQuizResultItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SubmitQuizResultItemDto {
}
exports.SubmitQuizResultItemDto = SubmitQuizResultItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "q1", description: "ID питання" }),
    __metadata("design:type", String)
], SubmitQuizResultItemDto.prototype, "question_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Чи відповідь правильна" }),
    __metadata("design:type", Boolean)
], SubmitQuizResultItemDto.prototype, "correct", void 0);
class SubmitQuizResponseDto {
}
exports.SubmitQuizResponseDto = SubmitQuizResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Завершена спроба (status=completed, score заповнено)' }),
    __metadata("design:type", Object)
], SubmitQuizResponseDto.prototype, "attempt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Відсоток правильних (0–100)' }),
    __metadata("design:type", Number)
], SubmitQuizResponseDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Кількість питань' }),
    __metadata("design:type", Number)
], SubmitQuizResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Кількість правильних відповідей' }),
    __metadata("design:type", Number)
], SubmitQuizResponseDto.prototype, "correct", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [SubmitQuizResultItemDto],
        description: 'По кожному питанню: чи відповідь правильна',
    }),
    __metadata("design:type", Array)
], SubmitQuizResponseDto.prototype, "results", void 0);
//# sourceMappingURL=submit-quiz-response.dto.js.map