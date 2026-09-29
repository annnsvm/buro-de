import { PracticeBlock } from "src/generated/prisma/enums";
import type { UserWithoutPassword } from "../user/types/user-response.type";
import { QuizService } from "./quiz.service";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { AnswerQuestionDto } from "./dto/answer-question.dto";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    getQuestions(user: UserWithoutPassword, materialId: string, block?: PracticeBlock): Promise<{
        mode: import("src/generated/prisma/enums").QuizMode;
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
    getLastAttempt(user: UserWithoutPassword, materialId: string): Promise<{
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
        mode: import("src/generated/prisma/enums").QuizMode;
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
            quality: import("../exercises/normalize-german").AnswerMatchQuality;
            explanation: string | null;
            accepted_answers: string[];
            raw_answer: string | string[];
        }[];
        outdated?: undefined;
    } | null>;
    startAttempt(user: UserWithoutPassword, dto: CreateAttemptDto): Promise<{
        id: string;
        course_material_id: string;
        status: "completed" | "in_progress";
        answers_snapshot: Record<string, unknown> | null;
        score: number | null;
        completed_at: string | null;
        created_at: string;
    }>;
    getAttempt(userId: string, attemptId: string): Promise<{
        id: string;
        course_material_id: string;
        status: "completed" | "in_progress";
        answers_snapshot: Record<string, unknown> | null;
        score: number | null;
        completed_at: string | null;
        created_at: string;
    }>;
    answerQuestion(userId: string, attemptId: string, body: AnswerQuestionDto): Promise<{
        question_id: string;
        correct: boolean;
        quality: import("../exercises/normalize-german").AnswerMatchQuality;
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
    submitQuiz(userId: string, attemptId: string, body: SubmitQuizDto): Promise<{
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
        mode: import("src/generated/prisma/enums").QuizMode;
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
            quality: import("../exercises/normalize-german").AnswerMatchQuality;
            explanation: string | null;
        }[];
    }>;
}
