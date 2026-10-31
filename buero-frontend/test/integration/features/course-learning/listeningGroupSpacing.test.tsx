import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

const fetchQuizQuestions = vi.fn();
const fetchLastQuizAttempt = vi.fn();

vi.mock('@/api/quizApi', () => ({
  fetchQuizQuestions: (...args: unknown[]) => fetchQuizQuestions(...args),
  fetchLastQuizAttempt: (...args: unknown[]) => fetchLastQuizAttempt(...args),
  startQuizAttempt: vi.fn(),
  answerQuizQuestion: vi.fn(),
  submitQuizAttempt: vi.fn(),
  isOutdatedAttempt: () => false,
}));

const { default: QuizPanel } = await import(
  '@/features/course-learning/QuizPanel/QuizPanel'
);

/**
 * Where one recording's questions end and the next recording begins.
 *
 * Each group was rendered as a bare sibling, and a recording carries only a bottom margin - so
 * the second player sat flush against the last question of the first one, with nothing on
 * screen to say the questions above it were about a different recording. In a block of sixteen
 * recordings that is not a cosmetic problem: it is the student answering about the wrong audio.
 */
beforeAll(async () => {
  await i18nReady;
});

const audio = (id: string, title: string) => ({
  id,
  kind: 'audio' as const,
  title,
  body: null,
  audio_url: `https://cdn/${id}.mp3`,
  has_transcript: false,
  transcript: null,
});

const question = (id: string, elementId: string) => ({
  id,
  type: 'single_choice' as const,
  prompt: `Питання ${id}`,
  points: 1,
  element_id: elementId,
  order_index: 0,
  options: [
    { id: 'a', text: 'Перший' },
    { id: 'b', text: 'Другий' },
  ],
});

describe('two recordings in one listening block', () => {
  beforeEach(() => {
    fetchLastQuizAttempt.mockResolvedValue(null);
    fetchQuizQuestions.mockResolvedValue({
      mode: 'practice',
      passing_score: null,
      total_points: null,
      passing_points: null,
      elements: [audio('a1', 'Розмова в офісі'), audio('a2', 'Ранок у понеділок')],
      questions: [
        question('q1', 'a1'),
        question('q2', 'a1'),
        question('q3', 'a2'),
      ],
    });
  });

  const draw = () =>
    renderWithProviders(
      <QuizPanel courseMaterialId="practice-1" block="horen" quizMaterialTitle="Hören" />,
    );

  it('shows each recording as its own group', async () => {
    draw();
    await screen.findByText('Розмова в офісі');

    const groups = document.querySelectorAll('[data-group]');
    expect(groups).toHaveLength(2);
    expect([...groups].map((group) => group.getAttribute('data-group'))).toEqual([
      'a1',
      'a2',
    ]);
  });

  /**
   * The fix itself: the groups share one container that spaces them apart. Rendered as bare
   * siblings there is nothing between them at all, and no stylesheet in this environment to
   * reveal it - so the guard is the structure rather than the computed pixels.
   */
  it('puts the groups in one container that spaces them apart', async () => {
    draw();
    await screen.findByText('Розмова в офісі');

    const groups = [...document.querySelectorAll('[data-group]')];
    const parent = groups[0].parentElement;
    expect(groups[1].parentElement).toBe(parent);
    expect(parent?.className).toMatch(/\bspace-y-\d+\b/);
  });

  /** And the gap between recordings is larger than the gap between questions within one. */
  it('separates recordings more than it separates questions', async () => {
    draw();
    await screen.findByText('Розмова в офісі');

    const betweenGroups = Number(
      /\bspace-y-(\d+)\b/.exec(
        document.querySelector('[data-group]')?.parentElement?.className ?? '',
      )?.[1],
    );
    const betweenQuestions = Number(
      /\bspace-y-(\d+)\b/.exec(
        document.querySelector('[data-group] ol')?.className ?? '',
      )?.[1],
    );

    expect(betweenGroups).toBeGreaterThan(betweenQuestions);
  });

  /** Grammatik has no recordings, so every question is its own group and nothing changes. */
  it('leaves a block with no recordings as a single group', async () => {
    fetchQuizQuestions.mockResolvedValue({
      mode: 'practice',
      passing_score: null,
      total_points: null,
      passing_points: null,
      elements: [],
      questions: [
        { ...question('g1', ''), element_id: null },
        { ...question('g2', ''), element_id: null },
      ],
    });
    draw();
    await screen.findByText(/Питання 1 з 2/);

    /**
     * One group, not two: questions that are about nothing are a single run, exactly as
     * Grammatik has always rendered them. The container is still there and still harmless -
     * with one child there is nothing for it to space apart.
     */
    const groups = document.querySelectorAll('[data-group]');
    expect(groups).toHaveLength(1);
    expect(groups[0].getAttribute('data-group')).toBe('plain');
    expect(groups[0].querySelectorAll('ol > li')).toHaveLength(2);
  });
});
