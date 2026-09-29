import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { VocabularyService } from './vocabulary.service';
export declare class VocabularyController {
    private readonly vocabularyService;
    constructor(vocabularyService: VocabularyService);
    findAll(userId: string, search?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string | null;
        word: string;
        translation: string;
        category: import("../../generated/prisma/enums").VocabularyCategory;
        notes: string | null;
    }[]>;
    create(userId: string, dto: CreateVocabularyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string | null;
        word: string;
        translation: string;
        category: import("../../generated/prisma/enums").VocabularyCategory;
        notes: string | null;
    }>;
    update(userId: string, id: string, dto: UpdateVocabularyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string | null;
        word: string;
        translation: string;
        category: import("../../generated/prisma/enums").VocabularyCategory;
        notes: string | null;
    }>;
    delete(userId: string, id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}
