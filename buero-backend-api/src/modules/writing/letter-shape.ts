/**
 * Reading the shape of a letter without asking the model.
 *
 * Criterion 1 — the right number of sentences, a salutation and a closing — is the one thing in
 * the rubric that can be settled by counting. Settling it here is what makes a too-short letter
 * free: it comes back with "write more" before any paid call, and the attempt is not spent. A
 * student who sends three sentences learns that from the form, not from a graded result.
 *
 * Only *too short* is turned away. A letter that runs long still goes to the model and simply
 * loses criterion 1 — the author's counting rules say the code filters the short case alone.
 */

/** Fallback range, used only when a task does not state its own. */
export const DEFAULT_MIN_SENTENCES = 6;
export const DEFAULT_MAX_SENTENCES = 8;

/** Beyond this the letter is not a letter; it is refused before it can cost anything. */
export const MAX_WORDS = 300;

const SALUTATION = /sehr\s+geehrte(r)?\b/i;

/**
 * The closings a B1 letter is taught to end with. Matching a set rather than one phrase, since
 * the rubric asks for "a closing formula" and not for one particular wording.
 */
const CLOSING =
  /(mit\s+freundlichen\s+gr(ü|ue)(ß|ss)en|freundliche\s+gr(ü|ue)(ß|ss)e|viele\s+gr(ü|ue)(ß|ss)e|beste\s+gr(ü|ue)(ß|ss)e)/i;

/** `Betreff:` is the subject line, which the counting rules exclude from the body. */
const SUBJECT_LINE = /^\s*betreff\s*:.*$/gim;

export type LetterShape = {
  bodySentences: number;
  hasSalutation: boolean;
  hasClosing: boolean;
  words: number;
  /** Criterion 1, decided here rather than by the model. */
  meetsCriterionOne: boolean;
};

export type PreCheck =
  | { ok: true; shape: LetterShape }
  /**
   * Turned away before the model is called. `reason` is what the student is told, and the
   * attempt is not counted against them.
   */
  | { ok: false; reason: 'too_short' | 'no_salutation' | 'no_closing' | 'too_long'; shape: LetterShape };

/**
 * The body is what sits between the salutation and the closing.
 *
 * The subject line is dropped first, then everything up to and including the salutation, then
 * everything from the closing onwards — which also removes the signature. What is left is what
 * the author counts, including a closing courtesy such as "Vielen Dank für Ihr Verständnis."
 * when it sits inside the body.
 */
const extractBody = (letter: string): string => {
  const withoutSubject = letter.replace(SUBJECT_LINE, '');

  const salutation = SALUTATION.exec(withoutSubject);
  const afterSalutation = salutation
    ? withoutSubject.slice(salutation.index + salutation[0].length)
    : withoutSubject;

  /** A salutation runs to the end of its line, comma and name included. */
  const lineEnd = afterSalutation.indexOf('\n');
  const body = lineEnd >= 0 ? afterSalutation.slice(lineEnd) : afterSalutation;

  const closing = CLOSING.exec(body);
  return closing ? body.slice(0, closing.index) : body;
};

/**
 * Sentences are counted on the marks that end one.
 *
 * A decimal or a clock time would otherwise read as a sentence break, so a full stop only ends a
 * sentence when what follows is whitespace or the end of the text. Abbreviations such as "z. B."
 * are left alone for the same reason: the letter of a B1 student rarely contains them, and
 * miscounting downwards would refuse a letter that is long enough.
 */
export const countSentences = (text: string): number => {
  const matches = text.match(/[.!?]+(?=\s|$)/g);
  return matches ? matches.length : 0;
};

const countWords = (text: string): number =>
  text.split(/\s+/).filter((word) => /\p{L}/u.test(word)).length;

export const readLetterShape = (
  letter: string,
  minSentences = DEFAULT_MIN_SENTENCES,
  maxSentences = DEFAULT_MAX_SENTENCES,
): LetterShape => {
  const body = extractBody(letter);
  const bodySentences = countSentences(body);
  const hasSalutation = SALUTATION.test(letter);
  const hasClosing = CLOSING.test(letter);

  return {
    bodySentences,
    hasSalutation,
    hasClosing,
    words: countWords(letter),
    meetsCriterionOne:
      hasSalutation &&
      hasClosing &&
      bodySentences >= minSentences &&
      bodySentences <= maxSentences,
  };
};

export const preCheckLetter = (
  letter: string,
  minSentences = DEFAULT_MIN_SENTENCES,
  maxSentences = DEFAULT_MAX_SENTENCES,
): PreCheck => {
  const shape = readLetterShape(letter, minSentences, maxSentences);

  if (shape.words > MAX_WORDS) return { ok: false, reason: 'too_long', shape };
  if (!shape.hasSalutation) return { ok: false, reason: 'no_salutation', shape };
  if (!shape.hasClosing) return { ok: false, reason: 'no_closing', shape };
  if (shape.bodySentences < minSentences) {
    return { ok: false, reason: 'too_short', shape };
  }

  return { ok: true, shape };
};
