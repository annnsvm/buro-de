import type { CourseLevel } from '@/types/features/courseManagment/CourseLevel.types';

export type CourseDetailsSectionProps = {
  courseName: string;
  courseDescription: string;
  level: CourseLevel;
  /**
   * The highest level the course reaches, when it covers more than one. Empty means it
   * sits at `level` alone. The catalogue lists a course under every level in the range, so
   * an integration course running from A2 to B1 is found under both.
   */
  levelTo: CourseLevel;
  nameError?: string;
  descriptionError?: string;
  levelError?: string;
  disabled?: boolean;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeLevel: (value: CourseLevel) => void;
  onChangeLevelTo: (value: CourseLevel) => void;
};
