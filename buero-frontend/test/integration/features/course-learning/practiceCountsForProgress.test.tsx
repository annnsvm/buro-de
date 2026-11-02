import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import type { PracticeBlockSummary, PracticeOverview } from '@/api/practiceApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What finishing the required blocks is for.
 *
 * It counts towards the course's own progress - it is not permission to read the next lesson.
 * The screen used to say the opposite by accident: the button to the next lesson was dead
 * until every required block was done, so the practice looked like a gate. Meanwhile nothing
 * recorded the practice as finished at all, and the percentage it was supposed to feed never
 * moved.
 */
const fetchPracticeOverview = vi.fn();

vi.mock('@/api/practiceApi', () => ({
  fetchPracticeOverview: (...args: unknown[]) => fetchPracticeOverview(...args),
}));

beforeAll(async () => {
  await i18nReady;
});

const block = (
  name: PracticeBlockSummary['block'],
  done: boolean,
  optional = false,
): PracticeBlockSummary => ({
  block: name,
  total: 4,
  answered: done ? 4 : 0,
  correct: done ? 4 : 0,
  done,
  optional,
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

const draw = async (blocks: PracticeBlockSummary[], onAllRequiredDone?: () => void) => {
  fetchPracticeOverview.mockResolvedValue(overview(blocks));
  const { default: PracticePanel } = await import(
    '@/features/course-learning/PracticePanel/PracticePanel'
  );
  return renderWithProviders(
    <PracticePanel
      courseMaterialId="practice-1"
      courseId="course-1"
      moduleId="module-1"
      onMoveOn={() => {}}
      nextStepLabel="Наступний урок"
      onAllRequiredDone={onAllRequiredDone}
    />,
  );
};

beforeEach(() => {
  fetchPracticeOverview.mockReset();
});

describe('counting a finished practice towards the course', () => {
  it('reports it once every required block is done', async () => {
    const done = vi.fn();
    await draw([block('grammatik', true), block('lesen', true)], done);

    await waitFor(() => expect(done).toHaveBeenCalledTimes(1));
  });

  it('says nothing while a required block is outstanding', async () => {
    const done = vi.fn();
    await draw([block('grammatik', true), block('lesen', false)], done);

    await screen.findByText('Обовʼязкові');
    expect(done).not.toHaveBeenCalled();
  });

  /** An optional block left undone does not hold the lesson back. */
  it('ignores the blocks that do not count', async () => {
    const done = vi.fn();
    await draw(
      [block('grammatik', true), block('sprechen', false, true)],
      done,
    );

    await waitFor(() => expect(done).toHaveBeenCalledTimes(1));
  });

  /** A practice with nothing required in it was never finished; there is nothing to finish. */
  it('says nothing about a practice with no required blocks', async () => {
    const done = vi.fn();
    await draw([block('sprechen', true, true)], done);

    await screen.findByText('За бажанням');
    expect(done).not.toHaveBeenCalled();
  });
});

describe('moving on from the practice', () => {
  it('lets the student go to the next lesson before finishing it', async () => {
    await draw([block('grammatik', false), block('lesen', false)]);

    const next = await screen.findByRole('button', { name: 'Наступний урок' });
    expect(next).toBeEnabled();
  });

  it('says what the required blocks are for', async () => {
    await draw([block('grammatik', false)]);

    expect(
      await screen.findByText(/зараховуються у ваш прогрес курсу/),
    ).toBeInTheDocument();
  });
});
