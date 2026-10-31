/**
 * Reading the shape of a letter without asking the model.
 *
 * Criterion 1 - the right number of sentences, a salutation and a closing - is the one thing in
 * the rubric that can be settled by counting. Settling it here is what makes a too-short letter
 * free: it comes back with "write more" before any paid call, and the attempt is not spent. A
 * student who sends three sentences learns that from the form, not from a graded result.
 *
 * Only *too short* is turned away. A letter that runs long still goes to the model and simply
 * loses criterion 1 - the author's counting rules say the code filters the short case alone.
 */

/** Fallback range, used only when a task does not state its own. */
export const DEFAULT_MIN_SENTENCES = 6;
export const DEFAULT_MAX_SENTENCES = 8;

/**
 * The ceiling that keeps one submission from costing what twenty should.
 *
 * It is a floor plus an allowance per sentence the task asked for, not a flat number: a task
 * that asks for fifteen sentences would be refused outright by a limit set for a letter of
 * eight.
 */
export const MIN_WORD_CEILING = 300;
export const WORDS_PER_SENTENCE = 30;

export const wordCeiling = (maxSentences: number): number =>
  Math.max(MIN_WORD_CEILING, Math.round(maxSentences * WORDS_PER_SENTENCE));

/** @deprecated The flat ceiling, kept so nothing that imports it breaks. */
export const MAX_WORDS = MIN_WORD_CEILING;

/**
 * How a German text of this level opens.
 *
 * Formal and informal both, because a task may ask for either: a letter to a manager begins
 * "Sehr geehrte Frau …", a note to a colleague begins "Liebe Frau …" or "Hallo …", and
 * refusing the second kind told the student their correct opening did not exist.
 *
 * Anchored to the start of a line. A salutation always is one, and matching anywhere would let
 * a "Hallo" in the middle of a sentence cut the body in half and undercount it. `Liebe Grüße`
 * is excluded by name: it is how a text ends, not how it begins.
 */
const SALUTATION =
  /^[ \t]*(?!liebe\s+gr(ü|ue)(ß|ss)e)(sehr\s+geehrte[rs]?|liebe[rs]?|hallo|guten\s+(tag|morgen|abend)|moin|servus|gr(ü|ue)(ß|ss)\s+gott|hi)\b/im;

/**
 * The closings such a text is taught to end with, formal and informal.
 *
 * A set rather than one phrase: the rubric asks for "a closing formula", not for one particular
 * wording, and "Liebe Grüße" is the ordinary partner of an informal opening.
 */
const CLOSING =
  /^[ \t]*(mit\s+freundlichen\s+gr(ü|ue)(ß|ss)en|mit\s+besten\s+gr(ü|ue)(ß|ss)en|freundliche\s+gr(ü|ue)(ß|ss)e|viele\s+(liebe\s+)?gr(ü|ue)(ß|ss)e|beste\s+gr(ü|ue)(ß|ss)e|herzliche\s+gr(ü|ue)(ß|ss)e|liebe\s+gr(ü|ue)(ß|ss)e|alles\s+liebe|bis\s+bald|tsch(ü|ue)ss|lg)\b/im;

/**
 * Whether this task's rubric asks for the shape of a letter.
 *
 * The rubric is the specification, so the free check enforces exactly what the author wrote and
 * never more. A task about a letter says so - "є звертання … і формула прощання" - and a task
 * asking for a story, a forum post or a description does not, and is no longer told to begin
 * with "Sehr geehrte Frau …".
 *
 * Derived rather than configured because the author already writes the rubric, and a separate
 * switch could disagree with it. Nothing is lost when the guess is no: the model still judges
 * criterion 1 against the author's own words, it is simply not settled for free.
 */
const ASKS_FOR_LETTER_SHAPE =
  /(звертанн|прощанн|вітанн|salutation|anrede|gr(ü|ue)(ß|ss)formel|sehr\s+geehrte|freundlichen\s+gr)/i;

export const requiresLetterShape = (criteria: readonly string[]): boolean =>
  criteria.some((criterion) => ASKS_FOR_LETTER_SHAPE.test(criterion));

/**
 * Which criterion, if any, is settled by counting rather than judged.
 *
 * It used to be assumed to be the first one, because in the module 4 letter it is. Nothing makes
 * that true of the next task: the criteria arrive from the author's own `Пояснення` lines in the
 * order they wrote them, so a rubric that opens with "Є речення з weil" had that verdict quietly
 * replaced by the sentence count - a criterion marked on something it never asked about.
 *
 * Found by what the criterion says instead, and found strictly. Mentioning sentences is not
 * enough: "Є речення з weil" is about a conjunction, not about how many sentences there are. The
 * criterion must also quote the range the task was set - the same two numbers the author typed in
 * the "Матеріал" column - which no criterion about grammar does.
 *
 * A rubric that spells the range in words instead of digits matches nothing, and then no verdict
 * is overwritten: the model judges that criterion against the author's own wording, and the free
 * check still refuses a text that is too short. Less is settled for free; nothing is settled
 * wrongly.
 */
const MENTIONS_SENTENCES = /(речен|s(ä|ae)tze?|satz|sentence)/i;

/** A bound as a whole number, so 8 in a rubric does not match the 18 in another. */
const quotesBound = (criterion: string, bound: number): boolean =>
  new RegExp(`(?<!\\d)${bound}(?!\\d)`).test(criterion);

export const countedCriterionIndex = (
  criteria: readonly string[],
  minSentences = DEFAULT_MIN_SENTENCES,
  maxSentences = DEFAULT_MAX_SENTENCES,
): number | null => {
  const index = criteria.findIndex(
    (criterion) =>
      MENTIONS_SENTENCES.test(criterion) &&
      quotesBound(criterion, minSentences) &&
      quotesBound(criterion, maxSentences),
  );
  return index === -1 ? null : index;
};

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
 * everything from the closing onwards - which also removes the signature. What is left is what
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
  /**
   * Whether the task asked for a letter. When it did not, criterion 1 is the length alone -
   * demanding a closing formula of a story would be marking against a rule nobody set.
   */
  letterShape = true,
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
      (!letterShape || (hasSalutation && hasClosing)) &&
      bodySentences >= minSentences &&
      bodySentences <= maxSentences,
  };
};

export const preCheckLetter = (
  letter: string,
  minSentences = DEFAULT_MIN_SENTENCES,
  maxSentences = DEFAULT_MAX_SENTENCES,
  letterShape = true,
): PreCheck => {
  const shape = readLetterShape(letter, minSentences, maxSentences, letterShape);

  if (shape.words > wordCeiling(maxSentences)) {
    return { ok: false, reason: 'too_long', shape };
  }
  /**
   * Only a task that asked for a letter is turned away for not being one. This is what used to
   * tell a student writing a description to open with "Sehr geehrte Frau …".
   */
  if (letterShape) {
    if (!shape.hasSalutation) return { ok: false, reason: 'no_salutation', shape };
    if (!shape.hasClosing) return { ok: false, reason: 'no_closing', shape };
  }
  if (shape.bodySentences < minSentences) {
    return { ok: false, reason: 'too_short', shape };
  }

  return { ok: true, shape };
};
