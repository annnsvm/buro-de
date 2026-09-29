import { PaymentResponseDto } from "./dto/payment-response.dto";
import { PaymentService } from "./payment.service";
export declare class PaymentsController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getMyPayments(userId: string): Promise<PaymentResponseDto[]>;
}
