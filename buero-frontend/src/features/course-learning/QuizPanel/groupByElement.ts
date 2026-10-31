import type { PracticeElement, QuizQuestion } from '@/api/quizApi';

/**
 * A run of questions and, when they share one, the text or audio they are about.
 *
 * `position` is the question's place in the whole block, not in the group: the student counts
 * "question 7 of 12", and that number may not restart because a second text began.
 */
export type QuestionGroup = {
  element: PracticeElement | null;
  questions: { question: QuizQuestion; position: number }[];
};

/**
 * Splits a block's questions into the stretches that belong to one text or recording.
 *
 * The server sends the questions already in order, so a group is simply a run of neighbours
 * with the same `element_id` - no sorting, no regrouping of questions the author chose to
 * separate. Questions with no element (all of Grammatik, and any question the author left
 * unbound) form their own runs and are shown exactly as before.
 *
 * An `element_id` naming an element that was not sent is treated as no element rather than as
 * an error: a missing text must not take its questions down with it.
 */
export const groupByElement = (
  questions: readonly QuizQuestion[],
  elements: readonly PracticeElement[],
): QuestionGroup[] => {
  const byId = new Map(elements.map((element) => [element.id, element]));
  const groups: QuestionGroup[] = [];

  questions.forEach((question, index) => {
    const element = question.element_id ? (byId.get(question.element_id) ?? null) : null;
    const last = groups[groups.length - 1];

    if (last && last.element?.id === element?.id) {
      last.questions.push({ question, position: index + 1 });
      return;
    }

    groups.push({ element, questions: [{ question, position: index + 1 }] });
  });

  return groups;
};
