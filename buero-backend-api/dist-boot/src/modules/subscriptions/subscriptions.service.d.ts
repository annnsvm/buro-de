import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import type { CourseAccessResponseDto } from "./dto/course-access-response.dto";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { SyncCheckoutDto } from "./dto/sync-checkout.dto";
import { PaymentFulfillmentService } from "./payment-fulfillment.service";
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly wayForPay;
    private readonly fulfillment;
    private readonly logger;
    constructor(prisma: PrismaService, wayForPay: WayForPayService, fulfillment: PaymentFulfillmentService);
    createCheckoutSession(userId: string, dto: CreateCheckoutDto): Promise<{
        url: string;
        order_reference: string;
    }>;
    syncCheckout(userId: string, dto: SyncCheckoutDto): Promise<{
        ok: boolean;
        status: string;
    }>;
    getMyCourseAccess(userId: string): Promise<CourseAccessResponseDto[]>;
}
