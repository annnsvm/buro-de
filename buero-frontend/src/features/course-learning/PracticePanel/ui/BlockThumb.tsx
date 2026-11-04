import React from 'react';
import type { PracticeBlockId } from '@/api/practiceApi';
import { BLOCK_ART } from '../illustrations/BlockArt';

/**
 * The block's drawing, shrunk to sit at the left of its row on the hub.
 *
 * A finished block wears a tick in the corner. The tick is the only part that carries meaning,
 * and the row already says "done" in its score, so the whole thumbnail stays out of the reading
 * order rather than announcing a picture and a tick to someone who cannot see either.
 */

type BlockThumbProps = {
  block: PracticeBlockId;
  done: boolean;
};

const BlockThumb: React.FC<BlockThumbProps> = ({ block, done }) => {
  const Art = BLOCK_ART[block];

  return (
    <span
      aria-hidden
      className="relative flex size-[76px] shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-section)] sm:h-[76px] sm:w-[84px]"
    >
      <Art size={72} />
      {done ? (
        <span className="absolute -top-1.5 -right-1.5 flex size-[26px] items-center justify-center rounded-full border-2 border-[var(--color-neutral-white)] bg-[var(--color-lesson-accent)]">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4.5 4.5L19 7" />
          </svg>
        </span>
      ) : null}
    </span>
  );
};

export default BlockThumb;
