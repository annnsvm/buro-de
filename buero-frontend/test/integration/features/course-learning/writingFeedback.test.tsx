import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What the student sees after a check, and what they see when the checks run out.
 *
 * The feedback changed shape with the amendment: marks carry a comment only when the point was
 * lost, and with them come the corrections, the praise and the summary. Attempts graded before
 * that are stored in the old shape and are not going to be re-marked, so both have to render -
 * which is the one thing here that would fail silently rather than loudly.
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

const CRITERIA = [
  '4-6 речень про вашу суботу',
  'Щонайменше 4 речення в Perfekt',
  'haben на 2-му місці',
];

/** Feedback in the shape the checker returns now. */
const newShape = {
  criteria: [
    { n: 1, point: 1, comment: '' },
    { n: 2, point: 1, comment: '' },
    { n: 3, point: 0, comment: 'У другому реченні haben стоїть у кінці.' },
  ],
  corrections: [
    { wrong: 'Ich gestern gekocht habe', right: 'Ich habe gestern gekocht', why: 'дієслово друге' },
  ],
  praise: 'Гарні речення в Perfekt.',
  summary: 'Попрацюйте над порядком слів.',
};

/** Feedback as it was stored before the amendment. */
const oldShape = {
  criteria: [
    { id: 1, met: true, note: 'Чотири речення, як треба.' },
    { id: 2, met: false, note: 'Лише два речення в Perfekt.' },
    { id: 3, met: true, note: 'Порядок слів правильний.' },
  ],
};

const task = (overrides: Record<string, unknown> = {}) => ({
  task: 'Напишіть Lena відповідь - що ви робили в суботу.',
  criteria: CRITERIA,
  min_sentences: 4,
  max_sentences: null,
  max_score: 3,
  attempts_used: 0,
  attempts_per_window: 3,
  can_submit: true,
  attempts_left: 3,
  blocked_reason: null,
  retry_at: null,
  best: null,
  attempts: [],
  ...overrides,
});

const attempt = (over: Record<string, unknown> = {}) => ({
  score: 2,
  max_score: 3,
  assessment: newShape,
  text: 'Hallo Lena! Ich habe gearbeitet.',
  submitted_at: '2026-11-01T10:00:00.000Z',
  ...over,
});

beforeAll(async () => {
  await i18nReady;
});

const open = () =>
  renderWithProviders(
    <WritingPanel courseMaterialId="m1" materialTitle="Лист колезі" />,
  );

describe('the feedback on a checked letter', () => {
  beforeEach(() => {
    installStorage();
    fetchWritingTask.mockReset();
    submitWriting.mockReset();
    fetchWritingTask.mockResolvedValue(task());
  });

  const send = async () => {
    const user = userEvent.setup();
    const box = await screen.findByRole('textbox');
    await user.type(box, 'Hallo Lena! Ich habe am Samstag gearbeitet und viel geputzt.');
    await user.click(screen.getByRole('button', { name: /перевірити/i }));
  };

  it('shows the score', async () => {
    submitWriting.mockResolvedValue({
      status: 'graded',
      repeated: false,
      score: 2,
      max_score: 3,
      assessment: newShape,
      attempts_left: 2,
    });
    open();
    await send();

    expect(await screen.findByText('2 з 3 балів')).toBeInTheDocument();
  });

  it('shows what to fix, as wrong against right', async () => {
    submitWriting.mockResolvedValue({
      status: 'graded',
      repeated: false,
      score: 2,
      max_score: 3,
      assessment: newShape,
      attempts_left: 2,
    });
    open();
    await send();

    expect(await screen.findByText(/що виправити/i)).toBeInTheDocument();
    expect(screen.getByText('Ich gestern gekocht habe')).toBeInTheDocument();
    expect(screen.getByText('Ich habe gestern gekocht')).toBeInTheDocument();
    expect(screen.getByText('дієслово друге')).toBeInTheDocument();
  });

  it('shows the praise and the summary', async () => {
    submitWriting.mockResolvedValue({
      status: 'graded',
      repeated: false,
      score: 2,
      max_score: 3,
      assessment: newShape,
      attempts_left: 2,
    });
    open();
    await send();

    expect(await screen.findByText('Гарні речення в Perfekt.')).toBeInTheDocument();
    expect(screen.getByText('Попрацюйте над порядком слів.')).toBeInTheDocument();
  });

  /** A tick needs no sentence beneath it. Five of them bury the one that matters. */
  it('explains only the criteria that lost their point', async () => {
    submitWriting.mockResolvedValue({
      status: 'graded',
      repeated: false,
      score: 2,
      max_score: 3,
      assessment: newShape,
      attempts_left: 2,
    });
    open();
    await send();

    expect(
      await screen.findByText('У другому реченні haben стоїть у кінці.'),
    ).toBeInTheDocument();
    /**
     * Each criterion appears twice - once in the rubric shown before writing, once beside its
     * mark - and only the lost one carries an explanation.
     */
    CRITERIA.forEach((criterion) => {
      expect(screen.getAllByText(criterion).length).toBeGreaterThanOrEqual(2);
    });
  });

  /**
   * The one that would fail quietly. These attempts exist in the database and will never be
   * re-marked, so if the screen only understands the new shape they come back blank.
   */
  it('renders an attempt stored in the old shape', async () => {
    fetchWritingTask.mockResolvedValue(
      task({
        best: {
          score: 2,
          assessment: oldShape,
          text: 'Hallo Lena!',
          submitted_at: '2026-10-01T10:00:00.000Z',
        },
        attempts_used: 1,
        attempts_left: 2,
      }),
    );
    open();

    expect(await screen.findByText('Лише два речення в Perfekt.')).toBeInTheDocument();
    expect(screen.getByText('Чотири речення, як треба.')).toBeInTheDocument();
  });
});

