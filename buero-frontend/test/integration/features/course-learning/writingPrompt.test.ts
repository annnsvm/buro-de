import { describe, expect, it } from 'vitest';
import { parseWritingPrompt } from '@/features/course-learning/WritingPanel/prompt';

/**
 * Reading a task the way its author wrote it.
 *
 * The labels are hers, so the screen can show them as headings instead of running the whole
 * task into one paragraph. The rule that matters is the one about tasks that do not use them:
 * they must come back whole, because a task is the only thing standing between a student and a
 * mark they cannot otherwise earn.
 */
describe('the four parts of a writing task', () => {
  const REAL = [
    'Ситуація: У суботу у ваш будинок вʼїхала нова родина.',
    'Завдання: Напишіть Софії відповідь у Perfekt або Präsens — 4–6 речень.',
    'Обовʼязково: скажіть, кому ви допомагали; напишіть, що саме ви робили.',
    'Опори: die Kiste, -n · tragen — getragen · die Frage, -n · zusammen',
  ].join('\n');

  it('reads each of the author’s labels', () => {
    const { sections } = parseWritingPrompt(REAL);

    expect(sections.map((s) => s.label)).toEqual([
      'Ситуація',
      'Завдання',
      'Обовʼязково',
    ]);
  });

  it('keeps the text of a section exactly', () => {
    const { sections } = parseWritingPrompt(REAL);

    expect(sections[0].text).toBe('У суботу у ваш будинок вʼїхала нова родина.');
  });

  /** The words to lean on are a list, not a sentence, so they come back as one. */
  it('splits the words to lean on', () => {
    expect(parseWritingPrompt(REAL).props).toEqual([
      'die Kiste, -n',
      'tragen — getragen',
      'die Frage, -n',
      'zusammen',
    ]);
  });

  /**
   * Three apostrophes mean the same thing. Reading only the one her files happen to use would
   * lose the section the first time a task was edited in a word processor.
   */
  it.each([
    ['modifier letter', 'Обовʼязково: одне речення з weil.'],
    ['straight quote', "Обов'язково: одне речення з weil."],
    ['curly quote', 'Обов’язково: одне речення з weil.'],
    ['no apostrophe', 'Обовязково: одне речення з weil.'],
  ])('reads the required section written with a %s', (_name, line) => {
    const { sections } = parseWritingPrompt(line);

    expect(sections).toHaveLength(1);
    expect(sections[0].text).toBe('одне речення з weil.');
  });

  /** A task written as plain prose is shown as plain prose, whole. */
  it('leaves a task with no labels alone', () => {
    const prose = 'Напишіть колезі лист на 6–8 речень.\nЗгадайте про нараду.';
    const { sections, props, plain } = parseWritingPrompt(prose);

    expect(sections).toEqual([]);
    expect(props).toEqual([]);
    expect(plain).toBe(prose);
  });

  /** Anything before the first label is text too, and is not thrown away. */
  it('keeps what stands before the first label', () => {
    const { plain, sections } = parseWritingPrompt(
      'Прочитайте уважно.\nЗавдання: напишіть відповідь.',
    );

    expect(plain).toBe('Прочитайте уважно.');
    expect(sections[0].text).toBe('напишіть відповідь.');
  });

  /** A section that runs over several lines keeps all of them. */
  it('keeps a section that spans more than one line', () => {
    const { sections } = parseWritingPrompt(
      'Завдання: напишіть відповідь.\nДодайте два приклади.',
    );

    expect(sections[0].text).toBe('напишіть відповідь.\nДодайте два приклади.');
  });

  it('reports nothing for an empty task', () => {
    expect(parseWritingPrompt('')).toEqual({ sections: [], props: [], plain: '' });
  });
});
