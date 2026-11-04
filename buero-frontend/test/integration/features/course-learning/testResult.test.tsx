import { beforeAll, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestResult, {
  type TestMistake,
} from '@/features/course-learning/QuizPanel/TestResult';
import type { QuizPartResult, QuizQuestion } from '@/api/quizApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What a module test comes to.
 *
 * The mark is what the student came back for, but the part worth reading is underneath it:
 * which skill let them down, and which lesson to go over. A result that says only "48%"
 * tells a student they failed and nothing about what to do next.
 *
 * The rule that must not slip is the answer key: after a failed test it stays back, or a
 * retake is copying.
 */
beforeAll(async () => {
  await i18nReady;
});

const question = (id: string, block: string, prompt: string): QuizQuestion => ({
  id,
  type: 'fill_blank',
  prompt,
  points: 1,
  element_id: null,
  block: block as QuizQuestion['block'],
  order_index: 0,
});

const part = (title: string, earned: number, total: number): QuizPartResult => ({
  title,
  review_lesson: null,
  earned_points: earned,
  total_points: total,
  correct: earned,
  total,
  weak: earned * 2 < total,
});

const mistake = (over: Partial<TestMistake> = {}): TestMistake => ({
  question: question('g4', 'grammatik', 'Ich gebe ___ Frau das Buch.'),
  position: 4,
  given: 'die',
  accepted: ['der'],
  explanation: 'Dativ жіночого роду: die → der.',
  reviewLesson: '2.1',
  ...over,
});

const draw = (over: Partial<React.ComponentProps<typeof TestResult>> = {}) =>
  renderWithProviders(
    <TestResult
      percent={78}
      earnedPoints={21}
      totalPoints={27}
      passingScore={70}
      passed
      parts={[part('grammatik', 8, 10), part('lesen', 4, 5)]}
      mistakes={[mistake()]}
      onRetry={vi.fn()}
      {...over}
    />,
  );

describe('a test that was passed', () => {
  it('stamps the mark and says so', async () => {
    draw();

    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('Склав')).toBeInTheDocument();
    expect(screen.getByText('Модуль пройдено!')).toBeInTheDocument();
  });

  it('reports the points behind the percentage', async () => {
    draw();

    expect(screen.getByText('21 з 27 балів')).toBeInTheDocument();
  });

  it('breaks the mark down by skill', async () => {
    draw();

    /** Named twice over - once as a part, once on the mistake that came from it. */
    expect(screen.getAllByText('Grammatik').length).toBeGreaterThan(0);
    expect(screen.getByText('8/10')).toBeInTheDocument();
    expect(screen.getByText('4/5')).toBeInTheDocument();
  });

  it('offers the way on first, and a retake beside it', async () => {
    const onMoveOn = vi.fn();
    draw({ onMoveOn, moveOnLabel: 'До модуля 3 →' });

    expect(screen.getByRole('button', { name: 'До модуля 3 →' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ще раз/i })).toBeInTheDocument();
  });
});

describe('a test that fell short', () => {
  const failed = {
    percent: 48,
    passed: false as const,
    mistakes: [mistake({ accepted: [] })],
  };

  it('says how far off, without a verdict', async () => {
    draw(failed);

    expect(screen.getByText('Майже! Ще трохи до 70%')).toBeInTheDocument();
    expect(screen.queryByText('Склав')).not.toBeInTheDocument();
  });

  /**
   * The rule that must not slip, and it now covers more than the key.
   *
   * The explanation used to come through on a failure, on the reading that it teaches the
   * rule rather than giving the answer. The author's own explanations do not divide that
   * way - "Жіночий рід у Dativ — der" is the answer, printed under the question - so the
   * whole question-by-question account waits for the pass.
   */
  it('shows neither the answer key nor the explanations', async () => {
    const { container } = draw(failed);

    expect(container.querySelector('.line-through')).toBeNull();
    expect(screen.queryByText(/Dativ жіночого роду/)).not.toBeInTheDocument();
    expect(screen.queryByText('Повторити урок 2.1 →')).not.toBeInTheDocument();
  });

  /** And says why, so the gap does not read as a screen that failed to load. */
  it('says the review opens once the test is passed', async () => {
    draw(failed);

    expect(screen.getByText(/Розбір кожного питання відкриється/)).toBeInTheDocument();
  });

  /** What is left is the way back: which parts were weak. */
  it('still breaks the result down by part', async () => {
    draw(failed);

    expect(screen.getAllByText('Grammatik').length).toBeGreaterThan(0);
  });

  it('puts the retake first', async () => {
    draw({ ...failed, onMoveOn: vi.fn() });

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAccessibleName(/ще раз/i);
  });
});

