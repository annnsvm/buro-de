/* eslint-disable no-console */
/**
 * Loaded explicitly: this runs as a standalone script, outside the Nest application that
 * normally reads `.env`, so without this the key in the file is invisible to it.
 */
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { ACCEPTANCE_LETTERS, type AcceptanceLetter } from './acceptance-letters';
import { gradeLetter } from './grade-letter';
import { MODULE_4_LETTER, type WritingTask } from './writing-task';

/**
 * Runs the ten graded letters through the checker and prints where it disagrees with the author.
 *
 * This is the acceptance test of the *prompt*, not of the model: every mark in the table was
 * agreed by the teacher who wrote the rubric, so a disagreement means the rubric was translated
 * badly, or the rubric itself allows two readings. It is kept out of the jest suite on purpose -
 * it costs real money and needs a key, so it is run deliberately rather than on every commit.
 *
 *   ANTHROPIC_API_KEY=... npx ts-node -P tsconfig.json src/modules/writing/run-acceptance.ts
 */

/**
 * Per-million-token rates, so the cost printed at the end is the cost of the run that just
 * happened. Quoting one model's prices while another was called made the number wrong in the
 * one place it is read. Roughly 1000 tokens in and 400 out per letter, plus thinking, which is
 * billed as output.
 */
const PRICES: Record<string, { in: number; out: number }> = {
  'claude-opus-5-5': { in: 4, out: 20 },
  'claude-opus-5': { in: 5, out: 25 },
  'claude-sonnet-5-5': { in: 2, out: 10 },
  'claude-haiku-5-5': { in: 0.1, out: 0.5 },
};

const RUN_MODEL = process.env.LLM_WRITING_MODEL ?? 'claude-opus-5';
const { in: PRICE_PER_MTOK_IN, out: PRICE_PER_MTOK_OUT } =
  PRICES[RUN_MODEL] ?? PRICES['claude-opus-5-5'];

const mark = (met: boolean) => (met ? '1' : '0');

/**
 * Takes the task and the set rather than reaching for the module 4 letter.
 *
 * The run printed "/6" as a literal, which is that letter's number of criteria and nothing else.
 * A second task - a description, a forum post - has its own rubric of its own length, and the
 * whole point of checking one is that the instruction is no longer written for a letter.
 */
const main = async (
  task: WritingTask = MODULE_4_LETTER,
  samples: readonly AcceptanceLetter[] = ACCEPTANCE_LETTERS,
) => {
  const client = new Anthropic();
  const maxScore = task.criteria.length;
  let inputTokens = 0;
  let outputTokens = 0;
  const disagreements: string[] = [];

  console.log(`\nМодель: ${RUN_MODEL}`);
  console.log(
    `\n${'лист'.padEnd(5)}${'очікувано'.padEnd(12)}${'отримано'.padEnd(12)}результат`,
  );
  console.log('─'.repeat(52));

  for (const sample of samples) {
    const result = await gradeLetter(task, sample.letter, client);

    if (result.status === 'rejected') {
      /**
       * Turned away by the free check. The author expects exactly one letter here, and it is not
       * a disagreement - it is the cheap path working.
       */
      console.log(
        `${sample.id.padEnd(5)}${String(sample.expectedTotal).padEnd(12)}${'-'.padEnd(12)}` +
          `відсіяно кодом (${result.reason}), модель не викликалася`,
      );
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
      .filter((id): id is number => id !== null);

    console.log(
      `${sample.id.padEnd(5)}` +
        `${`${sample.expectedTotal}/${maxScore} ${expected.map(mark).join('')}`.padEnd(12)}` +
        `${`${result.score}/${maxScore} ${got.map(mark).join('')}`.padEnd(12)}` +
        (wrong.length === 0 ? '✓' : `✗ розійшлися критерії: ${wrong.join(', ')}`),
    );

    for (const id of wrong) {
      const verdict = result.assessment.criteria.find((item) => item.id === id);
      disagreements.push(
        `${sample.id}, критерій ${id} - ${task.criteria[id - 1]}\n` +
          `   очікувано: ${expected[id - 1] ? 'зараховано' : 'не зараховано'}; ` +
          `модель: ${got[id - 1] ? 'зараховано' : 'не зараховано'}\n` +
          `   пояснення моделі: ${verdict?.note ?? '-'}`,
      );
    }
  }

  if (disagreements.length > 0) {
    console.log(`\n${'─'.repeat(52)}\nРозбіжності\n`);
    for (const line of disagreements) console.log(`${line}\n`);
  } else {
    console.log('\nУсі оцінки збіглися з еталоном.');
  }

  const cost =
    (inputTokens / 1e6) * PRICE_PER_MTOK_IN +
    (outputTokens / 1e6) * PRICE_PER_MTOK_OUT;
  if (inputTokens > 0) {
    console.log(`\nВитрачено приблизно $${cost.toFixed(3)}`);
  }
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
