import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { mapApiCourseToCourseCard } from '@/api/myLearningCourses';
import type { CatalogCourse } from '@/types/api/myLearningCourses.types';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { buildCoursesCatalogQueryString } from './coursesCatalogQueryString';

const CATALOG_CLIENT_TTL_MS = 20_000;

type FetchCoursesResponse = {
  items: CourseCardProps[];
  totalCount: number;
  fetchKey: string;
};

export type FetchCoursesCatalogArg = {
  force?: boolean;
};

type AccessRow = {
  course_id?: string;
  courseId?: string;
  access_type?: string;
  accessType?: string;
  trial_ends_at?: string | null;
  trialEndsAt?: string | null;
};

const readAccessCourseId = (row: AccessRow): string | null => {
  const id = row.course_id ?? row.courseId;
  return id ? String(id) : null;
};

export const buildCatalogFetchKey = (state: {
  coursesCatalog?: { filters?: unknown };
  user?: { currentUser?: { role?: string } };
  auth?: { isAuthenticated?: boolean };
}): string => {
  const filters = state.coursesCatalog?.filters ?? {};
  const role = state.user?.currentUser?.role;
  return JSON.stringify({
    teacher: role === 'teacher',
    auth: Boolean(state.auth?.isAuthenticated),
    filters,
  });
};

export const fetchCoursesCatalogThunk = createAsyncThunk<
  FetchCoursesResponse,
  FetchCoursesCatalogArg | void,
  { state: any; rejectValue: string }
>(
  'coursesCatalog/fetch',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { filters } = state.coursesCatalog;
    const currentUserRole = state.user?.currentUser?.role as 'student' | 'teacher' | undefined;
    const isTeacherManage = currentUserRole === 'teacher';
    const endpoint = isTeacherManage ? API_ENDPOINTS.courses.manage : API_ENDPOINTS.courses.list;
    const query = buildCoursesCatalogQueryString(filters, isTeacherManage);
    const listUrl = query ? `${endpoint}?${query}` : endpoint;
    const isAuthenticated = Boolean(state.auth?.isAuthenticated);
    const shouldLoadAccess = !isTeacherManage && isAuthenticated;

    try {
      const [res, accessRes] = await Promise.all([
        apiInstance.get<unknown[]>(listUrl),
        shouldLoadAccess
          ? apiInstance.get<AccessRow[]>(API_ENDPOINTS.subscriptions.myAccess)
          : Promise.resolve(null),
      ]);

      const raw = Array.isArray(res.data) ? res.data : [];
      const accessRows = Array.isArray(accessRes?.data) ? accessRes.data : [];
      /**
       * The kind of access, not merely whether there is one.
       *
       * The public catalogue is the same cached response for every visitor and carries no
       * `my_access` field, so this list is the only way the catalogue can learn that what
       * a student holds on a course is a trial. It was already being fetched and the type
       * thrown away - which is why a student on a trial was shown the same card as someone
       * who had bought the course, with no price on it and nothing left to buy.
       */
      const accessTypeByCourseId = new Map<string, string>();
      for (const row of accessRows) {
        const courseId = readAccessCourseId(row);
        if (!courseId) continue;
        const accessType = String(row.access_type ?? row.accessType ?? '');
        /** Paid access wins over a trial row on the same course, never the other way. */
        if (accessType === 'trial' && accessTypeByCourseId.has(courseId)) continue;
        accessTypeByCourseId.set(courseId, accessType);
      }

      const items = raw.map((row) => {
        const card = mapApiCourseToCourseCard(row as CatalogCourse);
        const accessType = accessTypeByCourseId.get(card.id);
        const hasAccess = card.isAdded === true || accessType !== undefined;
        return {
          ...card,
          isAdded: hasAccess,
          accessIsTrial: card.accessIsTrial === true || accessType === 'trial',
        };
      });

      return {
        items,
        totalCount: items.length,
        fetchKey: buildCatalogFetchKey(state),
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Network error while loading courses';

      return rejectWithValue(message);
    }
  },
  {
    condition: (arg, { getState }) => {
      if (arg?.force) return true;
      const state = getState() as {
        coursesCatalog: {
          lastFetchKey: string | null;
          lastFetchAt: number | null;
          items: unknown[];
        };
      };
      const { lastFetchKey, lastFetchAt, items } = state.coursesCatalog;
      if (!lastFetchAt || items.length === 0) return true;
      if (lastFetchKey !== buildCatalogFetchKey(state)) return true;
      return Date.now() - lastFetchAt >= CATALOG_CLIENT_TTL_MS;
    },
  },
);
