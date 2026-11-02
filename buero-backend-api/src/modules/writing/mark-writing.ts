import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import {
  buildMarkedSchema,
  buildStudentBlock,
  buildTaskBlock,
  SCHREIBEN_SYSTEM_PROMPT,
  type MarkedWriting,
} from './rubric';

/**
 * Marking a piece of writing the way the author specified it.
 *
 * The marks come back one per criterion, and with them the corrections, the praise and the
 * summary - because a mark with no "what to fix" tells a student they lost a point and leaves
 * them to guess which words cost it. Her per-task note travels in the request, which is what
 * lets her write "в цьому уроці привітання не рахується" without anyone touching code.
 *
 * The total is added up here, from the marks, and never read out of anything the model wrote.
 */

/** Set in the environment so the model can be changed without a deploy. */
const MODEL = process.env.LLM_WRITING_MODEL ?? 'claude-opus-5-5';

/**
 * Five short verdicts, three corrections and two sentences. 500 is the author's figure and it
 * fits that comfortably - but see `thinkingFor`: on a model that thinks, thinking is billed as
 * output and counts against this, which is why the ceiling is checked rather than trusted.
 */
const MAX_OUTPUT_TOKENS = Number(process.env.LLM_WRITING_MAX_OUTPUT_TOKENS ?? 500);

/**
 * `low` on both models. Marking a short text against five stated criteria is judgement, not
 * reasoning at length, and the amendment asks for as little of it as the model allows.
 */
const EFFORT = (process.env.LLM_WRITING_EFFORT ?? 'low') as 'low' | 'medium' | 'high';

/**
 * Whether thinking can actually be turned off, which depends on the model.
 *
 * The spec asks for it off. Claude Sonnet 5.5 allows exactly that through `between_tools`, at
 * effort `high` or below. Claude Opus 5.5 does not: `{type: 'disabled'}` is refused with a 400 at
 * every effort level, so the most that can be done there is the lowest effort - and thinking
 * tokens then share the 500-token ceiling with the answer.
 *
 * That difference is the strongest argument for Sonnet on this job, ahead of its price: on Opus
 * the spec's own figure cannot be honoured.
 */
const thinkingFor = (model: string): Anthropic.ThinkingConfigParam | undefined =>
  model.startsWith('claude-sonnet-5-5') ? { type: 'between_tools' } : undefined;

export type MarkingTask = {
  task: string;
  criteria: readonly string[];
  checkerNote: string | null;
  sampleAnswer: string | null;
};

/** What the call consumed, kept per attempt so a month's spend can be reported honestly. */
export type Usage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
  /** Tokens written to the cache, billed at 1.25x. Only the first call of a prefix pays this. */
  cacheWriteTokens: number;
  /** Tokens served from the cache, billed at about a twentieth of the input price. */
  cacheReadTokens: number;
};

export type MarkResult = {
  /** Added up from the marks, so it cannot disagree with what the student is shown. */
  score: number;
  maxScore: number;
  marked: MarkedWriting;
  usage: Usage;
};

/** Thrown when the model's answer could not be read twice in a row. */
export class UnreadableMarkingError extends Error {}

/**
 * The author's length rules, applied to what came back rather than hoped for.
 *
 * A criterion that was awarded carries no comment: the student sees a tick, and a sentence
 * explaining why they got a point they already have is noise. Corrections are capped at three
 * for the same reason - a text handed back with ten is a text whose author reads none of them.
 */
const trim = (marked: MarkedWriting): MarkedWriting => ({
  criteria: marked.criteria.map((mark) =>
    mark.point === 1 ? { ...mark, comment: '' } : mark,
  ),
  corrections: marked.corrections.slice(0, 3),
  praise: marked.praise,
  summary: marked.summary,
});

export const markWriting = async (
  task: MarkingTask,
  text: string,
  client: Anthropic = new Anthropic(),
): Promise<MarkResult> => {
  const thinking = thinkingFor(MODEL);

  const ask = () =>
    client.messages.parse({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      ...(thinking ? { thinking } : {}),
      output_config: {
        effort: EFFORT,
        format: zodOutputFormat(buildMarkedSchema(task.criteria.length)),
      },
      /** Stable, and first: the cache is a prefix match, so order is the whole mechanism. */
      system: [{ type: 'text' as const, text: SCHREIBEN_SYSTEM_PROMPT }],
      messages: [
        {
          role: 'user' as const,
          content: [
            {
              type: 'text' as const,
              text: buildTaskBlock(task),
              /**
               * The breakpoint. Everything before it - the instruction and the whole task - is
               * cached together; the student's text after it is not. A second attempt at the
               * same task within a few minutes then pays almost nothing for the task half.
               */
              cache_control: { type: 'ephemeral' as const },
            },
            { type: 'text' as const, text: buildStudentBlock(text) },
          ],
        },
      ],
    });

  /**
   * One retry, then the student is told to come back in a minute and nothing is counted against
   * them. Two kinds of failure are treated the same way, because they look the same from here:
   * a reply that did not match the schema, and one cut off by the token ceiling. The second is
   * the reason the ceiling is checked at all - at 500 tokens a model that thinks can spend the
   * budget before it starts answering, and a truncated JSON is not a mark.
   */
  const unusable = (response: Awaited<ReturnType<typeof ask>>): boolean =>
    !response.parsed_output || response.stop_reason === 'max_tokens';

  let response = await ask();
  if (unusable(response)) {
    response = await ask();
  }
  if (unusable(response)) {
    throw new UnreadableMarkingError(
      response.stop_reason === 'max_tokens'
        ? `Відповідь не вмістилася у ${MAX_OUTPUT_TOKENS} токенів`
        : 'Модель двічі повернула відповідь, яку не вдалося розібрати за схемою',
    );
  }

  const marked = trim(response.parsed_output as MarkedWriting);

  return {
    score: marked.criteria.reduce((total, mark) => total + (mark.point === 1 ? 1 : 0), 0),
    maxScore: task.criteria.length,
    marked,
    usage: {
      model: MODEL,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheWriteTokens: response.usage.cache_creation_input_tokens ?? 0,
      cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
    },
  };
};
