import { describe, expect, it } from 'vitest';

import { formatSeconds } from '@/features/course-managment/helpers/formatSeconds';

/**
 * The duration the player reports, written the way a teacher would have typed it — the same
 * field accepts both, so the two have to agree.
 */
describe('formatSeconds', () => {
  it('writes minutes and seconds', () => {
    expect(formatSeconds(545)).toBe('9:05');
    expect(formatSeconds(60)).toBe('1:00');
  });

  it('adds hours only once there are some', () => {
    expect(formatSeconds(3750)).toBe('1:02:30');
    expect(formatSeconds(3599)).toBe('59:59');
  });

  it('rounds to the nearest second, as the player reports fractions', () => {
    expect(formatSeconds(125.6)).toBe('2:06');
  });

  /** A player that has not loaded reports zero; that must not become "0:00" in the field. */
  it('gives nothing for a duration it does not have', () => {
    expect(formatSeconds(0)).toBe('');
    expect(formatSeconds(Number.NaN)).toBe('');
    expect(formatSeconds(-5)).toBe('');
  });
});
