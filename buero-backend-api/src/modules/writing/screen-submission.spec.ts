import { readFileSync } from "fs";
import { join } from "path";
import { parseQuestionCsv } from "../exercises/import/parse-question-csv";
import { countSentences, readLetterShape } from "./letter-shape";
import {
  contiguousOverlap,
  cyrillicShare,
  MAX_CHARS,
  normalise,
  screenSubmission,
  shortestAccepted,
} from "./screen-submission";

/**
 * The checks that happen before any money is spent.
 *
 * Each one exists because a student has three checks for the whole task, so a text that could
 * never be marked usefully must not cost one of them. The two comparisons are the only checks
 * here that can be wrong about an honest text, so most of this file is about them.
 */

const SAMPLE =
  "Hallo Lena!\nIch habe am Samstag bis drei Uhr gearbeitet. Ich habe im Supermarkt Obst " +
  "und Käse gekauft. Ich habe lange auf den Bus gewartet. Meine Schwester hat am Abend eine " +
  "Suppe gekocht. Ich habe die Küche geputzt.\nViele Grüße\nOlha";

const TASK =
  "Напишіть Lena відповідь - що ви робили в суботу - 4-6 речень. Починайте речення з підмета.";

/** An honest letter about the same situation: same vocabulary, different sentences. */
const HONEST =
  "Hallo Lena!\nAm Samstag habe ich meine Wohnung geputzt. Dann habe ich mit meinem Bruder " +
  "telefoniert. Wir haben zusammen Pizza gegessen. Am Abend habe ich ein Buch gelesen.\n" +
  "Viele Grüße\nOlha";

const screen = (text: string, extra: Partial<Parameters<typeof screenSubmission>[0]> = {}) => {
  const shape = readLetterShape(text, 4, null, false);
  return screenSubmission({
    text,
    shape,
    minSentences: 4,
    previousTexts: [],
    sampleAnswer: SAMPLE,
    task: TASK,
    ...extra,
  });
};

describe("a text that is plainly unusable", () => {
  it("passes an honest letter through", () => {
    expect(screen(HONEST)).toBeNull();
  });

  it("refuses a text over the character cap", () => {
    const essay = "Ich habe am Samstag gearbeitet und viel geputzt. ".repeat(60);
    expect(essay.length).toBeGreaterThan(MAX_CHARS);
    expect(screen(essay)).toEqual({ reason: "too_long", limit: MAX_CHARS });
  });

  it("refuses a text under half the sentences asked for", () => {
    expect(screen("Ich war zu Hause und habe lange geschlafen.")).toMatchObject({
      reason: "too_short",
      needed: 4,
    });
  });

  /** Six full stops around nothing is the other shape of too short. */
  it("refuses a handful of words however many full stops they carry", () => {
    expect(screen("Ja. Nein. Gut. Danke. Okay. Tschuess.")).toMatchObject({
      reason: "too_short",
    });
  });

  it.each([
    [2, 1],
    [4, 2],
    [5, 3],
    [6, 3],
    [1, 1],
  ])("asks for at least half of %i sentences, which is %i", (asked, least) => {
    expect(shortestAccepted(asked)).toBe(least);
  });
});

describe("a text that is not German", () => {
  it("refuses a text written in Ukrainian", () => {
    const ukrainian =
      "У суботу я працювала до третьої. Я купила в супермаркеті фрукти й сир. " +
      "Я довго чекала на автобус. Моя сестра ввечері зварила суп.";
    expect(screen(ukrainian)).toEqual({ reason: "not_german" });
  });

  /** A German letter with a Ukrainian note in it is still a German letter. */
  it("allows a German text with a few Ukrainian words in it", () => {
    const mixed = `${HONEST}\n(не впевнена в останньому реченні)`;
    expect(cyrillicShare(mixed)).toBeLessThan(0.3);
    expect(screen(mixed)).toBeNull();
  });

  it("counts letters, not punctuation or digits", () => {
    expect(cyrillicShare("Ich habe 1234 Euro!!! ...")).toBe(0);
    expect(cyrillicShare("привіт")).toBe(1);
  });

  it("says nothing about a text with no letters at all", () => {
    expect(cyrillicShare("1234 !!! ...")).toBe(0);
  });
});

describe("a text that was already sent", () => {
  it("refuses the same text a second time", () => {
    expect(screen(HONEST, { previousTexts: [HONEST] })).toEqual({
      reason: "already_sent",
    });
  });

  /**
   * The comparison ignores what a marker would not see. A student who resends the same letter
   * with a comma moved has changed nothing, and should keep their check rather than spend it
   * finding that out.
   */
  it("refuses the same text with the punctuation and spacing changed", () => {
    const fiddled = HONEST.replace(/\./g, " ...").replace(/\n/g, "  \n ");
    expect(screen(fiddled, { previousTexts: [HONEST] })).toEqual({
      reason: "already_sent",
    });
  });

  it("lets a genuinely rewritten text through", () => {
    const rewritten = HONEST.replace("geputzt", "aufgeräumt").replace(
      "ein Buch gelesen",
      "einen Film gesehen",
    );
    expect(screen(rewritten, { previousTexts: [HONEST] })).toBeNull();
  });

  it("looks at every earlier attempt, not only the last", () => {
    const other = HONEST.replace("Pizza", "Suppe");
    expect(screen(HONEST, { previousTexts: [HONEST, other] })).toEqual({
      reason: "already_sent",
    });
  });

  it("leaves case and accents alone when normalising", () => {
    expect(normalise("Viele GRÜSSE, Olha!")).toBe("viele grüsse olha");
  });
});

