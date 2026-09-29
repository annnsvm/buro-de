import { StreamableFile } from "@nestjs/common";
import type { UserWithoutPassword } from "../user/types/user-response.type";
import { MaterialAttachmentService } from "./material-attachment.service";
import { CreateMaterialLinkAttachmentDto, UpdateMaterialAttachmentDto } from "./dto/material-attachment.dto";
export declare class MaterialAttachmentsController {
    private readonly materialAttachmentService;
    constructor(materialAttachmentService: MaterialAttachmentService);
    list(user: UserWithoutPassword, courseId: string, moduleId: string, materialId: string): Promise<{
        id: string;
        materialId: string;
        kind: import("src/generated/prisma/enums").AttachmentKind;
        title: string;
        url: string;
        fileName: string | null;
        mimeType: string | null;
        sizeBytes: number | null;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    download(user: UserWithoutPassword, courseId: string, moduleId: string, materialId: string, attachmentId: string): Promise<StreamableFile>;
    upload(courseId: string, moduleId: string, materialId: string, file: Express.Multer.File, title?: string): Promise<{
        id: string;
        materialId: string;
        kind: import("src/generated/prisma/enums").AttachmentKind;
        title: string;
        url: string;
        fileName: string | null;
        mimeType: string | null;
        sizeBytes: number | null;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createLink(courseId: string, moduleId: string, materialId: string, dto: CreateMaterialLinkAttachmentDto): Promise<{
        id: string;
        materialId: string;
        kind: import("src/generated/prisma/enums").AttachmentKind;
        title: string;
        url: string;
        fileName: string | null;
        mimeType: string | null;
        sizeBytes: number | null;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(courseId: string, moduleId: string, materialId: string, attachmentId: string, dto: UpdateMaterialAttachmentDto): Promise<{
        id: string;
        materialId: string;
        kind: import("src/generated/prisma/enums").AttachmentKind;
        title: string;
        url: string;
        fileName: string | null;
        mimeType: string | null;
        sizeBytes: number | null;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(courseId: string, moduleId: string, materialId: string, attachmentId: string): Promise<{
        deleted: true;
        id: string;
    }>;
}
