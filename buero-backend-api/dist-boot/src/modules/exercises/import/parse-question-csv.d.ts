import { QuestionType } from '../../../generated/prisma/enums';
export type ParsedOption = {
    id: string;
    text: string;
};
export type ParsedQuestion = {
    id: string;
    group: string;
    type: QuestionType;
    prompt: string;
    options: ParsedOption[];
    acceptedAnswers: string[];
    explanation: string | null;
    reviewLesson: string | null;
    points: number;
    suggestedAlternatives: string[];
};
export type ParseProblem = {
    row: number;
    id: string;
    message: string;
};
export type ParsedCsv = {
    questions: ParsedQuestion[];
    problems: ParseProblem[];
};
export declare const readCsvRows: (input: string) => string[][];
export declare const parseQuestionCsv: (input: string) => ParsedCsv;
export declare const groupQuestions: (questions: ParsedQuestion[]) => Array<{
    group: string;
    questions: ParsedQuestion[];
}>;
