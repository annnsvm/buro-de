import {
  ATTEMPTS_PER_TASK,
  DAILY_LIMIT_PER_USER,
  decideAttempt,
  type AttemptCounts,
} from './attempt-policy';

/**
 * The limits that stand between a bug and the card.
 *
 * Each is checked in both directions: that it lets through what it should, and that it stops
 * what it should. A limit that only ever says yes in tests is not a limit.
 */
const NOW = new Date('2026-09-29T12:00:00Z');
const hoursAgo = (hours: number) =>
  new Date(NOW.getTime() - hours * 60 * 60 * 1000);

const counts = (over: Partial<AttemptCounts> = {}): AttemptCounts => ({
  taskAttempts: [],
  todayAcrossTasks: 0,
  monthAcrossEveryone: 0,
  ...over,
});

describe('attempts at one task', () => {
  it('lets a first attempt through and says how many remain', () => {
    expect(decideAttempt(counts(), NOW)).toEqual({
      allowed: true,
      attemptNumber: 1,
      attemptsLeft: ATTEMPTS_PER_TASK - 1,
    });
  });

  it('counts down as they are used', () => {
    const decision = decideAttempt(counts({ taskAttempts: [hoursAgo(1)] }), NOW);
    expect(decision).toMatchObject({ allowed: true, attemptNumber: 2, attemptsLeft: 1 });
  });

  it('stops after the third and says when to come back', () => {
    const decision = decideAttempt(
      counts({ taskAttempts: [hoursAgo(1), hoursAgo(2), hoursAgo(3)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: false, reason: 'wait' });
    if (!decision.allowed) {
      // The wait ends when the oldest of the three falls out of the window.
      expect(decision.retryAt).toEqual(new Date('2026-09-30T09:00:00Z'));
    }
  });

  /**
   * The window rolls rather than resetting at a fixed hour: attempts made more than a day ago no
   * longer count, so a student is never held back by something they did last week.
   */
  it('forgets attempts older than the window', () => {
    const decision = decideAttempt(
      counts({ taskAttempts: [hoursAgo(25), hoursAgo(26), hoursAgo(27)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: true, attemptsLeft: ATTEMPTS_PER_TASK - 1 });
  });

  it('frees exactly one go as the oldest ages out', () => {
    const decision = decideAttempt(
      counts({ taskAttempts: [hoursAgo(25), hoursAgo(2), hoursAgo(3)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: true, attemptsLeft: 0 });
  });

  it('numbers the attempt by the whole history, not by the window', () => {
    // Four earlier attempts, all aged out: this is the fifth the student has made.
    const decision = decideAttempt(
      counts({ taskAttempts: [hoursAgo(30), hoursAgo(31), hoursAgo(32), hoursAgo(33)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: true, attemptNumber: 5 });
  });
});

describe('the daily cap across every task', () => {
  it('stops a student working through many tasks in one afternoon', () => {
    const decision = decideAttempt(
      counts({ todayAcrossTasks: DAILY_LIMIT_PER_USER }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: false, reason: 'daily' });
  });

  it('lets them through one short of it', () => {
    expect(
      decideAttempt(counts({ todayAcrossTasks: DAILY_LIMIT_PER_USER - 1 }), NOW).allowed,
    ).toBe(true);
  });
});

describe('the monthly breaker', () => {
  const withBudget = (budget: number, used: number) => {
    const previous = process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS;
    process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS = String(budget);
    jest.resetModules();
    // Re-imported so the module reads the budget that was just set.

    const { decideAttempt: decide } = require('./attempt-policy') as typeof import('./attempt-policy');
    const decision = decide(counts({ monthAcrossEveryone: used }), NOW);
    process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS = previous;
    jest.resetModules();
    return decision;
  };

  it('trips once the month\'s allowance is spent', () => {
    expect(withBudget(100, 100)).toMatchObject({ allowed: false, reason: 'budget' });
  });

  it('offers no retry time, because waiting would not help', () => {
    const decision = withBudget(100, 100);
    if (!decision.allowed) expect(decision.retryAt).toBeNull();
  });

  it('is off when no budget is set, which is right while volume is tiny', () => {
    expect(withBudget(0, 100_000).allowed).toBe(true);
  });

  /** The breaker outranks everything: it is about the card, not about one student. */
  it('outranks a student who still had attempts left', () => {
    expect(withBudget(1, 5)).toMatchObject({ allowed: false, reason: 'budget' });
  });
});
