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
exports.MaterialAttachmentService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const enums_1 = require("src/generated/prisma/enums");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const course_material_service_1 = require("../course-materials/course-material.service");
let MaterialAttachmentService = class MaterialAttachmentService {
    constructor(prisma, cloudinaryService, courseMaterialService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
        this.courseMaterialService = courseMaterialService;
    }
    async assertCanAccess(userId, role, courseId, moduleId) {
        await this.courseMaterialService.assertCanAccessModule(userId, role, courseId, moduleId);
    }
    async list(courseId, moduleId, materialId) {
        await this.courseMaterialService.findOne(courseId, moduleId, materialId);
        const items = await this.prisma.materialAttachment.findMany({
            where: { materialId },
            orderBy: { orderIndex: "asc" },
        });
        return items.map((item) => this.serialize(item));
    }
    async createFile(courseId, moduleId, materialId, file, title) {
        var _a;
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        await this.courseMaterialService.findOne(courseId, moduleId, materialId);
        const publicId = (0, crypto_1.randomUUID)();
        const uploaded = await this.cloudinaryService.uploadFile(file.buffer, {
            folder: `materials/${materialId}`,
            publicId,
        });
        const nextOrderIndex = await this.nextOrderIndex(materialId);
        const attachment = await this.prisma.materialAttachment.create({
            data: {
                materialId,
                kind: enums_1.AttachmentKind.file,
                title: ((title === null || title === void 0 ? void 0 : title.trim()) || file.originalname || "Attachment").slice(0, 500),
                url: uploaded.url,
                fileName: file.originalname || null,
                mimeType: file.mimetype || null,
                sizeBytes: (_a = file.size) !== null && _a !== void 0 ? _a : null,
                storageKey: `${uploaded.resourceType}:${uploaded.publicId}`,
                orderIndex: nextOrderIndex,
            },
        });
        return this.serialize(attachment);
    }
    async createLink(courseId, moduleId, materialId, dto) {
        await this.courseMaterialService.findOne(courseId, moduleId, materialId);
        const nextOrderIndex = await this.nextOrderIndex(materialId);
        const attachment = await this.prisma.materialAttachment.create({
            data: {
                materialId,
                kind: enums_1.AttachmentKind.link,
                title: dto.title.trim(),
                url: dto.url,
                orderIndex: nextOrderIndex,
            },
        });
        return this.serialize(attachment);
    }
    async update(courseId, moduleId, materialId, attachmentId, dto) {
        const existing = await this.findOwned(courseId, moduleId, materialId, attachmentId);
        const attachment = await this.prisma.materialAttachment.update({
            where: { id: existing.id },
            data: Object.assign({}, (dto.title !== undefined && { title: dto.title.trim() })),
        });
        return this.serialize(attachment);
    }
    async downloadFile(courseId, moduleId, materialId, attachmentId) {
        var _a;
        const existing = await this.findOwned(courseId, moduleId, materialId, attachmentId);
        if (existing.kind !== enums_1.AttachmentKind.file) {
            throw new common_1.BadRequestException("This attachment is a link, not a file");
        }
        const buffer = await this.cloudinaryService.downloadStoredFile({
            storageKey: existing.storageKey,
            url: existing.url,
            fileName: existing.fileName,
            mimeType: existing.mimeType,
        });
        return {
            buffer,
            fileName: ((_a = existing.fileName) === null || _a === void 0 ? void 0 : _a.trim()) || existing.title || "attachment",
            mimeType: existing.mimeType || "application/octet-stream",
        };
    }
    async delete(courseId, moduleId, materialId, attachmentId) {
        const existing = await this.findOwned(courseId, moduleId, materialId, attachmentId);
        if (existing.storageKey) {
            const [resourceType, ...publicIdParts] = existing.storageKey.split(":");
            const publicId = publicIdParts.join(":");
            if (resourceType && publicId) {
                await this.cloudinaryService.destroyFile(publicId, resourceType);
            }
        }
        await this.prisma.materialAttachment.delete({ where: { id: existing.id } });
        return { deleted: true, id: existing.id };
    }
    async findOwned(courseId, moduleId, materialId, attachmentId) {
        await this.courseMaterialService.findOne(courseId, moduleId, materialId);
        const attachment = await this.prisma.materialAttachment.findFirst({
            where: { id: attachmentId, materialId },
        });
        if (!attachment) {
            throw new common_1.NotFoundException(`Attachment ${attachmentId} was not found on this material`);
        }
        return attachment;
    }
    async nextOrderIndex(materialId) {
        var _a;
        const maxOrder = await this.prisma.materialAttachment.aggregate({
            where: { materialId },
            _max: { orderIndex: true },
        });
        return ((_a = maxOrder._max.orderIndex) !== null && _a !== void 0 ? _a : -1) + 1;
    }
    serialize(attachment) {
        return {
            id: attachment.id,
            materialId: attachment.materialId,
            kind: attachment.kind,
            title: attachment.title,
            url: attachment.url,
            fileName: attachment.fileName,
            mimeType: attachment.mimeType,
            sizeBytes: attachment.sizeBytes,
            orderIndex: attachment.orderIndex,
            createdAt: attachment.createdAt,
            updatedAt: attachment.updatedAt,
        };
    }
};
exports.MaterialAttachmentService = MaterialAttachmentService;
exports.MaterialAttachmentService = MaterialAttachmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService,
        course_material_service_1.CourseMaterialService])
], MaterialAttachmentService);
//# sourceMappingURL=material-attachment.service.js.map