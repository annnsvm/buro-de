export type AcceptanceLetter = {
    id: string;
    title: string;
    letter: string;
    expected: readonly number[];
    expectedTotal: number;
};
export declare const ACCEPTANCE_LETTERS: readonly AcceptanceLetter[];
