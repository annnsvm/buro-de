import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CoursesCatalogHero,
  CoursesCatalogFilters,
  CoursesCatalogList,
  CoursesCatalogGridSkeleton,
} from '@/features/courses-catalog';
import { useCatalogFilterTabs } from '@/features/courses-catalog/useCatalogFilterTabs';
import CourseSearch from '@/features/courses-catalog/CourseSearch';
import WhereToStart from '@/features/courses-catalog/WhereToStart';
import {
  availableLevels,
  coversLevel,
  levelAvailability,
} from '@/features/courses-catalog/catalogSections';

import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCoursesCatalogItems,
  selectCoursesCatalogFilters,
  selectCoursesCatalogStatus,
} from '@/redux/slices/coursesCatalog/coursesCatalogSelectors';
import { setFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSlice';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import { selectUserRole } from '@/redux/slices/user/userSelectors';

const CoursesCatalogPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const courses = useSelector(selectCoursesCatalogItems);

  const filters = useSelector(selectCoursesCatalogFilters);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const filtersRef = useRef(filters);
  /** Kept out of redux: it narrows what was fetched rather than what is fetched. */
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  const catalogStatus = useSelector(selectCoursesCatalogStatus);
  /** Asked six times over; narrowing it once also keeps the comparisons off the JSX. */
  const isTeacher = role === 'teacher';
  const catalogAudience = isTeacher ? 'teacher' : 'catalog';

  const isCatalogPending =
    catalogStatus === 'loading' ||
    (catalogStatus === 'idle' && courses.length === 0);

  const showCatalogGridSkeleton = courses.length === 0 && isCatalogPending && role !== 'teacher';

  const filterTabs = useCatalogFilterTabs(role);
  const activeFilterId = (() => {
    if (isTeacher) {
      switch (filters.publicationStatus) {
        case 'published':
        case 'unpublished':
          return filters.publicationStatus;
      }
    }

    switch (filters.tags) {
      case 'language':
      case 'integration':
        return filters.tags;
      default:
        return 'all';
    }
  })();

  useEffect(() => {
    void dispatch(fetchCoursesCatalogThunk());
  }, [dispatch, filters, catalogAudience, isAuthenticated]);


  const coursesAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToCourses = useCallback(() => {
    requestAnimationFrame(() => {
      coursesAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleFilterChange = (id: string) => {
    switch (id) {
      case 'published':
      case 'unpublished':
        if (isTeacher) {
          dispatch(
            setFilters({
              ...filters,
              publicationStatus: id,
              tags: undefined,
            })
          );
        }
        break;
  
      case 'all':
        dispatch(
          setFilters({
            ...filters,
            tags: undefined,
            publicationStatus: undefined,
          })
        );
        break;
  
      case 'language':
      case 'integration':
        dispatch(
          setFilters({
            ...filters,
            tags: id, 
            publicationStatus: undefined,
          })
        );
        break;
    }
    scrollToCourses();
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

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  /**
   * The level narrows the list here rather than on the server.
   *
   * Asking the server would return only the courses at that level, and the chips are built
   * from what the list contains — so choosing A2 would leave A2 as the only chip and no way
   * back to the others. Narrowing after the fetch keeps every chip on screen. The catalogue
   * is served whole today; when it is paginated the chips will need a facet of their own.
   */
  /** The ladder for the chips, and the subset that can actually be chosen. */
  const levels = useMemo(() => levelAvailability(courses), [courses]);
  const offerableLevels = useMemo(() => availableLevels(courses), [courses]);

  const handleLevelChange = useCallback((level: string | null) => {
    setActiveLevel(level);
    scrollToCourses();
  }, [scrollToCourses]);

  /** An answer points at a course below the fold; bring that course into view. */
  const handleWhereToStart = useCallback((level: string | null) => {
    setActiveLevel(level);
    if (!level) return;
    scrollToCourses();
  }, [scrollToCourses]);

  const visibleCourses = useMemo(
    () =>
      activeLevel ? courses.filter((course) => coversLevel(course, activeLevel)) : courses,
    [courses, activeLevel],
  );

  /** The chooser points at a level; every course covering it is what gets ringed. */
  const recommendedCourseIds = useMemo(
    () => (activeLevel ? visibleCourses.map((course) => course.id) : []),
    [visibleCourses, activeLevel],
  );

  return (
    <div aria-label={t('courses.pageLabel')}>
      <CoursesCatalogHero
        whereToStartSlot={
          isTeacher ? null : (
            <WhereToStart
              availableLevels={offerableLevels}
              chosenLevel={activeLevel}
              onChoose={handleWhereToStart}
            />
          )
        }
      />
      {/**
       * Search lives in this bar and nowhere else. It used to sit in the hero while the
       * sibling "my learning" page kept it beside the count, so the same control was in two
       * places on two pages that look alike.
       */}
      <CoursesCatalogFilters
        sticky
        filters={filterTabs}
        activeFilterId={activeFilterId}
        onFilterChange={handleFilterChange}
        totalCount={visibleCourses.length}
        isResultsCountPending={isCatalogPending}
        levels={levels}
        activeLevel={activeLevel}
        onLevelChange={handleLevelChange}
        searchSlot={
          <CourseSearch
            onSearch={handleSearchChange}
            initialSearch={filters.search ?? ''}
          />
        }
      />

      <div ref={coursesAnchorRef} className="scroll-mt-24">
        {showCatalogGridSkeleton ? (
          <CoursesCatalogGridSkeleton withTeacherCreateSlot={isTeacher} />
        ) : visibleCourses.length > 0 || isTeacher ? (
          <CoursesCatalogList
            courses={visibleCourses}
            canReorderCourses={
              isTeacher && activeFilterId === 'all' && !filters.search?.trim()
            }
            recommendedCourseIds={recommendedCourseIds}
          />
        ) : (
          <div className="flex items-center justify-center py-20 text-lg text-[var(--color-text-primary)]">
            <p>{t('courses.emptyState')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesCatalogPage;
