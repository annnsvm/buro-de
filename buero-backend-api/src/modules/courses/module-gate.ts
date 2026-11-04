/**
 * How far through a course a student has actually got, measured by its tests.
 *
 * This was written as a gate - a module stayed shut until the one before it had been
 * passed - and the author took that out. Her students are adults who buy the level they
 * believe they are at, and plenty of them are already halfway through it; telling someone
 * who bought the course to revise module 6 that they must first sit five tests is how you
 * lose them. A module they paid for opens, full stop.
 *
 * What the walk is still good for is advice. The first unpassed test is the one a student
 * reading further ahead might want to take, and naming it costs them a line they can
 * ignore. Nothing here closes anything any more.
 */

export type GateModule = {
  id: string;
  /** The module's final test, when it has one. */
  test: { id: string; passingScore: number | null } | null;
};

export type GateAttempt = {
  courseMaterialId: string;
  /** Null for a sitting that was never finished, which cannot have passed. */
  score: number | null;
  completedAt: Date | null;
};

/**
 * A test counts as passed at the mark the author set, and at any mark at all when she set
 * none - a test with no threshold is one she wrote to be taken, not to be survived.
 */
export const passedTest = (
  test: { passingScore: number | null },
  attempts: readonly GateAttempt[],
): boolean =>
  attempts.some(
    (attempt) =>
      attempt.completedAt !== null &&
      attempt.score !== null &&
      (test.passingScore == null || attempt.score >= test.passingScore),
  );

export type ModuleGate = {
  /** The modules the student has worked up to, in the course's own order. */
  open: ReadonlySet<string>;
  /** For a module further ahead, the test it builds on and has not been passed. */
  blockedBy: ReadonlyMap<string, string>;
};

/**
 * Walks the modules in order and stops at the first test that has not been passed.
 *
 * Everything after a closed module is closed too, whatever its own test says: a student who
 * cannot open module 3 cannot have passed module 3's test, so letting module 4 through on a
 * technicality would open the rest of the course.
 */
export const openModules = (
  modules: readonly GateModule[],
  attemptsByMaterial: ReadonlyMap<string, readonly GateAttempt[]>,
): ModuleGate => {
  const open = new Set<string>();
  const blockedBy = new Map<string, string>();
  /** The test that has to be passed before anything further opens, once one is found. */
  let stoppedAt: string | null = null;

  for (const module of modules) {
    if (stoppedAt === null) {
      open.add(module.id);
      if (
        module.test &&
        !passedTest(module.test, attemptsByMaterial.get(module.test.id) ?? [])
      ) {
        stoppedAt = module.test.id;
      }
      continue;
    }
    blockedBy.set(module.id, stoppedAt);
  }

  return { open, blockedBy };
};
