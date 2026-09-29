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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path_1 = require("path");
const nodemailer_1 = __importDefault(require("nodemailer"));
const LOGO_CID = "buro-logo";
let MailerService = MailerService_1 = class MailerService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailerService_1.name);
        this.transporter = null;
    }
    isTestMode() {
        return (this.config.get("E2E_TEST") === "true" ||
            this.config.get("NODE_ENV") === "test");
    }
    getSiteUrl() {
        var _a, _b;
        return ((_b = (_a = this.config.get("PUBLIC_SITE_URL")) !== null && _a !== void 0 ? _a : this.config.get("CORS_ORIGIN")) !== null && _b !== void 0 ? _b : "https://www.buro-de.com").replace(/\/$/, "");
    }
    resolveLogo() {
        var _a;
        const candidates = [
            (0, path_1.join)(process.cwd(), "assets/email/logo-dark.png"),
            (0, path_1.join)(__dirname, "../../../assets/email/logo-dark.png"),
            (0, path_1.join)(process.cwd(), "assets/email/logo.png"),
            (0, path_1.join)(__dirname, "../../../assets/email/logo.png"),
            (0, path_1.join)(process.cwd(), "../buero-frontend/public/images/logo_dark.webp"),
        ];
        for (const path of candidates) {
            if ((0, fs_1.existsSync)(path)) {
                return {
                    logoUrl: `cid:${LOGO_CID}`,
                    attachments: [
                        {
                            filename: "buro-logo.png",
                            path,
                            cid: LOGO_CID,
                            contentType: path.endsWith(".webp") ? "image/webp" : "image/png",
                            contentDisposition: "inline",
                        },
                    ],
                };
            }
        }
        this.logger.warn("Email logo file not found; falling back to MAIL_LOGO_URL");
        const siteUrl = this.getSiteUrl();
        return {
            logoUrl: (_a = this.config.get("MAIL_LOGO_URL")) !== null && _a !== void 0 ? _a : `${siteUrl}/images/logo_light.webp`,
            attachments: [],
        };
    }
    getTransporter() {
        var _a, _b;
        if (this.transporter)
            return this.transporter;
        const host = (_a = this.config.get("SMTP_HOST")) !== null && _a !== void 0 ? _a : "smtp.gmail.com";
        const port = Number((_b = this.config.get("SMTP_PORT")) !== null && _b !== void 0 ? _b : 587);
        const user = this.config.get("SMTP_USER");
        const pass = this.config.get("SMTP_PASS");
        if (!user || !pass) {
            throw new common_1.ServiceUnavailableException("Email is not configured. Set SMTP_USER and SMTP_PASS.");
        }
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
        return this.transporter;
    }
    async send(payload) {
        var _a, _b, _c, _d;
        if (this.isTestMode()) {
            this.logger.debug(`Skipped email to ${payload.to} in test mode`);
            return;
        }
        const inbox = (_b = (_a = this.config.get("CONTACT_INBOX")) !== null && _a !== void 0 ? _a : this.config.get("SMTP_USER")) !== null && _b !== void 0 ? _b : "burode452@gmail.com";
        const from = (_c = this.config.get("MAIL_FROM")) !== null && _c !== void 0 ? _c : `"Büro.de" <${(_d = this.config.get("SMTP_USER")) !== null && _d !== void 0 ? _d : inbox}>`;
        const { attachments } = this.resolveLogo();
        try {
            await this.getTransporter().sendMail({
                from,
                to: payload.to,
                replyTo: payload.replyTo,
                subject: payload.subject,
                text: payload.text,
                html: payload.html,
                attachments: attachments.length ? attachments : undefined,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${payload.to}`, error);
            throw new common_1.ServiceUnavailableException("Could not send email. Please try again later.");
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map