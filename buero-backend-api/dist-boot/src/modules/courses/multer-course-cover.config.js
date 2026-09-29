"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseCoverMulterOptions = exports.COURSE_COVER_MAX_BYTES = exports.COURSE_COVER_MIME_TYPES = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
exports.COURSE_COVER_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];
exports.COURSE_COVER_MAX_BYTES = 5 * 1024 * 1024;
exports.courseCoverMulterOptions = {
    storage: (0, multer_1.memoryStorage)(),
    limits: { fileSize: exports.COURSE_COVER_MAX_BYTES },
    fileFilter: (_req, file, callback) => {
        const allowed = exports.COURSE_COVER_MIME_TYPES;
        if (!allowed.includes(file.mimetype)) {
            callback(new common_1.BadRequestException("Недопустимий тип файлу. Дозволено: JPEG, PNG, WebP."), false);
            return;
        }
        callback(null, true);
    },
};
//# sourceMappingURL=multer-course-cover.config.js.map