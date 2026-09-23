import type {
  CreateCourseMaterialModalValues,
  QuizMaterialMode,
} from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type { CourseMaterialInitialState } from '@/types/features/courseManagment/CourseMaterialInitialState.types';
import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

export const createLocalId = (prefix: string) =>
  `${prefix}_${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

/**
 * What a module test needs by default: 60% is the threshold the A2.1 tests are written
 * to — 15 points of 25. It is only a starting value; the author sets it per test.
 */
export const DEFAULT_PASSING_SCORE = 60;

export const getInitialMaterialState = (
  selectedMaterial: ModuleMaterialType | null,
): CourseMaterialInitialState => {
  if (!selectedMaterial) {
    return {
      materialType: 'video',
      title: '',
      youtubeVideoId: '',
      youtubeVideoDuration: '',
      quizMode: 'practice',
      passingScore: DEFAULT_PASSING_SCORE,
      createdMaterialId: null,
      savedSnapshot: null,
    };
  }

  if (selectedMaterial.type === 'video') {
    const youtubeId =
      typeof selectedMaterial.content?.youtube_video_id === 'string'
        ? selectedMaterial.content.youtube_video_id
        : '';
    const duration =
      typeof selectedMaterial.content?.duration === 'string' ? selectedMaterial.content.duration : '';
    const payload: CreateCourseMaterialModalValues = {
      type: 'video',
      title: selectedMaterial.title ?? '',
      youtubeVideoId: youtubeId,
      youtubeVideoDuration: duration,
    };

    return {
      materialType: 'video',
      title: selectedMaterial.title ?? '',
      youtubeVideoId: youtubeId,
      youtubeVideoDuration: duration,
      quizMode: 'practice',
      passingScore: DEFAULT_PASSING_SCORE,
      createdMaterialId: selectedMaterial.id,
      savedSnapshot: JSON.stringify(payload),
    };
  }

  /**
   * A quiz's questions are not read here any more. They live in their own table and are
   * edited by the question editor; this form only carries what belongs to the material
   * itself. Rebuilding questions from the material's JSON is what once wiped an
   * imported quiz on a rename, because that JSON was empty.
   */
  const quizMode: QuizMaterialMode = selectedMaterial.quizMode === 'test' ? 'test' : 'practice';
  const passingScore =
    typeof selectedMaterial.passingScore === 'number'
      ? selectedMaterial.passingScore
      : DEFAULT_PASSING_SCORE;

  const payload: CreateCourseMaterialModalValues = {
    type: 'quiz',
    title: selectedMaterial.title ?? '',
    quizMode,
    passingScore: quizMode === 'test' ? passingScore : null,
  };

  return {
    materialType: 'quiz',
    title: selectedMaterial.title ?? '',
    youtubeVideoId: '',
    youtubeVideoDuration: '',
    quizMode,
    passingScore,
    createdMaterialId: selectedMaterial.id,
    savedSnapshot: JSON.stringify(payload),
  };
};
