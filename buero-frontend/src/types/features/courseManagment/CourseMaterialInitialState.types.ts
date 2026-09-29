import type {
  QuizMaterialMode,
  WritingTaskDraft,
} from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type { CourseMaterialType } from '@/types/features/courseManagment/CourseMaterialCreateTab.types';

export type CourseMaterialInitialState = {
  materialType: CourseMaterialType;
  title: string;
  youtubeVideoId: string;
  youtubeVideoDuration: string;
  quizMode: QuizMaterialMode;
  passingScore: number;
  writing: WritingTaskDraft;
  parentMaterialId: string;
  createdMaterialId: string | null;
  savedSnapshot: string | null;
};
