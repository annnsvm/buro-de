import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout';
import type { CoursesCatalogFiltersProps } from '@/types/features/courses-catalog/CoursesCatalogFilters.types';

/**
 * The bar that narrows the catalogue.
 *
 * Two controls, on the two questions a visitor actually has: what kind of course, and at
 * what level. They are different kinds of choice, so they look different — the kind is a
 * segmented switch where exactly one option is always on, the level a row of chips that
 * can be cleared by pressing the one already chosen.
 *
 * Only levels some course covers are offered. A chip that empties the page is worse than
 * no chip: the visitor reads it as "this shop is empty", not "nothing at B2 yet".
 */
const CoursesCatalogFilters = ({
  filters,
  activeFilterId,
  onFilterChange,
  totalCount,
  isResultsCountPending = false,
  besideCountSlot,
  levels = [],
  activeLevel = null,
  onLevelChange,
  searchSlot,
  sticky = false,
}: CoursesCatalogFiltersProps) => {
  const { t } = useTranslation();
  /** Shown as soon as anything can be narrowed by level at all. */
  const showLevels =
    levels.some((entry) => entry.available) && Boolean(onLevelChange);

  return (
    <section
      className={[
        'border-y border-[var(--color-border-subtle)] bg-[var(--color-soapstone-base)]/95 backdrop-blur-sm',
        sticky ? 'sticky top-0 z-20' : '',
      ].join(' ')}
    >
      <Container>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
          {searchSlot ? (
            <div className="w-full min-w-0 sm:w-[240px] sm:shrink-0">{searchSlot}</div>
          ) : null}

          {/* One of these is always on, so it reads as a switch rather than as toggles. */}
          <div
            className="flex gap-0.5 rounded-full bg-[var(--color-surface-section)] p-1"
            role="group"
            aria-label={t('courses.filterByKind')}
          >
            {filters.map((filter) => {
              const isActive = filter.id === activeFilterId;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onFilterChange(filter.id)}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-bold transition-colors',
                    isActive
                      ? 'bg-[var(--color-cod-gray-base)] text-[var(--color-text-on-accent)]'
                      : 'text-[var(--color-text-primary)] hover:text-[var(--color-neutral-darkest)]',
                  ].join(' ')}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {showLevels ? (
            <div className="flex items-center gap-1.5">
              <span className="mr-1.5 text-xs font-bold tracking-[0.06em] uppercase text-[var(--color-text-secondary)]">
                {t('courses.level')}
              </span>
              {levels.map(({ level, available }) => {
                const isActive = level === activeLevel;
                return (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={isActive}
                    /**
                     * A level nothing covers is shown but cannot be pressed, so the ladder
                     * reads whole while an empty result stays unreachable.
                     */
                    disabled={!available}
                    title={available ? undefined : t('courses.levelHasNoCourses')}
                    /** Pressing the chosen level clears it, so there is a way back to all. */
                    onClick={() => onLevelChange?.(isActive ? null : level)}
                    className={[
                      'h-9 min-w-9 rounded-full border px-3 text-xs font-bold transition-colors',
                      !available
                        ? 'cursor-not-allowed border-[var(--color-border-subtle)] bg-transparent text-[var(--color-dawn-pink-dark)]'
                        : isActive
                          ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-[var(--color-neutral-darkest)]'
                          : 'border-[var(--color-border-default)] bg-[var(--color-neutral-white)] text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]',
                    ].join(' ')}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          ) : null}

          {besideCountSlot ? (
            <div className="min-w-0 sm:max-w-[min(100%,320px)]">{besideCountSlot}</div>
          ) : null}

          <p
            className="basis-full shrink-0 text-right text-sm font-semibold whitespace-nowrap text-[var(--color-text-secondary)] sm:ml-auto sm:w-auto sm:basis-auto"
            aria-live="polite"
            aria-busy={isResultsCountPending}
          >
            {isResultsCountPending
              ? t('courses.loadingResults')
              : t('courses.courseFound', { count: totalCount })}
          </p>
        </div>
      </Container>
    </section>
  );
};

export default CoursesCatalogFilters;
