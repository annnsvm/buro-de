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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseMaterialService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("src/generated/prisma/enums");
const trial_scope_1 = require("../../common/access/trial-scope");
const strip_quiz_answers_1 = require("../../common/content/strip-quiz-answers");
const prisma_service_1 = require("../../prisma/prisma.service");
let CourseMaterialService = class CourseMaterialService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertCanAccessCourse(userId, role, courseId) {
        await this.ensureCourseExists(courseId);
        if (role === enums_1.Role.teacher)
            return;
        const access = await this.prisma.userCourseAccess.findUnique({
            where: {
                userId_courseId: { userId, courseId },
            },
        });
        if (!access) {
            throw new common_1.ForbiddenException('Немає доступу до цього курсу');
        }
    }
    async assertCanAccessModule(userId, role, courseId, moduleId) {
        await this.ensureCourseExists(courseId);
        if (role === enums_1.Role.teacher)
            return;
        const access = await this.prisma.userCourseAccess.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!access) {
            throw new common_1.ForbiddenException('Немає доступу до цього курсу');
        }
        if (access.accessType === enums_1.UserCourseAccessType.trial) {
            const trialModuleIds = await (0, trial_scope_1.getTrialModuleIds)(this.prisma, courseId);
            if (trialModuleIds.length > 0 && !trialModuleIds.includes(moduleId)) {
                throw new common_1.ForbiddenException('На пробному періоді доступні лише матеріали вступних модулів');
            }
        }
    }
    async ensureCourseExists(courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Курс з id ${courseId} не знайдено`);
        }
    }
    async ensureModuleBelongsToCourse(moduleId, courseId) {
        const module = await this.prisma.courseModule.findFirst({
            where: { id: moduleId, courseId },
        });
        if (!module) {
            throw new common_1.NotFoundException(`Модуль з id ${moduleId} не знайдено або не належить курсу`);
        }
    }
    async findAllByModuleId(courseId, moduleId, viewerRole) {
        try {
            await this.ensureModuleBelongsToCourse(moduleId, courseId);
            const items = await this.prisma.courseMaterial.findMany({
                where: { moduleId },
                orderBy: { orderIndex: 'asc' },
                include: {
                    attachments: { orderBy: { orderIndex: 'asc' } },
                },
            });
            return items.map((item) => this.toLearnerMaterial(this.omitAttachmentStorageKeys(item), viewerRole));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    async findOne(courseId, moduleId, id, viewerRole) {
        try {
            await this.ensureModuleBelongsToCourse(moduleId, courseId);
            const material = await this.prisma.courseMaterial.findFirst({
                where: { id, moduleId },
                include: {
                    attachments: { orderBy: { orderIndex: 'asc' } },
                },
            });
            if (!material) {
                throw new common_1.NotFoundException(`Матеріал з id ${id} не знайдено або не належить модулю`);
            }
            return this.toLearnerMaterial(this.omitAttachmentStorageKeys(material), viewerRole);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    async create(courseId, moduleId, dto) {
        try {
            await this.ensureModuleBelongsToCourse(moduleId, courseId);
            const created = await this.prisma.courseMaterial.create({
                data: Object.assign(Object.assign(Object.assign({ moduleId, type: dto.type, title: dto.title, content: dto.content, orderIndex: dto.order_index }, (dto.quiz_mode !== undefined && { quizMode: dto.quiz_mode })), (dto.parent_material_id !== undefined && {
                    parentMaterialId: dto.parent_material_id,
                })), (dto.passing_score !== undefined && {
                    passingScore: dto.passing_score,
                })),
            });
            return created;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    async update(courseId, moduleId, id, dto) {
        try {
            await this.findOne(courseId, moduleId, id);
            const updated = await this.prisma.courseMaterial.update({
                where: { id },
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (dto.type !== undefined && { type: dto.type })), (dto.title !== undefined && { title: dto.title })), (dto.content !== undefined && { content: dto.content })), (dto.order_index !== undefined && { orderIndex: dto.order_index })), (dto.quiz_mode !== undefined && { quizMode: dto.quiz_mode })), (dto.parent_material_id !== undefined && {
                    parentMaterialId: dto.parent_material_id,
                })), (dto.passing_score !== undefined && {
                    passingScore: dto.passing_score,
                })),
            });
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    async delete(courseId, moduleId, id) {
        try {
            await this.findOne(courseId, moduleId, id);
            await this.prisma.courseMaterial.delete({
                where: { id },
            });
            return { deleted: true, id };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    omitAttachmentStorageKeys(material) {
        if (!material.attachments)
            return material;
        return Object.assign(Object.assign({}, material), { attachments: material.attachments.map((item) => {
                const { storageKey: _storageKey } = item, rest = __rest(item, ["storageKey"]);
                return rest;
            }) });
    }
    toLearnerMaterial(material, viewerRole) {
        if (viewerRole === undefined || viewerRole === enums_1.Role.teacher)
            return material;
        return Object.assign(Object.assign({}, material), { content: (0, strip_quiz_answers_1.stripQuizAnswers)(material.content) });
    }
    mapError(error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        if (error instanceof common_1.BadRequestException)
            throw error;
        if (error instanceof common_1.ForbiddenException)
            throw error;
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new common_1.BadRequestException(message);
    }
};
exports.CourseMaterialService = CourseMaterialService;
exports.CourseMaterialService = CourseMaterialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CourseMaterialService);
//# sourceMappingURL=course-material.service.js.map