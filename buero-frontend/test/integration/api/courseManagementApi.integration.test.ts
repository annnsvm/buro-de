import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import * as courseApi from '@/api/courseManagementApi';

import { TEST_API_BASE_URL } from '../../constants';
import { server } from '../../mocks/server';

describe('courseManagementApi (MSW)', () => {
  it('createCourse posts JSON and returns new id', async () => {
    let body: unknown;
    server.use(
      http.post(`${TEST_API_BASE_URL}/courses`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 'course-new-1' });
      }),
    );

    const res = await courseApi.createCourse({
      title: 'T',
      is_published: false,
    });

    expect(res.data.id).toBe('course-new-1');
    expect(body).toEqual({ title: 'T', is_published: false });
  });

  it('patchCourse sends PATCH to course id', async () => {
    let body: unknown;
    server.use(
      http.patch(`${TEST_API_BASE_URL}/courses/c1`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({});
      }),
    );

    await courseApi.patchCourse('c1', { title: 'Updated' });
    expect(body).toEqual({ title: 'Updated' });
  });

  it('fetchCourseById returns tree JSON', async () => {
    server.use(
      http.get(`${TEST_API_BASE_URL}/courses/c1`, () =>
        HttpResponse.json({
          title: 'Fetched',
          modules: [],
        }),
      ),
    );

    const res = await courseApi.fetchCourseById('c1');
    expect(res.data.title).toBe('Fetched');
    expect(res.data.modules).toEqual([]);
  });

  it('createModule posts title and order_index', async () => {
    let body: unknown;
    server.use(
      http.post(`${TEST_API_BASE_URL}/courses/c1/modules`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({});
      }),
    );

    await courseApi.createModule('c1', { title: 'Module A', order_index: 0 });
    expect(body).toEqual({ title: 'Module A', order_index: 0 });
  });

  it('updateModule sends PATCH with title', async () => {
    let body: unknown;
    server.use(
      http.patch(`${TEST_API_BASE_URL}/courses/c1/modules/m1`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({});
      }),
    );

    await courseApi.updateModule('c1', 'm1', { title: 'Renamed' });
    expect(body).toEqual({ title: 'Renamed' });
  });

  it('createMaterial posts type, title, content, order_index', async () => {
    let body: unknown;
    server.use(
      http.post(`${TEST_API_BASE_URL}/courses/c1/modules/m1/materials`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 'mat-new' });
      }),
    );

    const res = await courseApi.createMaterial('c1', 'm1', {
      type: 'video',
      title: 'Intro',
      content: { youtube_video_id: 'abc', duration: '120' },
      order_index: 0,
    });

    expect(res.data.id).toBe('mat-new');
    expect(body).toEqual({
      type: 'video',
      title: 'Intro',
      content: { youtube_video_id: 'abc', duration: '120' },
      order_index: 0,
    });
  });

  it('updateMaterial sends PATCH', async () => {
    let body: unknown;
    server.use(
      http.patch(
        `${TEST_API_BASE_URL}/courses/c1/modules/m1/materials/mat1`,
        async ({ request }) => {
          body = await request.json();
          return HttpResponse.json({});
        },
      ),
    );

    await courseApi.updateMaterial('c1', 'm1', 'mat1', {
      type: 'video',
      title: 'Renamed video',
      content: { youtube_video_id: 'xyz', duration: '60' },
    });

    expect(body).toEqual({
      type: 'video',
      title: 'Renamed video',
      content: { youtube_video_id: 'xyz', duration: '60' },
    });
  });

  it('deleteModule sends DELETE', async () => {
    let called = false;
    server.use(
      http.delete(`${TEST_API_BASE_URL}/courses/c1/modules/m1`, () => {
        called = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await courseApi.deleteModule('c1', 'm1');
    expect(called).toBe(true);
  });

  it('deleteMaterial sends DELETE', async () => {
    let called = false;
    server.use(
      http.delete(`${TEST_API_BASE_URL}/courses/c1/modules/m1/materials/mat1`, () => {
        called = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await courseApi.deleteMaterial('c1', 'm1', 'mat1');
    expect(called).toBe(true);
  });

  it('deleteCourse sends DELETE', async () => {
    let called = false;
    server.use(
      http.delete(`${TEST_API_BASE_URL}/courses/c1`, () => {
        called = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await courseApi.deleteCourse('c1');
    expect(called).toBe(true);
  });
});
