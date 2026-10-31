import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

const fetchPracticeWritingTasks = vi.fn();
const submitPracticeWriting = vi.fn();

vi.mock('@/api/writingApi', () => ({
  fetchPracticeWritingTasks: (...args: unknown[]) =>
    fetchPracticeWritingTasks(...args),
  submitPracticeWriting: (...args: unknown[]) => submitPracticeWriting(...args),
}));

const { default: PracticeWritingBlock } = await import(
  '@/features/course-learning/PracticePanel/PracticeWritingBlock'
);

/**
 * The Schreiben block of a practice, as the student meets it.
 *
 * Writing is not a set of questions, so the block is not the question player: it is one letter
 * marked against the rubric its author wrote. The two things that must be on screen before a
 * word is typed are the task and the criteria - a student who can read the criteria can check
 * their own letter before spending one of three paid attempts.
 */
beforeAll(async () => {
  await i18nReady;
});

const task = (overrides: Record<string, unknown> = {}) => ({
  element_id: '2.1.W1',
  title: 'Лист колезі',
  task: 'Напишіть колезі лист на 6–8 речень.',
  criteria: ['У тілі листа 6–8 речень', 'Є речення з weil'],
  min_sentences: 6,
  max_sentences: 8,
  max_score: 2,
  attempts_used: 0,
  attempts_per_window: 3,
  can_submit: true,
  attempts_left: 3,
  blocked_reason: null,
  retry_at: null,
  best: null,
  ...overrides,
});

describe('the Schreiben block of a practice', () => {
  beforeEach(() => {
    fetchPracticeWritingTasks.mockReset();
    submitPracticeWriting.mockReset();
    fetchPracticeWritingTasks.mockResolvedValue({ tasks: [task()], unusable: [] });
  });

  it('shows the task and every criterion before anything is written', async () => {
    renderWithProviders(<PracticeWritingBlock courseMaterialId="practice-1" />);

    expect(
      await screen.findByText('Напишіть колезі лист на 6–8 речень.'),
    ).toBeInTheDocument();
    expect(screen.getByText('У тілі листа 6–8 речень')).toBeInTheDocument();
    expect(screen.getByText('Є речення з weil')).toBeInTheDocument();
  });

  /**
   * The letter goes to the task's own endpoint, carrying the task's id.
   *
   * This is the part that silently breaks: posting to the practice instead would let the
   * first letter of a lesson spend the second one's attempts, and the student would open
   * task two to find it already used up with nothing on screen to say why.
   */
  it('sends the letter against the task it belongs to', async () => {
    submitPracticeWriting.mockResolvedValue({
      status: 'graded',
      repeated: false,
      score: 2,
      max_score: 2,
      assessment: { criteria: [] },
      attempts_left: 2,
    });

    renderWithProviders(<PracticeWritingBlock courseMaterialId="practice-1" />);
    const box = await screen.findByRole('textbox');
    await userEvent.type(box, 'Liebe Frau Berg, herzlichen Glückwunsch!');
    await userEvent.click(screen.getByRole('button', { name: /перевірити|check/i }));

    await waitFor(() => {
      expect(submitPracticeWriting).toHaveBeenCalledWith(
        '2.1.W1',
        'Liebe Frau Berg, herzlichen Glückwunsch!',
      );
    });
  });

  /** A graded letter re-reads the block, because the attempts and the best result both move. */
  it('re-reads the block after a mark', async () => {
    submitPracticeWriting.mockResolvedValue({
      status: 'graded',
      repeated: false,
      score: 2,
      max_score: 2,
      assessment: { criteria: [] },
      attempts_left: 2,
    });

    renderWithProviders(<PracticeWritingBlock courseMaterialId="practice-1" />);
    await userEvent.type(await screen.findByRole('textbox'), 'Liebe Frau Berg!');
    await userEvent.click(screen.getByRole('button', { name: /перевірити|check/i }));

    await waitFor(() => {
      expect(fetchPracticeWritingTasks).toHaveBeenCalledTimes(2);
    });
  });

  /** Returning to a marked letter opens on the text that was graded, not a blank page. */
  it('shows the best attempt back', async () => {
    fetchPracticeWritingTasks.mockResolvedValue({
      tasks: [
        task({
          best: {
            score: 2,
            assessment: { criteria: [] },
            text: 'Sehr geehrte Frau Berg, ich bin heute krank.',
            submitted_at: '2026-10-30T10:00:00.000Z',
          },
        }),
      ],
      unusable: [],
    });

    renderWithProviders(<PracticeWritingBlock courseMaterialId="practice-1" />);

    expect(await screen.findByRole('textbox')).toHaveValue(
      'Sehr geehrte Frau Berg, ich bin heute krank.',
    );
  });

  /**
   * One unfinished task must not take the block down, and must not vanish either.
   *
   * It used to be able to do both: a task with no rubric threw on the server and answered the
   * whole block with a 500, so the finished letters beside it were unreachable too.
   */
  it('names a task that has no rubric yet, and still shows the rest', async () => {
    fetchPracticeWritingTasks.mockResolvedValue({
      tasks: [task()],
      unusable: [
        { element_id: '2.1.W2', title: 'Другий лист', reason: 'criteria' },
      ],
    });

    renderWithProviders(<PracticeWritingBlock courseMaterialId="practice-1" />);

    expect(await screen.findByText('Другий лист')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  /** A single task needs no heading of its own; the block already carries one. */
  it('heads each task only when there is more than one', async () => {
    renderWithProviders(<PracticeWritingBlock courseMaterialId="practice-1" />);
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByText('Лист колезі')).not.toBeInTheDocument();

    fetchPracticeWritingTasks.mockResolvedValue({
      tasks: [task(), task({ element_id: '2.1.W2', title: 'Лист керівникові' })],
      unusable: [],
    });
    renderWithProviders(<PracticeWritingBlock courseMaterialId="practice-2" />);

    expect(await screen.findByText('Лист керівникові')).toBeInTheDocument();
  });
});
