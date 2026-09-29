"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../../user/user.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, configService, userService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.getToken(request);
        if (!token)
            throw new common_1.UnauthorizedException("No token provided");
        try {
            const secret = this.configService.get("JWT_ACCESS_SECRET");
            const payload = this.jwtService.verify(token, { secret });
            if (!payload.sub)
                throw new common_1.UnauthorizedException("Invalid token");
            const user = await this.userService.findUserById(payload.sub);
            if (!user)
                throw new common_1.UnauthorizedException("Invalid token");
            request.user = user;
            return true;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.UnauthorizedException("Invalid or expired token");
        }
    }
    getToken(request) {
        var _a;
        const cookie = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
        if (cookie)
            return cookie;
        const auth = request.headers.authorization;
        if (auth === null || auth === void 0 ? void 0 : auth.startsWith("Bearer "))
            return auth.slice(7);
        return null;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        user_service_1.UserService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map