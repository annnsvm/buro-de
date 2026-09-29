import { ACCEPTANCE_LETTERS } from './acceptance-letters';
import {
  countSentences,
  preCheckLetter,
  readLetterShape,
} from './letter-shape';

/**
 * The part of the rubric that is settled by counting rather than by the model.
 *
 * Getting this wrong is expensive in both directions: count too few and a letter long enough is
 * turned away without being read; count too many and a three-sentence note reaches a paid call.
 * The letters here are the author's own acceptance samples.
 */

const SALUTATION = 'Sehr geehrte Frau Schmidt,';
const CLOSING = 'Mit freundlichen Grüßen\nOlha Kovalenko';

const letter = (body: string) =>
  `Betreff: Krankmeldung\n\n${SALUTATION}\n\n${body}\n\n${CLOSING}`;

/** L1 — the author's model answer: seven body sentences. */
const MODEL_ANSWER = letter(
  'ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung ' +
    'um zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, ' +
    'dass ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort ' +
    'Bescheid. Vielen Dank für Ihr Verständnis.',
);

/** L6 — three sentences and no closing at all. */
const TOO_SHORT =
  'Betreff: Krankmeldung\n\n' +
  SALUTATION +
  '\n\nich bin krank. Ich komme heute nicht. Die Besprechung muss ich absagen.';

describe('counting the sentences of a letter', () => {
  it('counts the model answer as seven', () => {
    expect(readLetterShape(MODEL_ANSWER).bodySentences).toBe(7);
  });

  it('counts a closing courtesy inside the body as a sentence', () => {
    // "Vielen Dank für Ihr Verständnis." sits in the body and counts, per the author's rules.
    const withoutThanks = letter(
      'Satz eins. Satz zwei. Satz drei. Satz vier. Satz fünf. Satz sechs.',
    );
    const withThanks = letter(
      'Satz eins. Satz zwei. Satz drei. Satz vier. Satz fünf. Satz sechs. ' +
        'Vielen Dank für Ihr Verständnis.',
    );
    expect(readLetterShape(withoutThanks).bodySentences).toBe(6);
    expect(readLetterShape(withThanks).bodySentences).toBe(7);
  });

  it('leaves out the subject line, the salutation and the signature', () => {
    // Four lines that are not body sentences surround a body of exactly six.
    expect(
      readLetterShape(
        letter('Eins. Zwei. Drei. Vier. Fünf. Sechs.'),
      ).bodySentences,
    ).toBe(6);
  });

  it('does not break a sentence on a clock time or a decimal', () => {
    expect(countSentences('Die Besprechung ist um 10.30 Uhr. Ich komme nicht.')).toBe(2);
  });

  it('counts a question and an exclamation as sentences', () => {
    expect(countSentences('Geht das? Ja! Gut.')).toBe(3);
  });
});

describe('criterion 1, decided by counting', () => {
  it('is met by the model answer', () => {
    expect(readLetterShape(MODEL_ANSWER).meetsCriterionOne).toBe(true);
  });

  it('is not met when the letter runs past eight sentences', () => {
    const nine = letter(
      'Eins. Zwei. Drei. Vier. Fünf. Sechs. Sieben. Acht. Neun.',
    );
    expect(readLetterShape(nine).meetsCriterionOne).toBe(false);
  });

  it('is not met without a closing formula', () => {
    expect(readLetterShape(TOO_SHORT).meetsCriterionOne).toBe(false);
  });

  it('accepts other closings a letter is taught to end with', () => {
    const body = 'Eins. Zwei. Drei. Vier. Fünf. Sechs.';
    for (const closing of ['Viele Grüße', 'Freundliche Grüße', 'Mit freundlichen Gruessen']) {
      const text = `${SALUTATION}\n\n${body}\n\n${closing}\nOlha`;
      expect(readLetterShape(text).hasClosing).toBe(true);
    }
  });

  it('accepts the masculine salutation', () => {
    expect(readLetterShape('Sehr geehrter Herr Schmidt,\n\nEins.').hasSalutation).toBe(true);
  });
});

describe('what the free check turns away', () => {
  /**
   * The point of the free check: a letter this short costs nothing to refuse, and the student
   * keeps the attempt. Only the short case is filtered — a long letter still goes to the model
   * and loses criterion 1 there.
   */
  it('refuses a letter under six sentences without calling anything', () => {
    const result = preCheckLetter(TOO_SHORT);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('no_closing');
  });

  it('names a missing salutation separately, so the student knows what to add', () => {
    const result = preCheckLetter(
      'ich bin krank. Zwei. Drei. Vier. Fünf. Sechs.\n\nMit freundlichen Grüßen\nOlha',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('no_salutation');
  });

  it('refuses a body of five sentences that is otherwise a proper letter', () => {
    const result = preCheckLetter(letter('Eins. Zwei. Drei. Vier. Fünf.'));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('too_short');
  });

  it('lets a long letter through to be graded, rather than refusing it', () => {
    const nine = letter('Eins. Zwei. Drei. Vier. Fünf. Sechs. Sieben. Acht. Neun.');
    const result = preCheckLetter(nine);
    expect(result.ok).toBe(true);
    // It reaches the model, and loses criterion 1 when it gets there.
    if (result.ok) expect(result.shape.meetsCriterionOne).toBe(false);
  });

  it('refuses an essay outright, before it can cost anything', () => {
    const essay = letter(`${'Ich bin heute leider krank und kann nicht kommen. '.repeat(40)}`);
    const result = preCheckLetter(essay);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('too_long');
  });

  it('lets the model answer through', () => {
    expect(preCheckLetter(MODEL_ANSWER).ok).toBe(true);
  });
});

describe('criterion 1 against the author\'s ten acceptance letters', () => {
  /**
   * The strongest check available without calling anything: for every letter the author graded,
   * what the code counts must match the mark she gave criterion 1. If it does not, the counting
   * is wrong, and no amount of prompt work would fix the resulting score.
   */
  it.each(ACCEPTANCE_LETTERS.map((sample) => [sample.id, sample] as const))(
    '%s agrees with the author',
    (_id, sample) => {
      expect(readLetterShape(sample.letter).meetsCriterionOne).toBe(
        sample.expected[0] === 1,
      );
    },
  );

  it('filters exactly the letter the author marked as too short', () => {
    const refused = ACCEPTANCE_LETTERS.filter(
      (sample) => !preCheckLetter(sample.letter).ok,
    ).map((sample) => sample.id);

    // L6 is the only one that must never reach a paid call.
    expect(refused).toEqual(['L6']);
  });
});
