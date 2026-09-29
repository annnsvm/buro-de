import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';

/**
 * A course belongs to the integration track when it is tagged for it, and is a language
 * course otherwise.
 *
 * Stated this way round on purpose: the `Language` tag has to be applied by hand and
 * mostly has not been, whereas `Integration` is the one that really is used. A new course
 * is therefore a language course until it is marked otherwise, and nothing falls through.
 */
export const isIntegrationCourse = (course: CourseCardProps): boolean =>
  course.tags?.some((tag) => tag.toLowerCase().includes('integration')) ?? false;

export type CatalogSectionId = 'language' | 'integration';

export type CatalogSection = {
  id: CatalogSectionId;
  /**
   * Language courses are one route taken in order, so they are drawn as a path with a
   * step above each card. Integration courses are independent guides: each has a level it
   * suits, but there is no route through them, and numbering them would invent one.
   */
  isPath: boolean;
  courses: CourseCardProps[];
};

/** Position in the catalogue order, which is the order the author arranged. */
const byCatalogOrder = (a: CourseCardProps, b: CourseCardProps) =>
  (a.orderIndex ?? 0) - (b.orderIndex ?? 0);

/**
 * Splits the catalogue into its two tracks, dropping a section that has nothing in it —
 * a heading over an empty grid reads as something having gone wrong.
 */
export const buildCatalogSections = (
  courses: readonly CourseCardProps[],
): CatalogSection[] => {
  const language: CourseCardProps[] = [];
  const integration: CourseCardProps[] = [];

  for (const course of courses) {
    (isIntegrationCourse(course) ? integration : language).push(course);
  }

  return (
    [
      { id: 'language' as const, isPath: true, courses: language.sort(byCatalogOrder) },
      {
        id: 'integration' as const,
        isPath: false,
        courses: integration.sort(byCatalogOrder),
      },
    ] satisfies CatalogSection[]
  ).filter((section) => section.courses.length > 0);
};

/**
 * How a course's level range reads on a card's step.
 *
 * A course sitting at one level shows that level; one that spans a range shows where it
 * starts, because "від A2" is what a student needs to know before opening it — the top of
 * the range says nothing useful about whether they can begin.
 */
export const levelRangeLabel = (course: CourseCardProps): string => {
  const from = course.level ?? course.levelLabel;
  if (!course.levelTo || course.levelTo === from) return from;
  return `${from}+`;
};

/**
 * Levels the catalogue actually covers, in CEFR order.
 *
 * Drawn from the courses themselves rather than from the whole ladder, so a level chip
 * never empties the page. A course that spans a range contributes every level in it: an
 * integration course from A2 to B1 belongs under both.
 */
export const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;

/**
 * Whether a course covers a level, range included.
 *
 * The same rule the server filters by, so what comes back and what gets highlighted agree.
 * Comparing `level` alone meant a course spanning A2–B1 was returned under B1 but left
 * unmarked — the block said "look at B1" and then pointed at nothing.
 */
export const coversLevel = (course: CourseCardProps, level: string): boolean => {
  const from = CEFR_ORDER.indexOf(
    (course.level ?? course.levelLabel) as (typeof CEFR_ORDER)[number],
  );
  const at = CEFR_ORDER.indexOf(level as (typeof CEFR_ORDER)[number]);
  if (from < 0 || at < 0) return false;
  const to = course.levelTo
    ? CEFR_ORDER.indexOf(course.levelTo as (typeof CEFR_ORDER)[number])
    : from;
  return at >= from && at <= (to < 0 ? from : to);
};

/**
 * Every CEFR level the platform names, each marked with whether a course covers it today.
 *
 * The full ladder is offered so a visitor can see how far the courses are meant to go; the
 * levels with nothing behind them are shown but cannot be chosen.
 */
export const levelAvailability = (
  courses: readonly CourseCardProps[],
): { level: string; available: boolean }[] => {
  const covered = new Set(availableLevels(courses));
  return CEFR_ORDER.map((level) => ({ level, available: covered.has(level) }));
};

export const availableLevels = (
  courses: readonly CourseCardProps[],
): string[] => {
  const covered = new Set<string>();
  for (const course of courses) {
    const from = CEFR_ORDER.indexOf(
      (course.level ?? course.levelLabel) as (typeof CEFR_ORDER)[number],
    );
    if (from < 0) continue;
    const toIndex = course.levelTo
      ? CEFR_ORDER.indexOf(course.levelTo as (typeof CEFR_ORDER)[number])
      : from;
    for (let i = from; i <= (toIndex < 0 ? from : toIndex); i++) {
      covered.add(CEFR_ORDER[i]);
    }
  }
  return CEFR_ORDER.filter((level) => covered.has(level));
};
