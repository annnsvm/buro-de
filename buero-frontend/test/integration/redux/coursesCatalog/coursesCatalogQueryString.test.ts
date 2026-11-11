import { describe, expect, it } from 'vitest';

import { buildCoursesCatalogQueryString } from '@/redux/slices/coursesCatalog/coursesCatalogQueryString';

const params = (qs: string) => new URLSearchParams(qs);

/**
 * What each catalogue tab asks the server for.
 *
 * These assertions used to pin down mappings that did not work against the real data: a
 * `Beginner` tag every course carried, a `Culture & Life` tag no course carried, and a
 * B2 level nothing had. The tabs are gone, and so are the assertions that protected them.
 *
 * The two track tabs used to be described with tags - `tags_exclude=Integration` for the
 * language half, `tags=Integration` for the other - and those assertions are rewritten
 * below. The tag was the wrong carrier twice over: it was not among the tags the editor
 * offered, so an integration course could not be made at all; and the server compared it
 * exactly while the page compared it lowercased, so a course tagged "integration" showed
 * in the integration section and was missing from this filter at the same time. The split
 * is now a column on the course, and these tabs ask for it by name.
 */
describe('buildCoursesCatalogQueryString', () => {
  it('asks for the language half by the flag, not by a tag', () => {
    const p = params(buildCoursesCatalogQueryString({ tab: 'language' }, false));
    expect(p.get('integration')).toBe('false');
    /** Neither tag filter is sent any more: the column answers on its own. */
    expect(p.get('tags')).toBeNull();
    expect(p.get('tags_exclude')).toBeNull();
  });

  it('asks for the integration half by the flag, not by a tag', () => {
    const p = params(buildCoursesCatalogQueryString({ tab: 'integration' }, false));
    expect(p.get('integration')).toBe('true');
    expect(p.get('tags')).toBeNull();
    expect(p.get('tags_exclude')).toBeNull();
  });

  /**
   * `false` has to survive the trip. Sending it only when truthy is the mistake that would
   * silently turn "the language half" into "the whole catalogue".
   */
  it('sends the language half as an explicit false', () => {
    const qs = buildCoursesCatalogQueryString({ tab: 'language' }, false);
    expect(qs).toContain('integration=false');
  });

  /**
   * "All courses" clears the tab rather than naming one, so the builder is never called with
   * it from the page. Called with it anyway, it now asks for nothing: it used to send
   * `tags=all`, a tag no course has, which would have emptied the catalogue.
   */
  it('asks for no filter at all for "all courses"', () => {
    const p = params(buildCoursesCatalogQueryString({ tab: 'all' }, false));
    expect(p.get('tags')).toBeNull();
    expect(p.get('integration')).toBeNull();
    expect(p.get('level')).toBeNull();
  });

  /** Kept working for when levels return, matched on the level and never on a tag. */
  it('matches a level on the level, not on a tag of the same name', () => {
    const p = params(buildCoursesCatalogQueryString({ tab: 'B1' }, false));
    expect(p.get('level')).toBe('B1');
    expect(p.get('tags')).toBeNull();
  });

  it('combines search with a filter, trimming the query', () => {
    const p = params(
      buildCoursesCatalogQueryString({ search: '  German ', tab: 'language' }, false),
    );
    expect(p.get('search')).toBe('German');
    expect(p.get('integration')).toBe('false');
  });

  it('adds publication_status for the teacher view', () => {
    const p = params(
      buildCoursesCatalogQueryString(
        { tab: 'integration', publicationStatus: 'published' },
        true,
      ),
    );
    expect(p.get('integration')).toBe('true');
    expect(p.get('publication_status')).toBe('published');
  });
});
