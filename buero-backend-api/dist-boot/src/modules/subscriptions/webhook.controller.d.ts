import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { WayForPayService } from "../wayforpay/wayforpay.service";
import type { WayForPayAcceptResponse } from "../wayforpay/wayforpay.types";
import { WebhookService } from "./webhook.service";
export declare class WebhookController {
    private readonly webhookService;
    private readonly wayForPay;
    private readonly configService;
    private readonly logger;
    constructor(webhookService: WebhookService, wayForPay: WayForPayService, configService: ConfigService);
    handleWayForPay(req: Request): Promise<WayForPayAcceptResponse>;
    handleReturnPost(req: Request, res: Response): void;
    handleReturnGet(req: Request, res: Response): void;
    private redirectToFrontend;
    private firstQueryValue;
}
