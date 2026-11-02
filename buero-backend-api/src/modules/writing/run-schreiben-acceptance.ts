/* eslint-disable no-console */
/**
 * Loaded explicitly: this runs as a standalone script, outside the Nest application that
 * normally reads `.env`, so without this the key in the file is invisible to it.
 */
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { parseQuestionCsv } from '../exercises/import/parse-question-csv';
import { markWriting } from './mark-writing';
import { parseWritingTask } from './writing-task';
import { preCheckLetter, requiresLetterShape } from './letter-shape';

/**
 * Checklist item 4 of the author's spec, run for real.
 *
 * "Зразкова відповідь кожного завдання, надіслана як текст студента, отримує максимум балів."
 * Every one of her 53 full-marks answers goes through the real marking path, and anything short
 * of 5/5 is a disagreement between the instruction and the rubric that wrote it - not a student's
 * mistake. The run prints which criterion disagreed and what the checker said about it, because
 * that sentence is what tells you whether the rubric or the instruction needs the edit.
 *
 * It is kept out of the jest suite on purpose: it costs real money and needs a key, so it is run
 * deliberately rather than on every commit.
 *
 *   npx ts-node -P tsconfig.json src/modules/writing/run-schreiben-acceptance.ts
 *   npx ts-node -P tsconfig.json src/modules/writing/run-schreiben-acceptance.ts 1 2
 *
 * A trailing list of module numbers runs only those files.
 */

const DIR = join(__dirname, '../../../test/fixtures/schreiben');

/** Per-million-token rates, so the cost printed at the end is the cost of the run that happened. */
const PRICES: Record<string, { in: number; out: number }> = {
  'claude-opus-5-5': { in: 4, out: 20 },
  'claude-opus-5': { in: 5, out: 25 },
  'claude-sonnet-5-5': { in: 2, out: 10 },
  'claude-haiku-5-5': { in: 0.1, out: 0.5 },
};

const RUN_MODEL = process.env.LLM_WRITING_MODEL ?? 'claude-opus-5-5';
const PRICE = PRICES[RUN_MODEL] ?? PRICES['claude-opus-5-5'];

/** The German half of the author's answer; the Ukrainian translation below it is not the text. */
const germanOnly = (sample: string): string => sample.split(/\n\s*Переклад:/)[0].trim();

const main = async () => {
  const only = process.argv.slice(2);
  const files = readdirSync(DIR)
    .filter((name) => name.endsWith('.csv'))
    .filter((name) => only.length === 0 || only.some((n) => name.includes(`Modul-${n}-`)))
    .sort();

  if (files.length === 0) {
    console.error(`Не знайшов файлів у ${DIR}`);
    process.exitCode = 1;
    return;
  }

  const client = new Anthropic();
  let inputTokens = 0;
  let outputTokens = 0;
  let full = 0;
  let checked = 0;
  const disagreements: string[] = [];

  console.log(`\nМодель: ${RUN_MODEL}`);
  console.log(`Файлів: ${files.length}\n`);
  console.log(`${'завдання'.padEnd(12)}${'бал'.padEnd(8)}результат`);
  console.log('-'.repeat(60));

  for (const file of files) {
    const { elements } = parseQuestionCsv(readFileSync(join(DIR, file), 'utf8'));

    for (const element of elements) {
      const task = parseWritingTask({
        task: element.body || element.title,
        minSentences: element.minSentences,
        maxSentences: element.maxSentences,
        criteria: element.criteria,
        ...(element.sampleAnswer && { modelAnswer: element.sampleAnswer }),
      });
      const text = germanOnly(String(element.sampleAnswer ?? ''));

      /** The free check first, exactly as a student's submission meets it. */
      const pre = preCheckLetter(
        text,
        task.minSentences,
        task.maxSentences,
        requiresLetterShape(task.criteria),
      );
      if (!pre.ok) {
        console.log(
          `${element.id.padEnd(12)}${'-'.padEnd(8)}відсіяно кодом (${pre.reason}), модель не викликалася`,
        );
        disagreements.push(`${element.id} - власний зразок відсіяно кодом: ${pre.reason}`);
        continue;
      }

      const result = await markWriting(
        {
          task: task.task,
          criteria: task.criteria,
          checkerNote: element.checkerNote,
          sampleAnswer: element.sampleAnswer,
        },
        text,
        client,
      );

      checked += 1;
      inputTokens += result.usage.inputTokens;
      outputTokens += result.usage.outputTokens;

      const lost = result.marked.criteria.filter((mark) => mark.point !== 1);
      if (lost.length === 0) full += 1;

      console.log(
        `${element.id.padEnd(12)}${`${result.score}/${result.maxScore}`.padEnd(8)}` +
          (lost.length === 0 ? 'ok' : `розійшлися критерії: ${lost.map((m) => m.n).join(', ')}`),
      );

      for (const mark of lost) {
        disagreements.push(
          `${element.id}, критерій ${mark.n} - ${task.criteria[mark.n - 1] ?? '?'}\n` +
            `   перевірник: ${mark.comment}`,
        );
      }
    }
  }

  if (disagreements.length > 0) {
    console.log(`\n${'-'.repeat(60)}\nРозбіжності\n`);
    for (const line of disagreements) console.log(`${line}\n`);
  }

  console.log(`${'-'.repeat(60)}`);
  console.log(`повний бал: ${full}/${checked} перевірених`);
  if (inputTokens > 0) {
    const cost =
      (inputTokens / 1e6) * PRICE.in + (outputTokens / 1e6) * PRICE.out;
    console.log(
      `токенів: ${inputTokens} вхідних, ${outputTokens} вихідних ` +
        `(у середньому ${Math.round(inputTokens / checked)}/${Math.round(outputTokens / checked)} на завдання)`,
    );
    console.log(`витрачено приблизно $${cost.toFixed(3)}`);
  }
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
