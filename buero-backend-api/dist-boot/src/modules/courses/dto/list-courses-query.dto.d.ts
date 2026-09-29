import { Language, Level } from "../../../generated/prisma/enums";
export declare enum PublicationStatus {
    all = "all",
    published = "published",
    unpublished = "unpublished"
}
export declare class ListCoursesQueryDto {
    search?: string;
    language?: Language;
    tags?: string;
    tags_exclude?: string;
    level?: Level;
    publication_status?: PublicationStatus;
}
