"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const cookie_service_1 = require("./cookie.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("./guards/optional-jwt-auth.guard");
const user_module_1 = require("../user/user.module");
const mail_module_1 = require("../mail/mail.module");
const prisma_module_1 = require("../../prisma/prisma.module");
const roles_guard_1 = require("./guards/roles.guard");
const registration_service_1 = require("./registration.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => user_module_1.UserModule), mail_module_1.MailModule, prisma_module_1.PrismaModule],
        controllers: [auth_controller_1.AuthController],
        providers: [
            cookie_service_1.CookieService,
            registration_service_1.RegistrationService,
            jwt_auth_guard_1.JwtAuthGuard,
            optional_jwt_auth_guard_1.OptionalJwtAuthGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [cookie_service_1.CookieService, jwt_auth_guard_1.JwtAuthGuard, optional_jwt_auth_guard_1.OptionalJwtAuthGuard, roles_guard_1.RolesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map