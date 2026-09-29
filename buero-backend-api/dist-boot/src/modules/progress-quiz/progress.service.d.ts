import { Role } from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseMaterialService } from '../course-materials/course-material.service';
export declare class ProgressService {
    private readonly prisma;
    private readonly courseMaterialService;
    constructor(prisma: PrismaService, courseMaterialService: CourseMaterialService);
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
    private resumeLesson;
    getCourseProgress(userId: string, courseId: string): Promise<{
        completed_materials: {
            course_material_id: string;
            completed_at: string;
            score: number | null;
        }[];
    }>;
    completeMaterial(userId: string, role: Role, courseId: string, moduleId: string, materialId: string, score?: number): Promise<{
        completed: boolean;
        course_material_id: string;
        completed_at: string;
        score: number | null;
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
