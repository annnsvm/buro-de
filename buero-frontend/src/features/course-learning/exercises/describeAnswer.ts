import type { QuizQuestion } from '@/api/quizApi';
import type { ExerciseAnswer } from './exercise.types';

/**
 * What the student answered, written the way they saw it.
 *
 * A choice is stored as the option's id, because that is what has to go to the server to
 * be marked - and the ids come from the author's own CSV, so they read like `M2T.L3_a`.
 * Printed straight onto the result screen that is gibberish: the student is shown a row
 * saying they answered "M2T.L3_a" when what they clicked was "велосипедом".
 *
 * Everything else is already its own text. Typing stores the words, and arranging words
 * stores the words, so only a choice needs looking up.
 *
 * An id with no option behind it falls back to the id rather than to nothing. It means the
 * question was edited after the sitting, and an odd-looking answer is still better than a
 * blank where the student's own work should be.
 */
export const describeAnswer = (
  question: Pick<QuizQuestion, 'options'>,
  answer: ExerciseAnswer | undefined,
): string => {
  const given = Array.isArray(answer) ? answer : answer ? [answer] : [];
  const options = question.options;
  if (!options || options.length === 0) return given.join(', ');

  return given
    .map((id) => options.find((option) => option.id === id)?.text ?? id)
    .join(', ');
};
