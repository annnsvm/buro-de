/**
 * Headings, in the lesson's own hand.
 *
 * The video lesson sets its titles in Sora, near-black and tightly tracked; the practice
 * beside it used the application's grey body colour at assorted sizes, which is what made
 * one page look designed and the next look generated. These are the lesson's own, kept as
 * class strings so a screen can put them on whatever element its outline calls for -
 * matching the look must not force an h2 where an h3 belongs.
 */

const FACE =
  'font-[family-name:var(--font-heading)] font-bold tracking-[-0.03em] text-[var(--color-lesson-heading)]';

/** The name of the screen: a practice, a test, a result. */
export const SCREEN_TITLE = `${FACE} text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.2]`;

/** A block or a part within it. */
export const SECTION_TITLE = `${FACE} text-[1.35rem] sm:text-[1.6rem] leading-[1.25]`;

/** A card, a row, a group of questions. */
export const CARD_TITLE = `${FACE} text-lg leading-snug`;

/**
 * The small label above or beside a title: which part, which skill, how many questions.
 *
 * Not small capitals. They were set in bold uppercase with wide letter-spacing, and that
 * one habit is most of what made these screens look generic - the lesson they sit next to
 * has no such label anywhere, only plain small text. Sentence case in the heading face
 * keeps them quiet and still part of the family.
 */
export const EYEBROW =
  'font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-lesson-muted)] sm:text-[13px]';

/** The same, in the accent, for the one label of a pair that names the thing itself. */
export const EYEBROW_ACCENT =
  'font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-lesson-accent)] sm:text-[13px]';

/**
 * Two labels that belong together, pushed to opposite edges of their block.
 *
 * "Grammatik" on the left and "Питання 7" on the right read as one line about this card.
 * Side by side with a gap they read as a list of two things, which is what they looked
 * like - and the eye has no edge to come back to down a column of cards.
 */
export const LABEL_ROW = 'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1';

/** Running text inside the practice, warmer than the application grey. */
export const BODY_TEXT = 'text-[var(--color-lesson-body)]';
