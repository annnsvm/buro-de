import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * When the teacher's work becomes the student's.
 *
 * Importing fifty questions used to put them on a student's screen before the teacher had
 * read one of them back. They are now two separate moments, and the second is a button.
 *
 * Per block, because that is how a lesson gets written: Grammatik is finished and worth
 * showing while Hören is still half a transcript.
 */
const fetchEditorQuestions = vi.fn();
const fetchEditorElements = vi.fn();
const publishMaterial = vi.fn();

vi.mock('@/api/questionEditorApi', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  fetchEditorQuestions: (...a: unknown[]) => fetchEditorQuestions(...a),
  fetchEditorElements: (...a: unknown[]) => fetchEditorElements(...a),
  publishMaterial: (...a: unknown[]) => publishMaterial(...a),
}));

const { default: QuestionEditor } = await import(
  '@/features/course-managment/components/QuestionEditor/QuestionEditor'
);

beforeAll(async () => {
  await i18nReady;
});

const question = (id: string, block: string, published: boolean) => ({
  id,
  type: 'single_choice' as const,
  published,
  prompt: `Питання ${id}`,
  accepted_answers: ['a'],
  explanation: null,
  points: 1,
  skills: [],
  order_index: 0,
  block,
  element_id: null,
  options: [{ id: 'a', text: 'A' }],
  tokens: [],
});

const PRACTICE = ['grammatik', 'lesen', 'horen'] as const;

const draw = () =>
  renderWithProviders(
    <QuestionEditor
      courseId="course-1"
      moduleId="module-1"
      materialId="material-1"
      scoredByPoints={false}
      blocks={PRACTICE as never}
    />,
  );

beforeEach(() => {
  fetchEditorQuestions.mockReset();
  fetchEditorElements.mockReset().mockResolvedValue([]);
  publishMaterial.mockReset().mockResolvedValue({ questions: 2, elements: 0 });
});

describe('work a student cannot see yet', () => {
  it('counts it and says so', async () => {
    fetchEditorQuestions.mockResolvedValue([
      question('g1', 'grammatik', false),
      question('g2', 'grammatik', false),
      question('g3', 'grammatik', true),
    ]);

    draw();

    expect(await screen.findByText(/Чернетка: 2/)).toBeInTheDocument();
    expect(screen.getByText(/студенти цього ще не бачать/)).toBeInTheDocument();
  });

  it('marks which rows are waiting', async () => {
    fetchEditorQuestions.mockResolvedValue([
      question('g1', 'grammatik', false),
      question('g2', 'grammatik', true),
    ]);

    draw();

    expect(await screen.findAllByText('чернетка')).toHaveLength(1);
  });

  it('says nothing when everything is live', async () => {
    fetchEditorQuestions.mockResolvedValue([question('g1', 'grammatik', true)]);

    draw();

    await screen.findByText(/Питань у квізі/);
    expect(screen.queryByText(/Чернетка:/)).not.toBeInTheDocument();
  });
});

describe('publishing', () => {
  beforeEach(() => {
    fetchEditorQuestions.mockResolvedValue([
      question('g1', 'grammatik', false),
      question('l1', 'lesen', false),
    ]);
  });

  /**
   * The author's own example: finished Grammatik goes up while Lesen is still being
   * written. The button publishes what is on screen, not everything in the material.
   */
  it('publishes the block being worked on, and only that', async () => {
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /Опублікувати Grammatik/ }));

    expect(publishMaterial).toHaveBeenCalledWith(
      'course-1',
      'module-1',
      'material-1',
      'grammatik',
    );
  });

  it('names the block on the button', async () => {
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /Lesen/ }));

    expect(
      await screen.findByRole('button', { name: /Опублікувати Lesen/ }),
    ).toBeInTheDocument();
  });

  /** The count has to come back right, so the line disappears when the work is live. */
  it('re-reads the material afterwards', async () => {
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /Опублікувати Grammatik/ }));

    await waitFor(() => expect(fetchEditorQuestions).toHaveBeenCalledTimes(2));
  });

  /**
   * The server's own words where it gave any, and ours where it did not - the teacher has
   * to know the work is still hidden rather than assume it went up.
   */
  it('says so when the server refused', async () => {
    publishMaterial.mockRejectedValue({
      response: { data: { message: 'Матеріал не знайдено' } },
    });
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /Опублікувати Grammatik/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Матеріал не знайдено');
  });

  it('says so when nothing came back at all', async () => {
    publishMaterial.mockRejectedValue({});
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /Опублікувати Grammatik/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не вдалося опублікувати',
    );
  });

  /** And the work stays hidden: a failed publish must not look like a published one. */
  it('leaves the draft line standing when it failed', async () => {
    publishMaterial.mockRejectedValue({});
    draw();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /Опублікувати Grammatik/ }));

    await screen.findByRole('alert');
    expect(screen.getByText(/Чернетка:/)).toBeInTheDocument();
  });
});
