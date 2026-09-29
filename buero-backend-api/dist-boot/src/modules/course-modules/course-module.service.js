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
exports.CourseModuleService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("src/generated/prisma/enums");
const trial_scope_1 = require("../../common/access/trial-scope");
const prisma_service_1 = require("../../prisma/prisma.service");
let CourseModuleService = class CourseModuleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertCanAccessCourse(userId, role, courseId) {
        await this.ensureCourseExists(courseId);
        if (role === enums_1.Role.teacher)
            return;
        const access = await this.prisma.userCourseAccess.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!access) {
            throw new common_1.ForbiddenException("Немає доступу до цього курсу");
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
            throw new common_1.ForbiddenException("Немає доступу до цього курсу");
        }
        if (access.accessType === enums_1.UserCourseAccessType.trial) {
            const trialModuleIds = await (0, trial_scope_1.getTrialModuleIds)(this.prisma, courseId);
            if (trialModuleIds.length > 0 && !trialModuleIds.includes(moduleId)) {
                throw new common_1.ForbiddenException("На пробному періоді доступні лише вступні модулі курсу");
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
    async findAllByCourseId(courseId, userId, role) {
        try {
            await this.ensureCourseExists(courseId);
            if (userId && role === enums_1.Role.student) {
                const access = await this.prisma.userCourseAccess.findUnique({
                    where: { userId_courseId: { userId, courseId } },
                });
                if ((access === null || access === void 0 ? void 0 : access.accessType) === enums_1.UserCourseAccessType.trial) {
                    const trialModuleIds = await (0, trial_scope_1.getTrialModuleIds)(this.prisma, courseId);
                    if (trialModuleIds.length > 0) {
                        return this.prisma.courseModule.findMany({
                            where: { courseId, id: { in: trialModuleIds } },
                            orderBy: { orderIndex: "asc" },
                        });
                    }
                }
            }
            return this.prisma.courseModule.findMany({
                where: { courseId },
                orderBy: { orderIndex: "asc" },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    async findOne(courseId, moduleId, userId, role) {
        try {
            await this.ensureModuleBelongsToCourse(moduleId, courseId);
            if (userId && role !== undefined) {
                await this.assertCanAccessModule(userId, role, courseId, moduleId);
            }
            return this.prisma.courseModule.findUniqueOrThrow({
                where: { id: moduleId },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            if (error instanceof common_1.ForbiddenException)
                throw error;
            throw this.mapError(error);
        }
    }
    async create(courseId, dto) {
        try {
            await this.ensureCourseExists(courseId);
            return this.prisma.courseModule.create({
                data: {
                    courseId,
                    title: dto.title,
                    orderIndex: dto.order_index,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    async update(courseId, moduleId, dto) {
        try {
            await this.ensureModuleBelongsToCourse(moduleId, courseId);
            return this.prisma.courseModule.update({
                where: { id: moduleId },
                data: Object.assign(Object.assign({}, (dto.title !== undefined && { title: dto.title })), (dto.order_index !== undefined && { orderIndex: dto.order_index })),
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    async reorderStructure(courseId, dto) {
        var _a;
        try {
            await this.ensureCourseExists(courseId);
            const courseModules = await this.prisma.courseModule.findMany({
                where: { courseId },
                select: {
                    id: true,
                    orderIndex: true,
                    materials: { select: { id: true, orderIndex: true, moduleId: true } },
                },
            });
            const knownModuleIds = new Set(courseModules.map((m) => m.id));
            const knownMaterialIds = new Set(courseModules.flatMap((m) => m.materials.map((mat) => mat.id)));
            const currentModuleById = new Map(courseModules.map((m) => [m.id, m.orderIndex]));
            const currentMaterialById = new Map(courseModules.flatMap((m) => m.materials.map((mat) => [mat.id, mat])));
            const seenModuleIds = new Set();
            const seenMaterialIds = new Set();
            for (const moduleItem of dto.modules) {
                if (!knownModuleIds.has(moduleItem.id)) {
                    throw new common_1.NotFoundException(`Module ${moduleItem.id} not found in this course`);
                }
                if (seenModuleIds.has(moduleItem.id)) {
                    throw new common_1.BadRequestException(`Duplicate module ${moduleItem.id} in payload`);
                }
                seenModuleIds.add(moduleItem.id);
                for (const materialItem of (_a = moduleItem.materials) !== null && _a !== void 0 ? _a : []) {
                    if (!knownMaterialIds.has(materialItem.id)) {
                        throw new common_1.NotFoundException(`Material ${materialItem.id} not found in this course`);
                    }
                    if (seenMaterialIds.has(materialItem.id)) {
                        throw new common_1.BadRequestException(`Duplicate material ${materialItem.id} in payload`);
                    }
                    seenMaterialIds.add(materialItem.id);
                }
            }
            const moduleUpdates = dto.modules.filter((moduleItem) => currentModuleById.get(moduleItem.id) !== moduleItem.order_index);
            const materialUpdates = dto.modules.flatMap((moduleItem) => {
                var _a;
                return ((_a = moduleItem.materials) !== null && _a !== void 0 ? _a : [])
                    .filter((materialItem) => {
                    const current = currentMaterialById.get(materialItem.id);
                    return (!current ||
                        current.moduleId !== moduleItem.id ||
                        current.orderIndex !== materialItem.order_index);
                })
                    .map((materialItem) => ({
                    id: materialItem.id,
                    moduleId: moduleItem.id,
                    orderIndex: materialItem.order_index,
                }));
            });
            if (moduleUpdates.length > 0 || materialUpdates.length > 0) {
                await this.prisma.$transaction(async (tx) => {
                    for (const moduleItem of moduleUpdates) {
                        await tx.courseModule.update({
                            where: { id: moduleItem.id },
                            data: { orderIndex: moduleItem.order_index },
                        });
                    }
                    for (const materialItem of materialUpdates) {
                        await tx.courseMaterial.update({
                            where: { id: materialItem.id },
                            data: {
                                moduleId: materialItem.moduleId,
                                orderIndex: materialItem.orderIndex,
                            },
                        });
                    }
                }, { timeout: 20000, maxWait: 10000 });
            }
            return this.prisma.courseModule.findMany({
                where: { courseId },
                orderBy: { orderIndex: "asc" },
                include: {
                    materials: {
                        orderBy: { orderIndex: "asc" },
                        include: {
                            attachments: { orderBy: { orderIndex: "asc" } },
                        },
                    },
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw this.mapError(error);
        }
    }
    async delete(courseId, moduleId) {
        try {
            await this.ensureModuleBelongsToCourse(moduleId, courseId);
            await this.prisma.courseModule.delete({
                where: { id: moduleId },
            });
            return { deleted: true, id: moduleId };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapError(error);
        }
    }
    mapError(error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        if (error instanceof common_1.BadRequestException)
            throw error;
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new common_1.BadRequestException(message);
    }
};
exports.CourseModuleService = CourseModuleService;
exports.CourseModuleService = CourseModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CourseModuleService);
//# sourceMappingURL=course-module.service.js.map