import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { QuizQuestionType } from '@/api/quizApi';

export type EditorOption = { id?: string; text: string };

/** A question as its author sees it — including the answer key a student never gets. */
export type EditorQuestion = {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  accepted_answers: string[];
  explanation: string | null;
  points: number;
  skills: string[];
  order_index: number;
  options: Array<{ id: string; text: string }>;
  tokens: string[];
};

export type SaveQuestionPayload = {
  type: QuizQuestionType;
  prompt: string;
  accepted_answers: string[];
  options?: EditorOption[];
  tokens?: string[];
  explanation?: string;
  points?: number;
};

export const fetchEditorQuestions = async (
  courseId: string,
  moduleId: string,
  materialId: string,
): Promise<EditorQuestion[]> => {
  const { data } = await apiInstance.get<EditorQuestion[]>(
    API_ENDPOINTS.courseMaterials.questions(courseId, moduleId, materialId),
  );
  return data;
};

export const createEditorQuestion = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  payload: SaveQuestionPayload,
): Promise<EditorQuestion> => {
  const { data } = await apiInstance.post<EditorQuestion>(
    API_ENDPOINTS.courseMaterials.questions(courseId, moduleId, materialId),
    payload,
  );
  return data;
};

export const updateEditorQuestion = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  questionId: string,
  payload: SaveQuestionPayload,
): Promise<EditorQuestion> => {
  const { data } = await apiInstance.patch<EditorQuestion>(
    API_ENDPOINTS.courseMaterials.question(courseId, moduleId, materialId, questionId),
    payload,
  );
  return data;
};

export const deleteEditorQuestion = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  questionId: string,
): Promise<void> => {
  await apiInstance.delete(
    API_ENDPOINTS.courseMaterials.question(courseId, moduleId, materialId, questionId),
  );
};
