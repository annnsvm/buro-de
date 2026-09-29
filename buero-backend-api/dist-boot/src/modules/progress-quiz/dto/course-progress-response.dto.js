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
exports.CourseProgressResponseDto = exports.CompletedMaterialItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CompletedMaterialItemDto {
}
exports.CompletedMaterialItemDto = CompletedMaterialItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID матеріалу' }),
    __metadata("design:type", String)
], CompletedMaterialItemDto.prototype, "course_material_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID модуля (опційно для UI)' }),
    __metadata("design:type", String)
], CompletedMaterialItemDto.prototype, "module_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата/час завершення' }),
    __metadata("design:type", String)
], CompletedMaterialItemDto.prototype, "completed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Бал (якщо є)', nullable: true }),
    __metadata("design:type", Object)
], CompletedMaterialItemDto.prototype, "score", void 0);
class CourseProgressResponseDto {
}
exports.CourseProgressResponseDto = CourseProgressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CompletedMaterialItemDto], description: 'Список завершених матеріалів' }),
    __metadata("design:type", Array)
], CourseProgressResponseDto.prototype, "completed_materials", void 0);
//# sourceMappingURL=course-progress-response.dto.js.map