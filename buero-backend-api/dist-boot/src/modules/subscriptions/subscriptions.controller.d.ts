import { CourseAccessResponseDto } from "./dto/course-access-response.dto";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { SyncCheckoutDto } from "./dto/sync-checkout.dto";
import { SubscriptionsService } from "./subscriptions.service";
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    createCheckoutSession(userId: string, body: CreateCheckoutDto): Promise<{
        url: string;
        order_reference: string;
    }>;
    syncCheckout(userId: string, body: SyncCheckoutDto): Promise<{
        ok: boolean;
        status: string;
    }>;
    getMyCourseAccess(userId: string): Promise<CourseAccessResponseDto[]>;
}
