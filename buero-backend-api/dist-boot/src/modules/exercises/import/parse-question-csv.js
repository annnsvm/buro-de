"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupQuestions = exports.parseQuestionCsv = exports.readCsvRows = void 0;
const enums_1 = require("../../../generated/prisma/enums");
const TYPE_BY_LABEL = {
    ONE: enums_1.QuestionType.single_choice,
    GAP: enums_1.QuestionType.fill_blank,
    TEXT: enums_1.QuestionType.text_input,
    ORDER: enums_1.QuestionType.ordering,
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
];
const readCsvRows = (input) => {
    const rows = [];
    let field = '';
    let row = [];
    let inQuotes = false;
    const text = input.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i += 1;
                }
                else {
                    inQuotes = false;
                }
            }
            else {
                field += char;
            }
            continue;
        }
        if (char === '"') {
            inQuotes = true;
        }
        else if (char === ',') {
            row.push(field);
            field = '';
        }
        else if (char === '\n') {
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
        }
        else {
            field += char;
        }
    }
    if (field !== '' || row.length > 0) {
        row.push(field);
        rows.push(row);
    }
    return rows.filter((entry) => entry.some((value) => value.trim() !== ''));
};
exports.readCsvRows = readCsvRows;
const takePoints = (prompt) => {
    const match = prompt.match(/^\(\s*(\d+)\s*бал\p{L}*\s*\)\s*/iu);
    if (!match)
        return { prompt: prompt.trim(), points: 1 };
    return {
        prompt: prompt.slice(match[0].length).trim(),
        points: Number(match[1]),
    };
};
const takeOrderingTokens = (prompt) => {
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
const ALTERNATIVE_MARKERS = [
    /Прийнятно також(?: із \p{L}+)?:?\s*/iu,
    /Варіант\s+/iu,
];
const takeSuggestedAlternatives = (explanation) => {
    const found = [];
    for (const marker of ALTERNATIVE_MARKERS) {
        const match = explanation.match(marker);
        if (!match || match.index === undefined)
            continue;
        const rest = explanation.slice(match.index + match[0].length);
        const candidate = rest
            .split(/\s+теж правильн\p{L}*|\s+теж\s|[.]\s|$/u)[0]
            .trim()
            .replace(/[,;]$/, '');
        if (candidate.length > 3)
            found.push(candidate);
    }
    return [...new Set(found)];
};
const takeChoiceLetter = (correct) => {
    const match = correct.trim().match(/^([A-DА-Г])\s*[).]/iu);
    return match ? match[1].toUpperCase() : null;
};
const parseQuestionCsv = (input) => {
    const rows = (0, exports.readCsvRows)(input);
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
    const columnIndex = (name) => header.indexOf(name);
    const idIdx = columnIndex('ID');
    const groupIdx = columnIndex('Урок');
    const typeIdx = columnIndex('Тип');
    const promptIdx = columnIndex('Питання');
    const optionIdx = ['A', 'B', 'C', 'D'].map(columnIndex);
    const correctIdx = columnIndex('Правильна відповідь');
    const explanationIdx = columnIndex('Пояснення');
    const reviewIdx = ['Урок для повторення', 'Повторити', 'Урок для повторення:']
        .map(columnIndex)
        .find((at) => at >= 0);
    const questions = [];
    const problems = [];
    const seenIds = new Set();
    rows.slice(1).forEach((row, index) => {
        const rowNumber = index + 2;
        const cell = (at) => { var _a; return ((_a = row[at]) !== null && _a !== void 0 ? _a : '').trim(); };
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
        const options = [];
        let acceptedAnswers = [];
        let tokens = [];
        if (type === enums_1.QuestionType.single_choice) {
            optionIdx.forEach((at, position) => {
                const text = cell(at);
                if (!text)
                    return;
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
            const byText = options.find((option) => option.text.trim() === correct.trim());
            const chosen = byLetter !== null && byLetter !== void 0 ? byLetter : byText;
            if (!chosen) {
                problems.push({
                    row: rowNumber,
                    id,
                    message: `the correct answer "${correct}" matches none of the options`,
                });
                return;
            }
            acceptedAnswers = [chosen.id];
        }
        else {
            acceptedAnswers = [correct];
            if (type === enums_1.QuestionType.ordering) {
                const extracted = takeOrderingTokens(prompt);
                prompt = extracted.prompt;
                tokens = extracted.tokens;
                if (tokens.length < 2) {
                    problems.push({
                        row: rowNumber,
                        id,
                        message: 'an ordering question needs its words in the prompt, separated by "/"',
                    });
                    return;
                }
            }
        }
        seenIds.add(id);
        questions.push(Object.assign({ id, group: cell(groupIdx) || 'Без уроку', type,
            prompt,
            options,
            acceptedAnswers, explanation: explanation || null, reviewLesson: (reviewIdx !== undefined && cell(reviewIdx)) || null, points: withPoints.points, suggestedAlternatives: explanation
                ? takeSuggestedAlternatives(explanation)
                : [] }, (tokens.length > 0 && { tokens })));
    });
    return { questions, problems };
};
exports.parseQuestionCsv = parseQuestionCsv;
const groupQuestions = (questions) => {
    const order = [];
    const byGroup = new Map();
    for (const question of questions) {
        if (!byGroup.has(question.group)) {
            byGroup.set(question.group, []);
            order.push(question.group);
        }
        byGroup.get(question.group).push(question);
    }
    return order.map((group) => ({ group, questions: byGroup.get(group) }));
};
exports.groupQuestions = groupQuestions;
//# sourceMappingURL=parse-question-csv.js.map