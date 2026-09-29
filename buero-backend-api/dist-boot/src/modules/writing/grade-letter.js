"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeLetter = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const zod_1 = require("@anthropic-ai/sdk/helpers/zod");
const letter_shape_1 = require("./letter-shape");
const rubric_1 = require("./rubric");
const MODEL = (_a = process.env.LLM_WRITING_MODEL) !== null && _a !== void 0 ? _a : 'claude-opus-5';
const MAX_OUTPUT_TOKENS = Number((_b = process.env.LLM_WRITING_MAX_OUTPUT_TOKENS) !== null && _b !== void 0 ? _b : 2000);
const EFFORT = ((_c = process.env.LLM_WRITING_EFFORT) !== null && _c !== void 0 ? _c : 'medium');
const gradeLetter = async (task, letter, client = new sdk_1.default()) => {
    const pre = (0, letter_shape_1.preCheckLetter)(letter, task.minSentences, task.maxSentences);
    if (!pre.ok) {
        return { status: 'rejected', reason: pre.reason, calledModel: false };
    }
    const response = await client.messages.parse({
        model: MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        output_config: {
            effort: EFFORT,
            format: (0, zod_1.zodOutputFormat)((0, rubric_1.buildAssessmentSchema)(task.criteria.length)),
        },
        system: (0, rubric_1.buildSystemPrompt)(),
        messages: [
            {
                role: 'user',
                content: (0, rubric_1.buildUserPrompt)(task.criteria, letter, pre.shape.meetsCriterionOne, pre.shape.bodySentences),
            },
        ],
    });
    const parsed = response.parsed_output;
    if (!parsed) {
        throw new Error('Модель повернула відповідь, яку не вдалося розібрати за схемою');
    }
    const criteria = parsed.criteria.map((verdict) => verdict.id === 1 ? Object.assign(Object.assign({}, verdict), { met: pre.shape.meetsCriterionOne }) : verdict);
    return {
        status: 'graded',
        score: criteria.filter((verdict) => verdict.met).length,
        assessment: { criteria },
        calledModel: true,
        usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
        },
    };
};
exports.gradeLetter = gradeLetter;
//# sourceMappingURL=grade-letter.js.map