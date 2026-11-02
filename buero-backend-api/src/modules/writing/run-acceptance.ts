/* eslint-disable no-console */
/**
 * Loaded explicitly: this runs as a standalone script, outside the Nest application that
 * normally reads `.env`, so without this the key in the file is invisible to it.
 */
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { ACCEPTANCE_LETTERS, type AcceptanceLetter } from './acceptance-letters';
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
import { MODULE_4_LETTER, type WritingTask } from './writing-task';

/**
 * The ten graded letters, run through the checker that is actually in service.
 *
 * This is the acceptance test of the *prompt*, not of the model: every mark in the table was
 * agreed by the teacher who wrote the rubric, so a disagreement means the rubric was translated
 * badly, or the rubric itself allows two readings. These ten are the only texts in the project
 * with marks the author stands behind, which makes them the one set that can say whether a
 * change of model changes the marking.
 *
 * It used to call `gradeLetter`, which no longer marks anything for a student - so a green run
 * proved the old prompt still worked and said nothing about the one in service. The free check
 * is the production one too, for the same reason.
 *
 * Kept out of the jest suite on purpose: it costs real money and needs a key, so it is run
 * deliberately rather than on every commit.
 *
 *   npx ts-node -P tsconfig.json src/modules/writing/run-acceptance.ts
 */

const RUN_MODEL = process.env.LLM_WRITING_MODEL ?? 'claude-opus-5-5';

const mark = (point: number) => (point === 1 ? '1' : '0');

const main = async (
  task: WritingTask = MODULE_4_LETTER,
  samples: readonly AcceptanceLetter[] = ACCEPTANCE_LETTERS,
) => {
  const client = new Anthropic();
  const maxScore = task.criteria.length;
  const totals = emptyTotals();
  const rows: MarkRow[] = [];
  const disagreements: string[] = [];
  let agreed = 0;
  let marked = 0;

  console.log(`\nМодель: ${RUN_MODEL}`);
  console.log(
    `\n${'лист'.padEnd(6)}${'очікувано'.padEnd(14)}${'отримано'.padEnd(14)}результат`,
  );
  console.log('-'.repeat(60));

  for (const sample of samples) {
    const expected = sample.expected.map(Number);

    const shape = readLetterShape(
      sample.letter,
      task.minSentences,
      task.maxSentences,
      requiresLetterShape(task.criteria),
    );
    /**
     * Length and language, but not the copy check.
     *
     * Seven of these ten letters were built by taking the model answer and breaking one thing in
     * it - L1 is the model answer word for word - so they overlap it by 0.82 to 1.00 and the copy
     * check turns them away before anything is marked. That is the check doing its job, and it
     * is tested on its own; what this run has to compare is the *marking*, and marking needs the
     * text to reach the model. So the copy check is given nothing to compare against here.
     */
    const refusal = screenSubmission({
      text: sample.letter,
      shape,
      minSentences: task.minSentences,
      previousTexts: [],
      sampleAnswer: null,
      task: '',
    });

    if (refusal) {
      /**
       * Turned away by the free check. The author expects exactly one letter here, and it is not
       * a disagreement - it is the cheap path working.
       */
      console.log(
        `${sample.id.padEnd(6)}${String(sample.expectedTotal).padEnd(14)}${'-'.padEnd(14)}` +
          `відсіяно кодом (${refusal.reason}), модель не викликалася`,
      );
      rows.push({
        id: sample.id,
        score: null,
        maxScore,
        refusedBy: refusal.reason,
        points: [],
        comments: {},
        expected,
      });
      continue;
    }

    const result = await markWriting(
      {
        task: task.task,
        criteria: task.criteria,
        checkerNote: null,
        sampleAnswer: task.modelAnswer ?? null,
      },
      sample.letter,
      client,
    );

    marked += 1;
    addUsage(totals, result.usage);

    /** Sorted by the criterion number, because the order of the marks is the model's choice. */
    const marks = result.marked.criteria.slice().sort((a, b) => a.n - b.n);
    const points = marks.map((m) => (m.point === 1 ? 1 : 0));
    const comments: Record<number, string> = {};
    for (const m of marks) if (m.point !== 1) comments[m.n] = m.comment;

    const wrong = expected
      .map((want, index) => (want === points[index] ? null : index + 1))
      .filter((n): n is number => n !== null);
    if (wrong.length === 0) agreed += 1;

    console.log(
      `${sample.id.padEnd(6)}` +
        `${`${sample.expectedTotal}/${maxScore} ${expected.map(mark).join('')}`.padEnd(14)}` +
        `${`${result.score}/${maxScore} ${points.map(mark).join('')}`.padEnd(14)}` +
        (wrong.length === 0 ? 'ok' : `розійшлися критерії: ${wrong.join(', ')}`),
    );

    rows.push({
      id: sample.id,
      score: result.score,
      maxScore,
      refusedBy: null,
      points,
      comments,
      expected,
    });

    for (const n of wrong) {
      disagreements.push(
        `${sample.id}, критерій ${n} - ${task.criteria[n - 1]}\n` +
          `   очікувано: ${expected[n - 1] === 1 ? 'зараховано' : 'не зараховано'}; ` +
          `модель: ${points[n - 1] === 1 ? 'зараховано' : 'не зараховано'}\n` +
          `   перевірник: ${comments[n] ?? '-'}`,
      );
    }
  }

  if (disagreements.length > 0) {
    console.log(`\n${'-'.repeat(60)}\nРозбіжності\n`);
    for (const line of disagreements) console.log(`${line}\n`);
  }

  console.log('-'.repeat(60));
  console.log(`збіглося з еталоном: ${agreed}/${marked} перевірених`);
  printCost(RUN_MODEL, totals);

  writeReport({
    model: RUN_MODEL,
    set: 'module-4-letters',
    totals,
    cost: costOf(RUN_MODEL, totals),
    rows,
  });
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
