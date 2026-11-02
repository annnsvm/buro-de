/**
 * How many times a student may have one piece of writing checked.
 *
 * The amendment replaced a rolling window with a straight allowance: three checks for a task,
 * for the whole time the student has access - the first attempt and two rewrites. That is as
 * much about learning as about money. A rolling window taught a student to come back tomorrow
 * and try again; an allowance that does not refill teaches them to read the feedback before
 * sending the next version, which is the skill the task is for.
 *
 * Three limits remain around it, each answering a different way the bill could run away:
 *
 *   - **the allowance per task** - the course's figure plus whatever a teacher granted. When it
 *     is gone the task does not break: the student keeps every text they sent and every answer
 *     they got, and the sample opens.
 *   - **a pause between checks** - thirty seconds, so a double click or an impatient retry
 *     cannot send the same thing twice.
 *   - **per month, across everyone** - the last defence. When it trips the task falls back to
 *     the self-check against the model answer, the way the speaking task already works.
 *     Degrading is better than emptying the card.
 *
 * All of them count rows in `writing_submissions`, which is the record of what was actually paid
 * for. A separate counter could drift away from the spend it is meant to be guarding.
 */

/** The fallback when a course has no figure of its own. The course's own value wins. */
export const DEFAULT_CHECKS_PER_TASK = 3;

/** Long enough that a double click cannot spend two checks. */
export const COOLDOWN_SECONDS = Number(process.env.LLM_WRITING_COOLDOWN_SECONDS ?? 30);

/**
 * A cap across every task in a day, kept but off by default.
 *
 * It mattered when the allowance refilled every 24 hours. With a lifetime allowance it no longer
 * guards much - the most a student can ever spend is their allowance times the number of tasks -
 * and switched on it would stop someone working through a module in one sitting, which is a thing
 * we want them to do. Set the variable to bring it back.
 */
export const DAILY_LIMIT_PER_USER = Number(process.env.LLM_WRITING_DAILY_LIMIT ?? 0);

/** Zero or unset means no breaker, which is the right default while volume is tiny. */
export const MONTHLY_BUDGET_CHECKS = Number(
  process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS ?? 0,
);

export type Decision =
  | { allowed: true; attemptNumber: number; attemptsLeft: number }
  | {
      allowed: false;
      /**
       * `cooldown` and `daily` are temporary and say when to come back. `used_up` is final for
       * this task until a teacher grants more. `budget` is the breaker: the caller shows the
       * model answer and a self-check instead of an error.
       */
      reason: 'cooldown' | 'daily' | 'used_up' | 'budget';
      retryAt: Date | null;
    };

export type AttemptCounts = {
  /** Timestamps of this student's checks of this task, in any order. */
  taskAttempts: readonly Date[];
  /** The course's figure plus anything a teacher granted for this task. */
  allowedForTask: number;
  /** How many the student has had across every task in the last day. */
  todayAcrossTasks: number;
  /** How many were checked for everyone this month. */
  monthAcrossEveryone: number;
};

export const decideAttempt = (counts: AttemptCounts, now: Date): Decision => {
  if (MONTHLY_BUDGET_CHECKS > 0 && counts.monthAcrossEveryone >= MONTHLY_BUDGET_CHECKS) {
    /** No retry time: it is not the student's doing and waiting would not help them. */
    return { allowed: false, reason: 'budget', retryAt: null };
  }

  /**
   * The pause comes before the allowance on purpose. A student who clicks twice has not used
   * two checks, and telling them to wait thirty seconds is true; telling them their checks are
   * gone would not be.
   */
  const newest = counts.taskAttempts.reduce<Date | null>(
    (latest, at) => (latest === null || at > latest ? at : latest),
    null,
  );
  if (newest !== null) {
    const ready = new Date(newest.getTime() + COOLDOWN_SECONDS * 1000);
    if (ready > now) {
      return { allowed: false, reason: 'cooldown', retryAt: ready };
    }
  }

  if (DAILY_LIMIT_PER_USER > 0 && counts.todayAcrossTasks >= DAILY_LIMIT_PER_USER) {
    return { allowed: false, reason: 'daily', retryAt: addHours(now, 24) };
  }

  const used = counts.taskAttempts.length;
  if (used >= counts.allowedForTask) {
    /** Nothing to wait for. The allowance does not refill; a teacher can add to it. */
    return { allowed: false, reason: 'used_up', retryAt: null };
  }

  return {
    allowed: true,
    attemptNumber: used + 1,
    attemptsLeft: counts.allowedForTask - used - 1,
  };
};

/**
 * How many checks this student has for this task.
 *
 * The course's figure, plus every grant a teacher made. A course with no figure falls back to
 * three rather than to none - a missing setting must not lock a student out of their own work.
 */
export const allowanceFor = (
  courseChecksPerTask: number | null | undefined,
  grantedExtra = 0,
): number => {
  const base =
    typeof courseChecksPerTask === 'number' && courseChecksPerTask > 0
      ? courseChecksPerTask
      : DEFAULT_CHECKS_PER_TASK;
  return base + Math.max(0, grantedExtra);
};

const addHours = (at: Date, hours: number): Date =>
  new Date(at.getTime() + hours * 60 * 60 * 1000);
