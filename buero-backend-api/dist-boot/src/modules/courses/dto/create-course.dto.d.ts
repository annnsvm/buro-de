import { Language, Level } from '../../../generated/prisma/enums';
export declare class CreateCourseDto {
    title: string;
    description?: string;
    language: Language;
    is_published?: boolean;
    price?: number;
    tags?: string[];
    level?: Level;
    level_to?: Level;
    duration_hours?: number;
}
