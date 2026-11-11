import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { fetchCoursesCatalogThunk } from './coursesCatalogThunks';

export type PublicationFilter = 'all' | 'published' | 'unpublished';

export type CoursesCatalogFilters = {
  search?: string;
  /**
   * Which catalogue tab is open: 'language', 'integration', or a level. Absent for "all
   * courses", which is why the page clears it rather than naming a tab.
   *
   * It was called `tags` while the tabs were described with course tags. They are not any
   * more - the tracks are a column on the course - and the tags themselves are gone, so a
   * field named after them would be the last thing still pointing at something removed.
   */
  tab?: string;
  language?: string;
  publicationStatus?: PublicationFilter;
  category?: string;
};

export type CoursesCatalogState = {
  items: CourseCardProps[];
  filters: CoursesCatalogFilters;
  totalCount: number;
  page: number;
  pageSize: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchKey: string | null;
  lastFetchAt: number | null;
};

const initialState: CoursesCatalogState = {
  items: [],
  filters: {},
  totalCount: 0,
  page: 1,
  pageSize: 12,
  status: 'idle',
  error: null,
  lastFetchKey: null,
  lastFetchAt: null,
};

const coursesCatalogSlice = createSlice({
  name: 'coursesCatalog',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CoursesCatalogFilters>) => {
      state.filters = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {};
      state.page = 1;
    },
    resetCoursesCatalog: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.status = 'idle';
      state.error = null;
      state.lastFetchKey = null;
      state.lastFetchAt = null;
    },
    setCatalogItemOrder: (state, action: PayloadAction<CourseCardProps[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesCatalogThunk.pending, (state) => {
        if (state.items.length === 0) {
          state.status = 'loading';
        }
        state.error = null;
      })
      .addCase(fetchCoursesCatalogThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.lastFetchKey = action.payload.fetchKey;
        state.lastFetchAt = Date.now();
      })
      .addCase(fetchCoursesCatalogThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to load courses';
      });
  },
});

export const coursesCatalogReducer = coursesCatalogSlice.reducer;
export const { setFilters, setPage, resetFilters, resetCoursesCatalog, setCatalogItemOrder } =
  coursesCatalogSlice.actions;
