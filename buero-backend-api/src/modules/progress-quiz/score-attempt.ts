import { QuizMode } from "src/generated/prisma/enums";

/**
 * Turning a set of graded answers into a result.
 *
 * The two kinds of quiz are counted differently, on purpose.
 *
 * A **practice quiz** counts questions. It comes after a lesson, every question is one
 * step through that lesson, and the percentage answers "how much of it stuck". Giving
 * one question more weight than another would say that part of the lesson matters less,
 * which is not what a practice quiz is for. A question's `points` are ignored here.
 *
 * A **module test** counts points, because the test is authored with weights. The A2.1
 * module 4 test is twenty-three tasks worth twenty-five points — two of them are worth
 * two points each — and its admission rule is written as "at least 15 of 25". Scored by
 * question count, a student who failed only the two heavy tasks would read as 21 of 23
 * (91%) when the author's own scale says 21 of 25 (84%). The threshold would then be
 * measuring something the author never wrote.
 *
 * The percentage stays the stored form of a score in both cases: it is what
 * `course_progress` holds, what the best-attempt comparison sorts by, and what every
 * existing row already means. Points are reported alongside it, not instead of it.
 */
export type ScoredAttempt = {
  /** Percentage, 0-100, rounded to two places. The canonical score. */
  score: number;
  /** Questions answered correctly, always counted, in both modes. */
  correct: number;
  /** Questions in the quiz, including the ones left unanswered. */
  total: number;
  /** Points earned; null for a practice quiz, where points do not apply. */
  earnedPoints: number | null;
  /** Points available; null for a practice quiz. */
  totalPoints: number | null;
};

export type GradedQuestion = {
  /** The question's weight. Meaningful in a test, ignored in practice. */
  points: number;
  correct: boolean;
};

const percent = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 10000) / 100 : 0;

/**
 * Every question of the quiz must appear in `graded`, answered or not: an unanswered
 * question is a wrong one, and leaving it out would score the student against a
 * shorter quiz than the one they were given.
 */
export const scoreAttempt = (
  mode: QuizMode,
  graded: readonly GradedQuestion[],
): ScoredAttempt => {
  const correct = graded.filter((question) => question.correct).length;
  const total = graded.length;

  if (mode !== QuizMode.test) {
    return {
      score: percent(correct, total),
      correct,
      total,
      earnedPoints: null,
      totalPoints: null,
    };
  }

  const totalPoints = graded.reduce((sum, q) => sum + Math.max(1, q.points), 0);
  const earnedPoints = graded.reduce(
    (sum, q) => (q.correct ? sum + Math.max(1, q.points) : sum),
    0,
  );

  return {
    score: percent(earnedPoints, totalPoints),
    correct,
    total,
    earnedPoints,
    totalPoints,
  };
};

/**
 * One section of a test, as the author divided it up.
 *
 * A single percentage tells a student they failed but not what to do about it. The
 * authored files already split a test into parts — "ЧАСТИНА 2 · dass і das" — and end
 * with a table saying which lesson to revisit when a part goes badly. This carries that
 * same table, computed from the attempt.
 */
export type PartResult = {
  title: string;
  /** Which lesson to go back over; null until the author fills in that column. */
  reviewLesson: string | null;
  earnedPoints: number;
  totalPoints: number;
  correct: number;
  total: number;
  /**
   * The author's own rule for "go back over this": more than half the points of the
   * part were lost. Half exactly is not weak — it is the losing of *more* than half
   * that the instruction names.
   */
  weak: boolean;
};

export type PartedQuestion = GradedQuestion & {
  partTitle: string | null;
  reviewLesson: string | null;
};

/**
 * Breaks an attempt down by part, in the order the parts appear in the test.
 *
 * Only for a test. A practice quiz follows a single lesson, so splitting it would
 * divide one topic into pieces that mean nothing on their own. Questions with no part
 * recorded — anything imported before parts were kept — produce no breakdown at all
 * rather than one bucket called "other", which would read as a real section.
 */
export const summariseParts = (
  mode: QuizMode,
  graded: readonly PartedQuestion[],
): PartResult[] => {
  if (mode !== QuizMode.test) return [];

  const order: string[] = [];
  const byTitle = new Map<string, PartResult>();

  for (const question of graded) {
    const title = question.partTitle?.trim();
    if (!title) continue;

    if (!byTitle.has(title)) {
      order.push(title);
      byTitle.set(title, {
        title,
        reviewLesson: question.reviewLesson,
        earnedPoints: 0,
        totalPoints: 0,
        correct: 0,
        total: 0,
        weak: false,
      });
    }

    const part = byTitle.get(title)!;
    const points = Math.max(1, question.points);
    part.totalPoints += points;
    part.total += 1;
    if (question.correct) {
      part.earnedPoints += points;
      part.correct += 1;
    }
    part.reviewLesson ??= question.reviewLesson;
  }

  /** A breakdown of one part is not a breakdown; it says nothing the total did not. */
  if (order.length < 2) return [];

  return order.map((title) => {
    const part = byTitle.get(title)!;
    return { ...part, weak: part.earnedPoints * 2 < part.totalPoints };
  });
};

/**
 * The passing threshold expressed in points, so a test can state its rule the way its
 * author wrote it — "at least 15 of 25" rather than "at least 60%".
 *
 * Derived from the percentage rather than stored separately: two numbers that must
 * agree, kept in two places, eventually stop agreeing. Rounded up, so the points shown
 * are always enough to actually pass.
 */
export const passingPoints = (
  passingScore: number | null,
  totalPoints: number | null,
): number | null => {
  if (passingScore == null || totalPoints == null) return null;
  return Math.ceil((passingScore / 100) * totalPoints);
};
