import { CourseMaterialType, QuizMode } from '../../../generated/prisma/enums';
export declare class CreateCourseMaterialDto {
    type: CourseMaterialType;
    title: string;
    content: Record<string, unknown>;
    quiz_mode?: QuizMode;
    passing_score?: number;
    parent_material_id?: string | null;
    order_index: number;
}
