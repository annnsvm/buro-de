import React from 'react';
import { Icon, Input } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { CourseDurationSectionProps } from '@/types/features/courseManagment/CourseDurationSection.types';

/**
 * How long the course is, worked out but not imposed.
 *
 * The figure is normally the sum of every video in the course, kept up to date by the
 * editor so that nobody has to remember to change it. That is right nearly always, and
 * wrong where a sum cannot see the work: a course whose weight is in the writing tasks
 * rather than the watching, or one still being filmed, where the honest number is what the
 * author intends rather than what has been uploaded so far.
 *
 * So the sum is what is shown, and it can be taken over. While it is taken over the sum
 * stops writing - otherwise the next change to the course, or merely reopening it, would
 * put the arithmetic back without a word.
 */
const CourseDurationSection: React.FC<CourseDurationSectionProps> = ({
  durationMinutes,
  videoLessonsCount,
  manual,
  hours,
  onHoursChange,
  onManualChange,
  disabled = false,
  error,
}) => {
  const safeDurationMinutes = Number.isFinite(durationMinutes) ? durationMinutes : 0;
  const safeLessonsCount = Number.isFinite(videoLessonsCount) ? videoLessonsCount : 0;
  const durationHoursPart = Math.floor(safeDurationMinutes / 60);
  const durationMinutesPart = safeDurationMinutes % 60;

  /**
   * Taking it over starts from the figure on screen rather than from nothing: the author is
   * nearly always adjusting the sum, not replacing it.
   */
  const takeOver = () => {
    if (!hours.trim() && safeDurationMinutes > 0) {
      onHoursChange(String(Math.ceil(safeDurationMinutes / 60)));
    }
    onManualChange(true);
  };

  const tile = 'align-items-left rounded-2xl bg-[var(--color-surface-background)] p-6';
  const caption =
    'text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase';
  const link =
    'text-xs font-medium text-[var(--color-primary)] underline disabled:opacity-50';

  return (
    <section
      aria-label="Тривалість курсу та відеоуроки"
      className="align-items-left mt-6 grid grid-cols-2 gap-4"
    >
      <div className={tile}>
        <p className={caption}>Тривалість</p>

        {manual ? (
          <div className="flex items-center gap-3">
            <Icon
              name={ICON_NAMES.SCHEDULE}
              size={24}
              className="text-[var(--color-neutral-light)]"
            />
            <Input
              id="course-duration-hours"
              inputMode="numeric"
              value={hours}
              onChange={(event) => onHoursChange(event.target.value)}
              disabled={disabled}
              aria-label="Тривалість курсу в годинах"
              className="w-20 rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-3 py-1 text-lg font-bold text-[var(--color-text-primary)]"
            />
            <span className="text-lg font-bold text-[var(--color-text-primary)]">год</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Icon
              name={ICON_NAMES.SCHEDULE}
              size={24}
              className="text-[var(--color-neutral-light)]"
            />
            <p
              className="text-lg font-bold text-[var(--color-text-primary)]"
              data-testid="course-duration-computed"
            >
              {durationHoursPart} год {durationMinutesPart} хв
            </p>
          </div>
        )}

        {error ? <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p> : null}

        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {manual ? (
            <>
              Виставлено вручну.{' '}
              <button
                type="button"
                className={link}
                onClick={() => onManualChange(false)}
                disabled={disabled}
              >
                Рахувати автоматично
              </button>
            </>
          ) : (
            <>
              Рахується з відео уроків.{' '}
              <button
                type="button"
                className={link}
                onClick={takeOver}
                disabled={disabled}
              >
                Виставити вручну
              </button>
            </>
          )}
        </p>
      </div>

      <div className={tile}>
        <p className={caption}>Уроки</p>
        <div className="flex items-center gap-3">
          <Icon name={ICON_NAMES.BOOK} size={24} className="text-[var(--color-neutral-light)]" />
          <p className="text-lg font-bold text-[var(--color-text-primary)]">
            {safeLessonsCount}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CourseDurationSection;
