import { describe, expect, it } from 'vitest';

import { createCourseSchema } from '@/features/course-managment/validation/createCourseSchema';

const base = {
  title: 'German A1',
  description: 'Intro course',
  language: 'de' as const,
  category: 'language' as const,
  price: '29.99',
  durationHours: '5',
  level: 'A1' as const,
  levelTo: '' as const,
  trialModuleCount: '2',
  /**
   * Which half of the catalogue the course is in. A required boolean rather than one of the
   * tags, because as a tag it was undiscoverable in the editor and compared case-sensitively
   * on the server but not on the page.
   */
  isIntegration: false,
};

describe('createCourseSchema', () => {
  it('accepts valid course form', () => {
    expect(createCourseSchema.safeParse(base).success).toBe(true);
  });

  it('accepts an integration course', () => {
    expect(
      createCourseSchema.safeParse({ ...base, isIntegration: true }).success,
    ).toBe(true);
  });

  /**
   * The form always knows which half the course is in, so the field is required. Letting it
   * be absent is how the old tag spelling silently defaulted every course to "language".
   */
  it('rejects a form that does not say which half of the catalogue it is in', () => {
    const { isIntegration: _omitted, ...withoutTrack } = base;
    expect(createCourseSchema.safeParse(withoutTrack).success).toBe(false);
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

  /**
   * Tags are gone, and with them the rule that a course needed at least one. That rule only
   * ever stood between the author and saving a course: nothing rendered the tags, and the
   * one job they did is the integration switch now.
   */
  it('saves a course that names no tags, because there are none to name', () => {
    const r = createCourseSchema.safeParse({ ...base, tags: [] });
    expect(r.success).toBe(true);
  });

  it('rejects missing level', () => {
    const r = createCourseSchema.safeParse({ ...base, level: '' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid durationHours', () => {
    const r = createCourseSchema.safeParse({ ...base, durationHours: '1.5' });
    expect(r.success).toBe(false);
  });

  /**
   * How much of the course is given away free. Zero is a real answer - the course sells from
   * its first module - so it has to pass, where an empty field must not: a cleared box would
   * read as "nothing is free" while leaving the stored number untouched.
   */
  it('accepts no free modules at all', () => {
    const r = createCourseSchema.safeParse({ ...base, trialModuleCount: '0' });
    expect(r.success).toBe(true);
  });

  it('rejects an empty trialModuleCount', () => {
    const r = createCourseSchema.safeParse({ ...base, trialModuleCount: '' });
    expect(r.success).toBe(false);
  });

  it('rejects a fractional or negative trialModuleCount', () => {
    expect(
      createCourseSchema.safeParse({ ...base, trialModuleCount: '1.5' }).success,
    ).toBe(false);
    expect(
      createCourseSchema.safeParse({ ...base, trialModuleCount: '-1' }).success,
    ).toBe(false);
  });
});
