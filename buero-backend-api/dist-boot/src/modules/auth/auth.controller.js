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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const login_dto_1 = require("./dto/login.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const verify_registration_dto_1 = require("./dto/verify-registration.dto");
const resend_registration_code_dto_1 = require("./dto/resend-registration-code.dto");
const cookie_service_1 = require("./cookie.service");
const user_service_1 = require("../user/user.service");
const registration_service_1 = require("./registration.service");
const register_dto_1 = require("./dto/register.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
let AuthController = class AuthController {
    constructor(cookieService, userService, registrationService) {
        this.cookieService = cookieService;
        this.userService = userService;
        this.registrationService = registrationService;
    }
    async register(dto) {
        return this.registrationService.startRegistration(dto);
    }
    async verifyRegistration(dto, res) {
        const user = await this.registrationService.verifyRegistration(dto.email, dto.code);
        const accessToken = this.userService.signAccessToken(user.id, user.role);
        const refreshToken = await this.userService.createRefreshToken(user.id);
        this.cookieService.setAuthCookies(res, accessToken, refreshToken);
        res.status(common_1.HttpStatus.CREATED).json({ user });
    }
    async resendRegistrationCode(dto) {
        return this.registrationService.resendCode(dto.email);
    }
    async login(dto, res) {
        const user = await this.userService.findUserByEmailWithPassword(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const valid = await this.userService.validatePassword(user, dto.password);
        if (!valid)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const accessToken = this.userService.signAccessToken(user.id, user.role);
        const refreshToken = await this.userService.createRefreshToken(user.id);
        this.cookieService.setAuthCookies(res, accessToken, refreshToken);
        const userWithoutPassword = await this.userService.findUserById(user.id);
        if (!userWithoutPassword)
            throw new common_1.UnauthorizedException();
        res.status(common_1.HttpStatus.OK).json({ user: userWithoutPassword });
    }
    async refresh(req, res) {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!token)
            throw new common_1.UnauthorizedException("Refresh token not found");
        const record = await this.userService.findRefreshToken(token);
        if (!record)
            throw new common_1.UnauthorizedException("Invalid refresh token");
        await this.userService.revokeRefreshToken(token);
        const user = await this.userService.findUserById(record.userId);
        if (!user)
            throw new common_1.UnauthorizedException("User not found");
        const accessToken = this.userService.signAccessToken(user.id, user.role);
        const refreshToken = await this.userService.createRefreshToken(user.id);
        this.cookieService.setAuthCookies(res, accessToken, refreshToken);
        res.status(common_1.HttpStatus.OK).json({ user });
    }
    async logout(req, res) {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (token)
            await this.userService.revokeRefreshToken(token);
        this.cookieService.clearAuthCookies(res);
        res.status(common_1.HttpStatus.OK).send();
    }
    async changePassword(userId, dto, res) {
        const user = await this.userService.changePassword(userId, dto.current_password, dto.new_password);
        const accessToken = this.userService.signAccessToken(user.id, user.role);
        const refreshToken = await this.userService.createRefreshToken(user.id);
        this.cookieService.setAuthCookies(res, accessToken, refreshToken);
        res.status(common_1.HttpStatus.OK).json({ user });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Почати реєстрацію",
        description: "Надіслати 6-значний код на email. Користувача ще не створено. Дублікат email → 409.",
    }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Код надіслано, потрібна перевірка email" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Невалідні дані (email, пароль, role)" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Email вже зареєстрований" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "Too Many Requests — перевищено ліміт спроб" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("verify-registration"),
    (0, throttler_1.Throttle)({ default: { limit: 8, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: "Підтвердити реєстрацію",
        description: "Перевірити код з email, створити користувача і увійти: cookie access_token, refresh_token, тіло { user }.",
    }),
    (0, swagger_1.ApiBody)({ type: verify_registration_dto_1.VerifyRegistrationDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Користувача створено, токени в cookie" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Невірний або прострочений код" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "Too Many Requests" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_registration_dto_1.VerifyRegistrationDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyRegistration", null);
__decorate([
    (0, common_1.Post)("resend-registration-code"),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Надіслати код реєстрації ще раз",
    }),
    (0, swagger_1.ApiBody)({ type: resend_registration_code_dto_1.ResendRegistrationCodeDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Новий код надіслано" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Занадто часті запити" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Немає незавершеної реєстрації" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_registration_code_dto_1.ResendRegistrationCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendRegistrationCode", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Вхід",
        description: "Перевірка email + password, видача access та refresh у cookie, тіло { user }.",
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Успішний вхід, токени в cookie" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Невірний email або пароль" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "Too Many Requests — перевищено ліміт спроб" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Оновлення токенів",
        description: "Refresh_token з cookie. Ротація: новий access + новий refresh, старий ревокається. Токени тільки в cookie.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Нові токени в cookie, тіло { user }" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Відсутній або невалідний refresh token" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Вихід",
        description: "Ревок refresh-токена в БД, очищення cookie. 200 з порожнім тілом.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Вихід виконано" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("change-password"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Зміна пароля",
        description: "Потрібен JWT (cookie access_token або Bearer). Перевіряється поточний пароль; усі refresh-токени відкликаються; видаються нові access і refresh у cookie. Тіло { user }.",
    }),
    (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Пароль змінено, нові токени в cookie, тіло { user }",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Новий пароль збігається з поточним" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Невірний поточний пароль або немає JWT" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Користувач не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 429, description: "Too Many Requests" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [cookie_service_1.CookieService,
        user_service_1.UserService,
        registration_service_1.RegistrationService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map