import { PracticeBlock, PracticeElementKind, QuestionType } from '../../../generated/prisma/enums';
import { shortLabel } from '../short-label';

/**
 * Reads the CSV the course author writes her questions in.
 *
 * The file is the source of truth for what a module teaches, and it carries a few
 * conventions that only exist on paper: the answer to a multiple-choice question is
 * written as "B) Warum?", the words of an ordering exercise live inside the question
 * text separated by slashes, and a question worth two points says so in brackets at
 * the start of its own text. Each of those is decoded here rather than being left for
 * a person to tidy up by hand before every import.
 */

export type ParsedOption = { id: string; text: string };

/**
 * Which part of a practice a row belongs to. Written in any case, and Hören spelled any of the
 * three ways a keyboard allows.
 */
export const parseBlock = (raw: string): PracticeBlock | null => {
  const value = raw.trim().toLowerCase();
  if (!value) return PracticeBlock.grammatik;
  if (value === 'grammatik' || value === 'grammar') return PracticeBlock.grammatik;
  if (value === 'lesen') return PracticeBlock.lesen;
  if (value === 'hören' || value === 'horen' || value === 'hoeren') {
    return PracticeBlock.horen;
  }
  if (value === 'sprechen') return PracticeBlock.sprechen;
  if (value === 'schreiben') return PracticeBlock.schreiben;
  return null;
};

/**
 * The length a letter's body must fall within, as the author writes it in `Матеріал`.
 *
 * `6-8` is the form the files use; a dash of any width is accepted, because a spreadsheet will
 * happily turn a hyphen into an en dash without being asked. A single number means exactly that
 * many.
 */
export const parseSentenceRange = (
  raw: string,
): { min: number; max: number } | null => {
  const value = raw.trim();
  if (!value) return null;
  const range = /^(\d{1,2})\s*[-–—]\s*(\d{1,2})$/.exec(value);
  if (range) {
    const min = Number(range[1]);
    const max = Number(range[2]);
    /** A range the wrong way round is a typo, not an instruction to swap it silently. */
    return min >= 1 && max >= min ? { min, max } : null;
  }
  const single = /^(\d{1,2})$/.exec(value);
  if (single && Number(single[1]) >= 1) {
    return { min: Number(single[1]), max: Number(single[1]) };
  }
  return null;
};

/** A text to read, a recording to listen to, a prompt to speak from, or a letter to write. */
export type ParsedElement = {
  id: string;
  group: string;
  block: PracticeBlock;
  kind: PracticeElementKind;
  /** The heading above it, from the `Питання` column. */
  title: string;
  /** The text itself, for something to read. Empty for the other three. */
  body: string;
  /**
   * What is said in the recording, from `Пояснення` - an audio has no explanation of its own,
   * and the student only sees this once every question about it is answered.
   */
  transcript: string | null;
  /** A full-marks answer: the model letter, or what a good spoken answer sounds like. */
  sampleAnswer: string | null;
  /** The phrases to lean on, from `Пояснення` on a speaking row. */
  hints: string | null;
  /**
   * The rubric a letter is marked against, one criterion per line of `Пояснення`.
   *
   * It is the author's own sentences, and the same ones are shown to the student before they
   * write, sent to the grader, and quoted back beside the mark - so a letter can never lose a
   * point against a rule nobody was shown. Empty for every kind but `write`.
   */
  criteria: string[];
  /**
   * How long the body of the letter must be, from `Матеріал` written as `6-8`.
   *
   * Counted rather than judged: whether a student wrote six sentences is a fact, and a mark
   * that gates the next module should not rest on the grader having counted them.
   */
  minSentences: number | null;
  maxSentences: number | null;
  /**
   * The mp3 the row asks for, by name. A CSV cannot carry the file, so the import records what
   * it was promised and the editor says which recordings are still missing.
   */
  audioFileName: string | null;
};

