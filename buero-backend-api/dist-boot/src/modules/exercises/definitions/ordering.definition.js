"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderingDefinition = void 0;
const enums_1 = require("../../../generated/prisma/enums");
const exercise_types_1 = require("../exercise.types");
const normalize_german_1 = require("../normalize-german");
const readTokens = (payload) => {
    const tokens = payload === null || payload === void 0 ? void 0 : payload.tokens;
    if (!Array.isArray(tokens))
        return [];
    return tokens.filter((token) => typeof token === 'string');
};
exports.orderingDefinition = {
    type: enums_1.QuestionType.ordering,
    validatePayload: (payload, acceptedAnswers) => {
        const problems = [];
        const tokens = readTokens(payload);
        if (tokens.length < 2) {
            problems.push('an ordering question needs at least two tokens to arrange');
        }
        if (!acceptedAnswers.some((answer) => answer.trim().length > 0)) {
            problems.push('an ordering question needs at least one accepted order');
        }
        if (tokens.length > 0 && acceptedAnswers.length > 0) {
            const bag = (value) => value
                .toLowerCase()
                .replace(/[.,!?;]/g, ' ')
                .split(/\s+/)
                .filter(Boolean)
                .sort()
                .join(' ');
            const fromTokens = bag(tokens.join(' '));
            const reachable = acceptedAnswers.some((answer) => bag(answer) === fromTokens);
            if (!reachable) {
                problems.push('the words given cannot be arranged into any of the accepted answers');
            }
        }
        return problems;
    },
    grade: (question, answer) => {
        const given = (0, exercise_types_1.asStringArray)(answer).join(' ');
        const match = (0, normalize_german_1.matchGermanAnswer)(given, question.acceptedAnswers);
        const quality = match.quality === 'case' ? 'exact' : match.quality;
        return { correct: match.correct, quality };
    },
    describeAcceptedAnswers: (question) => question.acceptedAnswers,
};
//# sourceMappingURL=ordering.definition.js.map