export declare function buildUserConfirmationEmail(opts: {
    name: string;
    language: "uk" | "en";
    logoUrl: string;
    siteUrl: string;
}): {
    subject: string;
    html: string;
    text: string;
};
export declare function buildInboxNotificationEmail(opts: {
    name: string;
    email: string;
    message: string;
    subject?: string;
    language: "uk" | "en";
    logoUrl: string;
    siteUrl: string;
}): {
    subject: string;
    html: string;
    text: string;
};
