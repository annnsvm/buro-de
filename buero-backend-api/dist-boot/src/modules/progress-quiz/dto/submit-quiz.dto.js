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
exports.SubmitQuizDto = exports.SubmitQuizAnswerItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SubmitQuizAnswerItemDto {
}
exports.SubmitQuizAnswerItemDto = SubmitQuizAnswerItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "q1",
        description: "ID питання (content.questions[].id або в блоках)",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitQuizAnswerItemDto.prototype, "question_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "a",
        description: "Відповідь: id варіанту або рядок (має збігатися з correct у питанні)",
        oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
    }),
    (0, class_validator_1.Allow)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], SubmitQuizAnswerItemDto.prototype, "answer", void 0);
class SubmitQuizDto {
}
exports.SubmitQuizDto = SubmitQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [SubmitQuizAnswerItemDto],
        example: [
            { question_id: "q1", answer: "a" },
            { question_id: "q2", answer: "b" },
        ],
        description: "Масив відповідей; question_id відповідає id питання в контенті квізу",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SubmitQuizAnswerItemDto),
    __metadata("design:type", Array)
], SubmitQuizDto.prototype, "answers", void 0);
//# sourceMappingURL=submit-quiz.dto.js.map