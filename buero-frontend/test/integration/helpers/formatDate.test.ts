import { describe, expect, it } from 'vitest';

import { formatDay } from '@/helpers/formatDate';

/**
 * Dates as they are written in Ukrainian: day, month, year.
 *
 * What this guards is the browser's own default. `toLocaleDateString()` with no locale
 * asks the machine rather than the reader, so the same result screen said "11/4/2026" on
 * an English browser for the fourth of November - not a near miss but the wrong day.
 */
describe('formatDay', () => {
  it('writes the day first, then the month, then the year', () => {
    expect(formatDay(new Date(Date.UTC(2026, 10, 4, 12)))).toBe('04.11.2026');
  });

  /** The shape must not follow whatever locale the browser happens to be set to. */
  it('writes it the same way whatever the machine is set to', () => {
    const original = new Date(Date.UTC(2026, 0, 9, 12));

    expect(formatDay(original)).toBe('09.01.2026');
    expect(formatDay(original)).not.toBe(original.toLocaleDateString('en-US'));
  });

  it('pads a single-digit day and month, so a column lines up', () => {
    expect(formatDay(new Date(Date.UTC(2026, 2, 7, 12)))).toBe('07.03.2026');
  });

  it('takes the ISO string the server sends', () => {
    expect(formatDay('2026-11-04T10:00:00.000Z')).toBe('04.11.2026');
  });

  /** A missing or broken date shows nothing rather than "Invalid Date". */
  it('shows nothing for a date it cannot read', () => {
    expect(formatDay('not a date')).toBe('');
  });
});
