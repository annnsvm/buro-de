import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/** Mirrors the QuestionType enum on the server. */
export type QuizQuestionType =
  | 'single_choice'
  | 'multi_choice'
  | 'fill_blank'
  | 'text_input'
  | 'ordering';

export type QuizQuestionOption = { id: string; text: string };

/**
 * `practice` marks each answer as it is given; `test` checks everything at once and
 * keeps the answer key back unless the student passed.
 */
export type QuizMode = 'practice' | 'test';

/**
 * A question as a student may see it. The answer key never leaves the server, and the
 * explanation arrives with the submit response once the question has been answered.
 */
export type QuizQuestion = {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  points: number;
  order_index: number;
  options?: QuizQuestionOption[];
  /** Words to arrange, already shuffled by the server. */
  tokens?: string[];
};

export type QuizQuestionsResponse = {
  mode: QuizMode;
  passing_score: number | null;
  questions: QuizQuestion[];
};

export const fetchQuizQuestions = async (
  materialId: string,
): Promise<QuizQuestionsResponse> => {
  const { data } = await apiInstance.get<QuizQuestionsResponse>(
    API_ENDPOINTS.quiz.questions(materialId),
  );
  return data;
};

export type QuizAttemptResponse = {
  id: string;
  course_material_id: string;
  status: 'in_progress' | 'completed';
  answers_snapshot: Record<string, unknown> | null;
  score: number | null;
  completed_at: string | null;
  created_at: string;
};

export const startQuizAttempt = async (courseMaterialId: string): Promise<QuizAttemptResponse> => {
  const { data } = await apiInstance.post<QuizAttemptResponse>(API_ENDPOINTS.quiz.startAttempt, {
    course_material_id: courseMaterialId,
  });
  return data;
};

export type SubmitQuizAnswerItem = { question_id: string; answer: string | string[] };

/** Why an answer counted, so near misses can be explained rather than just marked. */
export type AnswerQuality = 'exact' | 'punctuation' | 'case' | 'none';

export type QuizQuestionResult = {
  question_id: string;
  correct: boolean;
  quality: AnswerQuality;
  explanation: string | null;
};

/** What comes back the moment a single answer is given. */
export type AnswerQuestionResponse = {
  question_id: string;
  correct: boolean;
  quality: AnswerQuality;
  explanation: string | null;
  /** The wording(s) that would have been right, for the question just answered. */
  accepted_answers: string[];
  answered: number;
  total: number;
  /** Present once every question has been answered and the attempt closed itself. */
  summary: {
    score: number;
    /** Highest score across all attempts, which is what counts as the result. */
    best_score: number;
    total: number;
    correct: number;
  } | null;
};

export const answerQuizQuestion = async (
  attemptId: string,
  body: SubmitQuizAnswerItem,
): Promise<AnswerQuestionResponse> => {
  const { data } = await apiInstance.post<AnswerQuestionResponse>(
    API_ENDPOINTS.quiz.answer(attemptId),
    body,
  );
  return data;
};

/** A finished attempt, replayed so a student can revisit what they answered. */
export type LastQuizAttempt = {
  attempt_id: string;
  completed_at: string | null;
  score: number;
  total: number;
  correct: number;
  attempts: number;
  mode: QuizMode;
  passing_score: number | null;
  passed: boolean | null;
  reveal_answers: boolean;
  answers: Array<{
    question_id: string;
    correct: boolean;
    quality: AnswerQuality;
    explanation: string | null;
    accepted_answers: string[];
    raw_answer: string | string[];
  }>;
};

/** Returned instead of an attempt when the quiz changed since the student took it. */
export type OutdatedQuizAttempt = { outdated: true };

export const fetchLastQuizAttempt = async (
  materialId: string,
): Promise<LastQuizAttempt | OutdatedQuizAttempt | null> => {
  const { data } = await apiInstance.get<
    LastQuizAttempt | OutdatedQuizAttempt | null
  >(API_ENDPOINTS.quiz.lastAttempt(materialId));
  return data ?? null;
};

export const isOutdatedAttempt = (
  value: LastQuizAttempt | OutdatedQuizAttempt | null,
): value is OutdatedQuizAttempt =>
  value !== null && 'outdated' in value && value.outdated === true;

export type SubmitQuizResponse = {
  score: number;
  best_score: number;
  total: number;
  correct: number;
  mode: QuizMode;
  passing_score: number | null;
  passed: boolean | null;
  /** False after a failed test: the answer key stays back so a retake is not copying. */
  reveal_answers: boolean;
  results: Array<QuizQuestionResult & { accepted_answers: string[] }>;
  attempt: QuizAttemptResponse;
};

export const submitQuizAttempt = async (
  attemptId: string,
  body: { answers: SubmitQuizAnswerItem[] },
): Promise<SubmitQuizResponse> => {
  const { data } = await apiInstance.post<SubmitQuizResponse>(
    API_ENDPOINTS.quiz.submit(attemptId),
    body,
  );
  return data;
};
