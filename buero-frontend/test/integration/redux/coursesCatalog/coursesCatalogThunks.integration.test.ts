import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { rootReducer } from '@/redux/rootReducer';
import { setFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSlice';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { addUser } from '@/redux/slices/user/userSlice';
import { setStore } from '@/redux/storeRef';

import { TEST_API_BASE_URL } from '../../../constants';
import { server } from '../../../mocks/server';

describe('fetchCoursesCatalogThunk', () => {
  /**
   * The language half used to be asked for as "every course without the Integration tag".
   * It is asked for by the course's own flag now: the tag was not among those the editor
   * offered, so an integration course could not be made, and the server compared the tag
   * exactly while the page compared it lowercased, so the two disagreed.
   */
  it('requests the language half by the integration flag', async () => {
    let requestUrl = '';

    server.use(
      http.get(`${TEST_API_BASE_URL}/courses`, ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);
    store.dispatch(setFilters({ tab: 'language' }));

    await store.dispatch(fetchCoursesCatalogThunk());

    expect(requestUrl).toContain(`${TEST_API_BASE_URL}/courses`);
    expect(new URL(requestUrl).searchParams.get('integration')).toBe('false');
    expect(new URL(requestUrl).searchParams.get('tags_exclude')).toBeNull();
  });

  it('requests /courses/manage for teacher role', async () => {
    let requestUrl = '';

    server.use(
      http.get(`${TEST_API_BASE_URL}/courses/manage`, ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);
    store.dispatch(
      addUser({
        id: 't1',
        email: 'teacher@test.com',
        name: 'Teacher',
        role: 'teacher',
        language: 'de',
      }),
    );
    store.dispatch(setFilters({ tab: 'language' }));

    await store.dispatch(fetchCoursesCatalogThunk());

    expect(new URL(requestUrl).pathname).toBe('/api/courses/manage');
    expect(new URL(requestUrl).searchParams.get('integration')).toBe('false');
  });

  it('loads access from /subscriptions/me in parallel for a student', async () => {
    const hits: string[] = [];

    server.use(
      http.get(`${TEST_API_BASE_URL}/courses`, () => {
        hits.push('/courses');
        return HttpResponse.json([{ id: 'c1', title: 'German', tags: [] }]);
      }),
      http.get(`${TEST_API_BASE_URL}/subscriptions/me`, () => {
        hits.push('/subscriptions/me');
        return HttpResponse.json([{ course_id: 'c1', access_type: 'trial' }]);
      }),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);
    store.dispatch(
      addUser({
        id: 's1',
        email: 'student@test.com',
        name: 'Student',
        role: 'student',
        language: 'uk',
      }),
    );
    store.dispatch({ type: 'auth/login/fulfilled' });

    await store.dispatch(fetchCoursesCatalogThunk());

    expect(hits).toEqual(expect.arrayContaining(['/courses', '/subscriptions/me']));
    expect(store.getState().coursesCatalog.items[0]?.isAdded).toBe(true);
  });
});
