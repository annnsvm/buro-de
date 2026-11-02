import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * A module test, closed halfway and opened again.
 *
 * A test is answered as a whole - nothing is marked until it is submitted - which is what
 * made it so easy to lose: until finish was pressed, not one answer had reached the server.
 * Twenty answers and a closed tab, and the student starts again. They are kept as a draft
 * instead: not marked, not counted, and put back where they were.
 */
const fetchQuizQuestions = vi.fn();
const fetchLastQuizAttempt = vi.fn();
const startQuizAttempt = vi.fn();
const saveQuizDraft = vi.fn();

vi.mock('@/api/quizApi', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  fetchQuizQuestions: (...a: unknown[]) => fetchQuizQuestions(...a),
  fetchLastQuizAttempt: (...a: unknown[]) => fetchLastQuizAttempt(...a),
  startQuizAttempt: (...a: unknown[]) => startQuizAttempt(...a),
  saveQuizDraft: (...a: unknown[]) => saveQuizDraft(...a),
}));

const { default: QuizPanel } = await import(
  '@/features/course-learning/QuizPanel/QuizPanel'
);

beforeAll(async () => {
  await i18nReady;
});

const QUESTIONS = [
  {
    id: 'q1',
    type: 'single_choice' as const,
    prompt: 'На яке питання відповідає Dativ?',
    points: 1,
    element_id: null,
    order_index: 0,
    options: [
      { id: 'a', text: 'Wer?' },
      { id: 'b', text: 'Wem?' },
    ],
  },
];

const draw = () =>
  renderWithProviders(
    <QuizPanel
      courseMaterialId="test-1"
      courseId="course-1"
      moduleId="module-1"
      quizMaterialTitle="Тест модуля"
    />,
  );

beforeEach(() => {
  vi.useRealTimers();
  fetchQuizQuestions.mockReset();
  fetchLastQuizAttempt.mockReset();
  startQuizAttempt.mockReset();
  saveQuizDraft.mockReset();

  fetchQuizQuestions.mockResolvedValue({
    mode: 'test',
    passing_score: 70,
    total_points: 1,
    passing_points: 1,
    elements: [],
    questions: QUESTIONS,
  });
  fetchLastQuizAttempt.mockResolvedValue(null);
  startQuizAttempt.mockResolvedValue({ id: 'attempt-1' });
  saveQuizDraft.mockResolvedValue(undefined);
});

describe('answering a test', () => {
  it('keeps what was typed, without marking it', async () => {
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByText('Wem?'));

    await waitFor(
      () =>
        expect(saveQuizDraft).toHaveBeenCalledWith('attempt-1', {
          answers: [{ question_id: 'q1', answer: 'b' }],
        }),
      { timeout: 3000 },
    );
  });

  /**
   * A sitting should not exist because somebody opened the page. The row is created by the
   * first answer, not by the first render.
   */
  it('starts no sitting until something is answered', async () => {
    draw();

    await screen.findByText('Wem?');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    expect(startQuizAttempt).not.toHaveBeenCalled();
    expect(saveQuizDraft).not.toHaveBeenCalled();
  });

  /** The answer stays on screen; the student is never told the test marked them. */
  it('shows no verdict while the test is being answered', async () => {
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByText('Wem?'));

    expect(screen.queryByText(/Правильно|Неправильно/)).not.toBeInTheDocument();
  });
});

describe('coming back to a test left half done', () => {
  it('puts the answers back where they were', async () => {
    fetchLastQuizAttempt.mockResolvedValue({
      attempt_id: 'attempt-1',
      completed_at: null,
      draft_answers: [{ question_id: 'q1', answer: 'b' }],
      answers: [],
      score: 0,
      total: 1,
      correct: 0,
      earned_points: 0,
      total_points: 1,
      attempts: 0,
      mode: 'test',
      passing_score: 70,
      passing_points: 1,
      passed: false,
      reveal_answers: false,
      parts: [],
    });

    draw();

    const chosen = await screen.findByRole('radio', { name: /Wem/ });
    await waitFor(() => expect(chosen).toBeChecked());
  });

  /** And says nothing about a score, because the sitting was never finished. */
  it('reports no result for a sitting still in progress', async () => {
    fetchLastQuizAttempt.mockResolvedValue({
      attempt_id: 'attempt-1',
      completed_at: null,
      draft_answers: [{ question_id: 'q1', answer: 'b' }],
      answers: [],
      score: 0,
      total: 1,
      correct: 0,
      earned_points: 0,
      total_points: 1,
      attempts: 0,
      mode: 'test',
      passing_score: 70,
      passing_points: 1,
      passed: false,
      reveal_answers: false,
      parts: [],
    });

    draw();

    await screen.findByText('Wem?');
    expect(screen.queryByText(/0%/)).not.toBeInTheDocument();
  });

  /** An older server sends no drafts at all; the page must still open. */
  it('opens against a server that knows nothing about drafts', async () => {
    fetchLastQuizAttempt.mockResolvedValue({
      attempt_id: 'attempt-1',
      completed_at: null,
      answers: [],
      score: 0,
      total: 1,
      correct: 0,
      earned_points: 0,
      total_points: 1,
      attempts: 0,
      mode: 'test',
      passing_score: 70,
      passing_points: 1,
      passed: false,
      reveal_answers: false,
      parts: [],
    });

    draw();

    expect(await screen.findByText('Wem?')).toBeInTheDocument();
  });
});
