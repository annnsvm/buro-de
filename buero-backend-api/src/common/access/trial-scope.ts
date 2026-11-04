import { PrismaService } from "../../prisma/prisma.service";

/**
 * How many modules from the start of a course a trial opens, when the course says nothing.
 *
 * Two, because module 0 carries the "how to study on this course" instructions and module 1
 * is the first real teaching module, so a trial has to cover both to be worth anything. It is
 * the column's default as well, which is why every course that existed before the column did
 * keeps the access it had.
 *
 * It is only the default. The number that decides anything is `course.trialModuleCount`, and
 * it belongs to the course because the right answer depends on how long the course is: two
 * modules out of nine is a sample, two out of two is the course given away. Read it through
 * `getTrialModuleIds` rather than reaching for this constant.
 */
export const DEFAULT_TRIAL_FREE_MODULES = 2;

/**
 * Ids of the modules a trial opens, in display order.
 *
 * Positional on purpose - nothing has to be flagged per module - which also means reordering
 * modules silently moves the free boundary. That, and the fact that the count now varies by
 * course, is the whole reason this lookup lives in one place instead of being repeated in
 * every service that enforces access.
 *
 * An empty result means a trial opens nothing, and every caller must read it that way. It is
 * not "no restriction": a course whose count is 0 sells from the first module, and a guard
 * that skipped the check on an empty list would hand such a course over in full.
 */
export const getTrialModuleIds = async (
  prisma: PrismaService,
  courseId: string,
): Promise<string[]> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { trialModuleCount: true },
  });
  const count = course?.trialModuleCount ?? DEFAULT_TRIAL_FREE_MODULES;
  if (count <= 0) return [];

  const modules = await prisma.courseModule.findMany({
    where: { courseId },
    orderBy: { orderIndex: "asc" },
    take: count,
    select: { id: true },
  });
  return modules.map((mod) => mod.id);
};

/**
 * A trial does not expire. Registering is the only thing it asks for, and after that
 * the opening modules stay open indefinitely - it is a standing free tier, not a
 * countdown to a purchase. Nothing reads user_course_access.trial_ends_at any more;
 * the column is left in place in case a time-limited promotion is ever wanted.
 */
