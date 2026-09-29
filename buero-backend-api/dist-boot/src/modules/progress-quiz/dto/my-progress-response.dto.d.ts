export declare class ResumeLessonDto {
    course_id: string;
    course_title: string;
    course_level: string | null;
    material_id: string;
    material_title: string;
    lesson_number: number;
    lesson_total: number;
}
export declare class CourseProgressItemDto {
    course_id: string;
    course_title: string;
    completion_percent: number;
    completed_materials_count: number;
    total_materials_count: number;
}
export declare class MyProgressResponseDto {
    courses: CourseProgressItemDto[];
    level: string | null;
    resume: ResumeLessonDto | null;
}
