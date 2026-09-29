import { ConfigService } from "@nestjs/config";
import { type WayForPayAcceptResponse, type WayForPayCheckStatusResponse, type WayForPayPurchaseParams, type WayForPayServiceUrlPayload } from "./wayforpay.types";
export declare class WayForPayService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    isConfigured(): boolean;
    getDefaultCurrency(): string;
    getServiceUrl(): string;
    getReturnUrl(): string;
    generateOrderReference(): string;
    formatAmount(value: number): string;
    private getMerchantAccount;
    private getMerchantSecret;
    private getMerchantDomain;
    private sign;
    buildPurchaseSignature(params: {
        merchantAccount: string;
        merchantDomainName: string;
        orderReference: string;
        orderDate: number;
        amount: string;
        currency: string;
        productNames: string[];
        productCounts: number[];
        productPrices: string[];
    }): string;
    verifyServiceUrlSignature(payload: WayForPayServiceUrlPayload): boolean;
    buildAcceptResponse(orderReference: string): WayForPayAcceptResponse;
    isApproved(status?: string): boolean;
    isPendingStatus(status?: string): boolean;
    createPaymentPageUrl(params: WayForPayPurchaseParams): Promise<string>;
    checkStatus(orderReference: string): Promise<WayForPayCheckStatusResponse>;
}
