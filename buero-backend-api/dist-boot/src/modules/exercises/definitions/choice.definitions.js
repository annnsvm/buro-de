"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiChoiceDefinition = exports.singleChoiceDefinition = void 0;
const enums_1 = require("../../../generated/prisma/enums");
const exercise_types_1 = require("../exercise.types");
const readOptionIds = (payload) => {
    const options = payload === null || payload === void 0 ? void 0 : payload.options;
    if (!Array.isArray(options))
        return [];
    return options
        .map((option) => (typeof (option === null || option === void 0 ? void 0 : option.id) === 'string' ? option.id : null))
        .filter((id) => id !== null);
};
const validateChoice = (payload, acceptedAnswers, { multi }) => {
    const problems = [];
    const optionIds = readOptionIds(payload);
    if (optionIds.length < 2) {
        problems.push('a choice question needs at least two options with ids');
    }
    if (acceptedAnswers.length === 0) {
        problems.push('no correct answer is marked');
    }
    for (const accepted of acceptedAnswers) {
        const parts = accepted.split(',').map((part) => part.trim()).filter(Boolean);
        if (!multi && parts.length > 1) {
            problems.push(`single choice cannot accept a set of options: "${accepted}"`);
        }
        for (const part of parts) {
            if (!optionIds.includes(part)) {
                problems.push(`correct answer "${part}" is not one of the options`);
            }
        }
    }
    return problems;
};
const gradeChoice = (question, answer) => {
    const given = (0, exercise_types_1.canonicalSet)(answer);
    if (!given)
        return { correct: false, quality: 'none' };
    const correct = question.acceptedAnswers.some((accepted) => (0, exercise_types_1.canonicalSet)(accepted) === given);
    return { correct, quality: correct ? 'exact' : 'none' };
};
const readOptionTexts = (payload) => {
    const options = payload === null || payload === void 0 ? void 0 : payload.options;
    const byId = new Map();
    if (!Array.isArray(options))
        return byId;
    for (const option of options) {
        if (typeof (option === null || option === void 0 ? void 0 : option.id) === 'string') {
            byId.set(option.id, typeof option.text === 'string' ? option.text : option.id);
        }
    }
    return byId;
};
const describeChoice = (question) => {
    const byId = readOptionTexts(question.payload);
    return question.acceptedAnswers.map((accepted) => accepted
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((id) => { var _a; return (_a = byId.get(id)) !== null && _a !== void 0 ? _a : id; })
        .join(', '));
};
exports.singleChoiceDefinition = {
    type: enums_1.QuestionType.single_choice,
    validatePayload: (payload, acceptedAnswers) => validateChoice(payload, acceptedAnswers, { multi: false }),
    grade: gradeChoice,
    describeAcceptedAnswers: describeChoice,
};
exports.multiChoiceDefinition = {
    type: enums_1.QuestionType.multi_choice,
    validatePayload: (payload, acceptedAnswers) => validateChoice(payload, acceptedAnswers, { multi: true }),
    grade: gradeChoice,
    describeAcceptedAnswers: describeChoice,
};
//# sourceMappingURL=choice.definitions.js.map