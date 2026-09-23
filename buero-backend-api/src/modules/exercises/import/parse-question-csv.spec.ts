import { QuestionType } from "src/generated/prisma/enums";
import {
  groupQuestions,
  parseQuestionCsv,
  readCsvRows,
} from "./parse-question-csv";

/**
 * Every row below is copied from the authored module 4 files rather than invented, so
 * the conventions being decoded here are the real ones: the answer key written as
 * "B) Warum?", the words of an ordering exercise hidden in the prompt, the two-point
 * marker in brackets, and the second acceptable wording mentioned in prose.
 */
const HEADER =
  "ID,Урок,Тип,Питання,A,B,C,D,Правильна відповідь,Пояснення";

const csv = (...rows: string[]) => [HEADER, ...rows].join("\n");

describe("readCsvRows", () => {
  it("keeps commas that sit inside a quoted field", () => {
    const rows = readCsvRows('a,b\n"one, two",three');
    expect(rows[1]).toEqual(["one, two", "three"]);
  });

  it("unescapes doubled quotes", () => {
    expect(readCsvRows('a\n"say ""hi"""')[1]).toEqual(['say "hi"']);
  });

  it("ignores a byte order mark and blank lines", () => {
    expect(readCsvRows("﻿a,b\n\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("parseQuestionCsv", () => {
  describe("a multiple choice row", () => {
    const { questions, problems } = parseQuestionCsv(
      csv(
        "4.1.1,4.1 — Чому ти запізнився? (weil),ONE,На яке питання відповідає підрядне речення з weil?,Wohin?,Warum?,Wann?,Wie?,B) Warum?,weil називає причину.",
      ),
    );

    it("parses without complaint", () => {
      expect(problems).toEqual([]);
      expect(questions).toHaveLength(1);
    });

    it("keeps the author's id, so a re-import updates rather than duplicates", () => {
      expect(questions[0].id).toBe("4.1.1");
    });

    it("turns the four columns into options", () => {
      expect(questions[0].options.map((option) => option.text)).toEqual([
        "Wohin?",
        "Warum?",
        "Wann?",
        "Wie?",
      ]);
    });

    /** "B) Warum?" has to become the id of the second option, not stay as text. */
    it("resolves the lettered answer to the option it names", () => {
      expect(questions[0].acceptedAnswers).toEqual(["4.1.1_b"]);
    });

    it("carries the explanation across", () => {
      expect(questions[0].explanation).toContain("weil називає причину");
    });
  });

  describe("written rows", () => {
    const { questions } = parseQuestionCsv(
      csv(
        '4.1.2,4.1 — weil,GAP,"Ich bleibe zu Hause, weil ich krank ___. (sein)",,,,,bin,у підрядному дієслово останнє.',
        '4.1.8,4.1 — weil,TEXT,"Перекладіть німецькою: Її немає.",,,,,"Sie ist nicht da, weil sie eine Besprechung hat.","hat — останнє слово. Прийнятно також Sie ist nicht hier, weil sie eine Besprechung hat."',
      ),
    );

    it("maps GAP and TEXT onto the written types", () => {
      expect(questions.map((question) => question.type)).toEqual([
        QuestionType.fill_blank,
        QuestionType.text_input,
      ]);
    });

    it("takes the answer exactly as authored", () => {
      expect(questions[0].acceptedAnswers).toEqual(["bin"]);
    });

    /**
     * The author writes a second acceptable wording into the explanation. It is prose,
     * so it is surfaced for confirmation instead of being accepted silently.
     */
    it("notices a wording the explanation says is also right", () => {
      expect(questions[1].suggestedAlternatives).toEqual([
        "Sie ist nicht hier, weil sie eine Besprechung hat.",
      ]);
    });

    it("does not add the alternative to the answer key by itself", () => {
      expect(questions[1].acceptedAnswers).toHaveLength(1);
    });
  });

  describe("an ordering row", () => {
    const { questions, problems } = parseQuestionCsv(
      csv(
        '4.2.8,4.2 — weil + модальні,ORDER,"Складіть речення: Ich kann nicht kommen, / weil / ich / arbeiten / muss",,,,,"Ich kann nicht kommen, weil ich arbeiten muss.",після weil підмет.',
      ),
    );

    it("lifts the words out of the prompt", () => {
      expect(problems).toEqual([]);
      expect(
        (questions[0] as { tokens?: string[] }).tokens,
      ).toEqual([
        "Ich kann nicht kommen,",
        "weil",
        "ich",
        "arbeiten",
        "muss",
      ]);
    });

    it("leaves the instruction as the prompt", () => {
      expect(questions[0].prompt).toBe("Складіть речення:");
    });
  });

  describe("points written into the question", () => {
    const { questions } = parseQuestionCsv(
      csv(
        'T19,ЧАСТИНА 5,ORDER,"(2 бали) Складіть речення: weil / ich / arbeiten / muss / , / komme / ich / später",,,,,"Weil ich arbeiten muss, komme ich später.",підрядне спереду.',
        'T1,ЧАСТИНА 1,GAP,"Ich bleibe zu Hause, weil ich krank ___. (sein)",,,,,bin,дієслово останнє.',
      ),
    );

    it("reads a two point task as worth two", () => {
      expect(questions[0].points).toBe(2);
    });

    it("takes the bracket off the prompt the student reads", () => {
      expect(questions[0].prompt).toBe("Складіть речення:");
    });

    it("keeps a lone comma as one of the words", () => {
      expect((questions[0] as { tokens?: string[] }).tokens).toContain(",");
    });

    it("defaults to one point", () => {
      expect(questions[1].points).toBe(1);
    });
  });

  describe("rows that cannot be used", () => {
    const { questions, problems } = parseQuestionCsv(
      csv(
        "4.9.1,4.9,MATCH,Зіставте слова,a,b,,,a,—",
        "4.9.2,4.9,ONE,Питання без відповіді,a,b,,,,—",
        "4.9.3,4.9,ONE,Відповідь не збігається з варіантами,Wohin?,Warum?,,,Z) Wann?,—",
        "4.9.4,4.9,ORDER,Складіть речення без слів,,,,,Ich komme,—",
        ",4.9,GAP,Рядок без ID,,,,,bin,—",
      ),
    );

    it("keeps every unusable row out of the import", () => {
      expect(questions).toHaveLength(0);
    });

    it("says what is wrong with each, by row number", () => {
      expect(problems.map((problem) => problem.message)).toEqual([
        expect.stringContaining('unknown type "MATCH"'),
        "no correct answer",
        expect.stringContaining("matches none of the options"),
        expect.stringContaining('separated by "/"'),
        "no ID",
      ]);
      expect(problems[0].row).toBe(2);
    });

    it("refuses a file whose columns are not the expected ones", () => {
      const result = parseQuestionCsv("Question,Answer\nfoo,bar");
      expect(result.questions).toHaveLength(0);
      expect(result.problems[0].message).toContain("missing column(s)");
    });

    it("reports a repeated id instead of overwriting the first row", () => {
      const result = parseQuestionCsv(
        csv(
          "4.1.1,4.1,GAP,Перше,,,,,bin,—",
          "4.1.1,4.1,GAP,Друге,,,,,hat,—",
        ),
      );
      expect(result.questions).toHaveLength(1);
      expect(result.problems[0].message).toBe("duplicate ID");
    });
  });
});

describe("groupQuestions", () => {
  const { questions } = parseQuestionCsv(
    csv(
      "4.1.1,4.1 — weil,GAP,Перше,,,,,bin,—",
      "4.2.1,4.2 — модальні,GAP,Друге,,,,,hat,—",
      "4.1.2,4.1 — weil,GAP,Третє,,,,,ist,—",
    ),
  );

  it("collects the questions of each lesson together", () => {
    const groups = groupQuestions(questions);
    expect(groups.map((group) => group.group)).toEqual([
      "4.1 — weil",
      "4.2 — модальні",
    ]);
    expect(groups[0].questions.map((question) => question.id)).toEqual([
      "4.1.1",
      "4.1.2",
    ]);
  });
});
