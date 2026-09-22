/**
 * Removes the answer key from quiz material content before it is serialized.
 *
 * Grading runs server-side from the database, so a client never needs `correct`.
 * Shipping it only lets a student read the key in DevTools, which makes every
 * stored score meaningless. This is shared by every endpoint that returns a
 * material so the rule cannot drift between them.
 *
 * Handles both shapes the grader accepts — flat `{ questions: [...] }` and the
 * legacy `{ blocks: [{ questions: [...] }] }` — and both key conventions in the
 * repository (`correct` at runtime, `correctAnswer` in the seed).
 */
export const stripQuizAnswers = (content: unknown): unknown => {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return content ?? null;
  }

  const source = content as Record<string, unknown>;
  const result: Record<string, unknown> = { ...source };

  if (Array.isArray(source.questions)) {
    result.questions = source.questions.map(stripQuestionAnswer);
  }

  if (Array.isArray(source.blocks)) {
    result.blocks = source.blocks.map((block) => {
      if (!block || typeof block !== "object") return block;
      const entry = block as Record<string, unknown>;
      if (!Array.isArray(entry.questions)) return entry;
      return { ...entry, questions: entry.questions.map(stripQuestionAnswer) };
    });
  }

  return result;
};

const stripQuestionAnswer = (question: unknown): unknown => {
  if (!question || typeof question !== "object") return question;
  const {
    correct: _correct,
    correctAnswer: _correctAnswer,
    ...rest
  } = question as Record<string, unknown>;
  return rest;
};
