import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export type CourseStructureAsideProps = {
  modules: Modules[];
  courseId: string | null;
  courseTitle: string | null;
  onSelectCourse: () => void;
  onCreateModule: () => void;
};

export type CourseAsideActionButtonProps = {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  onAfterClick?: () => void;
  className?: string;
};

