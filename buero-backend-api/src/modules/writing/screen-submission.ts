/**
 * What is turned away before the model is called.
 *
 * Every refusal here is free in both senses: nothing is spent, and the student keeps the check.
 * That is the point - a student has three checks for the whole course of a task, so a text that
 * could never be marked usefully must not cost one of them.
 *
 * The order is deliberate, because it decides which sentence the student reads. Length first,
 * because it is a fact about the text and needs no comparison. Then the language, because a text
 * in the wrong language makes every other question moot. Then the two comparisons, which are the
 * expensive ones and the only ones that can be wrong.
 */

/** The hard ceiling on what is sent, in characters. A guard on cost, nothing else. */
export const MAX_CHARS = 2000;

/** Below this a text is sent back rather than marked. See `shortestAccepted`. */
export const MIN_WORDS = 15;

/** Above this share of Cyrillic letters, the text is not German. */
export const MAX_CYRILLIC_SHARE = 0.3;

/**
 * At or above this much contiguous overlap, the text was copied rather than written.
 *
 * The author's figure, kept as the default on purpose, because the two ways of being wrong here
 * are not equally bad. Calling an honest letter a copy accuses a student and blocks them; letting
 * an edited copy through costs a fraction of a cent and one of their own three checks.
 *
 * Measured on her 53 answers (2756 pairs), the numbers are:
 *
 *   a verbatim copy                         1.00
 *   a copy with one word changed       0.82 - 0.90
 *   a copy with two words changed      0.63 - 0.80
 *   a copy with three words changed    0.44 - 0.70
 *   two different answers, same module      0.087  <- the worst honest case measured
 *
 * So anything from about 0.15 up to 0.44 would still be safe and would catch far more. It is
 * configurable for exactly that reason; the default stays where she put it.
 */
export const COPIED_SHARE = Number(process.env.LLM_WRITING_COPIED_SHARE ?? 0.8);

/**
 * Half the minimum, not the minimum.
 *
 * A text one sentence short is a text worth marking, and "write more" to someone who wrote five
 * of six sentences wastes the lesson. Below half there is nothing to mark.
 */
export const shortestAccepted = (minSentences: number): number =>
  Math.max(1, Math.ceil(minSentences / 2));

export type Refusal =
  | { reason: 'too_long'; limit: number }
  | { reason: 'too_short'; needed: number }
  | { reason: 'not_german' }
  | { reason: 'already_sent' }
  | { reason: 'copied' };

/**
 * The text with everything that is not a letter or a space taken out.
 *
 * Used to tell one attempt from another. A student who resends the same text with a comma moved
 * has not changed anything a marker would see, and they should keep their check rather than
 * spend it learning that.
 */
export const normalise = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();

const words = (text: string): string[] => normalise(text).split(' ').filter(Boolean);

/**
 * How much of this text appears, word for word and in the same order, in that one.
 *
 * Measured on runs of five words rather than on single words, and that choice is what makes it
 * safe to act on. Two A2 letters about the same situation share most of their vocabulary - the
 * same verbs, the same days of the week, the same closing - so counting single words would mark
 * an honest letter as a copy. Five words in a row is a sentence someone else wrote.
 */
const RUN = 5;

export const contiguousOverlap = (text: string, against: string): number => {
  const mine = words(text);
  if (mine.length < RUN) return 0;

  const theirs = words(against);
  if (theirs.length < RUN) return 0;

  const runs = new Set<string>();
  for (let i = 0; i + RUN <= theirs.length; i += 1) {
    runs.add(theirs.slice(i, i + RUN).join(' '));
  }

  let shared = 0;
  let total = 0;
  for (let i = 0; i + RUN <= mine.length; i += 1) {
    total += 1;
    if (runs.has(mine.slice(i, i + RUN).join(' '))) shared += 1;
  }

  return total === 0 ? 0 : shared / total;
};

/** The share of letters that are Cyrillic. Punctuation and digits are not letters. */
export const cyrillicShare = (text: string): number => {
  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length === 0) return 0;
  const cyrillic = letters.filter((letter) => /\p{Script=Cyrillic}/u.test(letter));
  return cyrillic.length / letters.length;
};

export type SubmissionShape = {
  /** Sentences between the salutation and the closing, counted elsewhere. */
  bodySentences: number;
  /** Words between the salutation and the closing. */
  bodyWords: number;
};

export const screenSubmission = (input: {
  text: string;
  shape: SubmissionShape;
  minSentences: number;
  /** Everything this student has already sent for this task. */
  previousTexts: readonly string[];
  /** The author's model answer and the task itself, which a copied text comes from. */
  sampleAnswer: string | null;
  task: string;
}): Refusal | null => {
  const trimmed = input.text.trim();

  if (trimmed.length > MAX_CHARS) {
    return { reason: 'too_long', limit: MAX_CHARS };
  }

  const needed = shortestAccepted(input.minSentences);
  if (input.shape.bodySentences < needed || input.shape.bodyWords < MIN_WORDS) {
    return { reason: 'too_short', needed: input.minSentences };
  }

  if (cyrillicShare(trimmed) > MAX_CYRILLIC_SHARE) {
    return { reason: 'not_german' };
  }

  const mine = normalise(trimmed);
  if (input.previousTexts.some((previous) => normalise(previous) === mine)) {
    return { reason: 'already_sent' };
  }

  /**
   * Compared against both, because a copied text comes from whichever was easier to reach. The
   * sample is the obvious one; the task is the one a student copies when they have run out of
   * ideas and the box will not let them send nothing.
   */
  const sources = [input.sampleAnswer, input.task].filter(
    (source): source is string => Boolean(source?.trim()),
  );
  if (sources.some((source) => contiguousOverlap(trimmed, source) >= COPIED_SHARE)) {
    return { reason: 'copied' };
  }

  return null;
};
