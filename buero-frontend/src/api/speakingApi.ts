import { apiInstance } from '@/api/apiInstance';
import { stripJsonContentType } from '@/api/multipart';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export type SpeakingRecording = {
  audio_url: string;
  duration_seconds: number | null;
  recorded_at: string;
};

/**
 * One speaking task.
 *
 * `sample_answer` and `hints` arrive empty until there is a recording. That is the server
 * holding them back, not an omission: reading a full answer before speaking turns the task
 * into a copying exercise, and finding the words yourself is what it is for.
 */
export type SpeakingTask = {
  element_id: string;
  task: string;
  answer_open: boolean;
  sample_answer: string | null;
  hints: string[];
  recording: SpeakingRecording | null;
};

export const fetchSpeakingTasks = async (
  materialId: string,
): Promise<{ tasks: SpeakingTask[] }> => {
  const { data } = await apiInstance.get<{ tasks: SpeakingTask[] }>(
    API_ENDPOINTS.practice.speaking(materialId),
  );
  return data;
};

/**
 * Sends the recording. One per task: a new one replaces the last.
 *
 * `stripJsonContentType` is what lets this work at all - the shared client sets
 * `Content-Type: application/json` on every request, which destroys the multipart boundary
 * the browser has to write.
 */
export const uploadSpeakingRecording = async (
  elementId: string,
  recording: Blob,
  durationSeconds: number,
): Promise<SpeakingTask> => {
  const form = new FormData();
  /** A name with an extension, so the server and the storage both see what this is. */
  form.append('file', recording, 'recording.webm');
  form.append('duration_seconds', String(Math.round(durationSeconds)));

  const { data } = await apiInstance.post<SpeakingTask>(
    API_ENDPOINTS.practice.speakingRecording(elementId),
    form,
    { transformRequest: stripJsonContentType },
  );
  return data;
};
