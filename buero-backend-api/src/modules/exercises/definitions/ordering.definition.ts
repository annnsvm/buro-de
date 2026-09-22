import { QuestionType } from '../../../generated/prisma/enums';
import {
  asStringArray,
  type ExerciseDefinition,
  type GradableQuestion,
  type RawAnswer,
} from '../exercise.types';
import { matchGermanAnswer } from '../normalize-german';

type OrderingPayload = { tokens?: unknown };

const readTokens = (payload: unknown): string[] => {
  const tokens = (payload as OrderingPayload | null)?.tokens;
  if (!Array.isArray(tokens)) return [];
  return tokens.filter((token): token is string => typeof token === 'string');
};

/**
 * Word order is one of the hardest parts of German, and a sentence usually has more
 * than one correct arrangement — "Heute lerne ich Deutsch" and "Ich lerne heute
 * Deutsch" are both right. Each accepted order is therefore stored as its own sentence
 * and compared through the German matcher, which also absorbs spacing and the final
 * full stop.
 */
export const orderingDefinition: ExerciseDefinition = {
  type: QuestionType.ordering,
  validatePayload: (payload, acceptedAnswers) => {
    const problems: string[] = [];
    const tokens = readTokens(payload);
    if (tokens.length < 2) {
      problems.push('an ordering question needs at least two tokens to arrange');
    }
    if (!acceptedAnswers.some((answer) => answer.trim().length > 0)) {
      problems.push('an ordering question needs at least one accepted order');
    }
    return problems;
  },

  grade: (question: GradableQuestion, answer: RawAnswer) => {
    // The browser may send the arranged tokens as a list or as a finished sentence.
    const given = asStringArray(answer).join(' ');
    const match = matchGermanAnswer(given, question.acceptedAnswers);
    return { correct: match.correct, quality: match.quality };
  },
};
