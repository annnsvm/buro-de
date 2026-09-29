import type { UserWithoutPassword } from '../user/types/user-response.type';
import { SubmitWritingDto } from './dto/submit-writing.dto';
import { WritingService } from './writing.service';
export declare class WritingController {
    private readonly writingService;
    constructor(writingService: WritingService);
    getTask(user: UserWithoutPassword, materialId: string): Promise<{
        task: string;
        criteria: string[];
        min_sentences: number;
        max_sentences: number;
        max_score: number;
        attempts_used: number;
        attempts_per_window: number;
        can_submit: boolean;
        attempts_left: number;
        blocked_reason: "wait" | "daily" | "budget" | null;
        retry_at: string | null;
        best: {
            score: number;
            assessment: import("@prisma/client/runtime/client").JsonValue;
            text: string;
            submitted_at: string;
        } | null;
    }>;
    submit(user: UserWithoutPassword, materialId: string, dto: SubmitWritingDto): Promise<{
        status: "graded";
        repeated: boolean;
        score: number;
        max_score: number;
        assessment: import("@prisma/client/runtime/client").JsonValue;
        attempts_left: number;
        reason?: undefined;
        body_sentences?: undefined;
        min_sentences?: undefined;
        max_sentences?: undefined;
        retry_at?: undefined;
        self_check?: undefined;
        model_answer?: undefined;
    } | {
        status: "needs_more";
        reason: "too_short" | "no_salutation" | "no_closing" | "too_long";
        body_sentences: number;
        min_sentences: number;
        max_sentences: number;
        attempts_left: number;
        repeated?: undefined;
        score?: undefined;
        max_score?: undefined;
        assessment?: undefined;
        retry_at?: undefined;
        self_check?: undefined;
        model_answer?: undefined;
    } | {
        status: "blocked";
        reason: "wait" | "daily" | "budget";
        retry_at: string | null;
        self_check: boolean;
        model_answer: string | null;
        repeated?: undefined;
        score?: undefined;
        max_score?: undefined;
        assessment?: undefined;
        attempts_left?: undefined;
        body_sentences?: undefined;
        min_sentences?: undefined;
        max_sentences?: undefined;
    } | {
        status: "graded";
        repeated: boolean;
        score: number;
        max_score: number;
        assessment: {
            criteria: {
                id: number;
                met: boolean;
                note: string;
            }[];
        };
        attempts_left: number;
        reason?: undefined;
        body_sentences?: undefined;
        min_sentences?: undefined;
        max_sentences?: undefined;
        retry_at?: undefined;
        self_check?: undefined;
        model_answer?: undefined;
    }>;
}
