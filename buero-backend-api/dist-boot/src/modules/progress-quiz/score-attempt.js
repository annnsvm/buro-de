"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passingPoints = exports.summariseParts = exports.scoreAttempt = void 0;
const enums_1 = require("src/generated/prisma/enums");
const percent = (part, whole) => whole > 0 ? Math.round((part / whole) * 10000) / 100 : 0;
const scoreAttempt = (mode, graded) => {
    const correct = graded.filter((question) => question.correct).length;
    const total = graded.length;
    if (mode !== enums_1.QuizMode.test) {
        return {
            score: percent(correct, total),
            correct,
            total,
            earnedPoints: null,
            totalPoints: null,
        };
    }
    const totalPoints = graded.reduce((sum, q) => sum + Math.max(1, q.points), 0);
    const earnedPoints = graded.reduce((sum, q) => (q.correct ? sum + Math.max(1, q.points) : sum), 0);
    return {
        score: percent(earnedPoints, totalPoints),
        correct,
        total,
        earnedPoints,
        totalPoints,
    };
};
exports.scoreAttempt = scoreAttempt;
const summariseParts = (mode, graded) => {
    var _a, _b;
    if (mode !== enums_1.QuizMode.test)
        return [];
    const order = [];
    const byTitle = new Map();
    for (const question of graded) {
        const title = (_a = question.partTitle) === null || _a === void 0 ? void 0 : _a.trim();
        if (!title)
            continue;
        if (!byTitle.has(title)) {
            order.push(title);
            byTitle.set(title, {
                title,
                reviewLesson: question.reviewLesson,
                earnedPoints: 0,
                totalPoints: 0,
                correct: 0,
                total: 0,
                weak: false,
            });
        }
        const part = byTitle.get(title);
        const points = Math.max(1, question.points);
        part.totalPoints += points;
        part.total += 1;
        if (question.correct) {
            part.earnedPoints += points;
            part.correct += 1;
        }
        (_b = part.reviewLesson) !== null && _b !== void 0 ? _b : (part.reviewLesson = question.reviewLesson);
    }
    if (order.length < 2)
        return [];
    return order.map((title) => {
        const part = byTitle.get(title);
        return Object.assign(Object.assign({}, part), { weak: part.earnedPoints * 2 < part.totalPoints });
    });
};
exports.summariseParts = summariseParts;
const passingPoints = (passingScore, totalPoints) => {
    if (passingScore == null || totalPoints == null)
        return null;
    return Math.ceil((passingScore / 100) * totalPoints);
};
exports.passingPoints = passingPoints;
//# sourceMappingURL=score-attempt.js.map