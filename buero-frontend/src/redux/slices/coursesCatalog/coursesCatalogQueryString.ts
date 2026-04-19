import type { CoursesCatalogFilters } from './coursesCatalogSlice';

export const catalogFilterTabToApiQuery = (
  tabId: string,
): { tags?: string; level?: string } => {
  switch (tabId) {
    case 'language':
      return { tags: 'Language' };
    case 'integration':
      return { tags: 'Integration' };
    case 'sociocultural':
      return { tags: 'Culture & Life' };
    case 'beginner':
      return { tags: 'Beginner' };
    case 'middle':
    case 'B1':
      return { level: 'B1' };
    case 'advanced':
    case 'B2':
      return { level: 'B2' };
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
    const { tags, level } = catalogFilterTabToApiQuery(tab);
    if (tags) params.set('tags', tags);
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
