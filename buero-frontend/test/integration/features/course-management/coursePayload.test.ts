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
});
