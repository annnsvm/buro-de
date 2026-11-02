import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';

import type { PracticeBlockSummary, PracticeOverview } from '@/api/practiceApi';
import { i18nReady } from '@/i18n';
import React from 'react';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * Which block is open is a place, not a piece of component state.
 *
 * Held in `useState` it added nothing to the browser's history, so the back button - which a
 * student presses to mean "out of this block" - took them out of the lesson entirely. In the
 * address bar it is a step the browser can undo, and a block can be linked to directly.
 */
const fetchPracticeOverview = vi.fn();
const fetchQuizQuestions = vi.fn();
const fetchLastQuizAttempt = vi.fn();

vi.mock('@/api/practiceApi', () => ({
  fetchPracticeOverview: (...a: unknown[]) => fetchPracticeOverview(...a),
}));

vi.mock('@/api/quizApi', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  fetchQuizQuestions: (...a: unknown[]) => fetchQuizQuestions(...a),
  fetchLastQuizAttempt: (...a: unknown[]) => fetchLastQuizAttempt(...a),
}));

const { default: PracticePanel } = await import(
  '@/features/course-learning/PracticePanel/PracticePanel'
);

beforeAll(async () => {
  await i18nReady;
});

const block = (
  name: PracticeBlockSummary['block'],
  done = false,
): PracticeBlockSummary => ({
  block: name,
  total: 4,
  answered: 0,
  correct: 0,
  done,
  optional: name === 'sprechen' || name === 'schreiben',
  awaiting_audio: 0,
  ready: true,
  task_count: 0,
  points: null,
});

const overview = (blocks: PracticeBlockSummary[]): PracticeOverview => ({
  material_id: 'practice-1',
  title: 'Praktische Übungen',
  module_title: 'Modul 2',
  lesson_title: '2.1',
  blocks,
  done_count: blocks.filter((e) => !e.optional && e.ready && e.done).length,
  total_count: blocks.filter((e) => !e.optional && e.ready).length,
});

/** Reads the address the router is actually on, which is what the test is about. */
const Address: React.FC = () => {
  const location = useLocation();
  return <span data-testid="address">{location.search}</span>;
};

const draw = (at = '/course/1') =>
  renderWithProviders(
    <>
      <PracticePanel
        courseMaterialId="practice-1"
        courseId="course-1"
        moduleId="module-1"
        nextStepLabel="Наступний урок"
      />
      <Address />
    </>,
    { initialEntries: [at] },
  );

beforeEach(() => {
  fetchPracticeOverview.mockReset();
  fetchQuizQuestions.mockReset();
  fetchLastQuizAttempt.mockReset();
  fetchPracticeOverview.mockResolvedValue(
    overview([block('grammatik'), block('lesen')]),
  );
  fetchQuizQuestions.mockResolvedValue({
    mode: 'practice',
    passing_score: null,
    total_points: null,
    passing_points: null,
    elements: [],
    questions: [],
  });
  fetchLastQuizAttempt.mockResolvedValue(null);
});

describe('opening a block', () => {
  it('writes it into the address bar', async () => {
    draw();
    const user = userEvent.setup();

    await user.click((await screen.findAllByRole('button', { name: /Почати/ }))[0]);

    await waitFor(() =>
      expect(screen.getByTestId('address')).toHaveTextContent('block=grammatik'),
    );
  });

  /** And takes it out again on the way back, so the hub is a place of its own. */
  it('takes it out of the address bar on the way back', async () => {
    draw('/course/1?block=lesen');
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: '← До практики' }));

    await waitFor(() =>
      expect(screen.getByTestId('address')).not.toHaveTextContent('block='),
    );
  });

  /** A link straight to a block opens it, without passing through the hub. */
  it('opens the block a link names', async () => {
    draw('/course/1?block=lesen');

    expect(await screen.findByRole('heading', { name: 'Lesen' })).toBeInTheDocument();
  });

  /** Anything else in the address bar is somebody editing the URL; the hub is the answer. */
  it('shows the hub for a block that does not exist', async () => {
    draw('/course/1?block=klingonisch');

    expect(await screen.findByText('Обовʼязкові')).toBeInTheDocument();
  });
});

describe('the way back out of a block', () => {
  /** One of them. The panel used to draw its own above the block's header. */
  it('is offered once, in the block’s own header', async () => {
    draw('/course/1?block=lesen');

    const back = await screen.findAllByRole('button', { name: '← До практики' });
    expect(back).toHaveLength(1);
  });

  it('returns to the list of blocks', async () => {
    draw('/course/1?block=lesen');
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: '← До практики' }));

    expect(await screen.findByText('Обовʼязкові')).toBeInTheDocument();
  });
});
