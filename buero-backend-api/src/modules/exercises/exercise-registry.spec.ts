import { QuestionType } from "src/generated/prisma/enums";
import {
  describeAcceptedAnswers,
  gradeAnswer,
  getExerciseDefinition,
  supportedQuestionTypes,
  validateQuestion,
} from "./exercise-registry";
import type { GradableQuestion } from "./exercise.types";

const question = (over: Partial<GradableQuestion>): GradableQuestion => ({
  id: "q1",
  type: QuestionType.single_choice,
  payload: {},
  acceptedAnswers: [],
  ...over,
});

const options = [
  { id: "a", text: "Du" },
  { id: "b", text: "Ich" },
  { id: "c", text: "Er" },
];

describe("exercise registry", () => {
  it("has a definition for every type in the enum", () => {
    const supported = supportedQuestionTypes();
    for (const type of Object.values(QuestionType)) {
      expect(supported).toContain(type);
      expect(getExerciseDefinition(type)).toBeDefined();
    }
  });
});

describe("single choice", () => {
  const q = question({
    type: QuestionType.single_choice,
    payload: { options },
    acceptedAnswers: ["b"],
  });

  it("accepts the marked option", () => {
    expect(gradeAnswer(q, "b")).toEqual({ correct: true, quality: "exact" });
  });

  it("rejects another option", () => {
    expect(gradeAnswer(q, "a").correct).toBe(false);
  });

  it("rejects an empty answer", () => {
    expect(gradeAnswer(q, "").correct).toBe(false);
  });

  /** The stored key is an option id; a student must be shown the option's words. */
  it("describes the answer key as the option text", () => {
    expect(describeAcceptedAnswers(q)).toEqual(["Ich"]);
  });

  it("falls back to the id when an option was removed", () => {
    expect(
      describeAcceptedAnswers(
        question({ payload: { options }, acceptedAnswers: ["gone"] }),
      ),
    ).toEqual(["gone"]);
  });

  it("complains when the answer key points at a missing option", () => {
    expect(
      validateQuestion(question({ payload: { options }, acceptedAnswers: ["zz"] })),
    ).toContainEqual(expect.stringContaining('"zz" is not one of the options'));
  });

  it("complains when nothing is marked correct", () => {
    expect(validateQuestion(question({ payload: { options } }))).toContainEqual(
      expect.stringContaining("no correct answer"),
    );
  });
});

describe("multi choice", () => {
  const q = question({
    type: QuestionType.multi_choice,
    payload: { options },
    acceptedAnswers: ["a,c"],
  });

  it("accepts the whole set regardless of the order it arrives in", () => {
    expect(gradeAnswer(q, ["c", "a"]).correct).toBe(true);
    expect(gradeAnswer(q, ["a", "c"]).correct).toBe(true);
  });

  it("describes a multi answer as the option texts, not a joined id list", () => {
    expect(describeAcceptedAnswers(q)).toEqual(["Du, Er"]);
  });

  it("rejects a partial answer", () => {
    expect(gradeAnswer(q, ["a"]).correct).toBe(false);
  });

  it("rejects an answer with an extra option", () => {
    expect(gradeAnswer(q, ["a", "b", "c"]).correct).toBe(false);
  });
});

describe("written answers", () => {
  const gap = question({
    type: QuestionType.fill_blank,
    acceptedAnswers: ["bin"],
  });
  const text = question({
    type: QuestionType.text_input,
    acceptedAnswers: [
      "Ich mache eine Pause, weil ich müde bin.",
      "Weil ich müde bin, mache ich eine Pause.",
    ],
  });

  it("accepts the expected word", () => {
    expect(gradeAnswer(gap, "bin")).toEqual({ correct: true, quality: "exact" });
  });

  it("accepts a sentence typed without umlauts", () => {
    expect(
      gradeAnswer(text, "Ich mache eine Pause, weil ich muede bin.").quality,
    ).toBe("exact");
  });

  it("accepts either wording the author allowed", () => {
    expect(
      gradeAnswer(text, "Weil ich müde bin, mache ich eine Pause.").correct,
    ).toBe(true);
  });

  it("reports a missing comma as a near miss rather than a failure", () => {
    expect(
      gradeAnswer(text, "Ich mache eine Pause weil ich müde bin."),
    ).toEqual({ correct: true, quality: "punctuation" });
  });

  /** The ending is what a gap-fill tests, so a wrong one is simply wrong. */
  it("rejects the infinitive where the conjugated form was asked for", () => {
    expect(
      gradeAnswer(question({ type: QuestionType.fill_blank, acceptedAnswers: ["arbeitet"] }), "arbeiten"),
    ).toEqual({ correct: false, quality: "none" });
  });

  it("describes written answers as they were authored", () => {
    expect(describeAcceptedAnswers(gap)).toEqual(["bin"]);
  });

  it("complains when no answer was authored", () => {
    expect(
      validateQuestion(question({ type: QuestionType.fill_blank })),
    ).toContainEqual(expect.stringContaining("at least one accepted answer"));
  });
});

describe("ordering", () => {
  const q = question({
    type: QuestionType.ordering,
    payload: { tokens: ["heute", "ich", "Deutsch", "lerne"] },
    acceptedAnswers: ["Heute lerne ich Deutsch", "Ich lerne heute Deutsch"],
  });

  it("accepts an arrangement sent as a list of words", () => {
    expect(gradeAnswer(q, ["Heute", "lerne", "ich", "Deutsch"]).correct).toBe(
      true,
    );
  });

  it("accepts the other correct word order", () => {
    expect(gradeAnswer(q, ["Ich", "lerne", "heute", "Deutsch"]).correct).toBe(
      true,
    );
  });

  it("rejects a wrong word order", () => {
    expect(gradeAnswer(q, ["Ich", "heute", "lerne", "Deutsch"]).correct).toBe(
      false,
    );
  });

  /** The student only rearranges the words they were handed. */
  it("does not blame the student for the case of the words given", () => {
    const lowercase = question({
      type: QuestionType.ordering,
      payload: { tokens: ["ich", "heiße", "Anna"] },
      acceptedAnswers: ["Ich heiße Anna"],
    });
    expect(gradeAnswer(lowercase, ["ich", "heiße", "Anna"])).toEqual({
      correct: true,
      quality: "exact",
    });
  });

  it("complains when the words cannot form any accepted answer", () => {
    expect(
      validateQuestion(
        question({
          type: QuestionType.ordering,
          payload: { tokens: ["ich", "heiße"] },
          acceptedAnswers: ["Ich heiße Anna"],
        }),
      ),
    ).toContainEqual(expect.stringContaining("cannot be arranged"));
  });

  it("accepts words that differ only in case or punctuation from the answer", () => {
    expect(
      validateQuestion(
        question({
          type: QuestionType.ordering,
          payload: { tokens: ["ich", "heiße", "Anna"] },
          acceptedAnswers: ["Ich heiße Anna."],
        }),
      ),
    ).toEqual([]);
  });

  it("complains when there is nothing to arrange", () => {
    expect(
      validateQuestion(
        question({
          type: QuestionType.ordering,
          payload: { tokens: ["nur"] },
          acceptedAnswers: ["nur"],
        }),
      ),
    ).toContainEqual(expect.stringContaining("at least two tokens"));
  });
});
