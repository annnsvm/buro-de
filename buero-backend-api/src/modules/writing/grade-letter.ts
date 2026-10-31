import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import {
  countedCriterionIndex,
  preCheckLetter,
  requiresLetterShape,
  type PreCheck,
} from './letter-shape';
import {
  buildAssessmentSchema,
  buildSystemPrompt,
  buildUserPrompt,
  type WritingAssessment,
} from './rubric';
import type { WritingTask } from './writing-task';

/**
 * Grading one letter against the rubric.
 *
 * The free check runs first and can end the matter without a paid call: a letter that is too
 * short, or has no salutation or closing, comes back asking for more rather than graded. That is
 * both kinder and cheaper - the student is not charged an attempt for something the form could
 * have told them.
 */

/** Set in the environment so the model can be changed without a deploy. */
const MODEL = process.env.LLM_WRITING_MODEL ?? 'claude-opus-5';

/**
 * The reply is six short verdicts against a fixed schema, so there is no reason to let it run
 * long - a ceiling here is the last defence against a runaway bill on a single call.
 */
const MAX_OUTPUT_TOKENS = Number(process.env.LLM_WRITING_MAX_OUTPUT_TOKENS ?? 2000);

/**
 * Grading a short letter against six stated criteria is judgement, not reasoning at length.
 * `medium` is where that lands; `high` costs more for the same verdicts on the author's samples.
 */
const EFFORT = (process.env.LLM_WRITING_EFFORT ?? 'medium') as
  | 'low'
  | 'medium'
  | 'high';

/** What the call consumed, so a caller can meter spend and trip the monthly breaker. */
export type Usage = { inputTokens: number; outputTokens: number };

export type GradeResult =
  | {
      status: 'graded';
      score: number;
      assessment: WritingAssessment;
      /** False when the free check settled it, so the caller knows whether to count an attempt. */
      calledModel: true;
      usage: Usage;
    }
  | {
      status: 'rejected';
      reason: Extract<PreCheck, { ok: false }>['reason'];
      /** Nothing was spent and nothing is counted against the student. */
      calledModel: false;
    };

export const gradeLetter = async (
  task: WritingTask,
  letter: string,
  client: Anthropic = new Anthropic(),
): Promise<GradeResult> => {
  /**
   * Both of these are read off the rubric, because the rubric is the specification.
   *
   * They were assumptions before: that every task is a letter, and that its first criterion is
   * the one about length. Both hold for the module 4 letter and for nothing else, so a task
   * asking for a description was refused for having no "Sehr geehrte Frau …", and a rubric that
   * happened to put length second had the wrong criterion overwritten.
   */
  const letterShape = requiresLetterShape(task.criteria);
  const counted = countedCriterionIndex(
    task.criteria,
    task.minSentences,
    task.maxSentences,
  );
  const countedNumber = counted === null ? null : counted + 1;

  const pre = preCheckLetter(
    letter,
    task.minSentences,
    task.maxSentences,
    letterShape,
  );
  if (!pre.ok) {
    return { status: 'rejected', reason: pre.reason, calledModel: false };
  }

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    output_config: {
      effort: EFFORT,
      format: zodOutputFormat(buildAssessmentSchema(task.criteria.length)),
    },
    system: buildSystemPrompt(countedNumber),
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(
          task.criteria,
          letter,
          pre.shape.meetsCriterionOne,
          pre.shape.bodySentences,
          countedNumber,
        ),
      },
    ],
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error('Модель повернула відповідь, яку не вдалося розібрати за схемою');
  }

  /**
   * The counted criterion is overwritten with what was counted, not with what came back. The
   * model is told to echo it, but a grade that gates the next module should not depend on it
   * having obeyed.
   *
   * When the rubric has no such criterion nothing is replaced: every verdict is then the model's,
   * and substituting a sentence count for a criterion about something else would mark the student
   * on a rule their rubric does not contain.
   */
  const criteria =
    countedNumber === null
      ? parsed.criteria
      : parsed.criteria.map((verdict) =>
          verdict.id === countedNumber
            ? { ...verdict, met: pre.shape.meetsCriterionOne }
            : verdict,
        );

  return {
    status: 'graded',
    score: criteria.filter((verdict) => verdict.met).length,
    assessment: { criteria },
    calledModel: true,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  };
};
