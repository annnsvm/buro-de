import { describe, expect, it } from 'vitest';

import { describeAnswer } from '@/features/course-learning/exercises/describeAnswer';

/**
 * What the student answered, written the way they saw it.
 *
 * A choice is stored as the option's id, because that is what goes to the server to be
 * marked, and the ids come from the author's own CSV - so they read like `M2T.L3_a`.
 * Printed straight onto the result screen that is gibberish: the student was shown a row
 * saying they had answered "M2T.L3_a" when what they clicked was "велосипедом".
 */
const options = [
  { id: 'M2T.L3_a', text: 'велосипедом' },
  { id: 'M2T.L3_b', text: 'автобусом' },
  { id: 'M2T.L3_c', text: 'пішки' },
];

describe('showing an answer back to the student', () => {
  it('gives the option its own words, not the id it is stored under', () => {
    expect(describeAnswer({ options }, 'M2T.L3_b')).toBe('автобусом');
  });

  it('reads several chosen options as a list', () => {
    expect(describeAnswer({ options }, ['M2T.L3_a', 'M2T.L3_c'])).toBe(
      'велосипедом, пішки',
    );
  });

  /** Typed answers are already words; there is nothing to look up. */
  it('leaves a typed answer exactly as it was typed', () => {
    expect(describeAnswer({ options: undefined }, 'der Mutter')).toBe('der Mutter');
  });

  /** Arranging words stores the words themselves. */
  it('joins an arranged sentence back together', () => {
    expect(
      describeAnswer({ options: undefined }, ['Ich', 'helfe', 'dir']),
    ).toBe('Ich, helfe, dir');
  });

  it('shows nothing when the question was left blank', () => {
    expect(describeAnswer({ options }, undefined)).toBe('');
    expect(describeAnswer({ options }, '')).toBe('');
  });

  /**
   * The question was edited after the sitting, so the id has no option any more. The id
   * is odd to look at, but it is still the student's own work and better than a blank.
   */
  it('falls back to the id when the option is gone', () => {
    expect(describeAnswer({ options }, 'M2T.L3_z')).toBe('M2T.L3_z');
  });
});
