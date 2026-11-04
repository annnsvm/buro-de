import { PUBLISHED } from "../../common/content/published";

/**
 * The one rule a student's screen depends on.
 *
 * A dozen queries across four services read questions and texts, and every one of them
 * has to ask for published work only. Missing a single one puts a half-written question
 * in front of a paying student, and nothing else in the system would notice.
 *
 * So the fragment is shared and these tests read the source: not a substitute for the
 * per-service tests, but the thing that fails loudly when someone adds a thirteenth query
 * and forgets.
 */
import { readFileSync } from "fs";
import { join } from "path";

const read = (relative: string) =>
  readFileSync(join(__dirname, "..", "..", relative), "utf8");

/** Every file that serves questions or texts to someone learning. */
const STUDENT_FACING = [
  "modules/progress-quiz/quiz.service.ts",
  "modules/practice/practice.service.ts",
  "modules/practice/speaking.service.ts",
  "modules/writing/writing.service.ts",
];

describe("what a student is served", () => {
  it("asks for published work and nothing else", () => {
    expect(PUBLISHED).toEqual({ publishedAt: { not: null } });
  });

  it.each(STUDENT_FACING)("%s reads through the shared filter", (file) => {
    expect(read(file)).toContain("PUBLISHED");
  });

  /**
   * Counted rather than eyeballed: every read of a question or an element in these files
   * has to carry the filter. The count is the number of reads, so adding one without the
   * filter fails here rather than in front of a student.
   */
  it.each(STUDENT_FACING)("%s carries it on every read it makes", (file) => {
    const source = read(file);
    const reads = [
      ...source.matchAll(
        /prisma\.(question|practiceElement)\.(findMany|findFirst|findUnique|count)\(\{[\s\S]{0,400}?\}\)/g,
      ),
    ].map((match) => match[0]);

    expect(reads.length).toBeGreaterThan(0);
    for (const read of reads) {
      expect(read).toContain("PUBLISHED");
    }
  });

  /** The editor is the exception, and deliberately so: drafts are what it is for. */
  it("leaves the editor able to see drafts", () => {
    expect(read("modules/exercises/question-editor.service.ts")).not.toContain(
      "PUBLISHED",
    );
  });
});
