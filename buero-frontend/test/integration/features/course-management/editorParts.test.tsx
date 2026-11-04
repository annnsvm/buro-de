import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * Which parts the teacher is offered, and for which material.
 *
 * It used to be one question - "is this a practice?" - so a module test showed no parts at
 * all. Its texts and recordings were never even fetched, which meant there was nowhere to
 * upload the mp3 a test's listening part is built on.
 */
const fetchEditorQuestions = vi.fn();
const fetchEditorElements = vi.fn();

vi.mock('@/api/questionEditorApi', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  fetchEditorQuestions: (...a: unknown[]) => fetchEditorQuestions(...a),
  fetchEditorElements: (...a: unknown[]) => fetchEditorElements(...a),
}));

const { default: QuestionEditor } = await import(
  '@/features/course-managment/components/QuestionEditor/QuestionEditor'
);

beforeAll(async () => {
  await i18nReady;
});

const PRACTICE = ['grammatik', 'lesen', 'horen', 'sprechen', 'schreiben'] as const;
const TEST = ['grammatik', 'lesen', 'horen'] as const;

const draw = (blocks: readonly string[]) =>
  renderWithProviders(
    <QuestionEditor
      courseId="course-1"
      moduleId="module-1"
      materialId="material-1"
      scoredByPoints={false}
      blocks={blocks as never}
    />,
  );

beforeEach(() => {
  fetchEditorQuestions.mockReset().mockResolvedValue([]);
  fetchEditorElements.mockReset().mockResolvedValue([]);
});

describe('a practice', () => {
  it('offers all five parts', async () => {
    draw(PRACTICE);

    expect(await screen.findByRole('button', { name: /Grammatik/ })).toBeInTheDocument();
    for (const name of ['Lesen', 'Hören', 'Sprechen', 'Schreiben']) {
      expect(screen.getByRole('button', { name: new RegExp(name) })).toBeInTheDocument();
    }
  });
});

describe('a module test', () => {
  it('offers the three it actually has', async () => {
    draw(TEST);

    expect(await screen.findByRole('button', { name: /Grammatik/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lesen/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hören/ })).toBeInTheDocument();
  });

  /** No letter and no spoken answer in a test, so no tab leading nowhere. */
  it('offers neither writing nor speaking', async () => {
    draw(TEST);

    await screen.findByRole('button', { name: /Grammatik/ });
    expect(screen.queryByRole('button', { name: /Sprechen/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Schreiben/ })).not.toBeInTheDocument();
  });

  /**
   * The blocker this replaces: with no parts, the texts and recordings were never asked
   * for, so the teacher had nowhere to upload the file her own CSV had named.
   */
  it('fetches the texts and recordings it is built on', async () => {
    draw(TEST);

    await screen.findByRole('button', { name: /Grammatik/ });
    expect(fetchEditorElements).toHaveBeenCalledWith(
      'course-1',
      'module-1',
      'material-1',
    );
  });
});

describe('a material with no parts', () => {
  it('shows one plain list and asks for no elements', async () => {
    draw([]);

    await screen.findByText(/Питань ще немає/);
    expect(screen.queryByRole('button', { name: /Grammatik/ })).not.toBeInTheDocument();
    expect(fetchEditorElements).not.toHaveBeenCalled();
  });
});
