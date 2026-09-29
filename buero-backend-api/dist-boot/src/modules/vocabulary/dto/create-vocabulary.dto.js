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
exports.CreateVocabularyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../generated/prisma/enums");
class CreateVocabularyDto {
}
exports.CreateVocabularyDto = CreateVocabularyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Arbeit', description: 'Слово (унікальне у вашому словнику)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateVocabularyDto.prototype, "word", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'робота', description: 'Переклад' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateVocabularyDto.prototype, "translation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.VocabularyCategory,
        default: enums_1.VocabularyCategory.vocabulary,
        description: 'Категорія для фільтра у словнику',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.VocabularyCategory),
    __metadata("design:type", String)
], CreateVocabularyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Zur Arbeit gehen', description: 'Нотатка' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateVocabularyDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Курс, під час якого слово було додане' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVocabularyDto.prototype, "course_id", void 0);
//# sourceMappingURL=create-vocabulary.dto.js.map