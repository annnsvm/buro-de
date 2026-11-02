import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * A module test taken part by part.
 *
 * The parts are the skills, every one of them is open from the start, and the order is the
 * student's: listening first because the room is quiet now, grammar last. Nothing here is
 * ever locked - the test is finished when every part is full, not when they have been walked
 * through in the author's order.
 */
const fetchQuizQuestions = vi.fn();
const fetchLastQuizAttempt = vi.fn();
const startQuizAttempt = vi.fn();
const saveQuizDraft = vi.fn();

vi.mock('@/api/quizApi', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  fetchQuizQuestions: (...a: unknown[]) => fetchQuizQuestions(...a),
  fetchLastQuizAttempt: (...a: unknown[]) => fetchLastQuizAttempt(...a),
  startQuizAttempt: (...a: unknown[]) => startQuizAttempt(...a),
  saveQuizDraft: (...a: unknown[]) => saveQuizDraft(...a),
}));

const { default: QuizPanel } = await import(
  '@/features/course-learning/QuizPanel/QuizPanel'
);

beforeAll(async () => {
  await i18nReady;
});

const question = (id: string, block: string, prompt: string) => ({
  id,
  type: 'single_choice' as const,
  prompt,
  points: 1,
  element_id: null,
  block,
  order_index: 0,
  options: [
    { id: 'a', text: `${id}-a` },
    { id: 'b', text: `${id}-b` },
  ],
});

const QUESTIONS = [
  question('g1', 'grammatik', 'Питання граматики один'),
  question('g2', 'grammatik', 'Питання граматики два'),
  question('l1', 'lesen', 'Питання з читання'),
  question('h1', 'horen', 'Питання з аудіювання'),
];

/** Reads the address the router is on, which is what one of these tests is about. */
const Address: React.FC = () => {
  const location = useLocation();
  return <span data-testid="address">{location.search}</span>;
};

const draw = (at = '/course/1') =>
  renderWithProviders(
    <>
      <QuizPanel
        courseMaterialId="test-1"
        courseId="course-1"
        moduleId="module-1"
        quizMaterialTitle="Тест модуля"
      />
      <Address />
    </>,
    { initialEntries: [at] },
  );

beforeEach(() => {
  fetchQuizQuestions.mockReset();
  fetchLastQuizAttempt.mockReset();
  startQuizAttempt.mockReset();
  saveQuizDraft.mockReset();

  fetchQuizQuestions.mockResolvedValue({
    mode: 'test',
    passing_score: 70,
    total_points: 4,
    passing_points: 3,
    elements: [],
    questions: QUESTIONS,
  });
  fetchLastQuizAttempt.mockResolvedValue(null);
  startQuizAttempt.mockResolvedValue({ id: 'attempt-1' });
  saveQuizDraft.mockResolvedValue(undefined);
});

describe('the front page of a module test', () => {
  it('lists every part as its own card', async () => {
    draw();

    expect(await screen.findByText('Grammatik')).toBeInTheDocument();
    expect(screen.getByText('Lesen')).toBeInTheDocument();
    expect(screen.getByText('Hören')).toBeInTheDocument();
  });

  it('says what each part is made of', async () => {
    draw();

    /** Grammatik is questions alone; Lesen is a text and its questions. */
    expect(await screen.findByText('2 питання')).toBeInTheDocument();
    expect(screen.getAllByText('1 питання').length).toBeGreaterThan(0);
  });

  it('shows the mark the test has to reach', async () => {
    draw();

    expect(await screen.findByText(/потрібно набрати 70%/)).toBeInTheDocument();
  });

  /** Nothing is marked until the test is handed in, so the bar counts answers. */
  it('counts answers given rather than points earned', async () => {
    draw();

    expect(await screen.findByText('Заповнено зараз')).toBeInTheDocument();
    expect(screen.getByText('0 / 4')).toBeInTheDocument();
    expect(screen.getByText('0 з 3 частин заповнено')).toBeInTheDocument();
  });

  /**
   * The mistake this replaces: progress was shown as a percentage beside the pass mark,
   * and the two read as one comparison - "62%" next to "pass mark 60%" told a student
   * with half the test empty that they had passed it.
   */
  it('never puts a percentage next to the pass mark', async () => {
    draw();
    const user = userEvent.setup();

    await screen.findByText('Grammatik');
    await user.click(screen.getAllByRole('button', { name: /Почати/ })[0]);
    await user.click(await screen.findByText('g1-b'));
    await user.click(screen.getAllByRole('button', { name: '← До тесту' })[0]);

    /** The only percentage anywhere is the one in the sentence about passing. */
    expect(await screen.findByText('1 / 4')).toBeInTheDocument();
    expect(screen.queryByText('25%')).not.toBeInTheDocument();
    expect(screen.queryByText(/^прохідний бал/)).not.toBeInTheDocument();
  });

  it('offers no question until a part is opened', async () => {
    draw();

    await screen.findByText('Grammatik');
    expect(screen.queryAllByText('Питання граматики один')).toHaveLength(0);
  });
});

describe('what the test is called', () => {
  /** The student was reading the same words three times before a single question. */
  it('says it once', async () => {
    draw();

    expect(await screen.findAllByText('Тест модуля')).toHaveLength(1);
  });

  it('uses the teacher’s own name for it', async () => {
    renderWithProviders(
      <QuizPanel
        courseMaterialId="test-1"
        courseId="course-1"
        moduleId="module-1"
        quizMaterialTitle="Підсумкова перевірка Dativ"
        moduleTitle="Module 2"
      />,
    );

    expect(
      await screen.findByRole('heading', { name: 'Підсумкова перевірка Dativ' }),
    ).toBeInTheDocument();
  });

  /** With no name of its own, it names the module - one test has to differ from another. */
  it('names the module when the teacher gave it no name', async () => {
    renderWithProviders(
      <QuizPanel
        courseMaterialId="test-1"
        courseId="course-1"
        moduleId="module-1"
        quizMaterialTitle=""
        moduleTitle="Module 2"
      />,
    );

    expect(
      await screen.findByRole('heading', { name: 'Фінальний тест: Module 2' }),
    ).toBeInTheDocument();
  });
});

