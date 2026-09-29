"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_4_LETTER = exports.parseWritingTask = exports.InvalidWritingTaskError = exports.writingTask = void 0;
const zod_1 = require("zod");
exports.writingTask = zod_1.z.object({
    task: zod_1.z.string().min(1),
    minSentences: zod_1.z.number().int().min(1),
    maxSentences: zod_1.z.number().int().min(1),
    criteria: zod_1.z.array(zod_1.z.string().min(1)).min(2).max(10),
    modelAnswer: zod_1.z.string().optional(),
});
class InvalidWritingTaskError extends Error {
}
exports.InvalidWritingTaskError = InvalidWritingTaskError;
const parseWritingTask = (content) => {
    const parsed = exports.writingTask.safeParse(content);
    if (!parsed.success) {
        throw new InvalidWritingTaskError('Матеріал не містить коректного письмового завдання: ' +
            parsed.error.issues.map((issue) => issue.path.join('.') || 'content').join(', '));
    }
    if (parsed.data.minSentences > parsed.data.maxSentences) {
        throw new InvalidWritingTaskError('Мінімальна кількість речень більша за максимальну');
    }
    return parsed.data;
};
exports.parseWritingTask = parseWritingTask;
exports.MODULE_4_LETTER = {
    task: 'Ви захворіли. На 10:00 у вас була нарада, яку тепер треба скасувати або перенести. ' +
        'Напишіть листа керівникові — 6–8 речень у тілі листа (Betreff, звертання та формула ' +
        'прощання не рахуються).',
    minSentences: 6,
    maxSentences: 8,
    modelAnswer: 'Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\n' +
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
//# sourceMappingURL=writing-task.js.map