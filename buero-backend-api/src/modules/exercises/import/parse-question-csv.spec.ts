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

  /**
   * The two things `TEXT` can mean, in one file.
   *
   * A written question and a text to read are entirely different: one is answered with a
   * sentence, the other is read before questions about it are answered. Both are spelled
   * `TEXT` in the authored files, and only the `Матеріал` column tells them apart — so this
   * is the test that keeps a reading text from being imported as a question, and a
   * sentence-answer question from being imported as a text nobody can answer.
   */
  describe("a written question and a text to read, side by side", () => {
    const WITH_MATERIAL =
      "ID,Урок,Тип,Блок,Питання,A,B,C,D,Правильна відповідь,Пояснення,Матеріал";
    const parsed = parseQuestionCsv(
      [
        WITH_MATERIAL,
        '4.1.8,4.1,TEXT,grammatik,"Перекладіть німецькою: Її немає.",,,,,"Sie ist nicht da, weil sie eine Besprechung hat.","hat — останнє слово.",',
        '4.1.T,4.1,TEXT,lesen,Eine E-Mail aus dem Büro,,,,,,,"Hallo Anna, ich kann morgen nicht kommen, weil ich krank bin."',
        '4.1.9,4.1,ONE,lesen,Warum kommt er nicht?,Er ist krank,Er hat Urlaub,,,A) Er ist krank,Im Text steht «weil ich krank bin».',
      ].join("\n"),
    );

    it("parses both without complaint", () => {
      expect(parsed.problems).toEqual([]);
    });

    /** The row with an answer and no material stays a question the student writes into. */
    it("keeps the sentence-answer row a question", () => {
      const written = parsed.questions.find((question) => question.id === "4.1.8");
      expect(written?.type).toBe(QuestionType.text_input);
      expect(written?.acceptedAnswers).toEqual([
        "Sie ist nicht da, weil sie eine Besprechung hat.",
      ]);
    });

    /** The row carrying the text itself becomes something to read, not something to answer. */
    it("turns the row with a material into a text to read", () => {
      expect(parsed.elements).toHaveLength(1);
      expect(parsed.elements[0]).toMatchObject({
        id: "4.1.T",
        kind: "text",
        title: "Eine E-Mail aus dem Büro",
      });
      expect(parsed.elements[0].body).toContain("weil ich krank bin");
      expect(parsed.questions.map((question) => question.id)).not.toContain("4.1.T");
    });

    it("ties the question that follows it to that text", () => {
      const about = parsed.questions.find((question) => question.id === "4.1.9");
      expect(about?.elementId).toBe("4.1.T");
    });

    /** A Grammatik question must not pick up the Lesen text that happens to be nearby. */
    it("leaves the written question in Grammatik unbound", () => {
      const written = parsed.questions.find((question) => question.id === "4.1.8");
      expect(written?.elementId).toBeNull();
    });
  });

  /**
   * `READ`, the way files from module 5 on should say "this is a text to read".
   *
   * The older spelling — `TEXT` with the material column filled — still works, but it asks the
   * reader of the file to infer which of two unrelated things a row is. `READ` says it, and a
   * mistake in the row then produces a reported problem rather than a silently wrong import.
   */
  describe("a text to read, written as READ", () => {
    const WITH_MATERIAL =
      "ID,Урок,Тип,Блок,Питання,A,B,C,D,Правильна відповідь,Пояснення,Матеріал";

    const parsed = parseQuestionCsv(
      [
        WITH_MATERIAL,
        '5.1.T,5.1,READ,lesen,Eine E-Mail aus dem Büro,,,,,,,"Hallo Anna, ich kann morgen nicht kommen, weil ich krank bin."',
        '5.1.1,5.1,ONE,lesen,Warum kommt er nicht?,Er ist krank,Er hat Urlaub,,,A) Er ist krank,Im Text steht «weil ich krank bin».',
        '5.1.2,5.1,TEXT,grammatik,"Перекладіть німецькою: Її немає.",,,,,"Sie ist nicht da, weil sie eine Besprechung hat.",hat — останнє слово.',
      ].join("\n"),
    );

    it("parses without complaint", () => {
      expect(parsed.problems).toEqual([]);
    });

    it("reads the row as a text rather than as a question", () => {
      expect(parsed.elements).toHaveLength(1);
      expect(parsed.elements[0]).toMatchObject({
        id: "5.1.T",
        kind: "text",
        title: "Eine E-Mail aus dem Büro",
      });
      expect(parsed.questions.map((question) => question.id)).not.toContain("5.1.T");
    });

    it("ties the questions that follow it to that text", () => {
      const about = parsed.questions.find((question) => question.id === "5.1.1");
      expect(about?.elementId).toBe("5.1.T");
    });

    /** The whole point of the new label: `TEXT` now means only one thing. */
    it("still reads TEXT as a question the student writes into", () => {
      const written = parsed.questions.find((question) => question.id === "5.1.2");
      expect(written?.type).toBe(QuestionType.text_input);
      expect(written?.elementId).toBeNull();
    });

    /** Better a named problem than a text that imports empty and shows a blank panel. */
    it("reports a READ row with no text instead of importing it", () => {
      const empty = parseQuestionCsv(
        [WITH_MATERIAL, "5.2.T,5.2,READ,lesen,Ein Text,,,,,,,"].join("\n"),
      );
      expect(empty.elements).toEqual([]);
      expect(empty.problems).toEqual([
        { row: 2, id: "5.2.T", message: 'READ row has no text in the "Матеріал" column' },
      ]);
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
