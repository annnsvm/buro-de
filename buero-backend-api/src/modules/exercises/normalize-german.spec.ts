import { boundedEditDistance, matchGermanAnswer } from "./normalize-german";

/**
 * The expected answers below are taken from the authored module 4 content, because the
 * point of this module is that a student who knows the rule is not failed by their
 * keyboard, their punctuation or a single slip.
 */
describe("matchGermanAnswer", () => {
  const match = (answer: string, accepted: string[]) =>
    matchGermanAnswer(answer, accepted);

  describe("umlauts", () => {
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

    it("accepts the umlaut spelling itself", () => {
      expect(match("anfängt", ["anfängt"]).quality).toBe("exact");
    });
  });

  describe("spacing and final punctuation", () => {
    it("ignores surrounding and repeated whitespace", () => {
      expect(
        match("  Ich  mache eine Pause  ", ["Ich mache eine Pause"]).quality,
      ).toBe("exact");
    });

    it("ignores a missing full stop", () => {
      expect(
        match("Ich bin müde, weil ich schlecht geschlafen habe", [
          "Ich bin müde, weil ich schlecht geschlafen habe.",
        ]).quality,
      ).toBe("exact");
    });
  });

  describe("capitalisation", () => {
    /** German capitalises nouns, so this is a real mistake — but a reportable one. */
    it("accepts a lowercase noun but marks it", () => {
      expect(match("termin", ["Termin"])).toMatchObject({
        correct: true,
        quality: "case",
      });
    });
  });

  describe("one character out", () => {
    it("accepts a missing comma", () => {
      expect(
        match("Ich mache eine Pause weil ich müde bin", [
          "Ich mache eine Pause, weil ich müde bin",
        ]).quality,
      ).toBe("typo");
    });

    it("accepts a single transposition", () => {
      expect(match("Bescheid", ["Bescheid"]).quality).toBe("exact");
      expect(match("Bescheid".replace("ei", "ie"), ["Bescheid"]).quality).toBe(
        "typo",
      );
    });

    /**
     * Case-folded, `kann` is a single edit from `Mann` and both are real words, so a
     * short answer gets no tolerance at all.
     */
    it("does not forgive a slip in a short answer", () => {
      expect(match("kann", ["Mann"])).toMatchObject({
        correct: false,
        quality: "none",
      });
    });

    it.each(["bim", "bon"])("requires short gap answers to be exact (%s)", (typed) => {
      expect(match(typed, ["bin"]).correct).toBe(false);
    });

    it("still forgives one character in a long answer", () => {
      expect(match("Bescheld", ["Bescheid"]).quality).toBe("typo");
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

    it("reports which wording matched", () => {
      expect(match("Ich mache eine Pause, weil ich müde bin.", accepted).matched)
        .toBe(accepted[0]);
    });

    it("prefers an exact match over a near one", () => {
      expect(match("Termin", ["Termln", "Termin"])).toMatchObject({
        quality: "exact",
        matched: "Termin",
      });
    });
  });

  describe("empty and unknown answers", () => {
    it.each(["", "   ", "."])("rejects %p", (value) => {
      expect(match(value, ["bin"]).correct).toBe(false);
    });

    it("rejects an unrelated answer", () => {
      expect(match("Hund", ["Termin"]).correct).toBe(false);
    });
  });
});

describe("boundedEditDistance", () => {
  it("returns zero for identical strings", () => {
    expect(boundedEditDistance("habe", "habe", 1)).toBe(0);
  });

  it("counts a transposition as one edit", () => {
    expect(boundedEditDistance("haeb", "habe", 1)).toBe(1);
  });

  it("stops counting once the limit is passed", () => {
    expect(boundedEditDistance("Hund", "Termin", 1)).toBeGreaterThan(1);
  });

  it("gives up early on a large length difference", () => {
    expect(boundedEditDistance("a", "abcdefgh", 1)).toBeGreaterThan(1);
  });
});
