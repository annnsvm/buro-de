import { describe, expect, it } from 'vitest';
import { API_ENDPOINTS, NO_REFRESH_ENDPOINTS } from '@/api/apiEndpoints';

/**
 * Which 401s are allowed to refresh the session, and which must not.
 *
 * The access-token cookie lives thirty minutes; the refresh token lives seven days. So after
 * half an hour on a page every request arrives with no cookie at all, and the only thing
 * standing between the author and a lost form is the interceptor noticing the 401 and
 * refreshing before retrying.
 *
 * It was not noticing. The list below was matched with `startsWith`, and `/courses` was on it
 * for the public catalog - which silently covered the entire course-management API, since all
 * of it begins with `/courses`. Saving anything in the editor after thirty minutes failed with
 * "No token provided", no retry, while the refresh token had six days left.
 *
 * This is the kind of bug that cannot be seen by reading either side on its own: the list
 * looks right, the interceptor looks right, and the breakage lives in how one reads the other.
 */
const matches = (url: string): boolean => {
  const path = url.split('?')[0].replace(/\/+$/, '');
  return (NO_REFRESH_ENDPOINTS as readonly string[]).includes(path);
};

describe('endpoints that must never trigger a token refresh', () => {
  /** Refreshing in answer to a failed refresh is a loop; the rest are nonsense. */
  it.each([
    API_ENDPOINTS.auth.refresh,
    API_ENDPOINTS.auth.login,
    API_ENDPOINTS.auth.register,
    API_ENDPOINTS.auth.logout,
  ])('holds %s back', (url) => {
    expect(matches(url)).toBe(true);
  });
});

describe('endpoints that must be retried after a refresh', () => {
  const MATERIAL = 'c1/modules/m1/materials/mat1';

  /**
   * Every one of these begins with `/courses`, which is precisely why the prefix match broke
   * them. They are the author's whole working day.
   */
  it.each([
    ['the course list for a teacher', API_ENDPOINTS.courses.manage],
    ['a course structure', API_ENDPOINTS.courses.structure('c1')],
    ['one course', API_ENDPOINTS.courses.byId('c1')],
    ['the practice elements', `/courses/${MATERIAL}/elements`],
    ['one practice element', `/courses/${MATERIAL}/elements/e1`],
    ['the CSV import', API_ENDPOINTS.courseMaterials.import('c1', 'm1')],
  ])('refreshes for %s', (_name, url) => {
    expect(matches(url)).toBe(false);
  });

  /**
   * The catalog is genuinely public, and it is still not on the list: an anonymous visitor
   * never reaches the refresh at all, because the interceptor declines without a session. Put
   * `/courses` back and the six cases above break again.
   */
  it('does not need the public catalog on the list to stay safe', () => {
    expect((NO_REFRESH_ENDPOINTS as readonly string[])).not.toContain(
      API_ENDPOINTS.courses.list,
    );
  });

  /** A query string is not part of the path, and a trailing slash is not a different route. */
  it.each([
    `${API_ENDPOINTS.auth.refresh}/`,
    `${API_ENDPOINTS.auth.login}?next=/me`,
  ])('still recognises %s', (url) => {
    expect(matches(url)).toBe(true);
  });
});
