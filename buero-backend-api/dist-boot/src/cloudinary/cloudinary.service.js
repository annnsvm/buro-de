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
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const FORMAT_BY_MIME = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "application/zip": "zip",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/plain": "txt",
};
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CloudinaryService_1.name);
    }
    onModuleInit() {
        const cloudName = this.configService.get("CLOUDINARY_CLOUD_NAME");
        const apiKey = this.configService.get("CLOUDINARY_API_KEY");
        const apiSecret = this.configService.get("CLOUDINARY_API_SECRET");
        if (!cloudName || !apiKey || !apiSecret) {
            this.logger.warn("Cloudinary не налаштовано (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET). Завантаження обкладинок не працюватиме.");
            return;
        }
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });
    }
    async uploadImage(buffer, options) {
        const cloudName = this.configService.get("CLOUDINARY_CLOUD_NAME");
        if (!cloudName) {
            throw new common_1.BadRequestException("Cloudinary не налаштовано. Додайте CLOUDINARY_* у .env.");
        }
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: options.folder,
                public_id: options.publicId,
                overwrite: true,
                resource_type: "image",
            }, (error, result) => {
                var _a;
                if (error) {
                    this.logger.error("Cloudinary upload failed", error);
                    reject(new common_1.InternalServerErrorException("Не вдалося завантажити зображення в Cloudinary"));
                    return;
                }
                const url = (_a = result === null || result === void 0 ? void 0 : result.secure_url) !== null && _a !== void 0 ? _a : result === null || result === void 0 ? void 0 : result.url;
                if (!url) {
                    reject(new common_1.InternalServerErrorException("Cloudinary не повернув URL зображення"));
                    return;
                }
                resolve(url);
            });
            uploadStream.end(buffer);
        });
    }
    async uploadFile(buffer, options) {
        const cloudName = this.configService.get("CLOUDINARY_CLOUD_NAME");
        if (!cloudName) {
            throw new common_1.BadRequestException("Cloudinary is not configured. Add CLOUDINARY_* to .env.");
        }
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: options.folder,
                public_id: options.publicId,
                overwrite: false,
                resource_type: "auto",
            }, (error, result) => {
                var _a;
                if (error) {
                    this.logger.error("Cloudinary file upload failed", error);
                    reject(this.mapUploadError(error));
                    return;
                }
                const url = (_a = result === null || result === void 0 ? void 0 : result.secure_url) !== null && _a !== void 0 ? _a : result === null || result === void 0 ? void 0 : result.url;
                const publicId = result === null || result === void 0 ? void 0 : result.public_id;
                const resourceType = result === null || result === void 0 ? void 0 : result.resource_type;
                if (!url || !publicId || !resourceType) {
                    reject(new common_1.InternalServerErrorException("Cloudinary did not return a file URL"));
                    return;
                }
                resolve({ url, publicId, resourceType });
            });
            uploadStream.end(buffer);
        });
    }
    async downloadStoredFile(params) {
        const urls = this.buildDownloadUrls(params);
        if (urls.length === 0) {
            throw new common_1.BadGatewayException("Could not download the file.");
        }
        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return Buffer.from(await response.arrayBuffer());
                }
                this.logger.warn(`Attachment download HTTP ${response.status} from ${this.safeUrlForLog(url)}`);
            }
            catch (error) {
                this.logger.warn("Attachment download fetch failed", error);
            }
        }
        throw new common_1.BadGatewayException("Could not download the file. Try again later.");
    }
    buildDownloadUrls(params) {
        const urls = [];
        const parsed = this.parseStorageKey(params.storageKey);
        const format = this.fileFormat(params.fileName, params.mimeType);
        if (parsed) {
            if (format) {
                try {
                    urls.push(cloudinary_1.v2.utils.private_download_url(parsed.publicId, format, {
                        resource_type: parsed.resourceType,
                        type: "upload",
                        attachment: true,
                        expires_at: Math.floor(Date.now() / 1000) + 120,
                    }));
                }
                catch (error) {
                    this.logger.warn("Cloudinary private_download_url failed", error);
                }
            }
            urls.push(cloudinary_1.v2.url(parsed.publicId, Object.assign({ resource_type: parsed.resourceType, type: "upload", sign_url: true, secure: true, flags: "attachment" }, (format ? { format } : {}))));
        }
        if (params.url && !urls.includes(params.url)) {
            urls.push(params.url);
        }
        return urls;
    }
    parseStorageKey(storageKey) {
        if (!storageKey)
            return null;
        const separator = storageKey.indexOf(":");
        if (separator <= 0 || separator === storageKey.length - 1)
            return null;
        return {
            resourceType: storageKey.slice(0, separator),
            publicId: storageKey.slice(separator + 1),
        };
    }
    fileFormat(fileName, mimeType) {
        var _a, _b;
        if (fileName === null || fileName === void 0 ? void 0 : fileName.includes(".")) {
            const ext = (_b = (_a = fileName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
            if (/^[a-z0-9]{1,8}$/.test(ext)) {
                return ext === "jpeg" ? "jpg" : ext;
            }
        }
        if (mimeType && FORMAT_BY_MIME[mimeType]) {
            return FORMAT_BY_MIME[mimeType];
        }
        return "";
    }
    safeUrlForLog(url) {
        try {
            const parsed = new URL(url);
            parsed.search = "";
            return parsed.toString();
        }
        catch (_a) {
            return "[invalid-url]";
        }
    }
    async destroyFile(publicId, resourceType) {
        const cloudName = this.configService.get("CLOUDINARY_CLOUD_NAME");
        if (!cloudName)
            return;
        try {
            await cloudinary_1.v2.uploader.destroy(publicId, {
                resource_type: resourceType,
            });
        }
        catch (error) {
            this.logger.error("Cloudinary destroy failed", error);
        }
    }
    mapUploadError(error) {
        var _a;
        const httpCode = error && typeof error === "object" && "http_code" in error
            ? Number(error.http_code)
            : undefined;
        const message = error && typeof error === "object" && "message" in error
            ? String((_a = error.message) !== null && _a !== void 0 ? _a : "")
            : "";
        if (httpCode === 400 || /file size too large/i.test(message)) {
            return new common_1.BadRequestException("File is too large. Maximum size is 10 MB.");
        }
        return new common_1.InternalServerErrorException("Failed to upload file to Cloudinary");
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map