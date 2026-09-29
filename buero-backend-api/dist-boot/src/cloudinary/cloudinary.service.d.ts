import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
export type UploadImageOptions = {
    folder: string;
    publicId: string;
};
export type UploadFileOptions = {
    folder: string;
    publicId: string;
};
export type UploadedFileResult = {
    url: string;
    publicId: string;
    resourceType: string;
};
export type DownloadStoredFileParams = {
    storageKey: string | null;
    url: string;
    fileName: string | null;
    mimeType: string | null;
};
export declare class CloudinaryService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    uploadImage(buffer: Buffer, options: UploadImageOptions): Promise<string>;
    uploadFile(buffer: Buffer, options: UploadFileOptions): Promise<UploadedFileResult>;
    downloadStoredFile(params: DownloadStoredFileParams): Promise<Buffer>;
    private buildDownloadUrls;
    private parseStorageKey;
    private fileFormat;
    private safeUrlForLog;
    destroyFile(publicId: string, resourceType: string): Promise<void>;
    private mapUploadError;
}
