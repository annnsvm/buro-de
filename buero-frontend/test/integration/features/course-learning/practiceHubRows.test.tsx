import { beforeAll, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import PracticeHub from '@/features/course-learning/PracticePanel/PracticeHub';
import type { PracticeBlockSummary, PracticeOverview } from '@/api/practiceApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What the end of a block's row reports, now that the three kinds of block are told apart.
 *
 * They are marked in three different ways - a quiz out of its questions, a letter out of the
 * author's criteria, a recording not at all - and one shape cannot say all three. The speaking
 * block is the one that used to come out wrong: counting its questions announced a finished
 * task as "0 of 0".
 */
beforeAll(async () => {
  await i18nReady;
});

const block = (
  name: PracticeBlockSummary['block'],
  extra: Partial<PracticeBlockSummary> = {},
): PracticeBlockSummary => ({
  block: name,
  total: 8,
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
  title: '2.1 — Кому цей подарунок? (Dativ: артиклі)',
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
      nextStepLabel="Наступний урок"
    />,
  );

describe('what a finished block reports', () => {
  /**
   * Speaking has no score and none is invented. Before, the row counted its questions - of
   * which it has none - and told a student who had recorded their answer that they had 0 of 0.
   */
  it('says a speaking task was recorded instead of scoring it', async () => {
    draw([block('sprechen', { optional: true, total: 0, done: true })]);

    expect(await screen.findByText('Записано')).toBeInTheDocument();
    expect(screen.queryByText('0/0')).not.toBeInTheDocument();
  });

  /** A letter is marked out of the author's criteria, so the label is points, not answers. */
  it('reports a letter out of its criteria', async () => {
    draw([
      block('schreiben', {
        optional: true,
        total: 0,
        done: true,
        points: { score: 7, max: 7 },
      }),
    ]);

    expect(await screen.findByText('7/7')).toBeInTheDocument();
    expect(screen.getByText('балів')).toBeInTheDocument();
  });

  it('reports a quiz out of its questions', async () => {
    draw([block('grammatik', { done: true, correct: 1, total: 8 })]);

    expect(await screen.findByText('1/8')).toBeInTheDocument();
    expect(screen.getByText('правильних')).toBeInTheDocument();
  });

  it('offers to start a block that has not been done', async () => {
    draw([block('lesen')]);

    expect(await screen.findByText('Почати →')).toBeInTheDocument();
  });
});

describe('how the hub groups the blocks', () => {
  const FIVE = [
    block('grammatik', { done: true, correct: 1 }),
    block('lesen'),
    block('horen'),
    block('sprechen', { optional: true, total: 0 }),
    block('schreiben', { optional: true, total: 0 }),
  ];

  it('heads the two groups separately', async () => {
    draw(FIVE);

    expect(await screen.findByText('Обовʼязкові')).toBeInTheDocument();
    expect(screen.getByText('За бажанням')).toBeInTheDocument();
  });

  /** Nothing optional means no second heading and no rule to explain. */
  it('shows no optional group when there is none', async () => {
    draw([block('grammatik'), block('lesen')]);

    await screen.findByText('Обовʼязкові');
    expect(screen.queryByText('За бажанням')).not.toBeInTheDocument();
  });

  /**
   * The title is the author's, including the grammar point she puts in brackets. The bracket
   * is set back a step in colour rather than cut, so nothing she wrote is lost.
   */
  it('keeps the whole of the author’s title', async () => {
    draw(FIVE);

    const heading = await screen.findByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('2.1 — Кому цей подарунок?');
    expect(heading).toHaveTextContent('(Dativ: артиклі)');
  });
});
