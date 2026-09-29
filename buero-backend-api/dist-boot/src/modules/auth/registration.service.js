"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var RegistrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("src/prisma/prisma.service");
const mailer_service_1 = require("../mail/mailer.service");
const auth_email_templates_1 = require("./auth-email.templates");
const SALT_ROUNDS = 10;
const CODE_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;
let RegistrationService = RegistrationService_1 = class RegistrationService {
    constructor(prisma, mailer) {
        this.prisma = prisma;
        this.mailer = mailer;
        this.logger = new common_1.Logger(RegistrationService_1.name);
    }
    hashCode(code) {
        return (0, crypto_1.createHash)("sha256").update(code).digest("hex");
    }
    emailLocale(locale) {
        return locale === "uk" ? "uk" : "en";
    }
    generateCode() {
        return (0, crypto_1.randomInt)(100000, 1000000).toString();
    }
    async createUserFromPending(pending) {
        const existing = await this.prisma.user.findFirst({
            where: { email: pending.email, deletedAt: null },
        });
        if (existing) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const user = await this.prisma.user.create({
            data: {
                email: pending.email,
                name: pending.name,
                passwordHash: pending.passwordHash,
                role: pending.role,
                language: pending.language || "en",
            },
        });
        if (pending.role === "student") {
            await this.prisma.studentProfile.create({ data: { userId: user.id } });
        }
        else {
            await this.prisma.teacherProfile.create({ data: { userId: user.id } });
        }
        const { passwordHash: _passwordHash } = user, safeUser = __rest(user, ["passwordHash"]);
        return safeUser;
    }
    async startRegistration(dto) {
        var _a;
        const email = dto.email.toLowerCase();
        const existing = await this.prisma.user.findFirst({
            where: { email, deletedAt: null },
        });
        if (existing) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const code = this.generateCode();
        const locale = this.emailLocale((_a = dto.locale) !== null && _a !== void 0 ? _a : "en");
        const name = dto.name == null
            ? null
            : (typeof dto.name === "string" ? dto.name.trim() : "") || null;
        await this.prisma.pendingRegistration.upsert({
            where: { email },
            create: {
                email,
                name,
                passwordHash,
                role: dto.role,
                language: dto.language || "en",
                locale,
                codeHash: this.hashCode(code),
                expiresAt: new Date(Date.now() + CODE_TTL_MS),
                attempts: 0,
            },
            update: {
                name,
                passwordHash,
                role: dto.role,
                language: dto.language || "en",
                locale,
                codeHash: this.hashCode(code),
                expiresAt: new Date(Date.now() + CODE_TTL_MS),
                attempts: 0,
            },
        });
        await this.sendVerificationEmail(email, name, code, locale);
        const result = {
            status: "verification_required",
            email,
        };
        if (this.mailer.isTestMode()) {
            result.verificationCode = code;
        }
        return result;
    }
    async verifyRegistration(emailRaw, code) {
        const email = emailRaw.toLowerCase();
        const pending = await this.prisma.pendingRegistration.findUnique({
            where: { email },
        });
        if (!pending) {
            throw new common_1.BadRequestException("Invalid or expired verification code");
        }
        if (pending.expiresAt.getTime() < Date.now()) {
            await this.prisma.pendingRegistration.delete({ where: { email } });
            throw new common_1.BadRequestException("Verification code expired. Request a new one.");
        }
        const attempts = pending.attempts + 1;
        if (attempts > MAX_ATTEMPTS) {
            await this.prisma.pendingRegistration.delete({ where: { email } });
            throw new common_1.BadRequestException("Too many attempts. Request a new code.");
        }
        if (pending.codeHash !== this.hashCode(code)) {
            await this.prisma.pendingRegistration.update({
                where: { email },
                data: { attempts },
            });
            throw new common_1.BadRequestException("Invalid or expired verification code");
        }
        const user = await this.createUserFromPending(pending);
        await this.prisma.pendingRegistration.delete({ where: { email } });
        await this.sendWelcomeEmail(user.email, user.name, this.emailLocale(pending.locale));
        return user;
    }
    async resendCode(emailRaw) {
        const email = emailRaw.toLowerCase();
        const pending = await this.prisma.pendingRegistration.findUnique({
            where: { email },
        });
        if (!pending) {
            throw new common_1.NotFoundException("No pending registration for this email");
        }
        const elapsed = Date.now() - pending.updatedAt.getTime();
        if (elapsed < RESEND_COOLDOWN_MS) {
            throw new common_1.BadRequestException("Please wait before requesting a new code");
        }
        const code = this.generateCode();
        const locale = this.emailLocale(pending.locale);
        await this.prisma.pendingRegistration.update({
            where: { email },
            data: {
                codeHash: this.hashCode(code),
                expiresAt: new Date(Date.now() + CODE_TTL_MS),
                attempts: 0,
            },
        });
        await this.sendVerificationEmail(email, pending.name, code, locale);
        const result = {
            status: "verification_required",
            email,
        };
        if (this.mailer.isTestMode()) {
            result.verificationCode = code;
        }
        return result;
    }
    async sendVerificationEmail(email, name, code, locale) {
        const { logoUrl } = this.mailer.resolveLogo();
        const mail = (0, auth_email_templates_1.buildVerificationEmail)({
            name,
            code,
            locale,
            logoUrl,
            siteUrl: this.mailer.getSiteUrl(),
        });
        await this.mailer.send({
            to: email,
            subject: mail.subject,
            html: mail.html,
            text: mail.text,
        });
    }
    async sendWelcomeEmail(email, name, locale) {
        const { logoUrl } = this.mailer.resolveLogo();
        const mail = (0, auth_email_templates_1.buildWelcomeEmail)({
            name,
            locale,
            logoUrl,
            siteUrl: this.mailer.getSiteUrl(),
        });
        try {
            await this.mailer.send({
                to: email,
                subject: mail.subject,
                html: mail.html,
                text: mail.text,
            });
        }
        catch (error) {
            this.logger.error(`Welcome email failed for ${email}`, error);
        }
    }
};
exports.RegistrationService = RegistrationService;
exports.RegistrationService = RegistrationService = RegistrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.MailerService])
], RegistrationService);
//# sourceMappingURL=registration.service.js.map