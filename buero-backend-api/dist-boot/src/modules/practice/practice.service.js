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
var PracticeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("src/generated/prisma/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const course_material_service_1 = require("../course-materials/course-material.service");
let PracticeService = PracticeService_1 = class PracticeService {
    constructor(prisma, courseMaterialService) {
        this.prisma = prisma;
        this.courseMaterialService = courseMaterialService;
    }
    async getOverview(materialId, userId, role) {
        var _a, _b, _c, _d, _e;
        const material = await this.prisma.courseMaterial.findUnique({
            where: { id: materialId },
            include: { module: true, parentMaterial: { select: { title: true } } },
        });
        if (!material) {
            throw new common_1.NotFoundException(`Матеріал з id ${materialId} не знайдено`);
        }
        if (material.type !== enums_1.CourseMaterialType.practice &&
            material.type !== enums_1.CourseMaterialType.quiz) {
            throw new common_1.BadRequestException('Матеріал не є практикою');
        }
        if ((_a = material.module) === null || _a === void 0 ? void 0 : _a.courseId) {
            await this.courseMaterialService.assertCanAccessModule(userId, role, material.module.courseId, material.moduleId);
        }
        const questions = await this.prisma.question.findMany({
            where: { materialId },
            select: { id: true, block: true, points: true },
        });
        const answers = questions.length
            ? await this.prisma.questionAttempt.findMany({
                where: { userId, questionId: { in: questions.map((q) => q.id) } },
                select: { questionId: true, isCorrect: true, answeredAt: true },
                orderBy: { answeredAt: 'asc' },
            })
            : [];
        const latest = new Map();
        for (const answer of answers)
            latest.set(answer.questionId, answer.isCorrect);
        const blocks = PracticeService_1.ORDER.map((block) => {
            const inBlock = questions.filter((question) => question.block === block);
            if (inBlock.length === 0)
                return null;
            const answered = inBlock.filter((question) => latest.has(question.id));
            const correct = answered.filter((question) => latest.get(question.id));
            return {
                block,
                total: inBlock.length,
                answered: answered.length,
                correct: correct.length,
                done: answered.length === inBlock.length,
            };
        }).filter((entry) => entry !== null);
        return {
            material_id: material.id,
            module_title: (_c = (_b = material.module) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : null,
            lesson_title: (_e = (_d = material.parentMaterial) === null || _d === void 0 ? void 0 : _d.title) !== null && _e !== void 0 ? _e : null,
            blocks,
            done_count: blocks.filter((entry) => entry.done).length,
            total_count: blocks.length,
        };
    }
};
exports.PracticeService = PracticeService;
PracticeService.ORDER = Object.values(enums_1.PracticeBlock);
exports.PracticeService = PracticeService = PracticeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        course_material_service_1.CourseMaterialService])
], PracticeService);
//# sourceMappingURL=practice.service.js.map