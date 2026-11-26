import { describe, expect, it } from 'vitest';

import { courseProgress } from '@/pages/CoursePage/courseProgress';
import {
  flattenMaterialsInOrder,
  scopeToUnlockedModules,
} from '@/pages/CoursePage/coursePageMappers';
import type { ApiCourseWithTree } from '@/pages/CoursePage/coursePageMappers';

/**
 * How much of the course a student has done is measured against the course.
 *
 * On a trial it used to be measured against the part they could open, so finishing the
 * free modules read "25 of 25 lessons, 100%" on a course of 111 - a course reported as
 * completed when four fifths of it had not been seen. It also left nothing to buy: the bar
 * said there was nothing left to do.
 *
 * The lessons behind the paywall do arrive from the server - every module comes back, with
 * the content of the locked ones stripped - so the real total is on the page already. What
 * hid it was `scopeToUnlockedModules`, which drops locked modules so the student is not
 * shown lessons they cannot open. That is right for what is drawn and wrong for what is
 * counted, and the two had been the same list.
 */
const lesson = (id: string, locked: boolean) => ({
  id,
  title: id,
  type: 'video',
  orderIndex: Number(id.replace(/\D/g, '')),
  locked,
  content: locked ? null : { youtube_video_id: 'abcdefghijk' },
});

/** Two modules open, three behind the paywall: 4 lessons free out of 10. */
const course = {
  id: 'course-1',
  title: 'Deutsch A1',
  modules: [
    { id: 'm0', title: 'Вступ', orderIndex: 0, locked: false, materials: [lesson('l1', false), lesson('l2', false)] },
    { id: 'm1', title: 'Модуль 1', orderIndex: 1, locked: false, materials: [lesson('l3', false), lesson('l4', false)] },
    { id: 'm2', title: 'Модуль 2', orderIndex: 2, locked: true, materials: [lesson('l5', true), lesson('l6', true)] },
    { id: 'm3', title: 'Модуль 3', orderIndex: 3, locked: true, materials: [lesson('l7', true), lesson('l8', true)] },
    { id: 'm4', title: 'Модуль 4', orderIndex: 4, locked: true, materials: [lesson('l9', true), lesson('l10', true)] },
  ],
} as unknown as ApiCourseWithTree;

describe('a student on a trial', () => {
  /** What the sidebar shows: only what can be opened. */
  it('is shown only the lessons they can open', () => {
    const forDisplay = scopeToUnlockedModules(course);

    expect(flattenMaterialsInOrder(forDisplay)).toHaveLength(4);
  });

  /** What the progress bar counts: the course. */
  it('is measured against every lesson in the course', () => {
    expect(flattenMaterialsInOrder(course)).toHaveLength(10);
  });

  /**
   * The two have to be different numbers, which is the entire point. Were they equal there
   * would be nothing to notice and nothing to buy.
   */
  it('cannot reach the end of the course by finishing the free part', () => {
    const openToThem = flattenMaterialsInOrder(scopeToUnlockedModules(course)).length;
    const wholeCourse = flattenMaterialsInOrder(course).length;

    const percentWithEverythingFreeDone = Math.round((openToThem / wholeCourse) * 100);

    expect(percentWithEverythingFreeDone).toBeLessThan(100);
    expect(percentWithEverythingFreeDone).toBe(40);
  });

  /** The locked lessons are on the page to be counted - the server does send them. */
  it('counts lessons it is not allowed to play', () => {
    const all = flattenMaterialsInOrder(course);

    expect(all.map((ref) => ref.material.id)).toContain('l9');
  });
});

describe('a student who bought the course', () => {
  /** Nothing is withheld, so the two counts meet and 100% is reachable again. */
  it('is measured against the same number either way', () => {
    const bought = {
      ...course,
      modules: (course.modules ?? []).map((mod) => ({ ...mod, locked: false })),
    } as ApiCourseWithTree;

    expect(flattenMaterialsInOrder(scopeToUnlockedModules(bought))).toHaveLength(10);
    expect(flattenMaterialsInOrder(bought)).toHaveLength(10);
  });
});

describe('the figure the bar shows', () => {
  const openToThem = flattenMaterialsInOrder(scopeToUnlockedModules(course));
  const wholeCourse = flattenMaterialsInOrder(course).length;
  const allFourDone = new Set(openToThem.map((ref) => ref.material.id));

  it('counts the whole course underneath', () => {
    const progress = courseProgress(openToThem, new Set(), wholeCourse);

    expect(progress).toMatchObject({ done: 0, total: 10, percent: 0 });
  });

  /** The reason for all of this: the free part finished is not the course finished. */
  it('stops short of the end when only the free part is done', () => {
    const progress = courseProgress(openToThem, allFourDone, wholeCourse);

    expect(progress).toMatchObject({ done: 4, total: 10, percent: 40 });
  });

  it('reaches the end when the whole course is done', () => {
    const everything = flattenMaterialsInOrder(course);
    const allTen = new Set(everything.map((ref) => ref.material.id));

    expect(courseProgress(everything, allTen, 10)).toMatchObject({
      percent: 100,
      done: 10,
    });
  });

  /**
   * The first render, before the untrimmed response has been counted. Showing the smaller
   * denominator for a moment beats dividing by zero.
   */
  it('falls back to what is on screen until the real total arrives', () => {
    const progress = courseProgress(openToThem, allFourDone, 0);

    expect(progress).toMatchObject({ done: 4, total: 4, percent: 100 });
  });

  it('says nothing rather than dividing by nothing', () => {
    expect(courseProgress([], new Set(), 0)).toMatchObject({
      done: 0,
      total: 0,
      percent: 0,
    });
  });

  /**
   * The two counts come from different lists, so a lesson finished before a refund closed
   * its module is counted as done while no longer being counted in the total.
   */
  it('never reports more than all of it', () => {
    const progress = courseProgress(openToThem, allFourDone, 3);

    expect(progress.percent).toBe(100);
  });
});
