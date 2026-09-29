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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const course_material_service_1 = require("../course-materials/course-material.service");
let ProgressService = class ProgressService {
    constructor(prisma, courseMaterialService) {
        this.prisma = prisma;
        this.courseMaterialService = courseMaterialService;
    }
    async getMyProgress(userId) {
        var _a, _b;
        const [progressRows, profile] = await Promise.all([
            this.prisma.courseProgress.findMany({
                where: { userId },
                include: {
                    course: { select: { id: true, title: true, level: true } },
                    courseMaterial: { select: { id: true } },
                },
            }),
            this.prisma.studentProfile.findUnique({
                where: { userId },
                select: { level: true },
            }),
        ]);
        const courseIds = [...new Set(progressRows.map((r) => r.courseId))];
        const moduleCounts = courseIds.length
            ? await this.prisma.courseModule.findMany({
                where: { courseId: { in: courseIds } },
                select: { courseId: true, _count: { select: { materials: true } } },
            })
            : [];
        const totalByCourse = new Map();
        for (const m of moduleCounts) {
            totalByCourse.set(m.courseId, ((_a = totalByCourse.get(m.courseId)) !== null && _a !== void 0 ? _a : 0) + m._count.materials);
        }
        const completedByCourse = new Map();
        for (const p of progressRows) {
            if (!p.courseMaterialId)
                continue;
            const key = p.courseId;
            const prev = completedByCourse.get(key);
            const title = p.course.title;
            if (!prev) {
                completedByCourse.set(key, { count: 1, title });
            }
            else {
                prev.count += 1;
            }
        }
        const courseIdsSet = new Set(progressRows.map((r) => r.courseId));
        const courses = Array.from(courseIdsSet).map((courseId) => {
            var _a, _b, _c, _d, _e;
            const total = (_a = totalByCourse.get(courseId)) !== null && _a !== void 0 ? _a : 0;
            const completed = (_c = (_b = completedByCourse.get(courseId)) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0;
            const title = (_e = (_d = completedByCourse.get(courseId)) === null || _d === void 0 ? void 0 : _d.title) !== null && _e !== void 0 ? _e : '';
            const completion_percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            return {
                course_id: courseId,
                course_title: title,
                completion_percent,
                completed_materials_count: completed,
                total_materials_count: total,
            };
        });
        return {
            courses,
            level: (_b = profile === null || profile === void 0 ? void 0 : profile.level) !== null && _b !== void 0 ? _b : null,
            resume: await this.resumeLesson(progressRows),
        };
    }
    async resumeLesson(progressRows) {
        const latest = progressRows
            .filter((row) => row.courseMaterialId)
            .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())[0];
        if (!latest)
            return null;
        const modules = await this.prisma.courseModule.findMany({
            where: { courseId: latest.courseId },
            orderBy: { orderIndex: "asc" },
            select: {
                materials: {
                    orderBy: { orderIndex: "asc" },
                    select: { id: true, title: true },
                },
            },
        });
        const flat = modules.flatMap((mod) => mod.materials);
        if (flat.length === 0)
            return null;
        const completed = new Set(progressRows
            .filter((row) => row.courseId === latest.courseId && row.courseMaterialId)
            .map((row) => row.courseMaterialId));
        const index = flat.findIndex((material) => !completed.has(material.id));
        const at = index >= 0 ? index : flat.length - 1;
        const material = flat[at];
        return {
            course_id: latest.courseId,
            course_title: latest.course.title,
            course_level: latest.course.level,
            material_id: material.id,
            material_title: material.title,
            lesson_number: at + 1,
            lesson_total: flat.length,
        };
    }
    async getCourseProgress(userId, courseId) {
        const [course, progressList] = await Promise.all([
            this.prisma.course.findUnique({
                where: { id: courseId },
                select: { id: true },
            }),
            this.prisma.courseProgress.findMany({
                where: { userId, courseId, courseMaterialId: { not: null } },
                select: {
                    courseMaterialId: true,
                    completedAt: true,
                    score: true,
                },
                orderBy: { completedAt: 'desc' },
            }),
        ]);
        if (!course) {
            throw new common_1.NotFoundException(`Курс з id ${courseId} не знайдено`);
        }
        const completed_materials = progressList.map((p) => ({
            course_material_id: p.courseMaterialId,
            completed_at: p.completedAt.toISOString(),
            score: p.score != null ? Number(p.score) : null,
        }));
        return { completed_materials };
    }
    async completeMaterial(userId, role, courseId, moduleId, materialId, score) {
        await this.courseMaterialService.assertCanAccessModule(userId, role, courseId, moduleId);
        const material = await this.prisma.courseMaterial.findFirst({
            where: { id: materialId, moduleId },
            include: { module: { select: { courseId: true } } },
        });
        if (!material) {
            throw new common_1.NotFoundException(`Матеріал з id ${materialId} не знайдено або не належить модулю`);
        }
        if (material.module.courseId !== courseId) {
            throw new common_1.BadRequestException('Модуль не належить вказаному курсу');
        }
        const completedAt = new Date();
        const data = Object.assign({ userId,
            courseId, courseMaterialId: materialId, completedAt }, (score != null && { score }));
        await this.prisma.courseProgress.upsert({
            where: {
                userId_courseId_courseMaterialId: {
                    userId,
                    courseId,
                    courseMaterialId: materialId,
                },
            },
            create: data,
            update: Object.assign({ completedAt }, (score != null && { score })),
        });
        return {
            completed: true,
            course_material_id: materialId,
            completed_at: completedAt.toISOString(),
            score: score !== null && score !== void 0 ? score : null,
        };
    }
    async getRecommendedNext(userId) {
        var _a;
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
            select: { level: true },
        });
        const level = (_a = profile === null || profile === void 0 ? void 0 : profile.level) !== null && _a !== void 0 ? _a : null;
        if (!level) {
            return null;
        }
        const completedCourseIds = await this.prisma.courseProgress
            .findMany({
            where: { userId },
            select: { courseId: true },
            distinct: ['courseId'],
        })
            .then((rows) => new Set(rows.map((r) => r.courseId)));
        const nextCourse = await this.prisma.course.findFirst({
            where: {
                isPublished: true,
                id: { notIn: Array.from(completedCourseIds) },
            },
            orderBy: { createdAt: 'asc' },
        });
        return nextCourse;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        course_material_service_1.CourseMaterialService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map