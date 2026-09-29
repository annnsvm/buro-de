import { PrismaService } from "src/prisma/prisma.service";
import { MailerService } from "../mail/mailer.service";
import { UserWithoutPassword } from "../user/types/user-response.type";
import { RegisterDto } from "./dto/register.dto";
export type StartRegistrationResult = {
    status: "verification_required";
    email: string;
    verificationCode?: string;
};
export declare class RegistrationService {
    private readonly prisma;
    private readonly mailer;
    private readonly logger;
    constructor(prisma: PrismaService, mailer: MailerService);
    private hashCode;
    private emailLocale;
    private generateCode;
    private createUserFromPending;
    startRegistration(dto: RegisterDto): Promise<StartRegistrationResult>;
    verifyRegistration(emailRaw: string, code: string): Promise<UserWithoutPassword>;
    resendCode(emailRaw: string): Promise<{
        status: "verification_required";
        email: string;
        verificationCode?: string;
    }>;
    private sendVerificationEmail;
    private sendWelcomeEmail;
}
