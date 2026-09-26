import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchMyLearningCoursesFromCatalog,
  filterMyLearningCourses,
  peekMyLearningCourses,
} from '@/api/myLearningCourses';
import { CoursesCatalogFilters, CoursesCatalogGridSkeleton } from '@/features/courses-catalog';
import { MyCoursesList } from '@/features/my-courses-catalog';
import { useSelector } from 'react-redux';
import { setFilters } from '@/redux/slices/coursesCatalog';
import { useAppDispatch } from '@/redux/hooks';
import { selectCoursesCatalogFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSelectors';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import type {
  MyLearningCatalogFilterTab,
  MyLearningLoadStatus,
} from '@/types/pages/MyLearningPage/MyLearningPage.types';
import { Input } from '@/components/ui';
import { fetchMyProgress } from '@/api/progressApi';
import { useTranslation } from 'react-i18next';

/**
 * The same four categories the catalogue offers, by the same ids — so the two pages
 * cannot drift apart, and so the labels come from the translations rather than being
 * written out again in English on a Ukrainian page.
 */
const FILTER_IDS = ['all', 'language', 'integration', 'sociocultural'] as const;

const MyLearningPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filterTabs: MyLearningCatalogFilterTab[] = useMemo(
    () => FILTER_IDS.map((id) => ({ id, label: t(`courses.filters.${id}`) })),
    [t],
  );
  const filters = useSelector(selectCoursesCatalogFilters);
  const filtersRef = useRef(filters);

  const [myCourses, setMyCourses] = useState<CourseInfoData[]>(
    () => peekMyLearningCourses() ?? [],
  );
  const [loadStatus, setLoadStatus] = useState<MyLearningLoadStatus>(() =>
    peekMyLearningCourses() ? 'idle' : 'loading',
  );
  /**
   * Progress is fetched beside the courses rather than with them: it is the student's
   * own record, not part of the catalogue, and a failure to read it should leave the
   * list working without the bars rather than empty.
   */
  const [progressByCourseId, setProgressByCourseId] = useState<
    ReadonlyMap<string, { percent: number; completed: number; total: number }>
  >(() => new Map());

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
    let cancelled = false;
    const loadProgress = async () => {
      try {
        const { courses } = await fetchMyProgress();
        if (cancelled) return;
        setProgressByCourseId(
          new Map(
            courses.map((row) => [
              row.course_id,
              {
                percent: row.completion_percent,
                completed: row.completed_materials_count,
                total: row.total_materials_count,
              },
            ]),
          ),
        );
      } catch {
        // The list is still usable without the bars.
      }
    };
    void loadProgress();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!peekMyLearningCourses()) {
        setLoadStatus('loading');
      }
      try {
        const data = await fetchMyLearningCoursesFromCatalog();
        if (!cancelled) {
          setMyCourses(data);
          setLoadStatus('idle');
        }
      } catch {
        if (!cancelled && !peekMyLearningCourses()) setLoadStatus('error');
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleCourses = useMemo(
    () => filterMyLearningCourses(myCourses, filters),
    [myCourses, filters],
  );
  const totalCount = visibleCourses.length;

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
        isResultsCountPending={loadStatus === 'loading'}
        besideCountSlot={
          <div className="flex w-full flex-col gap-1">
            <Input
              id="my-learning-search"
              name="search"
              value={filters.search ?? ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('courses.searchPlaceholder')}
              className="w-full"
            />
          </div>
        }
      />
      {loadStatus === 'loading' ? (
        <CoursesCatalogGridSkeleton
          sectionClassName="bg-white"
          loadingLabel={t('myLearning.loading')}
        />
      ) : loadStatus === 'error' ? (
        <p className="py-12 text-center text-[var(--color-error)]">{t('myLearning.loadFailed')}</p>
      ) : (
        <MyCoursesList courses={visibleCourses} progressByCourseId={progressByCourseId} />
      )}
    </div>
  );
};

export default MyLearningPage;
