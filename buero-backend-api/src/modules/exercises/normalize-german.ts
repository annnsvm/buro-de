/**
 * Comparing a written German answer against the expected one.
 *
 * The guiding rule is that in a language exercise the small difference is usually the
 * lesson. `arbeiten` for `arbeitet` is one character out, but it is the infinitive
 * instead of the conjugated form — exactly the mistake a gap-fill about verb endings
 * exists to catch. Accepting it quietly teaches the error, so there is deliberately no
 * tolerance for a near-miss spelling.
 *
 * Two things are forgiven, because neither is a gap in knowledge:
 *   - umlauts written as ae/oe/ue/ss, which is a keyboard limitation;
 *   - stray whitespace.
 *
 * Two more are accepted but reported, because the course teaches them and the student
 * should know they slipped: capitalisation, and the commas German puts around a
 * subordinate clause.
 */

export type AnswerMatchQuality =
  /** Right, allowing only for umlaut spelling and spacing. */
  | 'exact'
  /** Right apart from a comma or the final full stop. */
  | 'punctuation'
  /** Right apart from capitalisation, which in German carries meaning. */
  | 'case'
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

/** Trims and collapses runs of whitespace. */
const tidy = (value: string): string => value.trim().replace(/\s+/g, ' ');

const canonical = (value: string): string => foldUmlauts(tidy(value));

/** Drops commas and sentence-final marks, then tidies the spacing they leave behind. */
const withoutPunctuation = (value: string): string =>
  tidy(value.replace(/[,;]/g, ' ').replace(/[.!?]+$/, ''));

export const matchGermanAnswer = (
  answer: string,
  acceptedAnswers: readonly string[],
): AnswerMatch => {
  const given = canonical(answer);
  if (!given) return { correct: false, quality: 'none', matched: null };

  const givenPlain = withoutPunctuation(given);
  let punctuationMatch: string | null = null;
  let caseMatch: string | null = null;

  for (const accepted of acceptedAnswers) {
    const expected = canonical(accepted);
    if (!expected) continue;

    if (given === expected) {
      return { correct: true, quality: 'exact', matched: accepted };
    }

    const expectedPlain = withoutPunctuation(expected);

    if (givenPlain === expectedPlain) {
      punctuationMatch ??= accepted;
      continue;
    }
    if (givenPlain.toLowerCase() === expectedPlain.toLowerCase()) {
      caseMatch ??= accepted;
    }
  }

  /** Capitalisation is reported ahead of punctuation: in German it changes meaning. */
  if (caseMatch) return { correct: true, quality: 'case', matched: caseMatch };
  if (punctuationMatch) {
    return { correct: true, quality: 'punctuation', matched: punctuationMatch };
  }
  return { correct: false, quality: 'none', matched: null };
};
