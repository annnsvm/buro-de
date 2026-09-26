import type { ButtonHTMLAttributes } from 'react';

export type CourseCardProps = {
  variant?: string;
  id: string;
  title: string;
  category: string;
  levelLabel: string;
  badge?: string;
  imageUrl: string;
  imagePriority?: boolean;
  description: string;
  price: string;
  lessonsCount: number;
  durationHours: number;
  avgVideoLessonMinutes?: number | null;
  tags: string[];
  rating?: number;
  /**
   * How far through the course the student is. Shown on the "my-learning" variant only,
   * where the question the card has to answer is "where did I get to", not "what is
   * this course". Absent for a course not started.
   */
  progress?: { percent: number; completed: number; total: number } | null;
  isAdded?: boolean;
  hasTrial?: boolean;
  isPublished?: boolean;
  onClick?: () => void;
  modulesCount?: number;
  onCourseDeleted?: () => void;
  onPublicationChange?: () => void;
  dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: (element: HTMLButtonElement | null) => void;
  };
  isDragging?: boolean;
};
