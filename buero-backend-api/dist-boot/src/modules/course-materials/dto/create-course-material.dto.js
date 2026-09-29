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
exports.CreateCourseMaterialDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../generated/prisma/enums");
class CreateCourseMaterialDto {
}
exports.CreateCourseMaterialDto = CreateCourseMaterialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: enums_1.CourseMaterialType,
        example: 'video',
        description: 'Тип матеріалу: video | vocabulary | grammar | quiz | scenario | cultural_insight | homework | text',
    }),
    (0, class_validator_1.IsEnum)(enums_1.CourseMaterialType),
    __metadata("design:type", String)
], CreateCourseMaterialDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lesson 1: Greetings', description: 'Назва матеріалу' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCourseMaterialDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Вміст: для video — JSON з youtube_video_id; для scenario — JSON з нодами/гілками; інші — текст або JSON',
        example: { youtube_video_id: 'dQw4w9WgXcQ' },
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCourseMaterialDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.QuizMode,
        description: 'Лише для type = quiz. practice — перевірка після уроку: кожна відповідь позначається одразу разом із поясненням. ' +
            'test — підсумковий тест модуля: перевірка цілком, а правильні відповіді показуються лише після успішної здачі.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.QuizMode),
    __metadata("design:type", String)
], CreateCourseMaterialDto.prototype, "quiz_mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 60,
        description: 'Відсоток для зарахування тесту. Без нього тест неможливо провалити.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCourseMaterialDto.prototype, "passing_score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Матеріал, під яким цей показується у списку уроків — практика під своїм відео. ' +
            'Без нього матеріал стоїть у модулі сам по собі, як завжди стояли квізи.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], CreateCourseMaterialDto.prototype, "parent_material_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Порядок у модулі (order_index)' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCourseMaterialDto.prototype, "order_index", void 0);
//# sourceMappingURL=create-course-material.dto.js.map