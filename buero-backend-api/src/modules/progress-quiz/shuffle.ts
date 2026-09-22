/**
 * Fisher-Yates on a copy. Used for the words of an ordering exercise, whose authored
 * order is normally the correct sentence — handing it over unshuffled would give the
 * answer away.
 */
export const shuffle = <T>(items: readonly T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
