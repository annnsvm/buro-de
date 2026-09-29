export declare class AttemptResponseDto {
    id: string;
    course_material_id: string;
    status: 'in_progress' | 'completed';
    answers_snapshot: Record<string, unknown> | null;
    score: number | null;
    completed_at: string | null;
    created_at: string;
}
