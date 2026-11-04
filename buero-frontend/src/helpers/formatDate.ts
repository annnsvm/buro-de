/**
 * Dates as they are written in Ukrainian: day, then month, then year.
 *
 * The browser's own default was being used in places - `toLocaleDateString()` with no
 * locale - and that asks the machine, not the reader. On an English browser the same
 * result screen said "11/4/2026" for the fourth of November, which is not a near miss
 * but the wrong day.
 *
 * Fixed to `uk-UA` rather than the interface language on purpose. The platform is written
 * for Ukrainian speakers; someone reading the English copy is still looking at the same
 * dates, and a date that changes shape with a language toggle is one more thing to
 * misread. The two-digit day and month keep a column of them aligned.
 */
const DAY = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** 04.11.2026 */
export const formatDay = (value: Date | string): string => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : DAY.format(date);
};
