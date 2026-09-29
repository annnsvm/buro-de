import { PracticeBlock, Role } from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseMaterialService } from '../course-materials/course-material.service';
export declare class PracticeService {
    private readonly prisma;
    private readonly courseMaterialService;
    constructor(prisma: PrismaService, courseMaterialService: CourseMaterialService);
    private static readonly ORDER;
    getOverview(materialId: string, userId: string, role: Role): Promise<{
        material_id: string;
        module_title: string;
        lesson_title: string | null;
        blocks: {
            block: PracticeBlock;
            total: number;
            answered: number;
            correct: number;
            done: boolean;
        }[];
        done_count: number;
        total_count: number;
    }>;
}
