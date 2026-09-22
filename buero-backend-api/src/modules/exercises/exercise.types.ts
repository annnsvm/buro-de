import type { QuestionType } from '../../generated/prisma/enums';
import type { AnswerMatchQuality } from './normalize-german';

/** The answer a browser may submit. Choice questions send ids, written ones send text. */
export type RawAnswer = string | string[];

export type GradeResult = {
  correct: boolean;
  /**
   * Why it counted, so the interface can say "right, but mind the capital letter"
   * instead of a bare tick. Choice questions are always exact or none.
   */
  quality: AnswerMatchQuality;
};

/** The part of a question an exercise definition is allowed to look at. */
export type GradableQuestion = {
  id: string;
  type: QuestionType;
  payload: unknown;
  acceptedAnswers: string[];
};

/**
 * Everything type-specific about one kind of exercise lives in one of these.
 *
 * Adding a type should mean adding a definition and a renderer, not editing the quiz
 * service, the controller and the player — which is what the previous design required,
 * and why the platform still supported exactly one kind of question while the authored
 * content already used four.
 */
export type ExerciseDefinition = {
  type: QuestionType;
  /** Rejects authored content that cannot be answered, before it reaches a student. */
  validatePayload(payload: unknown, acceptedAnswers: string[]): string[];
  grade(question: GradableQuestion, answer: RawAnswer): GradeResult;
};

export const asStringArray = (value: RawAnswer): string[] =>
  Array.isArray(value) ? value.map(String) : [String(value)];

/** Choice answers are a set: order must not change whether they are correct. */
export const canonicalSet = (value: RawAnswer): string =>
  asStringArray(value)
    .map((item) => item.trim())
    .filter(Boolean)
    .sort()
    .join(',');
