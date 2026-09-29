import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { VerifyRegistrationDto } from "./dto/verify-registration.dto";
import { ResendRegistrationCodeDto } from "./dto/resend-registration-code.dto";
import { CookieService } from "./cookie.service";
import { UserService } from "../user/user.service";
import { RegistrationService } from "./registration.service";
import { Response, Request } from "express";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private readonly cookieService;
    private readonly userService;
    private readonly registrationService;
    constructor(cookieService: CookieService, userService: UserService, registrationService: RegistrationService);
    register(dto: RegisterDto): Promise<import("./registration.service").StartRegistrationResult>;
    verifyRegistration(dto: VerifyRegistrationDto, res: Response): Promise<void>;
    resendRegistrationCode(dto: ResendRegistrationCodeDto): Promise<{
        status: "verification_required";
        email: string;
        verificationCode?: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    changePassword(userId: string, dto: ChangePasswordDto, res: Response): Promise<void>;
}
