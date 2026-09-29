import { QuestionType } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { SaveQuestionDto, ReorderQuestionsDto } from './question-editor.dto';
export declare class QuestionEditorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(courseId: string, moduleId: string, materialId: string): Promise<{
        id: string;
        type: QuestionType;
        prompt: string;
        accepted_answers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        order_index: number;
        options: {
            id: string;
            text: string;
        }[];
        tokens: string[];
    }[]>;
    save(courseId: string, moduleId: string, materialId: string, questionId: string | null, dto: SaveQuestionDto): Promise<{
        id: string;
        type: QuestionType;
        prompt: string;
        accepted_answers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        order_index: number;
        options: {
            id: string;
            text: string;
        }[];
        tokens: string[];
    }>;
    remove(courseId: string, moduleId: string, materialId: string, questionId: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    reorder(courseId: string, moduleId: string, materialId: string, dto: ReorderQuestionsDto): Promise<{
        id: string;
        type: QuestionType;
        prompt: string;
        accepted_answers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        order_index: number;
        options: {
            id: string;
            text: string;
        }[];
        tokens: string[];
    }[]>;
    private buildPayload;
    private assertQuizMaterial;
    private toResponse;
}
