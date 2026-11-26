/**
 * Which kind of access the student has to one course: the whole thing, a trial, or none.
 *
 * `userHasAccessToCourse` below answers only whether there is any at all, and that is the
 * question both the catalogue card and the course modal used to ask. It is the wrong one
 * for a screen that offers to sell the course: a student on a trial answered yes, so they
 * were shown a buyer's screen - "continue learning", no price, and the checkout button
 * gone. There was no way to buy a course once the free part of it had been opened.
 */
export type CourseAccessKind = 'none' | 'trial' | 'full';

export const courseAccessKind = (
  accessList: unknown[],
  courseId: string,
): CourseAccessKind => {
  let kind: CourseAccessKind = 'none';

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

    /**
     * Paid access settles it immediately. A student who starts a trial and then buys can
     * hold both rows, and reading them in list order would otherwise let the trial decide.
     */
    if (accessType === 'purchase' || accessType === 'subscription') return 'full';
    if (accessType === 'trial') kind = 'trial';
  }

  return kind;
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
