import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What the result screen claims about the mark and about who gave it.
 *
 * The mark is read first and the sentence under it second, so both have to be true of the same
 * thing. The part worth a test is the attribution: the feedback is written by the checker
 * against the author's criteria, and a screen that called it the teacher's comment would tell
 * a student she had read their letter herself.
 */
const fetchWritingTask = vi.fn();
const submitWriting = vi.fn();

vi.mock('@/api/writingApi', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  fetchWritingTask: (...a: unknown[]) => fetchWritingTask(...a),
  submitWriting: (...a: unknown[]) => submitWriting(...a),
}));

const { default: WritingPanel } = await import(
  '@/features/course-learning/WritingPanel/WritingPanel'
);

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
      key: () => null,
      get length() {
        return data.size;
      },
    },
  });
};

const CRITERIA = ['Привітання та прощання', '6-8 речень', 'Речення з weil'];

const assessment = (lost: number[]) => ({
  criteria: CRITERIA.map((_, index) => ({
    n: index + 1,
    point: lost.includes(index + 1) ? 0 : 1,
    comment: lost.includes(index + 1) ? 'Тут бал не зараховано.' : '',
  })),
  corrections: [],
  praise: 'Гарний, логічний лист.',
  summary: 'Дуже гарний лист, який повністю виконує завдання.',
});

const task = (over: Record<string, unknown> = {}) => ({
  task: 'Напишіть другові лист.',
  criteria: CRITERIA,
  min_sentences: 6,
  max_sentences: 8,
  max_score: 3,
  attempts_used: 1,
  attempts_per_window: 3,
  can_submit: true,
  attempts_left: 2,
  blocked_reason: null,
  retry_at: null,
  best: { score: 3, max_score: 3, assessment: assessment([]), submitted_at: '2026-11-02T10:00:00.000Z' },
  attempts: [],
  ...over,
});

beforeAll(async () => {
  await i18nReady;
});

const open = () =>
  renderWithProviders(<WritingPanel courseMaterialId="m1" materialTitle="Лист" />);

beforeEach(() => {
  installStorage();
  fetchWritingTask.mockReset();
  submitWriting.mockReset();
});

describe('whose comment the student is reading', () => {
  /**
   * The one assertion here that is about honesty rather than looks. The author is the only
   * teacher on the platform; a student told she wrote this would take a disputed mark to her.
   */
  it('calls the summary an automatic check, not the teacher’s comment', async () => {
    fetchWritingTask.mockResolvedValue(task());
    open();

    expect(await screen.findByText('Коментар автоперевірки')).toBeInTheDocument();
    expect(screen.queryByText(/викладача/)).not.toBeInTheDocument();
  });
});

describe('what the heading says about the mark', () => {
  it('celebrates a full mark', async () => {
    fetchWritingTask.mockResolvedValue(task());
    open();

    expect(await screen.findByText('Sehr gut! Усі бали ваші')).toBeInTheDocument();
  });

  /**
   * Anything short of full marks is reported without a verdict. The letter is optional and
   * gates nothing, so "passed" and "failed" are both the wrong word for it.
   */
  it('reports a partial mark plainly', async () => {
    fetchWritingTask.mockResolvedValue(
      task({
        best: {
          score: 2,
          max_score: 3,
          assessment: assessment([3]),
          submitted_at: '2026-11-02T10:00:00.000Z',
        },
      }),
    );
    open();

    expect(await screen.findByText('Лист перевірено')).toBeInTheDocument();
    expect(screen.queryByText(/Sehr gut/)).not.toBeInTheDocument();
  });

  /** Earned and lost are two lists, so a student can see what cost them the point. */
  it('separates what was earned from what was not', async () => {
    fetchWritingTask.mockResolvedValue(
      task({
        best: {
          score: 2,
          max_score: 3,
          assessment: assessment([3]),
          submitted_at: '2026-11-02T10:00:00.000Z',
        },
      }),
    );
    open();

    expect(await screen.findByText('Зараховано')).toBeInTheDocument();
    expect(screen.getByText('Не зараховано')).toBeInTheDocument();
  });

  it('shows no lost list when nothing was lost', async () => {
    fetchWritingTask.mockResolvedValue(task());
    open();

    await screen.findByText('Зараховано');
    expect(screen.queryByText('Не зараховано')).not.toBeInTheDocument();
  });
});

describe('writing it again', () => {
  it('is offered while a check is left', async () => {
    fetchWritingTask.mockResolvedValue(task());
    open();

    expect(
      await screen.findByRole('button', { name: 'Написати ще раз' }),
    ).toBeInTheDocument();
  });

  /** With the allowance spent there is no box to go back to, so there is no button either. */
  it('is not offered once the checks are used up', async () => {
    fetchWritingTask.mockResolvedValue(
      task({ can_submit: false, blocked_reason: 'used_up', attempts_left: 0 }),
    );
    open();

    await screen.findByText('Зараховано');
    expect(
      screen.queryByRole('button', { name: 'Написати ще раз' }),
    ).not.toBeInTheDocument();
  });
});
