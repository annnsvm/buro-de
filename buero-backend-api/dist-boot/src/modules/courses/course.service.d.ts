import { ConfigService } from "@nestjs/config";
import { Role, UserCourseAccessType } from "../../generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { ListCoursesQueryDto, PublicationStatus } from "./dto/list-courses-query.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ReorderCoursesDto } from "./dto/reorder-courses.dto";
import { UserService } from "../user/user.service";
import { PaymentFulfillmentService } from "../subscriptions/payment-fulfillment.service";
type CourseListItem = Record<string, unknown>;
export type CourseViewer = {
    id: string;
    role: Role;
};
export declare class CourseService {
    private readonly prisma;
    private readonly configService;
    private readonly userService;
    private readonly cloudinaryService;
    private readonly paymentFulfillment;
    private readonly logger;
    private readonly listCache;
    private readonly listInflight;
    constructor(prisma: PrismaService, configService: ConfigService, userService: UserService, cloudinaryService: CloudinaryService, paymentFulfillment: PaymentFulfillmentService);
    findMyAccessibleCourses(userId: string): Promise<{
        videoLessonCount: number;
        lessonsCount: number;
        avgVideoLessonMinutes: null;
        my_access: {
            access_type: UserCourseAccessType;
        };
    }[]>;
    findAll(filters?: ListCoursesQueryDto, opts?: {
        publicationFilter?: PublicationStatus;
    }): Promise<CourseListItem[]>;
    findById(id: string, includeModules?: boolean, viewer?: CourseViewer | null): Promise<any>;
    private resolveReadableModules;
    private applyContentAccess;
    private applyMaterialAccess;
    private extractDuration;
    create(dto: CreateCourseDto): Promise<Record<string, unknown>>;
    reorderCourses(dto: ReorderCoursesDto): Promise<{
        updated: number;
    }>;
    update(id: string, dto: UpdateCourseDto): Promise<Record<string, unknown>>;
    private priceToNumber;
    delete(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    uploadCover(courseId: string, file: Express.Multer.File): Promise<Record<string, unknown>>;
    startTrial(userId: string, courseId: string): Promise<{
        course_id: string;
        access_type: "trial";
    }>;
    private clearCourseCaches;
    private refreshCourseList;
    private loadCourseTree;
    private countLessonsByCourseIds;
    private getCourseMaterialsCount;
    private serializeCourse;
    private stripAttachmentStorageKeys;
    private mapPrismaError;
}
export {};
