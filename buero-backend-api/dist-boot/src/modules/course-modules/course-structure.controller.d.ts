import { CourseModuleService } from "./course-module.service";
import { ReorderCourseStructureDto } from "./dto/reorder-course-structure.dto";
export declare class CourseStructureController {
    private readonly courseModuleService;
    constructor(courseModuleService: CourseModuleService);
    reorder(courseId: string, dto: ReorderCourseStructureDto): Promise<({
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
}
