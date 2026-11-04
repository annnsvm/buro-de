import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type {
  AnswerQuestionResponse,
  PracticeElement,
  QuizQuestion,
  QuizQuestionsResponse,
} from '@/api/quizApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The transcript of a recording, and when the student actually gets to read it.
 *
 * It opens once every question about that recording has been answered - the server decides
 * that, because it counts answers from every sitting. The failure this covers was not in the
 * rule but in the asking: a marked answer went into local state and nothing ever fetched the
 * elements again, so the student answered the last question, watched the lock stay shut, and
 * only found the transcript by leaving the lesson and coming back.
 */
vi.mock('@/api/quizApi', async () => {
  const actual = await vi.importActual<typeof import('@/api/quizApi')>('@/api/quizApi');
  return {
    ...actual,
    fetchQuizQuestions: vi.fn(),
    fetchLastQuizAttempt: vi.fn(),
    startQuizAttempt: vi.fn(),
    answerQuizQuestion: vi.fn(),
    saveQuizDraft: vi.fn(),
    submitQuizAttempt: vi.fn(),
  };
});

const api = await import('@/api/quizApi');
const QuizPanel = (await import('@/features/course-learning/QuizPanel/QuizPanel')).default;

beforeAll(async () => {
  await i18nReady;
});

const TRANSCRIPT = 'Guten Tag, hier ist Markus.';

const recording = (transcript: string | null): PracticeElement => ({
  id: 'ha1',
  kind: 'audio',
  title: 'Коротка промова',
  body: null,
  audio_url: 'https://res.cloudinary.com/x/one.mp3',
  awaiting_audio: false,
  has_transcript: true,
  transcript,
});

const question = (id: string): QuizQuestion => ({
  id,
  type: 'single_choice',
  prompt: `Питання ${id}`,
  points: 1,
  element_id: 'ha1',
  order_index: Number(id.slice(1)),
  options: [
    { id: 'a', text: 'Правильно' },
    { id: 'b', text: 'Ні' },
  ],
});

const payload = (transcript: string | null, questions: QuizQuestion[]): QuizQuestionsResponse => ({
  mode: 'practice',
  passing_score: null,
  total_points: null,
  passing_points: null,
  elements: [recording(transcript)],
  questions,
});

const marked = (id: string, answered: number, total: number): AnswerQuestionResponse => ({
  question_id: id,
  correct: true,
  quality: 'exact',
  explanation: null,
  accepted_answers: ['Правильно'],
  answered,
  total,
  /** A practice quiz only reports a summary once the last answer closes the sitting. */
  summary: answered === total ? { score: 100, best_score: 100, correct: total, total } : null,
});

beforeEach(() => {
  /** Each case counts requests, so a previous case's calls must not be in the tally. */
  vi.clearAllMocks();
  vi.mocked(api.fetchLastQuizAttempt).mockResolvedValue(null);
  vi.mocked(api.startQuizAttempt).mockResolvedValue({
    id: 'att-1',
    course_material_id: 'm1',
    status: 'in_progress',
    answers_snapshot: null,
    score: null,
    completed_at: null,
    created_at: '2026-11-04T00:00:00.000Z',
  });
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
});

const draw = () =>
  renderWithProviders(
    <QuizPanel
      courseMaterialId="m1"
      courseId="c1"
      moduleId="mod1"
      quizMaterialTitle="Практика"
      block="horen"
    />,
  );

describe('the transcript of a recording', () => {
  it('opens as soon as the last question about it is answered, without leaving the lesson', async () => {
    const only = [question('q1')];
    vi.mocked(api.fetchQuizQuestions)
      /** The block as it opens: the transcript is owed but not yet earned. */
      .mockResolvedValueOnce(payload(null, only))
      /** What the server says once the answer is in. */
      .mockResolvedValueOnce(payload(TRANSCRIPT, only));
    vi.mocked(api.answerQuizQuestion).mockResolvedValue(marked('q1', 1, 1));

    draw();

    expect(await screen.findByText(/Текст запису відкриється/)).toBeInTheDocument();

    await userEvent.click(await screen.findByRole('radio', { name: 'Правильно' }));

    /**
     * The last answer of a practice closes the sitting, so the result comes up over the
     * block. The transcript is behind it, which is right - but it means the test has to
     * step past the dialog the way a student does.
     */
    await userEvent.click(await screen.findByRole('button', { name: 'Переглянути відповіді' }));

    const open = await screen.findByRole('button', { name: 'Показати текст запису' });
    expect(screen.queryByText(/Текст запису відкриється/)).not.toBeInTheDocument();

    await userEvent.click(open);
    expect(await screen.findByText(TRANSCRIPT)).toBeInTheDocument();
  });

  /**
   * The server is the one that knows, so the client does not guess. It asks again after an
   * answer and believes what comes back - which means a recording with questions still
   * outstanding stays shut, with no second copy of the rule to disagree about it.
   */
  it('stays shut while another question about the same recording is unanswered', async () => {
    const both = [question('q1'), question('q2')];
    vi.mocked(api.fetchQuizQuestions)
      .mockResolvedValueOnce(payload(null, both))
      .mockResolvedValueOnce(payload(null, both));
    vi.mocked(api.answerQuizQuestion).mockResolvedValue(marked('q1', 1, 2));

    draw();

    const first = (await screen.findAllByRole('radio', { name: 'Правильно' }))[0];
    await userEvent.click(first);

    await waitFor(() => expect(api.fetchQuizQuestions).toHaveBeenCalledTimes(2));
    expect(
      screen.queryByRole('button', { name: 'Показати текст запису' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Текст запису відкриється/)).toBeInTheDocument();
  });

  /**
   * Grammatik has no elements at all, and a recording that has already given up its
   * transcript has nothing left to fetch. Neither should cost a request per answer.
   */
  it('does not ask again when there is no transcript owed', async () => {
    const only = [{ ...question('q1'), element_id: null }];
    vi.mocked(api.fetchQuizQuestions).mockResolvedValue({
      ...payload(null, only),
      elements: [],
    });
    vi.mocked(api.answerQuizQuestion).mockResolvedValue(marked('q1', 1, 1));

    draw();

    await userEvent.click(await screen.findByRole('radio', { name: 'Правильно' }));

    await waitFor(() => expect(api.answerQuizQuestion).toHaveBeenCalled());
    expect(api.fetchQuizQuestions).toHaveBeenCalledTimes(1);
  });
});
