export type AnswerMatchQuality = 'exact' | 'punctuation' | 'case' | 'none';
export type AnswerMatch = {
    correct: boolean;
    quality: AnswerMatchQuality;
    matched: string | null;
};
export declare const matchGermanAnswer: (answer: string, acceptedAnswers: readonly string[]) => AnswerMatch;
