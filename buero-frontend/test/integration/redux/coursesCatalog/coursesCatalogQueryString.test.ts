import { describe, expect, it } from 'vitest';

import { buildCoursesCatalogQueryString } from '@/redux/slices/coursesCatalog/coursesCatalogQueryString';

describe('buildCoursesCatalogQueryString', () => {
  it('maps beginner tab id to tags=Beginner', () => {
    const qs = buildCoursesCatalogQueryString({ tags: 'beginner' }, false);
    expect(new URLSearchParams(qs).get('tags')).toBe('Beginner');
  });

  it('maps sociocultural tab to Culture & Life tag', () => {
    const qs = buildCoursesCatalogQueryString({ tags: 'sociocultural' }, false);
    expect(new URLSearchParams(qs).get('tags')).toBe('Culture & Life');
  });

  it('maps middle tab to level=B1', () => {
    const qs = buildCoursesCatalogQueryString({ tags: 'middle' }, false);
    expect(new URLSearchParams(qs).get('level')).toBe('B1');
    expect(new URLSearchParams(qs).get('tags')).toBeNull();
  });

  it('combines search with tag filter', () => {
    const qs = buildCoursesCatalogQueryString({ search: '  German ', tags: 'language' }, false);
    const p = new URLSearchParams(qs);
    expect(p.get('search')).toBe('German');
    expect(p.get('tags')).toBe('Language');
  });

  it('adds publication_status for teacher manage', () => {
    const qs = buildCoursesCatalogQueryString(
      { tags: 'beginner', publicationStatus: 'published' },
      true,
    );
    const p = new URLSearchParams(qs);
    expect(p.get('tags')).toBe('Beginner');
    expect(p.get('publication_status')).toBe('published');
  });
});