describe('the mistakes', () => {
  const many = Array.from({ length: 5 }, (_, i) =>
    mistake({
      question: question(`g${i}`, 'grammatik', `Речення номер ${i}`),
      position: i + 1,
    }),
  );

  /** A wall of five is not a place to start; two are. */
  it('shows two at first and folds the rest away', async () => {
    draw({ mistakes: many });

    expect(screen.getByText('Речення номер 0')).toBeInTheDocument();
    expect(screen.queryByText('Речення номер 4')).not.toBeInTheDocument();
    expect(screen.getByText('Показати всі помилки (5)')).toBeInTheDocument();
  });

  it('opens the rest when asked', async () => {
    draw({ mistakes: many });
    const user = userEvent.setup();

    await user.click(screen.getByText('Показати всі помилки (5)'));

    expect(screen.getByText('Речення номер 4')).toBeInTheDocument();
  });

  /** After a failure none of it is shown at all, which is the point of the gate. */
  it('shows none of them when the test was not passed', async () => {
    draw({ mistakes: many, passed: false, percent: 40 });

    expect(screen.queryByText('Речення номер 4')).not.toBeInTheDocument();
    expect(screen.queryByText(/Показати всі помилки/)).not.toBeInTheDocument();
    expect(screen.queryByText('Над чим попрацювати')).not.toBeInTheDocument();
  });

  it('numbers a mistake the way the student met it', async () => {
    draw();

    expect(screen.getByText('Питання 4')).toBeInTheDocument();
    expect(screen.getAllByText('Grammatik').length).toBeGreaterThan(0);
  });

  it('says nothing about mistakes when there were none', async () => {
    draw({ mistakes: [] });

    expect(screen.queryByText('Над чим попрацювати')).not.toBeInTheDocument();
  });
});

/**
 * The run-up to this result.
 *
 * A student who is on their third go wants to know whether the work is paying off, and
 * three percentages answer that: 40, then 55, then the number above. Only the percentage
 * is kept - the answers of an old sitting belong to that sitting, and the result that
 * counts is always the best one.
 */
describe('earlier attempts', () => {
  const attempt = (score: number, day: number) => ({
    score,
    completed_at: `2026-11-0${day}T10:00:00.000Z`,
  });

  it('lists the ones before this, newest first', async () => {
    draw({ recentAttempts: [attempt(72, 4), attempt(55, 3), attempt(40, 2)] });

    expect(screen.getByText('Попередні спроби')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  /** The first row is the attempt on screen; repeating it would read as two goes. */
  it('does not repeat the attempt being shown', async () => {
    draw({ recentAttempts: [attempt(72, 4), attempt(55, 3)] });

    expect(screen.queryByText('72%')).not.toBeInTheDocument();
  });

  it('says nothing at all on a first attempt', async () => {
    draw({ recentAttempts: [attempt(72, 4)] });

    expect(screen.queryByText('Попередні спроби')).not.toBeInTheDocument();
  });

  it('says nothing when the server sent no history', async () => {
    draw();

    expect(screen.queryByText('Попередні спроби')).not.toBeInTheDocument();
  });

  /** Shown after a failure too: that is exactly when a direction is worth seeing. */
  it('is shown even when the test was not passed', async () => {
    draw({ passed: false, percent: 55, recentAttempts: [attempt(55, 4), attempt(40, 3)] });

    expect(screen.getByText('Попередні спроби')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
