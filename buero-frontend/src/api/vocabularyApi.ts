import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type {
  NewVocabularyWord,
  VocabularyWord,
} from '@/types/features/vocabulary/Vocabulary.types';

/**
 * The word list belongs to the signed-in account; the server scopes every response
 * by the caller, so no course or user id has to be passed to read it.
 */
export const fetchMyVocabulary = async (search?: string): Promise<VocabularyWord[]> => {
  const { data } = await apiInstance.get<VocabularyWord[]>(API_ENDPOINTS.vocabulary.list, {
    ...(search ? { params: { search } } : {}),
  });
  return data;
};

export const createVocabularyWord = async (
  payload: NewVocabularyWord,
): Promise<VocabularyWord> => {
  const { data } = await apiInstance.post<VocabularyWord>(API_ENDPOINTS.vocabulary.create, {
    word: payload.word,
    translation: payload.translation,
    category: payload.category,
    ...(payload.notes ? { notes: payload.notes } : {}),
    ...(payload.courseId ? { course_id: payload.courseId } : {}),
  });
  return data;
};

export const deleteVocabularyWord = async (id: string): Promise<void> => {
  await apiInstance.delete(API_ENDPOINTS.vocabulary.delete(id));
};
