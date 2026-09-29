import type { QuestionType } from '../../generated/prisma/enums';
import type { AnswerMatchQuality } from './normalize-german';
export type RawAnswer = string | string[];
export type GradeResult = {
    correct: boolean;
    quality: AnswerMatchQuality;
};
export type GradableQuestion = {
    id: string;
    type: QuestionType;
    payload: unknown;
    acceptedAnswers: string[];
};
export type ExerciseDefinition = {
    type: QuestionType;
    validatePayload(payload: unknown, acceptedAnswers: string[]): string[];
    grade(question: GradableQuestion, answer: RawAnswer): GradeResult;
    describeAcceptedAnswers(question: GradableQuestion): string[];
};
export declare const asStringArray: (value: RawAnswer) => string[];
export declare const canonicalSet: (value: RawAnswer) => string;
