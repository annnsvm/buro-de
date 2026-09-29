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
exports.CreateUserDto = exports.LanguageEnum = exports.RoleEnum = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["student"] = "student";
    RoleEnum["teacher"] = "teacher";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var LanguageEnum;
(function (LanguageEnum) {
    LanguageEnum["en"] = "en";
    LanguageEnum["de"] = "de";
})(LanguageEnum || (exports.LanguageEnum = LanguageEnum = {}));
class CreateUserDto {
    constructor() {
        this.email = "";
        this.password = "";
        this.role = RoleEnum.student;
        this.locale = undefined;
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "Олена Петренко",
        description: "Ім'я для відображення (опційно)",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "SecurePass1",
        description: "Min 9 chars, 1 uppercase, 1 digit",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9, { message: "Password must be at least 9 characters" }),
    (0, class_validator_1.Matches)(/(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter",
    }),
    (0, class_validator_1.Matches)(/(?=.*[0-9])/, {
        message: "Password must contain at least one digit",
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RoleEnum }),
    (0, class_validator_1.IsEnum)(RoleEnum),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: LanguageEnum, default: "en" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LanguageEnum),
    __metadata("design:type", String)
], CreateUserDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ["uk", "en"],
        description: "Locale for verification and welcome emails",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["uk", "en"]),
    __metadata("design:type", String)
], CreateUserDto.prototype, "locale", void 0);
//# sourceMappingURL=create-user.dto.js.map