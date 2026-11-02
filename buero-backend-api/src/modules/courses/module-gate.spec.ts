import { openModules, passedTest, type GateAttempt, type GateModule } from "./module-gate";

/**
 * Which modules a student has reached.
 *
 * The rule the author set: a module's final test has to be passed before the next module
 * opens, and a module with no test stops nobody. The cases that matter are the ones where
 * being wrong locks a paying student out of a course they bought.
 */
describe("the gate between modules", () => {
  const test = (id: string, passingScore: number | null = 70) => ({
    id,
    passingScore,
  });

  const attempt = (
    score: number | null,
    completedAt: Date | null = new Date("2026-11-02T10:00:00Z"),
  ): GateAttempt => ({ courseMaterialId: "t", score, completedAt });

  const gate = (
    modules: GateModule[],
    attempts: Record<string, GateAttempt[]> = {},
  ) => openModules(modules, new Map(Object.entries(attempts)));

  /** The first module is where the course starts; nothing stands in front of it. */
  it("opens the first module to everyone", () => {
    const { open } = gate([
      { id: "m0", test: test("t0") },
      { id: "m1", test: null },
    ]);

    expect(open.has("m0")).toBe(true);
  });

  it("closes the next module until the test is passed", () => {
    const { open, blockedBy } = gate([
      { id: "m0", test: test("t0") },
      { id: "m1", test: null },
    ]);

    expect(open.has("m1")).toBe(false);
    expect(blockedBy.get("m1")).toBe("t0");
  });

  it("opens it once the test is passed", () => {
    const { open } = gate(
      [
        { id: "m0", test: test("t0") },
        { id: "m1", test: null },
      ],
      { t0: [attempt(80)] },
    );

    expect(open.has("m1")).toBe(true);
  });

  /** Exactly the mark is a pass. A threshold is a floor, not something to clear. */
  it("counts the threshold itself as a pass", () => {
    const { open } = gate(
      [
        { id: "m0", test: test("t0", 70) },
        { id: "m1", test: null },
      ],
      { t0: [attempt(70)] },
    );

    expect(open.has("m1")).toBe(true);
  });

  it("does not count a mark below it", () => {
    const { open } = gate(
      [
        { id: "m0", test: test("t0", 70) },
        { id: "m1", test: null },
      ],
      { t0: [attempt(69)] },
    );

    expect(open.has("m1")).toBe(false);
  });

  /**
   * The rule the author stated: a module with no test of its own opens the next one. Most
   * modules will have no test for a while, and locking the course behind tests that were
   * never written would leave a paying student with one module.
   */
  it("lets a module with no test through", () => {
    const { open } = gate([
      { id: "m0", test: null },
      { id: "m1", test: null },
      { id: "m2", test: null },
    ]);

    expect(open.has("m1")).toBe(true);
    expect(open.has("m2")).toBe(true);
  });

  /** A sitting abandoned halfway has no score and cannot have passed. */
  it("ignores a test that was started and not finished", () => {
    const { open } = gate(
      [
        { id: "m0", test: test("t0") },
        { id: "m1", test: null },
      ],
      { t0: [attempt(null, null)] },
    );

    expect(open.has("m1")).toBe(false);
  });

  /** The best sitting counts; a later, worse one does not take the module away again. */
  it("keeps the module open after a worse retake", () => {
    const { open } = gate(
      [
        { id: "m0", test: test("t0") },
        { id: "m1", test: null },
      ],
      { t0: [attempt(90), attempt(40)] },
    );

    expect(open.has("m1")).toBe(true);
  });

  /**
   * Everything after a closed module is closed too. Module 3's test cannot have been passed
   * by someone who never reached module 3, so reading its own test would open the rest.
   */
  it("closes everything after the first test that was not passed", () => {
    const { open, blockedBy } = gate([
      { id: "m0", test: test("t0") },
      { id: "m1", test: null },
      { id: "m2", test: null },
    ]);

    expect(open.has("m1")).toBe(false);
    expect(open.has("m2")).toBe(false);
    expect(blockedBy.get("m2")).toBe("t0");
  });

  it("names the test that is standing in the way, not the nearest one", () => {
    const { blockedBy } = gate(
      [
        { id: "m0", test: test("t0") },
        { id: "m1", test: test("t1") },
        { id: "m2", test: null },
      ],
      { t1: [attempt(100)] },
    );

    /** t1 was passed, but the student never got past t0. */
    expect(blockedBy.get("m2")).toBe("t0");
  });

  /** A test with no threshold of its own is one to take, not one to survive. */
  it("passes a test whose author set no mark", () => {
    expect(passedTest({ passingScore: null }, [attempt(10)])).toBe(true);
  });

  it("opens the whole course when every test is passed", () => {
    const { open, blockedBy } = gate(
      [
        { id: "m0", test: test("t0") },
        { id: "m1", test: test("t1") },
        { id: "m2", test: null },
      ],
      { t0: [attempt(75)], t1: [attempt(71)] },
    );

    expect([...open]).toEqual(["m0", "m1", "m2"]);
    expect(blockedBy.size).toBe(0);
  });
});
