import React from 'react';

/**
 * One question, numbered down the left.
 *
 * The number is the author's position in the block, zero-padded the way the rest of the product
 * writes ordinals. It is decorative twice over - the question text stands on its own, and a
 * screen reader already counts list items - so it is hidden from the reading order rather than
 * announced as "zero one".
 */

type QuestionCardProps = {
  position: number;
  prompt: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  position,
  prompt,
  children,
  className,
}) => (
  <article
    className={[
      'grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 rounded-[22px] bg-[var(--color-surface-section)] p-[22px] sm:grid-cols-[56px_minmax(0,1fr)] sm:p-[26px]',
      className ?? '',
    ].join(' ')}
  >
    <span
      aria-hidden
      className="font-[family-name:var(--font-heading)] text-[1.6rem] leading-none font-bold tracking-[-0.03em] text-[var(--color-accent-primary)] tabular-nums sm:text-[1.75rem]"
    >
      {String(position).padStart(2, '0')}
    </span>

    <div className="min-w-0">
      <div className="text-[1.05rem] leading-[1.4] font-semibold text-[var(--color-text-primary)]">
        {prompt}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  </article>
);

export default QuestionCard;
