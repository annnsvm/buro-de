import { ConfigService } from "@nestjs/config";
import { Response } from "express";
export declare class CookieService {
    private configService;
    constructor(configService: ConfigService);
    private getSecure;
    private getDomain;
    private getSameSite;
    setAuthCookies(res: Response, accessToken: string, refreshToken: string): void;
    clearAuthCookies(res: Response): void;
}
