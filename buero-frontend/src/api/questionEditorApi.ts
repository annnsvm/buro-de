import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { QuizQuestionType } from '@/api/quizApi';

export type EditorOption = { id?: string; text: string };

/** The four parts a practice is divided into; a quiz and a test have none. */
export type PracticeBlockName = 'grammatik' | 'lesen' | 'hoeren' | 'sprechen';

/** A text to read or a recording to listen to, as its author edits it. */
export type EditorElement = {
  id: string;
  block: PracticeBlockName;
  kind: 'text' | 'audio' | 'rec';
  title: string;
  body: string | null;
  audio_url: string | null;
  transcript: string | null;
  sample_answer: string | null;
  hints: string | null;
  order_index: number;
  /** How many questions are about this text. Nobody sees a text with none. */
  question_count: number;
};

export type SaveElementPayload = {
  block: PracticeBlockName;
  kind: EditorElement['kind'];
  title: string;
  body?: string;
  transcript?: string;
  sample_answer?: string;
  hints?: string;
};

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
  block: PracticeBlockName;
  /** The text this question is about; null in Grammatik and for a question on its own. */
  element_id: string | null;
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
  block?: PracticeBlockName;
  element_id?: string;
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

export const fetchEditorElements = async (
  courseId: string,
  moduleId: string,
  materialId: string,
): Promise<EditorElement[]> => {
  const { data } = await apiInstance.get<EditorElement[]>(
    API_ENDPOINTS.courseMaterials.elements(courseId, moduleId, materialId),
  );
  return data;
};

export const createEditorElement = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  payload: SaveElementPayload,
): Promise<EditorElement> => {
  const { data } = await apiInstance.post<EditorElement>(
    API_ENDPOINTS.courseMaterials.elements(courseId, moduleId, materialId),
    payload,
  );
  return data;
};

export const updateEditorElement = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  elementId: string,
  payload: SaveElementPayload,
): Promise<EditorElement> => {
  const { data } = await apiInstance.patch<EditorElement>(
    API_ENDPOINTS.courseMaterials.element(courseId, moduleId, materialId, elementId),
    payload,
  );
  return data;
};

export const deleteEditorElement = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  elementId: string,
): Promise<{ deleted: boolean; unbound_questions: number }> => {
  const { data } = await apiInstance.delete<{
    deleted: boolean;
    unbound_questions: number;
  }>(API_ENDPOINTS.courseMaterials.element(courseId, moduleId, materialId, elementId));
  return data;
};
