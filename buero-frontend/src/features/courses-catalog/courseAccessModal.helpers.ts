/** Trials do not expire, so a trial row is always an active one. */
const isActiveTrialRow = (row: Record<string, unknown>): boolean =>
  String(row.accessType ?? row.access_type ?? '') === 'trial';

export const getActiveTrialCourseIdFromAccessList = (accessList: unknown[]): string | null => {
  for (const raw of accessList) {
    if (!raw || typeof raw !== 'object') continue;
    const row = raw as Record<string, unknown>;
    if (!isActiveTrialRow(row)) continue;
    const cid =
      typeof row.courseId === 'string'
        ? row.courseId
        : typeof row.course_id === 'string'
          ? row.course_id
          : null;
    if (cid) return cid;
  }
  return null;
};

export const userHasAccessToCourse = (accessList: unknown[], courseId: string): boolean => {
  for (const raw of accessList) {
    if (!raw || typeof raw !== 'object') continue;
    const row = raw as Record<string, unknown>;
    const cid =
      typeof row.courseId === 'string'
        ? row.courseId
        : typeof row.course_id === 'string'
          ? row.course_id
          : null;
    if (cid !== courseId) continue;

    const accessType = String(row.accessType ?? row.access_type ?? '');

    if (
      accessType === 'trial' ||
      accessType === 'purchase' ||
      accessType === 'subscription'
    ) {
      return true;
    }
  }
  return false;
};
