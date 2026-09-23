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

/**
 * Points are a test's scale, not a quiz's. A practice quiz is scored on how many
 * questions went right, so the server sends null here and nothing shows a total the
 * author never wrote.
 */
export type QuizQuestionsResponse = {
  mode: QuizMode;
  /** The percentage needed to pass. */
  passing_score: number | null;
  /** What the whole test is worth, e.g. 25. Null for a practice quiz. */
  total_points: number | null;
  /** The same threshold in points, e.g. 15 — the way the test is written. */
  passing_points: number | null;
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
  /** Points scored and available; both null on a practice quiz. */
  earned_points: number | null;
  total_points: number | null;
  attempts: number;
  mode: QuizMode;
  passing_score: number | null;
  passing_points: number | null;
  passed: boolean | null;
  reveal_answers: boolean;
  parts: QuizPartResult[];
  answers: Array<{
    question_id: string;
    correct: boolean;
    quality: AnswerQuality;
    explanation: string | null;
    accepted_answers: string[];
    raw_answer: string | string[];
  }>;
};

/**
 * One section of a test, as the author divided it up.
 *
 * A percentage says a student failed; this says what to do about it. Empty for a
 * practice quiz, and for a test whose questions were imported before parts were kept.
 */
export type QuizPartResult = {
  title: string;
  /** Which lesson to go back over; null until the author fills in that column. */
  review_lesson: string | null;
  earned_points: number;
  total_points: number;
  correct: number;
  total: number;
  /** True when more than half the part's points were lost — the author's own rule. */
  weak: boolean;
};

/** Returned instead of an attempt when the quiz changed since the student took it. */
export type OutdatedQuizAttempt = { outdated: true };

/**
 * A student who has never taken this quiz has no attempt, and the server says so by
 * returning nothing at all. An empty HTTP body does not arrive as `null` — axios hands
 * over an empty string — so "no attempt yet" has to be recognised by shape rather than
 * trusted to be nullish. Missing that turned the very first visit to a newly added quiz
 * into an error message instead of a blank quiz.
 */
export const fetchLastQuizAttempt = async (
  materialId: string,
): Promise<LastQuizAttempt | OutdatedQuizAttempt | null> => {
  const { data } = await apiInstance.get<
    LastQuizAttempt | OutdatedQuizAttempt | null | ''
  >(API_ENDPOINTS.quiz.lastAttempt(materialId));
  return data && typeof data === 'object' ? data : null;
};

export const isOutdatedAttempt = (
  value: LastQuizAttempt | OutdatedQuizAttempt | null,
): value is OutdatedQuizAttempt =>
  typeof value === 'object' &&
  value !== null &&
  'outdated' in value &&
  value.outdated === true;

export type SubmitQuizResponse = {
  score: number;
  best_score: number;
  total: number;
  correct: number;
  /** Points scored and available; both null on a practice quiz. */
  earned_points: number | null;
  total_points: number | null;
  mode: QuizMode;
  passing_score: number | null;
  passing_points: number | null;
  passed: boolean | null;
  /** False after a failed test: the answer key stays back so a retake is not copying. */
  reveal_answers: boolean;
  parts: QuizPartResult[];
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
