import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/**
 * A student's own notes on a lesson.
 *
 * Kept on the server rather than in the browser on purpose: a note is worth keeping for as long
 * as the course is, and has to be there when the lesson is opened again months later, on another
 * machine. Nothing stored per browser can promise that.
 */
export type LessonNote = {
  text: string;
  /** Null when there is no note yet, or when the student has just cleared it. */
  updated_at: string | null;
};

export const fetchLessonNote = async (materialId: string): Promise<LessonNote> => {
  const { data } = await apiInstance.get<LessonNote>(
    API_ENDPOINTS.lessonNotes.read(materialId),
  );
  return data;
};

/** Replaces the note. An empty text removes it. */
export const saveLessonNote = async (
  materialId: string,
  text: string,
): Promise<LessonNote> => {
  const { data } = await apiInstance.put<LessonNote>(
    API_ENDPOINTS.lessonNotes.save(materialId),
    { text },
  );
  return data;
};
