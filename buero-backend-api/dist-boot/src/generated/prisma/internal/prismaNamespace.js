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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.JsonNullValueInput = exports.SortOrder = exports.QuestionAttemptScalarFieldEnum = exports.QuestionScalarFieldEnum = exports.PlacementResultScalarFieldEnum = exports.PlacementQuestionScalarFieldEnum = exports.UserVocabularyEntryScalarFieldEnum = exports.LessonRequestScalarFieldEnum = exports.QuizAttemptScalarFieldEnum = exports.WritingSubmissionScalarFieldEnum = exports.CourseProgressScalarFieldEnum = exports.StripeWebhookEventScalarFieldEnum = exports.PaymentWebhookEventScalarFieldEnum = exports.PaymentScalarFieldEnum = exports.SubscriptionScalarFieldEnum = exports.UserCourseAccessScalarFieldEnum = exports.MaterialAttachmentScalarFieldEnum = exports.CourseMaterialScalarFieldEnum = exports.CourseModuleScalarFieldEnum = exports.CourseScalarFieldEnum = exports.TeacherProfileScalarFieldEnum = exports.StudentProfileScalarFieldEnum = exports.PendingRegistrationScalarFieldEnum = exports.RefreshTokenScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.5.0",
    engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    RefreshToken: 'RefreshToken',
    PendingRegistration: 'PendingRegistration',
    StudentProfile: 'StudentProfile',
    TeacherProfile: 'TeacherProfile',
    Course: 'Course',
    CourseModule: 'CourseModule',
    CourseMaterial: 'CourseMaterial',
    MaterialAttachment: 'MaterialAttachment',
    UserCourseAccess: 'UserCourseAccess',
    Subscription: 'Subscription',
    Payment: 'Payment',
    PaymentWebhookEvent: 'PaymentWebhookEvent',
    StripeWebhookEvent: 'StripeWebhookEvent',
    CourseProgress: 'CourseProgress',
    WritingSubmission: 'WritingSubmission',
    QuizAttempt: 'QuizAttempt',
    LessonRequest: 'LessonRequest',
    UserVocabularyEntry: 'UserVocabularyEntry',
    PlacementQuestion: 'PlacementQuestion',
    PlacementResult: 'PlacementResult',
    Question: 'Question',
    QuestionAttempt: 'QuestionAttempt'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
    language: 'language',
    stripeCustomerId: 'stripeCustomerId',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RefreshTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt'
};
exports.PendingRegistrationScalarFieldEnum = {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
    language: 'language',
    locale: 'locale',
    codeHash: 'codeHash',
    expiresAt: 'expiresAt',
    attempts: 'attempts',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.StudentProfileScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    level: 'level',
    timezone: 'timezone',
    trialEndsAt: 'trialEndsAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TeacherProfileScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    bio: 'bio',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourseScalarFieldEnum = {
    id: 'id',
    teacherId: 'teacherId',
    title: 'title',
    description: 'description',
    language: 'language',
    isPublished: 'isPublished',
    price: 'price',
    tags: 'tags',
    level: 'level',
    levelTo: 'levelTo',
    durationHours: 'durationHours',
    imageUrl: 'imageUrl',
    stripeProductId: 'stripeProductId',
    stripePriceId: 'stripePriceId',
    orderIndex: 'orderIndex',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourseModuleScalarFieldEnum = {
    id: 'id',
    courseId: 'courseId',
    title: 'title',
    orderIndex: 'orderIndex',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourseMaterialScalarFieldEnum = {
    id: 'id',
    moduleId: 'moduleId',
    type: 'type',
    title: 'title',
    content: 'content',
    quizMode: 'quizMode',
    passingScore: 'passingScore',
    parentMaterialId: 'parentMaterialId',
    orderIndex: 'orderIndex',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.MaterialAttachmentScalarFieldEnum = {
    id: 'id',
    materialId: 'materialId',
    kind: 'kind',
    title: 'title',
    url: 'url',
    fileName: 'fileName',
    mimeType: 'mimeType',
    sizeBytes: 'sizeBytes',
    storageKey: 'storageKey',
    orderIndex: 'orderIndex',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserCourseAccessScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    accessType: 'accessType',
    trialEndsAt: 'trialEndsAt',
    subscriptionId: 'subscriptionId',
    paymentId: 'paymentId',
    createdAt: 'createdAt'
};
exports.SubscriptionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    status: 'status',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    canceledAt: 'canceledAt',
    cancellationReason: 'cancellationReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PaymentScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    subscriptionId: 'subscriptionId',
    provider: 'provider',
    orderReference: 'orderReference',
    stripeInvoiceId: 'stripeInvoiceId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PaymentWebhookEventScalarFieldEnum = {
    id: 'id',
    provider: 'provider',
    eventKey: 'eventKey',
    processedAt: 'processedAt'
};
exports.StripeWebhookEventScalarFieldEnum = {
    id: 'id',
    stripeEventId: 'stripeEventId',
    processedAt: 'processedAt'
};
exports.CourseProgressScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    courseMaterialId: 'courseMaterialId',
    completedAt: 'completedAt',
    score: 'score',
    createdAt: 'createdAt'
};
exports.WritingSubmissionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    courseMaterialId: 'courseMaterialId',
    text: 'text',
    textHash: 'textHash',
    score: 'score',
    maxScore: 'maxScore',
    assessment: 'assessment',
    inputTokens: 'inputTokens',
    outputTokens: 'outputTokens',
    createdAt: 'createdAt'
};
exports.QuizAttemptScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    courseMaterialId: 'courseMaterialId',
    score: 'score',
    answersSnapshot: 'answersSnapshot',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
};
exports.LessonRequestScalarFieldEnum = {
    id: 'id',
    studentId: 'studentId',
    teacherId: 'teacherId',
    preferredTime: 'preferredTime',
    message: 'message',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserVocabularyEntryScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    word: 'word',
    translation: 'translation',
    category: 'category',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PlacementQuestionScalarFieldEnum = {
    id: 'id',
    level: 'level',
    questionData: 'questionData',
    orderIndex: 'orderIndex',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PlacementResultScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    level: 'level',
    rawScore: 'rawScore',
    completedAt: 'completedAt'
};
exports.QuestionScalarFieldEnum = {
    id: 'id',
    materialId: 'materialId',
    type: 'type',
    prompt: 'prompt',
    payload: 'payload',
    acceptedAnswers: 'acceptedAnswers',
    explanation: 'explanation',
    points: 'points',
    skills: 'skills',
    block: 'block',
    partTitle: 'partTitle',
    reviewLesson: 'reviewLesson',
    orderIndex: 'orderIndex',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.QuestionAttemptScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    questionId: 'questionId',
    quizAttemptId: 'quizAttemptId',
    isCorrect: 'isCorrect',
    rawAnswer: 'rawAnswer',
    answeredAt: 'answeredAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map