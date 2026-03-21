import React, { useCallback, useEffect, useRef } from 'react';
import { CoursesCatalogFilters } from '@/features/courses-catalog';
import { MyCoursesList } from '@/features/my-courses-catalog';
import { useSelector } from 'react-redux';
import {
  fetchCoursesCatalogThunk,
  selectCoursesCatalogItems,
  setFilters,
} from '@/redux/slices/coursesCatalog';
import { useAppDispatch } from '@/redux/hooks';
import {
  selectCoursesCatalogFilters,
  selectCoursesCatalogTotalCount,
} from '@/redux/slices/coursesCatalog/coursesCatalogSelectors';
import { Input } from '@/components/ui';

const filterTabs = [
  { id: 'all', label: 'All Courses' },
  { id: 'language', label: 'Language' },
  { id: 'integration', label: 'Integration' },
  { id: 'sociocultural', label: 'Culture & Life' },
];

const MyLearningPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const courses = useSelector(selectCoursesCatalogItems);
  const totalCount = useSelector(selectCoursesCatalogTotalCount);
  const filters = useSelector(selectCoursesCatalogFilters);
  const filtersRef = useRef(filters);

  const activeFilterId =
    filters.category === 'language'
      ? 'language'
      : filters.category === 'integration'
        ? 'integration'
        : filters.category === 'sociocultural'
          ? 'sociocultural'
          : 'all';

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    dispatch(fetchCoursesCatalogThunk());
  }, [dispatch, filters]);

  const handleFilterChange = (id: string) => {
    if (id === 'all') {
      dispatch(setFilters({ ...filters, category: undefined }));
    } else if (id === 'language') {
      dispatch(setFilters({ ...filters, category: 'language' }));
    } else if (id === 'integration') {
      dispatch(setFilters({ ...filters, category: 'integration' }));
    } else if (id === 'sociocultural') {
      dispatch(setFilters({ ...filters, category: 'sociocultural' }));
    }
  };

  const handleSearchChange = useCallback(
    (search: string) => {
      dispatch(
        setFilters({
          ...filtersRef.current,
          search: search.trim() || undefined,
        }),
      );
    },
    [dispatch],
  );
  return (
    <div className="min-h-screen bg-[var(--color-soapstone-base)] pt-31">
      <CoursesCatalogFilters
        filters={filterTabs}
        activeFilterId={activeFilterId}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
        besideCountSlot={
          <div className="flex w-full flex-col gap-1">
            <Input
              id="my-learning-search"
              name="search"
              value={filters.search ?? ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full"
            />
          </div>
        }
      />
      <MyCoursesList courses={courses} />
    </div>
  );
};

export default MyLearningPage;
