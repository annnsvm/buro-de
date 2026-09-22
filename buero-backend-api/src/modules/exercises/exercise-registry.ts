import { QuestionType } from '../../generated/prisma/enums';
import {
  multiChoiceDefinition,
  singleChoiceDefinition,
} from './definitions/choice.definitions';
import { orderingDefinition } from './definitions/ordering.definition';
import {
  fillBlankDefinition,
  textInputDefinition,
} from './definitions/written.definitions';
import type {
  ExerciseDefinition,
  GradableQuestion,
  GradeResult,
  RawAnswer,
} from './exercise.types';

const DEFINITIONS: ExerciseDefinition[] = [
  singleChoiceDefinition,
  multiChoiceDefinition,
  fillBlankDefinition,
  textInputDefinition,
  orderingDefinition,
];

/**
 * The one place that knows which kinds of exercise exist. Callers ask for a question's
 * definition and never branch on the type themselves, so a new kind is a new file here
 * rather than an edit spread across the quiz service and the player.
 */
const REGISTRY = new Map<QuestionType, ExerciseDefinition>(
  DEFINITIONS.map((definition) => [definition.type, definition]),
);

export const getExerciseDefinition = (
  type: QuestionType,
): ExerciseDefinition | undefined => REGISTRY.get(type);

/** Every type in the enum that has a definition; useful for validating content. */
export const supportedQuestionTypes = (): QuestionType[] => [...REGISTRY.keys()];

/**
 * Grades one answer. An unknown type is never silently counted as correct: a question
 * the platform cannot grade is reported as wrong so it is noticed rather than inflating
 * scores quietly.
 */
export const gradeAnswer = (
  question: GradableQuestion,
  answer: RawAnswer,
): GradeResult => {
  const definition = REGISTRY.get(question.type);
  if (!definition) return { correct: false, quality: 'none' };
  return definition.grade(question, answer);
};

/** The answer key in readable form, safe to show once a question has been answered. */
export const describeAcceptedAnswers = (
  question: GradableQuestion,
): string[] => {
  const definition = REGISTRY.get(question.type);
  return definition ? definition.describeAcceptedAnswers(question) : [];
};

/** Problems that make a question unanswerable, empty when the content is usable. */
export const validateQuestion = (question: GradableQuestion): string[] => {
  const definition = REGISTRY.get(question.type);
  if (!definition) return [`unsupported question type: ${question.type}`];
  return definition.validatePayload(question.payload, question.acceptedAnswers);
};
