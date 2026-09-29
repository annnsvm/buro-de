export declare enum LanguageEnum {
    en = "en",
    de = "de"
}
export declare class UpdateProfileDto {
    name?: string;
    timezone?: string;
    language?: LanguageEnum;
    bio?: string;
    isActive?: boolean;
}
