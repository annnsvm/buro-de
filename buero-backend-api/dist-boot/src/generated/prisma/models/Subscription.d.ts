import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type SubscriptionModel = runtime.Types.Result.DefaultSelection<Prisma.$SubscriptionPayload>;
export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
};
export type SubscriptionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    status: $Enums.SubscriptionStatus | null;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    canceledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubscriptionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    status: $Enums.SubscriptionStatus | null;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    canceledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubscriptionCountAggregateOutputType = {
    id: number;
    userId: number;
    courseId: number;
    stripeCustomerId: number;
    stripeSubscriptionId: number;
    status: number;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    canceledAt: number;
    cancellationReason: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SubscriptionMinAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    stripeCustomerId?: true;
    stripeSubscriptionId?: true;
    status?: true;
    currentPeriodStart?: true;
    currentPeriodEnd?: true;
    canceledAt?: true;
    cancellationReason?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubscriptionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    stripeCustomerId?: true;
    stripeSubscriptionId?: true;
    status?: true;
    currentPeriodStart?: true;
    currentPeriodEnd?: true;
    canceledAt?: true;
    cancellationReason?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubscriptionCountAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    stripeCustomerId?: true;
    stripeSubscriptionId?: true;
    status?: true;
    currentPeriodStart?: true;
    currentPeriodEnd?: true;
    canceledAt?: true;
    cancellationReason?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SubscriptionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubscriptionCountAggregateInputType;
    _min?: SubscriptionMinAggregateInputType;
    _max?: SubscriptionMaxAggregateInputType;
};
export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
    [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubscription[P]> : Prisma.GetScalarType<T[P], AggregateSubscription[P]>;
};
export type SubscriptionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithAggregationInput | Prisma.SubscriptionOrderByWithAggregationInput[];
    by: Prisma.SubscriptionScalarFieldEnum[] | Prisma.SubscriptionScalarFieldEnum;
    having?: Prisma.SubscriptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionCountAggregateInputType | true;
    _min?: SubscriptionMinAggregateInputType;
    _max?: SubscriptionMaxAggregateInputType;
};
export type SubscriptionGroupByOutputType = {
    id: string;
    userId: string;
    courseId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    canceledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: SubscriptionCountAggregateOutputType | null;
    _min: SubscriptionMinAggregateOutputType | null;
    _max: SubscriptionMaxAggregateOutputType | null;
};
type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubscriptionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubscriptionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubscriptionGroupByOutputType[P]>;
}>>;
export type SubscriptionWhereInput = {
    AND?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    OR?: Prisma.SubscriptionWhereInput[];
    NOT?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    id?: Prisma.StringFilter<"Subscription"> | string;
    userId?: Prisma.StringFilter<"Subscription"> | string;
    courseId?: Prisma.StringFilter<"Subscription"> | string;
    stripeCustomerId?: Prisma.StringFilter<"Subscription"> | string;
    stripeSubscriptionId?: Prisma.StringFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    currentPeriodEnd?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    canceledAt?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    cancellationReason?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    userCourseAccess?: Prisma.UserCourseAccessListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
};
export type SubscriptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    stripeCustomerId?: Prisma.SortOrder;
    stripeSubscriptionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currentPeriodStart?: Prisma.SortOrderInput | Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrderInput | Prisma.SortOrder;
    canceledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    cancellationReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    course?: Prisma.CourseOrderByWithRelationInput;
    userCourseAccess?: Prisma.UserCourseAccessOrderByRelationAggregateInput;
    payments?: Prisma.PaymentOrderByRelationAggregateInput;
};
export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    stripeSubscriptionId?: string;
    AND?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    OR?: Prisma.SubscriptionWhereInput[];
    NOT?: Prisma.SubscriptionWhereInput | Prisma.SubscriptionWhereInput[];
    userId?: Prisma.StringFilter<"Subscription"> | string;
    courseId?: Prisma.StringFilter<"Subscription"> | string;
    stripeCustomerId?: Prisma.StringFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    currentPeriodEnd?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    canceledAt?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    cancellationReason?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    userCourseAccess?: Prisma.UserCourseAccessListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
}, "id" | "stripeSubscriptionId">;
export type SubscriptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    stripeCustomerId?: Prisma.SortOrder;
    stripeSubscriptionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currentPeriodStart?: Prisma.SortOrderInput | Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrderInput | Prisma.SortOrder;
    canceledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    cancellationReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SubscriptionCountOrderByAggregateInput;
    _max?: Prisma.SubscriptionMaxOrderByAggregateInput;
    _min?: Prisma.SubscriptionMinOrderByAggregateInput;
};
export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubscriptionScalarWhereWithAggregatesInput | Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubscriptionScalarWhereWithAggregatesInput | Prisma.SubscriptionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    courseId?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    stripeCustomerId?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    stripeSubscriptionId?: Prisma.StringWithAggregatesFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusWithAggregatesFilter<"Subscription"> | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null;
    currentPeriodEnd?: Prisma.DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null;
    canceledAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null;
    cancellationReason?: Prisma.StringNullableWithAggregatesFilter<"Subscription"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Subscription"> | Date | string;
};
export type SubscriptionCreateInput = {
    id?: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSubscriptionsInput;
    course: Prisma.CourseCreateNestedOneWithoutSubscriptionsInput;
    userCourseAccess?: Prisma.UserCourseAccessCreateNestedManyWithoutSubscriptionInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionUncheckedCreateInput = {
    id?: string;
    userId: string;
    courseId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedCreateNestedManyWithoutSubscriptionInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSubscriptionsNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutSubscriptionsNestedInput;
    userCourseAccess?: Prisma.UserCourseAccessUpdateManyWithoutSubscriptionNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedUpdateManyWithoutSubscriptionNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionCreateManyInput = {
    id?: string;
    userId: string;
    courseId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionListRelationFilter = {
    every?: Prisma.SubscriptionWhereInput;
    some?: Prisma.SubscriptionWhereInput;
    none?: Prisma.SubscriptionWhereInput;
};
export type SubscriptionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubscriptionNullableScalarRelationFilter = {
    is?: Prisma.SubscriptionWhereInput | null;
    isNot?: Prisma.SubscriptionWhereInput | null;
};
export type SubscriptionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    stripeCustomerId?: Prisma.SortOrder;
    stripeSubscriptionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currentPeriodStart?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrder;
    canceledAt?: Prisma.SortOrder;
    cancellationReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    stripeCustomerId?: Prisma.SortOrder;
    stripeSubscriptionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currentPeriodStart?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrder;
    canceledAt?: Prisma.SortOrder;
    cancellationReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    stripeCustomerId?: Prisma.SortOrder;
    stripeSubscriptionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    currentPeriodStart?: Prisma.SortOrder;
    currentPeriodEnd?: Prisma.SortOrder;
    canceledAt?: Prisma.SortOrder;
    cancellationReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput | Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput> | Prisma.SubscriptionCreateWithoutUserInput[] | Prisma.SubscriptionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserInput | Prisma.SubscriptionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SubscriptionCreateManyUserInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput | Prisma.SubscriptionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutCourseInput, Prisma.SubscriptionUncheckedCreateWithoutCourseInput> | Prisma.SubscriptionCreateWithoutCourseInput[] | Prisma.SubscriptionUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutCourseInput | Prisma.SubscriptionCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.SubscriptionCreateManyCourseInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUncheckedCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutCourseInput, Prisma.SubscriptionUncheckedCreateWithoutCourseInput> | Prisma.SubscriptionCreateWithoutCourseInput[] | Prisma.SubscriptionUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutCourseInput | Prisma.SubscriptionCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.SubscriptionCreateManyCourseInputEnvelope;
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
};
export type SubscriptionUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutCourseInput, Prisma.SubscriptionUncheckedCreateWithoutCourseInput> | Prisma.SubscriptionCreateWithoutCourseInput[] | Prisma.SubscriptionUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutCourseInput | Prisma.SubscriptionCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutCourseInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.SubscriptionCreateManyCourseInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutCourseInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutCourseInput | Prisma.SubscriptionUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutCourseInput, Prisma.SubscriptionUncheckedCreateWithoutCourseInput> | Prisma.SubscriptionCreateWithoutCourseInput[] | Prisma.SubscriptionUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutCourseInput | Prisma.SubscriptionCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.SubscriptionUpsertWithWhereUniqueWithoutCourseInput | Prisma.SubscriptionUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.SubscriptionCreateManyCourseInputEnvelope;
    set?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    disconnect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    delete?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    connect?: Prisma.SubscriptionWhereUniqueInput | Prisma.SubscriptionWhereUniqueInput[];
    update?: Prisma.SubscriptionUpdateWithWhereUniqueWithoutCourseInput | Prisma.SubscriptionUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.SubscriptionUpdateManyWithWhereWithoutCourseInput | Prisma.SubscriptionUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
};
export type SubscriptionCreateNestedOneWithoutUserCourseAccessInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserCourseAccessInput, Prisma.SubscriptionUncheckedCreateWithoutUserCourseAccessInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserCourseAccessInput;
    connect?: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionUpdateOneWithoutUserCourseAccessNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserCourseAccessInput, Prisma.SubscriptionUncheckedCreateWithoutUserCourseAccessInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutUserCourseAccessInput;
    upsert?: Prisma.SubscriptionUpsertWithoutUserCourseAccessInput;
    disconnect?: Prisma.SubscriptionWhereInput | boolean;
    delete?: Prisma.SubscriptionWhereInput | boolean;
    connect?: Prisma.SubscriptionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SubscriptionUpdateToOneWithWhereWithoutUserCourseAccessInput, Prisma.SubscriptionUpdateWithoutUserCourseAccessInput>, Prisma.SubscriptionUncheckedUpdateWithoutUserCourseAccessInput>;
};
export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus;
};
export type SubscriptionCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPaymentsInput, Prisma.SubscriptionUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionUpdateOneWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.SubscriptionCreateWithoutPaymentsInput, Prisma.SubscriptionUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.SubscriptionCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.SubscriptionUpsertWithoutPaymentsInput;
    disconnect?: Prisma.SubscriptionWhereInput | boolean;
    delete?: Prisma.SubscriptionWhereInput | boolean;
    connect?: Prisma.SubscriptionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SubscriptionUpdateToOneWithWhereWithoutPaymentsInput, Prisma.SubscriptionUpdateWithoutPaymentsInput>, Prisma.SubscriptionUncheckedUpdateWithoutPaymentsInput>;
};
export type SubscriptionCreateWithoutUserInput = {
    id?: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutSubscriptionsInput;
    userCourseAccess?: Prisma.UserCourseAccessCreateNestedManyWithoutSubscriptionInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string;
    courseId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedCreateNestedManyWithoutSubscriptionInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
};
export type SubscriptionCreateManyUserInputEnvelope = {
    data: Prisma.SubscriptionCreateManyUserInput | Prisma.SubscriptionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserInput, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserInput, Prisma.SubscriptionUncheckedCreateWithoutUserInput>;
};
export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserInput, Prisma.SubscriptionUncheckedUpdateWithoutUserInput>;
};
export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SubscriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyWithoutUserInput>;
};
export type SubscriptionScalarWhereInput = {
    AND?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
    OR?: Prisma.SubscriptionScalarWhereInput[];
    NOT?: Prisma.SubscriptionScalarWhereInput | Prisma.SubscriptionScalarWhereInput[];
    id?: Prisma.StringFilter<"Subscription"> | string;
    userId?: Prisma.StringFilter<"Subscription"> | string;
    courseId?: Prisma.StringFilter<"Subscription"> | string;
    stripeCustomerId?: Prisma.StringFilter<"Subscription"> | string;
    stripeSubscriptionId?: Prisma.StringFilter<"Subscription"> | string;
    status?: Prisma.EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    currentPeriodEnd?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    canceledAt?: Prisma.DateTimeNullableFilter<"Subscription"> | Date | string | null;
    cancellationReason?: Prisma.StringNullableFilter<"Subscription"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subscription"> | Date | string;
};
export type SubscriptionCreateWithoutCourseInput = {
    id?: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSubscriptionsInput;
    userCourseAccess?: Prisma.UserCourseAccessCreateNestedManyWithoutSubscriptionInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionUncheckedCreateWithoutCourseInput = {
    id?: string;
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedCreateNestedManyWithoutSubscriptionInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionCreateOrConnectWithoutCourseInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutCourseInput, Prisma.SubscriptionUncheckedCreateWithoutCourseInput>;
};
export type SubscriptionCreateManyCourseInputEnvelope = {
    data: Prisma.SubscriptionCreateManyCourseInput | Prisma.SubscriptionCreateManyCourseInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionUpsertWithWhereUniqueWithoutCourseInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutCourseInput, Prisma.SubscriptionUncheckedUpdateWithoutCourseInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutCourseInput, Prisma.SubscriptionUncheckedCreateWithoutCourseInput>;
};
export type SubscriptionUpdateWithWhereUniqueWithoutCourseInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutCourseInput, Prisma.SubscriptionUncheckedUpdateWithoutCourseInput>;
};
export type SubscriptionUpdateManyWithWhereWithoutCourseInput = {
    where: Prisma.SubscriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyWithoutCourseInput>;
};
export type SubscriptionCreateWithoutUserCourseAccessInput = {
    id?: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSubscriptionsInput;
    course: Prisma.CourseCreateNestedOneWithoutSubscriptionsInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionUncheckedCreateWithoutUserCourseAccessInput = {
    id?: string;
    userId: string;
    courseId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionCreateOrConnectWithoutUserCourseAccessInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserCourseAccessInput, Prisma.SubscriptionUncheckedCreateWithoutUserCourseAccessInput>;
};
export type SubscriptionUpsertWithoutUserCourseAccessInput = {
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserCourseAccessInput, Prisma.SubscriptionUncheckedUpdateWithoutUserCourseAccessInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutUserCourseAccessInput, Prisma.SubscriptionUncheckedCreateWithoutUserCourseAccessInput>;
    where?: Prisma.SubscriptionWhereInput;
};
export type SubscriptionUpdateToOneWithWhereWithoutUserCourseAccessInput = {
    where?: Prisma.SubscriptionWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutUserCourseAccessInput, Prisma.SubscriptionUncheckedUpdateWithoutUserCourseAccessInput>;
};
export type SubscriptionUpdateWithoutUserCourseAccessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSubscriptionsNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutSubscriptionsNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutUserCourseAccessInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionCreateWithoutPaymentsInput = {
    id?: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSubscriptionsInput;
    course: Prisma.CourseCreateNestedOneWithoutSubscriptionsInput;
    userCourseAccess?: Prisma.UserCourseAccessCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    userId: string;
    courseId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedCreateNestedManyWithoutSubscriptionInput;
};
export type SubscriptionCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutPaymentsInput, Prisma.SubscriptionUncheckedCreateWithoutPaymentsInput>;
};
export type SubscriptionUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.SubscriptionUpdateWithoutPaymentsInput, Prisma.SubscriptionUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.SubscriptionCreateWithoutPaymentsInput, Prisma.SubscriptionUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.SubscriptionWhereInput;
};
export type SubscriptionUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.SubscriptionWhereInput;
    data: Prisma.XOR<Prisma.SubscriptionUpdateWithoutPaymentsInput, Prisma.SubscriptionUncheckedUpdateWithoutPaymentsInput>;
};
export type SubscriptionUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSubscriptionsNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutSubscriptionsNestedInput;
    userCourseAccess?: Prisma.UserCourseAccessUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionCreateManyUserInput = {
    id?: string;
    courseId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutSubscriptionsNestedInput;
    userCourseAccess?: Prisma.UserCourseAccessUpdateManyWithoutSubscriptionNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedUpdateManyWithoutSubscriptionNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionCreateManyCourseInput = {
    id?: string;
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: $Enums.SubscriptionStatus;
    currentPeriodStart?: Date | string | null;
    currentPeriodEnd?: Date | string | null;
    canceledAt?: Date | string | null;
    cancellationReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSubscriptionsNestedInput;
    userCourseAccess?: Prisma.UserCourseAccessUpdateManyWithoutSubscriptionNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userCourseAccess?: Prisma.UserCourseAccessUncheckedUpdateManyWithoutSubscriptionNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSubscriptionNestedInput;
};
export type SubscriptionUncheckedUpdateManyWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeCustomerId?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeSubscriptionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus;
    currentPeriodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    currentPeriodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    canceledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cancellationReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionCountOutputType = {
    userCourseAccess: number;
    payments: number;
};
export type SubscriptionCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    userCourseAccess?: boolean | SubscriptionCountOutputTypeCountUserCourseAccessArgs;
    payments?: boolean | SubscriptionCountOutputTypeCountPaymentsArgs;
};
export type SubscriptionCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionCountOutputTypeSelect<ExtArgs> | null;
};
export type SubscriptionCountOutputTypeCountUserCourseAccessArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCourseAccessWhereInput;
};
export type SubscriptionCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWhereInput;
};
export type SubscriptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    stripeCustomerId?: boolean;
    stripeSubscriptionId?: boolean;
    status?: boolean;
    currentPeriodStart?: boolean;
    currentPeriodEnd?: boolean;
    canceledAt?: boolean;
    cancellationReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    userCourseAccess?: boolean | Prisma.Subscription$userCourseAccessArgs<ExtArgs>;
    payments?: boolean | Prisma.Subscription$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SubscriptionCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    stripeCustomerId?: boolean;
    stripeSubscriptionId?: boolean;
    status?: boolean;
    currentPeriodStart?: boolean;
    currentPeriodEnd?: boolean;
    canceledAt?: boolean;
    cancellationReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    stripeCustomerId?: boolean;
    stripeSubscriptionId?: boolean;
    status?: boolean;
    currentPeriodStart?: boolean;
    currentPeriodEnd?: boolean;
    canceledAt?: boolean;
    cancellationReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["subscription"]>;
