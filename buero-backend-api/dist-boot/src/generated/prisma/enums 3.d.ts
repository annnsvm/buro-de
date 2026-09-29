export declare const Role: {
    readonly student: "student";
    readonly teacher: "teacher";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const Language: {
    readonly en: "en";
    readonly de: "de";
};
export type Language = (typeof Language)[keyof typeof Language];
export declare const Level: {
    readonly A1: "A1";
    readonly A2: "A2";
    readonly B1: "B1";
    readonly B2: "B2";
    readonly C1: "C1";
};
export type Level = (typeof Level)[keyof typeof Level];
export declare const CourseMaterialType: {
    readonly video: "video";
    readonly vocabulary: "vocabulary";
    readonly grammar: "grammar";
    readonly quiz: "quiz";
    readonly scenario: "scenario";
    readonly cultural_insight: "cultural_insight";
    readonly homework: "homework";
    readonly text: "text";
    readonly writing: "writing";
};
export type CourseMaterialType = (typeof CourseMaterialType)[keyof typeof CourseMaterialType];
export declare const AttachmentKind: {
    readonly file: "file";
    readonly link: "link";
};
export type AttachmentKind = (typeof AttachmentKind)[keyof typeof AttachmentKind];
export declare const VocabularyCategory: {
    readonly vocabulary: "vocabulary";
    readonly idiom: "idiom";
    readonly phrase: "phrase";
    readonly grammar: "grammar";
    readonly other: "other";
};
export type VocabularyCategory = (typeof VocabularyCategory)[keyof typeof VocabularyCategory];
export declare const QuizMode: {
    readonly practice: "practice";
    readonly test: "test";
};
export type QuizMode = (typeof QuizMode)[keyof typeof QuizMode];
export declare const QuestionType: {
    readonly single_choice: "single_choice";
    readonly multi_choice: "multi_choice";
    readonly fill_blank: "fill_blank";
    readonly text_input: "text_input";
    readonly ordering: "ordering";
};
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
export declare const UserCourseAccessType: {
    readonly trial: "trial";
    readonly purchase: "purchase";
    readonly subscription: "subscription";
};
export type UserCourseAccessType = (typeof UserCourseAccessType)[keyof typeof UserCourseAccessType];
export declare const SubscriptionStatus: {
    readonly active: "active";
    readonly past_due: "past_due";
    readonly canceled: "canceled";
    readonly incomplete: "incomplete";
    readonly trialing: "trialing";
};
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export declare const LessonRequestStatus: {
    readonly pending: "pending";
    readonly accepted: "accepted";
    readonly completed: "completed";
    readonly rejected: "rejected";
};
export type LessonRequestStatus = (typeof LessonRequestStatus)[keyof typeof LessonRequestStatus];
