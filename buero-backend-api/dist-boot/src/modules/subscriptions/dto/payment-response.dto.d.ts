export declare class PaymentResponseDto {
    id: string;
    user_id: string;
    course_id?: string;
    subscription_id?: string;
    provider: string;
    order_reference?: string;
    stripe_invoice_id?: string;
    amount: number;
    currency: string;
    status: string;
    created_at: Date;
}
