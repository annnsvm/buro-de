import type {
  CreateCourseMaterialModalValues,
  QuizMaterialMode,
  WritingTaskDraft,
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

/**
 * A new writing task starts with the shape of the module 4 letter — the length rule and six
 * criteria — because that is the form every one of these tasks takes. The teacher rewrites the
 * sentences; they do not have to work out how many boxes to make.
 */
export const emptyWritingTask = (): WritingTaskDraft => ({
  task: '',
  minSentences: 6,
  maxSentences: 8,
  criteria: ['', '', '', '', '', ''],
  modelAnswer: '',
});

const readWritingTask = (content: Record<string, unknown> | undefined): WritingTaskDraft => {
  const criteria = Array.isArray(content?.criteria)
    ? (content.criteria as unknown[]).map(String)
    : [];
  return {
    task: typeof content?.task === 'string' ? content.task : '',
    minSentences: typeof content?.minSentences === 'number' ? content.minSentences : 6,
    maxSentences: typeof content?.maxSentences === 'number' ? content.maxSentences : 8,
    criteria: criteria.length >= 2 ? criteria : emptyWritingTask().criteria,
    modelAnswer: typeof content?.modelAnswer === 'string' ? content.modelAnswer : '',
  };
};

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
      writing: emptyWritingTask(),
      parentMaterialId: '',
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
      writing: emptyWritingTask(),
      parentMaterialId: '',
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

  const isWriting = selectedMaterial.type === 'writing';
  const isPractice = selectedMaterial.type === 'practice';
  const writing = readWritingTask(selectedMaterial.content);

  const payload: CreateCourseMaterialModalValues = isWriting
    ? { type: 'writing', title: selectedMaterial.title ?? '', writing }
    : isPractice
      ? {
          type: 'practice',
          title: selectedMaterial.title ?? '',
          parentMaterialId: selectedMaterial.parentMaterialId ?? '',
        }
      : {
        type: 'quiz',
        title: selectedMaterial.title ?? '',
        quizMode,
        passingScore: quizMode === 'test' ? passingScore : null,
      };

  return {
    materialType: isWriting ? 'writing' : isPractice ? 'practice' : 'quiz',
    title: selectedMaterial.title ?? '',
    youtubeVideoId: '',
    youtubeVideoDuration: '',
    quizMode,
    passingScore,
    writing,
    parentMaterialId: selectedMaterial.parentMaterialId ?? '',
    createdMaterialId: selectedMaterial.id,
    savedSnapshot: JSON.stringify(payload),
  };
};
