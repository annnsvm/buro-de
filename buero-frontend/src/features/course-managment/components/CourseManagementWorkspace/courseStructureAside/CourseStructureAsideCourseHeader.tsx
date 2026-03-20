import { Line } from '@/components/ui';
import React from 'react';
import type { CourseStructureAsideCourseHeaderProps } from '@/types/features/courseManagment/CourseStructureAside.types';

const CourseStructureAsideCourseHeader: React.FC<CourseStructureAsideCourseHeaderProps> = ({
  courseTitle,
  onSelectCourse,
  onAfterClick,
}) => {
  const handleSelect = () => {
    onSelectCourse();
    onAfterClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect()}
      aria-label="Edit course"
      className="w-full text-left"
    >
      <div className="pb-2">
        <p className="text-xs font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase">
          Course
        </p>
        <h3 className="mt-1 text-[1.15rem] font-bold text-[var(--color-text-primary)]">
          {courseTitle?.trim() ? courseTitle.trim() : 'Untitled course'}
        </h3>
        <Line />
      </div>
    </button>
  );
};

export default CourseStructureAsideCourseHeader;
