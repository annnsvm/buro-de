import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeBlockSummary, PracticeOverview } from '@/api/practiceApi';
import { encouragementFor, spellBlockCount } from './encouragement';

export type PracticeHubProps = {
  overview: PracticeOverview;
  onOpenBlock: (block: PracticeBlockSummary['block']) => void;
  /** Offered whatever the state, but only live once every block is done. */
  onMoveOn?: () => void;
  nextStepLabel: string;
};

/**
 * The hub a student picks a block from.
 *
 * The blocks are one card of rows rather than separate cards: they are parts of a single
 * sitting, and spacing them apart made them read as four unrelated tasks. The order is still
 * the student's - the numbers say how many there are, not which to do first.
 */
const PracticeHub: React.FC<PracticeHubProps> = ({
  overview,
  onOpenBlock,
  onMoveOn,
  nextStepLabel,
}) => {
  const { t, i18n } = useTranslation();

  const encouragement = encouragementFor(overview.total_count, overview.done_count);
  const allDone = overview.total_count > 0 && overview.done_count === overview.total_count;
  /**
   * Where this practice sits, said in two pieces rather than one run-on line.
   *
   * The module and the lesson are different kinds of fact, so they are told apart by weight
   * and colour and a wide gap - the way the landing page sets its labels - instead of being
   * strung together with a separator character.
   */
  const trail = [overview.module_title, overview.lesson_title].filter(Boolean);
  const hasOptional = overview.blocks.some((entry) => entry.optional);

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-7 px-4 py-10 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          {trail.length > 0 ? (
            <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              <span className="text-[var(--color-burnt-siena-dark)]">{trail[0]}</span>
              {trail[1] ? (
                <span className="text-[var(--color-text-secondary)]">{trail[1]}</span>
              ) : null}
            </p>
          ) : null}
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.75rem,3.4vw,2.35rem)] leading-[1.05] font-bold tracking-[-0.035em] text-[var(--color-text-primary)]">
            {overview.title || t('practice.title')}
          </h2>
          <p className="text-base text-[var(--color-text-secondary)]">{t('practice.subtitle')}</p>
        </div>

        {/**
         * How much is behind, as a figure to glance at rather than a sentence to read:
         * the big number carries it and the label underneath says what it counts.
         */}
        <p className="flex flex-col items-end">
          <span className="font-[family-name:var(--font-heading)] text-[2.75rem] leading-none font-bold tracking-[-0.05em] text-[var(--color-accent-primary)] tabular-nums">
            {overview.done_count}
            <span className="text-[var(--color-dawn-pink-dark)]">/{overview.total_count}</span>
          </span>
          <span className="mt-1.5 text-[0.7rem] font-bold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase">
            {t('practice.blocksLabel')}
          </span>
        </p>
      </header>

      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, overview.total_count)}, 1fr)` }}
        aria-hidden
      >
        {overview.blocks.map((entry) => (
          <span
            key={entry.block}
            className={[
              'h-1.5 rounded-full',
              entry.done ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-border-subtle)]',
            ].join(' ')}
          />
        ))}
      </div>

      <ul className="overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-neutral-white)]">
        {overview.blocks.map((entry, index) => (
          <li key={entry.block}>
            <BlockRow
              block={entry}
              position={index + 1}
              isFirst={index === 0}
              onOpen={() => onOpenBlock(entry.block)}
            />
          </li>
        ))}
      </ul>

      {/**
        * Why the figure counts fewer blocks than the list shows.
        *
        * The wording existed in the translations and was never put on screen, so a student
        * reading "two required blocks left" above five cards had nothing to reconcile the two
        * with. Shown only when there is actually an optional block, so a practice without one
        * is not told about a rule it does not have.
        */}
      {hasOptional ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t('practice.optionalNote')}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-6">
        <p
          className="max-w-[440px] text-base leading-relaxed font-medium text-[var(--color-text-primary)]"
          aria-live="polite"
        >
          {encouragement
            ? t(`practice.encouragement.${encouragement.key}`, {
                count: encouragement.count,
                /** Only the opening line uses it; the rest ignore the extra value. */
                blocks: spellBlockCount(encouragement.count, i18n.language),
              })
            : ''}
        </p>

        {/**
         * Always on screen so the student can see where the practice leads, but inert until it
         * is finished - a button that works only sometimes is clearer than one that appears
         * from nowhere at the end.
         */}
        {onMoveOn ? (
          <button
            type="button"
            onClick={onMoveOn}
            disabled={!allDone}
            className={[
              'rounded-full px-7 py-3.5 text-base font-semibold whitespace-nowrap transition',
              allDone
                ? 'bg-[var(--color-accent-primary)] text-[var(--color-neutral-white)] hover:opacity-90'
                : 'cursor-not-allowed bg-[var(--color-surface-section)] text-[var(--color-dawn-pink-dark)]',
            ].join(' ')}
          >
            {nextStepLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};

/** One block: its number or a tick, what is inside it, and where the student got to. */
const BlockRow: React.FC<{
  block: PracticeBlockSummary;
  position: number;
  isFirst: boolean;
  onOpen: () => void;
}> = ({ block, position, isFirst, onOpen }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        'grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-5 px-6 py-5 text-left transition',
        isFirst ? '' : 'border-t border-[var(--color-border-subtle)]',
        block.done
          ? 'bg-[var(--color-dawn-pink-lighter)]'
          : 'hover:bg-[var(--color-dawn-pink-light)]',
      ].join(' ')}
    >
      <span
        className={[
          'flex size-11 items-center justify-center rounded-full text-[15px] font-bold',
          block.done
            ? 'bg-[var(--color-accent-primary)] text-[var(--color-neutral-white)]'
            : 'bg-[var(--color-surface-section)] text-[var(--color-text-secondary)]',
        ].join(' ')}
        aria-hidden
      >
        {block.done ? '✓' : String(position).padStart(2, '0')}
      </span>

      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-x-3">
          <span className="text-[19px] font-semibold text-[var(--color-text-primary)]">
            {t(`practice.blocks.${block.block}.title`)}
          </span>
          {/**
           * Said on the block itself rather than only in a note below it: a student deciding
           * whether to record themselves decides here, not after reading the whole page.
           */}
          {block.optional ? (
            <span className="rounded-full bg-[var(--color-surface-section)] px-2.5 py-0.5 text-[0.65rem] font-bold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase">
              {t('practice.optional')}
            </span>
          ) : null}
        </span>
        {/* Described by what is actually in it, so the line stays true as the author adds. */}
        <span className="text-[15px] text-[var(--color-text-secondary)]">
          {t(`practice.blocks.${block.block}.summary`, {
            count: block.total || block.task_count,
          })}
        </span>
      </span>

      {block.done ? (
        /* The score as a figure with its label beneath, the way the header counts blocks. */
        <span className="flex flex-col items-end whitespace-nowrap">
          <span className="font-[family-name:var(--font-heading)] text-[1.35rem] leading-none font-bold tracking-[-0.03em] text-[var(--color-success-text)] tabular-nums">
            {/**
             * A letter is marked out of its criteria, not out of questions - of which that
             * block has none. Counting questions here would announce a finished letter as
             * 0 of 0.
             */}
            {block.points
              ? `${block.points.score}/${block.points.max}`
              : `${block.correct}/${block.total}`}
          </span>
          <span className="mt-1 text-[0.65rem] font-bold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase">
            {t('practice.blockDone')}
          </span>
        </span>
      ) : (
        <span className="rounded-full border-[1.5px] border-[var(--color-burnt-siena-lighter)] px-4 py-2 text-[15px] font-semibold whitespace-nowrap text-[var(--color-burnt-siena-dark)]">
          {t('practice.blockStart')}
        </span>
      )}
    </button>
  );
};

export default PracticeHub;