export type ParsedQuestion = {
  /** The author's own id, such as 4.1.2 or T7. Becomes the question's id. */
  id: string;
  /** The lesson or test part this row belongs to, verbatim from the file. */
  group: string;
  type: QuestionType;
  prompt: string;
  options: ParsedOption[];
  acceptedAnswers: string[];
  explanation: string | null;
  /** Which lesson to revisit when this part goes badly; from an optional column. */
  reviewLesson: string | null;
  block: PracticeBlock;
  /**
   * The text or audio this question is about - the nearest one above it in the same lesson and
   * block, as the author's files are laid out.
   */
  elementId: string | null;
  points: number;
  /**
   * Wordings the explanation mentions as also acceptable. They are prose, so they are
   * reported for a person to confirm rather than accepted automatically.
   */
  suggestedAlternatives: string[];
};

export type ParseProblem = {
  /** Row number as a person counts them in a spreadsheet, header included. */
  row: number;
  id: string;
  message: string;
};

export type ParsedCsv = {
  questions: ParsedQuestion[];
  elements: ParsedElement[];
  problems: ParseProblem[];
};

const TYPE_BY_LABEL: Record<string, QuestionType> = {
  ONE: QuestionType.single_choice,
  GAP: QuestionType.fill_blank,
  TEXT: QuestionType.text_input,
  ORDER: QuestionType.ordering,
};

const REQUIRED_COLUMNS = [
  'ID',
  'Урок',
  'Тип',
  'Питання',
  'A',
  'B',
  'C',
  'D',
  'Правильна відповідь',
  'Пояснення',
] as const;

/**
 * Minimal RFC 4180 reader: fields may be quoted, quotes are doubled to escape, and a
 * quoted field may contain commas and newlines. The authored file uses all three.
 */
export const readCsvRows = (input: string): string[][] => {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  const text = input.replace(/^﻿/, '').replace(/\r\n?/g, '\n');

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((value) => value.trim() !== ''));
};

/** `(2 бали) Складіть речення: …` -> points 2, and the bracket taken off the prompt. */
const takePoints = (prompt: string): { prompt: string; points: number } => {
  // \p{L} rather than \w: the latter is ASCII only and never matched "бали".
  const match = prompt.match(/^\(\s*(\d+)\s*бал\p{L}*\s*\)\s*/iu);
  if (!match) return { prompt: prompt.trim(), points: 1 };
  return {
    prompt: prompt.slice(match[0].length).trim(),
    points: Number(match[1]),
  };
};

/**
 * The words to arrange are written into the question after the colon, separated by
 * slashes: `Складіть речення: weil / ich / arbeiten / muss`. A lone comma is one of
 * the words, so it is kept.
 */
const takeOrderingTokens = (
  prompt: string,
): { prompt: string; tokens: string[] } => {
  const separator = prompt.indexOf(':');
  if (separator === -1 || !prompt.includes('/')) {
    return { prompt, tokens: [] };
  }
  const head = prompt.slice(0, separator + 1).trim();
  const tail = prompt.slice(separator + 1);
  const tokens = tail
    .split('/')
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
  return tokens.length > 1 ? { prompt: head, tokens } : { prompt, tokens: [] };
};

/** Markers the author uses when a second wording is also right. */
const ALTERNATIVE_MARKERS = [
  /Прийнятно також(?: із \p{L}+)?:?\s*/iu,
  /Варіант\s+/iu,
];

const takeSuggestedAlternatives = (explanation: string): string[] => {
  const found: string[] = [];
  for (const marker of ALTERNATIVE_MARKERS) {
    const match = explanation.match(marker);
    if (!match || match.index === undefined) continue;
    const rest = explanation.slice(match.index + match[0].length);
    /**
     * The sentence continues past the wording itself ("… теж правильний, але його ми
     * вчимо в уроці 4.5"), so the candidate is cut at the phrase that follows it.
     */
    const candidate = rest
      .split(/\s+теж правильн\p{L}*|\s+теж\s|[.]\s|$/u)[0]
      .trim()
      .replace(/[,;]$/, '');
    if (candidate.length > 3) found.push(candidate);
  }
  return [...new Set(found)];
};

