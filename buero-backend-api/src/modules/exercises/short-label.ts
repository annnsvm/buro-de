/**
 * A short name for a task, derived from the task itself.
 *
 * Every practice element carries two pieces of text: the task, which can run to a paragraph,
 * and a short name for lists and headings. A CSV has only one column for both, and an author
 * filling the form has better things to do than invent a name for something she has just
 * written out in full - so when the name is missing it is taken from the first sentence.
 *
 * Deriving rather than truncating at a fixed width: cutting mid-word gives a label that reads
 * like a mistake, and the first sentence of a task is nearly always what a person would have
 * typed anyway.
 */
export const MAX_LABEL_LENGTH = 90;

export const shortLabel = (text: string): string => {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (!flat) return '';
  if (flat.length <= MAX_LABEL_LENGTH) return flat;

  /** The first sentence, when there is one short enough to stand as a name. */
  const sentence = /^(.{20,}?[.!?:])\s/.exec(flat);
  if (sentence && sentence[1].length <= MAX_LABEL_LENGTH) {
    return sentence[1];
  }

  /** Otherwise the last whole word that fits, so the label never breaks mid-word. */
  const cut = flat.slice(0, MAX_LABEL_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};
