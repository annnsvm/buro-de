import { describe, expect, it } from 'vitest';

import { createCourseSchema } from '@/features/course-managment/validation/createCourseSchema';

const base = {
  title: 'German A1',
  description: 'Intro course',
  language: 'de' as const,
  category: 'language' as const,
  price: '29.99',
  durationHours: '5',
  tags: ['Language'],
  level: 'A1' as const,
};

describe('createCourseSchema', () => {
  it('accepts valid course form', () => {
    expect(createCourseSchema.safeParse(base).success).toBe(true);
  });

  it('rejects empty title', () => {
    const r = createCourseSchema.safeParse({ ...base, title: '   ' });
    expect(r.success).toBe(false);
  });

  it('rejects missing price', () => {
    const r = createCourseSchema.safeParse({ ...base, price: '' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid price', () => {
    const r = createCourseSchema.safeParse({ ...base, price: 'abc' });
    expect(r.success).toBe(false);
  });

  it('rejects empty tags', () => {
    const r = createCourseSchema.safeParse({ ...base, tags: [] });
    expect(r.success).toBe(false);
  });

  it('rejects missing level', () => {
    const r = createCourseSchema.safeParse({ ...base, level: '' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid durationHours', () => {
    const r = createCourseSchema.safeParse({ ...base, durationHours: '1.5' });
    expect(r.success).toBe(false);
  });
});
