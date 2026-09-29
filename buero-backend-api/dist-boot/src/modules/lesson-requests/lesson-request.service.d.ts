import { LessonRequestStatus, Role } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonRequestDto } from './dto/create-lesson-request.dto';
export type LessonRequestResponse = {
    id: string;
    student_id: string;
    teacher_id: string | null;
    preferred_time: string | null;
    message: string | null;
    status: LessonRequestStatus;
    created_at: Date;
    updated_at: Date;
};
export declare class LessonRequestService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toResponse;
    private getUserOrThrow;
    private assertActorRoleMatchesDb;
    create(userId: string, declaredRole: Role, dto: CreateLessonRequestDto): Promise<LessonRequestResponse>;
    findMyRequests(userId: string, declaredRole: Role): Promise<LessonRequestResponse[]>;
    accept(id: string, userId: string, declaredRole: Role): Promise<LessonRequestResponse>;
    reject(id: string, userId: string, declaredRole: Role): Promise<LessonRequestResponse>;
    complete(id: string, userId: string, declaredRole: Role): Promise<LessonRequestResponse>;
    cancel(id: string, userId: string, declaredRole: Role): Promise<LessonRequestResponse>;
}
