import { QuestionType } from '../../../generated/prisma/enums';

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
      problems: [{ row: 0, id: '', message: 'the file is empty' }],
    };
  }

  const header = rows[0].map((value) => value.trim());
  const missing = REQUIRED_COLUMNS.filter((column) => !header.includes(column));
  if (missing.length > 0) {
    return {
      questions: [],
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

  const questions: ParsedQuestion[] = [];
  const problems: ParseProblem[] = [];
  const seenIds = new Set<string>();

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
    const type = TYPE_BY_LABEL[typeLabel];
    if (!type) {
      problems.push({
        row: rowNumber,
        id,
        message: `unknown type "${cell(typeIdx)}" (expected ONE, GAP, TEXT or ORDER)`,
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
      group: cell(groupIdx) || 'Без уроку',
      type,
      prompt,
      options,
      acceptedAnswers,
      explanation: explanation || null,
      points: withPoints.points,
      suggestedAlternatives: explanation
        ? takeSuggestedAlternatives(explanation)
        : [],
      ...(tokens.length > 0 && { tokens }),
    } as ParsedQuestion & { tokens?: string[] });
  });

  return { questions, problems };
};

/** Groups questions by the lesson or part they belong to, keeping file order. */
export const groupQuestions = (
  questions: ParsedQuestion[],
): Array<{ group: string; questions: ParsedQuestion[] }> => {
  const order: string[] = [];
  const byGroup = new Map<string, ParsedQuestion[]>();
  for (const question of questions) {
    if (!byGroup.has(question.group)) {
      byGroup.set(question.group, []);
      order.push(question.group);
    }
    byGroup.get(question.group)!.push(question);
  }
  return order.map((group) => ({ group, questions: byGroup.get(group)! }));
};
