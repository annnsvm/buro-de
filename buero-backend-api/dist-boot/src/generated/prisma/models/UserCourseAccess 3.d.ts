import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type UserCourseAccessModel = runtime.Types.Result.DefaultSelection<Prisma.$UserCourseAccessPayload>;
export type AggregateUserCourseAccess = {
    _count: UserCourseAccessCountAggregateOutputType | null;
    _min: UserCourseAccessMinAggregateOutputType | null;
    _max: UserCourseAccessMaxAggregateOutputType | null;
};
export type UserCourseAccessMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    accessType: $Enums.UserCourseAccessType | null;
    trialEndsAt: Date | null;
    subscriptionId: string | null;
    paymentId: string | null;
    createdAt: Date | null;
};
export type UserCourseAccessMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    accessType: $Enums.UserCourseAccessType | null;
    trialEndsAt: Date | null;
    subscriptionId: string | null;
    paymentId: string | null;
    createdAt: Date | null;
};
export type UserCourseAccessCountAggregateOutputType = {
    id: number;
    userId: number;
    courseId: number;
    accessType: number;
    trialEndsAt: number;
    subscriptionId: number;
    paymentId: number;
    createdAt: number;
    _all: number;
};
export type UserCourseAccessMinAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    accessType?: true;
    trialEndsAt?: true;
    subscriptionId?: true;
    paymentId?: true;
    createdAt?: true;
};
export type UserCourseAccessMaxAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    accessType?: true;
    trialEndsAt?: true;
    subscriptionId?: true;
    paymentId?: true;
    createdAt?: true;
};
export type UserCourseAccessCountAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    accessType?: true;
    trialEndsAt?: true;
    subscriptionId?: true;
    paymentId?: true;
    createdAt?: true;
    _all?: true;
};
export type UserCourseAccessAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCourseAccessWhereInput;
    orderBy?: Prisma.UserCourseAccessOrderByWithRelationInput | Prisma.UserCourseAccessOrderByWithRelationInput[];
    cursor?: Prisma.UserCourseAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCourseAccessCountAggregateInputType;
    _min?: UserCourseAccessMinAggregateInputType;
    _max?: UserCourseAccessMaxAggregateInputType;
};
export type GetUserCourseAccessAggregateType<T extends UserCourseAccessAggregateArgs> = {
    [P in keyof T & keyof AggregateUserCourseAccess]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserCourseAccess[P]> : Prisma.GetScalarType<T[P], AggregateUserCourseAccess[P]>;
};
export type UserCourseAccessGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCourseAccessWhereInput;
    orderBy?: Prisma.UserCourseAccessOrderByWithAggregationInput | Prisma.UserCourseAccessOrderByWithAggregationInput[];
    by: Prisma.UserCourseAccessScalarFieldEnum[] | Prisma.UserCourseAccessScalarFieldEnum;
    having?: Prisma.UserCourseAccessScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCourseAccessCountAggregateInputType | true;
    _min?: UserCourseAccessMinAggregateInputType;
    _max?: UserCourseAccessMaxAggregateInputType;
};
export type UserCourseAccessGroupByOutputType = {
    id: string;
    userId: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt: Date | null;
    subscriptionId: string | null;
    paymentId: string | null;
    createdAt: Date;
    _count: UserCourseAccessCountAggregateOutputType | null;
    _min: UserCourseAccessMinAggregateOutputType | null;
    _max: UserCourseAccessMaxAggregateOutputType | null;
};
type GetUserCourseAccessGroupByPayload<T extends UserCourseAccessGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserCourseAccessGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserCourseAccessGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserCourseAccessGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserCourseAccessGroupByOutputType[P]>;
}>>;
export type UserCourseAccessWhereInput = {
    AND?: Prisma.UserCourseAccessWhereInput | Prisma.UserCourseAccessWhereInput[];
    OR?: Prisma.UserCourseAccessWhereInput[];
    NOT?: Prisma.UserCourseAccessWhereInput | Prisma.UserCourseAccessWhereInput[];
    id?: Prisma.StringFilter<"UserCourseAccess"> | string;
    userId?: Prisma.StringFilter<"UserCourseAccess"> | string;
    courseId?: Prisma.StringFilter<"UserCourseAccess"> | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFilter<"UserCourseAccess"> | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.DateTimeNullableFilter<"UserCourseAccess"> | Date | string | null;
    subscriptionId?: Prisma.StringNullableFilter<"UserCourseAccess"> | string | null;
    paymentId?: Prisma.StringNullableFilter<"UserCourseAccess"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"UserCourseAccess"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    subscription?: Prisma.XOR<Prisma.SubscriptionNullableScalarRelationFilter, Prisma.SubscriptionWhereInput> | null;
    payment?: Prisma.XOR<Prisma.PaymentNullableScalarRelationFilter, Prisma.PaymentWhereInput> | null;
};
export type UserCourseAccessOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    accessType?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    subscriptionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    paymentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    course?: Prisma.CourseOrderByWithRelationInput;
    subscription?: Prisma.SubscriptionOrderByWithRelationInput;
    payment?: Prisma.PaymentOrderByWithRelationInput;
};
export type UserCourseAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_courseId?: Prisma.UserCourseAccessUserIdCourseIdCompoundUniqueInput;
    AND?: Prisma.UserCourseAccessWhereInput | Prisma.UserCourseAccessWhereInput[];
    OR?: Prisma.UserCourseAccessWhereInput[];
    NOT?: Prisma.UserCourseAccessWhereInput | Prisma.UserCourseAccessWhereInput[];
    userId?: Prisma.StringFilter<"UserCourseAccess"> | string;
    courseId?: Prisma.StringFilter<"UserCourseAccess"> | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFilter<"UserCourseAccess"> | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.DateTimeNullableFilter<"UserCourseAccess"> | Date | string | null;
    subscriptionId?: Prisma.StringNullableFilter<"UserCourseAccess"> | string | null;
    paymentId?: Prisma.StringNullableFilter<"UserCourseAccess"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"UserCourseAccess"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    subscription?: Prisma.XOR<Prisma.SubscriptionNullableScalarRelationFilter, Prisma.SubscriptionWhereInput> | null;
    payment?: Prisma.XOR<Prisma.PaymentNullableScalarRelationFilter, Prisma.PaymentWhereInput> | null;
}, "id" | "userId_courseId">;
export type UserCourseAccessOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    accessType?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    subscriptionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    paymentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UserCourseAccessCountOrderByAggregateInput;
    _max?: Prisma.UserCourseAccessMaxOrderByAggregateInput;
    _min?: Prisma.UserCourseAccessMinOrderByAggregateInput;
};
export type UserCourseAccessScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserCourseAccessScalarWhereWithAggregatesInput | Prisma.UserCourseAccessScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserCourseAccessScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserCourseAccessScalarWhereWithAggregatesInput | Prisma.UserCourseAccessScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"UserCourseAccess"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"UserCourseAccess"> | string;
    courseId?: Prisma.StringWithAggregatesFilter<"UserCourseAccess"> | string;
    accessType?: Prisma.EnumUserCourseAccessTypeWithAggregatesFilter<"UserCourseAccess"> | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.DateTimeNullableWithAggregatesFilter<"UserCourseAccess"> | Date | string | null;
    subscriptionId?: Prisma.StringNullableWithAggregatesFilter<"UserCourseAccess"> | string | null;
    paymentId?: Prisma.StringNullableWithAggregatesFilter<"UserCourseAccess"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserCourseAccess"> | Date | string;
};
export type UserCourseAccessCreateInput = {
    id?: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutUserCourseAccessInput;
    course: Prisma.CourseCreateNestedOneWithoutUserCourseAccessInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserCourseAccessInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutUserCourseAccessInput;
};
export type UserCourseAccessUncheckedCreateInput = {
    id?: string;
    userId: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserCourseAccessNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutUserCourseAccessNestedInput;
};
export type UserCourseAccessUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessCreateManyInput = {
    id?: string;
    userId: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessListRelationFilter = {
    every?: Prisma.UserCourseAccessWhereInput;
    some?: Prisma.UserCourseAccessWhereInput;
    none?: Prisma.UserCourseAccessWhereInput;
};
export type UserCourseAccessOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserCourseAccessUserIdCourseIdCompoundUniqueInput = {
    userId: string;
    courseId: string;
};
export type UserCourseAccessCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    accessType?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrder;
    subscriptionId?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserCourseAccessMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    accessType?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrder;
    subscriptionId?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserCourseAccessMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    accessType?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrder;
    subscriptionId?: Prisma.SortOrder;
    paymentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserCourseAccessCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutUserInput, Prisma.UserCourseAccessUncheckedCreateWithoutUserInput> | Prisma.UserCourseAccessCreateWithoutUserInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutUserInput | Prisma.UserCourseAccessCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserCourseAccessCreateManyUserInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutUserInput, Prisma.UserCourseAccessUncheckedCreateWithoutUserInput> | Prisma.UserCourseAccessCreateWithoutUserInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutUserInput | Prisma.UserCourseAccessCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserCourseAccessCreateManyUserInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutUserInput, Prisma.UserCourseAccessUncheckedCreateWithoutUserInput> | Prisma.UserCourseAccessCreateWithoutUserInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutUserInput | Prisma.UserCourseAccessCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutUserInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserCourseAccessCreateManyUserInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutUserInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutUserInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type UserCourseAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutUserInput, Prisma.UserCourseAccessUncheckedCreateWithoutUserInput> | Prisma.UserCourseAccessCreateWithoutUserInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutUserInput | Prisma.UserCourseAccessCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutUserInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserCourseAccessCreateManyUserInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutUserInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutUserInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type UserCourseAccessCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutCourseInput, Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput> | Prisma.UserCourseAccessCreateWithoutCourseInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput | Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.UserCourseAccessCreateManyCourseInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUncheckedCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutCourseInput, Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput> | Prisma.UserCourseAccessCreateWithoutCourseInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput | Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.UserCourseAccessCreateManyCourseInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutCourseInput, Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput> | Prisma.UserCourseAccessCreateWithoutCourseInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput | Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutCourseInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.UserCourseAccessCreateManyCourseInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutCourseInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutCourseInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type UserCourseAccessUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutCourseInput, Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput> | Prisma.UserCourseAccessCreateWithoutCourseInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput | Prisma.UserCourseAccessCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutCourseInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.UserCourseAccessCreateManyCourseInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutCourseInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutCourseInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type EnumUserCourseAccessTypeFieldUpdateOperationsInput = {
    set?: $Enums.UserCourseAccessType;
};
export type UserCourseAccessCreateNestedManyWithoutSubscriptionInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput> | Prisma.UserCourseAccessCreateWithoutSubscriptionInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput | Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput[];
    createMany?: Prisma.UserCourseAccessCreateManySubscriptionInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput> | Prisma.UserCourseAccessCreateWithoutSubscriptionInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput | Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput[];
    createMany?: Prisma.UserCourseAccessCreateManySubscriptionInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUpdateManyWithoutSubscriptionNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput> | Prisma.UserCourseAccessCreateWithoutSubscriptionInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput | Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutSubscriptionInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutSubscriptionInput[];
    createMany?: Prisma.UserCourseAccessCreateManySubscriptionInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutSubscriptionInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutSubscriptionInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutSubscriptionInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutSubscriptionInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type UserCourseAccessUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput> | Prisma.UserCourseAccessCreateWithoutSubscriptionInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput | Prisma.UserCourseAccessCreateOrConnectWithoutSubscriptionInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutSubscriptionInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutSubscriptionInput[];
    createMany?: Prisma.UserCourseAccessCreateManySubscriptionInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutSubscriptionInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutSubscriptionInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutSubscriptionInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutSubscriptionInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type UserCourseAccessCreateNestedManyWithoutPaymentInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput> | Prisma.UserCourseAccessCreateWithoutPaymentInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput | Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput[];
    createMany?: Prisma.UserCourseAccessCreateManyPaymentInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUncheckedCreateNestedManyWithoutPaymentInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput> | Prisma.UserCourseAccessCreateWithoutPaymentInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput | Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput[];
    createMany?: Prisma.UserCourseAccessCreateManyPaymentInputEnvelope;
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
};
export type UserCourseAccessUpdateManyWithoutPaymentNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput> | Prisma.UserCourseAccessCreateWithoutPaymentInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput | Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutPaymentInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutPaymentInput[];
    createMany?: Prisma.UserCourseAccessCreateManyPaymentInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutPaymentInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutPaymentInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutPaymentInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutPaymentInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type UserCourseAccessUncheckedUpdateManyWithoutPaymentNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput> | Prisma.UserCourseAccessCreateWithoutPaymentInput[] | Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?: Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput | Prisma.UserCourseAccessCreateOrConnectWithoutPaymentInput[];
    upsert?: Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutPaymentInput | Prisma.UserCourseAccessUpsertWithWhereUniqueWithoutPaymentInput[];
    createMany?: Prisma.UserCourseAccessCreateManyPaymentInputEnvelope;
    set?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    disconnect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    delete?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    connect?: Prisma.UserCourseAccessWhereUniqueInput | Prisma.UserCourseAccessWhereUniqueInput[];
    update?: Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutPaymentInput | Prisma.UserCourseAccessUpdateWithWhereUniqueWithoutPaymentInput[];
    updateMany?: Prisma.UserCourseAccessUpdateManyWithWhereWithoutPaymentInput | Prisma.UserCourseAccessUpdateManyWithWhereWithoutPaymentInput[];
    deleteMany?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
};
export type UserCourseAccessCreateWithoutUserInput = {
    id?: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutUserCourseAccessInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserCourseAccessInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutUserCourseAccessInput;
};
export type UserCourseAccessUncheckedCreateWithoutUserInput = {
    id?: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessCreateOrConnectWithoutUserInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutUserInput, Prisma.UserCourseAccessUncheckedCreateWithoutUserInput>;
};
export type UserCourseAccessCreateManyUserInputEnvelope = {
    data: Prisma.UserCourseAccessCreateManyUserInput | Prisma.UserCourseAccessCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserCourseAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutUserInput, Prisma.UserCourseAccessUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutUserInput, Prisma.UserCourseAccessUncheckedCreateWithoutUserInput>;
};
export type UserCourseAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutUserInput, Prisma.UserCourseAccessUncheckedUpdateWithoutUserInput>;
};
export type UserCourseAccessUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserCourseAccessScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateManyMutationInput, Prisma.UserCourseAccessUncheckedUpdateManyWithoutUserInput>;
};
export type UserCourseAccessScalarWhereInput = {
    AND?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
    OR?: Prisma.UserCourseAccessScalarWhereInput[];
    NOT?: Prisma.UserCourseAccessScalarWhereInput | Prisma.UserCourseAccessScalarWhereInput[];
    id?: Prisma.StringFilter<"UserCourseAccess"> | string;
    userId?: Prisma.StringFilter<"UserCourseAccess"> | string;
    courseId?: Prisma.StringFilter<"UserCourseAccess"> | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFilter<"UserCourseAccess"> | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.DateTimeNullableFilter<"UserCourseAccess"> | Date | string | null;
    subscriptionId?: Prisma.StringNullableFilter<"UserCourseAccess"> | string | null;
    paymentId?: Prisma.StringNullableFilter<"UserCourseAccess"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"UserCourseAccess"> | Date | string;
};
export type UserCourseAccessCreateWithoutCourseInput = {
    id?: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutUserCourseAccessInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserCourseAccessInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutUserCourseAccessInput;
};
export type UserCourseAccessUncheckedCreateWithoutCourseInput = {
    id?: string;
    userId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessCreateOrConnectWithoutCourseInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutCourseInput, Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput>;
};
export type UserCourseAccessCreateManyCourseInputEnvelope = {
    data: Prisma.UserCourseAccessCreateManyCourseInput | Prisma.UserCourseAccessCreateManyCourseInput[];
    skipDuplicates?: boolean;
};
export type UserCourseAccessUpsertWithWhereUniqueWithoutCourseInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutCourseInput, Prisma.UserCourseAccessUncheckedUpdateWithoutCourseInput>;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutCourseInput, Prisma.UserCourseAccessUncheckedCreateWithoutCourseInput>;
};
export type UserCourseAccessUpdateWithWhereUniqueWithoutCourseInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutCourseInput, Prisma.UserCourseAccessUncheckedUpdateWithoutCourseInput>;
};
export type UserCourseAccessUpdateManyWithWhereWithoutCourseInput = {
    where: Prisma.UserCourseAccessScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateManyMutationInput, Prisma.UserCourseAccessUncheckedUpdateManyWithoutCourseInput>;
};
export type UserCourseAccessCreateWithoutSubscriptionInput = {
    id?: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutUserCourseAccessInput;
    course: Prisma.CourseCreateNestedOneWithoutUserCourseAccessInput;
    payment?: Prisma.PaymentCreateNestedOneWithoutUserCourseAccessInput;
};
export type UserCourseAccessUncheckedCreateWithoutSubscriptionInput = {
    id?: string;
    userId: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessCreateOrConnectWithoutSubscriptionInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput>;
};
export type UserCourseAccessCreateManySubscriptionInputEnvelope = {
    data: Prisma.UserCourseAccessCreateManySubscriptionInput | Prisma.UserCourseAccessCreateManySubscriptionInput[];
    skipDuplicates?: boolean;
};
export type UserCourseAccessUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedUpdateWithoutSubscriptionInput>;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedCreateWithoutSubscriptionInput>;
};
export type UserCourseAccessUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutSubscriptionInput, Prisma.UserCourseAccessUncheckedUpdateWithoutSubscriptionInput>;
};
export type UserCourseAccessUpdateManyWithWhereWithoutSubscriptionInput = {
    where: Prisma.UserCourseAccessScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateManyMutationInput, Prisma.UserCourseAccessUncheckedUpdateManyWithoutSubscriptionInput>;
};
export type UserCourseAccessCreateWithoutPaymentInput = {
    id?: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutUserCourseAccessInput;
    course: Prisma.CourseCreateNestedOneWithoutUserCourseAccessInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserCourseAccessInput;
};
export type UserCourseAccessUncheckedCreateWithoutPaymentInput = {
    id?: string;
    userId: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessCreateOrConnectWithoutPaymentInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput>;
};
export type UserCourseAccessCreateManyPaymentInputEnvelope = {
    data: Prisma.UserCourseAccessCreateManyPaymentInput | Prisma.UserCourseAccessCreateManyPaymentInput[];
    skipDuplicates?: boolean;
};
export type UserCourseAccessUpsertWithWhereUniqueWithoutPaymentInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedUpdateWithoutPaymentInput>;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedCreateWithoutPaymentInput>;
};
export type UserCourseAccessUpdateWithWhereUniqueWithoutPaymentInput = {
    where: Prisma.UserCourseAccessWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateWithoutPaymentInput, Prisma.UserCourseAccessUncheckedUpdateWithoutPaymentInput>;
};
export type UserCourseAccessUpdateManyWithWhereWithoutPaymentInput = {
    where: Prisma.UserCourseAccessScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateManyMutationInput, Prisma.UserCourseAccessUncheckedUpdateManyWithoutPaymentInput>;
};
export type UserCourseAccessCreateManyUserInput = {
    id?: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserCourseAccessNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutUserCourseAccessNestedInput;
};
export type UserCourseAccessUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessCreateManyCourseInput = {
    id?: string;
    userId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserCourseAccessNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutUserCourseAccessNestedInput;
};
export type UserCourseAccessUncheckedUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessUncheckedUpdateManyWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessCreateManySubscriptionInput = {
    id?: string;
    userId: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    paymentId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessUpdateWithoutSubscriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    payment?: Prisma.PaymentUpdateOneWithoutUserCourseAccessNestedInput;
};
export type UserCourseAccessUncheckedUpdateWithoutSubscriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    paymentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessCreateManyPaymentInput = {
    id?: string;
    userId: string;
    courseId: string;
    accessType: $Enums.UserCourseAccessType;
    trialEndsAt?: Date | string | null;
    subscriptionId?: string | null;
    createdAt?: Date | string;
};
export type UserCourseAccessUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutUserCourseAccessNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserCourseAccessNestedInput;
};
export type UserCourseAccessUncheckedUpdateWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessUncheckedUpdateManyWithoutPaymentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    accessType?: Prisma.EnumUserCourseAccessTypeFieldUpdateOperationsInput | $Enums.UserCourseAccessType;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    subscriptionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCourseAccessSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    accessType?: boolean;
    trialEndsAt?: boolean;
    subscriptionId?: boolean;
    paymentId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    subscription?: boolean | Prisma.UserCourseAccess$subscriptionArgs<ExtArgs>;
    payment?: boolean | Prisma.UserCourseAccess$paymentArgs<ExtArgs>;
}, ExtArgs["result"]["userCourseAccess"]>;
export type UserCourseAccessSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    accessType?: boolean;
    trialEndsAt?: boolean;
    subscriptionId?: boolean;
    paymentId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    subscription?: boolean | Prisma.UserCourseAccess$subscriptionArgs<ExtArgs>;
    payment?: boolean | Prisma.UserCourseAccess$paymentArgs<ExtArgs>;
}, ExtArgs["result"]["userCourseAccess"]>;
export type UserCourseAccessSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    accessType?: boolean;
    trialEndsAt?: boolean;
    subscriptionId?: boolean;
    paymentId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    subscription?: boolean | Prisma.UserCourseAccess$subscriptionArgs<ExtArgs>;
    payment?: boolean | Prisma.UserCourseAccess$paymentArgs<ExtArgs>;
}, ExtArgs["result"]["userCourseAccess"]>;
export type UserCourseAccessSelectScalar = {
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    accessType?: boolean;
    trialEndsAt?: boolean;
    subscriptionId?: boolean;
    paymentId?: boolean;
    createdAt?: boolean;
};
export type UserCourseAccessOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "courseId" | "accessType" | "trialEndsAt" | "subscriptionId" | "paymentId" | "createdAt", ExtArgs["result"]["userCourseAccess"]>;
export type UserCourseAccessInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    subscription?: boolean | Prisma.UserCourseAccess$subscriptionArgs<ExtArgs>;
    payment?: boolean | Prisma.UserCourseAccess$paymentArgs<ExtArgs>;
};
export type UserCourseAccessIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    subscription?: boolean | Prisma.UserCourseAccess$subscriptionArgs<ExtArgs>;
    payment?: boolean | Prisma.UserCourseAccess$paymentArgs<ExtArgs>;
};
export type UserCourseAccessIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    subscription?: boolean | Prisma.UserCourseAccess$subscriptionArgs<ExtArgs>;
    payment?: boolean | Prisma.UserCourseAccess$paymentArgs<ExtArgs>;
};
export type $UserCourseAccessPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserCourseAccess";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        course: Prisma.$CoursePayload<ExtArgs>;
        subscription: Prisma.$SubscriptionPayload<ExtArgs> | null;
        payment: Prisma.$PaymentPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        courseId: string;
        accessType: $Enums.UserCourseAccessType;
        trialEndsAt: Date | null;
        subscriptionId: string | null;
        paymentId: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["userCourseAccess"]>;
    composites: {};
};
export type UserCourseAccessGetPayload<S extends boolean | null | undefined | UserCourseAccessDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload, S>;
export type UserCourseAccessCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserCourseAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCourseAccessCountAggregateInputType | true;
};
export interface UserCourseAccessDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserCourseAccess'];
        meta: {
            name: 'UserCourseAccess';
        };
    };
    findUnique<T extends UserCourseAccessFindUniqueArgs>(args: Prisma.SelectSubset<T, UserCourseAccessFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserCourseAccessFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserCourseAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserCourseAccessFindFirstArgs>(args?: Prisma.SelectSubset<T, UserCourseAccessFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserCourseAccessFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserCourseAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserCourseAccessFindManyArgs>(args?: Prisma.SelectSubset<T, UserCourseAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCourseAccessCreateArgs>(args: Prisma.SelectSubset<T, UserCourseAccessCreateArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCourseAccessCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCourseAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCourseAccessCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCourseAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserCourseAccessDeleteArgs>(args: Prisma.SelectSubset<T, UserCourseAccessDeleteArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserCourseAccessUpdateArgs>(args: Prisma.SelectSubset<T, UserCourseAccessUpdateArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserCourseAccessDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserCourseAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserCourseAccessUpdateManyArgs>(args: Prisma.SelectSubset<T, UserCourseAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserCourseAccessUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserCourseAccessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserCourseAccessUpsertArgs>(args: Prisma.SelectSubset<T, UserCourseAccessUpsertArgs<ExtArgs>>): Prisma.Prisma__UserCourseAccessClient<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCourseAccessCountArgs>(args?: Prisma.Subset<T, UserCourseAccessCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCourseAccessCountAggregateOutputType> : number>;
    aggregate<T extends UserCourseAccessAggregateArgs>(args: Prisma.Subset<T, UserCourseAccessAggregateArgs>): Prisma.PrismaPromise<GetUserCourseAccessAggregateType<T>>;
    groupBy<T extends UserCourseAccessGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserCourseAccessGroupByArgs['orderBy'];
    } : {
        orderBy?: UserCourseAccessGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserCourseAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCourseAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserCourseAccessFieldRefs;
}
export interface Prisma__UserCourseAccessClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    course<T extends Prisma.CourseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    subscription<T extends Prisma.UserCourseAccess$subscriptionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserCourseAccess$subscriptionArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    payment<T extends Prisma.UserCourseAccess$paymentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserCourseAccess$paymentArgs<ExtArgs>>): Prisma.Prisma__PaymentClient<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserCourseAccessFieldRefs {
    readonly id: Prisma.FieldRef<"UserCourseAccess", 'String'>;
    readonly userId: Prisma.FieldRef<"UserCourseAccess", 'String'>;
    readonly courseId: Prisma.FieldRef<"UserCourseAccess", 'String'>;
    readonly accessType: Prisma.FieldRef<"UserCourseAccess", 'UserCourseAccessType'>;
    readonly trialEndsAt: Prisma.FieldRef<"UserCourseAccess", 'DateTime'>;
    readonly subscriptionId: Prisma.FieldRef<"UserCourseAccess", 'String'>;
    readonly paymentId: Prisma.FieldRef<"UserCourseAccess", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserCourseAccess", 'DateTime'>;
}
export type UserCourseAccessFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    where: Prisma.UserCourseAccessWhereUniqueInput;
};
export type UserCourseAccessFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    where: Prisma.UserCourseAccessWhereUniqueInput;
};
export type UserCourseAccessFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    where?: Prisma.UserCourseAccessWhereInput;
    orderBy?: Prisma.UserCourseAccessOrderByWithRelationInput | Prisma.UserCourseAccessOrderByWithRelationInput[];
    cursor?: Prisma.UserCourseAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserCourseAccessScalarFieldEnum | Prisma.UserCourseAccessScalarFieldEnum[];
};
export type UserCourseAccessFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    where?: Prisma.UserCourseAccessWhereInput;
    orderBy?: Prisma.UserCourseAccessOrderByWithRelationInput | Prisma.UserCourseAccessOrderByWithRelationInput[];
    cursor?: Prisma.UserCourseAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserCourseAccessScalarFieldEnum | Prisma.UserCourseAccessScalarFieldEnum[];
};
export type UserCourseAccessFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    where?: Prisma.UserCourseAccessWhereInput;
    orderBy?: Prisma.UserCourseAccessOrderByWithRelationInput | Prisma.UserCourseAccessOrderByWithRelationInput[];
    cursor?: Prisma.UserCourseAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserCourseAccessScalarFieldEnum | Prisma.UserCourseAccessScalarFieldEnum[];
};
export type UserCourseAccessCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCourseAccessCreateInput, Prisma.UserCourseAccessUncheckedCreateInput>;
};
export type UserCourseAccessCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCourseAccessCreateManyInput | Prisma.UserCourseAccessCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCourseAccessCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    data: Prisma.UserCourseAccessCreateManyInput | Prisma.UserCourseAccessCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserCourseAccessIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserCourseAccessUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateInput, Prisma.UserCourseAccessUncheckedUpdateInput>;
    where: Prisma.UserCourseAccessWhereUniqueInput;
};
export type UserCourseAccessUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateManyMutationInput, Prisma.UserCourseAccessUncheckedUpdateManyInput>;
    where?: Prisma.UserCourseAccessWhereInput;
    limit?: number;
};
export type UserCourseAccessUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCourseAccessUpdateManyMutationInput, Prisma.UserCourseAccessUncheckedUpdateManyInput>;
    where?: Prisma.UserCourseAccessWhereInput;
    limit?: number;
    include?: Prisma.UserCourseAccessIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserCourseAccessUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    where: Prisma.UserCourseAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCourseAccessCreateInput, Prisma.UserCourseAccessUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserCourseAccessUpdateInput, Prisma.UserCourseAccessUncheckedUpdateInput>;
};
export type UserCourseAccessDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
    where: Prisma.UserCourseAccessWhereUniqueInput;
};
export type UserCourseAccessDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCourseAccessWhereInput;
    limit?: number;
};
export type UserCourseAccess$subscriptionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where?: Prisma.SubscriptionWhereInput;
};
export type UserCourseAccess$paymentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
};
export type UserCourseAccessDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCourseAccessSelect<ExtArgs> | null;
    omit?: Prisma.UserCourseAccessOmit<ExtArgs> | null;
    include?: Prisma.UserCourseAccessInclude<ExtArgs> | null;
};
export {};
