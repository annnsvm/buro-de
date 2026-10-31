import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';

import PracticeWritings from '@/features/course-managment/components/QuestionEditor/PracticeWritings';
import type { EditorElement } from '@/api/questionEditorApi';

/**
 * Where the author types a writing task.
 *
 * The form had one text field, labelled as the task, bound to the element's short name - which
 * the API caps at 300 characters. A real prompt is a paragraph: the situation, then what to
 * write. So saving was refused with "title must be shorter than or equal to 300 characters",
 * and there was no other field to put the task in. The task and its name are two fields now,
 * and only the task is required.
 */
const LONG_TASK =
  'Ви захворіли і не можете прийти на роботу. На 10:00 у вас була нарада з клієнтом, ' +
  'яку тепер треба скасувати або перенести. Напишіть листа керівникові: повідомте, що ви ' +
  'хворі, попросіть скасувати або перенести нараду, вибачтеся і подякуйте за розуміння. ' +
  '6–8 речень у тілі листа; Betreff, звертання та формула прощання не рахуються.';

const element = (overrides: Partial<EditorElement> = {}): EditorElement => ({
  id: 'w1',
  block: 'schreiben',
  kind: 'write',
  title: 'Лист керівникові',
  body: LONG_TASK,
  audio_url: null,
  audio_file_name: null,
  transcript: null,
  sample_answer: 'Sehr geehrte Frau Schmidt, ich bin heute krank.',
  hints: null,
  criteria: ['Перший критерій', 'Другий критерій'],
  min_sentences: 6,
  max_sentences: 8,
  order_index: 0,
  question_count: 0,
  ...overrides,
});

describe('the writing task editor', () => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const onDelete = vi.fn().mockResolvedValue(undefined);

  const draw = (elements: EditorElement[] = []) =>
    render(
      <PracticeWritings
        block="schreiben"
        elements={elements}
        saving={false}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

  beforeEach(() => {
    onSave.mockClear();
  });

  it('sends a task longer than the name limit as the task, not the name', async () => {
    draw();
    await userEvent.click(screen.getByRole('button', { name: 'Додати завдання' }));

    expect(LONG_TASK.length).toBeGreaterThan(300);
    await userEvent.click(screen.getByLabelText(/Завдання - про що писати/));
    await userEvent.paste(LONG_TASK);
    await userEvent.click(screen.getByLabelText(/Критерії оцінювання/));
    await userEvent.paste('Перший критерій\nДругий критерій');
    await userEvent.type(screen.getByLabelText(/від$/), '6');
    await userEvent.type(screen.getByLabelText(/^до$/), '8');
    await userEvent.click(screen.getByLabelText(/Зразок відповіді/));
    await userEvent.paste('Sehr geehrte Frau Schmidt, ich bin heute krank.');

    await userEvent.click(screen.getByRole('button', { name: 'Зберегти завдання' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const payload = onSave.mock.calls[0][1];
    expect(payload.body).toBe(LONG_TASK);
    /** Left blank on purpose: the server names it from the first sentence. */
    expect(payload.title).toBe('');
  });

  /** The task is what the student reads, so it is the one field that cannot be empty. */
  it('refuses to save with no task, whatever else is filled', async () => {
    draw();
    await userEvent.click(screen.getByRole('button', { name: 'Додати завдання' }));
    await userEvent.type(screen.getByLabelText(/Коротка назва/), 'Лист керівникові');

    expect(screen.getByText(/Напишіть завдання/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зберегти завдання' })).toBeDisabled();
  });

  /**
   * A task written before the two fields were split has its text in the name. Opening it to
   * edit must put that text in the task box - offering it in a 300-character name field is how
   * the author got stuck in the first place.
   */
  it('loads an older task, whose text is in the name, into the task box', async () => {
    draw([element({ body: null, title: LONG_TASK })]);
    await userEvent.click(
      screen.getByRole('button', { name: `Редагувати завдання ${LONG_TASK}` }),
    );

    expect(screen.getByLabelText(/Завдання - про що писати/)).toHaveValue(LONG_TASK);
    expect(screen.getByLabelText(/Коротка назва/)).toHaveValue('');
  });

  it('keeps the name and the task apart when both were saved', async () => {
    draw([element()]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Редагувати завдання Лист керівникові' }),
    );

    expect(screen.getByLabelText(/Завдання - про що писати/)).toHaveValue(LONG_TASK);
    expect(screen.getByLabelText(/Коротка назва/)).toHaveValue('Лист керівникові');
  });

  /** A letter with one criterion cannot be marked, and the form says so before the save. */
  it('says why a single criterion is not enough', async () => {
    draw();
    await userEvent.click(screen.getByRole('button', { name: 'Додати завдання' }));
    await userEvent.click(screen.getByLabelText(/Завдання - про що писати/));
    await userEvent.paste(LONG_TASK);
    await userEvent.click(screen.getByLabelText(/Критерії оцінювання/));
    await userEvent.paste('Єдиний критерій');

    expect(screen.getByText(/щонайменше два критерії/)).toBeInTheDocument();
  });

  /** Without a model answer the task breaks the moment the monthly budget runs out. */
  it('says why a model answer is needed', async () => {
    draw();
    await userEvent.click(screen.getByRole('button', { name: 'Додати завдання' }));
    await userEvent.click(screen.getByLabelText(/Завдання - про що писати/));
    await userEvent.paste(LONG_TASK);
    await userEvent.click(screen.getByLabelText(/Критерії оцінювання/));
    await userEvent.paste('Перший критерій\nДругий критерій');
    await userEvent.type(screen.getByLabelText(/від$/), '6');
    await userEvent.type(screen.getByLabelText(/^до$/), '8');

    expect(screen.getByText(/Потрібен зразок відповіді/)).toBeInTheDocument();
  });
});
