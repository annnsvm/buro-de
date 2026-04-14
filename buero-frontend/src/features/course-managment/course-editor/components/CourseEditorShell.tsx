import React from 'react';
import { NavLink } from 'react-router-dom';

import CourseWorkspaceHeader from '@/components/layout/Header/CourseWorkspaceHeader';
import { ROUTES } from '@/helpers/routes';
import type { CourseEditorShellProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

const CourseEditorShell: React.FC<CourseEditorShellProps> = ({
  aside,
  children,
  onRequestOpenCourseStructureMobile,
}) => (
  <div className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]">
    {aside}
    <div className="min-w-0 flex-1 overflow-y-auto">
      <CourseWorkspaceHeader
        desktopStart={
          <NavLink
            to={ROUTES.COURSES}
            className="shrink-0 text-[1.25rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
          >
            All courses
          </NavLink>
        }
        renderMobileNav={({ className }) => (
          <nav className={className} aria-label="Course editor navigation">
            <NavLink
              to={ROUTES.COURSES}
              className={({ isActive }) =>
                [
                  'text-lg font-medium transition-colors',
                  isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-white/95 hover:text-[var(--color-primary)]',
                ].join(' ')
              }
            >
              All courses
            </NavLink>
          </nav>
        )}
        onOpenCourseStructure={onRequestOpenCourseStructureMobile}
      />
      {children}
    </div>
  </div>
);

export default CourseEditorShell;
