import { ConfigService } from "@nestjs/config";
export type MailPayload = {
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
};
export declare class MailerService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    isTestMode(): boolean;
    getSiteUrl(): string;
    resolveLogo(): {
        logoUrl: string;
        attachments: Array<Record<string, unknown>>;
    };
    private getTransporter;
    send(payload: MailPayload): Promise<void>;
}