/** `B) Warum?` -> the letter B. Some rows carry only the letter, some only the text. */
const takeChoiceLetter = (correct: string): string | null => {
  const match = correct.trim().match(/^([A-DА-Г])\s*[).]/iu);
  return match ? match[1].toUpperCase() : null;
};

export const parseQuestionCsv = (input: string): ParsedCsv => {
  const rows = readCsvRows(input);
  if (rows.length === 0) {
    return {
      questions: [],
      elements: [],
      problems: [{ row: 0, id: '', message: 'the file is empty' }],
    };
  }

  const header = rows[0].map((value) => value.trim());
  const missing = REQUIRED_COLUMNS.filter((column) => !header.includes(column));
  if (missing.length > 0) {
    return {
      questions: [],
      elements: [],
      problems: [
        {
          row: 1,
          id: '',
          message: `missing column(s): ${missing.join(', ')}`,
        },
      ],
    };
  }

  const columnIndex = (name: string) => header.indexOf(name);
  const idIdx = columnIndex('ID');
  const groupIdx = columnIndex('Урок');
  const typeIdx = columnIndex('Тип');
  const promptIdx = columnIndex('Питання');
  const optionIdx = ['A', 'B', 'C', 'D'].map(columnIndex);
  const correctIdx = columnIndex('Правильна відповідь');
  const explanationIdx = columnIndex('Пояснення');
  /**
   * Optional, and absent from the files written so far. When the author adds it, a
   * student who was weak on a part is told which lesson to go back over - the mapping
   * they already write by hand at the foot of a test.
   */
  const reviewIdx = ['Урок для повторення', 'Повторити', 'Урок для повторення:']
    .map(columnIndex)
    .find((at) => at >= 0);
  /** Both optional: a file without them reads exactly as it did before they existed. */
  const blockIdx = columnIndex('Блок');
  const materialIdx = columnIndex('Матеріал');

  const questions: ParsedQuestion[] = [];
  const elements: ParsedElement[] = [];
  const problems: ParseProblem[] = [];
  const seenIds = new Set<string>();
  /** The element a question attaches to: the last one seen in the same lesson and block. */
  const openElement = new Map<string, string>();

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;
    const cell = (at: number) => (row[at] ?? '').trim();

    const id = cell(idIdx);
    const typeLabel = cell(typeIdx).toUpperCase();
    const correct = cell(correctIdx);

    if (!id) {
      problems.push({ row: rowNumber, id: '', message: 'no ID' });
      return;
    }
    if (seenIds.has(id)) {
      problems.push({ row: rowNumber, id, message: 'duplicate ID' });
      return;
    }

    const block = parseBlock(blockIdx >= 0 ? cell(blockIdx) : '');
    if (!block) {
      problems.push({
        row: rowNumber,
        id,
        message:
          `unknown block "${cell(blockIdx)}" ` +
          `(expected Grammatik, Lesen, Hören, Sprechen or Schreiben)`,
      });
      return;
    }
    const group = cell(groupIdx) || 'Без уроку';
    const material = materialIdx >= 0 ? cell(materialIdx) : '';

    /**
     * `READ` is a text to read; `TEXT` is a question answered with a whole sentence.
     *
     * The two used to share the name `TEXT`, told apart only by whether the `Матеріал` column
     * was filled. That inference is kept, because sixteen rows of module 4 rely on it, but it
     * is no longer how a new file should say which it means: `READ` says so outright, and a
     * row that says `READ` is a text whether or not the reader guesses right.
     */
    /**
     * The four rows that describe something rather than ask about it.
     *
     * Each carries its material in the column that suits it: a text to read is the material
     * itself, a recording names its file and puts what is said in `Пояснення`, and a speaking
     * or writing task puts a model answer in `Правильна відповідь` and its prompts beside it.
     * `TEXT` with a filled `Матеріал` is the older spelling of `READ`, kept for module 4.
     */
    const elementKind: PracticeElementKind | null =
      typeLabel === 'READ' || (typeLabel === 'TEXT' && material)
        ? PracticeElementKind.text
        : typeLabel === 'AUDIO'
          ? PracticeElementKind.audio
          : typeLabel === 'REC'
            ? PracticeElementKind.rec
            : typeLabel === 'WRITE'
              ? PracticeElementKind.write
              : null;

    if (elementKind) {
      const explanation = cell(explanationIdx);
      const writing = elementKind === PracticeElementKind.write;
      /**
       * A letter's rubric: one criterion per line of `Пояснення`, in the author's order.
       *
       * Lines rather than another column because a rubric runs to six or seven sentences and
       * there are only four answer columns. The file already carries multi-line fields, so
       * this is a shape the author is writing anyway.
       */
      const criteria = writing
        ? explanation
            .split(/\r?\n/)
            .map((line) => line.replace(/^\s*(?:\d+[.)]|[-–—•])\s*/, '').trim())
            .filter(Boolean)
        : [];
      const range = writing ? parseSentenceRange(material) : null;

      /** Each kind has what it cannot do without, and a missing one is reported, not guessed. */
      const missing =
        elementKind === PracticeElementKind.text && !material
          ? 'READ row has no text in the "Матеріал" column'
          : elementKind === PracticeElementKind.audio && !material
            ? 'AUDIO row names no file in the "Матеріал" column'
            : !cell(promptIdx)
              ? `${typeLabel} row has no task in the "Питання" column`
              : /**
                 * A letter with no rubric cannot be marked, and a letter marked against a
                 * rubric nobody wrote would be marked against the grader's own taste. Two
                 * criteria is the least the grader accepts.
                 */
                writing && criteria.length < 2
                ? 'WRITE row needs at least two criteria, one per line of the ' +
                  '"Пояснення" column'
                : writing && criteria.length > 10
                  ? `WRITE row has ${criteria.length} criteria in the "Пояснення" column ` +
                    '(at most 10)'
                  : /**
                     * The length criterion is settled by counting, so the count has to be
                     * written down. Guessing a default would mark every letter against a
                     * length the author never chose.
                     */
                    writing && !range
                    ? 'WRITE row needs the sentence range in the "Матеріал" column, ' +
                      'written as 6-8'
                    : writing && !correct
                      ? 'WRITE row has no model answer in the "Правильна відповідь" column'
                      : null;
      if (missing) {
        problems.push({ row: rowNumber, id, message: missing });
        return;
      }

      seenIds.add(id);
      /** The two kinds that are a prompt rather than something to read or play. */
      const spoken = elementKind === PracticeElementKind.rec || writing;

      const element: ParsedElement = {
        id,
        group,
        block,
        kind: elementKind,
        /**
         * A short name for lists and headings. A CSV has one column for the task, so for a
         * speaking or writing prompt the name is taken from its first sentence - the author
         * has already written the thing out and should not have to name it as well.
         */
        title: spoken ? shortLabel(cell(promptIdx)) : cell(promptIdx),
        /**
         * The task itself. A reading row's material is its text; a speaking or writing row's
         * prompt is its task, and it belongs here rather than in the name, which is capped at
         * 300 characters and is not what the student reads.
         */
        body:
          elementKind === PracticeElementKind.text
            ? material
            : spoken
              ? cell(promptIdx)
              : '',
        /** Only a recording has one, and it is written where an explanation would go. */
        transcript:
          elementKind === PracticeElementKind.audio ? explanation || null : null,
        /** The author's own answer, which a speaking or writing task is compared against. */
        sampleAnswer: spoken ? correct || null : null,
        /** A letter's explanation column holds its rubric instead, read above. */
        hints: elementKind === PracticeElementKind.rec ? explanation || null : null,
        criteria,
        minSentences: range?.min ?? null,
        maxSentences: range?.max ?? null,
        audioFileName:
          elementKind === PracticeElementKind.audio ? material || null : null,
      };
      elements.push(element);
      openElement.set(`${group}\u0000${block}`, id);
      return;
    }

    const type = TYPE_BY_LABEL[typeLabel];
    if (!type) {
      problems.push({
        row: rowNumber,
        id,
        message:
          `unknown type "${cell(typeIdx)}" ` +
          `(expected ONE, GAP, TEXT, ORDER, READ, AUDIO, REC or WRITE)`,
      });
      return;
    }
    if (!correct) {
      problems.push({ row: rowNumber, id, message: 'no correct answer' });
      return;
    }

    const withPoints = takePoints(cell(promptIdx));
    let prompt = withPoints.prompt;
    const explanation = cell(explanationIdx);

    const options: ParsedOption[] = [];
    let acceptedAnswers: string[] = [];
    let tokens: string[] = [];

    if (type === QuestionType.single_choice) {
      optionIdx.forEach((at, position) => {
        const text = cell(at);
        if (!text) return;
        options.push({ id: `${id}_${'abcd'[position]}`, text });
      });

      if (options.length < 2) {
        problems.push({
          row: rowNumber,
          id,
          message: 'a choice question needs at least two options in columns A-D',
        });
        return;
      }

      const letter = takeChoiceLetter(correct);
      const byLetter = letter
        ? options.find((option) => option.id.endsWith(`_${letter.toLowerCase()}`))
        : undefined;
      /** Some rows give the wording instead of the letter, so match on text too. */
      const byText = options.find(
        (option) => option.text.trim() === correct.trim(),
      );
      const chosen = byLetter ?? byText;

      if (!chosen) {
        problems.push({
          row: rowNumber,
          id,
          message: `the correct answer "${correct}" matches none of the options`,
        });
        return;
      }
      acceptedAnswers = [chosen.id];
    } else {
      acceptedAnswers = [correct];
      if (type === QuestionType.ordering) {
        const extracted = takeOrderingTokens(prompt);
        prompt = extracted.prompt;
        tokens = extracted.tokens;
        if (tokens.length < 2) {
          problems.push({
            row: rowNumber,
            id,
            message:
              'an ordering question needs its words in the prompt, separated by "/"',
          });
          return;
        }
      }
    }

    seenIds.add(id);
    questions.push({
      id,
      group,
      block,
      /** The nearest text above it in the same lesson and block, or none for grammar. */
      elementId: openElement.get(`${group}\u0000${block}`) ?? null,
      type,
      prompt,
      options,
      acceptedAnswers,
      explanation: explanation || null,
      reviewLesson: (reviewIdx !== undefined && cell(reviewIdx)) || null,
      points: withPoints.points,
      suggestedAlternatives: explanation
        ? takeSuggestedAlternatives(explanation)
        : [],
      ...(tokens.length > 0 && { tokens }),
    } as ParsedQuestion & { tokens?: string[] });
  });

  return { questions, elements, problems };
};

/** Groups questions by the lesson or part they belong to, keeping file order. */
/**
 * Groups a file's rows by the lesson they belong to, keeping file order.
 *
 * The texts travel with their lesson too: a question points at the text above it, and the two
 * have to land in the same material for that pointer to mean anything.
 */
export const groupQuestions = (
  questions: ParsedQuestion[],
  elements: ParsedElement[] = [],
): Array<{ group: string; questions: ParsedQuestion[]; elements: ParsedElement[] }> => {
  const order: string[] = [];
  const byGroup = new Map<string, ParsedQuestion[]>();
  const elementsByGroup = new Map<string, ParsedElement[]>();

  const note = (group: string) => {
    if (!byGroup.has(group)) {
      byGroup.set(group, []);
      order.push(group);
    }
  };

  for (const element of elements) {
    note(element.group);
    elementsByGroup.set(element.group, [
      ...(elementsByGroup.get(element.group) ?? []),
      element,
    ]);
  }
  for (const question of questions) {
    note(question.group);
    byGroup.get(question.group)!.push(question);
  }

  return order.map((group) => ({
    group,
    questions: byGroup.get(group) ?? [],
    elements: elementsByGroup.get(group) ?? [],
  }));
};
