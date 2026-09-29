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
exports.QuestionImportService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../../generated/prisma/enums");
const prisma_service_1 = require("../../../prisma/prisma.service");
const exercise_registry_1 = require("../exercise-registry");
const parse_question_csv_1 = require("./parse-question-csv");
const TEST_MATERIAL_TITLE = 'Тест модуля';
let QuestionImportService = class QuestionImportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async preview(courseId, moduleId, csv, mode) {
        const { plan, problems, unusable } = await this.buildPlan(courseId, moduleId, csv, mode);
        return {
            mode,
            problems,
            unusable,
            totalQuestions: plan.reduce((sum, target) => sum + target.questions.length, 0),
            targets: plan.map((target) => ({
                title: target.title,
                existingMaterialId: target.existingMaterialId,
                questionCount: target.questions.length,
                points: target.questions.reduce((sum, question) => sum + question.points, 0),
                typeCounts: target.questions.reduce((counts, question) => {
                    var _a;
                    counts[question.type] = ((_a = counts[question.type]) !== null && _a !== void 0 ? _a : 0) + 1;
                    return counts;
                }, {}),
                alternatives: target.questions
                    .filter((question) => question.suggestedAlternatives.length > 0)
                    .map((question) => ({
                    id: question.id,
                    prompt: question.prompt,
                    wordings: question.suggestedAlternatives,
                })),
            })),
        };
    }
    async commit(courseId, moduleId, csv, mode, options = {}) {
        var _a;
        const { plan, problems, unusable } = await this.buildPlan(courseId, moduleId, csv, mode);
        let created = 0;
        let updated = 0;
        const lastIndex = await this.prisma.courseMaterial.aggregate({
            where: { moduleId },
            _max: { orderIndex: true },
        });
        let nextIndex = ((_a = lastIndex._max.orderIndex) !== null && _a !== void 0 ? _a : -1) + 1;
        await this.prisma.$transaction(async (tx) => {
            for (const target of plan) {
                let materialId = target.existingMaterialId;
                if (materialId) {
                    await tx.courseMaterial.update({
                        where: { id: materialId },
                        data: Object.assign({ quizMode: mode }, (options.passingScore !== undefined && {
                            passingScore: options.passingScore,
                        })),
                    });
                    updated += 1;
                }
                else {
                    const material = await tx.courseMaterial.create({
                        data: Object.assign(Object.assign({ moduleId, type: enums_1.CourseMaterialType.quiz, title: target.title, content: {}, quizMode: mode }, (options.passingScore !== undefined && {
                            passingScore: options.passingScore,
                        })), { orderIndex: nextIndex }),
                    });
                    nextIndex += 1;
                    materialId = material.id;
                    created += 1;
                }
                const keptIds = target.questions.map((question) => question.id);
                await tx.question.deleteMany({
                    where: { materialId, id: { notIn: keptIds } },
                });
                for (const [index, question] of target.questions.entries()) {
                    const acceptedAnswers = options.acceptAlternatives
                        ? [...question.acceptedAnswers, ...question.suggestedAlternatives]
                        : question.acceptedAnswers;
                    const data = {
                        materialId,
                        type: question.type,
                        prompt: question.prompt,
                        payload: Object.assign(Object.assign({}, (question.options.length > 0 && { options: question.options })), (question.tokens && {
                            tokens: question.tokens,
                        })),
                        acceptedAnswers,
                        explanation: question.explanation,
                        points: question.points,
                        partTitle: question.group,
                        reviewLesson: question.reviewLesson,
                        orderIndex: index,
                    };
                    await tx.question.upsert({
                        where: { id: question.id },
                        create: Object.assign({ id: question.id }, data),
                        update: data,
                    });
                }
            }
        });
        const preview = await this.preview(courseId, moduleId, csv, mode);
        return Object.assign(Object.assign({}, preview), { problems, unusable, created, updated });
    }
    async buildPlan(courseId, moduleId, csv, mode) {
        const module = await this.prisma.courseModule.findFirst({
            where: { id: moduleId, courseId },
        });
        if (!module) {
            throw new common_1.NotFoundException(`Модуль з id ${moduleId} не знайдено або не належить курсу`);
        }
        const { questions, problems } = (0, parse_question_csv_1.parseQuestionCsv)(csv);
        const unusable = questions
            .map((question) => ({
            id: question.id,
            reasons: (0, exercise_registry_1.validateQuestion)({
                id: question.id,
                type: question.type,
                payload: Object.assign(Object.assign({}, (question.options.length > 0 && { options: question.options })), (question.tokens && {
                    tokens: question.tokens,
                })),
                acceptedAnswers: question.acceptedAnswers,
            }),
        }))
            .filter((entry) => entry.reasons.length > 0);
        const unusableIds = new Set(unusable.map((entry) => entry.id));
        const usable = questions.filter((question) => !unusableIds.has(question.id));
        const groups = mode === enums_1.QuizMode.test
            ? [{ group: TEST_MATERIAL_TITLE, questions: usable }]
            : (0, parse_question_csv_1.groupQuestions)(usable);
        const existing = await this.prisma.courseMaterial.findMany({
            where: { moduleId, type: enums_1.CourseMaterialType.quiz },
            select: { id: true, title: true },
        });
        const idByTitle = new Map(existing.map((material) => [material.title, material.id]));
        const plan = groups
            .filter((entry) => entry.questions.length > 0)
            .map((entry) => {
            var _a;
            return ({
                title: entry.group,
                existingMaterialId: (_a = idByTitle.get(entry.group)) !== null && _a !== void 0 ? _a : null,
                questions: entry.questions,
            });
        });
        return { plan, problems, unusable };
    }
};
exports.QuestionImportService = QuestionImportService;
exports.QuestionImportService = QuestionImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionImportService);
//# sourceMappingURL=question-import.service.js.map