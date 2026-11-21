import { readFileSync } from 'node:fs';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { API_ENDPOINTS } from '@/api/apiEndpoints';

/**
 * The lesson a student is reading has to be reported, because nothing else tells the server.
 *
 * The first attempt recorded it inside `GET .../course-materials/:id` - an endpoint only the
 * editor calls. A student receives the whole course tree in one request and moves between
 * lessons inside the page, so that handler never ran and "continue" went on guessing from
 * finished lessons. The bug survived a full test suite because every test was about what the
 * handler did once called, and none about whether anybody called it.
 *
 * So the first test here reads the page's source: it asks whether the call exists at all.
 */

const COURSE_PAGE = 'src/pages/CoursePage/CoursePage.tsx';

describe('the course page reports the lesson it opens', () => {
  it('calls markLessonOpened at all', () => {
    const source = readFileSync(COURSE_PAGE, 'utf8');
    expect(source).toContain('markLessonOpened');
    expect(source).toContain("from '@/api/progressApi'");
  });

  /** Reported on the lesson, not on the course: the bookmark names a material. */
  it('reports it whenever the selected lesson changes', () => {
    const source = readFileSync(COURSE_PAGE, 'utf8');
    const call = source.slice(source.indexOf('void markLessonOpened'));
    expect(call).toContain('markLessonOpened(courseId, selectedMaterialId)');
    const deps = call.slice(0, call.indexOf(']') + 1);
    expect(deps).toContain('selectedMaterialId');
  });

  /** A teacher reading a course is not a student's bookmark. */
  it('leaves teachers out', () => {
    const source = readFileSync(COURSE_PAGE, 'utf8');
    const effect = source.slice(
      source.indexOf('Tells the server which lesson is open'),
      source.indexOf('void markLessonOpened'),
    );
    expect(effect).toContain("currentUser?.role !== 'student'");
  });
});

describe('the call itself', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('posts the course and the material to the agreed route', async () => {
    const post = vi.fn().mockResolvedValue({ data: null });
    vi.doMock('@/api/apiInstance', () => ({ apiInstance: { post } }));

    const { markLessonOpened } = await import('@/api/progressApi');
    await markLessonOpened('course-1', 'material-9');

    expect(post).toHaveBeenCalledWith(API_ENDPOINTS.progress.opened, {
      course_id: 'course-1',
      course_material_id: 'material-9',
    });
  });

  /** A lost bookmark must never stop a lesson from opening. */
  it('swallows a failure instead of throwing it at the page', async () => {
    const post = vi.fn().mockRejectedValue(new Error('offline'));
    vi.doMock('@/api/apiInstance', () => ({ apiInstance: { post } }));

    const { markLessonOpened } = await import('@/api/progressApi');
    await expect(markLessonOpened('course-1', 'material-9')).resolves.toBeUndefined();
  });

  it('agrees with the backend about the route', () => {
    expect(API_ENDPOINTS.progress.opened).toBe('/progress/opened');
  });
});
