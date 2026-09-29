import type { UserWithoutPassword } from '../user/types/user-response.type';
import { QuestionImportService } from '../exercises/import/question-import.service';
import { ImportQuestionsDto } from '../exercises/import/import-questions.dto';
import { QuestionEditorService } from '../exercises/question-editor.service';
import { ReorderQuestionsDto, SaveQuestionDto } from '../exercises/question-editor.dto';
import { CourseMaterialService } from './course-material.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';
export declare class CourseMaterialsController {
    private readonly courseMaterialService;
    private readonly questionImport;
    private readonly questionEditor;
    constructor(courseMaterialService: CourseMaterialService, questionImport: QuestionImportService, questionEditor: QuestionEditorService);
    list(user: UserWithoutPassword, courseId: string, moduleId: string): Promise<({
        attachments: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            orderIndex: number;
            materialId: string;
            kind: import("src/generated/prisma/enums").AttachmentKind;
            fileName: string | null;
            mimeType: string | null;
            sizeBytes: number | null;
            storageKey: string | null;
        }[];
    } & {
        type: import("src/generated/prisma/enums").CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    })[]>;
    getById(user: UserWithoutPassword, courseId: string, moduleId: string, id: string): Promise<{
        attachments: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            orderIndex: number;
            materialId: string;
            kind: import("src/generated/prisma/enums").AttachmentKind;
            fileName: string | null;
            mimeType: string | null;
            sizeBytes: number | null;
            storageKey: string | null;
        }[];
    } & {
        type: import("src/generated/prisma/enums").CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    }>;
    listQuestions(courseId: string, moduleId: string, materialId: string): Promise<{
        id: string;
        type: import("src/generated/prisma/enums").QuestionType;
        prompt: string;
        accepted_answers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        order_index: number;
        options: {
            id: string;
            text: string;
        }[];
        tokens: string[];
    }[]>;
    createQuestion(courseId: string, moduleId: string, materialId: string, dto: SaveQuestionDto): Promise<{
        id: string;
        type: import("src/generated/prisma/enums").QuestionType;
        prompt: string;
        accepted_answers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        order_index: number;
        options: {
            id: string;
            text: string;
        }[];
        tokens: string[];
    }>;
    updateQuestion(courseId: string, moduleId: string, materialId: string, questionId: string, dto: SaveQuestionDto): Promise<{
        id: string;
        type: import("src/generated/prisma/enums").QuestionType;
        prompt: string;
        accepted_answers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        order_index: number;
        options: {
            id: string;
            text: string;
        }[];
        tokens: string[];
    }>;
    deleteQuestion(courseId: string, moduleId: string, materialId: string, questionId: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    reorderQuestions(courseId: string, moduleId: string, materialId: string, dto: ReorderQuestionsDto): Promise<{
        id: string;
        type: import("src/generated/prisma/enums").QuestionType;
        prompt: string;
        accepted_answers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        order_index: number;
        options: {
            id: string;
            text: string;
        }[];
        tokens: string[];
    }[]>;
    importQuestions(courseId: string, moduleId: string, dto: ImportQuestionsDto): Promise<import("../exercises/import/question-import.service").ImportPreview>;
    create(courseId: string, moduleId: string, dto: CreateCourseMaterialDto): Promise<{
        type: import("src/generated/prisma/enums").CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    }>;
    update(courseId: string, moduleId: string, id: string, dto: UpdateCourseMaterialDto): Promise<{
        type: import("src/generated/prisma/enums").CourseMaterialType;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        orderIndex: number;
        moduleId: string;
        quizMode: import("src/generated/prisma/enums").QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
    }>;
    delete(courseId: string, moduleId: string, id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}
