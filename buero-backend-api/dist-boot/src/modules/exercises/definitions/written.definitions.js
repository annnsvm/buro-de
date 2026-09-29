"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textInputDefinition = exports.fillBlankDefinition = void 0;
const enums_1 = require("../../../generated/prisma/enums");
const exercise_types_1 = require("../exercise.types");
const normalize_german_1 = require("../normalize-german");
const validateWritten = (_payload, acceptedAnswers) => acceptedAnswers.some((answer) => answer.trim().length > 0)
    ? []
    : ['a written question needs at least one accepted answer'];
const gradeWritten = (question, answer) => {
    const [text = ''] = (0, exercise_types_1.asStringArray)(answer);
    const match = (0, normalize_german_1.matchGermanAnswer)(text, question.acceptedAnswers);
    return { correct: match.correct, quality: match.quality };
};
exports.fillBlankDefinition = {
    type: enums_1.QuestionType.fill_blank,
    validatePayload: validateWritten,
    grade: gradeWritten,
    describeAcceptedAnswers: (question) => question.acceptedAnswers,
};
exports.textInputDefinition = {
    type: enums_1.QuestionType.text_input,
    validatePayload: validateWritten,
    grade: gradeWritten,
    describeAcceptedAnswers: (question) => question.acceptedAnswers,
};
//# sourceMappingURL=written.definitions.js.map