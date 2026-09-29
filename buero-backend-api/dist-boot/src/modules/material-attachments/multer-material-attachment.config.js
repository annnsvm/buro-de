"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialAttachmentMulterOptions = exports.MATERIAL_ATTACHMENT_MAX_BYTES = exports.MATERIAL_ATTACHMENT_MIME_TYPES = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
exports.MATERIAL_ATTACHMENT_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
];
exports.MATERIAL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
exports.materialAttachmentMulterOptions = {
    storage: (0, multer_1.memoryStorage)(),
    limits: { fileSize: exports.MATERIAL_ATTACHMENT_MAX_BYTES },
    fileFilter: (_req, file, callback) => {
        const allowed = exports.MATERIAL_ATTACHMENT_MIME_TYPES;
        if (!allowed.includes(file.mimetype)) {
            callback(new common_1.BadRequestException("Unsupported file type. Allowed: PDF, JPEG, PNG, WebP, GIF, Word, Excel, TXT, ZIP."), false);
            return;
        }
        callback(null, true);
    },
};
//# sourceMappingURL=multer-material-attachment.config.js.map