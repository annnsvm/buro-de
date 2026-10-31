import { MAX_LABEL_LENGTH, shortLabel } from "./short-label";

/**
 * Where a task's short name comes from when nobody wrote one.
 *
 * The editor asked for a 300-character "умова" and gave the task itself nowhere to go, so a
 * real prompt - "Ви захворіли. На 10:00 у вас була нарада…" - was refused for being too long,
 * and the author was left asking where the actual task was meant to be typed. The task now has
 * a field of its own, and this is what names it when the name is left blank.
 */
describe("a task's short name", () => {
  it("keeps a short task as it is", () => {
    expect(shortLabel("Напишіть колезі лист")).toBe("Напишіть колезі лист");
  });

  /** The first sentence is nearly always what a person would have typed themselves. */
  it("takes the first sentence of a long task", () => {
    expect(
      shortLabel(
        "Ви захворіли і не можете прийти. Напишіть листа керівникові - 6–8 речень у " +
          "тілі листа, Betreff і звертання не рахуються.",
      ),
    ).toBe("Ви захворіли і не можете прийти.");
  });

  /** A label that breaks mid-word reads like a bug rather than a name. */
  it("never cuts a word in half", () => {
    const task =
      "Напишіть довгого листа керівникові про перенесення наради на наступний тиждень " +
      "через хворобу та інші обставини";
    const label = shortLabel(task);

    expect(label.length).toBeLessThanOrEqual(MAX_LABEL_LENGTH + 1);
    expect(label.endsWith("…")).toBe(true);
    /** What stands before the ellipsis is whole words of the task, followed by a space. */
    const kept = label.slice(0, -1);
    expect(task.startsWith(kept)).toBe(true);
    expect(task[kept.length]).toBe(" ");
  });

  it("flattens the line breaks of a multi-line task", () => {
    expect(shortLabel("Завдання\n\n  на  говоріння  ")).toBe("Завдання на говоріння");
  });

  it("has nothing to say about nothing", () => {
    expect(shortLabel("")).toBe("");
    expect(shortLabel("   \n ")).toBe("");
  });
});
