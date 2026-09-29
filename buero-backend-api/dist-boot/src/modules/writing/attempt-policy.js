"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideAttempt = exports.MONTHLY_BUDGET_CHECKS = exports.DAILY_LIMIT_PER_USER = exports.ATTEMPT_WINDOW_HOURS = exports.ATTEMPTS_PER_TASK = void 0;
exports.ATTEMPTS_PER_TASK = Number((_a = process.env.LLM_WRITING_ATTEMPTS_PER_TASK) !== null && _a !== void 0 ? _a : 3);
exports.ATTEMPT_WINDOW_HOURS = Number((_b = process.env.LLM_WRITING_WINDOW_HOURS) !== null && _b !== void 0 ? _b : 24);
exports.DAILY_LIMIT_PER_USER = Number((_c = process.env.LLM_WRITING_DAILY_LIMIT) !== null && _c !== void 0 ? _c : 10);
exports.MONTHLY_BUDGET_CHECKS = Number((_d = process.env.LLM_WRITING_MONTHLY_BUDGET_CHECKS) !== null && _d !== void 0 ? _d : 0);
const decideAttempt = (counts, now) => {
    if (exports.MONTHLY_BUDGET_CHECKS > 0 && counts.monthAcrossEveryone >= exports.MONTHLY_BUDGET_CHECKS) {
        return { allowed: false, reason: 'budget', retryAt: null };
    }
    if (counts.todayAcrossTasks >= exports.DAILY_LIMIT_PER_USER) {
        return { allowed: false, reason: 'daily', retryAt: addHours(now, 24) };
    }
    const windowStart = addHours(now, -exports.ATTEMPT_WINDOW_HOURS);
    const inWindow = counts.taskAttempts.filter((at) => at > windowStart);
    if (inWindow.length >= exports.ATTEMPTS_PER_TASK) {
        const oldest = inWindow.reduce((a, b) => (a < b ? a : b));
        return { allowed: false, reason: 'wait', retryAt: addHours(oldest, exports.ATTEMPT_WINDOW_HOURS) };
    }
    return {
        allowed: true,
        attemptNumber: counts.taskAttempts.length + 1,
        attemptsLeft: exports.ATTEMPTS_PER_TASK - inWindow.length - 1,
    };
};
exports.decideAttempt = decideAttempt;
const addHours = (at, hours) => new Date(at.getTime() + hours * 60 * 60 * 1000);
//# sourceMappingURL=attempt-policy.js.map