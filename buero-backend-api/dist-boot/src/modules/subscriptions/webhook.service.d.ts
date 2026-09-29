import { PrismaService } from "src/prisma/prisma.service";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import { type WayForPayAcceptResponse, type WayForPayServiceUrlPayload } from "../wayforpay/wayforpay.types";
import { PaymentFulfillmentService } from "./payment-fulfillment.service";
export declare class WebhookService {
    private readonly prisma;
    private readonly wayForPay;
    private readonly fulfillment;
    private readonly logger;
    constructor(prisma: PrismaService, wayForPay: WayForPayService, fulfillment: PaymentFulfillmentService);
    normalizePayload(body: unknown): WayForPayServiceUrlPayload;
    private parseJson;
    handleWayForPayCallback(body: unknown): Promise<WayForPayAcceptResponse>;
}
