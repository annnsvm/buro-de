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
   * The rule that must not slip. The server withholds the key after a failure, and the
   * screen must not invent one from the student's own wrong answer.
   */
  it('shows no answer key', async () => {
    const { container } = draw(failed);

    /**
     * The struck-out answer and the one beside it are drawn only when the server released
     * the key, so their absence is the whole assertion. Searching for the word itself
     * would find it inside the author's own explanation.
     */
    expect(container.querySelector('.line-through')).toBeNull();
    /** The explanation and the lesson still come through: that is the way back. */
    expect(screen.getByText(/Dativ жіночого роду/)).toBeInTheDocument();
    expect(screen.getByText('Повторити урок 2.1 →')).toBeInTheDocument();
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

  /** After a failure the whole list is the way back, so none of it is hidden. */
  it('shows them all when the test was not passed', async () => {
    draw({ mistakes: many, passed: false, percent: 40 });

    expect(screen.getByText('Речення номер 4')).toBeInTheDocument();
    expect(screen.queryByText(/Показати всі помилки/)).not.toBeInTheDocument();
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
