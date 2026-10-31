import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * Notes a student keeps on a lesson.
 *
 * The box was decoration: a placeholder and nothing else, no state and no request, so every note
 * typed into it was discarded on the next navigation. Notes are also the one thing in the product
 * that must outlast everything else - someone coming back to a lesson half a year later, on a
 * different machine, has to find what they wrote - so they are kept on the server, and the device
 * copy exists only to cover a save that did not go through.
 */

const fetchLessonNote = vi.fn();
const saveLessonNote = vi.fn();

vi.mock('@/api/lessonNotesApi', () => ({
  fetchLessonNote: (...a: unknown[]) => fetchLessonNote(...a),
  saveLessonNote: (...a: unknown[]) => saveLessonNote(...a),
}));

const { default: LessonNotes } = await import(
  '@/features/course-learning/MaterialWindow/LessonNotes'
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

const student = (id = 'student-1') => ({
  user: {
    currentUser: { id, email: `${id}@example.com`, role: 'student' as const, language: 'uk' },
    status: 'succeeded' as const,
    error: null,
  },
});

const NOTE = 'weil - дієслово в кінці. Перевірити Perfekt з sein.';

beforeAll(async () => {
  await i18nReady;
});

describe('notes on a lesson', () => {
  beforeEach(() => {
    installStorage();
    fetchLessonNote.mockReset();
    saveLessonNote.mockReset();
    fetchLessonNote.mockResolvedValue({ text: '', updated_at: null });
    saveLessonNote.mockImplementation((_id: string, text: string) =>
      Promise.resolve({ text, updated_at: '2026-04-30T09:15:00.000Z' }),
    );
  });

  const open = (materialId = 'lesson-1', who = student()) =>
    renderWithProviders(<LessonNotes materialId={materialId} />, {
      preloadedState: who,
    });

  it('sends what was typed to the server by itself', async () => {
    const user = userEvent.setup();
    open();

    await user.type(await screen.findByRole('textbox'), NOTE);
    await waitFor(() => expect(saveLessonNote).toHaveBeenCalledWith('lesson-1', NOTE), {
      timeout: 4000,
    });
  });

  /** The whole point: reopening the lesson shows the note, whenever that happens to be. */
  it('shows the note written months earlier', async () => {
    fetchLessonNote.mockResolvedValue({
      text: NOTE,
      updated_at: '2025-11-02T08:00:00.000Z',
    });
    open();

    expect(await screen.findByRole('textbox')).toHaveValue(NOTE);
    expect(await screen.findByText(/збережено/i)).toBeInTheDocument();
  });

  it('asks the server for this lesson only', async () => {
    open('lesson-7');
    await waitFor(() => expect(fetchLessonNote).toHaveBeenCalledWith('lesson-7'));
  });

  it('does not save a note that was only read and not changed', async () => {
    fetchLessonNote.mockResolvedValue({ text: NOTE, updated_at: '2025-11-02T08:00:00.000Z' });
    open();

    expect(await screen.findByRole('textbox')).toHaveValue(NOTE);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    expect(saveLessonNote).not.toHaveBeenCalled();
  });

  /** Closing the lesson before the timer fires must not cost the note. */
  it('saves on the way out when the timer has not fired yet', async () => {
    const user = userEvent.setup();
    const view = open();

    await user.type(await screen.findByRole('textbox'), 'швидка думка');
    view.unmount();

    await waitFor(() =>
      expect(saveLessonNote).toHaveBeenCalledWith('lesson-1', 'швидка думка'),
    );
  });

  describe('when the save does not go through', () => {
    it('says so and keeps the text in the box', async () => {
      const user = userEvent.setup();
      saveLessonNote.mockRejectedValue(new Error('offline'));
      open();

      await user.type(await screen.findByRole('textbox'), NOTE);
      expect(
        await screen.findByText(/не вдалося зберегти/i, {}, { timeout: 4000 }),
      ).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue(NOTE);
    });

    /**
     * The device copy earning its place. The server never received the text, so on the next
     * visit the local copy is newer than what comes back - it wins, and is sent at once.
     */
    it('brings the text back next time and sends it again', async () => {
      const user = userEvent.setup();
      saveLessonNote.mockRejectedValue(new Error('offline'));
      const view = open();

      await user.type(await screen.findByRole('textbox'), NOTE);
      await screen.findByText(/не вдалося зберегти/i, {}, { timeout: 4000 });
      view.unmount();

      saveLessonNote.mockImplementation((_id: string, text: string) =>
        Promise.resolve({ text, updated_at: '2026-04-30T09:15:00.000Z' }),
      );
      open();

      expect(await screen.findByRole('textbox')).toHaveValue(NOTE);
      expect(screen.getByText(/незбережені зміни з цього пристрою/i)).toBeInTheDocument();
      await waitFor(() => expect(saveLessonNote).toHaveBeenCalledWith('lesson-1', NOTE));
    });
  });

  /** A note saved on the server needs no local copy, and must not leave one lying about. */
  it('keeps nothing on the device once the server has it', async () => {
    const user = userEvent.setup();
    open();

    await user.type(await screen.findByRole('textbox'), NOTE);
    await waitFor(() => expect(saveLessonNote).toHaveBeenCalled(), { timeout: 4000 });
    await waitFor(() =>
      expect(window.localStorage.getItem('buero:draft:note:student-1:lesson-1')).toBeNull(),
    );
  });

  /** Two people on one browser profile must not read each other's notes. */
  it('does not show another student the local copy', async () => {
    const user = userEvent.setup();
    saveLessonNote.mockRejectedValue(new Error('offline'));
    const view = open('lesson-1', student('student-1'));
    await user.type(await screen.findByRole('textbox'), NOTE);
    await screen.findByText(/не вдалося зберегти/i, {}, { timeout: 4000 });
    view.unmount();

    open('lesson-1', student('student-2'));
    expect(await screen.findByRole('textbox')).toHaveValue('');
  });

  it('still shows the box when the lesson cannot be read', async () => {
    fetchLessonNote.mockRejectedValue(new Error('boom'));
    open();

    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });
});
