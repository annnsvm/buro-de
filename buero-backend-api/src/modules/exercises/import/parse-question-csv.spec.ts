import { PracticeBlock, QuestionType } from "src/generated/prisma/enums";
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
        "4.1.1,4.1 - Чому ти запізнився? (weil),ONE,На яке питання відповідає підрядне речення з weil?,Wohin?,Warum?,Wann?,Wie?,B) Warum?,weil називає причину.",
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
        '4.1.2,4.1 - weil,GAP,"Ich bleibe zu Hause, weil ich krank ___. (sein)",,,,,bin,у підрядному дієслово останнє.',
        '4.1.8,4.1 - weil,TEXT,"Перекладіть німецькою: Її немає.",,,,,"Sie ist nicht da, weil sie eine Besprechung hat.","hat - останнє слово. Прийнятно також Sie ist nicht hier, weil sie eine Besprechung hat."',
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
   * `TEXT` in the authored files, and only the `Матеріал` column tells them apart - so this
   * is the test that keeps a reading text from being imported as a question, and a
   * sentence-answer question from being imported as a text nobody can answer.
   */
  describe("a written question and a text to read, side by side", () => {
    const WITH_MATERIAL =
      "ID,Урок,Тип,Блок,Питання,A,B,C,D,Правильна відповідь,Пояснення,Матеріал";
    const parsed = parseQuestionCsv(
      [
        WITH_MATERIAL,
        '4.1.8,4.1,TEXT,grammatik,"Перекладіть німецькою: Її немає.",,,,,"Sie ist nicht da, weil sie eine Besprechung hat.","hat - останнє слово.",',
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
   * The older spelling - `TEXT` with the material column filled - still works, but it asks the
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
        '5.1.2,5.1,TEXT,grammatik,"Перекладіть німецькою: Її немає.",,,,,"Sie ist nicht da, weil sie eine Besprechung hat.",hat - останнє слово.',
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

  /**
   * The rows of module 2 that describe something instead of asking about it.
   *
   * Every row below is copied from the authored module 2 file. Three of its four shapes were
   * silently thrown away before: `AUDIO` and `REC` were unknown types, so sixteen recordings
   * and nine speaking tasks never arrived - and worse, the seventy-odd Hören questions still
   * imported, leaving students asked about a recording that was never there.
   */
  describe("recordings, speaking and writing rows", () => {
    const FULL =
      "ID,Урок,Тип,Питання,A,B,C,D,Правильна відповідь,Пояснення,Блок,Матеріал";

    const parsed = parseQuestionCsv(
      [
        FULL,
        '2.1.HA1,2.1 - Dativ,AUDIO,Розмова в офісі,,,,,,"OLHA: Markus, hast du kurz Zeit?",Hören,A2.1-2.1-hoeren-1.mp3',
        '2.1.H0,2.1 - Dativ,ONE,Про що розмовляють?,про клієнта,про презентацію,про день народження,,C) про день народження,Frau Berg hat heute Geburtstag.,Hören,',
        '2.1.S1,2.1 - Dativ,REC,"Запишіть 3–4 речення: кому ви сьогодні допомагали.",,,,,Heute habe ich dem Techniker geholfen.,"Ich helfe …\nIch danke …",Sprechen,',
        '2.1.W1,2.1 - Dativ,WRITE,Напишіть колезі лист на 6–8 речень.,,,,,"Liebe Frau Berg, herzlichen Glückwunsch!","У тілі листа 6–8 речень; є звертання і формула прощання\nЄ речення з weil, побудоване правильно\nТекст ввічливий",Schreiben,6-8',
      ].join("\n"),
    );

    it("parses the whole set without complaint", () => {
      expect(parsed.problems).toEqual([]);
      expect(parsed.elements).toHaveLength(3);
    });

    it("reads a recording, and keeps the file it asks for by name", () => {
      const audio = parsed.elements.find((e) => e.id === "2.1.HA1");
      expect(audio).toMatchObject({
        kind: "audio",
        block: PracticeBlock.horen,
        title: "Розмова в офісі",
        audioFileName: "A2.1-2.1-hoeren-1.mp3",
      });
      /** What is said goes where an explanation would - an audio has none of its own. */
      expect(audio?.transcript).toContain("hast du kurz Zeit");
    });

    /** The whole point of importing the recording: its questions now have something to be about. */
    it("ties the listening questions to the recording above them", () => {
      const question = parsed.questions.find((q) => q.id === "2.1.H0");
      expect(question?.elementId).toBe("2.1.HA1");
      expect(question?.block).toBe(PracticeBlock.horen);
    });

    it("reads a speaking task with its model answer and its prompts", () => {
      const rec = parsed.elements.find((e) => e.id === "2.1.S1");
      expect(rec).toMatchObject({ kind: "rec", block: PracticeBlock.sprechen });
      expect(rec?.sampleAnswer).toContain("dem Techniker geholfen");
      expect(rec?.hints).toContain("Ich danke");
      /** A speaking task is not a recording, so it asks for no file. */
      expect(rec?.audioFileName).toBeNull();
      expect(rec?.transcript).toBeNull();
    });

    it("reads a writing task into the Schreiben block", () => {
      const write = parsed.elements.find((e) => e.id === "2.1.W1");
      expect(write).toMatchObject({
        kind: "write",
        block: PracticeBlock.schreiben,
        minSentences: 6,
        maxSentences: 8,
      });
      expect(write?.sampleAnswer).toContain("Glückwunsch");
      /**
       * The rubric, line by line, in the author's order. The student is shown these exact
       * sentences before writing and the mark quotes them back, so a letter can never lose a
       * point against a rule nobody saw.
       */
      expect(write?.criteria).toEqual([
        "У тілі листа 6–8 речень; є звертання і формула прощання",
        "Є речення з weil, побудоване правильно",
        "Текст ввічливий",
      ]);
      /** The explanation column is the rubric here, so there is nothing left to be a hint. */
      expect(write?.hints).toBeNull();
    });

    /**
     * The three ways a writing row can arrive unmarkable. Each is reported against the column
     * the author has to fix, because "WRITE row is invalid" would send her looking through
     * twelve of them.
     */
    it("reports a writing row with no rubric", () => {
      const empty = parseQuestionCsv(
        [
          FULL,
          "2.2.W1,2.2 - Dativ,WRITE,Напишіть лист,,,,,Sehr geehrte Frau Berg,,Schreiben,6-8",
        ].join("\n"),
      );
      expect(empty.elements).toEqual([]);
      expect(empty.problems[0].message).toContain("at least two criteria");
    });

    it("reports a writing row with no sentence range", () => {
      const empty = parseQuestionCsv(
        [
          FULL,
          '2.2.W2,2.2 - Dativ,WRITE,Напишіть лист,,,,,Sehr geehrte Frau Berg,"Перше\nДруге",Schreiben,',
        ].join("\n"),
      );
      expect(empty.elements).toEqual([]);
      expect(empty.problems[0].message).toContain("sentence range");
    });

    /** Without a model answer the task has nothing to degrade to when the budget runs out. */
    it("reports a writing row with no model answer", () => {
      const empty = parseQuestionCsv(
        [
          FULL,
          '2.2.W3,2.2 - Dativ,WRITE,Напишіть лист,,,,,,"Перше\nДруге",Schreiben,6-8',
        ].join("\n"),
      );
      expect(empty.elements).toEqual([]);
      expect(empty.problems[0].message).toContain("model answer");
    });

    /**
     * A spreadsheet turns a hyphen into an en dash without being asked, and numbered lines
     * are how a person writes a list. Neither should cost the author an import.
     */
    it("accepts an en-dashed range and strips list numbering from the rubric", () => {
      const tidy = parseQuestionCsv(
        [
          FULL,
          '2.3.W1,2.3 - Dativ,WRITE,Напишіть лист,,,,,Sehr geehrte Frau Berg,"1. Перше\n2. Друге",Schreiben,5–7',
        ].join("\n"),
      );
      expect(tidy.problems).toEqual([]);
      expect(tidy.elements[0]).toMatchObject({
        minSentences: 5,
        maxSentences: 7,
        criteria: ["Перше", "Друге"],
      });
    });

    /**
     * Where a long prompt goes.
     *
     * The task and its short name were one field, capped at the name's 300 characters, so a
     * real prompt - a paragraph of setup before "напишіть листа" - had nowhere to live. The
     * task is `body` now; the name is derived from its first sentence.
     */
    it("puts a long prompt in the task, and names it from its first sentence", () => {
      const long =
        "Ви захворіли і не можете прийти на роботу. На 10:00 у вас була нарада з клієнтом, " +
        "яку тепер треба скасувати або перенести. Напишіть листа керівникові: повідомте, що " +
        "ви хворі, попросіть скасувати або перенести нараду, вибачтеся і подякуйте за " +
        "розуміння. 6–8 речень у тілі листа; Betreff, звертання та формула прощання не " +
        "рахуються.";
      expect(long.length).toBeGreaterThan(300);

      const parsed = parseQuestionCsv(
        [
          FULL,
          `2.4.W1,2.4 - Dativ,WRITE,"${long}",,,,,Sehr geehrte Frau Berg,"Перше\nДруге",Schreiben,6-8`,
        ].join("\n"),
      );

      expect(parsed.problems).toEqual([]);
      expect(parsed.elements[0].body).toBe(long);
      /** The name is a label, and the column it is stored in holds 300 characters. */
      expect(parsed.elements[0].title).toBe("Ви захворіли і не можете прийти на роботу.");
      expect(parsed.elements[0].title.length).toBeLessThanOrEqual(300);
    });

    it("does the same for a speaking prompt", () => {
      const rec = parsed.elements.find((e) => e.id === "2.1.S1");
      const prompt = "Запишіть 3–4 речення: кому ви сьогодні допомагали.";
      expect(rec?.body).toBe(prompt);
      /** Short enough to be its own name, so nothing is derived. */
      expect(rec?.title).toBe(prompt);
    });

    /** A reading text is the other way round: its heading is its name, its material the text. */
    it("leaves a reading text's heading alone", () => {
      const parsed = parseQuestionCsv(
        [
          FULL,
          '2.5.R1,2.5 - Dativ,READ,Eine E-Mail aus dem Büro,,,,,,,Lesen,"Liebe Kollegen, morgen ist die Besprechung."',
        ].join("\n"),
      );
      expect(parsed.elements[0].title).toBe("Eine E-Mail aus dem Büro");
      expect(parsed.elements[0].body).toContain("morgen ist die Besprechung");
    });

    /** A recording with no file named would import as a player with nothing to play. */
    it("reports an AUDIO row that names no file", () => {
      const empty = parseQuestionCsv(
        [FULL, "2.2.HA1,2.2 - Dativ,AUDIO,Ранок у понеділок,,,,,,,Hören,"].join("\n"),
      );
      expect(empty.elements).toEqual([]);
      expect(empty.problems).toEqual([
        {
          row: 2,
          id: "2.2.HA1",
          message: 'AUDIO row names no file in the "Матеріал" column',
        },
      ]);
    });

    it("reports a speaking row with no task written in it", () => {
      const empty = parseQuestionCsv(
        [FULL, "2.2.S1,2.2 - Dativ,REC,,,,,,Beispiel,Опори,Sprechen,"].join("\n"),
      );
      expect(empty.problems[0].message).toContain('REC row has no task');
    });
  });

  describe("an ordering row", () => {
    const { questions, problems } = parseQuestionCsv(
      csv(
        '4.2.8,4.2 - weil + модальні,ORDER,"Складіть речення: Ich kann nicht kommen, / weil / ich / arbeiten / muss",,,,,"Ich kann nicht kommen, weil ich arbeiten muss.",після weil підмет.',
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
        "4.9.1,4.9,MATCH,Зіставте слова,a,b,,,a,-",
        "4.9.2,4.9,ONE,Питання без відповіді,a,b,,,,-",
        "4.9.3,4.9,ONE,Відповідь не збігається з варіантами,Wohin?,Warum?,,,Z) Wann?,-",
        "4.9.4,4.9,ORDER,Складіть речення без слів,,,,,Ich komme,-",
        ",4.9,GAP,Рядок без ID,,,,,bin,-",
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
          "4.1.1,4.1,GAP,Перше,,,,,bin,-",
          "4.1.1,4.1,GAP,Друге,,,,,hat,-",
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
      "4.1.1,4.1 - weil,GAP,Перше,,,,,bin,-",
      "4.2.1,4.2 - модальні,GAP,Друге,,,,,hat,-",
      "4.1.2,4.1 - weil,GAP,Третє,,,,,ist,-",
    ),
  );

  it("collects the questions of each lesson together", () => {
    const groups = groupQuestions(questions);
    expect(groups.map((group) => group.group)).toEqual([
      "4.1 - weil",
      "4.2 - модальні",
    ]);
    expect(groups[0].questions.map((question) => question.id)).toEqual([
      "4.1.1",
      "4.1.2",
    ]);
  });
});
