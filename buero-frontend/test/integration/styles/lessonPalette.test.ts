import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

/**
 * The practice and the test are dressed as the lesson, not as the application.
 *
 * The video lesson had its own warm palette written into it by hand, and nothing else
 * did - so a student moving from a lesson to the practice below it went from near-black
 * headings on a warm orange to grey headings on a cooler one, and the second screen read
 * as a template rather than as part of the course. The palette is named in `index.css`
 * now and both sides draw from it.
 *
 * Guarded by reading the files because this is the kind of thing that comes back one
 * className at a time: a new card copied from elsewhere in the app, a colour picked from
 * whatever autocomplete offered first. A rendering test would not see it.
 */
const SURFACES = [
  'src/features/course-learning/PracticePanel',
  'src/features/course-learning/QuizPanel',
  'src/features/course-learning/exercises',
  'src/features/course-learning/WritingPanel',
];

/**
 * The general palette: right for the editor and the catalogue, wrong here. The pale
 * tints are left out - they read the same either way, and a rule nobody can satisfy is
 * a rule that gets switched off.
 */
const NOT_HERE = [
  '--color-accent-primary)',
  '--color-accent-primary-hover',
  '--color-text-primary)',
  '--color-text-secondary)',
  '--color-burnt-siena-dark)',
];

const sourcesUnder = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourcesUnder(path);
    return /\.tsx?$/.test(entry) ? [path] : [];
  });

const files = SURFACES.flatMap(sourcesUnder);

describe('the practice and test wear the lesson palette', () => {
  it('reads some files at all, so a silent pass is not possible', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(NOT_HERE)('uses no %s', (token) => {
    const offenders = files.filter((path) => readFileSync(path, 'utf8').includes(token));

    expect(offenders).toEqual([]);
  });

  /**
   * And no small capitals.
   *
   * Bold uppercase with wide letter-spacing was most of what made these screens look
   * generic: "GRAMMATIK  ПИТАННЯ 7" above every card, where the lesson beside them has no
   * such label anywhere, only plain small text. The one exception is the A/B/C/D marker on
   * an option, which is a single letter and has nothing to be sentence case about.
   */
  it('sets no label in spaced small capitals', () => {
    const offenders = files.filter((path) => {
      if (path.endsWith('ChoiceExercise.tsx')) return false;
      const source = readFileSync(path, 'utf8');
      return /uppercase/.test(source) && /tracking-\[0\./.test(source);
    });

    expect(offenders).toEqual([]);
  });

  /**
   * Every heading from the one place.
   *
   * They drifted apart one file at a time - the block heading at 2.1rem in warm grey, the
   * result at 1.75rem in near-black, the writing panel in the application's grey - so
   * "Grammatik" and "Майже! Ще трохи" looked like headings of two different products. A
   * heading sized by hand is how that starts, so none are.
   *
   * A big number is not a heading: the percentage and the score are set in the accent and
   * counted with `tabular-nums`, which is what tells them apart here.
   */
  it('sizes no heading by hand', () => {
    const offenders = files.flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      const hits = source.match(
        /font-\[family-name:var\(--font-heading\)\][^"'`]*text-\[[0-9.]+rem\][^"'`]*/g,
      );
      return (hits ?? [])
        .filter((hit) => !hit.includes('tabular-nums'))
        .map((hit) => `${path}: ${hit.slice(0, 60)}`);
    });

    expect(offenders).toEqual([]);
  });

  /** And the lesson's own colours are actually in use, not merely available. */
  it('draws on the lesson palette', () => {
    const used = files.some((path) =>
      readFileSync(path, 'utf8').includes('--color-lesson-'),
    );

    expect(used).toBe(true);
  });

  /** The video lesson is the source of the look, so it must be on the tokens too. */
  it('leaves no hand-written hex in the lesson it was taken from', () => {
    const lesson = readFileSync(
      'src/features/course-learning/MaterialWindow/MaterialWindow.tsx',
      'utf8',
    );

    for (const hex of ['#1b1b1b', '#5f5854', '#6f6865', '#e87753', '#d7cbc5']) {
      expect(lesson).not.toContain(hex);
    }
  });
});
