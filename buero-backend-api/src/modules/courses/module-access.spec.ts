import { openModules, type GateAttempt, type GateModule } from "./module-gate";

/**
 * What a module's state actually decides, now that it decides nothing about access.
 *
 * The rule the author settled on: paying for the course opens every module in it. An
 * unpassed test is a suggestion and no more - her students buy the level they think they
 * are at, and a good share of them are already part of the way through it.
 *
 * These are the cases that would have locked a paying student out before.
 */
describe("a module the student has paid for", () => {
  const attempt = (score: number | null): GateAttempt => ({
    courseMaterialId: "t",
    score,
    completedAt: score === null ? null : new Date("2026-11-03T10:00:00Z"),
  });

  const modules: GateModule[] = [
    { id: "m0", test: { id: "t0", passingScore: 70 } },
    { id: "m1", test: { id: "t1", passingScore: 70 } },
    { id: "m2", test: null },
  ];

  /**
   * Someone who bought the course to revise module 6 should not be told to sit five tests
   * first. The walk still names the test they skipped - as a line to read, not a door.
   */
  it("names the test a reader has jumped over, and only names it", () => {
    const { blockedBy } = openModules(modules, new Map());

    expect(blockedBy.get("m1")).toBe("t0");
    expect(blockedBy.get("m2")).toBe("t0");
  });

  it("suggests nothing once the tests behind it are passed", () => {
    const { blockedBy } = openModules(
      modules,
      new Map([
        ["t0", [attempt(80)]],
        ["t1", [attempt(75)]],
      ]),
    );

    expect(blockedBy.size).toBe(0);
  });

  /** A course whose tests are not written yet suggests nothing at all. */
  it("suggests nothing in a course with no tests", () => {
    const { blockedBy } = openModules(
      [
        { id: "m0", test: null },
        { id: "m1", test: null },
      ],
      new Map(),
    );

    expect(blockedBy.size).toBe(0);
  });
});
