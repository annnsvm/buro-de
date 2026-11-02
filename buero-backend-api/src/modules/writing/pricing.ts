/**
 * What a check costs, in one place.
 *
 * The rates live here rather than in the script that prints them, because the monthly report and
 * the acceptance runs have to agree: a report that priced the same tokens differently from the
 * run they were measured in would be worse than no report.
 *
 * Every figure is per million tokens, as Anthropic publishes them.
 */

export type Price = { in: number; out: number };

const PRICES: Record<string, Price> = {
  'claude-opus-5-5': { in: 4, out: 20 },
  'claude-opus-5': { in: 5, out: 25 },
  'claude-sonnet-5-5': { in: 2, out: 10 },
  'claude-haiku-5-5': { in: 0.1, out: 0.5 },
};

/** A cache write is billed above the plain input price, a cache read far below it. */
export const CACHE_WRITE_MULTIPLIER = 1.25;
export const CACHE_READ_MULTIPLIER = 0.1;

/**
 * Null for a model we have no rate for, including the submissions stored before the model was
 * recorded at all.
 *
 * Returning a default here would put a number in the report that nobody could check. The
 * report counts those rows separately and says so instead.
 */
export const priceFor = (model: string | null): Price | null =>
  model === null ? null : (PRICES[model] ?? null);

export type TokenCounts = {
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
};

/** Null when the model's rate is unknown, for the same reason. */
export const costOf = (model: string | null, tokens: TokenCounts): number | null => {
  const price = priceFor(model);
  if (!price) return null;
  return (
    (tokens.inputTokens / 1e6) * price.in +
    (tokens.cacheWriteTokens / 1e6) * price.in * CACHE_WRITE_MULTIPLIER +
    (tokens.cacheReadTokens / 1e6) * price.in * CACHE_READ_MULTIPLIER +
    (tokens.outputTokens / 1e6) * price.out
  );
};

/** Rounded to the cent-hundredth: a single check costs less than a cent, so cents would be 0. */
export const roundCost = (cost: number): number => Math.round(cost * 10000) / 10000;
