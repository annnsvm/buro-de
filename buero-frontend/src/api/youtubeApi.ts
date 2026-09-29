import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/**
 * What YouTube knows about a video, fetched through our own server.
 *
 * `found: false` is an ordinary answer rather than a failure — the video may be private, or
 * YouTube may be unreachable. Either way the teacher types the title themselves, so nothing here
 * is allowed to block the form.
 */
export type YoutubePreview = {
  found: boolean;
  title: string | null;
  thumbnailUrl: string | null;
  authorName?: string | null;
};

export const fetchYoutubePreview = async (
  videoId: string,
): Promise<YoutubePreview> => {
  const { data } = await apiInstance.get<YoutubePreview>(
    API_ENDPOINTS.youtube.preview(videoId),
  );
  return data;
};
