export declare const ATTEMPTS_PER_TASK: number;
export declare const ATTEMPT_WINDOW_HOURS: number;
export declare const DAILY_LIMIT_PER_USER: number;
export declare const MONTHLY_BUDGET_CHECKS: number;
export type Decision = {
    allowed: true;
    attemptNumber: number;
    attemptsLeft: number;
} | {
    allowed: false;
    reason: 'wait' | 'daily' | 'budget';
    retryAt: Date | null;
};
export type AttemptCounts = {
    taskAttempts: readonly Date[];
    todayAcrossTasks: number;
    monthAcrossEveryone: number;
};
export declare const decideAttempt: (counts: AttemptCounts, now: Date) => Decision;
