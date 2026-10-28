import { describe, expect, it } from 'vitest';

import { groupByElement } from '@/features/course-learning/QuizPanel/groupByElement';
import type { PracticeElement, QuizQuestion } from '@/api/quizApi';

/**
 * Putting a reading text above the questions asked about it.
 *
 * The cases that matter are the ones where the block is not simply "one text, then its
 * questions": Grammatik has no text at all, Lesen may have two, and a question may point at a
 * text that never arrived.
 */
const question = (id: string, elementId: string | null = null): QuizQuestion => ({
  id,
  type: 'single_choice',
  prompt: id,
  points: 1,
  element_id: elementId,
  order_index: 0,
});

const element = (id: string): PracticeElement => ({
  id,
  kind: 'text',
  title: id,
  body: 'Text',
  has_transcript: false,
});

describe('grouping a block’s questions by the text they are about', () => {
  it('puts every question about one text into a single group under it', () => {
    const groups = groupByElement(
      [question('q1', 'e1'), question('q2', 'e1'), question('q3', 'e1')],
      [element('e1')],
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].element?.id).toBe('e1');
    expect(groups[0].questions.map((entry) => entry.question.id)).toEqual([
      'q1',
      'q2',
      'q3',
    ]);
  });

  it('keeps a block without any text as one plain group', () => {
    const groups = groupByElement([question('q1'), question('q2')], []);

    expect(groups).toHaveLength(1);
    expect(groups[0].element).toBeNull();
  });

  it('separates two texts in the same block', () => {
    const groups = groupByElement(
      [question('q1', 'e1'), question('q2', 'e2'), question('q3', 'e2')],
      [element('e1'), element('e2')],
    );

    expect(groups.map((group) => group.element?.id)).toEqual(['e1', 'e2']);
    expect(groups[1].questions).toHaveLength(2);
  });

  /**
   * Numbering follows the block, not the group: a student reading "question 1 of 5" twice in
   * one sitting would think they had lost their place.
   */
  it('numbers the questions across the whole block', () => {
    const groups = groupByElement(
      [question('q1'), question('q2', 'e1'), question('q3', 'e1')],
      [element('e1')],
    );

    expect(groups.flatMap((group) => group.questions.map((e) => e.position))).toEqual([
      1, 2, 3,
    ]);
  });

  /** A text that failed to arrive must not take its questions with it. */
  it('still shows a question whose text is missing', () => {
    const groups = groupByElement([question('q1', 'gone')], []);

    expect(groups).toHaveLength(1);
    expect(groups[0].element).toBeNull();
    expect(groups[0].questions).toHaveLength(1);
  });
});
