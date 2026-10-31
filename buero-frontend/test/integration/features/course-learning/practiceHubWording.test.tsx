import { beforeAll, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import PracticeHub from '@/features/course-learning/PracticePanel/PracticeHub';
import type { PracticeBlockSummary, PracticeOverview } from '@/api/practiceApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What the hub says about how much is left, and why it counts fewer blocks than it lists.
 *
 * Speaking and writing are shown but never counted, so the figure and the sentence both speak
 * of three blocks while five cards sit underneath them. Saying "blocks" left that
 * contradiction to the student to work out; saying "required blocks" states it, and the note
 * below the list - wording that existed in the translations and was never rendered - explains
 * which two are not counted.
 */
beforeAll(async () => {
  await i18nReady;
});

const block = (
  name: PracticeBlockSummary['block'],
  done: boolean,
  optional = false,
): PracticeBlockSummary => ({
  block: name,
  total: optional ? 0 : 4,
  answered: done && !optional ? 4 : 0,
  correct: done && !optional ? 4 : 0,
  done,
  optional,
  task_count: optional ? 1 : 0,
  points: null,
});

const overview = (blocks: PracticeBlockSummary[]): PracticeOverview => ({
  material_id: 'practice-1',
  title: 'Praktische Übungen',
  module_title: 'Modul 2',
  lesson_title: '2.1',
  blocks,
  done_count: blocks.filter((entry) => !entry.optional && entry.done).length,
  total_count: blocks.filter((entry) => !entry.optional).length,
});

const FIVE_BLOCKS = [
  block('grammatik', true),
  block('lesen', false),
  block('horen', false),
  block('sprechen', false, true),
  block('schreiben', false, true),
];

describe('how the hub counts what is left', () => {
  const draw = (blocks: PracticeBlockSummary[]) =>
    renderWithProviders(
      <PracticeHub
        overview={overview(blocks)}
        onOpenBlock={() => {}}
        nextStepLabel="До практики"
      />,
    );

  /** Five cards on screen, two of which are not counted: the sentence has to say so. */
  it('calls the blocks it counts required', async () => {
    draw(FIVE_BLOCKS);
    expect(
      await screen.findByText(/Залишилося ще 2 обовʼязкові блоки практики/),
    ).toBeInTheDocument();
  });

  /** Ukrainian agrees the adjective and the noun with the number; one block is not "блоки". */
  it('agrees the wording with the number', async () => {
    draw([
      block('grammatik', true),
      block('lesen', true),
      block('horen', false),
      block('sprechen', false, true),
    ]);
    expect(
      await screen.findByText(/Лишився 1 обовʼязковий блок до повної практики/),
    ).toBeInTheDocument();
  });

  it('names which blocks are not counted', async () => {
    draw(FIVE_BLOCKS);
    expect(
      await screen.findByText(/Sprechen і Schreiben не впливають на завершення уроку/),
    ).toBeInTheDocument();
  });

  /** A practice with nothing optional must not be told about a rule it does not have. */
  it('says nothing about optional blocks when there are none', async () => {
    draw([block('grammatik', true), block('lesen', false), block('horen', false)]);
    await screen.findByText(/обовʼязкові блоки практики/);
    expect(
      screen.queryByText(/не впливають на завершення уроку/),
    ).not.toBeInTheDocument();
  });

  /** The figure counts the same blocks the sentence does. */
  it('reports the figure over the required total, not over every card', async () => {
    draw(FIVE_BLOCKS);
    expect(await screen.findByText('1')).toBeInTheDocument();
    expect(screen.getByText('/3')).toBeInTheDocument();
  });
});
