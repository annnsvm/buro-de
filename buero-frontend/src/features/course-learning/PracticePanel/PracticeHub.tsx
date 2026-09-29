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
 * the student's — the numbers say how many there are, not which to do first.
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
  const eyebrow = [overview.module_title, overview.lesson_title].filter(Boolean).join(' · ');

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-7 px-4 py-10 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          {eyebrow ? (
            <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-secondary)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-[28px] leading-tight font-bold tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-[34px]">
            {overview.title || t('practice.title')}
          </h2>
          <p className="text-base text-[var(--color-text-secondary)]">
            {t('practice.subtitle')}
          </p>
        </div>

        {/* How much of the practice is behind, at a glance rather than by counting cards. */}
        <p className="flex items-baseline gap-1.5">
          <span className="text-[40px] leading-none font-bold text-[var(--color-accent-primary)] tabular-nums">
            {overview.done_count}
          </span>
          <span className="text-lg text-[var(--color-text-secondary)]">
            {t('practice.ofBlocks', { count: overview.total_count })}
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
              entry.done
                ? 'bg-[var(--color-accent-primary)]'
                : 'bg-[var(--color-border-subtle)]',
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
         * is finished — a button that works only sometimes is clearer than one that appears
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
        <span className="text-[19px] font-semibold text-[var(--color-text-primary)]">
          {t(`practice.blocks.${block.block}.title`)}
        </span>
        {/* Described by what is actually in it, so the line stays true as the author adds. */}
        <span className="text-[15px] text-[var(--color-text-secondary)]">
          {t(`practice.blocks.${block.block}.summary`, { count: block.total })}
        </span>
      </span>

      {block.done ? (
        <span className="text-[15px] font-semibold whitespace-nowrap text-[var(--color-success-text)]">
          {t('practice.blockDone', { correct: block.correct, total: block.total })}
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
