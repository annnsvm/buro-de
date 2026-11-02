import {
  allowanceFor,
  COOLDOWN_SECONDS,
  DEFAULT_CHECKS_PER_TASK,
  decideAttempt,
  type AttemptCounts,
} from './attempt-policy';

/**
 * The limits that stand between a bug and the card.
 *
 * Each is checked in both directions: that it lets through what it should, and that it stops what
 * it should. A limit that only ever says yes in tests is not a limit.
 *
 * What is tested here changed with the amendment. The allowance used to roll - three attempts in
 * any 24 hours, refilling as the oldest aged out - and is now three for the whole time a student
 * has access. The old tests are gone with the old rule; these are the new one.
 */
const NOW = new Date('2026-11-02T12:00:00Z');
const minutesAgo = (minutes: number) => new Date(NOW.getTime() - minutes * 60 * 1000);
const hoursAgo = (hours: number) => new Date(NOW.getTime() - hours * 60 * 60 * 1000);

const counts = (over: Partial<AttemptCounts> = {}): AttemptCounts => ({
  taskAttempts: [],
  allowedForTask: DEFAULT_CHECKS_PER_TASK,
  todayAcrossTasks: 0,
  monthAcrossEveryone: 0,
  ...over,
});

describe('the allowance for one task', () => {
  it('lets a first check through and says how many remain', () => {
    expect(decideAttempt(counts(), NOW)).toEqual({
      allowed: true,
      attemptNumber: 1,
      attemptsLeft: 2,
    });
  });

  it('counts down as they are used', () => {
    expect(decideAttempt(counts({ taskAttempts: [hoursAgo(2)] }), NOW)).toMatchObject({
      allowed: true,
      attemptNumber: 2,
      attemptsLeft: 1,
    });
  });

  it('stops after the third', () => {
    const decision = decideAttempt(
      counts({ taskAttempts: [hoursAgo(2), hoursAgo(3), hoursAgo(4)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: false, reason: 'used_up' });
  });

  /**
   * The difference the amendment makes. Under the old rule these three would have aged out and
   * the student would have had three more; now the task is finished with and the sample opens.
   */
  it('does not refill with time', () => {
    const lastYear = [hoursAgo(9000), hoursAgo(9001), hoursAgo(9002)];
    expect(decideAttempt(counts({ taskAttempts: lastYear }), NOW)).toMatchObject({
      allowed: false,
      reason: 'used_up',
    });
  });

  /** Nothing to wait for, so nothing is promised. A teacher can add to the allowance. */
  it('offers no retry time when it is spent', () => {
    const decision = decideAttempt(
      counts({ taskAttempts: [hoursAgo(2), hoursAgo(3), hoursAgo(4)] }),
      NOW,
    );
    if (!decision.allowed) expect(decision.retryAt).toBeNull();
  });

  it('follows the course when the course asks for more', () => {
    const decision = decideAttempt(
      counts({ allowedForTask: 5, taskAttempts: [hoursAgo(2), hoursAgo(3), hoursAgo(4)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: true, attemptNumber: 4, attemptsLeft: 1 });
  });

  it('numbers the check by the whole history', () => {
    const decision = decideAttempt(
      counts({ allowedForTask: 6, taskAttempts: [hoursAgo(30), hoursAgo(31), hoursAgo(32)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: true, attemptNumber: 4 });
  });
});

describe('the pause between checks', () => {
  it('turns away a second check sent straight after the first', () => {
    const decision = decideAttempt(counts({ taskAttempts: [NOW] }), NOW);
    expect(decision).toMatchObject({ allowed: false, reason: 'cooldown' });
  });

  it('says when it will be ready', () => {
    const decision = decideAttempt(counts({ taskAttempts: [NOW] }), NOW);
    if (!decision.allowed) {
      expect(decision.retryAt).toEqual(new Date(NOW.getTime() + COOLDOWN_SECONDS * 1000));
    }
  });

  it('lets the next one through once it has passed', () => {
    expect(decideAttempt(counts({ taskAttempts: [minutesAgo(1)] }), NOW).allowed).toBe(true);
  });

  /**
   * The pause is read off the newest check, whatever order they arrive in. Reading the first of
   * the list would let a student straight through if an older row happened to come back first.
   */
  it('measures from the newest check, not the first in the list', () => {
    const decision = decideAttempt(
      counts({ taskAttempts: [hoursAgo(5), NOW, hoursAgo(2)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: false, reason: 'cooldown' });
  });

  /**
   * A student who clicks twice has not used two checks. Telling them to wait is true; telling
   * them their checks are gone would not be.
   */
  it('comes before the allowance, so a double click is never reported as running out', () => {
    const decision = decideAttempt(
      counts({ taskAttempts: [NOW, hoursAgo(2), hoursAgo(3)] }),
      NOW,
    );
    expect(decision).toMatchObject({ allowed: false, reason: 'cooldown' });
  });
});

describe('how the allowance is worked out', () => {
  it('uses the course figure', () => {
    expect(allowanceFor(5)).toBe(5);
  });

  it('adds what a teacher granted', () => {
    expect(allowanceFor(3, 2)).toBe(5);
  });

  /** A missing setting must not lock a student out of their own work. */
  it.each([[null], [undefined], [0]])('falls back to three when the course says %p', (value) => {
    expect(allowanceFor(value as number | null | undefined)).toBe(DEFAULT_CHECKS_PER_TASK);
  });

  it('ignores a negative grant rather than taking checks away', () => {
    expect(allowanceFor(3, -5)).toBe(3);
  });
});

describe('the daily cap across every task', () => {
  const withDaily = (limit: number, usedToday: number) => {
    const previous = process.env.LLM_WRITING_DAILY_LIMIT;
    process.env.LLM_WRITING_DAILY_LIMIT = String(limit);
    jest.resetModules();
    const { decideAttempt: decide } =
      require('./attempt-policy') as typeof import('./attempt-policy');
    const decision = decide(counts({ todayAcrossTasks: usedToday }), NOW);
    process.env.LLM_WRITING_DAILY_LIMIT = previous;
    jest.resetModules();
    return decision;
  };

  /**
   * Off by default now. It guarded a refilling allowance; with a lifetime one the most a student
   * can ever spend is their allowance times the number of tasks, and switched on it would stop
   * someone working through a module in one sitting.
   */
  it('is off unless a limit is set', () => {
    expect(withDaily(0, 10_000).allowed).toBe(true);
  });

  it('stops a student once past it, when it is set', () => {
    expect(withDaily(10, 10)).toMatchObject({ allowed: false, reason: 'daily' });
  });

  it('lets them through one short of it', () => {
    expect(withDaily(10, 9).allowed).toBe(true);
  });
});

describe('the monthly breaker', () => {
  const withBudget = (budget: number, used: number) => {
    const previous = process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS;
    process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS = String(budget);
    jest.resetModules();
    // Re-imported so the module reads the budget that was just set.

    const { decideAttempt: decide } =
      require('./attempt-policy') as typeof import('./attempt-policy');
    const decision = decide(counts({ monthAcrossEveryone: used }), NOW);
    process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS = previous;
    jest.resetModules();
    return decision;
  };

  it("trips once the month's allowance is spent", () => {
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
  it('outranks a student who still had checks left', () => {
    expect(withBudget(1, 5)).toMatchObject({ allowed: false, reason: 'budget' });
  });
});
