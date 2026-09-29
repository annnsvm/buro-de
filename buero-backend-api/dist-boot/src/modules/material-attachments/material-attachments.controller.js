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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialAttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("src/generated/prisma/enums");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const multer_exception_filter_1 = require("../courses/filters/multer-exception.filter");
const material_attachment_service_1 = require("./material-attachment.service");
const material_attachment_dto_1 = require("./dto/material-attachment.dto");
const multer_material_attachment_config_1 = require("./multer-material-attachment.config");
const contentDispositionAttachment = (fileName) => {
    const fallback = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "") || "attachment";
    return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
};
let MaterialAttachmentsController = class MaterialAttachmentsController {
    constructor(materialAttachmentService) {
        this.materialAttachmentService = materialAttachmentService;
    }
    async list(user, courseId, moduleId, materialId) {
        await this.materialAttachmentService.assertCanAccess(user.id, user.role, courseId, moduleId);
        return this.materialAttachmentService.list(courseId, moduleId, materialId);
    }
    async download(user, courseId, moduleId, materialId, attachmentId) {
        await this.materialAttachmentService.assertCanAccess(user.id, user.role, courseId, moduleId);
        const file = await this.materialAttachmentService.downloadFile(courseId, moduleId, materialId, attachmentId);
        return new common_1.StreamableFile(file.buffer, {
            type: file.mimeType,
            disposition: contentDispositionAttachment(file.fileName),
            length: file.buffer.length,
        });
    }
    async upload(courseId, moduleId, materialId, file, title) {
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        return this.materialAttachmentService.createFile(courseId, moduleId, materialId, file, title);
    }
    createLink(courseId, moduleId, materialId, dto) {
        return this.materialAttachmentService.createLink(courseId, moduleId, materialId, dto);
    }
    update(courseId, moduleId, materialId, attachmentId, dto) {
        return this.materialAttachmentService.update(courseId, moduleId, materialId, attachmentId, dto);
    }
    delete(courseId, moduleId, materialId, attachmentId) {
        return this.materialAttachmentService.delete(courseId, moduleId, materialId, attachmentId);
    }
};
exports.MaterialAttachmentsController = MaterialAttachmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "List lesson attachments",
        description: "Attachments for a material, ordered by order_index. Teachers always; students need course access.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "Course UUID" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "Module UUID" }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "Material UUID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Attachment list" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "No access to this course" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Course, module or material not found" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("courseId")),
    __param(2, (0, common_1.Param)("moduleId")),
    __param(3, (0, common_1.Param)("materialId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MaterialAttachmentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":attachmentId/download"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Download a file attachment",
        description: "Streams the file after the same course-access check as listing attachments. Link attachments cannot be downloaded this way.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "Course UUID" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "Module UUID" }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "Material UUID" }),
    (0, swagger_1.ApiParam)({ name: "attachmentId", description: "Attachment UUID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "File bytes" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Attachment is a link, not a file" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "No access to this course" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Attachment not found" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("courseId")),
    __param(2, (0, common_1.Param)("moduleId")),
    __param(3, (0, common_1.Param)("materialId")),
    __param(4, (0, common_1.Param)("attachmentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MaterialAttachmentsController.prototype, "download", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, common_1.UseFilters)(multer_exception_filter_1.MulterExceptionFilter),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", multer_material_attachment_config_1.materialAttachmentMulterOptions)),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Upload a file attachment",
        description: "Teacher only. Multipart field **file** (PDF, images, Word, Excel, TXT, ZIP, up to 10 MB). Optional title.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "Course UUID" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "Module UUID" }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "Material UUID" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["file"],
            properties: {
                file: { type: "string", format: "binary" },
                title: { type: "string" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Attachment created" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation or file type error" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Teachers only" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Course, module or material not found" }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Param)("moduleId")),
    __param(2, (0, common_1.Param)("materialId")),
    __param(3, (0, common_1.UploadedFile)()),
    __param(4, (0, common_1.Body)("title")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, String]),
    __metadata("design:returntype", Promise)
], MaterialAttachmentsController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)("link"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Add a link attachment",
        description: "Teacher only. Body: title, url.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "Course UUID" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "Module UUID" }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "Material UUID" }),
    (0, swagger_1.ApiBody)({ type: material_attachment_dto_1.CreateMaterialLinkAttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Attachment created" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Teachers only" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Course, module or material not found" }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Param)("moduleId")),
    __param(2, (0, common_1.Param)("materialId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, material_attachment_dto_1.CreateMaterialLinkAttachmentDto]),
    __metadata("design:returntype", void 0)
], MaterialAttachmentsController.prototype, "createLink", null);
__decorate([
    (0, common_1.Patch)(":attachmentId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Update an attachment",
        description: "Teacher only. Currently title only.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "Course UUID" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "Module UUID" }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "Material UUID" }),
    (0, swagger_1.ApiParam)({ name: "attachmentId", description: "Attachment UUID" }),
    (0, swagger_1.ApiBody)({ type: material_attachment_dto_1.UpdateMaterialAttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Attachment updated" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Teachers only" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Attachment not found" }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Param)("moduleId")),
    __param(2, (0, common_1.Param)("materialId")),
    __param(3, (0, common_1.Param)("attachmentId")),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, material_attachment_dto_1.UpdateMaterialAttachmentDto]),
    __metadata("design:returntype", void 0)
], MaterialAttachmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":attachmentId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete an attachment",
        description: "Teacher only. Removes the Cloudinary file when storage_key is set.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "Course UUID" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "Module UUID" }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "Material UUID" }),
    (0, swagger_1.ApiParam)({ name: "attachmentId", description: "Attachment UUID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Attachment deleted" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Teachers only" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Attachment not found" }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Param)("moduleId")),
    __param(2, (0, common_1.Param)("materialId")),
    __param(3, (0, common_1.Param)("attachmentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MaterialAttachmentsController.prototype, "delete", null);
exports.MaterialAttachmentsController = MaterialAttachmentsController = __decorate([
    (0, swagger_1.ApiTags)("material-attachments"),
    (0, common_1.Controller)("courses/:courseId/modules/:moduleId/materials/:materialId/attachments"),
    __metadata("design:paramtypes", [material_attachment_service_1.MaterialAttachmentService])
], MaterialAttachmentsController);
//# sourceMappingURL=material-attachments.controller.js.map