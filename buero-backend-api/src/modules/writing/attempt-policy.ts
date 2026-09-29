/**
 * How many goes a student gets, and when the whole feature steps aside.
 *
 * Three limits, each answering a different way the bill could run away, and each decided here
 * rather than in the service so they can be reasoned about and tested without a database:
 *
 *   - **per task** — three tries, then a day's wait. This is as much about learning as money: a
 *     student who can submit endlessly stops writing and starts guessing what the grader wants.
 *   - **per day, across every task** — stops one person working through ten tasks three times
 *     each in an afternoon.
 *   - **per month, across everyone** — the last defence. When it trips the task does not break;
 *     it falls back to the self-check against the model answer, which is how the speaking task
 *     already works. Degrading is better than emptying the card.
 *
 * All three count rows in `writing_submissions`, which is the record of what was actually paid
 * for. A separate counter could drift away from the spend it is meant to be guarding.
 */

export const ATTEMPTS_PER_TASK = Number(process.env.LLM_WRITING_ATTEMPTS_PER_TASK ?? 3);
export const ATTEMPT_WINDOW_HOURS = Number(process.env.LLM_WRITING_WINDOW_HOURS ?? 24);
export const DAILY_LIMIT_PER_USER = Number(process.env.LLM_WRITING_DAILY_LIMIT ?? 10);
/** Zero or unset means no breaker, which is the right default while volume is tiny. */
export const MONTHLY_BUDGET_CHECKS = Number(
  process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS ?? 0,
);

export type Decision =
  | { allowed: true; attemptNumber: number; attemptsLeft: number }
  | {
      allowed: false;
      /**
       * `wait` and `daily` are temporary and say when to come back. `budget` is the breaker: the
       * caller shows the model answer and a self-check instead of an error.
       */
      reason: 'wait' | 'daily' | 'budget';
      retryAt: Date | null;
    };

export type AttemptCounts = {
  /** Timestamps of this student's graded attempts at this task, newest first. */
  taskAttempts: readonly Date[];
  /** How many the student has had across every task in the last day. */
  todayAcrossTasks: number;
  /** How many were graded for everyone this month. */
  monthAcrossEveryone: number;
};

export const decideAttempt = (counts: AttemptCounts, now: Date): Decision => {
  if (MONTHLY_BUDGET_CHECKS > 0 && counts.monthAcrossEveryone >= MONTHLY_BUDGET_CHECKS) {
    /** No retry time: it is not the student's doing and waiting would not help them. */
    return { allowed: false, reason: 'budget', retryAt: null };
  }

  if (counts.todayAcrossTasks >= DAILY_LIMIT_PER_USER) {
    return { allowed: false, reason: 'daily', retryAt: addHours(now, 24) };
  }

  /**
   * The window rolls: three attempts in the last day, not three since some fixed hour. The wait
   * ends when the oldest of them falls out, so a student who used two tries yesterday evening
   * and one this morning waits only for the evening one to age out.
   */
  const windowStart = addHours(now, -ATTEMPT_WINDOW_HOURS);
  const inWindow = counts.taskAttempts.filter((at) => at > windowStart);

  if (inWindow.length >= ATTEMPTS_PER_TASK) {
    const oldest = inWindow.reduce((a, b) => (a < b ? a : b));
    return { allowed: false, reason: 'wait', retryAt: addHours(oldest, ATTEMPT_WINDOW_HOURS) };
  }

  return {
    allowed: true,
    attemptNumber: counts.taskAttempts.length + 1,
    attemptsLeft: ATTEMPTS_PER_TASK - inWindow.length - 1,
  };
};

const addHours = (at: Date, hours: number): Date =>
  new Date(at.getTime() + hours * 60 * 60 * 1000);
