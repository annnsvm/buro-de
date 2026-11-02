import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parseQuestionCsv } from "./parse-question-csv";
import {
  countedCriterionIndex,
  preCheckLetter,
  requiresLetterShape,
} from "../../writing/letter-shape";
import { parseWritingTask } from "../../writing/writing-task";

/**
 * The author's own Schreiben files, imported for real.
 *
 * Nothing here is a fixture written to suit the code: these are the six files the course is
 * taught from, and the first version of the importer refused every one of their 53 rows. The
 * column it read as a bare range (`6-8`) actually holds `Мінімум речень: N` and then several
 * paragraphs of instructions for whoever marks the task.
 *
 * Replacing the files is how this course changes, so this suite is what notices when a new one
 * is written in a shape the importer cannot read - before the author finds out by importing it.
 */
const DIR = join(__dirname, "../../../../test/fixtures/schreiben");

const files = readdirSync(DIR)
  .filter((name) => name.endsWith(".csv"))
  .sort();

const parsed = files.map((name) => ({
  name,
  ...parseQuestionCsv(readFileSync(join(DIR, name), "utf8")),
}));

const everyTask = parsed.flatMap((file) =>
  file.elements.map((element) => ({ file: file.name, element })),
);

describe("the author's Schreiben files", () => {
  it("are all there", () => {
    expect(files).toHaveLength(6);
  });

  it.each(parsed.map((file) => [file.name, file] as const))(
    "%s imports with nothing refused",
    (_name, file) => {
      expect(file.problems).toEqual([]);
      expect(file.elements.length).toBeGreaterThan(0);
    },
  );

  it("import as 53 writing tasks and no questions", () => {
    expect(everyTask).toHaveLength(53);
    expect(parsed.flatMap((file) => file.questions)).toEqual([]);
  });
});

describe("every one of the 53 tasks", () => {
  const tasks = everyTask.map(({ file, element }) => ({
    file,
    id: element.id,
    element,
    task: parseWritingTask({
      task: element.body || element.title,
      minSentences: element.minSentences,
      maxSentences: element.maxSentences,
      criteria: element.criteria,
      ...(element.sampleAnswer && { modelAnswer: element.sampleAnswer }),
    }),
  }));

  it.each(tasks.map((t) => [t.id, t] as const))(
    "%s can be marked at all",
    (_id, { task }) => {
      /** Five criteria is what the author writes, and every heading in the files says so. */
      expect(task.criteria).toHaveLength(5);
      expect(task.minSentences).toBeGreaterThanOrEqual(1);
      expect(task.task.length).toBeGreaterThan(20);
      expect(task.modelAnswer).toBeTruthy();
    },
  );

  it.each(tasks.map((t) => [t.id, t] as const))(
    "%s keeps the author's instructions for the checker",
    (_id, { element }) => {
      expect(element.checkerNote).toBeTruthy();
      /** The line that became a number must not be left in the prose as well. */
      expect(element.checkerNote).not.toMatch(/Мінімум речень/);
    },
  );

  /**
   * The length is the checker's to judge, with the author's counting rules beside it.
   *
   * Her rubric states the range in her own words ("4-6 речень") and her note says what does not
   * count - the greeting, the signature, "Und du?". Code cannot know those, so it must not
   * overwrite the verdict with a count of its own.
   */
  it.each(tasks.map((t) => [t.id, t] as const))(
    "%s leaves criterion 1 to the checker",
    (_id, { task }) => {
      expect(
        countedCriterionIndex(task.criteria, task.minSentences, task.maxSentences),
      ).toBeNull();
    },
  );

  /**
   * The author's own full-marks answer, sent as if a student had written it.
   *
   * It must at least reach the checker. Four of module 1's twelve did not: the free check
   * refused them for having no closing formula, because they sign off "Olha" or "Bis gleich".
   * That is checklist item 4 of the spec failing before the model was ever called.
   */
  it.each(tasks.map((t) => [t.id, t] as const))(
    "%s has a model answer that reaches the checker",
    (_id, { element, task }) => {
      const german = String(element.sampleAnswer ?? "").split(/\n\s*Переклад:/)[0];
      const pre = preCheckLetter(
        german,
        task.minSentences,
        task.maxSentences,
        requiresLetterShape(task.criteria),
      );
      expect(pre.ok).toBe(true);
    },
  );

  /** The guard on cost has to be wide enough for the longest answer the author wrote. */
  it("has no model answer anywhere near the character cap", () => {
    const longest = Math.max(
      ...tasks.map((t) => String(t.element.sampleAnswer ?? "").length),
    );
    expect(longest).toBeLessThan(2000);
  });
});
