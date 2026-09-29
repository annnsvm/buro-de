import type { UserWithoutPassword } from "../user/types/user-response.type";
import { CourseModuleService } from "./course-module.service";
import { CreateCourseModuleDto } from "./dto/create-course-module.dto";
import { UpdateCourseModuleDto } from "./dto/update-course-module.dto";
export declare class CourseModulesController {
    private readonly courseModuleService;
    constructor(courseModuleService: CourseModuleService);
    list(user: UserWithoutPassword, courseId: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }[]>;
    getById(user: UserWithoutPassword, courseId: string, moduleId: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }>;
    create(courseId: string, dto: CreateCourseModuleDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }>;
    update(courseId: string, moduleId: string, dto: UpdateCourseModuleDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        orderIndex: number;
    }>;
    delete(courseId: string, moduleId: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}
