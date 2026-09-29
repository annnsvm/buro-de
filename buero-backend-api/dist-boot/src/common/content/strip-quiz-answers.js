"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripQuizAnswers = void 0;
const stripQuizAnswers = (content) => {
    if (!content || typeof content !== "object" || Array.isArray(content)) {
        return content !== null && content !== void 0 ? content : null;
    }
    const source = content;
    const result = Object.assign({}, source);
    if (Array.isArray(source.questions)) {
        result.questions = source.questions.map(stripQuestionAnswer);
    }
    if (Array.isArray(source.blocks)) {
        result.blocks = source.blocks.map((block) => {
            if (!block || typeof block !== "object")
                return block;
            const entry = block;
            if (!Array.isArray(entry.questions))
                return entry;
            return Object.assign(Object.assign({}, entry), { questions: entry.questions.map(stripQuestionAnswer) });
        });
    }
    return result;
};
exports.stripQuizAnswers = stripQuizAnswers;
const stripQuestionAnswer = (question) => {
    if (!question || typeof question !== "object")
        return question;
    const _a = question, { correct: _correct, correctAnswer: _correctAnswer } = _a, rest = __rest(_a, ["correct", "correctAnswer"]);
    return rest;
};
//# sourceMappingURL=strip-quiz-answers.js.map