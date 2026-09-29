import { QuizMode } from '../../../generated/prisma/enums';
import { PrismaService } from '../../../prisma/prisma.service';
import { type ParseProblem } from './parse-question-csv';
export type ImportTarget = {
    title: string;
    existingMaterialId: string | null;
    questionCount: number;
    typeCounts: Record<string, number>;
    points: number;
    alternatives: Array<{
        id: string;
        prompt: string;
        wordings: string[];
    }>;
};
export type ImportPreview = {
    mode: QuizMode;
    targets: ImportTarget[];
    totalQuestions: number;
    problems: ParseProblem[];
    unusable: Array<{
        id: string;
        reasons: string[];
    }>;
};
export declare class QuestionImportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    preview(courseId: string, moduleId: string, csv: string, mode: QuizMode): Promise<ImportPreview>;
    commit(courseId: string, moduleId: string, csv: string, mode: QuizMode, options?: {
        passingScore?: number;
        acceptAlternatives?: boolean;
    }): Promise<ImportPreview & {
        created: number;
        updated: number;
    }>;
    private buildPlan;
}
