import { CourseMaterialType, Role } from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';
export declare class CourseMaterialService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertCanAccessCourse(userId: string, role: Role, courseId: string): Promise<void>;
    assertCanAccessModule(userId: string, role: Role, courseId: string, moduleId: string): Promise<void>;
    private ensureCourseExists;
    private ensureModuleBelongsToCourse;
    findAllByModuleId(courseId: string, moduleId: string, viewerRole?: Role): Promise<({
        attachments: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            orderIndex: number;
            materialId: string;
            kind: import("src/generated/prisma/enums").AttachmentKind;
            fileName: string | null;
            mimeType: string | null;
            sizeBytes: number | null;
            storageKey: string | null;
        }[];
    } & {
        type: CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    })[]>;
    findOne(courseId: string, moduleId: string, id: string, viewerRole?: Role): Promise<{
        attachments: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            orderIndex: number;
            materialId: string;
            kind: import("src/generated/prisma/enums").AttachmentKind;
            fileName: string | null;
            mimeType: string | null;
            sizeBytes: number | null;
            storageKey: string | null;
        }[];
    } & {
        type: CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    }>;
    create(courseId: string, moduleId: string, dto: CreateCourseMaterialDto): Promise<{
        type: CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    }>;
    update(courseId: string, moduleId: string, id: string, dto: UpdateCourseMaterialDto): Promise<{
        type: CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    }>;
    delete(courseId: string, moduleId: string, id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private omitAttachmentStorageKeys;
    private toLearnerMaterial;
    private mapError;
}
