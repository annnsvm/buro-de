import { QuestionType } from '../../../generated/prisma/enums';
import {
  asStringArray,
  type ExerciseDefinition,
  type GradableQuestion,
  type RawAnswer,
} from '../exercise.types';
import { matchGermanAnswer } from '../normalize-german';

const validateWritten = (_payload: unknown, acceptedAnswers: string[]): string[] =>
  acceptedAnswers.some((answer) => answer.trim().length > 0)
    ? []
    : ['a written question needs at least one accepted answer'];

/**
 * Written answers are compared through the German matcher, so umlaut spelling, spacing
 * and a missing full stop do not cost a mark, and the reason a near miss was accepted
 * is reported back.
 */
const gradeWritten = (question: GradableQuestion, answer: RawAnswer) => {
  const [text = ''] = asStringArray(answer);
  const match = matchGermanAnswer(text, question.acceptedAnswers);
  return { correct: match.correct, quality: match.quality };
};

/** One word into a gap — the GAP exercises in the authored content. */
export const fillBlankDefinition: ExerciseDefinition = {
  type: QuestionType.fill_blank,
  validatePayload: validateWritten,
  grade: gradeWritten,
};

/** A whole sentence — the TEXT exercises. */
export const textInputDefinition: ExerciseDefinition = {
  type: QuestionType.text_input,
  validatePayload: validateWritten,
  grade: gradeWritten,
};
