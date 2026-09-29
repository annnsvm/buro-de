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
exports.CookieService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ACCESS_MAX_AGE = 1800;
const REFRESH_MAX_AGE = 604800;
const COOKIE_PATH = "/api";
let CookieService = class CookieService {
    constructor(configService) {
        this.configService = configService;
    }
    getSecure() {
        return this.configService.get("COOKIE_SECURE") === "true";
    }
    getDomain() {
        const domain = this.configService.get("COOKIE_DOMAIN");
        return (domain === null || domain === void 0 ? void 0 : domain.trim()) || undefined;
    }
    getSameSite() {
        return this.getSecure() ? "none" : "lax";
    }
    setAuthCookies(res, accessToken, refreshToken) {
        const secure = this.getSecure();
        const domain = this.getDomain();
        const sameSite = this.getSameSite();
        const baseOptions = Object.assign({ path: COOKIE_PATH, httpOnly: true, secure,
            sameSite }, (domain && { domain }));
        res.cookie("access_token", accessToken, Object.assign(Object.assign({}, baseOptions), { maxAge: ACCESS_MAX_AGE * 1000 }));
        res.cookie("refresh_token", refreshToken, Object.assign(Object.assign({}, baseOptions), { maxAge: REFRESH_MAX_AGE * 1000 }));
    }
    clearAuthCookies(res) {
        const secure = this.getSecure();
        const domain = this.getDomain();
        const sameSite = this.getSameSite();
        const clearOptions = Object.assign({ path: COOKIE_PATH, httpOnly: true, sameSite,
            secure, maxAge: 0 }, (domain && { domain }));
        res.cookie("access_token", "", clearOptions);
        res.cookie("refresh_token", "", clearOptions);
    }
};
exports.CookieService = CookieService;
exports.CookieService = CookieService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CookieService);
//# sourceMappingURL=cookie.service.js.map