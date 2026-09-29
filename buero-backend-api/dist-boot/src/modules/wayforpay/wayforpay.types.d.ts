export type WayForPayPurchaseParams = {
    orderReference: string;
    orderDate: number;
    amount: number;
    currency: string;
    productName: string;
    productPrice: number;
    productCount?: number;
    returnUrl: string;
    serviceUrl: string;
    clientEmail?: string;
    clientAccountId?: string;
    language?: string;
};
export type WayForPayServiceUrlPayload = {
    merchantAccount?: string;
    orderReference?: string;
    merchantSignature?: string;
    amount?: number | string;
    currency?: string;
    authCode?: string;
    cardPan?: string;
    transactionStatus?: string;
    reasonCode?: number | string;
    reason?: string;
    email?: string;
    phone?: string;
    [key: string]: unknown;
};
export type WayForPayCheckStatusResponse = {
    orderReference?: string;
    transactionStatus?: string;
    amount?: number | string;
    currency?: string;
    authCode?: string;
    cardPan?: string;
    reasonCode?: number | string;
    reason?: string;
};
export type WayForPayAcceptResponse = {
    orderReference: string;
    status: "accept";
    time: number;
    signature: string;
};
export declare const WAYFORPAY_STATUS: {
    readonly approved: "Approved";
    readonly inProcessing: "InProcessing";
    readonly pending: "Pending";
    readonly waitingAuthComplete: "WaitingAuthComplete";
    readonly declined: "Declined";
    readonly expired: "Expired";
    readonly refunded: "Refunded";
    readonly voided: "Voided";
};
