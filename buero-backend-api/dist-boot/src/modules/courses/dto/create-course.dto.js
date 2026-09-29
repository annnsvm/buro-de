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
exports.CreateCourseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../generated/prisma/enums");
class CreateCourseDto {
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'German A1 Basics', description: 'Назва курсу' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Introduction to German language.', description: 'Опис курсу' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.Language, example: 'en', description: 'Мова контенту курсу' }),
    (0, class_validator_1.IsEnum)(enums_1.Language),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false, description: 'Чи опублікований курс' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCourseDto.prototype, "is_published", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 29.99, description: 'Ціна курсу (наприклад у євро)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['Language', 'Integration'],
        description: 'Теги для пошуку: Language, Integration, Culture & Life',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCourseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.Level,
        example: 'A1',
        description: 'Рівень, з якого починається курс',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.Level),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.Level,
        example: 'B1',
        description: 'Найвищий рівень, якого досягає курс, якщо він охоплює кілька. ' +
            'Без нього курс стоїть лише на level. Каталог показує курс під кожним рівнем діапазону.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.Level),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "level_to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12, description: 'Тривалість курсу в годинах' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(9999),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "duration_hours", void 0);
//# sourceMappingURL=create-course.dto.js.map