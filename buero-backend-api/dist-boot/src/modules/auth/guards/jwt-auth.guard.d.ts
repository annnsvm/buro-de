import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/user.service";
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    private configService;
    private userService;
    constructor(jwtService: JwtService, configService: ConfigService, userService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getToken;
}
