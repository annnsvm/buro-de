import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';

export type LearningLesson = {
  materialId?: string;
  materialType?: string;
  courseTitle: string;
  progressText: string;
  streak: string;
  progress: number;
  type: string;
  status: string;
  title: string;
  description: string;
  videoUrl: string;
  attachments?: MaterialAttachment[];
};

export type LearningPageProps = {
  lesson?: LearningLesson;
  courseId?: string;
  moduleId?: string;
  hasNextLesson?: boolean;
  onNextLesson?: () => void;
  isVideoLessonCompleted?: boolean;
  onMarkVideoComplete?: () => void | Promise<void>;
  isVideoCompletionSaving?: boolean;
  videoCompletionError?: string | null;
  fallbackMarkReadyAfterSeconds?: number | null;
  onAddWord?: () => void;
};
