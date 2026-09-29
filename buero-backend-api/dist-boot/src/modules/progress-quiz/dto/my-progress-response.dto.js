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
exports.MyProgressResponseDto = exports.CourseProgressItemDto = exports.ResumeLessonDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ResumeLessonDto {
}
exports.ResumeLessonDto = ResumeLessonDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResumeLessonDto.prototype, "course_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResumeLessonDto.prototype, "course_title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], ResumeLessonDto.prototype, "course_level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResumeLessonDto.prototype, "material_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResumeLessonDto.prototype, "material_title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '1-based position of the lesson in the course' }),
    __metadata("design:type", Number)
], ResumeLessonDto.prototype, "lesson_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResumeLessonDto.prototype, "lesson_total", void 0);
class CourseProgressItemDto {
}
exports.CourseProgressItemDto = CourseProgressItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID курсу' }),
    __metadata("design:type", String)
], CourseProgressItemDto.prototype, "course_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Назва курсу' }),
    __metadata("design:type", String)
], CourseProgressItemDto.prototype, "course_title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Відсоток завершення (0–100)' }),
    __metadata("design:type", Number)
], CourseProgressItemDto.prototype, "completion_percent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Кількість завершених матеріалів' }),
    __metadata("design:type", Number)
], CourseProgressItemDto.prototype, "completed_materials_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Загальна кількість матеріалів у курсі' }),
    __metadata("design:type", Number)
], CourseProgressItemDto.prototype, "total_materials_count", void 0);
class MyProgressResponseDto {
}
exports.MyProgressResponseDto = MyProgressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CourseProgressItemDto], description: 'Прогрес по курсах' }),
    __metadata("design:type", Array)
], MyProgressResponseDto.prototype, "courses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Поточний рівень студента (A1 | A2 | B1 | B2)', nullable: true }),
    __metadata("design:type", Object)
], MyProgressResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: ResumeLessonDto,
        nullable: true,
        description: 'Останній переглянутий урок серед усіх курсів',
    }),
    __metadata("design:type", Object)
], MyProgressResponseDto.prototype, "resume", void 0);
//# sourceMappingURL=my-progress-response.dto.js.map