import { describe, expect, it } from 'vitest';

import {
  coursesCatalogReducer,
  resetFilters,
  setFilters,
  setPage,
} from '@/redux/slices/coursesCatalog/coursesCatalogSlice';

describe('coursesCatalogSlice', () => {
  it('setFilters replaces filters and resets page to 1', () => {
    let state = coursesCatalogReducer(undefined, setPage(5));
    expect(state.page).toBe(5);

    state = coursesCatalogReducer(state, setFilters({ tags: 'beginner' }));
    expect(state.filters.tags).toBe('beginner');
    expect(state.page).toBe(1);
  });

  it('resetFilters clears filters and resets page', () => {
    let state = coursesCatalogReducer(undefined, setFilters({ search: 'german' }));
    state = coursesCatalogReducer(state, setPage(3));
    state = coursesCatalogReducer(state, resetFilters());
    expect(state.filters).toEqual({});
    expect(state.page).toBe(1);
  });
});