describe('opening a part', () => {
  const openGrammatik = async () => {
    const user = userEvent.setup();
    await screen.findByText('Grammatik');
    const cards = screen.getAllByRole('button', { name: /Почати/ });
    await user.click(cards[0]);
    return user;
  };

  it('shows that part’s questions and no others', async () => {
    draw();
    await openGrammatik();

    expect(await screen.findAllByText('Питання граматики один')).not.toHaveLength(0);
    expect(screen.queryAllByText('Питання з читання')).toHaveLength(0);
  });

  it('numbers them from one', async () => {
    draw();
    await openGrammatik();

    expect(await screen.findByText('Частина 1')).toBeInTheDocument();
  });

  /** The way back is to the test, not out of the lesson. */
  it('offers the way back to the test', async () => {
    draw();
    const user = await openGrammatik();

    await user.click(await screen.findByRole('button', { name: '← До тесту' }));

    expect(await screen.findByText('Заповнено зараз')).toBeInTheDocument();
  });

  it('writes the part into the address bar', async () => {
    draw();
    await openGrammatik();

    await waitFor(() =>
      expect(screen.getByTestId('address')).toHaveTextContent('part=grammatik'),
    );
  });

  it('opens the part a link names', async () => {
    draw('/course/1?part=horen');

    expect(await screen.findAllByText('Питання з аудіювання')).not.toHaveLength(0);
  });
});

describe('a part that has been started', () => {
  it('reports how far through it is and offers to go on', async () => {
    draw();
    const user = userEvent.setup();

    await screen.findByText('Grammatik');
    await user.click(screen.getAllByRole('button', { name: /Почати/ })[0]);
    await user.click(await screen.findByText('g1-b'));
    await user.click(screen.getByRole('button', { name: '← До тесту' }));

    /** One of two answered: the part is under way, not filled in. */
    expect(await screen.findByText('Продовжити →')).toBeInTheDocument();
    expect(screen.getByText('0 з 3 частин заповнено')).toBeInTheDocument();
  });
});

describe('the end of a part', () => {
  const openGrammatik = async () => {
    const user = userEvent.setup();
    await screen.findByText('Grammatik');
    await user.click(screen.getAllByRole('button', { name: /Почати/ })[0]);
    return user;
  };

  /** There used to be nothing here: no mark, no button, no sign the answers were kept. */
  it('says how much of the part is left', async () => {
    draw();
    await openGrammatik();

    expect(await screen.findByText(/лишилось питань: 2/)).toBeInTheDocument();
  });

  it('says the answers are kept once the part is full', async () => {
    draw();
    const user = await openGrammatik();

    await user.click(await screen.findByText('g1-b'));
    await user.click(await screen.findByText('g2-b'));

    expect(
      await screen.findByText('Частину заповнено. Відповіді збережені.'),
    ).toBeInTheDocument();
  });

  it('offers the next part from the bottom', async () => {
    draw();
    await openGrammatik();

    expect(
      await screen.findByRole('button', { name: /Наступна частина/ }),
    ).toBeInTheDocument();
  });

  /** Forward only: the way back is at the top, and saying it twice is not two ways out. */
  it('does not repeat the way back', async () => {
    draw();
    await openGrammatik();

    await screen.findByText(/лишилось питань/);
    expect(screen.getAllByRole('button', { name: '← До тесту' })).toHaveLength(1);
  });
});

describe('finishing the test', () => {
  it('is held back until every part is filled in, and says why', async () => {
    draw();

    const finish = await screen.findByRole('button', { name: 'Завершити тест' });
    expect(finish).toBeDisabled();
    expect(
      screen.getByText(/Кнопка стане активною/),
    ).toBeInTheDocument();
  });

  it('becomes available once nothing is left unanswered', async () => {
    draw();
    const user = userEvent.setup();

    await screen.findByText('Grammatik');
    /** Each part in turn: the cards keep the author's order, whatever their labels say. */
    const PARTS: ReadonlyArray<readonly [number, readonly string[]]> = [
      [0, ['g1', 'g2']],
      [1, ['l1']],
      [2, ['h1']],
    ];
    for (const [at, ids] of PARTS) {
      const ways = screen.getAllByRole('button', { name: /Почати|Продовжити/ });
      await user.click(ways[at]);
      for (const id of ids) {
        await user.click(await screen.findByText(`${id}-b`));
      }
      await user.click(screen.getAllByRole('button', { name: '← До тесту' })[0]);
    }

    expect(screen.getByRole('button', { name: 'Завершити тест' })).toBeEnabled();
  });
});

describe('a test with no parts of its own', () => {
  /** Written before blocks existed: one long list, exactly as it always read. */
  it('is shown whole, with no front page', async () => {
    fetchQuizQuestions.mockResolvedValue({
      mode: 'test',
      passing_score: 70,
      total_points: 2,
      passing_points: 1,
      elements: [],
      questions: [
        question('g1', 'grammatik', 'Перше питання'),
        question('g2', 'grammatik', 'Друге питання'),
      ],
    });

    draw();

    expect(await screen.findAllByText('Перше питання')).not.toHaveLength(0);
    expect(screen.getAllByText('Друге питання')).not.toHaveLength(0);
    expect(screen.queryByText('Заповнено зараз')).not.toBeInTheDocument();
  });
});
