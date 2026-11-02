/**
 * What a deliberate run cost, and what it decided, in a form two runs can be compared by.
 *
 * Both acceptance runs used to print a cost that ignored the cache entirely, which is the one
 * part of the bill that is easy to get backwards: a cache write costs 1.25x the input price and
 * only pays for itself when a later call reads it. In a run where every task is marked once,
 * nothing is ever read back, so the caching is pure overhead - and the old number hid that by
 * counting those tokens at the plain input rate, or not at all.
 *
 * The rates themselves are not here: they are the ones the monthly report bills by.
 */
import { writeFileSync } from 'fs';
import type { Usage } from './mark-writing';
import {
  CACHE_WRITE_MULTIPLIER,
  costOf as priceRun,
  priceFor,
} from './pricing';

export type Totals = {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
};

export const emptyTotals = (): Totals => ({
  calls: 0,
  inputTokens: 0,
  outputTokens: 0,
  cacheWriteTokens: 0,
  cacheReadTokens: 0,
});

export const addUsage = (totals: Totals, usage: Usage): void => {
  totals.calls += 1;
  totals.inputTokens += usage.inputTokens;
  totals.outputTokens += usage.outputTokens;
  totals.cacheWriteTokens += usage.cacheWriteTokens;
  totals.cacheReadTokens += usage.cacheReadTokens;
};

export const costOf = (model: string, totals: Totals): number =>
  priceRun(model, totals) ?? 0;

/**
 * The cost lines, printed the same way by both runs.
 *
 * The cache is named separately rather than folded into the input, because the question it
 * answers is a decision: if the writes are large and the reads are zero, the breakpoint is
 * costing money instead of saving it.
 */
export const printCost = (model: string, totals: Totals): void => {
  if (totals.calls === 0) return;
  const per = (n: number) => Math.round(n / totals.calls);
  console.log(
    `токенів на виклик: ${per(totals.inputTokens)} вхідних, ` +
      `${per(totals.outputTokens)} вихідних, ` +
      `${per(totals.cacheWriteTokens)} у кеш, ${per(totals.cacheReadTokens)} з кешу`,
  );
  const cost = costOf(model, totals);
  console.log(
    `витрачено $${cost.toFixed(3)} за ${totals.calls} викликів ` +
      `($${(cost / totals.calls).toFixed(4)} за перевірку)`,
  );
  if (totals.cacheWriteTokens > 0 && totals.cacheReadTokens === 0) {
    const wasted =
      (totals.cacheWriteTokens / 1e6) * (priceFor(model)?.in ?? 0) * (CACHE_WRITE_MULTIPLIER - 1);
    console.log(
      `кеш жодного разу не прочитався: надбавка за запис $${wasted.toFixed(3)} даремно`,
    );
  }
};

/** One marked text, flattened so two runs can be compared mark by mark. */
export type MarkRow = {
  id: string;
  /** Null when the free check turned the text away before the model was called. */
  score: number | null;
  maxScore: number;
  refusedBy: string | null;
  /** One entry per criterion: 1 awarded, 0 lost. */
  points: readonly number[];
  /** What the checker said about each criterion it did not award. */
  comments: Record<number, string>;
  /** The author's own marks, where the set has them. */
  expected: readonly number[] | null;
};

export type RunReport = {
  model: string;
  set: string;
  totals: Totals;
  cost: number;
  rows: readonly MarkRow[];
};

/**
 * Written only when asked for, to a path outside the repository.
 *
 * The run's value is in the comparison, and a diff of console output cannot tell a changed mark
 * from a reordered line.
 */
export const writeReport = (report: RunReport): void => {
  const path = process.env.LLM_WRITING_RUN_OUT;
  if (!path) return;
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\nзвіт: ${path}`);
};
