import React from 'react';
import { FormField, Input, Select } from '@/components/ui';
import { SectionTitle } from '@/components/layout';
import { COURSE_LEVEL_OPTIONS } from '@/features/course-managment/helpers/courseCreation.consts';
import type { CourseDetailsSectionProps } from '@/types/features/courseManagment/CourseDetailsSection.types';

const CourseDetailsSection: React.FC<CourseDetailsSectionProps> = ({
  courseName,
  courseDescription,
  level,
  levelTo,
  nameError,
  descriptionError,
  levelError,
  disabled,
  onChangeName,
  onChangeDescription,
  onChangeLevel,
  onChangeLevelTo,
}) => {
  return (
    <section aria-label="Картка курсу">
      <SectionTitle label="картка курсу" className="pb-4 text-[var(--color-accent-primary)]">
        КАРТКА КУРСУ
      </SectionTitle>
      <div className="flex flex-col gap-4">
        <FormField
          label="Назва курсу"
          name="courseName"
          error={nameError}
          className="space-y-4 rounded-2xl bg-[var(--color-surface-background)] p-6"
        >
          <Input
            id="courseName"
            placeholder="Назва, яку студент побачить у каталозі"
            value={courseName}
            onChange={(e) => onChangeName(e.target.value)}
            disabled={disabled}
          />
        </FormField>
        <FormField
          label="Опис курсу"
          name="courseDescription"
          error={descriptionError}
          className="space-y-4 rounded-2xl bg-[var(--color-surface-background)] p-6"
        >
          <textarea
            id="courseDescription"
            placeholder="Для кого цей курс і чого студент на ньому навчиться"
            value={courseDescription}
            onChange={(e) => onChangeDescription(e.target.value)}
            rows={3}
            disabled={disabled}
            className="w-full rounded-[12px] border border-[var(--color-border-default)] px-4 py-2 outline-none focus-visible:shadow-[var(--shadow-input-default)] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </FormField>
        <FormField
          label="Рівень курсу"
          name="courseLevel"
          error={levelError}
          className="space-y-4 rounded-2xl bg-[var(--color-surface-background)] p-6"
        >
          <Select
            ariaLabel="Рівень курсу"
            value={level}
            options={COURSE_LEVEL_OPTIONS}
            onChange={(nextValue) => onChangeLevel(nextValue)}
            placeholderValue=""
            disabled={disabled}
            triggerClassName="w-full"
          />
        </FormField>
        <FormField
          label="До рівня (необов’язково)"
          name="courseLevelTo"
          className="space-y-4 rounded-2xl bg-[var(--color-surface-background)] p-6"
        >
          <Select
            ariaLabel="До рівня"
            value={levelTo}
            options={COURSE_LEVEL_OPTIONS}
            onChange={(nextValue) => onChangeLevelTo(nextValue)}
            placeholderValue=""
            disabled={disabled}
            triggerClassName="w-full"
          />
          {/* Only set it for a course that really spans a range - leaving it empty is the
              ordinary case, and filling it in with the same level says nothing. */}
          <p className="text-xs text-[var(--color-text-secondary)]">
            Залишайте порожнім, якщо курс про один рівень. Курс від A2 до B1 видно в
            каталозі під обома.
          </p>
        </FormField>
      </div>
    </section>
  );
};

export default CourseDetailsSection;

