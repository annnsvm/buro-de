import type { UserWithoutPassword } from '../user/types/user-response.type';
import { PracticeService } from './practice.service';
export declare class PracticeController {
    private readonly practiceService;
    constructor(practiceService: PracticeService);
    getOverview(user: UserWithoutPassword, materialId: string): Promise<{
        material_id: string;
        module_title: string;
        lesson_title: string | null;
        blocks: {
            block: import("src/generated/prisma/enums").PracticeBlock;
            total: number;
            answered: number;
            correct: number;
            done: boolean;
        }[];
        done_count: number;
        total_count: number;
    }>;
}
