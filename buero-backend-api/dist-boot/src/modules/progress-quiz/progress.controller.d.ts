import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getMyProgress(userId: string): Promise<{
        courses: {
            course_id: string;
            course_title: string;
            completion_percent: number;
            completed_materials_count: number;
            total_materials_count: number;
        }[];
        level: import("src/generated/prisma/enums").Level | null;
        resume: {
            course_id: string;
            course_title: string;
            course_level: string | null;
            material_id: string;
            material_title: string;
            lesson_number: number;
            lesson_total: number;
        } | null;
    }>;
    getRecommendedNext(userId: string): Promise<{
        description: string | null;
        title: string;
        language: import("src/generated/prisma/enums").Language;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        level: import("src/generated/prisma/enums").Level | null;
        tags: string[];
        teacherId: string | null;
        isPublished: boolean;
        price: import("@prisma/client-runtime-utils").Decimal | null;
        levelTo: import("src/generated/prisma/enums").Level | null;
        durationHours: number | null;
        imageUrl: string | null;
        stripeProductId: string | null;
        stripePriceId: string | null;
        orderIndex: number;
    } | null>;
}
