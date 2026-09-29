"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserPrompt = exports.buildSystemPrompt = exports.writingAssessment = exports.buildAssessmentSchema = exports.criterionVerdict = void 0;
const zod_1 = require("zod");
exports.criterionVerdict = zod_1.z.object({
    id: zod_1.z.number().int().min(1),
    met: zod_1.z.boolean(),
    note: zod_1.z.string(),
});
const buildAssessmentSchema = (criteriaCount) => zod_1.z.object({
    criteria: zod_1.z.array(exports.criterionVerdict).length(criteriaCount),
});
exports.buildAssessmentSchema = buildAssessmentSchema;
exports.writingAssessment = zod_1.z.object({
    criteria: zod_1.z.array(exports.criterionVerdict),
});
const buildSystemPrompt = () => [
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
exports.buildSystemPrompt = buildSystemPrompt;
const buildUserPrompt = (criteria, letter, criterionOneMet, bodySentences) => [
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
exports.buildUserPrompt = buildUserPrompt;
//# sourceMappingURL=rubric.js.map