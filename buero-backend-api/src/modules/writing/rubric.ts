import { z } from 'zod';

/**
 * Turning a task's rubric into a request the grader can answer.
 *
 * The criteria themselves belong to the material, not to this file — see `writing-task.ts`.
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
 * The instruction sent with every letter.
 *
 * Three things in it are deliberate, and each answers a way the grading went wrong on the
 * author's own sample letters:
 *
 *   - only the listed criteria count. A letter with a case or article mistake the rubric never
 *     asks about must keep its marks, or the check fails students for what they were not asked.
 *   - one correct sentence is enough. A second, broken attempt at the same conjunction does not
 *     take the mark away.
 *   - criterion 1 is not the model's to judge; it is counted in code and passed in, so the two
 *     cannot disagree about how many sentences a letter has.
 */
export const buildSystemPrompt = (): string =>
  [
    'Ви — викладач німецької мови, який перевіряє коротке письмове завдання рівня A2–B1 за',
    'наданою рубрикою. Студенти — дорослі, які вивчають німецьку для роботи та життя в Німеччині.',
    '',
    'Оцініть лист **виключно** за критеріями нижче. Кожен критерій — це один бал: виконано або ні.',
    '',
    'Правила, яких треба дотримуватись суворо:',
    '',
    '1. Помилки, про які рубрика не питає, бал НЕ знімають. Відмінки, артиклі, орфографія поза',
    '   das/dass, порядок слів у головному реченні поза правилом Verb-Verb — усе це ігнорується,',
    '   якщо текст лишається зрозумілим. Ви перевіряєте рубрику, а не всю німецьку мову.',
    '2. Для критеріїв 2, 3 і 4 достатньо ОДНОГО правильно побудованого речення з потрібним',
    '   сполучником. Якщо в листі є і правильне, і помилкове речення з тим самим сполучником —',
    '   бал ставиться.',
    '3. Критерій 1 вже перевірено підрахунком і передано вам у полі "criterion_1". Поверніть його',
    '   значення без змін і не рахуйте речення самостійно.',
    '4. Критерій 5 поєднує дві вимоги навмисно. Якщо слів das або dass у листі немає, помилки',
    '   немає — бал ставиться.',
    '',
    'Для кожного критерію поверніть met (true/false) і note — одне-два речення українською,',
    'звернені до студента. У note цитуйте те речення листа, якого стосується висновок. Пишіть',
    'note і тоді, коли бал зараховано: студент має розуміти, що саме зарахувало бал.',
  ].join('\n');

export const buildUserPrompt = (
  criteria: readonly string[],
  letter: string,
  criterionOneMet: boolean,
  bodySentences: number,
): string =>
  [
    'Критерії:',
    ...criteria.map((text, index) => `${index + 1}. ${text}`),
    '',
    `criterion_1: ${criterionOneMet} (у тілі листа ${bodySentences} речень — підраховано кодом)`,
    '',
    'Лист студента:',
    '"""',
    letter.trim(),
    '"""',
  ].join('\n');
