type EmailLocale = "uk" | "en";
export declare function buildVerificationEmail(opts: {
    name?: string | null;
    code: string;
    locale: EmailLocale;
    logoUrl: string;
    siteUrl: string;
}): {
    subject: string;
    html: string;
    text: string;
};
export declare function buildWelcomeEmail(opts: {
    name?: string | null;
    locale: EmailLocale;
    logoUrl: string;
    siteUrl: string;
}): {
    subject: string;
    html: string;
    text: string;
};
export {};
