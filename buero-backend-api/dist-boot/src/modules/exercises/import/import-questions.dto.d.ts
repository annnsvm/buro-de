import { QuizMode } from '../../../generated/prisma/enums';
export declare class ImportQuestionsDto {
    csv: string;
    mode: QuizMode;
    dry_run?: boolean;
    passing_score?: number;
    accept_alternatives?: boolean;
}
