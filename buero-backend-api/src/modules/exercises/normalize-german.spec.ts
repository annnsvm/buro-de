import { matchGermanAnswer } from "./normalize-german";

/**
 * The expected answers are taken from the authored module 4 content. The rule being
 * protected here is that a near-miss is a wrong answer: in a grammar drill the one
 * character that differs is almost always the thing the drill is teaching.
 */
describe("matchGermanAnswer", () => {
  const match = (answer: string, accepted: string[]) =>
    matchGermanAnswer(answer, accepted);

  describe("a wrong verb form is never forgiven", () => {
    /**
     * The gap `weil sie noch ___ (arbeiten)` expects `arbeitet`. Typing the infinitive
     * is the commonest mistake there is, and counting it as a typo teaches the mistake.
     */
    it("rejects the infinitive where the conjugated form was asked for", () => {
      expect(match("arbeiten", ["arbeitet"])).toMatchObject({
        correct: false,
        quality: "none",
      });
    });

    it.each([
      ["wohnen", "wohne"],
      ["kommen", "kommst"],
      ["anfangen", "anfängt"],
      ["konnte", "konnten"],
      ["muss", "musste"],
    ])("rejects %s where %s was asked for", (typed, expected) => {
      expect(match(typed, [expected]).correct).toBe(false);
    });

    it("rejects another real word that is one letter away", () => {
      expect(match("kann", ["Mann"]).correct).toBe(false);
      expect(match("Bescheld", ["Bescheid"]).correct).toBe(false);
    });
  });

  describe("what a keyboard forces is forgiven silently", () => {
    it.each([
      ["anfaengt", "anfängt"],
      ["muede", "müde"],
      ["weiss", "weiß"],
      ["Gruessen", "Grüßen"],
      ["Ueberstunden", "Überstunden"],
    ])("accepts %s for %s", (typed, expected) => {
      expect(match(typed, [expected])).toMatchObject({
        correct: true,
        quality: "exact",
      });
    });

    it("ignores surrounding and repeated whitespace", () => {
      expect(
        match("  Ich  mache eine Pause  ", ["Ich mache eine Pause"]).quality,
      ).toBe("exact");
    });
  });

  describe("what the course teaches is accepted but reported", () => {
    it("reports a missing comma before weil", () => {
      expect(
        match("Ich mache eine Pause weil ich müde bin.", [
          "Ich mache eine Pause, weil ich müde bin.",
        ]),
      ).toMatchObject({ correct: true, quality: "punctuation" });
    });

    it("reports a missing full stop", () => {
      expect(
        match("Ich bin müde, weil ich schlecht geschlafen habe", [
          "Ich bin müde, weil ich schlecht geschlafen habe.",
        ]).quality,
      ).toBe("punctuation");
    });

    it("reports a noun written in lower case", () => {
      expect(match("termin", ["Termin"])).toMatchObject({
        correct: true,
        quality: "case",
      });
      expect(match("bescheid", ["Bescheid"]).quality).toBe("case");
    });

    it("reports capitalisation ahead of punctuation when both slipped", () => {
      expect(
        match("ich mache eine pause weil ich müde bin", [
          "Ich mache eine Pause, weil ich müde bin.",
        ]).quality,
      ).toBe("case");
    });
  });

  describe("several accepted wordings", () => {
    const accepted = [
      "Ich mache eine Pause, weil ich müde bin.",
      "Weil ich müde bin, mache ich eine Pause.",
    ];

    it("accepts the alternative the author allowed", () => {
      expect(
        match("Weil ich müde bin, mache ich eine Pause.", accepted),
      ).toMatchObject({ correct: true, quality: "exact" });
    });

    it("prefers an exact match over one that only differs in punctuation", () => {
      expect(match("Termin", ["Termin,", "Termin"])).toMatchObject({
        quality: "exact",
        matched: "Termin",
      });
    });
  });

  describe("empty and unrelated answers", () => {
    it.each(["", "   "])("rejects %p", (value) => {
      expect(match(value, ["bin"]).correct).toBe(false);
    });

    it("rejects an unrelated word", () => {
      expect(match("Hund", ["Termin"]).correct).toBe(false);
    });

    it("does not let stripped punctuation turn an empty answer into a match", () => {
      expect(match(".", ["bin"]).correct).toBe(false);
    });
  });
});