export type SubscriptionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    stripeCustomerId?: boolean;
    stripeSubscriptionId?: boolean;
    status?: boolean;
    currentPeriodStart?: boolean;
    currentPeriodEnd?: boolean;
    canceledAt?: boolean;
    cancellationReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SubscriptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "courseId" | "stripeCustomerId" | "stripeSubscriptionId" | "status" | "currentPeriodStart" | "currentPeriodEnd" | "canceledAt" | "cancellationReason" | "createdAt" | "updatedAt", ExtArgs["result"]["subscription"]>;
export type SubscriptionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    userCourseAccess?: boolean | Prisma.Subscription$userCourseAccessArgs<ExtArgs>;
    payments?: boolean | Prisma.Subscription$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SubscriptionCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
};
export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
};
export type $SubscriptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Subscription";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        course: Prisma.$CoursePayload<ExtArgs>;
        userCourseAccess: Prisma.$UserCourseAccessPayload<ExtArgs>[];
        payments: Prisma.$PaymentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        courseId: string;
        stripeCustomerId: string;
        stripeSubscriptionId: string;
        status: $Enums.SubscriptionStatus;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        canceledAt: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["subscription"]>;
    composites: {};
};
export type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload, S>;
export type SubscriptionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubscriptionCountAggregateInputType | true;
};
export interface SubscriptionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Subscription'];
        meta: {
            name: 'Subscription';
        };
    };
    findUnique<T extends SubscriptionFindUniqueArgs>(args: Prisma.SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubscriptionFindFirstArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubscriptionFindManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubscriptionCreateArgs>(args: Prisma.SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubscriptionCreateManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubscriptionDeleteArgs>(args: Prisma.SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubscriptionUpdateArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubscriptionUpdateManyArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubscriptionUpsertArgs>(args: Prisma.SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubscriptionCountArgs>(args?: Prisma.Subset<T, SubscriptionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubscriptionCountAggregateOutputType> : number>;
    aggregate<T extends SubscriptionAggregateArgs>(args: Prisma.Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>;
    groupBy<T extends SubscriptionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubscriptionGroupByArgs['orderBy'];
    } : {
        orderBy?: SubscriptionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubscriptionFieldRefs;
}
export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    course<T extends Prisma.CourseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    userCourseAccess<T extends Prisma.Subscription$userCourseAccessArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Subscription$userCourseAccessArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payments<T extends Prisma.Subscription$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Subscription$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubscriptionFieldRefs {
    readonly id: Prisma.FieldRef<"Subscription", 'String'>;
    readonly userId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly courseId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly stripeCustomerId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly stripeSubscriptionId: Prisma.FieldRef<"Subscription", 'String'>;
    readonly status: Prisma.FieldRef<"Subscription", 'SubscriptionStatus'>;
    readonly currentPeriodStart: Prisma.FieldRef<"Subscription", 'DateTime'>;
    readonly currentPeriodEnd: Prisma.FieldRef<"Subscription", 'DateTime'>;
    readonly canceledAt: Prisma.FieldRef<"Subscription", 'DateTime'>;
    readonly cancellationReason: Prisma.FieldRef<"Subscription", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Subscription", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Subscription", 'DateTime'>;
}
export type SubscriptionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionScalarFieldEnum | Prisma.SubscriptionScalarFieldEnum[];
};
export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionScalarFieldEnum | Prisma.SubscriptionScalarFieldEnum[];
};
export type SubscriptionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where?: Prisma.SubscriptionWhereInput;
    orderBy?: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[];
    cursor?: Prisma.SubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubscriptionScalarFieldEnum | Prisma.SubscriptionScalarFieldEnum[];
};
export type SubscriptionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionCreateInput, Prisma.SubscriptionUncheckedCreateInput>;
};
export type SubscriptionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubscriptionCreateManyInput | Prisma.SubscriptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    data: Prisma.SubscriptionCreateManyInput | Prisma.SubscriptionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SubscriptionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionUpdateInput, Prisma.SubscriptionUncheckedUpdateInput>;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
};
export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubscriptionUpdateManyMutationInput, Prisma.SubscriptionUncheckedUpdateManyInput>;
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
    include?: Prisma.SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SubscriptionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubscriptionCreateInput, Prisma.SubscriptionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubscriptionUpdateInput, Prisma.SubscriptionUncheckedUpdateInput>;
};
export type SubscriptionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where: Prisma.SubscriptionWhereUniqueInput;
};
export type SubscriptionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionWhereInput;
    limit?: number;
};
export type Subscription$userCourseAccessArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Subscription$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput | Prisma.PaymentOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentScalarFieldEnum | Prisma.PaymentScalarFieldEnum[];
};
export type SubscriptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
};
export {};
