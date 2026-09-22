import type { QuizQuestion } from '@/api/quizApi';

/** What the student has entered so far. Empty means unanswered. */
export type ExerciseAnswer = string | string[];

export type ExerciseRendererProps = {
  question: QuizQuestion;
  answer: ExerciseAnswer;
  onChange: (answer: ExerciseAnswer) => void;
  /** Answers are locked once the quiz has been checked. */
  disabled: boolean;
};

export const isAnswered = (answer: ExerciseAnswer | undefined): boolean => {
  if (answer == null) return false;
  if (Array.isArray(answer)) return answer.length > 0;
  return answer.trim().length > 0;
};
