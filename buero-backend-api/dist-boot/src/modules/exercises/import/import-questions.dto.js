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
exports.ImportQuestionsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../generated/prisma/enums");
class ImportQuestionsDto {
}
exports.ImportQuestionsDto = ImportQuestionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Вміст CSV-файлу. Колонки: ID, Урок, Тип, Питання, A, B, C, D, Правильна відповідь, Пояснення.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000000),
    __metadata("design:type", String)
], ImportQuestionsDto.prototype, "csv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: enums_1.QuizMode,
        description: 'practice — з файлу створюється по квізу на кожен урок із колонки «Урок». ' +
            'test — увесь файл стає одним підсумковим тестом модуля.',
    }),
    (0, class_validator_1.IsEnum)(enums_1.QuizMode),
    __metadata("design:type", String)
], ImportQuestionsDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'true — лише показати, що буде створено, нічого не змінюючи.',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImportQuestionsDto.prototype, "dry_run", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 60, description: 'Відсоток для зарахування тесту.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ImportQuestionsDto.prototype, "passing_score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'true — додати до правильних відповідей ті формулювання, які згадані в поясненні як прийнятні. ' +
            'За замовчуванням вони лише показуються у попередньому перегляді.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImportQuestionsDto.prototype, "accept_alternatives", void 0);
//# sourceMappingURL=import-questions.dto.js.map