import { beforeAll, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import ListeningAudio from '@/features/course-learning/QuizPanel/ListeningAudio';
import PracticeHub from '@/features/course-learning/PracticePanel/PracticeHub';
import type { PracticeElement } from '@/api/quizApi';
import type { PracticeBlockSummary, PracticeOverview } from '@/api/practiceApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What a student meets when the author has written a listening task but not recorded it yet.
 *
 * The row and the mp3 arrive separately - the file names the recording, and the recording is
 * made afterwards - so this state is not an error, it is the normal shape of a course being
 * written. What it must never look like is something broken on the student's side.
 */
beforeAll(async () => {
  await i18nReady;
});

const audio = (overrides: Partial<PracticeElement> = {}): PracticeElement => ({
  id: 'ha1',
  kind: 'audio',
  title: 'Розмова в офісі',
  body: null,
  audio_url: null,
  awaiting_audio: true,
  /**
   * False even though the author has written a transcript, because that is what the server
   * sends for a recording with no file: its questions are held back, so there is nothing to
   * answer and nothing that could ever open the transcript.
   */
  has_transcript: false,
  transcript: null,
  ...overrides,
});

describe('a listening task with no recording yet', () => {
  it('names the task, so the student sees it exists', async () => {
    renderWithProviders(<ListeningAudio element={audio()} />);

    expect(screen.getByText('Розмова в офісі')).toBeInTheDocument();
  });

  it('says the task is being prepared and that its questions come with it', async () => {
    renderWithProviders(<ListeningAudio element={audio()} />);

    const notice = screen.getByRole('status');
    expect(notice).toHaveTextContent('ще готується');
    expect(notice).toHaveTextContent('Питання до нього відкриються разом з аудіо');
  });

  it('offers no player to press', async () => {
    const { container } = renderWithProviders(<ListeningAudio element={audio()} />);

    expect(container.querySelector('audio')).toBeNull();
  });

  /**
   * The transcript is the whole dialogue in writing. Showing it for a recording that does not
   * exist would hand over the answers to questions the student has not been asked.
   */
  it('does not show the transcript', async () => {
    renderWithProviders(<ListeningAudio element={audio()} />);

    expect(
      screen.queryByText('Показати текст запису'),
    ).not.toBeInTheDocument();
  });

  /**
   * Nor does it say one is coming. "Opens once you have answered every question about it" is
   * a lock with no key here: the questions are not asked, so the student was told to wait for
   * something that could never arrive. A recording with no file says only that much.
   */
  it('does not promise a transcript either', async () => {
    renderWithProviders(<ListeningAudio element={audio()} />);

    expect(screen.queryByText(/Текст запису відкриється/)).not.toBeInTheDocument();
  });

  it('plays normally once the recording is there', async () => {
    const { container } = renderWithProviders(
      <ListeningAudio
        element={audio({
          audio_url: 'https://res.cloudinary.com/x/one.mp3',
          awaiting_audio: false,
        })}
      />,
    );

    expect(container.querySelector('audio')).not.toBeNull();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('the hub, for a block whose recordings have not arrived', () => {
  const block = (
    name: PracticeBlockSummary['block'],
    extra: Partial<PracticeBlockSummary> = {},
  ): PracticeBlockSummary => ({
    block: name,
    total: 4,
    answered: 0,
    correct: 0,
    done: false,
    optional: false,
    awaiting_audio: 0,
    ready: true,
    task_count: 0,
    points: null,
    ...extra,
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

  const draw = (blocks: PracticeBlockSummary[]) =>
    renderWithProviders(
      <PracticeHub
        overview={overview(blocks)}
        onOpenBlock={() => {}}
        nextStepLabel="До практики"
      />,
    );

  const UNREADY = block('horen', { total: 0, awaiting_audio: 2, ready: false });

  it('marks the block as still being prepared', async () => {
    draw([block('grammatik'), UNREADY]);

    expect(screen.getByText('ще готується')).toBeInTheDocument();
  });

  /**
   * The line under the title used to be the question count, which for this block is zero -
   * and "0 questions" reads as a block that is broken, not one that is coming.
   */
  it('describes the block instead of counting nothing', async () => {
    draw([block('grammatik'), UNREADY]);

    expect(screen.getByText('Аудіо і питання до нього')).toBeInTheDocument();
    expect(screen.queryByText(/0 питан/)).not.toBeInTheDocument();
  });

  /**
   * The figure at the top. Counting a block that cannot be worked on would leave the student
   * one short of a total they have no way to reach.
   */
  it('leaves it out of the figure for the lesson', async () => {
    draw([block('grammatik', { done: true }), UNREADY]);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('/1')).toBeInTheDocument();
  });
});
