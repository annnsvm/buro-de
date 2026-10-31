import { apiInstance } from '@/api/apiInstance';
import { stripJsonContentType } from '@/api/multipart';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { QuizQuestionType } from '@/api/quizApi';

export type EditorOption = { id?: string; text: string };

/** The four parts a practice is divided into; a quiz and a test have none. */
export type PracticeBlockName =
  | 'grammatik'
  | 'lesen'
  | 'horen'
  | 'sprechen'
  | 'schreiben';

/** A text to read or a recording to listen to, as its author edits it. */
export type EditorElement = {
  id: string;
  block: PracticeBlockName;
  kind: 'text' | 'audio' | 'rec' | 'write';
  title: string;
  body: string | null;
  audio_url: string | null;
  /** The mp3 the imported row asked for, before anyone uploaded it. */
  audio_file_name: string | null;
  transcript: string | null;
  sample_answer: string | null;
  hints: string | null;
  /**
   * The rubric a letter is marked against, one criterion each, in the author's order. The
   * student reads these before writing, the check judges by them, and the result quotes them
   * back - so a letter can never lose a point against a rule nobody was shown.
   */
  criteria: string[];
  /** How long the body of the letter must be. Counted, never judged. */
  min_sentences: number | null;
  max_sentences: number | null;
  order_index: number;
  /** How many questions are about this text. Nobody sees a text with none. */
  question_count: number;
};

/** Maximum size the server will take, repeated here so the refusal comes before the upload. */
export const PRACTICE_AUDIO_MAX_BYTES = 15 * 1024 * 1024;

export type SaveElementPayload = {
  block: PracticeBlockName;
  kind: EditorElement['kind'];
  title: string;
  body?: string;
  transcript?: string;
  sample_answer?: string;
  hints?: string;
  criteria?: string[];
  min_sentences?: number;
  max_sentences?: number;
};

/** A question as its author sees it - including the answer key a student never gets. */
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

/** Replaces the recording behind a listening element. The old file stays in storage. */
export const uploadElementAudio = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  elementId: string,
  file: File,
): Promise<EditorElement> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiInstance.post<EditorElement>(
    `${API_ENDPOINTS.courseMaterials.element(courseId, moduleId, materialId, elementId)}/audio`,
    form,
    { transformRequest: stripJsonContentType },
  );
  return data;
};

export type AudioBatchResult = {
  uploaded: number;
  matched: string[];
  /** Files whose name matched no recording - usually a typo in one of the two names. */
  unmatched: string[];
  /** Recordings still without a file. */
  still_missing: string[];
};

/** Uploads a whole block's recordings at once, matched to elements by file name. */
export const uploadElementAudioBatch = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  files: File[],
): Promise<AudioBatchResult> => {
  const form = new FormData();
  files.forEach((file) => form.append('files', file));
  const { data } = await apiInstance.post<AudioBatchResult>(
    `${API_ENDPOINTS.courseMaterials.elements(courseId, moduleId, materialId)}/audio-batch`,
    form,
    { transformRequest: stripJsonContentType },
  );
  return data;
};
