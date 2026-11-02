import { describe, expect, it } from 'vitest';
import { parseReadingText } from '@/features/course-learning/QuizPanel/glossary';

/**
 * Lifting the author's word list out of the text it sits under.
 *
 * The rule that matters is the one about texts without a list: a reading task is the whole
 * point of the block, and losing a line of it to a parser would be worse than never having
 * styled the glossary at all.
 */
describe('the word list under a reading text', () => {
  const REAL = [
    'Lesepaten in der Stadtbibliothek',
    '',
    'Jeden Mittwoch kommen zwanzig Kinder in die Stadtbibliothek.',
    '',
    'Слова: der Lesepate, -n — читальний наставник, волонтер · die Stadtbibliothek — міська бібліотека · das Fest — свято',
  ].join('\n');

  it('takes the list out of the text', () => {
    const { body } = parseReadingText(REAL);

    expect(body).toContain('Jeden Mittwoch kommen zwanzig Kinder');
    expect(body).not.toContain('Слова:');
    expect(body).not.toContain('міська бібліотека');
  });

  it('reads every entry', () => {
    expect(parseReadingText(REAL).glossary).toHaveLength(3);
  });

  /** A comma inside a translation is part of it, not another entry. */
  it('splits on her separator and not on commas', () => {
    const [first] = parseReadingText(REAL).glossary;

    expect(first).toEqual({
      term: 'der Lesepate, -n',
      meaning: 'читальний наставник, волонтер',
    });
  });

  it.each([
    ['em dash', 'Слова: das Fest — свято'],
    ['en dash', 'Слова: das Fest – свято'],
    ['hyphen', 'Слова: das Fest - свято'],
  ])('reads a translation joined by an %s', (_name, line) => {
    expect(parseReadingText(line).glossary[0]).toEqual({
      term: 'das Fest',
      meaning: 'свято',
    });
  });

  it('keeps an entry that has no translation', () => {
    expect(parseReadingText('Слова: zusammen').glossary[0]).toEqual({
      term: 'zusammen',
      meaning: null,
    });
  });

  /** The case that must never break: a text with no list of her own. */
  it('leaves a text without a list exactly as it is', () => {
    const plain = 'Hallo Nina,\n\nwie geht es dir?\n\nDeine Hanna';
    const { body, glossary } = parseReadingText(plain);

    expect(body).toBe(plain);
    expect(glossary).toEqual([]);
  });

  /** Anything after the list is text again, and is not swallowed with it. */
  it('keeps what follows the list', () => {
    const { body } = parseReadingText(
      'Der Text.\n\nСлова: das Fest — свято\n\nNoch ein Satz.',
    );

    expect(body).toBe('Der Text.\n\nNoch ein Satz.');
  });

  it('reports nothing for an empty text', () => {
    expect(parseReadingText(null)).toEqual({ body: '', glossary: [] });
  });

  /** "Слова" inside a sentence is a word, not a label. */
  it('ignores the word in the middle of a line', () => {
    const line = 'Ich lerne Слова: jeden Tag';
    expect(parseReadingText(`Der Text.\n${line}`).glossary).toEqual([]);
  });
});
