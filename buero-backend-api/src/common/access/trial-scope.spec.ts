import { PrismaService } from "../../prisma/prisma.service";
import { DEFAULT_TRIAL_FREE_MODULES, getTrialModuleIds } from "./trial-scope";

/**
 * What a trial opens, now that the number belongs to the course.
 *
 * The case that matters most is zero. It used to be unreachable - the count was a constant 2,
 * so an empty list only happened for a course with no modules - and the callers took an empty
 * list to mean "nothing to restrict". A teacher can now ask for zero free modules, and these
 * tests pin down that zero means zero rather than everything.
 */
describe("getTrialModuleIds", () => {
  const courseId = "cccccccc-cccc-cccc-cccc-cccccccccccc";

  const prismaWith = (
    course: { trialModuleCount: number } | null,
    moduleIds: string[],
  ) => {
    const findMany = jest.fn().mockImplementation(({ take }: { take: number }) =>
      Promise.resolve(moduleIds.slice(0, take).map((id) => ({ id }))),
    );
    const prisma = {
      course: { findUnique: jest.fn().mockResolvedValue(course) },
      courseModule: { findMany },
    } as unknown as PrismaService;
    return { prisma, findMany };
  };

  it("opens the first N modules in display order, where N is the course's own figure", async () => {
    const { prisma } = prismaWith({ trialModuleCount: 1 }, ["m1", "m2", "m3"]);

    await expect(getTrialModuleIds(prisma, courseId)).resolves.toEqual(["m1"]);
  });

  it("opens nothing when the course sells from its first module", async () => {
    const { prisma, findMany } = prismaWith({ trialModuleCount: 0 }, ["m1", "m2"]);

    await expect(getTrialModuleIds(prisma, courseId)).resolves.toEqual([]);
    /** No point asking for zero rows - and `take: 0` is not a query worth sending. */
    expect(findMany).not.toHaveBeenCalled();
  });

  it("never opens more modules than the course has", async () => {
    const { prisma } = prismaWith({ trialModuleCount: 5 }, ["m1", "m2"]);

    await expect(getTrialModuleIds(prisma, courseId)).resolves.toEqual(["m1", "m2"]);
  });

  it("falls back to the default when the course row carries no figure", async () => {
    const { prisma, findMany } = prismaWith(null, ["m1", "m2", "m3"]);

    await expect(getTrialModuleIds(prisma, courseId)).resolves.toEqual(["m1", "m2"]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: DEFAULT_TRIAL_FREE_MODULES }),
    );
  });

  it("reads the modules of this course only, and in display order", async () => {
    const { prisma, findMany } = prismaWith({ trialModuleCount: 2 }, ["m1", "m2"]);

    await getTrialModuleIds(prisma, courseId);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { courseId },
        orderBy: { orderIndex: "asc" },
      }),
    );
  });
});
