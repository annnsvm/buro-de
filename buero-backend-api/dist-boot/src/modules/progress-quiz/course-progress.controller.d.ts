import { Role } from 'src/generated/prisma/enums';
import { ProgressService } from './progress.service';
import { CompleteMaterialDto } from './dto/complete-material.dto';
export declare class CourseProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getCourseProgress(userId: string, courseId: string): Promise<{
        completed_materials: {
            course_material_id: string;
            completed_at: string;
            score: number | null;
        }[];
    }>;
    completeMaterial(userId: string, role: Role, courseId: string, moduleId: string, materialId: string, body?: CompleteMaterialDto): Promise<{
        completed: boolean;
        course_material_id: string;
        completed_at: string;
        score: number | null;
    }>;
}
