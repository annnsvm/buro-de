import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Three, and every one of them means something on the real catalogue.
 *
 * There were seven. Four of them were broken against the actual data: "Culture & Life"
 * and "Advanced" matched a tag and a level no course had, so both always returned an
 * empty screen; "Beginner" matched a tag every course carried, so it duplicated "All
 * courses" — and included a B1 course. A filter that empties the page teaches the
 * visitor that there are no courses.
 *
 * Levels are deliberately not here. They belong to the `level` column rather than to the
 * tags, and they are only worth offering once there are several courses at each level —
 * at which point they come back as levels, not as tags called "beginner".
 */
const BASE_FILTER_IDS = ['all', 'language', 'integration'] as const;

const TEACHER_FILTER_IDS = ['published', 'unpublished'] as const;

export type CatalogFilterTab = {
  id: string;
  label: string;
};

export const useCatalogFilterTabs = (role: string | null | undefined): CatalogFilterTab[] => {
  const { t } = useTranslation();

  return useMemo(() => {
    const base = BASE_FILTER_IDS.map((id) => ({
      id,
      label: t(`courses.filters.${id}`),
    }));

    if (role === 'teacher') {
      return [
        ...base,
        ...TEACHER_FILTER_IDS.map((id) => ({
          id,
          label: t(`courses.filters.${id}`),
        })),
      ];
    }

    return base;
  }, [role, t]);
};
