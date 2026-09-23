import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

/**
 * The settings that make a quiz material a lesson quiz or a module test.
 *
 * Kept apart from `content` because these are properties of the material, not of what
 * is inside it: they decide how answers are marked and how the result is counted, and
 * they apply whether the questions came from a CSV import or were typed in one by one.
 *
 * A practice quiz sends no threshold. Its result is the share of questions answered
 * right, and there is nothing to pass or fail — carrying a percentage there would put a
 * threshold on a lesson check that is meant to be taken as many times as it takes.
 */
export const quizMaterialSettings = (
  payload: CreateCourseMaterialModalValues,
): { quiz_mode?: 'practice' | 'test'; passing_score?: number | null } => {
  if (payload.type !== 'quiz') return {};
  return payload.quizMode === 'test'
    ? { quiz_mode: 'test', passing_score: payload.passingScore }
    : { quiz_mode: 'practice', passing_score: null };
};
