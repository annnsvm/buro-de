/**
 * What the hub says under the block cards, as the author wrote it.
 *
 * Returned as a key and a count rather than a sentence, so the wording lives with the rest of the
 * translations and the branching can be read on its own. The branching is the part worth testing:
 * two of the rules overlap, and which wins is a deliberate choice rather than an accident.
 */
export type Encouragement = {
  key: 'start' | 'goodStart' | 'halfway' | 'almost' | 'done';
  /** Blocks left, or the total when nothing has been done yet. */
  count: number;
} | null;

export const encouragementFor = (total: number, done: number): Encouragement => {
  const left = Math.max(0, total - done);

  if (total === 0) return null;
  if (left === 0) return { key: 'done', count: 0 };

  /**
   * A practice of one block says nothing until it is finished: a card plus a line urging the
   * student through a single block would be noise, not encouragement.
   */
  if (total === 1) return null;

  /** Nothing done yet wins over the counts below, whatever the total. */
  if (done === 0) return { key: 'start', count: total };

  if (left === 3) return { key: 'goodStart', count: 3 };

  /**
   * "Half is behind you" is only true when it is. With three blocks, two left means one done,
   * so the author asks for the gentler line instead.
   */
  if (left === 2) {
    return total === 3 ? { key: 'goodStart', count: 2 } : { key: 'halfway', count: 2 };
  }

  return { key: 'almost', count: 1 };
};

/**
 * The opening line names the number in words — "чотири короткі блоки", not "4 блоки".
 *
 * Only this one message does. It is the invitation, and a numeral there reads like a count of
 * work; the later lines are progress reports, where a digit is exactly right. A practice never
 * holds more than four blocks, so the figure is a fallback that should not be reached.
 */
const NUMERALS: Record<string, readonly string[]> = {
  uk: ['', 'Один', 'Два', 'Три', 'Чотири'],
  en: ['', 'One', 'Two', 'Three', 'Four'],
};

export const spellBlockCount = (count: number, language: string): string =>
  NUMERALS[language.slice(0, 2)]?.[count] ?? String(count);
