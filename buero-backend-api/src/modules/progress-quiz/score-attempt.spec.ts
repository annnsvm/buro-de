import { QuizMode } from "src/generated/prisma/enums";
import {
  passingPoints,
  scoreAttempt,
  summariseParts,
  type PartedQuestion,
} from "./score-attempt";

describe("scoring an attempt", () => {
  describe("a practice quiz counts questions", () => {
    it("ignores the weight an author may have left on a question", () => {
      const graded = [
        { points: 5, correct: true },
        { points: 1, correct: false },
      ];
      expect(scoreAttempt(QuizMode.practice, graded).score).toBe(50);
    });

    it("reports no points at all, so nothing invents a scale", () => {
      const scored = scoreAttempt(QuizMode.practice, [
        { points: 1, correct: true },
      ]);
      expect(scored.earnedPoints).toBeNull();
      expect(scored.totalPoints).toBeNull();
    });
  });

  describe("a module test counts points", () => {
    /** The A2.1 module 4 test: 23 tasks, T19 and T20 worth two points, 25 in total. */
    const moduleFourTest = (wrongIds: readonly number[]) =>
      Array.from({ length: 23 }, (_, index) => ({
        points: index === 18 || index === 19 ? 2 : 1,
        correct: !wrongIds.includes(index + 1),
      }));

    it("adds up to the 25 points the author wrote", () => {
      expect(scoreAttempt(QuizMode.test, moduleFourTest([])).totalPoints).toBe(
        25,
      );
    });

    it("charges a two-point task twice", () => {
      // Failing only T19 and T20 loses four points, not two.
      const scored = scoreAttempt(QuizMode.test, moduleFourTest([19, 20]));
      expect(scored.earnedPoints).toBe(21);
      expect(scored.correct).toBe(21);
      expect(scored.total).toBe(23);
      // 21 of 25 is 84%, not the 91% that counting questions would have given.
      expect(scored.score).toBe(84);
    });

    it("puts the admission threshold exactly where the author put it", () => {
      // "щонайменше 15 балів із 25" - ten one-point tasks failed leaves 15.
      const wrong = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const scored = scoreAttempt(QuizMode.test, moduleFourTest(wrong));
      expect(scored.earnedPoints).toBe(15);
      expect(scored.score).toBe(60);
      expect(scored.score >= 60).toBe(true);
    });

    it("counts a question left unanswered as a wrong one", () => {
      const scored = scoreAttempt(QuizMode.test, [
        { points: 2, correct: true },
        { points: 2, correct: false },
      ]);
      expect(scored.earnedPoints).toBe(2);
      expect(scored.totalPoints).toBe(4);
      expect(scored.score).toBe(50);
    });

    it("treats a missing or zero weight as one point", () => {
      const scored = scoreAttempt(QuizMode.test, [
        { points: 0, correct: true },
        { points: 1, correct: false },
      ]);
      expect(scored.totalPoints).toBe(2);
      expect(scored.earnedPoints).toBe(1);
    });
  });

  it("scores an empty quiz as zero rather than dividing by nothing", () => {
    expect(scoreAttempt(QuizMode.test, []).score).toBe(0);
    expect(scoreAttempt(QuizMode.practice, []).score).toBe(0);
  });
});

describe("the threshold in points", () => {
  it("states the module 4 rule the way the author wrote it", () => {
    expect(passingPoints(60, 25)).toBe(15);
  });

  it("rounds up, so the points shown are always enough to pass", () => {
    // 60% of 23 is 13.8: showing 13 would be a point short of passing.
    expect(passingPoints(60, 23)).toBe(14);
  });

  it("says nothing when there is no threshold or no scale", () => {
    expect(passingPoints(null, 25)).toBeNull();
    expect(passingPoints(60, null)).toBeNull();
  });
});

