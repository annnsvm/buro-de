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

    /**
     * The words have to be able to form one of the accepted sentences. Otherwise the
     * exercise cannot be completed however the student arranges them — which is the
     * kind of mistake that is invisible until a learner is stuck on it.
     */
    if (tokens.length > 0 && acceptedAnswers.length > 0) {
      const bag = (value: string) =>
        value
          .toLowerCase()
          .replace(/[.,!?;]/g, ' ')
          .split(/\s+/)
          .filter(Boolean)
          .sort()
          .join(' ');
      const fromTokens = bag(tokens.join(' '));
      const reachable = acceptedAnswers.some(
        (answer) => bag(answer) === fromTokens,
      );
      if (!reachable) {
        problems.push(
          'the words given cannot be arranged into any of the accepted answers',
        );
      }
    }

    return problems;
  },

  grade: (question: GradableQuestion, answer: RawAnswer) => {
    // The browser may send the arranged tokens as a list or as a finished sentence.
    const given = asStringArray(answer).join(' ');
    const match = matchGermanAnswer(given, question.acceptedAnswers);
    /**
     * Capitalisation is not the student's to get wrong here: they only rearrange the
     * words they were handed, so if those start lower case the sentence does too.
     * Telling them to mind the capital letter would be a complaint about the author.
     */
    const quality = match.quality === 'case' ? 'exact' : match.quality;
    return { correct: match.correct, quality };
  },

  describeAcceptedAnswers: (question) => question.acceptedAnswers,
};
