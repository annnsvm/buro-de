import { QuestionType } from '../../../generated/prisma/enums';
import {
  canonicalSet,
  type ExerciseDefinition,
  type GradableQuestion,
  type RawAnswer,
} from '../exercise.types';

type ChoicePayload = { options?: Array<{ id?: unknown; text?: unknown }> };

const readOptionIds = (payload: unknown): string[] => {
  const options = (payload as ChoicePayload | null)?.options;
  if (!Array.isArray(options)) return [];
  return options
    .map((option) => (typeof option?.id === 'string' ? option.id : null))
    .filter((id): id is string => id !== null);
};

const validateChoice = (
  payload: unknown,
  acceptedAnswers: string[],
  { multi }: { multi: boolean },
): string[] => {
  const problems: string[] = [];
  const optionIds = readOptionIds(payload);

  if (optionIds.length < 2) {
    problems.push('a choice question needs at least two options with ids');
  }
  if (acceptedAnswers.length === 0) {
    problems.push('no correct answer is marked');
  }

  /**
   * A multi-choice answer is stored as one entry: the option ids sorted and joined.
   * Checking the parts against the options catches an answer key left pointing at an
   * option that was later renamed or deleted, which makes the question unanswerable.
   */
  for (const accepted of acceptedAnswers) {
    const parts = accepted.split(',').map((part) => part.trim()).filter(Boolean);
    if (!multi && parts.length > 1) {
      problems.push(`single choice cannot accept a set of options: "${accepted}"`);
    }
    for (const part of parts) {
      if (!optionIds.includes(part)) {
        problems.push(`correct answer "${part}" is not one of the options`);
      }
    }
  }

  return problems;
};

const gradeChoice = (question: GradableQuestion, answer: RawAnswer) => {
  const given = canonicalSet(answer);
  if (!given) return { correct: false, quality: 'none' as const };
  const correct = question.acceptedAnswers.some(
    (accepted) => canonicalSet(accepted) === given,
  );
  return { correct, quality: correct ? ('exact' as const) : ('none' as const) };
};

const readOptionTexts = (payload: unknown): Map<string, string> => {
  const options = (payload as ChoicePayload | null)?.options;
  const byId = new Map<string, string>();
  if (!Array.isArray(options)) return byId;
  for (const option of options) {
    if (typeof option?.id === 'string') {
      byId.set(option.id, typeof option.text === 'string' ? option.text : option.id);
    }
  }
  return byId;
};

/** Turns each stored answer key into the option text a student recognises. */
const describeChoice = (question: GradableQuestion): string[] => {
  const byId = readOptionTexts(question.payload);
  return question.acceptedAnswers.map((accepted) =>
    accepted
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((id) => byId.get(id) ?? id)
      .join(', '),
  );
};

/** One option out of several; the answer is a single option id. */
export const singleChoiceDefinition: ExerciseDefinition = {
  type: QuestionType.single_choice,
  validatePayload: (payload, acceptedAnswers) =>
    validateChoice(payload, acceptedAnswers, { multi: false }),
  grade: gradeChoice,
  describeAcceptedAnswers: describeChoice,
};

/** Several options at once; the whole set has to match, order does not matter. */
export const multiChoiceDefinition: ExerciseDefinition = {
  type: QuestionType.multi_choice,
  validatePayload: (payload, acceptedAnswers) =>
    validateChoice(payload, acceptedAnswers, { multi: true }),
  grade: gradeChoice,
  describeAcceptedAnswers: describeChoice,
};
