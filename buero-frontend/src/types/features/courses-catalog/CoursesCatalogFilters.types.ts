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
  isResultsCountPending?: boolean;
  besideCountSlot?: ReactNode;
  /**
   * The whole CEFR ladder, each level marked with whether any course covers it.
   *
   * All of them are shown, so a visitor can see the range the platform runs to, but a
   * level with nothing behind it cannot be pressed — an empty page would read as "there
   * are no courses" rather than as "none at that level yet".
   */
  levels?: readonly { level: string; available: boolean }[];
  activeLevel?: string | null;
  onLevelChange?: (level: string | null) => void;
  /** Rendered inside the bar, so the page has one search box rather than two. */
  searchSlot?: ReactNode;
  /** Keeps the bar in view while the list scrolls past it. */
  sticky?: boolean;
};
