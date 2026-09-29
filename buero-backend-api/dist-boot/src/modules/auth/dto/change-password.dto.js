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
exports.ChangePasswordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "OldSecure1",
        description: "Поточний пароль",
        minLength: 9,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9, { message: "Current password must be at least 9 characters" }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "current_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "NewSecure2",
        description: "Новий пароль: мін. 9 символів, 1 велика літера, 1 цифра",
        minLength: 9,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9, { message: "New password must be at least 9 characters" }),
    (0, class_validator_1.Matches)(/(?=.*[A-Z])/, {
        message: "New password must contain at least one uppercase letter",
    }),
    (0, class_validator_1.Matches)(/(?=.*[0-9])/, {
        message: "New password must contain at least one digit",
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "new_password", void 0);
//# sourceMappingURL=change-password.dto.js.map