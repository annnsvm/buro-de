import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
export declare const PAYMENT_STATUS: {
    readonly pending: "pending";
    readonly paid: "paid";
    readonly failed: "failed";
    readonly refunded: "refunded";
};
export declare class PaymentFulfillmentService {
    private readonly prisma;
    private readonly wayForPay;
    private readonly logger;
    constructor(prisma: PrismaService, wayForPay: WayForPayService);
    reconcilePendingForUser(userId: string): Promise<void>;
    markPaid(params: {
        orderReference: string;
        amount?: number;
        currency?: string;
    }): Promise<{
        granted: boolean;
    }>;
    markFailed(orderReference: string, reason?: string): Promise<void>;
}
