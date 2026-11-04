/**
 * The button shapes the practice and test screens use, as class strings rather than a
 * component.
 *
 * A component would have to re-expose every button attribute each screen needs - type,
 * onClick, disabled, aria-label, form - to add nothing but a class name. The screens keep
 * their own real <button> elements and borrow the look.
 *
 * The look is the video lesson's, deliberately. The two sat side by side in the same
 * course and did not match: the lesson's buttons were lighter-weight text on a warmer
 * orange, the practice's heavier text on a cooler one, so moving from a lesson to its
 * practice felt like moving between two products. One set of classes now, built from the
 * lesson palette in `index.css`.
 *
 * Every one is at least 44px tall, which is the smallest target that can be hit reliably
 * on a phone - the lesson reaches that with padding, so it is stated here rather than
 * left to arithmetic.
 */

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45';

/** The step to take: the accent, as on "Забронювати заняття". */
export const PRIMARY_BUTTON = [
  BASE,
  'bg-[var(--color-lesson-accent)] text-white hover:opacity-90',
].join(' ');

/** Alongside it: an outline that does not compete, as on "Наступний урок". */
export const SECONDARY_BUTTON = [
  BASE,
  'border border-[var(--color-lesson-border)] bg-transparent',
  'text-[var(--color-lesson-body)] hover:bg-white/40',
].join(' ');

/**
 * The one the lesson uses for finishing something - "Позначити як пройдене".
 *
 * Black rather than the accent, so that on a screen where both appear the accent stays
 * the invitation and this stays the acknowledgement.
 */
export const DONE_BUTTON = [BASE, 'bg-black text-white hover:opacity-90'].join(' ');

/** For a step that exists but cannot be taken yet, so it is visible and plainly inactive. */
export const DISABLED_BUTTON = [
  BASE,
  'cursor-not-allowed bg-[var(--color-surface-section)] text-[var(--color-lesson-muted)]',
].join(' ');
