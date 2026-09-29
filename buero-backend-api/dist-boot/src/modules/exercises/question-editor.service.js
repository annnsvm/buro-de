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
exports.QuestionEditorService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const enums_1 = require("../../generated/prisma/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const exercise_registry_1 = require("./exercise-registry");
let QuestionEditorService = class QuestionEditorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(courseId, moduleId, materialId) {
        await this.assertQuizMaterial(courseId, moduleId, materialId);
        const questions = await this.prisma.question.findMany({
            where: { materialId },
            orderBy: { orderIndex: 'asc' },
        });
        return questions.map((question) => this.toResponse(question));
    }
    async save(courseId, moduleId, materialId, questionId, dto) {
        var _a, _b, _c, _d;
        await this.assertQuizMaterial(courseId, moduleId, materialId);
        const payload = this.buildPayload(dto);
        const acceptedAnswers = dto.accepted_answers
            .map((answer) => answer.trim())
            .filter(Boolean);
        const problems = (0, exercise_registry_1.validateQuestion)({
            id: questionId !== null && questionId !== void 0 ? questionId : 'new',
            type: dto.type,
            payload,
            acceptedAnswers,
        });
        if (problems.length > 0) {
            throw new common_1.BadRequestException(problems.join('; '));
        }
        const data = {
            materialId,
            type: dto.type,
            prompt: dto.prompt.trim(),
            payload: payload,
            acceptedAnswers,
            explanation: ((_a = dto.explanation) === null || _a === void 0 ? void 0 : _a.trim()) || null,
            points: (_b = dto.points) !== null && _b !== void 0 ? _b : 1,
            skills: (_c = dto.skills) !== null && _c !== void 0 ? _c : [],
        };
        if (questionId) {
            const existing = await this.prisma.question.findFirst({
                where: { id: questionId, materialId },
            });
            if (!existing) {
                throw new common_1.NotFoundException('Питання не знайдено в цьому квізі');
            }
            const updated = await this.prisma.question.update({
                where: { id: questionId },
                data,
            });
            return this.toResponse(updated);
        }
        const last = await this.prisma.question.aggregate({
            where: { materialId },
            _max: { orderIndex: true },
        });
        const created = await this.prisma.question.create({
            data: Object.assign(Object.assign({ id: (0, crypto_1.randomUUID)() }, data), { orderIndex: ((_d = last._max.orderIndex) !== null && _d !== void 0 ? _d : -1) + 1 }),
        });
        return this.toResponse(created);
    }
    async remove(courseId, moduleId, materialId, questionId) {
        await this.assertQuizMaterial(courseId, moduleId, materialId);
        const existing = await this.prisma.question.findFirst({
            where: { id: questionId, materialId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Питання не знайдено в цьому квізі');
        }
        await this.prisma.question.delete({ where: { id: questionId } });
        return { deleted: true, id: questionId };
    }
    async reorder(courseId, moduleId, materialId, dto) {
        await this.assertQuizMaterial(courseId, moduleId, materialId);
        const owned = await this.prisma.question.findMany({
            where: { materialId },
            select: { id: true },
        });
        const ownedIds = new Set(owned.map((question) => question.id));
        const foreign = dto.ids.filter((id) => !ownedIds.has(id));
        if (foreign.length > 0) {
            throw new common_1.BadRequestException(`Питання не належать цьому квізу: ${foreign.join(', ')}`);
        }
        await this.prisma.$transaction(dto.ids.map((id, index) => this.prisma.question.update({
            where: { id },
            data: { orderIndex: index },
        })));
        return this.list(courseId, moduleId, materialId);
    }
    buildPayload(dto) {
        var _a, _b;
        if (dto.type === enums_1.QuestionType.single_choice ||
            dto.type === enums_1.QuestionType.multi_choice) {
            return {
                options: ((_a = dto.options) !== null && _a !== void 0 ? _a : []).map((option) => {
                    var _a;
                    return ({
                        id: ((_a = option.id) === null || _a === void 0 ? void 0 : _a.trim()) || (0, crypto_1.randomUUID)(),
                        text: option.text,
                    });
                }),
            };
        }
        if (dto.type === enums_1.QuestionType.ordering) {
            return { tokens: ((_b = dto.tokens) !== null && _b !== void 0 ? _b : []).map((token) => token.trim()).filter(Boolean) };
        }
        return {};
    }
    async assertQuizMaterial(courseId, moduleId, materialId) {
        const material = await this.prisma.courseMaterial.findFirst({
            where: { id: materialId, moduleId, module: { courseId } },
        });
        if (!material) {
            throw new common_1.NotFoundException('Матеріал не знайдено або не належить цьому модулю');
        }
        if (material.type !== enums_1.CourseMaterialType.quiz &&
            material.type !== enums_1.CourseMaterialType.practice) {
            throw new common_1.BadRequestException('Матеріал не містить питань');
        }
        return material;
    }
    toResponse(question) {
        var _a, _b, _c;
        const payload = ((_a = question.payload) !== null && _a !== void 0 ? _a : {});
        return {
            id: question.id,
            type: question.type,
            prompt: question.prompt,
            accepted_answers: question.acceptedAnswers,
            explanation: question.explanation,
            points: question.points,
            skills: question.skills,
            order_index: question.orderIndex,
            options: (_b = payload.options) !== null && _b !== void 0 ? _b : [],
            tokens: (_c = payload.tokens) !== null && _c !== void 0 ? _c : [],
        };
    }
};
exports.QuestionEditorService = QuestionEditorService;
exports.QuestionEditorService = QuestionEditorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionEditorService);
//# sourceMappingURL=question-editor.service.js.map