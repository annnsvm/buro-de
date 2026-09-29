import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly RefreshToken: "RefreshToken";
    readonly PendingRegistration: "PendingRegistration";
    readonly StudentProfile: "StudentProfile";
    readonly TeacherProfile: "TeacherProfile";
    readonly Course: "Course";
    readonly CourseModule: "CourseModule";
    readonly CourseMaterial: "CourseMaterial";
    readonly MaterialAttachment: "MaterialAttachment";
    readonly UserCourseAccess: "UserCourseAccess";
    readonly Subscription: "Subscription";
    readonly Payment: "Payment";
    readonly PaymentWebhookEvent: "PaymentWebhookEvent";
    readonly StripeWebhookEvent: "StripeWebhookEvent";
    readonly CourseProgress: "CourseProgress";
    readonly WritingSubmission: "WritingSubmission";
    readonly QuizAttempt: "QuizAttempt";
    readonly LessonRequest: "LessonRequest";
    readonly UserVocabularyEntry: "UserVocabularyEntry";
    readonly PlacementQuestion: "PlacementQuestion";
    readonly PlacementResult: "PlacementResult";
    readonly Question: "Question";
    readonly QuestionAttempt: "QuestionAttempt";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "refreshToken" | "pendingRegistration" | "studentProfile" | "teacherProfile" | "course" | "courseModule" | "courseMaterial" | "materialAttachment" | "userCourseAccess" | "subscription" | "payment" | "paymentWebhookEvent" | "stripeWebhookEvent" | "courseProgress" | "writingSubmission" | "quizAttempt" | "lessonRequest" | "userVocabularyEntry" | "placementQuestion" | "placementResult" | "question" | "questionAttempt";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        RefreshToken: {
            payload: Prisma.$RefreshTokenPayload<ExtArgs>;
            fields: Prisma.RefreshTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findFirst: {
                    args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findMany: {
                    args: Prisma.RefreshTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                create: {
                    args: Prisma.RefreshTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                createMany: {
                    args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                delete: {
                    args: Prisma.RefreshTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                update: {
                    args: Prisma.RefreshTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                upsert: {
                    args: Prisma.RefreshTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                aggregate: {
                    args: Prisma.RefreshTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefreshToken>;
                };
                groupBy: {
                    args: Prisma.RefreshTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RefreshTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenCountAggregateOutputType> | number;
                };
            };
        };
        PendingRegistration: {
            payload: Prisma.$PendingRegistrationPayload<ExtArgs>;
            fields: Prisma.PendingRegistrationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PendingRegistrationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PendingRegistrationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>;
                };
                findFirst: {
                    args: Prisma.PendingRegistrationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PendingRegistrationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>;
                };
                findMany: {
                    args: Prisma.PendingRegistrationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>[];
                };
                create: {
                    args: Prisma.PendingRegistrationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>;
                };
                createMany: {
                    args: Prisma.PendingRegistrationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PendingRegistrationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>[];
                };
                delete: {
                    args: Prisma.PendingRegistrationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>;
                };
                update: {
                    args: Prisma.PendingRegistrationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>;
                };
                deleteMany: {
                    args: Prisma.PendingRegistrationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PendingRegistrationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PendingRegistrationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>[];
                };
                upsert: {
                    args: Prisma.PendingRegistrationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>;
                };
                aggregate: {
                    args: Prisma.PendingRegistrationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePendingRegistration>;
                };
                groupBy: {
                    args: Prisma.PendingRegistrationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PendingRegistrationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PendingRegistrationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PendingRegistrationCountAggregateOutputType> | number;
                };
            };
        };
        StudentProfile: {
            payload: Prisma.$StudentProfilePayload<ExtArgs>;
            fields: Prisma.StudentProfileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StudentProfileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StudentProfileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>;
                };
                findFirst: {
                    args: Prisma.StudentProfileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StudentProfileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>;
                };
                findMany: {
                    args: Prisma.StudentProfileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>[];
                };
                create: {
                    args: Prisma.StudentProfileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>;
                };
                createMany: {
                    args: Prisma.StudentProfileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StudentProfileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>[];
                };
                delete: {
                    args: Prisma.StudentProfileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>;
                };
                update: {
                    args: Prisma.StudentProfileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>;
                };
                deleteMany: {
                    args: Prisma.StudentProfileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StudentProfileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StudentProfileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>[];
                };
                upsert: {
                    args: Prisma.StudentProfileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StudentProfilePayload>;
                };
                aggregate: {
                    args: Prisma.StudentProfileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStudentProfile>;
                };
                groupBy: {
                    args: Prisma.StudentProfileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StudentProfileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StudentProfileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StudentProfileCountAggregateOutputType> | number;
                };
            };
        };
        TeacherProfile: {
            payload: Prisma.$TeacherProfilePayload<ExtArgs>;
            fields: Prisma.TeacherProfileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeacherProfileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeacherProfileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>;
                };
                findFirst: {
                    args: Prisma.TeacherProfileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeacherProfileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>;
                };
                findMany: {
                    args: Prisma.TeacherProfileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>[];
                };
                create: {
                    args: Prisma.TeacherProfileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>;
                };
                createMany: {
                    args: Prisma.TeacherProfileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TeacherProfileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>[];
                };
                delete: {
                    args: Prisma.TeacherProfileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>;
                };
                update: {
                    args: Prisma.TeacherProfileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>;
                };
                deleteMany: {
                    args: Prisma.TeacherProfileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeacherProfileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TeacherProfileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>[];
                };
                upsert: {
                    args: Prisma.TeacherProfileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeacherProfilePayload>;
                };
                aggregate: {
                    args: Prisma.TeacherProfileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeacherProfile>;
                };
                groupBy: {
                    args: Prisma.TeacherProfileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeacherProfileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TeacherProfileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeacherProfileCountAggregateOutputType> | number;
                };
            };
        };
        Course: {
            payload: Prisma.$CoursePayload<ExtArgs>;
            fields: Prisma.CourseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                findFirst: {
                    args: Prisma.CourseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                findMany: {
                    args: Prisma.CourseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>[];
                };
                create: {
                    args: Prisma.CourseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                createMany: {
                    args: Prisma.CourseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>[];
                };
                delete: {
                    args: Prisma.CourseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                update: {
                    args: Prisma.CourseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                deleteMany: {
                    args: Prisma.CourseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>[];
                };
                upsert: {
                    args: Prisma.CourseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                aggregate: {
                    args: Prisma.CourseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourse>;
                };
                groupBy: {
                    args: Prisma.CourseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseCountAggregateOutputType> | number;
                };
            };
        };
        CourseModule: {
            payload: Prisma.$CourseModulePayload<ExtArgs>;
            fields: Prisma.CourseModuleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourseModuleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourseModuleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>;
                };
                findFirst: {
                    args: Prisma.CourseModuleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourseModuleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>;
                };
                findMany: {
                    args: Prisma.CourseModuleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>[];
                };
                create: {
                    args: Prisma.CourseModuleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>;
                };
                createMany: {
                    args: Prisma.CourseModuleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourseModuleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>[];
                };
                delete: {
                    args: Prisma.CourseModuleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>;
                };
                update: {
                    args: Prisma.CourseModuleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>;
                };
                deleteMany: {
                    args: Prisma.CourseModuleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourseModuleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourseModuleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>[];
                };
                upsert: {
                    args: Prisma.CourseModuleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseModulePayload>;
                };
                aggregate: {
                    args: Prisma.CourseModuleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourseModule>;
                };
                groupBy: {
                    args: Prisma.CourseModuleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseModuleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourseModuleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseModuleCountAggregateOutputType> | number;
                };
            };
        };
        CourseMaterial: {
            payload: Prisma.$CourseMaterialPayload<ExtArgs>;
            fields: Prisma.CourseMaterialFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourseMaterialFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourseMaterialFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>;
                };
                findFirst: {
                    args: Prisma.CourseMaterialFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourseMaterialFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>;
                };
                findMany: {
                    args: Prisma.CourseMaterialFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>[];
                };
                create: {
                    args: Prisma.CourseMaterialCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>;
                };
                createMany: {
                    args: Prisma.CourseMaterialCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourseMaterialCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>[];
                };
                delete: {
                    args: Prisma.CourseMaterialDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>;
                };
                update: {
                    args: Prisma.CourseMaterialUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>;
                };
                deleteMany: {
                    args: Prisma.CourseMaterialDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourseMaterialUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourseMaterialUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>[];
                };
                upsert: {
                    args: Prisma.CourseMaterialUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseMaterialPayload>;
                };
                aggregate: {
                    args: Prisma.CourseMaterialAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourseMaterial>;
                };
                groupBy: {
                    args: Prisma.CourseMaterialGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseMaterialGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourseMaterialCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseMaterialCountAggregateOutputType> | number;
                };
            };
        };
        MaterialAttachment: {
            payload: Prisma.$MaterialAttachmentPayload<ExtArgs>;
            fields: Prisma.MaterialAttachmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MaterialAttachmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MaterialAttachmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>;
                };
                findFirst: {
                    args: Prisma.MaterialAttachmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MaterialAttachmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>;
                };
                findMany: {
                    args: Prisma.MaterialAttachmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>[];
                };
                create: {
                    args: Prisma.MaterialAttachmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>;
                };
                createMany: {
                    args: Prisma.MaterialAttachmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MaterialAttachmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>[];
                };
                delete: {
                    args: Prisma.MaterialAttachmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>;
                };
                update: {
                    args: Prisma.MaterialAttachmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>;
                };
                deleteMany: {
                    args: Prisma.MaterialAttachmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MaterialAttachmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MaterialAttachmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>[];
                };
                upsert: {
                    args: Prisma.MaterialAttachmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MaterialAttachmentPayload>;
                };
                aggregate: {
                    args: Prisma.MaterialAttachmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMaterialAttachment>;
                };
                groupBy: {
                    args: Prisma.MaterialAttachmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MaterialAttachmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MaterialAttachmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MaterialAttachmentCountAggregateOutputType> | number;
                };
            };
        };
        UserCourseAccess: {
            payload: Prisma.$UserCourseAccessPayload<ExtArgs>;
            fields: Prisma.UserCourseAccessFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserCourseAccessFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserCourseAccessFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>;
                };
                findFirst: {
                    args: Prisma.UserCourseAccessFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserCourseAccessFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>;
                };
                findMany: {
                    args: Prisma.UserCourseAccessFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>[];
                };
                create: {
                    args: Prisma.UserCourseAccessCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>;
                };
                createMany: {
                    args: Prisma.UserCourseAccessCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCourseAccessCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>[];
                };
                delete: {
                    args: Prisma.UserCourseAccessDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>;
                };
                update: {
                    args: Prisma.UserCourseAccessUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>;
                };
                deleteMany: {
                    args: Prisma.UserCourseAccessDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserCourseAccessUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserCourseAccessUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>[];
                };
                upsert: {
                    args: Prisma.UserCourseAccessUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseAccessPayload>;
                };
                aggregate: {
                    args: Prisma.UserCourseAccessAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserCourseAccess>;
                };
                groupBy: {
                    args: Prisma.UserCourseAccessGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCourseAccessGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCourseAccessCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCourseAccessCountAggregateOutputType> | number;
                };
            };
        };
        Subscription: {
            payload: Prisma.$SubscriptionPayload<ExtArgs>;
            fields: Prisma.SubscriptionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                findFirst: {
                    args: Prisma.SubscriptionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                findMany: {
                    args: Prisma.SubscriptionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
                };
                create: {
                    args: Prisma.SubscriptionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                createMany: {
                    args: Prisma.SubscriptionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
                };
                delete: {
                    args: Prisma.SubscriptionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                update: {
                    args: Prisma.SubscriptionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                deleteMany: {
                    args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>[];
                };
                upsert: {
                    args: Prisma.SubscriptionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionPayload>;
                };
                aggregate: {
                    args: Prisma.SubscriptionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubscription>;
                };
                groupBy: {
                    args: Prisma.SubscriptionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubscriptionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionCountAggregateOutputType> | number;
                };
            };
        };
        Payment: {
            payload: Prisma.$PaymentPayload<ExtArgs>;
            fields: Prisma.PaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findMany: {
                    args: Prisma.PaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                create: {
                    args: Prisma.PaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                createMany: {
                    args: Prisma.PaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                delete: {
                    args: Prisma.PaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                update: {
                    args: Prisma.PaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                upsert: {
                    args: Prisma.PaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePayment>;
                };
                groupBy: {
                    args: Prisma.PaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentCountAggregateOutputType> | number;
                };
            };
        };
        PaymentWebhookEvent: {
            payload: Prisma.$PaymentWebhookEventPayload<ExtArgs>;
            fields: Prisma.PaymentWebhookEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentWebhookEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentWebhookEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentWebhookEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentWebhookEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>;
                };
                findMany: {
                    args: Prisma.PaymentWebhookEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>[];
                };
                create: {
                    args: Prisma.PaymentWebhookEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>;
                };
                createMany: {
                    args: Prisma.PaymentWebhookEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PaymentWebhookEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>[];
                };
                delete: {
                    args: Prisma.PaymentWebhookEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>;
                };
                update: {
                    args: Prisma.PaymentWebhookEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentWebhookEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentWebhookEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PaymentWebhookEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>[];
                };
                upsert: {
                    args: Prisma.PaymentWebhookEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentWebhookEventPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentWebhookEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePaymentWebhookEvent>;
                };
                groupBy: {
                    args: Prisma.PaymentWebhookEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentWebhookEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentWebhookEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentWebhookEventCountAggregateOutputType> | number;
                };
            };
        };
        StripeWebhookEvent: {
            payload: Prisma.$StripeWebhookEventPayload<ExtArgs>;
            fields: Prisma.StripeWebhookEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StripeWebhookEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StripeWebhookEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>;
                };
                findFirst: {
                    args: Prisma.StripeWebhookEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StripeWebhookEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>;
                };
                findMany: {
                    args: Prisma.StripeWebhookEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>[];
                };
                create: {
                    args: Prisma.StripeWebhookEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>;
                };
                createMany: {
                    args: Prisma.StripeWebhookEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StripeWebhookEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>[];
                };
                delete: {
                    args: Prisma.StripeWebhookEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>;
                };
                update: {
                    args: Prisma.StripeWebhookEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>;
                };
                deleteMany: {
                    args: Prisma.StripeWebhookEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StripeWebhookEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StripeWebhookEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>[];
                };
                upsert: {
                    args: Prisma.StripeWebhookEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StripeWebhookEventPayload>;
                };
                aggregate: {
                    args: Prisma.StripeWebhookEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStripeWebhookEvent>;
                };
                groupBy: {
                    args: Prisma.StripeWebhookEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StripeWebhookEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StripeWebhookEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StripeWebhookEventCountAggregateOutputType> | number;
                };
            };
        };
        CourseProgress: {
            payload: Prisma.$CourseProgressPayload<ExtArgs>;
            fields: Prisma.CourseProgressFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourseProgressFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourseProgressFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>;
                };
                findFirst: {
                    args: Prisma.CourseProgressFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourseProgressFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>;
                };
                findMany: {
                    args: Prisma.CourseProgressFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>[];
                };
                create: {
                    args: Prisma.CourseProgressCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>;
                };
                createMany: {
                    args: Prisma.CourseProgressCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourseProgressCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>[];
                };
                delete: {
                    args: Prisma.CourseProgressDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>;
                };
                update: {
                    args: Prisma.CourseProgressUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>;
                };
                deleteMany: {
                    args: Prisma.CourseProgressDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourseProgressUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourseProgressUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>[];
                };
                upsert: {
                    args: Prisma.CourseProgressUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseProgressPayload>;
                };
                aggregate: {
                    args: Prisma.CourseProgressAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourseProgress>;
                };
                groupBy: {
                    args: Prisma.CourseProgressGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseProgressGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourseProgressCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseProgressCountAggregateOutputType> | number;
                };
            };
        };
        WritingSubmission: {
            payload: Prisma.$WritingSubmissionPayload<ExtArgs>;
            fields: Prisma.WritingSubmissionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WritingSubmissionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WritingSubmissionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>;
                };
                findFirst: {
                    args: Prisma.WritingSubmissionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WritingSubmissionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>;
                };
                findMany: {
                    args: Prisma.WritingSubmissionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>[];
                };
                create: {
                    args: Prisma.WritingSubmissionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>;
                };
                createMany: {
                    args: Prisma.WritingSubmissionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WritingSubmissionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>[];
                };
                delete: {
                    args: Prisma.WritingSubmissionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>;
                };
                update: {
                    args: Prisma.WritingSubmissionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>;
                };
                deleteMany: {
                    args: Prisma.WritingSubmissionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WritingSubmissionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WritingSubmissionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>[];
                };
                upsert: {
                    args: Prisma.WritingSubmissionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WritingSubmissionPayload>;
                };
                aggregate: {
                    args: Prisma.WritingSubmissionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWritingSubmission>;
                };
                groupBy: {
                    args: Prisma.WritingSubmissionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WritingSubmissionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WritingSubmissionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WritingSubmissionCountAggregateOutputType> | number;
                };
            };
        };
        QuizAttempt: {
            payload: Prisma.$QuizAttemptPayload<ExtArgs>;
            fields: Prisma.QuizAttemptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.QuizAttemptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.QuizAttemptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>;
                };
                findFirst: {
                    args: Prisma.QuizAttemptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.QuizAttemptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>;
                };
                findMany: {
                    args: Prisma.QuizAttemptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>[];
                };
                create: {
                    args: Prisma.QuizAttemptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>;
                };
                createMany: {
                    args: Prisma.QuizAttemptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.QuizAttemptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>[];
                };
                delete: {
                    args: Prisma.QuizAttemptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>;
                };
                update: {
                    args: Prisma.QuizAttemptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>;
                };
                deleteMany: {
                    args: Prisma.QuizAttemptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.QuizAttemptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.QuizAttemptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>[];
                };
                upsert: {
                    args: Prisma.QuizAttemptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizAttemptPayload>;
                };
                aggregate: {
                    args: Prisma.QuizAttemptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateQuizAttempt>;
                };
                groupBy: {
                    args: Prisma.QuizAttemptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuizAttemptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.QuizAttemptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuizAttemptCountAggregateOutputType> | number;
                };
            };
        };
        LessonRequest: {
            payload: Prisma.$LessonRequestPayload<ExtArgs>;
            fields: Prisma.LessonRequestFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LessonRequestFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LessonRequestFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>;
                };
                findFirst: {
                    args: Prisma.LessonRequestFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LessonRequestFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>;
                };
                findMany: {
                    args: Prisma.LessonRequestFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>[];
                };
                create: {
                    args: Prisma.LessonRequestCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>;
                };
                createMany: {
                    args: Prisma.LessonRequestCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LessonRequestCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>[];
                };
                delete: {
                    args: Prisma.LessonRequestDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>;
                };
                update: {
                    args: Prisma.LessonRequestUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>;
                };
                deleteMany: {
                    args: Prisma.LessonRequestDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LessonRequestUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LessonRequestUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>[];
                };
                upsert: {
                    args: Prisma.LessonRequestUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LessonRequestPayload>;
                };
                aggregate: {
                    args: Prisma.LessonRequestAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLessonRequest>;
                };
                groupBy: {
                    args: Prisma.LessonRequestGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LessonRequestGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LessonRequestCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LessonRequestCountAggregateOutputType> | number;
                };
            };
        };
        UserVocabularyEntry: {
            payload: Prisma.$UserVocabularyEntryPayload<ExtArgs>;
            fields: Prisma.UserVocabularyEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserVocabularyEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserVocabularyEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>;
                };
                findFirst: {
                    args: Prisma.UserVocabularyEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserVocabularyEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>;
                };
                findMany: {
                    args: Prisma.UserVocabularyEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>[];
                };
                create: {
                    args: Prisma.UserVocabularyEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>;
                };
                createMany: {
                    args: Prisma.UserVocabularyEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserVocabularyEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>[];
                };
                delete: {
                    args: Prisma.UserVocabularyEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>;
                };
                update: {
                    args: Prisma.UserVocabularyEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.UserVocabularyEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserVocabularyEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserVocabularyEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>[];
                };
                upsert: {
                    args: Prisma.UserVocabularyEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserVocabularyEntryPayload>;
                };
                aggregate: {
                    args: Prisma.UserVocabularyEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserVocabularyEntry>;
                };
                groupBy: {
                    args: Prisma.UserVocabularyEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserVocabularyEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserVocabularyEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserVocabularyEntryCountAggregateOutputType> | number;
                };
            };
        };
        PlacementQuestion: {
            payload: Prisma.$PlacementQuestionPayload<ExtArgs>;
            fields: Prisma.PlacementQuestionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PlacementQuestionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PlacementQuestionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>;
                };
                findFirst: {
                    args: Prisma.PlacementQuestionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PlacementQuestionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>;
                };
                findMany: {
                    args: Prisma.PlacementQuestionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>[];
                };
                create: {
                    args: Prisma.PlacementQuestionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>;
                };
                createMany: {
                    args: Prisma.PlacementQuestionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PlacementQuestionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>[];
                };
                delete: {
                    args: Prisma.PlacementQuestionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>;
                };
                update: {
                    args: Prisma.PlacementQuestionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>;
                };
                deleteMany: {
                    args: Prisma.PlacementQuestionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PlacementQuestionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PlacementQuestionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>[];
                };
                upsert: {
                    args: Prisma.PlacementQuestionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementQuestionPayload>;
                };
                aggregate: {
                    args: Prisma.PlacementQuestionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePlacementQuestion>;
                };
                groupBy: {
                    args: Prisma.PlacementQuestionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlacementQuestionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PlacementQuestionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlacementQuestionCountAggregateOutputType> | number;
                };
            };
        };
        PlacementResult: {
            payload: Prisma.$PlacementResultPayload<ExtArgs>;
            fields: Prisma.PlacementResultFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PlacementResultFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PlacementResultFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>;
                };
                findFirst: {
                    args: Prisma.PlacementResultFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PlacementResultFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>;
                };
                findMany: {
                    args: Prisma.PlacementResultFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>[];
                };
                create: {
                    args: Prisma.PlacementResultCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>;
                };
                createMany: {
                    args: Prisma.PlacementResultCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PlacementResultCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>[];
                };
                delete: {
                    args: Prisma.PlacementResultDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>;
                };
                update: {
                    args: Prisma.PlacementResultUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>;
                };
                deleteMany: {
                    args: Prisma.PlacementResultDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PlacementResultUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PlacementResultUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>[];
                };
                upsert: {
                    args: Prisma.PlacementResultUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlacementResultPayload>;
                };
                aggregate: {
                    args: Prisma.PlacementResultAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePlacementResult>;
                };
                groupBy: {
                    args: Prisma.PlacementResultGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlacementResultGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PlacementResultCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlacementResultCountAggregateOutputType> | number;
                };
            };
        };
        Question: {
            payload: Prisma.$QuestionPayload<ExtArgs>;
            fields: Prisma.QuestionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.QuestionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.QuestionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>;
                };
                findFirst: {
                    args: Prisma.QuestionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.QuestionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>;
                };
                findMany: {
                    args: Prisma.QuestionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>[];
                };
                create: {
                    args: Prisma.QuestionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>;
                };
                createMany: {
                    args: Prisma.QuestionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.QuestionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>[];
                };
                delete: {
                    args: Prisma.QuestionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>;
                };
                update: {
                    args: Prisma.QuestionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>;
                };
                deleteMany: {
                    args: Prisma.QuestionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.QuestionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.QuestionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>[];
                };
                upsert: {
                    args: Prisma.QuestionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionPayload>;
                };
                aggregate: {
                    args: Prisma.QuestionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateQuestion>;
                };
                groupBy: {
                    args: Prisma.QuestionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuestionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.QuestionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuestionCountAggregateOutputType> | number;
                };
            };
        };
        QuestionAttempt: {
            payload: Prisma.$QuestionAttemptPayload<ExtArgs>;
            fields: Prisma.QuestionAttemptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.QuestionAttemptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.QuestionAttemptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>;
                };
                findFirst: {
                    args: Prisma.QuestionAttemptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.QuestionAttemptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>;
                };
                findMany: {
                    args: Prisma.QuestionAttemptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>[];
                };
                create: {
                    args: Prisma.QuestionAttemptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>;
                };
                createMany: {
                    args: Prisma.QuestionAttemptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.QuestionAttemptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>[];
                };
                delete: {
                    args: Prisma.QuestionAttemptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>;
                };
                update: {
                    args: Prisma.QuestionAttemptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>;
                };
                deleteMany: {
                    args: Prisma.QuestionAttemptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.QuestionAttemptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.QuestionAttemptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>[];
                };
                upsert: {
                    args: Prisma.QuestionAttemptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuestionAttemptPayload>;
                };
                aggregate: {
                    args: Prisma.QuestionAttemptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateQuestionAttempt>;
                };
                groupBy: {
                    args: Prisma.QuestionAttemptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuestionAttemptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.QuestionAttemptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuestionAttemptCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly name: "name";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly language: "language";
    readonly stripeCustomerId: "stripeCustomerId";
    readonly deletedAt: "deletedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tokenHash: "tokenHash";
    readonly expiresAt: "expiresAt";
    readonly revokedAt: "revokedAt";
    readonly createdAt: "createdAt";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const PendingRegistrationScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly name: "name";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly language: "language";
    readonly locale: "locale";
    readonly codeHash: "codeHash";
    readonly expiresAt: "expiresAt";
    readonly attempts: "attempts";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PendingRegistrationScalarFieldEnum = (typeof PendingRegistrationScalarFieldEnum)[keyof typeof PendingRegistrationScalarFieldEnum];
export declare const StudentProfileScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly level: "level";
    readonly timezone: "timezone";
    readonly trialEndsAt: "trialEndsAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StudentProfileScalarFieldEnum = (typeof StudentProfileScalarFieldEnum)[keyof typeof StudentProfileScalarFieldEnum];
export declare const TeacherProfileScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly bio: "bio";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TeacherProfileScalarFieldEnum = (typeof TeacherProfileScalarFieldEnum)[keyof typeof TeacherProfileScalarFieldEnum];
export declare const CourseScalarFieldEnum: {
    readonly id: "id";
    readonly teacherId: "teacherId";
    readonly title: "title";
    readonly description: "description";
    readonly language: "language";
    readonly isPublished: "isPublished";
    readonly price: "price";
    readonly tags: "tags";
    readonly level: "level";
    readonly levelTo: "levelTo";
    readonly durationHours: "durationHours";
    readonly imageUrl: "imageUrl";
    readonly stripeProductId: "stripeProductId";
    readonly stripePriceId: "stripePriceId";
    readonly orderIndex: "orderIndex";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum];
export declare const CourseModuleScalarFieldEnum: {
    readonly id: "id";
    readonly courseId: "courseId";
    readonly title: "title";
    readonly orderIndex: "orderIndex";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourseModuleScalarFieldEnum = (typeof CourseModuleScalarFieldEnum)[keyof typeof CourseModuleScalarFieldEnum];
export declare const CourseMaterialScalarFieldEnum: {
    readonly id: "id";
    readonly moduleId: "moduleId";
    readonly type: "type";
    readonly title: "title";
    readonly content: "content";
    readonly quizMode: "quizMode";
    readonly passingScore: "passingScore";
    readonly parentMaterialId: "parentMaterialId";
    readonly orderIndex: "orderIndex";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourseMaterialScalarFieldEnum = (typeof CourseMaterialScalarFieldEnum)[keyof typeof CourseMaterialScalarFieldEnum];
export declare const MaterialAttachmentScalarFieldEnum: {
    readonly id: "id";
    readonly materialId: "materialId";
    readonly kind: "kind";
    readonly title: "title";
    readonly url: "url";
    readonly fileName: "fileName";
    readonly mimeType: "mimeType";
    readonly sizeBytes: "sizeBytes";
    readonly storageKey: "storageKey";
    readonly orderIndex: "orderIndex";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MaterialAttachmentScalarFieldEnum = (typeof MaterialAttachmentScalarFieldEnum)[keyof typeof MaterialAttachmentScalarFieldEnum];
export declare const UserCourseAccessScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseId: "courseId";
    readonly accessType: "accessType";
    readonly trialEndsAt: "trialEndsAt";
    readonly subscriptionId: "subscriptionId";
    readonly paymentId: "paymentId";
    readonly createdAt: "createdAt";
};
export type UserCourseAccessScalarFieldEnum = (typeof UserCourseAccessScalarFieldEnum)[keyof typeof UserCourseAccessScalarFieldEnum];
export declare const SubscriptionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseId: "courseId";
    readonly stripeCustomerId: "stripeCustomerId";
    readonly stripeSubscriptionId: "stripeSubscriptionId";
    readonly status: "status";
    readonly currentPeriodStart: "currentPeriodStart";
    readonly currentPeriodEnd: "currentPeriodEnd";
    readonly canceledAt: "canceledAt";
    readonly cancellationReason: "cancellationReason";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseId: "courseId";
    readonly subscriptionId: "subscriptionId";
    readonly provider: "provider";
    readonly orderReference: "orderReference";
    readonly stripeInvoiceId: "stripeInvoiceId";
    readonly amount: "amount";
    readonly currency: "currency";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const PaymentWebhookEventScalarFieldEnum: {
    readonly id: "id";
    readonly provider: "provider";
    readonly eventKey: "eventKey";
    readonly processedAt: "processedAt";
};
export type PaymentWebhookEventScalarFieldEnum = (typeof PaymentWebhookEventScalarFieldEnum)[keyof typeof PaymentWebhookEventScalarFieldEnum];
export declare const StripeWebhookEventScalarFieldEnum: {
    readonly id: "id";
    readonly stripeEventId: "stripeEventId";
    readonly processedAt: "processedAt";
};
export type StripeWebhookEventScalarFieldEnum = (typeof StripeWebhookEventScalarFieldEnum)[keyof typeof StripeWebhookEventScalarFieldEnum];
export declare const CourseProgressScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseId: "courseId";
    readonly courseMaterialId: "courseMaterialId";
    readonly completedAt: "completedAt";
    readonly score: "score";
    readonly createdAt: "createdAt";
};
export type CourseProgressScalarFieldEnum = (typeof CourseProgressScalarFieldEnum)[keyof typeof CourseProgressScalarFieldEnum];
export declare const WritingSubmissionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseMaterialId: "courseMaterialId";
    readonly text: "text";
    readonly textHash: "textHash";
    readonly score: "score";
    readonly maxScore: "maxScore";
    readonly assessment: "assessment";
    readonly inputTokens: "inputTokens";
    readonly outputTokens: "outputTokens";
    readonly createdAt: "createdAt";
};
export type WritingSubmissionScalarFieldEnum = (typeof WritingSubmissionScalarFieldEnum)[keyof typeof WritingSubmissionScalarFieldEnum];
export declare const QuizAttemptScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseMaterialId: "courseMaterialId";
    readonly score: "score";
    readonly answersSnapshot: "answersSnapshot";
    readonly completedAt: "completedAt";
    readonly createdAt: "createdAt";
};
export type QuizAttemptScalarFieldEnum = (typeof QuizAttemptScalarFieldEnum)[keyof typeof QuizAttemptScalarFieldEnum];
export declare const LessonRequestScalarFieldEnum: {
    readonly id: "id";
    readonly studentId: "studentId";
    readonly teacherId: "teacherId";
    readonly preferredTime: "preferredTime";
    readonly message: "message";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LessonRequestScalarFieldEnum = (typeof LessonRequestScalarFieldEnum)[keyof typeof LessonRequestScalarFieldEnum];
export declare const UserVocabularyEntryScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly courseId: "courseId";
    readonly word: "word";
    readonly translation: "translation";
    readonly category: "category";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserVocabularyEntryScalarFieldEnum = (typeof UserVocabularyEntryScalarFieldEnum)[keyof typeof UserVocabularyEntryScalarFieldEnum];
export declare const PlacementQuestionScalarFieldEnum: {
    readonly id: "id";
    readonly level: "level";
    readonly questionData: "questionData";
    readonly orderIndex: "orderIndex";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PlacementQuestionScalarFieldEnum = (typeof PlacementQuestionScalarFieldEnum)[keyof typeof PlacementQuestionScalarFieldEnum];
export declare const PlacementResultScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly level: "level";
    readonly rawScore: "rawScore";
    readonly completedAt: "completedAt";
};
export type PlacementResultScalarFieldEnum = (typeof PlacementResultScalarFieldEnum)[keyof typeof PlacementResultScalarFieldEnum];
export declare const QuestionScalarFieldEnum: {
    readonly id: "id";
    readonly materialId: "materialId";
    readonly type: "type";
    readonly prompt: "prompt";
    readonly payload: "payload";
    readonly acceptedAnswers: "acceptedAnswers";
    readonly explanation: "explanation";
    readonly points: "points";
    readonly skills: "skills";
    readonly block: "block";
    readonly partTitle: "partTitle";
    readonly reviewLesson: "reviewLesson";
    readonly orderIndex: "orderIndex";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum];
export declare const QuestionAttemptScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly questionId: "questionId";
    readonly quizAttemptId: "quizAttemptId";
    readonly isCorrect: "isCorrect";
    readonly rawAnswer: "rawAnswer";
    readonly answeredAt: "answeredAt";
};
export type QuestionAttemptScalarFieldEnum = (typeof QuestionAttemptScalarFieldEnum)[keyof typeof QuestionAttemptScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>;
export type EnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language'>;
export type ListEnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language[]'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Level'>;
export type ListEnumLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Level[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumCourseMaterialTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourseMaterialType'>;
export type ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourseMaterialType[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumQuizModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuizMode'>;
export type ListEnumQuizModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuizMode[]'>;
export type EnumAttachmentKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttachmentKind'>;
export type ListEnumAttachmentKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttachmentKind[]'>;
export type EnumUserCourseAccessTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserCourseAccessType'>;
export type ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserCourseAccessType[]'>;
export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>;
export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>;
export type EnumLessonRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LessonRequestStatus'>;
export type ListEnumLessonRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LessonRequestStatus[]'>;
export type EnumVocabularyCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VocabularyCategory'>;
export type ListEnumVocabularyCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VocabularyCategory[]'>;
export type EnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType'>;
export type ListEnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType[]'>;
export type EnumPracticeBlockFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PracticeBlock'>;
export type ListEnumPracticeBlockFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PracticeBlock[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    refreshToken?: Prisma.RefreshTokenOmit;
    pendingRegistration?: Prisma.PendingRegistrationOmit;
    studentProfile?: Prisma.StudentProfileOmit;
    teacherProfile?: Prisma.TeacherProfileOmit;
    course?: Prisma.CourseOmit;
    courseModule?: Prisma.CourseModuleOmit;
    courseMaterial?: Prisma.CourseMaterialOmit;
    materialAttachment?: Prisma.MaterialAttachmentOmit;
    userCourseAccess?: Prisma.UserCourseAccessOmit;
    subscription?: Prisma.SubscriptionOmit;
    payment?: Prisma.PaymentOmit;
    paymentWebhookEvent?: Prisma.PaymentWebhookEventOmit;
    stripeWebhookEvent?: Prisma.StripeWebhookEventOmit;
    courseProgress?: Prisma.CourseProgressOmit;
    writingSubmission?: Prisma.WritingSubmissionOmit;
    quizAttempt?: Prisma.QuizAttemptOmit;
    lessonRequest?: Prisma.LessonRequestOmit;
    userVocabularyEntry?: Prisma.UserVocabularyEntryOmit;
    placementQuestion?: Prisma.PlacementQuestionOmit;
    placementResult?: Prisma.PlacementResultOmit;
    question?: Prisma.QuestionOmit;
    questionAttempt?: Prisma.QuestionAttemptOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
