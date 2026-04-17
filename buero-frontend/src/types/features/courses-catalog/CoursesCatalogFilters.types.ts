import type { ReactNode } from 'react';

export type CoursesCatalogFilterTab = {
  id: string;
  label: string;
};

export type CoursesCatalogFiltersProps = {
  filters: CoursesCatalogFilterTab[];
  activeFilterId: string;
  onFilterChange: (id: string) => void;
  totalCount: number;
  /** Поки йде перший запит каталогу — не показувати «0 courses found». */
  isResultsCountPending?: boolean;
  /** Контент праворуч поруч із «N courses found» (наприклад, поле пошуку). */
  besideCountSlot?: ReactNode;
};
