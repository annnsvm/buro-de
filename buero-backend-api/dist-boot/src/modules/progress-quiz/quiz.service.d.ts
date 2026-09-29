import { PracticeBlock, QuizMode, Role } from "src/generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import type { AnswerMatchQuality } from "../exercises/normalize-german";
import type { AnswerQuestionDto } from "./dto/answer-question.dto";
import type { SubmitQuizDto } from "./dto/submit-quiz.dto";
export declare class QuizService {
    private readonly prisma;
    private readonly courseMaterialService;
    constructor(prisma: PrismaService, courseMaterialService: CourseMaterialService);
    startAttempt(userId: string, role: Role, courseMaterialId: string): Promise<{
        id: string;
        course_material_id: string;
        status: "completed" | "in_progress";
        answers_snapshot: Record<string, unknown> | null;
        score: number | null;
        completed_at: string | null;
        created_at: string;
    }>;
    getQuestions(materialId: string, userId: string, role: Role, block?: PracticeBlock): Promise<{
        mode: QuizMode;
        passing_score: number | null;
        total_points: number | null;
        passing_points: number | null;
        questions: {
            tokens?: string[] | undefined;
            options?: {
                id: string;
                text: string;
            }[] | undefined;
            id: string;
            type: import("src/generated/prisma/enums").QuestionType;
            prompt: string;
            points: number;
            order_index: number;
        }[];
    }>;
    getLastAttempt(materialId: string, userId: string, role: Role): Promise<{
        outdated: boolean;
        attempt_id?: undefined;
        completed_at?: undefined;
        score?: undefined;
        total?: undefined;
        correct?: undefined;
        earned_points?: undefined;
        total_points?: undefined;
        attempts?: undefined;
        mode?: undefined;
        passing_score?: undefined;
        passing_points?: undefined;
        passed?: undefined;
        reveal_answers?: undefined;
        parts?: undefined;
        answers?: undefined;
    } | {
        attempt_id: string;
        completed_at: string | null;
        score: number;
        total: number;
        correct: number;
        earned_points: number | null;
        total_points: number | null;
        attempts: number;
        mode: QuizMode;
        passing_score: number | null;
        passing_points: number | null;
        passed: boolean | null;
        reveal_answers: boolean;
        parts: {
            title: string;
            review_lesson: string | null;
            earned_points: number;
            total_points: number;
            correct: number;
            total: number;
            weak: boolean;
        }[];
        answers: {
            question_id: string;
            correct: boolean;
            quality: AnswerMatchQuality;
            explanation: string | null;
            accepted_answers: string[];
            raw_answer: string | string[];
        }[];
        outdated?: undefined;
    } | null>;
    private bestCurrentAttempt;
    private assertCanAccessQuiz;
    getAttempt(attemptId: string, userId: string): Promise<{
        id: string;
        course_material_id: string;
        status: "completed" | "in_progress";
        answers_snapshot: Record<string, unknown> | null;
        score: number | null;
        completed_at: string | null;
        created_at: string;
    }>;
    answerQuestion(attemptId: string, userId: string, body: AnswerQuestionDto): Promise<{
        question_id: string;
        correct: boolean;
        quality: AnswerMatchQuality;
        explanation: string | null;
        accepted_answers: string[];
        answered: number;
        total: number;
        summary: {
            score: number;
            best_score: number;
            total: number;
            correct: number;
        } | null;
    }>;
    private finishAttempt;
    private loadOwnAttempt;
    private mayRevealAnswers;
    private hasPassed;
    private recordMaterialProgress;
    submitQuiz(attemptId: string, userId: string, body: SubmitQuizDto): Promise<{
        attempt: {
            id: string;
            course_material_id: string;
            status: "completed" | "in_progress";
            answers_snapshot: Record<string, unknown> | null;
            score: number | null;
            completed_at: string | null;
            created_at: string;
        };
        score: number;
        best_score: number;
        total: number;
        correct: number;
        earned_points: number | null;
        total_points: number | null;
        mode: QuizMode;
        passing_score: number | null;
        passing_points: number | null;
        passed: boolean | null;
        reveal_answers: boolean;
        parts: {
            title: string;
            review_lesson: string | null;
            earned_points: number;
            total_points: number;
            correct: number;
            total: number;
            weak: boolean;
        }[];
        results: {
            accepted_answers: string[];
            question_id: string;
            correct: boolean;
            quality: AnswerMatchQuality;
            explanation: string | null;
        }[];
    }>;
    private toAttemptResponse;
}
