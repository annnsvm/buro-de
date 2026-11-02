/**
 * The word list the author puts at the foot of a reading text.
 *
 * Her texts end with a line like "Слова: der Lesepate, -n — читальний наставник · das Fest —
 * свято". Run into the body it reads as another paragraph of German; lifted out, it is what it
 * is - a short glossary to glance at while reading.
 *
 * Only that one line is touched. A text without it comes back exactly as written, which is the
 * case that has to keep working: the list is a convention of hers, not a requirement.
 */

export type GlossaryEntry = {
  /** The German, as she wrote it, endings and all. */
  term: string;
  /** Null when an entry carries no translation, which is hers to decide. */
  meaning: string | null;
};

export type ReadingText = {
  body: string;
  glossary: GlossaryEntry[];
};

/** The label, at the start of its own line. */
const LABEL = /^[ \t]*Слова\s*:/im;

/** Her separator between entries. */
const BETWEEN = /\s+[·•]\s+/;

/** And between the German and its translation, whichever dash she typed. */
const MEANING = /\s+[—–-]\s+/;

export const parseReadingText = (body: string | null): ReadingText => {
  const text = body ?? '';
  const match = LABEL.exec(text);
  if (!match) return { body: text, glossary: [] };

  const head = text.slice(0, match.index).replace(/\s+$/, '');
  /** The list runs to the end of its line and no further. */
  const rest = text.slice(match.index + match[0].length);
  const lineEnd = rest.indexOf('\n');
  const line = lineEnd === -1 ? rest : rest.slice(0, lineEnd);
  const after = lineEnd === -1 ? '' : rest.slice(lineEnd + 1).replace(/^\s+/, '');

  const glossary = line
    .split(BETWEEN)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const split = MEANING.exec(entry);
      if (!split) return { term: entry, meaning: null };
      return {
        term: entry.slice(0, split.index).trim(),
        meaning: entry.slice(split.index + split[0].length).trim(),
      };
    });

  return { body: [head, after].filter(Boolean).join('\n\n'), glossary };
};
