export declare class CompletedMaterialItemDto {
    course_material_id: string;
    module_id?: string;
    completed_at: string;
    score?: number | null;
}
export declare class CourseProgressResponseDto {
    completed_materials: CompletedMaterialItemDto[];
}
