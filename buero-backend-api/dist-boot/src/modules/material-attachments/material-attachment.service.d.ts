import { AttachmentKind, Role } from "src/generated/prisma/enums";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { CreateMaterialLinkAttachmentDto, UpdateMaterialAttachmentDto } from "./dto/material-attachment.dto";
type SerializedAttachment = {
    id: string;
    materialId: string;
    kind: AttachmentKind;
    title: string;
    url: string;
    fileName: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
};
export declare class MaterialAttachmentService {
    private readonly prisma;
    private readonly cloudinaryService;
    private readonly courseMaterialService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService, courseMaterialService: CourseMaterialService);
    assertCanAccess(userId: string, role: Role, courseId: string, moduleId: string): Promise<void>;
    list(courseId: string, moduleId: string, materialId: string): Promise<SerializedAttachment[]>;
    createFile(courseId: string, moduleId: string, materialId: string, file: Express.Multer.File, title?: string): Promise<SerializedAttachment>;
    createLink(courseId: string, moduleId: string, materialId: string, dto: CreateMaterialLinkAttachmentDto): Promise<SerializedAttachment>;
    update(courseId: string, moduleId: string, materialId: string, attachmentId: string, dto: UpdateMaterialAttachmentDto): Promise<SerializedAttachment>;
    downloadFile(courseId: string, moduleId: string, materialId: string, attachmentId: string): Promise<{
        buffer: Buffer;
        fileName: string;
        mimeType: string;
    }>;
    delete(courseId: string, moduleId: string, materialId: string, attachmentId: string): Promise<{
        deleted: true;
        id: string;
    }>;
    private findOwned;
    private nextOrderIndex;
    private serialize;
}
export {};
