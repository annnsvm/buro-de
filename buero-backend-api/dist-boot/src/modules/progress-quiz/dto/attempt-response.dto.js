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
exports.AttemptResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AttemptResponseDto {
}
exports.AttemptResponseDto = AttemptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID спроби' }),
    __metadata("design:type", String)
], AttemptResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID матеріалу (квізу)' }),
    __metadata("design:type", String)
], AttemptResponseDto.prototype, "course_material_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Статус: in_progress | completed' }),
    __metadata("design:type", String)
], AttemptResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Збережені відповіді (для resume)', nullable: true }),
    __metadata("design:type", Object)
], AttemptResponseDto.prototype, "answers_snapshot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Бал після завершення', nullable: true }),
    __metadata("design:type", Object)
], AttemptResponseDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Час завершення', nullable: true }),
    __metadata("design:type", Object)
], AttemptResponseDto.prototype, "completed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Час створення спроби' }),
    __metadata("design:type", String)
], AttemptResponseDto.prototype, "created_at", void 0);
//# sourceMappingURL=attempt-response.dto.js.map