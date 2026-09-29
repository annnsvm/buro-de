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
exports.ListCoursesQueryDto = exports.PublicationStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../generated/prisma/enums");
var PublicationStatus;
(function (PublicationStatus) {
    PublicationStatus["all"] = "all";
    PublicationStatus["published"] = "published";
    PublicationStatus["unpublished"] = "unpublished";
})(PublicationStatus || (exports.PublicationStatus = PublicationStatus = {}));
class ListCoursesQueryDto {
}
exports.ListCoursesQueryDto = ListCoursesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Пошук по назві або опису курсу (OR, без урахування регістру)",
        example: "German",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], ListCoursesQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.Language,
        description: "Фільтр за мовою контенту",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.Language),
    __metadata("design:type", String)
], ListCoursesQueryDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Language,Integration",
        description: "Фільтр за тегами (через кому). Курс має містити хоча б один із тегів.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListCoursesQueryDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Integration",
        description: "Виключити курси з цими тегами (через кому). Дозволяє описати категорію через те, " +
            "чим вона не є, і не залежати від того, чи розставлені теги вручну.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListCoursesQueryDto.prototype, "tags_exclude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.Level,
        description: "Фільтр за рівнем курсу (A1, A2, B1, B2)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.Level),
    __metadata("design:type", String)
], ListCoursesQueryDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: PublicationStatus,
        description: "Фільтр публікації (manage): all — усі, published — тільки опубліковані, unpublished — тільки неопубліковані",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PublicationStatus),
    __metadata("design:type", String)
], ListCoursesQueryDto.prototype, "publication_status", void 0);
//# sourceMappingURL=list-courses-query.dto.js.map