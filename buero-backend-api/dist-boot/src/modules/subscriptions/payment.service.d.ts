import { PrismaService } from "src/prisma/prisma.service";
import type { PaymentResponseDto } from "./dto/payment-response.dto";
export declare class PaymentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMyPayments(userId: string): Promise<PaymentResponseDto[]>;
}
