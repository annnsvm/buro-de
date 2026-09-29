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
exports.LessonRequestService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../generated/prisma/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
let LessonRequestService = class LessonRequestService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toResponse(row) {
        return {
            id: row.id,
            student_id: row.studentId,
            teacher_id: row.teacherId,
            preferred_time: row.preferredTime,
            message: row.message,
            status: row.status,
            created_at: row.createdAt,
            updated_at: row.updatedAt,
        };
    }
    async getUserOrThrow(userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    assertActorRoleMatchesDb(userRole, declaredRole) {
        if (userRole !== declaredRole) {
            throw new common_1.BadRequestException('Declared role does not match the user account role');
        }
    }
    async create(userId, declaredRole, dto) {
        var _a;
        try {
            const user = await this.getUserOrThrow(userId);
            this.assertActorRoleMatchesDb(user.role, declaredRole);
            if (declaredRole !== enums_1.Role.student) {
                throw new common_1.BadRequestException('Only students can create lesson requests');
            }
            const created = await this.prisma.lessonRequest.create({
                data: {
                    studentId: userId,
                    preferredTime: dto.preferred_time,
                    message: (_a = dto.message) !== null && _a !== void 0 ? _a : null,
                    status: enums_1.LessonRequestStatus.pending,
                },
            });
            return this.toResponse(created);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw error;
        }
    }
    async findMyRequests(userId, declaredRole) {
        try {
            const user = await this.getUserOrThrow(userId);
            this.assertActorRoleMatchesDb(user.role, declaredRole);
            if (declaredRole === enums_1.Role.student) {
                const rows = await this.prisma.lessonRequest.findMany({
                    where: { studentId: userId },
                    orderBy: { createdAt: 'desc' },
                });
                return rows.map((r) => this.toResponse(r));
            }
            const rows = await this.prisma.lessonRequest.findMany({
                where: {
                    OR: [
                        { status: enums_1.LessonRequestStatus.pending },
                        { teacherId: userId },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            });
            return rows.map((r) => this.toResponse(r));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw error;
        }
    }
    async accept(id, userId, declaredRole) {
        try {
            const user = await this.getUserOrThrow(userId);
            this.assertActorRoleMatchesDb(user.role, declaredRole);
            if (declaredRole !== enums_1.Role.teacher) {
                throw new common_1.BadRequestException('Only teachers can accept lesson requests');
            }
            const result = await this.prisma.lessonRequest.updateMany({
                where: {
                    id,
                    status: enums_1.LessonRequestStatus.pending,
                },
                data: {
                    teacherId: userId,
                    status: enums_1.LessonRequestStatus.accepted,
                },
            });
            if (result.count === 0) {
                const existing = await this.prisma.lessonRequest.findUnique({
                    where: { id },
                });
                if (!existing) {
                    throw new common_1.NotFoundException('Lesson request not found');
                }
                throw new common_1.BadRequestException('Lesson request must be in pending status to accept');
            }
            const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
                where: { id },
            });
            return this.toResponse(updated);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw error;
        }
    }
    async reject(id, userId, declaredRole) {
        try {
            const user = await this.getUserOrThrow(userId);
            this.assertActorRoleMatchesDb(user.role, declaredRole);
            if (declaredRole !== enums_1.Role.teacher) {
                throw new common_1.BadRequestException('Only teachers can reject lesson requests');
            }
            const result = await this.prisma.lessonRequest.updateMany({
                where: {
                    id,
                    status: enums_1.LessonRequestStatus.pending,
                },
                data: {
                    status: enums_1.LessonRequestStatus.rejected,
                },
            });
            if (result.count === 0) {
                const existing = await this.prisma.lessonRequest.findUnique({
                    where: { id },
                });
                if (!existing) {
                    throw new common_1.NotFoundException('Lesson request not found');
                }
                throw new common_1.BadRequestException('Lesson request must be in pending status to reject');
            }
            const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
                where: { id },
            });
            return this.toResponse(updated);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw error;
        }
    }
    async complete(id, userId, declaredRole) {
        try {
            const user = await this.getUserOrThrow(userId);
            this.assertActorRoleMatchesDb(user.role, declaredRole);
            if (declaredRole !== enums_1.Role.teacher) {
                throw new common_1.BadRequestException('Only teachers can mark lesson requests as completed');
            }
            const result = await this.prisma.lessonRequest.updateMany({
                where: {
                    id,
                    status: enums_1.LessonRequestStatus.accepted,
                    teacherId: userId,
                },
                data: {
                    status: enums_1.LessonRequestStatus.completed,
                },
            });
            if (result.count === 0) {
                const existing = await this.prisma.lessonRequest.findUnique({
                    where: { id },
                });
                if (!existing) {
                    throw new common_1.NotFoundException('Lesson request not found');
                }
                throw new common_1.BadRequestException('Lesson request must be accepted and assigned to you to complete');
            }
            const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
                where: { id },
            });
            return this.toResponse(updated);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw error;
        }
    }
    async cancel(id, userId, declaredRole) {
        try {
            const user = await this.getUserOrThrow(userId);
            this.assertActorRoleMatchesDb(user.role, declaredRole);
            if (declaredRole !== enums_1.Role.teacher) {
                throw new common_1.BadRequestException('Only teachers can cancel accepted lesson requests');
            }
            const result = await this.prisma.lessonRequest.updateMany({
                where: {
                    id,
                    status: enums_1.LessonRequestStatus.accepted,
                    teacherId: userId,
                },
                data: {
                    status: enums_1.LessonRequestStatus.rejected,
                },
            });
            if (result.count === 0) {
                const existing = await this.prisma.lessonRequest.findUnique({
                    where: { id },
                });
                if (!existing) {
                    throw new common_1.NotFoundException('Lesson request not found');
                }
                throw new common_1.BadRequestException('Lesson request must be accepted and assigned to you to cancel');
            }
            const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
                where: { id },
            });
            return this.toResponse(updated);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw error;
        }
    }
};
exports.LessonRequestService = LessonRequestService;
exports.LessonRequestService = LessonRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonRequestService);
//# sourceMappingURL=lesson-request.service.js.map