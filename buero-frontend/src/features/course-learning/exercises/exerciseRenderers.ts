import type React from 'react';
import type { QuizQuestionType } from '@/api/quizApi';
import ChoiceExercise from './ChoiceExercise';
import OrderingExercise from './OrderingExercise';
import WrittenExercise from './WrittenExercise';
import type { ExerciseRendererProps } from './exercise.types';

/**
 * The one place that maps a question type to the component that draws it — the mirror
 * of the exercise registry on the server. A new kind of exercise is a new component
 * and a line here, instead of another branch inside the quiz player.
 */
const RENDERERS: Record<QuizQuestionType, React.FC<ExerciseRendererProps>> = {
  single_choice: ChoiceExercise,
  multi_choice: ChoiceExercise,
  fill_blank: WrittenExercise,
  text_input: WrittenExercise,
  ordering: OrderingExercise,
};

export const getExerciseRenderer = (
  type: QuizQuestionType,
): React.FC<ExerciseRendererProps> | undefined => RENDERERS[type];
