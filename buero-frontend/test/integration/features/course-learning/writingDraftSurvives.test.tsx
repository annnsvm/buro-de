import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * A letter that was refused is still there when the student comes back.
 *
 * This is the loss as it was reported: the letter was sent, the free check turned it away for
 * being too short, the student left the block to look something up, and the paragraph they had
 * written was gone. Nothing had been graded, so there was no best attempt to restore it from -
 * the text had only ever existed in component state.
 *
 * The hook that fixes it is tested on its own; what this file proves is the wiring, which the
 * hook cannot: that the block hands the form a key at all, and that the key tells one task from
 * another and one student from another.
 */

const fetchPracticeWritingTasks = vi.fn();
const submitPracticeWriting = vi.fn();

vi.mock('@/api/writingApi', () => ({
  fetchPracticeWritingTasks: (...args: unknown[]) => fetchPracticeWritingTasks(...args),
  submitPracticeWriting: (...args: unknown[]) => submitPracticeWriting(...args),
}));

const { default: PracticeWritingBlock } = await import(
  '@/features/course-learning/PracticePanel/PracticeWritingBlock'
);

/** This environment ships a `localStorage` with no methods, so a real one goes in first. */
const installStorage = () => {
  const data = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      getItem: (k: string) => (data.has(k) ? (data.get(k) as string) : null),
      setItem: (k: string, v: string) => void data.set(k, String(v)),
      removeItem: (k: string) => void data.delete(k),
      clear: () => data.clear(),
      key: (i: number) => [...data.keys()][i] ?? null,
      get length() {
        return data.size;
      },
    },
  });
};

const student = (id: string) => ({
  user: {
    currentUser: {
      id,
      email: `${id}@example.com`,
      role: 'student' as const,
      language: 'uk',
    },
    status: 'succeeded' as const,
    error: null,
  },
});

const task = (overrides: Record<string, unknown> = {}) => ({
  element_id: 'W1',
  title: 'Лист колезі',
  task: 'Напишіть колезі лист на 6-8 речень.',
  criteria: ['У тілі листа 6-8 речень', 'Є речення з weil'],
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

const HALF_WRITTEN =
  'Hallo Anna, ich kann morgen nicht kommen, weil ich krank bin. Bis bald!';

beforeAll(async () => {
  await i18nReady;
});

describe('a half-written letter', () => {
  beforeEach(() => {
    installStorage();
    fetchPracticeWritingTasks.mockReset();
    submitPracticeWriting.mockReset();
    fetchPracticeWritingTasks.mockResolvedValue({ tasks: [task()], unusable: [] });
  });

  const openBlock = (userId = 'student-1') =>
    renderWithProviders(<PracticeWritingBlock courseMaterialId="m1" />, {
      preloadedState: student(userId),
    });

  it('is still in the box after the student leaves the block and returns', async () => {
    const user = userEvent.setup();
    submitPracticeWriting.mockResolvedValue({
      status: 'needs_more',
      reason: 'too_short',
      body_sentences: 2,
      min_sentences: 6,
      max_sentences: 8,
      attempts_left: 3,
    });

    const first = openBlock();
    const box = await screen.findByRole('textbox');
    await user.type(box, HALF_WRITTEN);

    /** Sent, and turned away by the free check without costing an attempt. */
    await user.click(screen.getByRole('button', { name: /перевірити/i }));
    await waitFor(() => expect(submitPracticeWriting).toHaveBeenCalled());

    /** Leaving the block for the hub, which unmounts everything. */
    first.unmount();

    openBlock();
    expect(await screen.findByRole('textbox')).toHaveValue(HALF_WRITTEN);
    expect(
      screen.getByText(/текст зберігся на цьому пристрої/i),
    ).toBeInTheDocument();
  });

  it('is dropped once the letter has been graded', async () => {
    const user = userEvent.setup();
    submitPracticeWriting.mockResolvedValue({
      status: 'graded',
      repeated: false,
      score: 2,
      max_score: 2,
      assessment: {
        criteria: [
          { id: 1, met: true, note: 'шість речень' },
          { id: 2, met: true, note: 'weil правильно' },
        ],
      },
      attempts_left: 2,
    });

    const first = openBlock();
    await user.type(await screen.findByRole('textbox'), HALF_WRITTEN);
    await user.click(screen.getByRole('button', { name: /перевірити/i }));
    await waitFor(() => expect(submitPracticeWriting).toHaveBeenCalled());

    first.unmount();
    openBlock();

    /** The mark is on the record now, so the box starts from the task, not from a draft. */
    expect(await screen.findByRole('textbox')).toHaveValue('');
    expect(screen.queryByText(/текст зберігся на цьому пристрої/i)).toBeNull();
  });

  /** Two people on one browser profile must not inherit each other's letters. */
  it('does not follow another student on the same browser', async () => {
    const user = userEvent.setup();
    const first = openBlock('student-1');
    await user.type(await screen.findByRole('textbox'), HALF_WRITTEN);
    first.unmount();

    openBlock('student-2');
    expect(await screen.findByRole('textbox')).toHaveValue('');
  });

  /** Two letters in one block are two drafts, not one shared box. */
  it('keeps one draft per task', async () => {
    const user = userEvent.setup();
    fetchPracticeWritingTasks.mockResolvedValue({
      tasks: [task(), task({ element_id: 'W2', title: 'Лист керівникові' })],
      unusable: [],
    });

    const first = openBlock();
    const boxes = await screen.findAllByRole('textbox');
    await user.type(boxes[0], 'erster Brief');
    await user.type(boxes[1], 'zweiter Brief');
    first.unmount();

    openBlock();
    const back = await screen.findAllByRole('textbox');
    expect(back[0]).toHaveValue('erster Brief');
    expect(back[1]).toHaveValue('zweiter Brief');
  });
});
