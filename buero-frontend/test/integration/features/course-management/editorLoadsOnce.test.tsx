import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { rootReducer } from '@/redux/rootReducer';
import { setStore } from '@/redux/storeRef';

/**
 * The course editor fetches the course it is editing once.
 *
 * This is here because of what it costs when it does not. The effect that loads a course
 * sets a dozen pieces of state, so it renders again; if anything in its dependency list is
 * rebuilt on each render, the effect runs again, and the editor fetches the same course in
 * a tight loop until the rate limiter starts answering 429. What the author sees is an
 * empty course - the first few requests succeed, every one after that is refused - and
 * nothing on screen says why.
 *
 * It happened the moment a callback was passed to the tree hook as an inline arrow:
 *
 *   getIsDurationManual: () => getValues('durationHoursManual') === true
 *
 * A new function each render, so `syncCourseDurationHours` was new each render, and that
 * sits in this effect's dependencies. The fix was one `useCallback`, and nothing about the
 * screen would have revealed which render it was on.
 */
const fetchCourseById = vi.fn();
const patchCourse = vi.fn();

vi.mock('@/api/courseManagementApi', () => ({
  fetchCourseById: (...a: unknown[]) => fetchCourseById(...a),
  patchCourse: (...a: unknown[]) => patchCourse(...a),
  createCourse: vi.fn(),
  deleteCourse: vi.fn(),
  uploadCourseCover: vi.fn(),
  createModule: vi.fn(),
  updateModule: vi.fn(),
  deleteModule: vi.fn(),
  createMaterial: vi.fn(),
  updateMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
  reorderCourseStructure: vi.fn(),
}));

const { useCourseEditor } = await import(
  '@/features/course-managment/course-editor/hooks/useCourseEditor'
);

const COURSE = '1a064639-a1fd-4319-ad44-08d01cfb3b55';

const courseFromServer = {
  id: COURSE,
  title: 'Deutsch A2.1',
  description: '',
  language: 'de',
  price: 100,
  level: 'A2',
  durationHours: 3,
  durationHoursManual: false,
  trialModuleCount: 2,
  isIntegration: false,
  isPublished: true,
  modules: [],
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const store = configureStore({ reducer: rootReducer });
  setStore(store);
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/teacher/courses/${COURSE}/edit`]}>
        {children}
      </MemoryRouter>
    </Provider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  fetchCourseById.mockResolvedValue({ data: courseFromServer });
  patchCourse.mockResolvedValue({ data: {} });
});

describe('opening a course in the editor', () => {
  it('asks the server for it once', async () => {
    renderHook(() => useCourseEditor(), { wrapper });

    await waitFor(() => expect(fetchCourseById).toHaveBeenCalled());
    /** Long enough for a loop to have shown itself many times over. */
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(fetchCourseById).toHaveBeenCalledTimes(1);
  });

  /**
   * The duration sync runs on load, so it is in the same loop when there is one. A course
   * on automatic saves its summed hours once, not once per render.
   */
  it('saves the worked-out duration once', async () => {
    renderHook(() => useCourseEditor(), { wrapper });

    await waitFor(() => expect(fetchCourseById).toHaveBeenCalled());
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(patchCourse.mock.calls.length).toBeLessThanOrEqual(1);
  });
});
