import { z } from 'zod';

/**
 * A writing task as its author wrote it, stored on the material.
 *
 * The rubric lives here rather than in code because every module brings its own. Module 4 asks
 * for weil, dass and wenn; module 5 will ask for something else, and that must not be a code
 * change. The criteria are the teacher's own sentences: they are shown to the student, sent to
 * the grader, and used to explain the mark, so all three read the same words.
 */
export const writingTask = z.object({
  /** What the student is asked to write, in their own language. */
  task: z.string().min(1),
  /**
   * The length the body must fall within. Criterion 1 is settled against these by counting,
   * never by the grader — a mark that gates the next module should not rest on the model having
   * counted sentences correctly.
   */
  minSentences: z.number().int().min(1),
  maxSentences: z.number().int().min(1),
  /**
   * One sentence per criterion, in the author's order. The first is the length-and-formulas
   * criterion decided by counting; the rest are judged.
   */
  criteria: z.array(z.string().min(1)).min(2).max(10),
  /**
   * A full-mark answer, shown when the monthly breaker has tripped: the student reads it and
   * marks themselves against the criteria, the way the speaking task already works. Without one
   * the breaker would have nothing to degrade to, and the task would simply break.
   */
  modelAnswer: z.string().optional(),
});

export type WritingTask = z.infer<typeof writingTask>;

/** Thrown rather than returned: a malformed task is an authoring mistake, not a student's. */
export class InvalidWritingTaskError extends Error {}

export const parseWritingTask = (content: unknown): WritingTask => {
  const parsed = writingTask.safeParse(content);
  if (!parsed.success) {
    throw new InvalidWritingTaskError(
      'Матеріал не містить коректного письмового завдання: ' +
        parsed.error.issues.map((issue) => issue.path.join('.') || 'content').join(', '),
    );
  }
  if (parsed.data.minSentences > parsed.data.maxSentences) {
    throw new InvalidWritingTaskError(
      'Мінімальна кількість речень більша за максимальну',
    );
  }
  return parsed.data;
};

/** The module 4 letter, as authored — the shape a teacher fills in. */
export const MODULE_4_LETTER: WritingTask = {
  task:
    'Ви захворіли. На 10:00 у вас була нарада, яку тепер треба скасувати або перенести. ' +
    'Напишіть листа керівникові — 6–8 речень у тілі листа (Betreff, звертання та формула ' +
    'прощання не рахуються).',
  minSentences: 6,
  maxSentences: 8,
  modelAnswer:
    'Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\n' +
    'ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. ' +
    'Die Besprechung um zehn muss ich leider absagen. Das tut mir sehr leid. ' +
    'Ich gehe heute zum Arzt. Ich hoffe, dass ich am Mittwoch wieder gesund bin. ' +
    'Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid. ' +
    'Vielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko',
  criteria: [
    'У тілі листа 6–8 речень; є звертання (Sehr geehrte/r …) і формула прощання ' +
      '(Mit freundlichen Grüßen тощо)',
    'Є речення з weil, побудоване правильно: у підрядному реченні дієслово стоїть у кінці; ' +
      'якщо підрядне стоїть на початку, головне речення починається з дієслова (Verb, Verb)',
    'Є речення з dass, побудоване правильно за тим самим правилом',
    'Є речення з wenn, побудоване правильно за тим самим правилом',
    'Є речення про нараду (absagen / verschieben), і das та dass не переплутані. ' +
      'Якщо у листі немає одного з цих слів, помилки теж немає, тож бал ставиться',
    'Текст зрозумілий і ввічливий: є хоча б одна формула ввічливості ' +
      '(leider, Es tut mir leid, Das tut mir leid, Vielen Dank, bitte) і немає різких чи ' +
      'зневажливих фраз (Das ist alles. Mehr kann ich nicht machen. Das ist jetzt so.)',
  ],
};
