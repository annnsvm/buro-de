import { describe, expect, it } from 'vitest';

import {
  findLockedModuleIds,
  type ApiCourseWithTree,
} from '@/pages/CoursePage/coursePageMappers';

/**
 * Which modules a student may study.
 *
 * This used to be guessed from the materials: a module counted as locked when it had
 * materials and none of them carried content. A module with *no* materials therefore
 * counted as open - and the author hit it on the live A1 course, where modules 7, 8 and 9
 * were still empty. They showed up among the free ones, renumbered the whole sidebar, and
 * left the paywall teaser pointing at module 3, listed below them.
 *
 * The server has always said `locked` outright on every module. Reading the flag rather
 * than inferring it is the fix, and the first test here is the case the inference missed.
 */

/** `readable` is the per-material flag the old inference reads: the server withholds a
 *  lesson by marking it `locked: true`. */
const mod = (
  id: string,
  locked: boolean | undefined,
  materialCount: number,
  readable = false,
) => ({
  id,
  title: id,
  ...(locked === undefined ? {} : { locked }),
  materials: Array.from({ length: materialCount }, (_, i) => ({
    id: `${id}-m${i}`,
    type: 'video',
    locked: !readable,
  })),
});

const course = (modules: unknown[]) =>
  ({ id: 'c1', modules } as unknown as ApiCourseWithTree);

describe('an empty module', () => {
  /** The reported bug, in one assertion. */
  it('is locked when the server says it is, even with no materials', () => {
    const locked = findLockedModuleIds(course([mod('empty', true, 0)]));
    expect(locked.has('empty')).toBe(true);
  });

  it('is open when the server says it is open', () => {
    const locked = findLockedModuleIds(course([mod('empty', false, 0)]));
    expect(locked.has('empty')).toBe(false);
  });
});

describe('the ordinary cases', () => {
  it('locks a module the server locked, whatever its materials look like', () => {
    const locked = findLockedModuleIds(course([mod('paid', true, 5)]));
    expect(locked.has('paid')).toBe(true);
  });

  it('leaves a module the server opened alone', () => {
    const locked = findLockedModuleIds(course([mod('free', false, 5, true)]));
    expect(locked.has('free')).toBe(false);
  });

  /**
   * A whole course on a trial: the opening modules open, the rest shut, including the
   * empty ones at the end that are still being written.
   */
  it('splits a trial course where the server drew the line', () => {
    const locked = findLockedModuleIds(
      course([
        mod('m0', false, 1, true),
        mod('m1', false, 23, true),
        mod('m2', false, 23, true),
        mod('m3', true, 11),
        mod('m7', true, 0),
        mod('m8', true, 0),
      ]),
    );
    expect([...locked].sort()).toEqual(['m3', 'm7', 'm8']);
  });

  it('locks nothing for someone who bought the course', () => {
    const locked = findLockedModuleIds(
      course([mod('m0', false, 1, true), mod('m9', false, 0)]),
    );
    expect(locked.size).toBe(0);
  });
});

describe('a response from before the flag existed', () => {
  /** The old guess is kept as a fallback, so an older server still behaves. */
  it('still infers from the materials', () => {
    const locked = findLockedModuleIds(
      course([mod('withheld', undefined, 4), mod('readable', undefined, 4, true)]),
    );
    expect(locked.has('withheld')).toBe(true);
    expect(locked.has('readable')).toBe(false);
  });

  /** And still cannot tell about an empty one - which is why the flag exists. */
  it('cannot judge an empty module, so leaves it open', () => {
    const locked = findLockedModuleIds(course([mod('empty', undefined, 0)]));
    expect(locked.has('empty')).toBe(false);
  });
});
