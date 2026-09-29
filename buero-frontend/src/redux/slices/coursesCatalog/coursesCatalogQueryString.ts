import type { CoursesCatalogFilters } from './coursesCatalogSlice';

/**
 * What each catalogue tab asks the server for.
 *
 * "Language" is expressed as everything that is not integration rather than as a
 * `Language` tag. The tag had to be applied by hand and mostly had not been, so the
 * filter showed one language course out of three. Stated negatively it stays true on its
 * own: a new course is a language course until it is tagged as integration.
 */
export const catalogFilterTabToApiQuery = (
  tabId: string,
): { tags?: string; tags_exclude?: string; level?: string } => {
  switch (tabId) {
    case 'language':
      return { tags_exclude: 'Integration' };
    case 'integration':
      return { tags: 'Integration' };
    /** Levels are matched on the course's own level, never on a tag of the same name. */
    case 'A1':
    case 'A2':
    case 'B1':
    case 'B2':
    case 'C1':
      return { level: tabId };
    default:
      return { tags: tabId };
  }
};

export const buildCoursesCatalogQueryString = (
  filters: CoursesCatalogFilters,
  isTeacherManage: boolean,
): string => {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set('search', filters.search.trim());
  const tab = filters.tags?.trim();
  if (tab) {
    const { tags, tags_exclude, level } = catalogFilterTabToApiQuery(tab);
    if (tags) params.set('tags', tags);
    if (tags_exclude) params.set('tags_exclude', tags_exclude);
    if (level) params.set('level', level);
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
