import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeBlockId } from '@/api/practiceApi';
import { BLOCK_ART } from '../illustrations/BlockArt';
import Segments from './Segments';

/**
 * The top of every block screen: where you came from, what this is, and how far through it.
 *
 * The drawing belongs to the block rather than to the task, so it is chosen here from the block
 * id and never passed in - a screen cannot accidentally show the headphones above a reading
 * text. On a phone it shrinks and sits under the title, where it costs no reading width.
 */

type BlockHeaderProps = {
  block: PracticeBlockId;
  title: string;
  /**
   * Left out while the panel above still draws the way back, so a screen never shows two of
   * them. It moves in here once every block screen is built this way.
   */
  onBack?: () => void;
  /** Said beside the title, as its own badge: "за бажанням", "без оцінки". */
  badges?: string[];
  /** One sentence under the title, where the block has one. */
  intro?: string;
  /** Left out for a block that has no questions to count. */
  progress?: { answered: number; total: number };
};

const BlockHeader: React.FC<BlockHeaderProps> = ({
  block,
  title,
  onBack,
  badges = [],
  intro,
  progress,
}) => {
  const { t } = useTranslation();
  const Art = BLOCK_ART[block];

  return (
    <header className="pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
        >
          {t('practice.backToHub')}
        </button>
      ) : null}

      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {badges.length > 0 ? (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-xl bg-[var(--color-surface-section)] px-2.5 py-1 text-xs font-semibold tracking-[0.12em] text-[var(--color-burnt-siena-dark)] uppercase"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          <h1 className="font-[family-name:var(--font-heading)] text-[2.1rem] leading-tight font-bold tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-[2.5rem]">
            {title}
          </h1>

          {progress ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Segments
                filled={progress.answered}
                total={progress.total}
                label={t('quiz.answeredCount', {
                  answered: progress.answered,
                  total: progress.total,
                })}
              />
              <span className="text-sm text-[var(--color-text-secondary)]">
                {t('quiz.answeredCount', {
                  answered: progress.answered,
                  total: progress.total,
                })}
              </span>
            </div>
          ) : null}

          {intro ? (
            <p className="mt-3 max-w-prose text-[var(--color-text-primary)]">{intro}</p>
          ) : null}
        </div>

        {/* Decorative: it repeats the title and carries nothing a reader would miss. */}
        <Art size={190} className="hidden shrink-0 sm:block" />
      </div>

      <Art size={120} className="mx-auto mt-4 block sm:hidden" />
    </header>
  );
};

export default BlockHeader;
