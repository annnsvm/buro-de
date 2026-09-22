import type { TFunction } from 'i18next';
import type { VocabularyCategory } from '@/types/features/vocabulary/Vocabulary.types';

const CATEGORY_KEY: Record<VocabularyCategory, string> = {
  vocabulary: 'vocabulary.categories.vocabulary',
  idiom: 'vocabulary.categories.idiom',
  phrase: 'vocabulary.categories.phrase',
  grammar: 'vocabulary.categories.grammar',
  other: 'vocabulary.categories.other',
};

export const translateVocabularyCategory = (
  t: TFunction,
  category: VocabularyCategory | 'All',
): string => {
  if (category === 'All') {
    return t('vocabulary.categories.all');
  }
  return t(CATEGORY_KEY[category]);
};
