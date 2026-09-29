import { QuizMode } from "src/generated/prisma/enums";
export type ScoredAttempt = {
    score: number;
    correct: number;
    total: number;
    earnedPoints: number | null;
    totalPoints: number | null;
};
export type GradedQuestion = {
    points: number;
    correct: boolean;
};
export declare const scoreAttempt: (mode: QuizMode, graded: readonly GradedQuestion[]) => ScoredAttempt;
export type PartResult = {
    title: string;
    reviewLesson: string | null;
    earnedPoints: number;
    totalPoints: number;
    correct: number;
    total: number;
    weak: boolean;
};
export type PartedQuestion = GradedQuestion & {
    partTitle: string | null;
    reviewLesson: string | null;
};
export declare const summariseParts: (mode: QuizMode, graded: readonly PartedQuestion[]) => PartResult[];
export declare const passingPoints: (passingScore: number | null, totalPoints: number | null) => number | null;
