import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    $connect(): runtime.Types.Utils.JsPromise<void>;
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get pendingRegistration(): Prisma.PendingRegistrationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get studentProfile(): Prisma.StudentProfileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get teacherProfile(): Prisma.TeacherProfileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get course(): Prisma.CourseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get courseModule(): Prisma.CourseModuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get courseMaterial(): Prisma.CourseMaterialDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get materialAttachment(): Prisma.MaterialAttachmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get userCourseAccess(): Prisma.UserCourseAccessDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get subscription(): Prisma.SubscriptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get payment(): Prisma.PaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get paymentWebhookEvent(): Prisma.PaymentWebhookEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stripeWebhookEvent(): Prisma.StripeWebhookEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get courseProgress(): Prisma.CourseProgressDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get writingSubmission(): Prisma.WritingSubmissionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get quizAttempt(): Prisma.QuizAttemptDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get lessonRequest(): Prisma.LessonRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get userVocabularyEntry(): Prisma.UserVocabularyEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get placementQuestion(): Prisma.PlacementQuestionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get placementResult(): Prisma.PlacementResultDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get question(): Prisma.QuestionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get questionAttempt(): Prisma.QuestionAttemptDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
