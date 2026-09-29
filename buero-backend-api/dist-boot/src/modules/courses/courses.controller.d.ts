import type { UserWithoutPassword } from "../user/types/user-response.type";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { ListCoursesQueryDto } from "./dto/list-courses-query.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ReorderCoursesDto } from "./dto/reorder-courses.dto";
export declare class CoursesController {
    private readonly courseService;
    constructor(courseService: CourseService);
    list(query: ListCoursesQueryDto): Promise<{
        [x: string]: unknown;
    }[]>;
    manage(query: ListCoursesQueryDto): Promise<{
        [x: string]: unknown;
    }[]>;
    myAccessibleCourses(userId: string): Promise<{
        videoLessonCount: number;
        lessonsCount: number;
        avgVideoLessonMinutes: null;
        my_access: {
            access_type: import("src/generated/prisma/enums").UserCourseAccessType;
        };
    }[]>;
    getById(user: UserWithoutPassword | undefined, id: string): Promise<any>;
    create(dto: CreateCourseDto): Promise<Record<string, unknown>>;
    reorder(dto: ReorderCoursesDto): Promise<{
        updated: number;
    }>;
    update(id: string, dto: UpdateCourseDto): Promise<Record<string, unknown>>;
    delete(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    uploadCover(id: string, file: Express.Multer.File | undefined): Promise<Record<string, unknown>>;
    startTrial(userId: string, id: string): Promise<{
        course_id: string;
        access_type: "trial";
    }>;
}
