/** Matches the VocabularyCategory enum on the server. */
type VocabularyCategory = 'vocabulary' | 'idiom' | 'phrase' | 'grammar' | 'other';

/** One entry of the signed-in student's own word list, as returned by the API. */
type VocabularyWord = {
  id: string;
  word: string;
  translation: string;
  category: VocabularyCategory;
  notes?: string | null;
  courseId?: string | null;
  createdAt: string;
};

type NewVocabularyWord = {
  word: string;
  translation: string;
  category: VocabularyCategory;
  notes?: string;
  courseId?: string;
};

export type { VocabularyCategory, VocabularyWord, NewVocabularyWord };
