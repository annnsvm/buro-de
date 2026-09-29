export declare class SubscriptionResponseDto {
    id: string;
    course_id: string;
    stripe_subscription_id: string;
    status: string;
    current_period_start?: Date;
    current_period_end?: Date;
    canceled_at?: Date;
    cancellation_reason?: string;
    created_at: Date;
    updated_at: Date;
}