describe("a text that was copied", () => {
  it("refuses the author's own sample sent as a student text", () => {
    expect(screen(SAMPLE)).toEqual({ reason: "copied" });
  });

  /**
   * The author's tasks are written in Ukrainian, so a task pasted back is caught one check
   * earlier, as a text that is not German. The copy check against the task only ever matters for
   * the German parts of it - the `Опори`, and any German sentence in the situation.
   */
  it("refuses the task pasted back, as a text that is not German", () => {
    const pasted = `${TASK} ${TASK}`;
    expect(screen(pasted, { minSentences: 1 })?.reason).toBe("not_german");
  });

  it("refuses a German task pasted back as an answer", () => {
    const germanTask =
      "Schreiben Sie Lena eine Antwort darueber was Sie am Samstag gemacht haben. " +
      "Beginnen Sie jeden Satz mit dem Subjekt und schreiben Sie vier bis sechs Saetze.";
    expect(
      screen(germanTask, { minSentences: 1, sampleAnswer: null, task: germanTask })?.reason,
    ).toBe("copied");
  });

  /**
   * The check that must not be too eager.
   *
   * Two A2 letters about the same Saturday share most of their words - the same verbs, the same
   * days, the same closing. Counting single words would call this a copy; five words in a row is
   * a sentence someone else wrote.
   */
  it("does not call an honest letter a copy", () => {
    expect(contiguousOverlap(HONEST, SAMPLE)).toBeLessThan(0.8);
    expect(screen(HONEST)).toBeNull();
  });

  it("catches a sample with one word swapped", () => {
    const barelyEdited = SAMPLE.replace("Obst", "Brot");
    expect(contiguousOverlap(barelyEdited, SAMPLE)).toBeGreaterThanOrEqual(0.8);
    expect(screen(barelyEdited)).toEqual({ reason: "copied" });
  });

  /**
   * Where the author's threshold actually sits, recorded rather than wished for.
   *
   * Two words changed measures 0.63 to 0.80 across her 53 answers, so at a threshold of 0.8 a
   * copy edited that much reaches the checker and is marked. That is the deliberate trade: the
   * worst honest text measured scores 0.087, so the threshold could come down a long way, but
   * accusing an honest student is worse than paying for one edited copy.
   */
  it("lets a sample with two words swapped reach the checker at the author's threshold", () => {
    const edited = SAMPLE.replace("Obst", "Brot").replace("Suppe", "Nudeln");
    const overlap = contiguousOverlap(edited, SAMPLE);
    expect(overlap).toBeGreaterThan(0.5);
    expect(overlap).toBeLessThan(0.8);
  });

  it("reads a short text as no overlap rather than as a copy", () => {
    expect(contiguousOverlap("Ich bin krank", SAMPLE)).toBe(0);
  });
});

/**
 * Against the real thing: the author's own 53 answers.
 *
 * Checklist item 4 of her spec says every one of them must score full marks, which means every
 * one must first get past these checks when sent as a fresh attempt - and be caught as a copy
 * when its own task is the one being answered.
 */
describe("the author's 53 model answers", () => {
  const DIR = join(__dirname, "../../../test/fixtures/schreiben");
  const tasks = ["1", "2", "3", "4", "5", "6"].flatMap((n) => {
    const file = `Buro_de-A2.1-Modul-${n}-Schreiben.csv`;
    return parseQuestionCsv(readFileSync(join(DIR, file), "utf8")).elements.map((element) => ({
      id: element.id,
      german: String(element.sampleAnswer ?? "").split(/\n\s*Переклад:/)[0].trim(),
      task: element.body || element.title,
      minSentences: element.minSentences ?? 4,
      sampleAnswer: element.sampleAnswer,
    }));
  });

  it("are all there", () => {
    expect(tasks).toHaveLength(53);
  });

  it.each(tasks.map((t) => [t.id, t] as const))(
    "%s is long enough and read as German",
    (_id, task) => {
      const shape = readLetterShape(task.german, task.minSentences, null, false);
      const refusal = screenSubmission({
        text: task.german,
        shape,
        minSentences: task.minSentences,
        previousTexts: [],
        /** Its own sample withheld, so this measures the text and not the copy check. */
        sampleAnswer: null,
        task: task.task,
      });
      expect(refusal).toBeNull();
    },
  );

  it.each(tasks.map((t) => [t.id, t] as const))(
    "%s is caught as a copy of itself",
    (_id, task) => {
      const shape = readLetterShape(task.german, task.minSentences, null, false);
      expect(
        screenSubmission({
          text: task.german,
          shape,
          minSentences: task.minSentences,
          previousTexts: [],
          sampleAnswer: task.sampleAnswer,
          task: task.task,
        }),
      ).toEqual({ reason: "copied" });
    },
  );

  /** Every answer stays well under the cap, so the cap never refuses honest work. */
  it("are all comfortably under the character cap", () => {
    const longest = Math.max(...tasks.map((t) => t.german.length));
    expect(longest).toBeLessThan(MAX_CHARS * 0.8);
  });

  /** The counting the free check relies on has to agree with the task it is counting for. */
  it("each have at least as many sentences as their task asks for", () => {
    const short = tasks.filter(
      (t) => countSentences(t.german) < shortestAccepted(t.minSentences),
    );
    expect(short.map((t) => t.id)).toEqual([]);
  });
});
