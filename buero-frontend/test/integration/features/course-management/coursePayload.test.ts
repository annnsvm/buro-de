import { describe, expect, it } from 'vitest';

import { courseCreatePayload } from '@/features/course-managment/domain/courseCreatePayload';
import { courseUpdatePayload } from '@/features/course-managment/domain/courseUpdatePayload';
import { createCourseSchema } from '@/features/course-managment/validation/createCourseSchema';

describe('courseCreatePayload / courseUpdatePayload', () => {
  const parsed = createCourseSchema.parse({
    title: '  Trim me  ',
    description: '  Desc  ',
    language: 'en',
    category: 'sociocultural',
    price: '10',
    durationHours: '2',
    tags: ['Culture & Life'],
    level: 'B1',
    levelTo: '' as const,
  });

  it('create payload trims title/description and sets is_published false', () => {
    expect(courseCreatePayload(parsed)).toEqual({
      title: 'Trim me',
      description: 'Desc',
      language: 'en',
      tags: ['Culture & Life'],
      price: 10,
      level: 'B1',
      duration_hours: 2,
      is_published: false,
    });
  });

  it('update payload omits is_published', () => {
    expect(courseUpdatePayload(parsed)).toEqual({
      title: 'Trim me',
      description: 'Desc',
      language: 'en',
      tags: ['Culture & Life'],
      price: 10,
      level: 'B1',
      duration_hours: 2,
    });
  });

  it('omits duration_hours when empty', () => {
    const minimal = createCourseSchema.parse({
      ...parsed,
      durationHours: '',
    });
    expect(courseCreatePayload(minimal)).not.toHaveProperty('duration_hours');
  });

  /**
   * The server validates the top of the range as a level, so an empty string would be
   * refused rather than read as "this course sits at one level". The ordinary course has no
   * range, so leaving the field out is the common path, not the exception.
   */
  it('leaves the level range out when the course sits at one level', () => {
    const payload = courseCreatePayload({ ...parsed, levelTo: '' as const });
    expect(payload).not.toHaveProperty('level_to');
  });

  it('sends the level range for a course that spans one', () => {
    const payload = courseCreatePayload({
      ...parsed,
      level: 'A2' as const,
      levelTo: 'B1' as const,
    });
    expect(payload).toMatchObject({ level: 'A2', level_to: 'B1' });
  });
});
