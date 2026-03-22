import React from 'react';

const CourseEditorLoadingScreen: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-section)] px-4">
    <p className="text-center text-[var(--color-text-secondary)]">Loading course…</p>
  </div>
);

export default CourseEditorLoadingScreen;
