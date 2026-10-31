import { ACCEPTANCE_LETTERS } from './acceptance-letters';
import {
  countedCriterionIndex,
  countSentences,
  preCheckLetter,
  readLetterShape,
  requiresLetterShape,
  wordCeiling,
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

/** L1 - the author's model answer: seven body sentences. */
const MODEL_ANSWER = letter(
  'ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung ' +
    'um zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, ' +
    'dass ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort ' +
    'Bescheid. Vielen Dank für Ihr Verständnis.',
);

/** L6 - three sentences and no closing at all. */
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
   * keeps the attempt. Only the short case is filtered - a long letter still goes to the model
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

/**
 * Which tasks are held to the shape of a letter, and which are not.
 *
 * The free check demanded a salutation and a closing of every writing task there is, and only
 * ever recognised the formal "Sehr geehrte …". So a task asking for a description or a forum
 * post was refused for not opening like a letter to a manager - and a correct informal letter
 * was refused too, because "Liebe Frau Berg" was not a salutation as far as the code knew.
 *
 * The rubric decides now. It is the specification the author wrote, so the free check enforces
 * exactly what is in it and never more.
 */
describe('whether the task asks for the shape of a letter', () => {
  const LETTER_CRITERION =
    'У тілі листа 6–8 речень; є звертання (Sehr geehrte/r …) і формула прощання';

  it('reads a rubric that asks for a salutation as a letter', () => {
    expect(requiresLetterShape([LETTER_CRITERION, 'Є речення з weil'])).toBe(true);
  });

  it.each([
    ['German wording', ['Es gibt eine Anrede und eine Grußformel']],
    ['the formal opening quoted', ['Beginnt mit Sehr geehrte Frau']],
  ])('recognises %s too', (_name, criteria) => {
    expect(requiresLetterShape(criteria)).toBe(true);
  });

  /** A story, a description, a forum post: none of these is a letter. */
  it.each([
    ['a description', ['Опишіть свій робочий день, 8–10 речень', 'Є речення з weil']],
    ['a forum post', ['Відповідь по темі й зрозуміла', 'Є два приклади з життя']],
    ['a narrative', ['Текст у Perfekt', 'Є щонайменше три різні дієслова']],
  ])('does not treat %s as a letter', (_name, criteria) => {
    expect(requiresLetterShape(criteria)).toBe(false);
  });
});

describe('a task that is not a letter', () => {
  /** Eight sentences, no salutation, no closing - which is exactly what was asked for. */
  const DESCRIPTION =
    'Mein Arbeitstag beginnt um acht Uhr. Zuerst lese ich meine E-Mails. ' +
    'Dann rufe ich zwei Kunden an. Um zehn haben wir eine Besprechung. ' +
    'Danach schreibe ich das Protokoll. Mittags esse ich in der Kantine. ' +
    'Am Nachmittag arbeite ich an einem Angebot. Um fünf gehe ich nach Hause.';

  it('is accepted without a salutation or a closing', () => {
    const pre = preCheckLetter(DESCRIPTION, 6, 10, false);
    expect(pre.ok).toBe(true);
  });

  it('still earns criterion 1 on its length alone', () => {
    const shape = readLetterShape(DESCRIPTION, 6, 10, false);
    expect(shape.hasSalutation).toBe(false);
    expect(shape.meetsCriterionOne).toBe(true);
  });

  /** Length is still length: too short is too short, letter or not. */
  it('is still refused when it is too short', () => {
    const pre = preCheckLetter('Mein Tag ist lang. Ich arbeite viel.', 6, 10, false);
    expect(pre).toMatchObject({ ok: false, reason: 'too_short' });
  });
});

describe('an informal letter', () => {
  const INFORMAL =
    'Liebe Frau Berg,\n\n' +
    'herzlichen Glückwunsch zum Geburtstag! Ich wünsche Ihnen alles Gute. ' +
    'Leider kann ich heute nicht zur Feier kommen, weil ich krank bin. ' +
    'Das tut mir sehr leid. Ich hoffe, dass wir nächste Woche zusammen Kaffee trinken. ' +
    'Wenn Sie Zeit haben, schreiben Sie mir einfach. Bis bald!\n\n' +
    'Liebe Grüße\nOlha';

  it('is a proper letter, salutation and closing and all', () => {
    const shape = readLetterShape(INFORMAL, 6, 8);
    expect(shape.hasSalutation).toBe(true);
    expect(shape.hasClosing).toBe(true);
  });

  it('is let through to be graded', () => {
    expect(preCheckLetter(INFORMAL, 6, 8).ok).toBe(true);
  });

  it.each([
    ['Lieber Herr Klein,', true],
    ['Hallo Markus,', true],
    ['Guten Tag Frau Berg,', true],
    ['Sehr geehrte Frau Berg,', true],
  ])('accepts %s as an opening', (opening, expected) => {
    expect(readLetterShape(`${opening}\n\nIch schreibe Ihnen.`, 1, 99).hasSalutation).toBe(
      expected,
    );
  });

  it.each(['Liebe Grüße', 'Herzliche Grüße', 'Viele liebe Grüße', 'Alles Liebe', 'LG'])(
    'accepts %s as a closing',
    (closing) => {
      expect(
        readLetterShape(`Hallo,\n\nIch schreibe.\n\n${closing}\nOlha`, 1, 99).hasClosing,
      ).toBe(true);
    },
  );

  /**
   * "Liebe Grüße" ends a text; it does not begin one. Counting it as a salutation would let a
   * letter with no opening at all pass the check that exists to catch exactly that.
   */
  it('does not mistake the closing for an opening', () => {
    const noOpening = 'Ich bin heute krank und komme nicht.\n\nLiebe Grüße\nOlha';
    expect(readLetterShape(noOpening, 1, 99).hasSalutation).toBe(false);
  });

  /**
   * A salutation is the start of a line. Matching anywhere let a "Hallo" mid-sentence cut the
   * body in half, and the letter was then refused for being too short.
   */
  it('does not treat a greeting inside a sentence as the opening', () => {
    const inside =
      'Sehr geehrte Frau Berg,\n\n' +
      'ich habe gestern Hallo gesagt, als ich im Büro war. Das war am Morgen. ' +
      'Dann habe ich gearbeitet. Um zehn war die Besprechung. ' +
      'Danach habe ich das Protokoll geschrieben. Vielen Dank.\n\n' +
      'Mit freundlichen Grüßen\nOlha';
    expect(readLetterShape(inside, 6, 8).bodySentences).toBe(6);
  });
});

/**
 * The ceiling that stops one submission costing what twenty should, scaled to the task.
 *
 * A flat 300 words refused a task that asked for fifteen sentences before it could be read.
 */
describe('the word ceiling', () => {
  it('stays at 300 for a short letter', () => {
    expect(wordCeiling(8)).toBe(300);
  });

  it('rises for a task that asks for more', () => {
    expect(wordCeiling(20)).toBe(600);
  });

  it('still refuses an essay sent to a short task', () => {
    const essay = Array.from({ length: 400 }, () => 'Wort').join(' ');
    expect(preCheckLetter(essay, 6, 8, false)).toMatchObject({
      ok: false,
      reason: 'too_long',
    });
  });
});

/**
 * Which criterion the code settles, now that it is no longer assumed to be the first.
 *
 * The cost of guessing wrong is a criterion marked on something it does not ask about: a rubric
 * opening with "Є речення з weil" had that verdict replaced by the sentence count, so a student
 * with a perfect weil sentence and a short letter lost the weil mark instead of the length one.
 */
describe('which criterion is settled by counting', () => {
  const LENGTH = 'У тілі листа 6–8 речень; є звертання і формула прощання';
  const WEIL = 'Є речення з weil, побудоване правильно';
  const DASS = 'Є речення з dass, побудоване правильно';

  it('finds it first in the module 4 letter', () => {
    expect(countedCriterionIndex([LENGTH, WEIL, DASS], 6, 8)).toBe(0);
  });

  it('finds it wherever its author put it', () => {
    expect(countedCriterionIndex([WEIL, DASS, LENGTH], 6, 8)).toBe(2);
  });

  /**
   * The false positive that made the first version of this useless: every grammar criterion in the
   * author's rubric says "Є речення з …", so matching the word for "sentence" matched them all.
   */
  it('does not mistake a criterion about a conjunction for one about length', () => {
    expect(countedCriterionIndex([WEIL, DASS], 6, 8)).toBeNull();
  });

  it('is not fooled by a number that is not the range', () => {
    expect(countedCriterionIndex(['Є 2 речення з weil', DASS], 6, 8)).toBeNull();
  });

  /** 8 must not be found inside 18, or a rubric quoting another figure would be picked. */
  it('reads the bounds as whole numbers', () => {
    expect(countedCriterionIndex(['Текст на 18 речень про роботу'], 6, 8)).toBeNull();
  });

  it('accepts a task that asks for one exact number of sentences', () => {
    expect(countedCriterionIndex(['Рівно 5 речень у тексті'], 5, 5)).toBe(0);
  });

  /** Spelled in words: nothing matches, and nothing is overwritten - the model judges it. */
  it('settles nothing when the range is written out in words', () => {
    expect(countedCriterionIndex(['У тілі листа від шести до восьми речень'], 6, 8)).toBeNull();
  });

  it('settles nothing for a rubric that never mentions length', () => {
    expect(
      countedCriterionIndex(['Відповідь по темі', 'Є два приклади з життя'], 4, 12),
    ).toBeNull();
  });
});
