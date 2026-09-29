"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const acceptance_letters_1 = require("./acceptance-letters");
const grade_letter_1 = require("./grade-letter");
const writing_task_1 = require("./writing-task");
const PRICE_PER_MTOK_IN = 5;
const PRICE_PER_MTOK_OUT = 25;
const mark = (met) => (met ? '1' : '0');
const main = async () => {
    var _a;
    const client = new sdk_1.default();
    let inputTokens = 0;
    let outputTokens = 0;
    const disagreements = [];
    console.log(`\n${'лист'.padEnd(5)}${'очікувано'.padEnd(12)}${'отримано'.padEnd(12)}результат`);
    console.log('─'.repeat(52));
    for (const sample of acceptance_letters_1.ACCEPTANCE_LETTERS) {
        const result = await (0, grade_letter_1.gradeLetter)(writing_task_1.MODULE_4_LETTER, sample.letter, client);
        if (result.status === 'rejected') {
            console.log(`${sample.id.padEnd(5)}${String(sample.expectedTotal).padEnd(12)}${'—'.padEnd(12)}` +
                `відсіяно кодом (${result.reason}), модель не викликалася`);
            continue;
        }
        inputTokens += result.usage.inputTokens;
        outputTokens += result.usage.outputTokens;
        const got = result.assessment.criteria
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((verdict) => verdict.met);
        const expected = sample.expected.map((value) => value === 1);
        const wrong = expected
            .map((want, index) => (want === got[index] ? null : index + 1))
            .filter((id) => id !== null);
        console.log(`${sample.id.padEnd(5)}` +
            `${`${sample.expectedTotal}/6 ${expected.map(mark).join('')}`.padEnd(12)}` +
            `${`${result.score}/6 ${got.map(mark).join('')}`.padEnd(12)}` +
            (wrong.length === 0 ? '✓' : `✗ розійшлися критерії: ${wrong.join(', ')}`));
        for (const id of wrong) {
            const verdict = result.assessment.criteria.find((item) => item.id === id);
            disagreements.push(`${sample.id} · критерій ${id} — ${writing_task_1.MODULE_4_LETTER.criteria[id - 1]}\n` +
                `   очікувано: ${expected[id - 1] ? 'зараховано' : 'не зараховано'}; ` +
                `модель: ${got[id - 1] ? 'зараховано' : 'не зараховано'}\n` +
                `   пояснення моделі: ${(_a = verdict === null || verdict === void 0 ? void 0 : verdict.note) !== null && _a !== void 0 ? _a : '—'}`);
        }
    }
    if (disagreements.length > 0) {
        console.log(`\n${'─'.repeat(52)}\nРозбіжності\n`);
        for (const line of disagreements)
            console.log(`${line}\n`);
    }
    else {
        console.log('\nУсі оцінки збіглися з еталоном.');
    }
    const cost = (inputTokens / 1e6) * PRICE_PER_MTOK_IN +
        (outputTokens / 1e6) * PRICE_PER_MTOK_OUT;
    if (inputTokens > 0) {
        console.log(`\nВитрачено приблизно $${cost.toFixed(3)}`);
    }
};
void main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
//# sourceMappingURL=run-acceptance.js.map