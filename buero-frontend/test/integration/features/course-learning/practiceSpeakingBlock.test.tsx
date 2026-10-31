import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { asClock } from '@/features/course-learning/PracticePanel/useRecorder';
import { renderWithProviders } from '../../../utils/renderWithProviders';

const fetchSpeakingTasks = vi.fn();
const uploadSpeakingRecording = vi.fn();

vi.mock('@/api/speakingApi', () => ({
  fetchSpeakingTasks: (...args: unknown[]) => fetchSpeakingTasks(...args),
  uploadSpeakingRecording: (...args: unknown[]) => uploadSpeakingRecording(...args),
}));

const { default: PracticeSpeakingBlock } = await import(
  '@/features/course-learning/PracticePanel/PracticeSpeakingBlock'
);

/**
 * The speaking block, and the rule that makes it a task rather than a reading exercise.
 *
 * The author's model answer stays closed until the student has recorded something. Handing it
 * over first turns "say three sentences about who you helped today" into "read this aloud" -
 * and finding the words yourself is the whole of what the task is for.
 */
beforeAll(async () => {
  await i18nReady;
});

const task = (overrides: Record<string, unknown> = {}) => ({
  element_id: '2.1.S1',
  task: 'Запишіть 3–4 речення: кому ви сьогодні допомагали.',
  answer_open: false,
  sample_answer: null,
  hints: [],
  recording: null,
  ...overrides,
});

describe('the Sprechen block of a practice', () => {
  beforeEach(() => {
    fetchSpeakingTasks.mockReset();
    uploadSpeakingRecording.mockReset();
    fetchSpeakingTasks.mockResolvedValue({ tasks: [task()] });
  });

  it('shows the prompt', async () => {
    renderWithProviders(<PracticeSpeakingBlock courseMaterialId="practice-1" />);
    expect(
      await screen.findByText('Запишіть 3–4 речення: кому ви сьогодні допомагали.'),
    ).toBeInTheDocument();
  });

  /** The rule. */
  it('keeps the model answer closed until something is recorded', async () => {
    fetchSpeakingTasks.mockResolvedValue({
      tasks: [task({ answer_open: false, sample_answer: null })],
    });
    renderWithProviders(<PracticeSpeakingBlock courseMaterialId="practice-1" />);

    await screen.findByText(/кому ви сьогодні допомагали/);
    expect(screen.queryByText(/Зразкова відповідь/i)).not.toBeInTheDocument();
  });

  it('opens it, with the words to lean on, once there is one', async () => {
    fetchSpeakingTasks.mockResolvedValue({
      tasks: [
        task({
          answer_open: true,
          sample_answer: 'Heute habe ich dem Techniker geholfen.',
          hints: ['Ich helfe …', 'Ich danke …'],
          recording: {
            audio_url: 'https://cdn/rec.webm',
            duration_seconds: 12,
            recorded_at: '2026-10-30T10:00:00.000Z',
          },
        }),
      ],
    });
    renderWithProviders(<PracticeSpeakingBlock courseMaterialId="practice-1" />);

    expect(
      await screen.findByText('Heute habe ich dem Techniker geholfen.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Ich helfe …')).toBeInTheDocument();
    expect(screen.getByText('Ich danke …')).toBeInTheDocument();
  });

  /**
   * A browser with no MediaRecorder says so instead of showing a button that does nothing.
   * jsdom is exactly such a browser, which is why this case is the easy one to reach.
   */
  it('says plainly when the browser cannot record', async () => {
    renderWithProviders(<PracticeSpeakingBlock courseMaterialId="practice-1" />);
    expect(await screen.findByText(/не вміє записувати звук/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Записати$/ })).not.toBeInTheDocument();
  });

  it('offers a retry when the tasks cannot be loaded', async () => {
    fetchSpeakingTasks.mockRejectedValue(new Error('offline'));
    renderWithProviders(<PracticeSpeakingBlock courseMaterialId="practice-1" />);

    const retry = await screen.findByRole('button', { name: /спроб|try/i });
    fetchSpeakingTasks.mockResolvedValue({ tasks: [task()] });
    await userEvent.click(retry);

    await waitFor(() => {
      expect(screen.getByText(/кому ви сьогодні допомагали/)).toBeInTheDocument();
    });
  });

  it('says so when the block has no tasks yet', async () => {
    fetchSpeakingTasks.mockResolvedValue({ tasks: [] });
    renderWithProviders(<PracticeSpeakingBlock courseMaterialId="practice-1" />);
    expect(await screen.findByText(/ще немає завдань на говоріння/i)).toBeInTheDocument();
  });
});

/** A recording is read as a duration. Nobody reads 95 as a minute and a half. */
describe('the recording clock', () => {
  it.each([
    [0, '0:00'],
    [7, '0:07'],
    [60, '1:00'],
    [95, '1:35'],
    [605, '10:05'],
  ])('shows %i seconds as %s', (seconds, expected) => {
    expect(asClock(seconds)).toBe(expected);
  });

  /** A clock that can read backwards would be worse than one that stops at zero. */
  it('never reads below zero', () => {
    expect(asClock(-5)).toBe('0:00');
  });
});
