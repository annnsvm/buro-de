import React from 'react';
import { Input } from '@/components/ui';
import type { CourseTrialSectionProps } from '@/types/features/courseManagment/CourseTrialSection.types';

/**
 * How much of the course anyone who registers gets for nothing.
 *
 * It lives next to the price because it is the same decision seen from the other side, and it
 * shows the course's own module count beside the field for one reason: the number that is safe
 * depends entirely on how long the course is. Two free modules out of nine is a sample; two out
 * of two is the course given away, which is what a single figure shared by every course did to
 * the integration course.
 */
const CourseTrialSection: React.FC<CourseTrialSectionProps> = ({
  trialModuleCount,
  moduleCount,
  error,
  disabled,
  onChangeTrialModuleCount,
}) => {
  const asNumber = Number(trialModuleCount.trim());
  const valid = Number.isInteger(asNumber) && asNumber >= 0;
  /** Only worth saying when it is true, and only when the figure makes sense. */
  const givesEverything = valid && moduleCount > 0 && asNumber >= moduleCount;
  const givesNothing = valid && asNumber === 0;

  return (
    <section
      className="rounded-2xl bg-[var(--color-surface-background)] p-6"
      aria-label="Пробний доступ"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Безкоштовно в пробному доступі
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Модулів у цьому курсі: {moduleCount}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
          <Input
            id="trialModuleCount"
            type="number"
            min={0}
            max={99}
            step={1}
            value={trialModuleCount}
            onChange={(event) => onChangeTrialModuleCount(event.target.value)}
            disabled={disabled}
            aria-label="Скільки модулів відкриває пробний доступ"
            className="w-20"
          />
          <span className="whitespace-nowrap">перших модулів</span>
        </label>
      </div>

      <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
        Це перші модулі в тому порядку, в якому вони стоять у курсі - тож коли ви міняєте
        порядок модулів, межа безкоштовного їде разом із ними. Поставте 0, щоб курс
        продавався з першого модуля.
      </p>

      {givesEverything ? (
        <p className="mt-3 rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-xs text-[var(--color-text-primary)]">
          <span className="font-semibold">Увага:</span> зараз це весь курс. Кожен, хто просто
          зареєструвався, отримає його повністю й безкоштовно.
        </p>
      ) : givesNothing ? (
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Курс продається з першого модуля - безкоштовного ознайомлення не буде.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </section>
  );
};

export default CourseTrialSection;
