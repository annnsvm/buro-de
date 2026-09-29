export declare class SubmitQuizResultItemDto {
    question_id: string;
    correct: boolean;
}
export declare class SubmitQuizResponseDto {
    attempt: {
        id: string;
        course_material_id: string;
        status: 'completed';
        answers_snapshot: Record<string, unknown> | null;
        score: number | null;
        completed_at: string | null;
        created_at: string;
    };
    score: number;
    total: number;
    correct: number;
    results: SubmitQuizResultItemDto[];
}
