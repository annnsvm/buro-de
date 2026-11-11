import type { CoursesCatalogFilters } from './coursesCatalogSlice';

/**
 * What each catalogue tab asks the server for.
 *
 * The two track tabs ask on the course's own `integration` flag. They used to be described
 * with tags - `tags_exclude=Integration` for one and `tags=Integration` for the other - and
 * the server compared that tag exactly while the page compared it lowercased, so the two
 * disagreed about any course whose tag was not capitalised just so. Tags are gone entirely,
 * so no tag parameter is sent any more.
 */
export const catalogFilterTabToApiQuery = (
  tabId: string,
): { level?: string; integration?: boolean } => {
  switch (tabId) {
    case 'language':
      return { integration: false };
    case 'integration':
      return { integration: true };
    /** Levels are matched on the course's own level, and never were on a tag. */
    case 'A1':
    case 'A2':
    case 'B1':
    case 'B2':
    case 'C1':
      return { level: tabId };
    /**
     * Not a filter this build offers. "All courses" never reaches here - the page clears
     * the tab instead of naming one - and anything else would once have been read as a tag.
     */
    default:
      return {};
  }
};

export const buildCoursesCatalogQueryString = (
  filters: CoursesCatalogFilters,
  isTeacherManage: boolean,
): string => {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set('search', filters.search.trim());
  const tab = filters.tab?.trim();
  if (tab) {
    const { level, integration } = catalogFilterTabToApiQuery(tab);
    if (level) params.set('level', level);
    /** False is a real answer here - "the language half" - so it is sent, not skipped. */
    if (integration !== undefined) params.set('integration', String(integration));
  }
  if (
    isTeacherManage &&
    filters.publicationStatus &&
    filters.publicationStatus !== 'all'
  ) {
    params.set('publication_status', filters.publicationStatus);
  }

  return params.toString();
};