describe("breaking a test down by part", () => {
  const task = (
    partTitle: string | null,
    points: number,
    correct: boolean,
    reviewLesson: string | null = null,
  ): PartedQuestion => ({ partTitle, reviewLesson, points, correct });

  it("adds up each part separately, in the order the test has them", () => {
    const parts = summariseParts(QuizMode.test, [
      task("ЧАСТИНА 1 · weil і denn", 1, true),
      task("ЧАСТИНА 1 · weil і denn", 1, false),
      task("ЧАСТИНА 2 · dass і das", 1, true),
    ]);

    expect(parts.map((part) => part.title)).toEqual([
      "ЧАСТИНА 1 · weil і denn",
      "ЧАСТИНА 2 · dass і das",
    ]);
    expect(parts[0]).toMatchObject({ earnedPoints: 1, totalPoints: 2, total: 2 });
  });

  describe("which part to go back over", () => {
    // The author's instruction: revisit the parts where more than half was lost.
    it("marks a part weak when more than half its points went", () => {
      const [part] = summariseParts(QuizMode.test, [
        task("Частина 1", 1, false),
        task("Частина 1", 1, false),
        task("Частина 1", 1, true),
        task("Частина 2", 1, true),
      ]);
      expect(part.weak).toBe(true);
    });

    it("leaves a part at exactly half alone - half is not more than half", () => {
      const [part] = summariseParts(QuizMode.test, [
        task("Частина 1", 1, true),
        task("Частина 1", 1, false),
        task("Частина 2", 1, true),
      ]);
      expect(part).toMatchObject({ earnedPoints: 1, totalPoints: 2, weak: false });
    });

    it("weighs a part by points, not by the number of tasks", () => {
      // One two-point task missed outweighs a one-point task answered.
      const [part] = summariseParts(QuizMode.test, [
        task("Частина 5", 2, false),
        task("Частина 5", 1, true),
        task("Частина 6", 1, true),
      ]);
      expect(part).toMatchObject({ earnedPoints: 1, totalPoints: 3, weak: true });
    });

    it("carries the lesson to revisit when the author gave one", () => {
      const [part] = summariseParts(QuizMode.test, [
        task("Частина 1", 1, false, "4.1, 4.2 і 4.3"),
        task("Частина 2", 1, true),
      ]);
      expect(part.reviewLesson).toBe("4.1, 4.2 і 4.3");
    });
  });

  describe("when a breakdown would say nothing", () => {
    it("gives none for a practice quiz, which is one lesson already", () => {
      expect(
        summariseParts(QuizMode.practice, [
          task("Урок 4.1", 1, true),
          task("Урок 4.2", 1, false),
        ]),
      ).toEqual([]);
    });

    it("gives none when the questions carry no part", () => {
      expect(
        summariseParts(QuizMode.test, [task(null, 1, true), task(null, 1, false)]),
      ).toEqual([]);
    });

    it("gives none for a test that is all one part", () => {
      expect(
        summariseParts(QuizMode.test, [
          task("Частина 1", 1, true),
          task("Частина 1", 1, false),
        ]),
      ).toEqual([]);
    });
  });
});

/**
 * Which parts a module test is read in.
 *
 * Her test files carry a skill on every row - Grammatik, Lesen, Hören - and that is what a
 * student recognises in a result: "my listening let me down", not "lesson 2.4 let me down".
 * A test written before blocks existed has nothing to group by and keeps reading by lesson,
 * which is the case that must not change under anyone.
 */
describe("a test broken down by skill", () => {
  const question = (
    block: string | null,
    partTitle: string | null,
    correct: boolean,
    reviewLesson: string | null = null,
  ) => ({ points: 1, correct, block, partTitle, reviewLesson });

  const parts = (graded: ReturnType<typeof question>[]) =>
    summariseParts(QuizMode.test, graded);

  it("groups by the skill when the author named more than one", () => {
    const result = parts([
      question("grammatik", "2.1", true),
      question("grammatik", "2.2", false),
      question("lesen", "2.3", true),
      question("horen", "2.4", true),
    ]);

    expect(result.map((part) => part.title)).toEqual([
      "grammatik",
      "lesen",
      "horen",
    ]);
  });

  it("counts each skill's own points", () => {
    const [grammatik] = parts([
      question("grammatik", "2.1", true),
      question("grammatik", "2.2", false),
      question("lesen", "2.3", true),
    ]);

    expect(grammatik).toMatchObject({ correct: 1, total: 2, earnedPoints: 1 });
  });

  /**
   * A part that spans the whole module is not one lesson, and offering one lesson's link
   * would send the student to a fraction of what they missed. The link belongs on each
   * mistake instead.
   */
  it("offers no single lesson for a part built from many", () => {
    const [grammatik] = parts([
      question("grammatik", "2.1", false, "2.1"),
      question("grammatik", "2.2", false, "2.2"),
      question("lesen", "2.3", true, "2.3"),
    ]);

    expect(grammatik.reviewLesson).toBeNull();
  });

  /** The case that must keep working: one skill on every row, so there is nothing to split. */
  it("falls back to the lesson when every question shares a skill", () => {
    const result = parts([
      question("grammatik", "2.1", true, "2.1"),
      question("grammatik", "2.2", false, "2.2"),
    ]);

    expect(result.map((part) => part.title)).toEqual(["2.1", "2.2"]);
    expect(result[1].reviewLesson).toBe("2.2");
  });

  /** And a test from before blocks were recorded at all. */
  it("falls back to the lesson when no skill was recorded", () => {
    const result = parts([
      question(null, "2.1", true, "2.1"),
      question(null, "2.2", false, "2.2"),
    ]);

    expect(result.map((part) => part.title)).toEqual(["2.1", "2.2"]);
  });

  /** Still only a test. A practice quiz follows one lesson and is not split at all. */
  it("says nothing about the parts of a practice quiz", () => {
    expect(
      summariseParts(QuizMode.practice, [
        question("grammatik", "2.1", true),
        question("lesen", "2.2", true),
      ]),
    ).toEqual([]);
  });
});

