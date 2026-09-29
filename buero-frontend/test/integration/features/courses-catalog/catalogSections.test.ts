import { describe, expect, it } from 'vitest';

import {
  availableLevels,
  levelAvailability,
  buildCatalogSections,
  isIntegrationCourse,
  levelRangeLabel,
} from '@/features/courses-catalog/catalogSections';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';

const course = (
  over: Partial<CourseCardProps> & Pick<CourseCardProps, 'id'>,
): CourseCardProps =>
  ({
    title: over.id,
    levelLabel: 'A1',
    tags: [],
    ...over,
  }) as CourseCardProps;

describe('which track a course belongs to', () => {
  it('reads the integration tag', () => {
    expect(isIntegrationCourse(course({ id: 'ank', tags: ['Integration'] }))).toBe(true);
  });

  /**
   * Stated as "not integration" on purpose: the `Language` tag has to be applied by hand
   * and mostly has not been, so a course must not need it to be placed correctly.
   */
  it('treats an untagged course as a language course', () => {
    expect(isIntegrationCourse(course({ id: 'a1', tags: [] }))).toBe(false);
    expect(isIntegrationCourse(course({ id: 'a2', tags: ['Grammar'] }))).toBe(false);
  });
});

describe('splitting the catalogue into sections', () => {
  const courses = [
    course({ id: 'a2', orderIndex: 2, level: 'A2' }),
    course({ id: 'ank', orderIndex: 1, tags: ['Integration'], level: 'A2' }),
    course({ id: 'a1', orderIndex: 1, level: 'A1' }),
  ];

  it('puts language courses first, as a path', () => {
    const [first, second] = buildCatalogSections(courses);
    expect(first).toMatchObject({ id: 'language', isPath: true });
    expect(second).toMatchObject({ id: 'integration', isPath: false });
  });

  it('orders each section by the catalogue order the author arranged', () => {
    const [language] = buildCatalogSections(courses);
    expect(language.courses.map((c) => c.id)).toEqual(['a1', 'a2']);
  });

  /** A heading above an empty grid reads as something having gone wrong. */
  it('leaves out a section with nothing in it', () => {
    const sections = buildCatalogSections([course({ id: 'a1' })]);
    expect(sections.map((s) => s.id)).toEqual(['language']);
  });

  it('has no sections at all when nothing matched', () => {
    expect(buildCatalogSections([])).toEqual([]);
  });
});

describe('the levels worth offering as filters', () => {
  it('offers only levels some course covers', () => {
    const levels = availableLevels([
      course({ id: 'a1', level: 'A1' }),
      course({ id: 'a2', level: 'A2' }),
    ]);
    // No B1 or B2 chip, because pressing one would empty the page.
    expect(levels).toEqual(['A1', 'A2']);
  });

  it('counts every level a course spans, not just where it starts', () => {
    const levels = availableLevels([course({ id: 'ank', level: 'A2', levelTo: 'B1' })]);
    expect(levels).toEqual(['A2', 'B1']);
  });

  it('keeps CEFR order however the courses were listed', () => {
    const levels = availableLevels([
      course({ id: 'b1', level: 'B1' }),
      course({ id: 'a1', level: 'A1' }),
    ]);
    expect(levels).toEqual(['A1', 'B1']);
  });

  it('falls back to the displayed level when no raw level came through', () => {
    expect(availableLevels([course({ id: 'x', levelLabel: 'A2' })])).toEqual(['A2']);
  });
});

describe('the ladder of level chips', () => {
  /**
   * Every level is offered so a visitor sees how far the courses are meant to run; the ones
   * with nothing behind them are shown but cannot be chosen, so no chip empties the page.
   */
  it('lists the whole ladder, marking what is covered', () => {
    const ladder = levelAvailability([
      course({ id: 'a1', level: 'A1' }),
      course({ id: 'ank', level: 'A2', levelTo: 'B1' }),
    ]);

    expect(ladder).toEqual([
      { level: 'A1', available: true },
      { level: 'A2', available: true },
      { level: 'B1', available: true },
      { level: 'B2', available: false },
      { level: 'C1', available: false },
    ]);
  });

  it('marks everything unavailable when there are no courses', () => {
    expect(levelAvailability([]).every((entry) => !entry.available)).toBe(true);
  });
});

describe('how a level range reads on a step', () => {
  it('shows the level of a course that sits at one', () => {
    expect(levelRangeLabel(course({ id: 'a1', level: 'A1' }))).toBe('A1');
  });

  /** Where it starts is what says whether you can begin; the top of the range does not. */
  it('shows where a spanning course starts', () => {
    expect(levelRangeLabel(course({ id: 'ank', level: 'A2', levelTo: 'B1' }))).toBe('A2+');
  });

  it('does not mark a range that goes nowhere', () => {
    expect(levelRangeLabel(course({ id: 'a2', level: 'A2', levelTo: 'A2' }))).toBe('A2');
  });
});
