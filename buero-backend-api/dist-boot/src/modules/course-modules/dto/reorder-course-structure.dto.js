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
exports.ReorderCourseStructureDto = exports.ReorderStructureModuleDto = exports.ReorderStructureMaterialDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ReorderStructureMaterialDto {
}
exports.ReorderStructureMaterialDto = ReorderStructureMaterialDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: "uuid", description: "Material id" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReorderStructureMaterialDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: "Position inside the target module (0 = first)",
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ReorderStructureMaterialDto.prototype, "order_index", void 0);
class ReorderStructureModuleDto {
}
exports.ReorderStructureModuleDto = ReorderStructureModuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: "uuid", description: "Module id" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReorderStructureModuleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: "Position inside the course (0 = first)",
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ReorderStructureModuleDto.prototype, "order_index", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [ReorderStructureMaterialDto],
        description: "Materials that belong to this module after the move, in display order. Omit to leave the module content untouched.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReorderStructureMaterialDto),
    __metadata("design:type", Array)
], ReorderStructureModuleDto.prototype, "materials", void 0);
class ReorderCourseStructureDto {
}
exports.ReorderCourseStructureDto = ReorderCourseStructureDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ReorderStructureModuleDto],
        description: "Full course structure in display order",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReorderStructureModuleDto),
    __metadata("design:type", Array)
], ReorderCourseStructureDto.prototype, "modules", void 0);
//# sourceMappingURL=reorder-course-structure.dto.js.map