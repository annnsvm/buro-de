import { z } from 'zod';

/**
 * Turning a task's rubric into a request the grader can answer.
 *
 * The criteria themselves belong to the material, not to this file - see `writing-task.ts`.
 * They travel word for word: the same sentences are shown to the student, sent to the grader
 * and used to explain the mark, so a student can never lose a point against wording they were
 * not given.
 */
/**
 * One verdict per criterion, with a sentence of explanation the student actually reads.
 *
 * The note is required even when the mark is given: "why it counted" is as much of the lesson as
 * "why it did not", and a student who passed on a technicality should know which sentence
 * carried them.
 */
export const criterionVerdict = z.object({
  id: z.number().int().min(1),
  met: z.boolean(),
  /** In Ukrainian, addressed to the student, quoting the sentence it is about. */
  note: z.string(),
});

/** Built per task, because the number of criteria is the author's to decide. */
export const buildAssessmentSchema = (criteriaCount: number) =>
  z.object({
    criteria: z.array(criterionVerdict).length(criteriaCount),
  });

export const writingAssessment = z.object({
  criteria: z.array(criterionVerdict),
});

export type WritingAssessment = z.infer<typeof writingAssessment>;

/**
 * The instruction sent with every text.
 *
 * Everything specific to one task lives in the task's own rubric, not here. This file used to
 * name criteria by number - "для критеріїв 2, 3 і 4 достатньо одного речення", "критерій 5
 * поєднує дві вимоги" - and to carve out das/dass by name. That was written while the module 4
 * letter was the only writing task there was, and it is wrong for every other one: a rubric
 * about a forum post was told rules about criteria it does not have, and about a grammar point
 * it never mentions.
 *
 * What is left is general, and each rule still answers the way grading went wrong on the
 * author's own samples:
 *
 *   - only the listed criteria count, so a mistake the rubric never asks about keeps its marks;
 *   - a criterion asking whether something is present is earned once, so a second broken attempt
 *     at the same thing does not take the mark away - but a criterion asking that a mistake be
 *     absent is lost to every such mistake;
 *   - a criterion is read with all its own conditions, including any "if it is not there, there
 *     is no mistake" the author wrote into it;
 *   - the counted criterion is not the model's to judge. It is settled in code and passed in, so
 *     the two cannot disagree about how many sentences a text has.
 */
export const buildSystemPrompt = (
  /**
   * Which criterion was settled by counting, 1-based, or null when the rubric has none - then
   * nothing is pre-decided and every criterion is judged.
   */
  countedCriterion: number | null = null,
): string =>
  [
    'Ви - викладач німецької мови, який перевіряє коротке письмове завдання рівня A2–B1 за',
    'наданою рубрикою. Студенти - дорослі, які вивчають німецьку для роботи та життя в Німеччині.',
    '',
    'Оцініть текст **виключно** за критеріями нижче. Кожен критерій - це один бал: виконано або ні.',
    '',
    'Правила, яких треба дотримуватись суворо:',
    '',
    '1. Рубрика - це повний перелік того, що перевіряється. Помилка, про яку жоден критерій не',
    '   питає, бал НЕ знімає: відмінки, артиклі, орфографія, порядок слів, стиль - усе це',
    '   ігнорується, якщо текст лишається зрозумілим. Ви перевіряєте рубрику, а не всю німецьку',
    '   мову.',
    '2. Якщо критерій питає, чи Є в тексті певна конструкція або певний зміст, достатньо ОДНОГО',
    '   правильного приклада. Друга, помилкова спроба того самого бал не знімає. Якщо ж критерій',
    '   вимагає, щоб помилки не було («X та Y не переплутані», «немає різких фраз»), то бал знімає',
    '   кожна така помилка.',
    '3. Читайте критерій буквально й разом з усіма його умовами. Якщо критерій сам каже, коли бал',
    '   ставиться - наприклад «якщо такого слова в тексті немає, помилки теж немає» - це частина',
    '   правила, а не виняток із нього.',
    '4. Критерій може поєднувати кілька вимог. Тоді бал ставиться лише тоді, коли виконані всі',
    '   вимоги цього критерію.',
    ...(countedCriterion === null
      ? []
      : [
          `5. Критерій ${countedCriterion} (довжина) вже перевірено підрахунком і передано вам у`,
          `   полі "criterion_${countedCriterion}". Поверніть його значення без змін і не рахуйте`,
          '   речення самостійно.',
        ]),
    '',
    'Для кожного критерію поверніть met (true/false) і note - одне-два речення українською,',
    'звернені до студента. У note цитуйте те речення тексту, якого стосується висновок. Пишіть',
    'note і тоді, коли бал зараховано: студент має розуміти, що саме зарахувало бал.',
  ].join('\n');

export const buildUserPrompt = (
  criteria: readonly string[],
  letter: string,
  countedCriterionMet: boolean,
  bodySentences: number,
  /** 1-based, matching `buildSystemPrompt`; null leaves the line out entirely. */
  countedCriterion: number | null = 1,
): string =>
  [
    'Критерії:',
    ...criteria.map((text, index) => `${index + 1}. ${text}`),
    '',
    ...(countedCriterion === null
      ? []
      : [
          `criterion_${countedCriterion}: ${countedCriterionMet} ` +
            `(у тілі тексту ${bodySentences} речень - підраховано кодом)`,
          '',
        ]),
    'Текст студента:',
    '"""',
    letter.trim(),
    '"""',
  ].join('\n');
