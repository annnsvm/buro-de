import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

/**
 * The material's `content` blob.
 *
 * Only a video still keeps anything here. A quiz's questions moved to their own table,
 * so writing `{ questions: [] }` for one would not be merely empty — it would overwrite
 * whatever the material had, which is exactly how renaming an imported quiz used to
 * destroy its questions.
 */
export const materialContentPayload = (
  payload: CreateCourseMaterialModalValues,
): Record<string, unknown> => {
  if (payload.type === 'video') {
    return {
      youtube_video_id: payload.youtubeVideoId,
      duration: payload.youtubeVideoDuration,
    };
  }

  return {};
};
