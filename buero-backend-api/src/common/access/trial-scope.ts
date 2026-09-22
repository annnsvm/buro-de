import { PrismaService } from "../../prisma/prisma.service";

/**
 * How many modules from the start of a course a trial unlocks.
 *
 * Module 0 carries the "how to study on this course" instructions and module 1 is
 * the first real teaching module, so a trial has to cover both to be worth anything.
 *
 * The rule is positional on purpose — nothing has to be flagged per course — which
 * also means reordering modules silently moves the free boundary. That is the whole
 * reason this number and the lookup live in one place instead of being repeated in
 * every service that enforces access.
 */
export const TRIAL_FREE_MODULE_COUNT = 2;

/** Ids of the modules a trial opens, in display order. */
export const getTrialModuleIds = async (
  prisma: PrismaService,
  courseId: string,
): Promise<string[]> => {
  const modules = await prisma.courseModule.findMany({
    where: { courseId },
    orderBy: { orderIndex: "asc" },
    take: TRIAL_FREE_MODULE_COUNT,
    select: { id: true },
  });
  return modules.map((mod) => mod.id);
};

/**
 * A trial does not expire. Registering is the only thing it asks for, and after that
 * the opening modules stay open indefinitely — it is a standing free tier, not a
 * countdown to a purchase. Nothing reads user_course_access.trial_ends_at any more;
 * the column is left in place in case a time-limited promotion is ever wanted.
 */
