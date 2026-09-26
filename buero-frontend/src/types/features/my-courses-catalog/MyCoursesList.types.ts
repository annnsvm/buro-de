import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';

export type MyCoursesListProps = {
  courses: CourseInfoData[];
  /** How far through each course the student is, by course id. */
  progressByCourseId?: ReadonlyMap<
    string,
    { percent: number; completed: number; total: number }
  >;
  className?: string;
};
