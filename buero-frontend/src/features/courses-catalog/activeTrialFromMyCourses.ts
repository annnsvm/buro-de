import type { CatalogCourse } from '@/types/api/myLearningCourses.types';

type AccessRow = {
  course_id?: string;
  courseId?: string;
  access_type?: string;
  accessType?: string;
  trial_ends_at?: string | Date | null;
  trialEndsAt?: string | Date | null;
};

/** Trials do not expire, so a trial row is always an active one. */
const isActiveTrial = (accessType: string | undefined) => accessType === 'trial';

export const getActiveTrialCourseIdFromAccess = (rows: AccessRow[]): string | null => {
  for (const row of rows) {
    const accessType = row.access_type ?? row.accessType;
    if (!isActiveTrial(accessType)) continue;
    const id = row.course_id ?? row.courseId;
    if (id) return String(id);
  }
  return null;
};

export const getActiveTrialCourseIdFromMyCourses = (mine: CatalogCourse[]): string | null => {
  for (const row of mine) {
    const ma = row.my_access as { access_type?: string } | undefined;
    if (!ma || !isActiveTrial(ma.access_type)) continue;
    return String(row.id);
  }
  return null;
};
