import { QuizMode } from "src/generated/prisma/enums";
import { QuizService } from "./quiz.service";

/**
 * Whether a student may see the answer key.
 *
 * This is the rule that keeps a module test worth taking: the test is a fixed set of
 * questions rather than a pool, so handing over the answers after a failure would make
 * the retake an exercise in copying. A practice quiz has the opposite job and always
 * explains itself.
 */
describe("QuizService answer reveal rule", () => {
  const mayReveal = (
    material: { quizMode: QuizMode | null; passingScore: number | null },
    score: number,
  ): boolean =>
    (
      QuizService.prototype as unknown as {
        mayRevealAnswers: (
          material: { quizMode: QuizMode | null; passingScore: number | null },
          score: number,
        ) => boolean;
      }
    ).mayRevealAnswers(material, score);

  describe("practice", () => {
    it.each([0, 50, 100])("always explains itself, even at %i%%", (score) => {
      expect(
        mayReveal({ quizMode: QuizMode.practice, passingScore: null }, score),
      ).toBe(true);
    });

    it("explains itself even when a threshold was set", () => {
      expect(
        mayReveal({ quizMode: QuizMode.practice, passingScore: 60 }, 10),
      ).toBe(true);
    });
  });

  describe("test", () => {
    const test = { quizMode: QuizMode.test, passingScore: 60 };

    it("reveals the answers once the threshold is reached", () => {
      expect(mayReveal(test, 60)).toBe(true);
      expect(mayReveal(test, 95)).toBe(true);
    });

    it("keeps the answers hidden below the threshold", () => {
      expect(mayReveal(test, 59)).toBe(false);
      expect(mayReveal(test, 0)).toBe(false);
    });

    it("reveals when no threshold was set, since nothing can be failed", () => {
      expect(
        mayReveal({ quizMode: QuizMode.test, passingScore: null }, 0),
      ).toBe(true);
    });
  });

  describe("material with no mode", () => {
    it("is treated as practice", () => {
      expect(mayReveal({ quizMode: null, passingScore: 60 }, 0)).toBe(true);
    });
  });
});
