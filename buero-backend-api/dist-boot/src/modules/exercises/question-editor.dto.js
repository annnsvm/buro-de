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
exports.ReorderQuestionsDto = exports.SaveQuestionDto = exports.QuestionOptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../generated/prisma/enums");
class QuestionOptionDto {
}
exports.QuestionOptionDto = QuestionOptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Залишіть порожнім для нового варіанту' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuestionOptionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Warum?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], QuestionOptionDto.prototype, "text", void 0);
class SaveQuestionDto {
}
exports.SaveQuestionDto = SaveQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.QuestionType }),
    (0, class_validator_1.IsEnum)(enums_1.QuestionType),
    __metadata("design:type", String)
], SaveQuestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ich bleibe zu Hause, weil ich krank ___.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], SaveQuestionDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Для вибору — id правильних варіантів (для кількох правильних — один рядок з id через кому). ' +
            'Для письмових — самі формулювання, кожне окремим рядком.',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SaveQuestionDto.prototype, "accepted_answers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [QuestionOptionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuestionOptionDto),
    __metadata("design:type", Array)
], SaveQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Слова для впорядкування' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SaveQuestionDto.prototype, "tokens", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Показується студенту після відповіді' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], SaveQuestionDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SaveQuestionDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['weil'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SaveQuestionDto.prototype, "skills", void 0);
class ReorderQuestionsDto {
}
exports.ReorderQuestionsDto = ReorderQuestionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Id питань у потрібному порядку' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReorderQuestionsDto.prototype, "ids", void 0);
//# sourceMappingURL=question-editor.dto.js.map