import { describe, expect, it } from 'vitest';

import { buildCoursesCatalogQueryString } from '@/redux/slices/coursesCatalog/coursesCatalogQueryString';

const params = (qs: string) => new URLSearchParams(qs);

/**
 * What each catalogue tab asks the server for.
 *
 * These assertions used to pin down mappings that did not work against the real data: a
 * `Beginner` tag every course carried, a `Culture & Life` tag no course carried, and a
 * B2 level nothing had. The tabs are gone, and so are the assertions that protected them.
 */
describe('buildCoursesCatalogQueryString', () => {
  it('asks for everything that is not integration as the language courses', () => {
    const p = params(buildCoursesCatalogQueryString({ tags: 'language' }, false));
    expect(p.get('tags_exclude')).toBe('Integration');
    // Not a `Language` tag: that had to be applied by hand, and mostly had not been.
    expect(p.get('tags')).toBeNull();
  });

  it('asks for the integration tag by name', () => {
    const p = params(buildCoursesCatalogQueryString({ tags: 'integration' }, false));
    expect(p.get('tags')).toBe('Integration');
    expect(p.get('tags_exclude')).toBeNull();
  });

  it('sends nothing at all for "all courses"', () => {
    const p = params(buildCoursesCatalogQueryString({ tags: 'all' }, false));
    expect(p.get('tags')).toBe('all');
  });

  /** Kept working for when levels return, matched on the level and never on a tag. */
  it('matches a level on the level, not on a tag of the same name', () => {
    const p = params(buildCoursesCatalogQueryString({ tags: 'B1' }, false));
    expect(p.get('level')).toBe('B1');
    expect(p.get('tags')).toBeNull();
  });

  it('combines search with a filter, trimming the query', () => {
    const p = params(
      buildCoursesCatalogQueryString({ search: '  German ', tags: 'language' }, false),
    );
    expect(p.get('search')).toBe('German');
    expect(p.get('tags_exclude')).toBe('Integration');
  });

  it('adds publication_status for the teacher view', () => {
    const p = params(
      buildCoursesCatalogQueryString(
        { tags: 'integration', publicationStatus: 'published' },
        true,
      ),
    );
    expect(p.get('tags')).toBe('Integration');
    expect(p.get('publication_status')).toBe('published');
  });
});
