/**
 * The three button shapes the practice screens use, as class strings rather than a component.
 *
 * A component would have to re-expose every button attribute each screen needs - type, onClick,
 * disabled, aria-label, form - to add nothing but a class name. The screens keep their own real
 * <button> elements and borrow the look.
 *
 * Every one is at least 44px tall, which is the smallest target that can be hit reliably on a
 * phone.
 */

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition';

export const PRIMARY_BUTTON = [
  BASE,
  'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)]',
  'hover:bg-[var(--color-accent-primary-hover)]',
].join(' ');

export const SECONDARY_BUTTON = [
  BASE,
  'border-[1.5px] border-[var(--color-dawn-pink-dark)]/60 bg-[var(--color-neutral-white)]',
  'text-[var(--color-text-primary)] hover:bg-[var(--color-dawn-pink-light)]',
].join(' ');

/** For a step that exists but cannot be taken yet, so it is visible and plainly inactive. */
export const DISABLED_BUTTON = [
  BASE,
  'cursor-not-allowed bg-[var(--color-surface-section)] text-[var(--color-text-secondary)]',
].join(' ');
