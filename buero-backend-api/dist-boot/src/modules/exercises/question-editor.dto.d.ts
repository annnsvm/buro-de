import { QuestionType } from '../../generated/prisma/enums';
export declare class QuestionOptionDto {
    id?: string;
    text: string;
}
export declare class SaveQuestionDto {
    type: QuestionType;
    prompt: string;
    accepted_answers: string[];
    options?: QuestionOptionDto[];
    tokens?: string[];
    explanation?: string;
    points?: number;
    skills?: string[];
}
export declare class ReorderQuestionsDto {
    ids: string[];
}
