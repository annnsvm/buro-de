/**
 * Which modules a student has earned the right to open.
 *
 * A module is closed until the one before it has been passed - and "passed" means its final
 * test was scored at or above the mark its author set. A module with no test closes nothing:
 * the course is a sequence of lessons, not an obstacle course, and only a test the author
 * actually wrote is allowed to stop anyone.
 *
 * This is a different question from whether the student has paid, and the two are answered
 * separately so the screen can say which one applies. "Buy the course" and "pass the test"
 * are not the same message, and a student told the wrong one has no way to get on.
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
  /** The modules whose lessons the student has reached, in the course's own order. */
  open: ReadonlySet<string>;
  /** For a closed module, the test standing in front of it. */
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
