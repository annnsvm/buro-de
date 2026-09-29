import type { UserWithoutPassword } from '../user/types/user-response.type';
import { LessonRequestService } from './lesson-request.service';
import { CreateLessonRequestDto } from './dto/create-lesson-request.dto';
export declare class LessonRequestsController {
    private readonly lessonRequestService;
    constructor(lessonRequestService: LessonRequestService);
    create(user: UserWithoutPassword, dto: CreateLessonRequestDto): Promise<import("./lesson-request.service").LessonRequestResponse>;
    findMy(user: UserWithoutPassword): Promise<import("./lesson-request.service").LessonRequestResponse[]>;
    accept(id: string, user: UserWithoutPassword): Promise<import("./lesson-request.service").LessonRequestResponse>;
    reject(id: string, user: UserWithoutPassword): Promise<import("./lesson-request.service").LessonRequestResponse>;
    complete(id: string, user: UserWithoutPassword): Promise<import("./lesson-request.service").LessonRequestResponse>;
    cancel(id: string, user: UserWithoutPassword): Promise<import("./lesson-request.service").LessonRequestResponse>;
}
