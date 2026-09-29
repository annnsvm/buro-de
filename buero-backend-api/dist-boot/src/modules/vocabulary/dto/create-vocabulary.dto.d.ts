import { VocabularyCategory } from '../../../generated/prisma/enums';
export declare class CreateVocabularyDto {
    word: string;
    translation: string;
    category?: VocabularyCategory;
    notes?: string;
    course_id?: string;
}