describe('the counter under the button', () => {
  beforeEach(() => {
    installStorage();
    fetchWritingTask.mockReset();
    submitWriting.mockReset();
  });

  it('says how many checks are left and how many there were', async () => {
    fetchWritingTask.mockResolvedValue(task({ attempts_left: 2, attempts_per_window: 3 }));
    open();

    expect(await screen.findByText(/залишилось перевірок: 2 з 3/i)).toBeInTheDocument();
  });

  /** A teacher granted two more, so the allowance is five - not the three it used to hardcode. */
  it('follows an allowance a teacher widened', async () => {
    fetchWritingTask.mockResolvedValue(task({ attempts_left: 4, attempts_per_window: 5 }));
    open();

    expect(await screen.findByText(/залишилось перевірок: 4 з 5/i)).toBeInTheDocument();
  });

  /**
   * Thirty seconds is not the same as running out, and it used to look identical: the box was
   * hidden and the student was told to come back later.
   */
  it('keeps the box and the count during the pause between checks', async () => {
    fetchWritingTask.mockResolvedValue(
      task({
        can_submit: false,
        blocked_reason: 'cooldown',
        retry_at: new Date(Date.now() + 25_000).toISOString(),
        attempts_left: 2,
      }),
    );
    open();

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/залишилось перевірок: 2 з 3/i)).toBeInTheDocument();
    expect(screen.getByText(/можна знову о/i)).toBeInTheDocument();
  });
});

describe('when the checks are used up', () => {
  const spent = task({
    can_submit: false,
    blocked_reason: 'used_up',
    attempts_used: 3,
    attempts_left: 0,
    best: {
      score: 2,
      assessment: newShape,
      text: 'Hallo Lena! Dritte Version.',
      submitted_at: '2026-11-01T12:00:00.000Z',
    },
    attempts: [
      attempt({ text: 'Hallo Lena! Dritte Version.', score: 2 }),
      attempt({ text: 'Hallo Lena! Zweite Version.', score: 1, submitted_at: '2026-11-01T11:00:00.000Z' }),
      attempt({ text: 'Hallo Lena! Erste Version.', score: 0, submitted_at: '2026-11-01T10:00:00.000Z' }),
    ],
  });

  beforeEach(() => {
    installStorage();
    fetchWritingTask.mockReset();
    submitWriting.mockReset();
    fetchWritingTask.mockResolvedValue(spent);
  });

  it('takes the box away rather than refusing everything sent to it', async () => {
    open();
    await screen.findByText(/використали всі перевірки/i);

    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('button', { name: /перевірити/i })).toBeNull();
  });

  /** What is left is the part that still teaches: the three versions and the three answers. */
  it('opens every earlier version with what the checker said', async () => {
    open();
    await screen.findByText(/використали всі перевірки/i);

    expect(screen.getByText('Hallo Lena! Erste Version.')).toBeInTheDocument();
    expect(screen.getByText('Hallo Lena! Zweite Version.')).toBeInTheDocument();
    expect(screen.getAllByText(/спроба \d/i)).toHaveLength(3);
  });

  it('does not say how many checks are left, because there is nothing to count', async () => {
    open();
    await screen.findByText(/використали всі перевірки/i);

    expect(screen.queryByText(/залишилось перевірок/i)).toBeNull();
  });
});

describe('when the checker cannot be read', () => {
  beforeEach(() => {
    installStorage();
    fetchWritingTask.mockReset();
    submitWriting.mockReset();
    fetchWritingTask.mockResolvedValue(task());
  });

  /** Our fault, so it is said as our fault and the check is still theirs. */
  it('says so without sending the student to rewrite', async () => {
    submitWriting.mockResolvedValue({ status: 'unavailable', attempts_left: 3 });
    open();
    const user = userEvent.setup();
    await user.type(
      await screen.findByRole('textbox'),
      'Hallo Lena! Ich habe am Samstag gearbeitet und viel geputzt.',
    );
    await user.click(screen.getByRole('button', { name: /перевірити/i }));

    expect(await screen.findByText(/перевірка тимчасово недоступна/i)).toBeInTheDocument();
    expect(screen.getByText(/перевірку не зараховано/i)).toBeInTheDocument();
  });

  it.each([
    ['copied', /схоже, що текст скопійовано/i],
    ['not_german', /текст має бути німецькою/i],
    ['already_sent', /цей текст ви вже надсилали/i],
  ])('explains a refusal of kind %s', async (reason, pattern) => {
    submitWriting.mockResolvedValue({
      status: 'needs_more',
      reason,
      body_sentences: 4,
      min_sentences: 4,
      max_sentences: null,
      attempts_left: 3,
    });
    open();
    const user = userEvent.setup();
    await user.type(
      await screen.findByRole('textbox'),
      'Hallo Lena! Ich habe am Samstag gearbeitet und viel geputzt.',
    );
    await user.click(screen.getByRole('button', { name: /перевірити/i }));

    expect(await screen.findByText(pattern)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText(/перевірку не зараховано/i)).toBeInTheDocument(),
    );
  });
});
