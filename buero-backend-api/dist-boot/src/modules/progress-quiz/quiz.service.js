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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("src/generated/prisma/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const shuffle_1 = require("./shuffle");
const course_material_service_1 = require("../course-materials/course-material.service");
const exercise_registry_1 = require("../exercises/exercise-registry");
const score_attempt_1 = require("./score-attempt");
const ANSWERABLE_TYPES = new Set([
    enums_1.CourseMaterialType.quiz,
    enums_1.CourseMaterialType.practice,
]);
let QuizService = class QuizService {
    constructor(prisma, courseMaterialService) {
        this.prisma = prisma;
        this.courseMaterialService = courseMaterialService;
    }
    async startAttempt(userId, role, courseMaterialId) {
        var _a;
        const material = await this.prisma.courseMaterial.findUnique({
            where: { id: courseMaterialId },
            include: { module: true },
        });
        if (!material) {
            throw new common_1.NotFoundException(`Матеріал з id ${courseMaterialId} не знайдено`);
        }
        if (!ANSWERABLE_TYPES.has(material.type)) {
            throw new common_1.BadRequestException("Матеріал не містить питань (потрібен quiz або practice)");
        }
        const courseId = (_a = material.module) === null || _a === void 0 ? void 0 : _a.courseId;
        if (courseId) {
            await this.courseMaterialService.assertCanAccessCourse(userId, role, courseId);
        }
        const attempt = await this.prisma.quizAttempt.create({
            data: {
                userId,
                courseMaterialId,
            },
        });
        return this.toAttemptResponse(attempt);
    }
    async getQuestions(materialId, userId, role, block) {
        var _a;
        const material = await this.assertCanAccessQuiz(materialId, userId, role);
        const questions = await this.prisma.question.findMany({
            where: Object.assign({ materialId }, (block && { block })),
            orderBy: { orderIndex: "asc" },
        });
        const mode = (_a = material.quizMode) !== null && _a !== void 0 ? _a : enums_1.QuizMode.practice;
        const totalPoints = mode === enums_1.QuizMode.test
            ? questions.reduce((sum, q) => sum + Math.max(1, q.points), 0)
            : null;
        return {
            mode,
            passing_score: material.passingScore,
            total_points: totalPoints,
            passing_points: (0, score_attempt_1.passingPoints)(material.passingScore, totalPoints),
            questions: questions.map((question) => {
                var _a;
                const payload = ((_a = question.payload) !== null && _a !== void 0 ? _a : {});
                return Object.assign(Object.assign({ id: question.id, type: question.type, prompt: question.prompt, points: question.points, order_index: question.orderIndex }, (Array.isArray(payload.options) && {
                    options: payload.options.map((option) => ({
                        id: option.id,
                        text: option.text,
                    })),
                })), (Array.isArray(payload.tokens) && {
                    tokens: (0, shuffle_1.shuffle)(payload.tokens),
                }));
            }),
        };
    }
    async getLastAttempt(materialId, userId, role) {
        var _a, _b, _c;
        const material = await this.assertCanAccessQuiz(materialId, userId, role);
        const { best: attempt, hasOutdated } = await this.bestCurrentAttempt(materialId, userId);
        if (!attempt) {
            return hasOutdated ? { outdated: true } : null;
        }
        const [answers, questions] = await Promise.all([
            this.prisma.questionAttempt.findMany({
                where: { quizAttemptId: attempt.id },
            }),
            this.prisma.question.findMany({ where: { materialId } }),
        ]);
        const questionsById = new Map(questions.map((q) => [q.id, q]));
        const score = attempt.score != null ? Number(attempt.score) : 0;
        const reveal = this.mayRevealAnswers(material, score);
        const attemptCount = await this.prisma.quizAttempt.count({
            where: { userId, courseMaterialId: materialId, completedAt: { not: null } },
        });
        const mode = (_a = material.quizMode) !== null && _a !== void 0 ? _a : enums_1.QuizMode.practice;
        const correctById = new Map(answers.map((answer) => [answer.questionId, answer.isCorrect]));
        const gradedQuestions = questions.map((question) => {
            var _a;
            return ({
                points: question.points,
                correct: (_a = correctById.get(question.id)) !== null && _a !== void 0 ? _a : false,
                partTitle: question.partTitle,
                reviewLesson: question.reviewLesson,
            });
        });
        const scored = (0, score_attempt_1.scoreAttempt)(mode, gradedQuestions);
        return {
            attempt_id: attempt.id,
            completed_at: (_c = (_b = attempt.completedAt) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : null,
            score,
            total: questions.length,
            correct: answers.filter((answer) => answer.isCorrect).length,
            earned_points: scored.earnedPoints,
            total_points: scored.totalPoints,
            attempts: attemptCount,
            mode,
            passing_score: material.passingScore,
            passing_points: (0, score_attempt_1.passingPoints)(material.passingScore, scored.totalPoints),
            passed: material.passingScore == null ? null : score >= material.passingScore,
            reveal_answers: reveal,
            parts: toPartsResponse((0, score_attempt_1.summariseParts)(mode, gradedQuestions)),
            answers: answers.flatMap((answer) => {
                const question = questionsById.get(answer.questionId);
                if (!question)
                    return [];
                const graded = (0, exercise_registry_1.gradeAnswer)(question, answer.rawAnswer);
                return [
                    {
                        question_id: answer.questionId,
                        correct: answer.isCorrect,
                        quality: graded.quality,
                        explanation: question.explanation,
                        accepted_answers: reveal ? (0, exercise_registry_1.describeAcceptedAnswers)(question) : [],
                        raw_answer: answer.rawAnswer,
                    },
                ];
            }),
        };
    }
    async bestCurrentAttempt(materialId, userId) {
        var _a;
        const questions = await this.prisma.question.findMany({
            where: { materialId },
            select: { id: true },
        });
        const currentIds = new Set(questions.map((question) => question.id));
        const attempts = await this.prisma.quizAttempt.findMany({
            where: { userId, courseMaterialId: materialId, completedAt: { not: null } },
            include: { questionAttempts: { select: { questionId: true } } },
            orderBy: [{ score: "desc" }, { completedAt: "desc" }],
        });
        const current = attempts.filter((attempt) => {
            const answered = new Set(attempt.questionAttempts.map((answer) => answer.questionId));
            return (answered.size === currentIds.size &&
                [...answered].every((id) => currentIds.has(id)));
        });
        return {
            best: (_a = current[0]) !== null && _a !== void 0 ? _a : null,
            questionCount: currentIds.size,
            hasOutdated: current.length === 0 && attempts.length > 0,
        };
    }
    async assertCanAccessQuiz(materialId, userId, role) {
        var _a;
        const material = await this.prisma.courseMaterial.findUnique({
            where: { id: materialId },
            include: { module: true },
        });
        if (!material) {
            throw new common_1.NotFoundException(`Матеріал з id ${materialId} не знайдено`);
        }
        if (!ANSWERABLE_TYPES.has(material.type)) {
            throw new common_1.BadRequestException("Матеріал не містить питань (потрібен quiz або practice)");
        }
        if ((_a = material.module) === null || _a === void 0 ? void 0 : _a.courseId) {
            await this.courseMaterialService.assertCanAccessModule(userId, role, material.module.courseId, material.moduleId);
        }
        return material;
    }
    async getAttempt(attemptId, userId) {
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
        });
        if (!attempt) {
            throw new common_1.NotFoundException(`Спробу з id ${attemptId} не знайдено`);
        }
        if (attempt.userId !== userId) {
            throw new common_1.NotFoundException(`Спробу з id ${attemptId} не знайдено`);
        }
        return this.toAttemptResponse(attempt);
    }
    async answerQuestion(attemptId, userId, body) {
        const attempt = await this.loadOwnAttempt(attemptId, userId);
        if (attempt.completedAt) {
            throw new common_1.BadRequestException("Спробу вже завершено, відповіді не приймаються");
        }
        const material = await this.prisma.courseMaterial.findUnique({
            where: { id: attempt.courseMaterialId },
            select: { quizMode: true },
        });
        if ((material === null || material === void 0 ? void 0 : material.quizMode) === enums_1.QuizMode.test) {
            throw new common_1.BadRequestException("Тест перевіряється цілком: надішліть усі відповіді разом");
        }
        const question = await this.prisma.question.findFirst({
            where: { id: body.question_id, materialId: attempt.courseMaterialId },
        });
        if (!question) {
            throw new common_1.NotFoundException(`Питання з id "${body.question_id}" не знайдено в цьому квізі`);
        }
        const already = await this.prisma.questionAttempt.findFirst({
            where: { quizAttemptId: attemptId, questionId: question.id },
        });
        if (already) {
            throw new common_1.BadRequestException("На це питання вже відповіли");
        }
        const graded = (0, exercise_registry_1.gradeAnswer)(question, body.answer);
        await this.prisma.questionAttempt.create({
            data: {
                userId,
                questionId: question.id,
                quizAttemptId: attemptId,
                isCorrect: graded.correct,
                rawAnswer: body.answer,
            },
        });
        const [questionCount, answers] = await Promise.all([
            this.prisma.question.count({
                where: { materialId: attempt.courseMaterialId },
            }),
            this.prisma.questionAttempt.findMany({
                where: { quizAttemptId: attemptId },
                select: { isCorrect: true },
            }),
        ]);
        const finished = answers.length >= questionCount;
        const summary = finished
            ? await this.finishAttempt(attempt, userId, answers, questionCount)
            : null;
        return {
            question_id: question.id,
            correct: graded.correct,
            quality: graded.quality,
            explanation: question.explanation,
            accepted_answers: (0, exercise_registry_1.describeAcceptedAnswers)(question),
            answered: answers.length,
            total: questionCount,
            summary,
        };
    }
    async finishAttempt(attempt, userId, answers, questionCount) {
        const graded = answers.map((answer) => ({
            points: 1,
            correct: answer.isCorrect,
        }));
        while (graded.length < questionCount) {
            graded.push({ points: 1, correct: false });
        }
        const { score, correct: correctCount } = (0, score_attempt_1.scoreAttempt)(enums_1.QuizMode.practice, graded);
        const completedAt = new Date();
        await this.prisma.quizAttempt.update({
            where: { id: attempt.id },
            data: { score, completedAt },
        });
        const bestScore = await this.recordMaterialProgress(attempt.courseMaterialId, userId, score, completedAt);
        return { score, best_score: bestScore, total: questionCount, correct: correctCount };
    }
    async loadOwnAttempt(attemptId, userId) {
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
        });
        if (!attempt || attempt.userId !== userId) {
            throw new common_1.NotFoundException(`Спробу з id ${attemptId} не знайдено`);
        }
        return attempt;
    }
    mayRevealAnswers(material, score) {
        return this.hasPassed(material, score);
    }
    hasPassed(material, score) {
        if (material.quizMode !== enums_1.QuizMode.test)
            return true;
        if (material.passingScore == null)
            return true;
        return score >= material.passingScore;
    }
    async recordMaterialProgress(courseMaterialId, userId, score, completedAt) {
        var _a;
        const material = await this.prisma.courseMaterial.findUnique({
            where: { id: courseMaterialId },
            include: { module: true },
        });
        const courseId = (_a = material === null || material === void 0 ? void 0 : material.module) === null || _a === void 0 ? void 0 : _a.courseId;
        if (!courseId)
            return score;
        const { best } = await this.bestCurrentAttempt(courseMaterialId, userId);
        const previousBest = (best === null || best === void 0 ? void 0 : best.score) != null ? Number(best.score) : null;
        const bestScore = previousBest != null ? Math.max(previousBest, score) : score;
        if (!this.hasPassed(material, bestScore)) {
            return bestScore;
        }
        await this.prisma.courseProgress.upsert({
            where: {
                userId_courseId_courseMaterialId: { userId, courseId, courseMaterialId },
            },
            create: { userId, courseId, courseMaterialId, completedAt, score: bestScore },
            update: { completedAt, score: bestScore },
        });
        return bestScore;
    }
    async submitQuiz(attemptId, userId, body) {
        var _a;
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
            include: { courseMaterial: true },
        });
        if (!attempt) {
            throw new common_1.NotFoundException(`Спробу з id ${attemptId} не знайдено`);
        }
        if (attempt.userId !== userId) {
            throw new common_1.NotFoundException(`Спробу з id ${attemptId} не знайдено`);
        }
        if (attempt.completedAt) {
            throw new common_1.BadRequestException("Спробу вже завершено, відповіді не приймаються");
        }
        const questions = await this.prisma.question.findMany({
            where: { materialId: attempt.courseMaterialId },
            orderBy: { orderIndex: "asc" },
        });
        if (questions.length === 0) {
            throw new common_1.BadRequestException("Квіз не містить питань");
        }
        const questionsById = new Map(questions.map((q) => [q.id, q]));
        const snapshot = {};
        const results = [];
        const answeredIds = new Set();
        let correctCount = 0;
        for (const a of body.answers) {
            const question = questionsById.get(a.question_id);
            if (!question) {
                throw new common_1.BadRequestException(`Питання з id "${a.question_id}" не знайдено в квізі`);
            }
            if (answeredIds.has(a.question_id)) {
                throw new common_1.BadRequestException(`Питання з id "${a.question_id}" надіслано двічі`);
            }
            answeredIds.add(a.question_id);
            snapshot[`question_${a.question_id}`] = {
                question_id: a.question_id,
                answer: a.answer,
            };
            const graded = (0, exercise_registry_1.gradeAnswer)(question, a.answer);
            results.push({
                question_id: a.question_id,
                correct: graded.correct,
                quality: graded.quality,
                explanation: question.explanation,
            });
            if (graded.correct)
                correctCount += 1;
        }
        for (const question of questions) {
            if (answeredIds.has(question.id))
                continue;
            results.push({
                question_id: question.id,
                correct: false,
                quality: "none",
                explanation: question.explanation,
            });
        }
        const orderById = new Map(questions.map((q, index) => [q.id, index]));
        results.sort((a, b) => { var _a, _b; return ((_a = orderById.get(a.question_id)) !== null && _a !== void 0 ? _a : 0) - ((_b = orderById.get(b.question_id)) !== null && _b !== void 0 ? _b : 0); });
        const mode = (_a = attempt.courseMaterial.quizMode) !== null && _a !== void 0 ? _a : enums_1.QuizMode.practice;
        const correctById = new Map(results.map((result) => [result.question_id, result.correct]));
        const graded = questions.map((question) => {
            var _a;
            return ({
                points: question.points,
                correct: (_a = correctById.get(question.id)) !== null && _a !== void 0 ? _a : false,
                partTitle: question.partTitle,
                reviewLesson: question.reviewLesson,
            });
        });
        const scored = (0, score_attempt_1.scoreAttempt)(mode, graded);
        const parts = (0, score_attempt_1.summariseParts)(mode, graded);
        const { score, total } = scored;
        const completedAt = new Date();
        const updated = await this.prisma.quizAttempt.update({
            where: { id: attemptId },
            data: {
                answersSnapshot: snapshot,
                score,
                completedAt,
            },
        });
        await this.prisma.questionAttempt.createMany({
            data: body.answers.map((a) => {
                var _a, _b;
                return ({
                    userId,
                    questionId: a.question_id,
                    quizAttemptId: attemptId,
                    isCorrect: (_b = (_a = results.find((r) => r.question_id === a.question_id)) === null || _a === void 0 ? void 0 : _a.correct) !== null && _b !== void 0 ? _b : false,
                    rawAnswer: a.answer,
                });
            }),
        });
        const bestScore = await this.recordMaterialProgress(attempt.courseMaterialId, userId, score, completedAt);
        const { passingScore } = attempt.courseMaterial;
        const reveal = this.mayRevealAnswers(attempt.courseMaterial, score);
        return {
            attempt: this.toAttemptResponse(updated),
            score,
            best_score: bestScore,
            total,
            correct: correctCount,
            earned_points: scored.earnedPoints,
            total_points: scored.totalPoints,
            mode,
            passing_score: passingScore,
            passing_points: (0, score_attempt_1.passingPoints)(passingScore, scored.totalPoints),
            passed: passingScore == null ? null : score >= passingScore,
            reveal_answers: reveal,
            parts: toPartsResponse(parts),
            results: results.map((result) => (Object.assign(Object.assign({}, result), { accepted_answers: reveal
                    ? (0, exercise_registry_1.describeAcceptedAnswers)(questionsById.get(result.question_id))
                    : [] }))),
        };
    }
    toAttemptResponse(attempt) {
        var _a, _b;
        return {
            id: attempt.id,
            course_material_id: attempt.courseMaterialId,
            status: attempt.completedAt
                ? "completed"
                : "in_progress",
            answers_snapshot: attempt.answersSnapshot,
            score: attempt.score != null ? Number(attempt.score) : null,
            completed_at: (_b = (_a = attempt.completedAt) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
            created_at: attempt.createdAt.toISOString(),
        };
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        course_material_service_1.CourseMaterialService])
], QuizService);
const toPartsResponse = (parts) => parts.map((part) => ({
    title: part.title,
    review_lesson: part.reviewLesson,
    earned_points: part.earnedPoints,
    total_points: part.totalPoints,
    correct: part.correct,
    total: part.total,
    weak: part.weak,
}));
//# sourceMappingURL=quiz.service.js.map