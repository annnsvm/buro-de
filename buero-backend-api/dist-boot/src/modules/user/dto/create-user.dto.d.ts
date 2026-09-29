export declare enum RoleEnum {
    student = "student",
    teacher = "teacher"
}
export declare enum LanguageEnum {
    en = "en",
    de = "de"
}
export declare class CreateUserDto {
    email: string;
    name?: string;
    password: string;
    role: RoleEnum;
    language?: LanguageEnum;
    locale?: "uk" | "en";
    constructor();
}
