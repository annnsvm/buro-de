/**
 * Comparing a written German answer against the expected one.
 *
 * A student who knows the rule can still fail a naive string comparison: they type
 * `anfaengt` because their keyboard has no umlauts, or drop the comma before `weil`,
 * or forget that nouns are capitalised. Rejecting those outright teaches nothing and
 * is the fastest way to make a learner distrust the exercise, so each is recognised
 * and reported separately instead.
 */

export type AnswerMatchQuality =
  /** Right, allowing for umlaut spelling, spacing and the final full stop. */
  | 'exact'
  /** Right apart from capitalisation, which in German carries meaning. */
  | 'case'
  /** One character out: a typo, or a single missing comma or letter. */
  | 'typo'
  | 'none';

export type AnswerMatch = {
  correct: boolean;
  quality: AnswerMatchQuality;
  /** The accepted answer that matched, for feedback. */
  matched: string | null;
};

/**
 * ae/oe/ue/ss are the standard way to write German without a German keyboard, so they
 * are treated as the same word rather than as a mistake.
 */
const foldUmlauts = (value: string): string =>
  value
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue');

/** Trims, collapses runs of whitespace and drops a single sentence-final mark. */
const tidy = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '').trim();

const canonical = (value: string): string => foldUmlauts(tidy(value));

/**
 * Damerau-Levenshtein distance, stopped as soon as it exceeds `limit`.
 *
 * Counts a transposition as one edit, so `haeb` for `habe` is a single slip rather
 * than two. The caller decides when the tolerance may be applied at all.
 */
export const boundedEditDistance = (
  a: string,
  b: string,
  limit: number,
): number => {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > limit) return limit + 1;

  const rows: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i += 1) rows[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) rows[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    let rowBest = Number.POSITIVE_INFINITY;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      );
      // Transposition: "haeb" for "habe".
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        value = Math.min(value, rows[i - 2][j - 2] + 1);
      }
      rows[i][j] = value;
      rowBest = Math.min(rowBest, value);
    }
    // No cell in this row is within the limit, so no later row can be either.
    if (rowBest > limit) return limit + 1;
  }

  return rows[a.length][b.length];
};

const TYPO_LIMIT = 1;

/**
 * Below this length a single edit stops meaning "a slip" and starts meaning "a
 * different word": `kann` is one edit from `Mann` once case is set aside, and both are
 * ordinary German. Short answers — the function words that gap-fill exercises ask for,
 * such as `bin`, `weil`, `dass` — therefore have to be spelled correctly. Long answers,
 * where one character out really is a typo or a missing comma, keep the tolerance.
 */
const MIN_LENGTH_FOR_TYPO_TOLERANCE = 6;

/** Compares one written answer against every wording the author accepts. */
export const matchGermanAnswer = (
  answer: string,
  acceptedAnswers: readonly string[],
): AnswerMatch => {
  const given = canonical(answer);
  if (!given) return { correct: false, quality: 'none', matched: null };

  let caseMatch: string | null = null;
  let typoMatch: string | null = null;

  for (const accepted of acceptedAnswers) {
    const expected = canonical(accepted);
    if (!expected) continue;

    if (given === expected) {
      return { correct: true, quality: 'exact', matched: accepted };
    }
    if (given.toLowerCase() === expected.toLowerCase()) {
      caseMatch ??= accepted;
      continue;
    }
    if (
      expected.length >= MIN_LENGTH_FOR_TYPO_TOLERANCE &&
      boundedEditDistance(
        given.toLowerCase(),
        expected.toLowerCase(),
        TYPO_LIMIT,
      ) <= TYPO_LIMIT
    ) {
      typoMatch ??= accepted;
    }
  }

  if (caseMatch) return { correct: true, quality: 'case', matched: caseMatch };
  if (typoMatch) return { correct: true, quality: 'typo', matched: typoMatch };
  return { correct: false, quality: 'none', matched: null };
};
