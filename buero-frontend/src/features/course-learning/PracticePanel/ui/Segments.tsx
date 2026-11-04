import React from 'react';

/**
 * The row of small bars that says how far through something you are.
 *
 * One shape, four places: the progress of a block's questions, the lesson's required blocks on
 * the hub, the criteria a letter earned, and the score of an earlier attempt. They were drawn
 * the same way in the mockups, so they are one component - a second copy would drift the first
 * time one of them changed.
 */

type SegmentsProps = {
  filled: number;
  total: number;
  /** `sm` for the score beside an attempt, `md` in a header, `lg` across the hub's card. */
  size?: 'sm' | 'md' | 'lg';
  /** Read out instead of the bars, which carry no meaning to a screen reader. */
  label?: string;
};

const SIZES = {
  sm: 'h-1.5 w-2.5 rounded-sm',
  md: 'h-2 w-3.5 rounded-sm',
  lg: 'h-2.5 flex-1 rounded-full',
} as const;

const GAPS = { sm: 'gap-0.5', md: 'gap-[3px]', lg: 'gap-1.5' } as const;

const Segments: React.FC<SegmentsProps> = ({ filled, total, size = 'md', label }) => (
  <span
    className={['flex items-center', GAPS[size], size === 'lg' ? 'w-full' : ''].join(' ')}
    role="img"
    aria-label={label}
  >
    {Array.from({ length: Math.max(0, total) }, (_, index) => (
      <span
        key={index}
        className={[
          SIZES[size],
          index < filled
            ? 'bg-[var(--color-lesson-accent)]'
            : 'bg-[var(--color-dawn-pink-dark)]/45',
        ].join(' ')}
      />
    ))}
  </span>
);

export default Segments;
