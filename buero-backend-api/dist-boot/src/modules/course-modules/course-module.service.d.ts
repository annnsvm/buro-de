import { Role } from "src/generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCourseModuleDto } from "./dto/create-course-module.dto";
import { ReorderCourseStructureDto } from "./dto/reorder-course-structure.dto";
import { UpdateCourseModuleDto } from "./dto/update-course-module.dto";
export declare class CourseModuleService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertCanAccessCourse(userId: string, role: Role, courseId: string): Promise<void>;
    assertCanAccessModule(userId: string, role: Role, courseId: string, moduleId: string): Promise<void>;
    private ensureCourseExists;
    private ensureModuleBelongsToCourse;
    findAllByCourseId(courseId: string, userId?: string, role?: Role): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }[]>;
    findOne(courseId: string, moduleId: string, userId?: string, role?: Role): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }>;
    create(courseId: string, dto: CreateCourseModuleDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }>;
    update(courseId: string, moduleId: string, dto: UpdateCourseModuleDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }>;
    reorderStructure(courseId: string, dto: ReorderCourseStructureDto): Promise<({
        materials: ({
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
            type: import("src/generated/prisma/enums").CourseMaterialType;
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
        })[];
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    })[]>;
    delete(courseId: string, moduleId: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private mapError;
}
