import React from 'react';
import type { CourseTrackSectionProps } from '@/types/features/courseManagment/CourseTrackSection.types';

/**
 * Which half of the catalogue this course belongs to.
 *
 * It is here, as a switch of its own, because it is the one grouping a student ever sees -
 * the "Мова" and "Інтеграція" tabs in the catalogue and in "My learning" are this field and
 * nothing else. It used to be an `Integration` tag, and that failed twice over: the tag was
 * not among the ones the editor offered, so there was no way to make an integration course
 * at all; and the server matched the tag exactly while the page matched it lowercased, so a
 * course tagged "integration" landed in the integration section and went missing from the
 * server's filter at the same time.
 */
const CourseTrackSection: React.FC<CourseTrackSectionProps> = ({
  isIntegration,
  disabled,
  onChangeIsIntegration,
}) => (
  <section
    className="rounded-2xl bg-[var(--color-surface-background)] p-6"
    aria-label="Розділ каталогу"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          Розділ каталогу
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {isIntegration ? 'Інтеграція' : 'Мова'}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
        <input
          id="isIntegration"
          type="checkbox"
          checked={isIntegration}
          onChange={(event) => onChangeIsIntegration(event.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-[var(--color-border-default)]"
        />
        <span className="whitespace-nowrap">Це інтеграційний курс</span>
      </label>
    </div>

    <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
      Мовні курси студент проходить як один шлях, від рівня до рівня. Інтеграційні - це
      окремі путівники, кожен сам по собі. Від цього залежить, у якій вкладці каталогу
      курс покажеться, і більше ні від чого - теги на це не впливають.
    </p>
  </section>
);

export default CourseTrackSection;
