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
import { readLetterShape, requiresLetterShape } from './letter-shape';
import { markWriting } from './mark-writing';
import {
  addUsage,
  costOf,
  emptyTotals,
  printCost,
  writeReport,
  type MarkRow,
} from './run-report';
import { screenSubmission } from './screen-submission';
import { parseWritingTask } from './writing-task';

/**
 * Checklist item 4 of the author's spec, run for real.
 *
 * "Зразкова відповідь кожного завдання, надіслана як текст студента, отримує максимум балів."
 * Every one of her 53 full-marks answers goes through the real marking path, and anything short
 * of full marks is a disagreement between the instruction and the rubric that wrote it - not a
 * student's mistake. The run prints which criterion disagreed and what the checker said about
 * it, because that sentence is what tells you whether the rubric or the instruction needs the
 * edit.
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

const RUN_MODEL = process.env.LLM_WRITING_MODEL ?? 'claude-opus-5-5';

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
  const totals = emptyTotals();
  const rows: MarkRow[] = [];
  const disagreements: string[] = [];
  let full = 0;
  let checked = 0;

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

      /**
       * The free check first, exactly as a student's submission meets it - with one check out of
       * reach. The text here *is* the model answer, so the copy check would turn every one of
       * the 53 away; it is left out by passing no sample to compare against, and the length and
       * language checks run as they do in service.
       */
      const shape = readLetterShape(
        text,
        task.minSentences,
        task.maxSentences,
        requiresLetterShape(task.criteria),
      );
      const refusal = screenSubmission({
        text,
        shape,
        minSentences: task.minSentences,
        previousTexts: [],
        sampleAnswer: null,
        task: '',
      });
      if (refusal) {
        console.log(
          `${element.id.padEnd(12)}${'-'.padEnd(8)}відсіяно кодом (${refusal.reason}), модель не викликалася`,
        );
        disagreements.push(`${element.id} - власний зразок відсіяно кодом: ${refusal.reason}`);
        rows.push({
          id: element.id,
          score: null,
          maxScore: task.criteria.length,
          refusedBy: refusal.reason,
          points: [],
          comments: {},
          expected: null,
        });
        continue;
      }

      /**
       * The sample is withheld from the checker here, and only here.
       *
       * Rule 6 of the instruction says a text copied from the task or the sample scores zero on
       * every criterion. In this set the student's text *is* the sample, so a checker that obeys
       * that rule - Claude Opus 5.5 does, Sonnet 5.5 does not - would score all 53 at zero and
       * the run would measure nothing but rule 6.
       *
       * Withholding it puts the checker in the position it is in for a real student, whose text
       * is never a copy: the code refuses those before the model is called. It is a departure
       * from the live request, and the only one that lets this set say anything about marking.
       */
      const result = await markWriting(
        {
          task: task.task,
          criteria: task.criteria,
          checkerNote: element.checkerNote,
          sampleAnswer: null,
        },
        text,
        client,
      );

      checked += 1;
      addUsage(totals, result.usage);

      const marks = result.marked.criteria.slice().sort((a, b) => a.n - b.n);
      const lost = marks.filter((m) => m.point !== 1);
      if (lost.length === 0) full += 1;

      const comments: Record<number, string> = {};
      for (const m of lost) comments[m.n] = m.comment;

      console.log(
        `${element.id.padEnd(12)}${`${result.score}/${result.maxScore}`.padEnd(8)}` +
          (lost.length === 0 ? 'ok' : `розійшлися критерії: ${lost.map((m) => m.n).join(', ')}`),
      );

      rows.push({
        id: element.id,
        score: result.score,
        maxScore: result.maxScore,
        refusedBy: null,
        points: marks.map((m) => (m.point === 1 ? 1 : 0)),
        comments,
        /** The author's own mark for her own answer: full marks, by the terms of the spec. */
        expected: marks.map(() => 1),
      });

      for (const m of lost) {
        disagreements.push(
          `${element.id}, критерій ${m.n} - ${task.criteria[m.n - 1] ?? '?'}\n` +
            `   перевірник: ${m.comment}`,
        );
      }
    }
  }

  if (disagreements.length > 0) {
    console.log(`\n${'-'.repeat(60)}\nРозбіжності\n`);
    for (const line of disagreements) console.log(`${line}\n`);
  }

  console.log('-'.repeat(60));
  console.log(`повний бал: ${full}/${checked} перевірених`);
  printCost(RUN_MODEL, totals);

  writeReport({
    model: RUN_MODEL,
    set: 'schreiben-samples',
    totals,
    cost: costOf(RUN_MODEL, totals),
    rows,
  });
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
