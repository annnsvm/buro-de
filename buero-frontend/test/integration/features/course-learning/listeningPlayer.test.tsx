import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListeningAudio from '@/features/course-learning/QuizPanel/ListeningAudio';
import type { PracticeElement } from '@/api/quizApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The player that replaced the browser's own.
 *
 * Replacing a native control means owing back everything it gave. The tests that matter are
 * not about how it looks: they are about what a student can still do with it - move through
 * the recording, do it from the keyboard, and know where in it they are.
 */
beforeAll(async () => {
  await i18nReady;
});

const element = (over: Partial<PracticeElement> = {}): PracticeElement => ({
  id: 'ha1',
  kind: 'audio',
  title: 'Розмова в офісі',
  body: null,
  audio_url: 'https://res.cloudinary.com/x/one.mp3',
  awaiting_audio: false,
  has_transcript: true,
  transcript: null,
  ...over,
});

beforeEach(() => {
  /** jsdom has no media pipeline, so playing is stubbed; the state around it is the point. */
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    this.dispatchEvent(new Event('pause'));
  });
});

describe('moving through a recording', () => {
  /**
   * The one that would be a real loss. The native control could be dragged and nudged with
   * the arrow keys; a row of drawn bars could not, and a student who missed a sentence would
   * have to start the whole recording again.
   */
  it('can still be moved through, by dragging or by keyboard', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);

    const track = screen.getByRole('slider', { name: 'Перемотати запис' });
    expect(track).toBeInTheDocument();
    expect(track).toHaveAttribute('type', 'range');
  });

  it('says where in the recording the student is', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);

    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument();
  });

  it('offers a way back to the beginning', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);

    expect(
      screen.getByRole('button', { name: 'Послухати спочатку' }),
    ).toBeInTheDocument();
  });
});

describe('starting and stopping', () => {
  it('names the button by what pressing it does', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);
    const user = userEvent.setup();

    const play = screen.getByRole('button', { name: 'Відтворити' });
    await user.click(play);

    expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument();
  });

  it('goes back to offering play once it is paused', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Відтворити' }));
    await user.click(screen.getByRole('button', { name: 'Пауза' }));

    expect(screen.getByRole('button', { name: 'Відтворити' })).toBeInTheDocument();
  });
});

describe('the speed', () => {
  it('offers slow and normal, and says which is on', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);

    expect(screen.getByRole('button', { name: '1×' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: '0.75×' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('switches to the slow one when asked', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '0.75×' }));

    expect(screen.getByRole('button', { name: '0.75×' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

describe('a recording that is not there yet', () => {
  it('offers nothing to press', async () => {
    renderWithProviders(
      <ListeningAudio element={element({ audio_url: null, awaiting_audio: true })} />,
    );

    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Відтворити' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('ще готується');
  });
});

describe('the transcript', () => {
  it('stays shut until every question about the recording is answered', async () => {
    renderWithProviders(<ListeningAudio element={element()} />);

    expect(
      screen.getByText(/Текст запису відкриється/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Показати текст запису' }),
    ).not.toBeInTheDocument();
  });

  it('opens once the server sends it', async () => {
    renderWithProviders(
      <ListeningAudio element={element({ transcript: 'OLHA: Hast du Zeit?' })} />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Показати текст запису' }));

    expect(screen.getByText('OLHA: Hast du Zeit?')).toBeInTheDocument();
  });
});
