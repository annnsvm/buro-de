import React from 'react';
import type { CourseStructureAsideEmptyStateProps } from '@/types/features/courseManagment/CourseStructureAside.types';

const CourseStructureAsideEmptyState: React.FC<CourseStructureAsideEmptyStateProps> = ({
  hasCourse,
}) => (
  <div className="mt-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-section)] p-4">
    <p className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
      {hasCourse ? 'Модулів ще немає' : 'Тут поки нічого немає'}
    </p>
    <p className="text-xs text-[var(--color-text-secondary)]">
      {hasCourse
        ? 'Створіть перший модуль - з нього почнеться структура курсу.'
        : 'Спершу створіть курс, а потім додавайте модулі й уроки.'}
    </p>
  </div>
);

export default CourseStructureAsideEmptyState;
