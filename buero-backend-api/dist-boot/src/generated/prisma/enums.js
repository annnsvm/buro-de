"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRequestStatus = exports.SubscriptionStatus = exports.UserCourseAccessType = exports.QuestionType = exports.PracticeBlock = exports.QuizMode = exports.VocabularyCategory = exports.AttachmentKind = exports.CourseMaterialType = exports.Level = exports.Language = exports.Role = void 0;
exports.Role = {
    student: 'student',
    teacher: 'teacher'
};
exports.Language = {
    en: 'en',
    de: 'de'
};
exports.Level = {
    A1: 'A1',
    A2: 'A2',
    B1: 'B1',
    B2: 'B2',
    C1: 'C1'
};
exports.CourseMaterialType = {
    video: 'video',
    vocabulary: 'vocabulary',
    grammar: 'grammar',
    quiz: 'quiz',
    scenario: 'scenario',
    cultural_insight: 'cultural_insight',
    homework: 'homework',
    text: 'text',
    writing: 'writing',
    practice: 'practice'
};
exports.AttachmentKind = {
    file: 'file',
    link: 'link'
};
exports.VocabularyCategory = {
    vocabulary: 'vocabulary',
    idiom: 'idiom',
    phrase: 'phrase',
    grammar: 'grammar',
    other: 'other'
};
exports.QuizMode = {
    practice: 'practice',
    test: 'test'
};
exports.PracticeBlock = {
    grammatik: 'grammatik',
    lesen: 'lesen',
    horen: 'horen',
    sprechen: 'sprechen'
};
exports.QuestionType = {
    single_choice: 'single_choice',
    multi_choice: 'multi_choice',
    fill_blank: 'fill_blank',
    text_input: 'text_input',
    ordering: 'ordering'
};
exports.UserCourseAccessType = {
    trial: 'trial',
    purchase: 'purchase',
    subscription: 'subscription'
};
exports.SubscriptionStatus = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    incomplete: 'incomplete',
    trialing: 'trialing'
};
exports.LessonRequestStatus = {
    pending: 'pending',
    accepted: 'accepted',
    completed: 'completed',
    rejected: 'rejected'
};
//# sourceMappingURL=enums.js.map