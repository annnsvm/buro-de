import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type CatalogPathStepProps = {
  /** 1-based position along the route. */
  step: number;
  levelLabel: string;
  /** Marks the step the chooser pointed at, so the eye lands on it. */
  isRecommended?: boolean;
  /** Continues the line across the gap into the next step. */
  connected?: boolean;
};

/**
 * The step above a language course, turning the grid into a route.
 *
 * The language courses are one path taken in order — A1, then A2.1, then A2.2 — and a flat
 * grid of equal cards hides that. The dot and the line say "these follow one another",
 * which is the single most useful thing a visitor can learn from the page: not which
 * courses exist, but in what order to take them.
 */
const CatalogPathStep: FC<CatalogPathStepProps> = ({
  step,
  levelLabel,
  isRecommended = false,
  connected = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2.5" aria-hidden>
      <div
        className={[
          'size-3 shrink-0 rounded-full border-2',
          isRecommended
            ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]'
            : 'border-[var(--color-neutral-darkest)] bg-[var(--color-neutral-white)]',
        ].join(' ')}
      />
      <span className="shrink-0 text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-text-primary)]">
        {t('courses.pathStep', { step, level: levelLabel })}
      </span>
      <div
        className={[
          'h-px min-w-4 flex-1 bg-[var(--color-border-default)]',
          connected ? 'sm:-mr-8' : '',
        ].join(' ')}
      />
    </div>
  );
};

export default CatalogPathStep;
