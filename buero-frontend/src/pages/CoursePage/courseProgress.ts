import type { FlatMaterialRef } from './coursePageMappers';

export type CourseProgress = {
  /** Lessons this student has finished. */
  done: number;
  /** Lessons in the course - all of them, not only the ones they may open. */
  total: number;
  percent: number;
};

/**
 * How far through the course a student is.
 *
 * Measured against the course rather than against the part of it they can open. On a trial
 * those are different numbers, and using the smaller one meant that finishing the free
 * modules read "25 of 25 lessons, 100%" on a course of 111: a course reported as done when
 * four fifths of it had not been seen, and a progress bar saying there was nothing left to
 * buy.
 *
 * `openToThem` is the list the page draws from, which is why the finished lessons are
 * counted out of it - a student can only have finished what they could open. `inWholeCourse`
 * comes from the untrimmed response, before locked modules are dropped for display.
 */
export const courseProgress = (
  openToThem: readonly FlatMaterialRef[],
  completedMaterialIds: ReadonlySet<string>,
  inWholeCourse: number,
): CourseProgress => {
  const done = openToThem.filter((ref) =>
    completedMaterialIds.has(ref.material.id),
  ).length;

  /**
   * Falls back to what is on screen when the whole-course figure has not arrived yet -
   * during the first render, or for a response too old to carry every module. Showing the
   * smaller denominator for a moment is better than dividing by zero.
   */
  const total = inWholeCourse > 0 ? inWholeCourse : openToThem.length;
  if (total <= 0) return { done: 0, total: 0, percent: 0 };

  /**
   * Capped, because the two numbers come from different lists: a lesson finished before a
   * refund closed its module is still counted as done while no longer being counted in the
   * total. Rare, and not worth showing anybody 103%.
   */
  const percent = Math.min(100, Math.round((done / total) * 100));
  return { done, total, percent };
};
