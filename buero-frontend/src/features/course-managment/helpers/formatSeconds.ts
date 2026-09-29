/**
 * Seconds as the lesson list shows them — "9:05", or "1:02:30" once an hour is passed.
 *
 * The duration is typed as text elsewhere in the form, so this has to produce exactly the shape a
 * teacher would have typed: no leading zero on the first number, two digits on the rest.
 */
export const formatSeconds = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(rest)}`
    : `${minutes}:${pad(rest)}`;
};
