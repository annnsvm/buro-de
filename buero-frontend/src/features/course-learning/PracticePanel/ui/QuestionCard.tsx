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
  /** Shown above the prompt: a weight, a badge - whatever belongs to the question itself. */
  aside?: React.ReactNode;
  /**
   * What the card says about the answer once there is one. A question nobody has answered is
   * `neutral`; the other two carry the verdict in the surface rather than in a separate line.
   */
  tone?: 'neutral' | 'correct' | 'wrong';
  children?: React.ReactNode;
  className?: string;
};

const TONES = {
  neutral: 'bg-[var(--color-surface-section)]',
  correct: 'bg-[var(--color-success-soft)]',
  wrong: 'bg-[var(--color-error-soft)]',
} as const;

const NUMBER_TONES = {
  neutral: 'text-[var(--color-accent-primary)]',
  correct: 'text-[var(--color-success-text)]',
  wrong: 'text-[var(--color-error)]',
} as const;

const QuestionCard: React.FC<QuestionCardProps> = ({
  position,
  prompt,
  aside,
  tone = 'neutral',
  children,
  className,
}) => (
  <article
    className={[
      'grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 rounded-[22px] p-[22px] transition-colors sm:grid-cols-[56px_minmax(0,1fr)] sm:p-[26px]',
      TONES[tone],
      className ?? '',
    ].join(' ')}
  >
    <span
      aria-hidden
      className={[
        'font-[family-name:var(--font-heading)] text-[1.6rem] leading-none font-bold tracking-[-0.03em] tabular-nums sm:text-[1.75rem]',
        NUMBER_TONES[tone],
      ].join(' ')}
    >
      {String(position).padStart(2, '0')}
    </span>

    <div className="min-w-0">
      {aside ? <div className="mb-2">{aside}</div> : null}
      <div className="text-[1.05rem] leading-[1.4] font-semibold text-[var(--color-text-primary)]">
        {prompt}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  </article>
);

export default QuestionCard;
