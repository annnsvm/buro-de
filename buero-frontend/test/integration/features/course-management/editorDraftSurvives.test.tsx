import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * A task the teacher is part-way through writing is not thrown away by a click.
 *
 * Reported from the authoring side: a writing task was being typed in by hand, something was
 * switched, and on coming back everything written up to that point was gone. A rubric runs to
 * several paragraphs, so this was real work - and nothing warned that a click would cost it.
 */

const fetchEditorQuestions = vi.fn();
const fetchEditorElements = vi.fn();

vi.mock('@/api/questionEditorApi', () => ({
  fetchEditorQuestions: (...a: unknown[]) => fetchEditorQuestions(...a),
  fetchEditorElements: (...a: unknown[]) => fetchEditorElements(...a),
  createEditorElement: vi.fn(),
  createEditorQuestion: vi.fn(),
  deleteEditorElement: vi.fn(),
  deleteEditorQuestion: vi.fn(),
  updateEditorElement: vi.fn(),
  updateEditorQuestion: vi.fn(),
  uploadElementAudio: vi.fn(),
  uploadElementAudioBatch: vi.fn(),
  PRACTICE_AUDIO_MAX_BYTES: 15 * 1024 * 1024,
}));

const { default: QuestionEditor } = await import(
  '@/features/course-managment/components/QuestionEditor/QuestionEditor'
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

const TASK_TEXT =
  'Ви захворіли. На 10:00 у вас була нарада, яку тепер треба скасувати або перенести.';
const RUBRIC = 'У тілі листа 6-8 речень\nЄ речення з weil, побудоване правильно';

beforeAll(async () => {
  await i18nReady;
});

const editor = () =>
  renderWithProviders(
    <QuestionEditor
      courseId="c1"
      moduleId="m1"
      materialId="mat1"
      scoredByPoints={false}
      hasBlocks
    />,
  );

describe('a writing task being typed in by hand', () => {
  beforeEach(() => {
    installStorage();
    fetchEditorQuestions.mockReset();
    fetchEditorElements.mockReset();
    fetchEditorQuestions.mockResolvedValue([]);
    fetchEditorElements.mockResolvedValue([]);
  });

  const openSchreiben = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(await screen.findByRole('button', { name: /schreiben/i }));
    await user.click(screen.getByRole('button', { name: 'Додати завдання' }));
  };

  it('survives switching to another block and back', async () => {
    const user = userEvent.setup();
    editor();
    await openSchreiben(user);

    await user.type(screen.getByRole('textbox', { name: /про що писати/i }), TASK_TEXT);
    await user.type(screen.getByRole('textbox', { name: /по одному в рядку/i }), RUBRIC);

    /** The click that used to cost the lot. */
    await user.click(screen.getByRole('button', { name: /grammatik/i }));
    await waitFor(() =>
      expect(screen.queryByRole('textbox', { name: /по одному в рядку/i })).toBeNull(),
    );

    await user.click(screen.getByRole('button', { name: /schreiben/i }));
    expect(await screen.findByRole('textbox', { name: /про що писати/i })).toHaveValue(TASK_TEXT);
    expect(screen.getByRole('textbox', { name: /по одному в рядку/i })).toHaveValue(RUBRIC);
  });

  it('survives the whole editor being closed and reopened', async () => {
    const user = userEvent.setup();
    const first = editor();
    await openSchreiben(user);
    await user.type(screen.getByRole('textbox', { name: /про що писати/i }), TASK_TEXT);

    first.unmount();
    editor();

    await user.click(await screen.findByRole('button', { name: /schreiben/i }));
    expect(screen.getByRole('textbox', { name: /про що писати/i })).toHaveValue(TASK_TEXT);
  });

  /** Cancelling is an explicit discard, and must actually discard. */
  it('is gone for good once the author cancels it', async () => {
    const user = userEvent.setup();
    const first = editor();
    await openSchreiben(user);
    await user.type(screen.getByRole('textbox', { name: /про що писати/i }), TASK_TEXT);

    await user.click(screen.getByRole('button', { name: 'Скасувати' }));
    first.unmount();
    editor();

    await user.click(await screen.findByRole('button', { name: /schreiben/i }));
    expect(screen.queryByRole('textbox', { name: /про що писати/i })).toBeNull();
  });

  /** Each block keeps its own, so Sprechen does not inherit the letter's rubric. */
  it('does not leak into another block', async () => {
    const user = userEvent.setup();
    editor();
    await openSchreiben(user);
    await user.type(screen.getByRole('textbox', { name: /про що писати/i }), TASK_TEXT);

    await user.click(screen.getByRole('button', { name: /sprechen/i }));
    await user.click(screen.getByRole('button', { name: 'Додати завдання' }));
    const boxes = screen.getAllByRole('textbox');
    boxes.forEach((box) => expect(box).toHaveValue(''));
  });
});
