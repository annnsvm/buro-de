import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type LessonRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$LessonRequestPayload>;
export type AggregateLessonRequest = {
    _count: LessonRequestCountAggregateOutputType | null;
    _min: LessonRequestMinAggregateOutputType | null;
    _max: LessonRequestMaxAggregateOutputType | null;
};
export type LessonRequestMinAggregateOutputType = {
    id: string | null;
    studentId: string | null;
    teacherId: string | null;
    preferredTime: string | null;
    message: string | null;
    status: $Enums.LessonRequestStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LessonRequestMaxAggregateOutputType = {
    id: string | null;
    studentId: string | null;
    teacherId: string | null;
    preferredTime: string | null;
    message: string | null;
    status: $Enums.LessonRequestStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LessonRequestCountAggregateOutputType = {
    id: number;
    studentId: number;
    teacherId: number;
    preferredTime: number;
    message: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LessonRequestMinAggregateInputType = {
    id?: true;
    studentId?: true;
    teacherId?: true;
    preferredTime?: true;
    message?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LessonRequestMaxAggregateInputType = {
    id?: true;
    studentId?: true;
    teacherId?: true;
    preferredTime?: true;
    message?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LessonRequestCountAggregateInputType = {
    id?: true;
    studentId?: true;
    teacherId?: true;
    preferredTime?: true;
    message?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LessonRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LessonRequestWhereInput;
    orderBy?: Prisma.LessonRequestOrderByWithRelationInput | Prisma.LessonRequestOrderByWithRelationInput[];
    cursor?: Prisma.LessonRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LessonRequestCountAggregateInputType;
    _min?: LessonRequestMinAggregateInputType;
    _max?: LessonRequestMaxAggregateInputType;
};
export type GetLessonRequestAggregateType<T extends LessonRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateLessonRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLessonRequest[P]> : Prisma.GetScalarType<T[P], AggregateLessonRequest[P]>;
};
export type LessonRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LessonRequestWhereInput;
    orderBy?: Prisma.LessonRequestOrderByWithAggregationInput | Prisma.LessonRequestOrderByWithAggregationInput[];
    by: Prisma.LessonRequestScalarFieldEnum[] | Prisma.LessonRequestScalarFieldEnum;
    having?: Prisma.LessonRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LessonRequestCountAggregateInputType | true;
    _min?: LessonRequestMinAggregateInputType;
    _max?: LessonRequestMaxAggregateInputType;
};
export type LessonRequestGroupByOutputType = {
    id: string;
    studentId: string;
    teacherId: string | null;
    preferredTime: string | null;
    message: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: LessonRequestCountAggregateOutputType | null;
    _min: LessonRequestMinAggregateOutputType | null;
    _max: LessonRequestMaxAggregateOutputType | null;
};
type GetLessonRequestGroupByPayload<T extends LessonRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LessonRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LessonRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LessonRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LessonRequestGroupByOutputType[P]>;
}>>;
export type LessonRequestWhereInput = {
    AND?: Prisma.LessonRequestWhereInput | Prisma.LessonRequestWhereInput[];
    OR?: Prisma.LessonRequestWhereInput[];
    NOT?: Prisma.LessonRequestWhereInput | Prisma.LessonRequestWhereInput[];
    id?: Prisma.StringFilter<"LessonRequest"> | string;
    studentId?: Prisma.StringFilter<"LessonRequest"> | string;
    teacherId?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    preferredTime?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    message?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    status?: Prisma.EnumLessonRequestStatusFilter<"LessonRequest"> | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFilter<"LessonRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LessonRequest"> | Date | string;
    student?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    teacher?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type LessonRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    studentId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    message?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    student?: Prisma.UserOrderByWithRelationInput;
    teacher?: Prisma.UserOrderByWithRelationInput;
};
export type LessonRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LessonRequestWhereInput | Prisma.LessonRequestWhereInput[];
    OR?: Prisma.LessonRequestWhereInput[];
    NOT?: Prisma.LessonRequestWhereInput | Prisma.LessonRequestWhereInput[];
    studentId?: Prisma.StringFilter<"LessonRequest"> | string;
    teacherId?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    preferredTime?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    message?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    status?: Prisma.EnumLessonRequestStatusFilter<"LessonRequest"> | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFilter<"LessonRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LessonRequest"> | Date | string;
    student?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    teacher?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type LessonRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    studentId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    message?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LessonRequestCountOrderByAggregateInput;
    _max?: Prisma.LessonRequestMaxOrderByAggregateInput;
    _min?: Prisma.LessonRequestMinOrderByAggregateInput;
};
export type LessonRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.LessonRequestScalarWhereWithAggregatesInput | Prisma.LessonRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.LessonRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LessonRequestScalarWhereWithAggregatesInput | Prisma.LessonRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"LessonRequest"> | string;
    studentId?: Prisma.StringWithAggregatesFilter<"LessonRequest"> | string;
    teacherId?: Prisma.StringNullableWithAggregatesFilter<"LessonRequest"> | string | null;
    preferredTime?: Prisma.StringNullableWithAggregatesFilter<"LessonRequest"> | string | null;
    message?: Prisma.StringNullableWithAggregatesFilter<"LessonRequest"> | string | null;
    status?: Prisma.EnumLessonRequestStatusWithAggregatesFilter<"LessonRequest"> | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LessonRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LessonRequest"> | Date | string;
};
export type LessonRequestCreateInput = {
    id?: string;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    student?: Prisma.UserCreateNestedOneWithoutLessonRequestsAsStudentInput;
    teacher?: Prisma.UserCreateNestedOneWithoutLessonRequestsAsTeacherInput;
};
export type LessonRequestUncheckedCreateInput = {
    id?: string;
    studentId: string;
    teacherId?: string | null;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LessonRequestUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    student?: Prisma.UserUpdateOneWithoutLessonRequestsAsStudentNestedInput;
    teacher?: Prisma.UserUpdateOneWithoutLessonRequestsAsTeacherNestedInput;
};
export type LessonRequestUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    studentId?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LessonRequestCreateManyInput = {
    id?: string;
    studentId: string;
    teacherId?: string | null;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LessonRequestUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LessonRequestUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    studentId?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LessonRequestListRelationFilter = {
    every?: Prisma.LessonRequestWhereInput;
    some?: Prisma.LessonRequestWhereInput;
    none?: Prisma.LessonRequestWhereInput;
};
export type LessonRequestOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LessonRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    studentId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    preferredTime?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LessonRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    studentId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    preferredTime?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LessonRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    studentId?: Prisma.SortOrder;
    teacherId?: Prisma.SortOrder;
    preferredTime?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LessonRequestCreateNestedManyWithoutStudentInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutStudentInput, Prisma.LessonRequestUncheckedCreateWithoutStudentInput> | Prisma.LessonRequestCreateWithoutStudentInput[] | Prisma.LessonRequestUncheckedCreateWithoutStudentInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutStudentInput | Prisma.LessonRequestCreateOrConnectWithoutStudentInput[];
    createMany?: Prisma.LessonRequestCreateManyStudentInputEnvelope;
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
};
export type LessonRequestCreateNestedManyWithoutTeacherInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutTeacherInput, Prisma.LessonRequestUncheckedCreateWithoutTeacherInput> | Prisma.LessonRequestCreateWithoutTeacherInput[] | Prisma.LessonRequestUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutTeacherInput | Prisma.LessonRequestCreateOrConnectWithoutTeacherInput[];
    createMany?: Prisma.LessonRequestCreateManyTeacherInputEnvelope;
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
};
export type LessonRequestUncheckedCreateNestedManyWithoutStudentInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutStudentInput, Prisma.LessonRequestUncheckedCreateWithoutStudentInput> | Prisma.LessonRequestCreateWithoutStudentInput[] | Prisma.LessonRequestUncheckedCreateWithoutStudentInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutStudentInput | Prisma.LessonRequestCreateOrConnectWithoutStudentInput[];
    createMany?: Prisma.LessonRequestCreateManyStudentInputEnvelope;
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
};
export type LessonRequestUncheckedCreateNestedManyWithoutTeacherInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutTeacherInput, Prisma.LessonRequestUncheckedCreateWithoutTeacherInput> | Prisma.LessonRequestCreateWithoutTeacherInput[] | Prisma.LessonRequestUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutTeacherInput | Prisma.LessonRequestCreateOrConnectWithoutTeacherInput[];
    createMany?: Prisma.LessonRequestCreateManyTeacherInputEnvelope;
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
};
export type LessonRequestUpdateManyWithoutStudentNestedInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutStudentInput, Prisma.LessonRequestUncheckedCreateWithoutStudentInput> | Prisma.LessonRequestCreateWithoutStudentInput[] | Prisma.LessonRequestUncheckedCreateWithoutStudentInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutStudentInput | Prisma.LessonRequestCreateOrConnectWithoutStudentInput[];
    upsert?: Prisma.LessonRequestUpsertWithWhereUniqueWithoutStudentInput | Prisma.LessonRequestUpsertWithWhereUniqueWithoutStudentInput[];
    createMany?: Prisma.LessonRequestCreateManyStudentInputEnvelope;
    set?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    disconnect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    delete?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    update?: Prisma.LessonRequestUpdateWithWhereUniqueWithoutStudentInput | Prisma.LessonRequestUpdateWithWhereUniqueWithoutStudentInput[];
    updateMany?: Prisma.LessonRequestUpdateManyWithWhereWithoutStudentInput | Prisma.LessonRequestUpdateManyWithWhereWithoutStudentInput[];
    deleteMany?: Prisma.LessonRequestScalarWhereInput | Prisma.LessonRequestScalarWhereInput[];
};
export type LessonRequestUpdateManyWithoutTeacherNestedInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutTeacherInput, Prisma.LessonRequestUncheckedCreateWithoutTeacherInput> | Prisma.LessonRequestCreateWithoutTeacherInput[] | Prisma.LessonRequestUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutTeacherInput | Prisma.LessonRequestCreateOrConnectWithoutTeacherInput[];
    upsert?: Prisma.LessonRequestUpsertWithWhereUniqueWithoutTeacherInput | Prisma.LessonRequestUpsertWithWhereUniqueWithoutTeacherInput[];
    createMany?: Prisma.LessonRequestCreateManyTeacherInputEnvelope;
    set?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    disconnect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    delete?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    update?: Prisma.LessonRequestUpdateWithWhereUniqueWithoutTeacherInput | Prisma.LessonRequestUpdateWithWhereUniqueWithoutTeacherInput[];
    updateMany?: Prisma.LessonRequestUpdateManyWithWhereWithoutTeacherInput | Prisma.LessonRequestUpdateManyWithWhereWithoutTeacherInput[];
    deleteMany?: Prisma.LessonRequestScalarWhereInput | Prisma.LessonRequestScalarWhereInput[];
};
export type LessonRequestUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutStudentInput, Prisma.LessonRequestUncheckedCreateWithoutStudentInput> | Prisma.LessonRequestCreateWithoutStudentInput[] | Prisma.LessonRequestUncheckedCreateWithoutStudentInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutStudentInput | Prisma.LessonRequestCreateOrConnectWithoutStudentInput[];
    upsert?: Prisma.LessonRequestUpsertWithWhereUniqueWithoutStudentInput | Prisma.LessonRequestUpsertWithWhereUniqueWithoutStudentInput[];
    createMany?: Prisma.LessonRequestCreateManyStudentInputEnvelope;
    set?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    disconnect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    delete?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    update?: Prisma.LessonRequestUpdateWithWhereUniqueWithoutStudentInput | Prisma.LessonRequestUpdateWithWhereUniqueWithoutStudentInput[];
    updateMany?: Prisma.LessonRequestUpdateManyWithWhereWithoutStudentInput | Prisma.LessonRequestUpdateManyWithWhereWithoutStudentInput[];
    deleteMany?: Prisma.LessonRequestScalarWhereInput | Prisma.LessonRequestScalarWhereInput[];
};
export type LessonRequestUncheckedUpdateManyWithoutTeacherNestedInput = {
    create?: Prisma.XOR<Prisma.LessonRequestCreateWithoutTeacherInput, Prisma.LessonRequestUncheckedCreateWithoutTeacherInput> | Prisma.LessonRequestCreateWithoutTeacherInput[] | Prisma.LessonRequestUncheckedCreateWithoutTeacherInput[];
    connectOrCreate?: Prisma.LessonRequestCreateOrConnectWithoutTeacherInput | Prisma.LessonRequestCreateOrConnectWithoutTeacherInput[];
    upsert?: Prisma.LessonRequestUpsertWithWhereUniqueWithoutTeacherInput | Prisma.LessonRequestUpsertWithWhereUniqueWithoutTeacherInput[];
    createMany?: Prisma.LessonRequestCreateManyTeacherInputEnvelope;
    set?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    disconnect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    delete?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    connect?: Prisma.LessonRequestWhereUniqueInput | Prisma.LessonRequestWhereUniqueInput[];
    update?: Prisma.LessonRequestUpdateWithWhereUniqueWithoutTeacherInput | Prisma.LessonRequestUpdateWithWhereUniqueWithoutTeacherInput[];
    updateMany?: Prisma.LessonRequestUpdateManyWithWhereWithoutTeacherInput | Prisma.LessonRequestUpdateManyWithWhereWithoutTeacherInput[];
    deleteMany?: Prisma.LessonRequestScalarWhereInput | Prisma.LessonRequestScalarWhereInput[];
};
export type EnumLessonRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.LessonRequestStatus;
};
export type LessonRequestCreateWithoutStudentInput = {
    id?: string;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    teacher?: Prisma.UserCreateNestedOneWithoutLessonRequestsAsTeacherInput;
};
export type LessonRequestUncheckedCreateWithoutStudentInput = {
    id?: string;
    teacherId?: string | null;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LessonRequestCreateOrConnectWithoutStudentInput = {
    where: Prisma.LessonRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.LessonRequestCreateWithoutStudentInput, Prisma.LessonRequestUncheckedCreateWithoutStudentInput>;
};
export type LessonRequestCreateManyStudentInputEnvelope = {
    data: Prisma.LessonRequestCreateManyStudentInput | Prisma.LessonRequestCreateManyStudentInput[];
    skipDuplicates?: boolean;
};
export type LessonRequestCreateWithoutTeacherInput = {
    id?: string;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    student?: Prisma.UserCreateNestedOneWithoutLessonRequestsAsStudentInput;
};
export type LessonRequestUncheckedCreateWithoutTeacherInput = {
    id?: string;
    studentId: string;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LessonRequestCreateOrConnectWithoutTeacherInput = {
    where: Prisma.LessonRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.LessonRequestCreateWithoutTeacherInput, Prisma.LessonRequestUncheckedCreateWithoutTeacherInput>;
};
export type LessonRequestCreateManyTeacherInputEnvelope = {
    data: Prisma.LessonRequestCreateManyTeacherInput | Prisma.LessonRequestCreateManyTeacherInput[];
    skipDuplicates?: boolean;
};
export type LessonRequestUpsertWithWhereUniqueWithoutStudentInput = {
    where: Prisma.LessonRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.LessonRequestUpdateWithoutStudentInput, Prisma.LessonRequestUncheckedUpdateWithoutStudentInput>;
    create: Prisma.XOR<Prisma.LessonRequestCreateWithoutStudentInput, Prisma.LessonRequestUncheckedCreateWithoutStudentInput>;
};
export type LessonRequestUpdateWithWhereUniqueWithoutStudentInput = {
    where: Prisma.LessonRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.LessonRequestUpdateWithoutStudentInput, Prisma.LessonRequestUncheckedUpdateWithoutStudentInput>;
};
export type LessonRequestUpdateManyWithWhereWithoutStudentInput = {
    where: Prisma.LessonRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.LessonRequestUpdateManyMutationInput, Prisma.LessonRequestUncheckedUpdateManyWithoutStudentInput>;
};
export type LessonRequestScalarWhereInput = {
    AND?: Prisma.LessonRequestScalarWhereInput | Prisma.LessonRequestScalarWhereInput[];
    OR?: Prisma.LessonRequestScalarWhereInput[];
    NOT?: Prisma.LessonRequestScalarWhereInput | Prisma.LessonRequestScalarWhereInput[];
    id?: Prisma.StringFilter<"LessonRequest"> | string;
    studentId?: Prisma.StringFilter<"LessonRequest"> | string;
    teacherId?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    preferredTime?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    message?: Prisma.StringNullableFilter<"LessonRequest"> | string | null;
    status?: Prisma.EnumLessonRequestStatusFilter<"LessonRequest"> | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFilter<"LessonRequest"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LessonRequest"> | Date | string;
};
export type LessonRequestUpsertWithWhereUniqueWithoutTeacherInput = {
    where: Prisma.LessonRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.LessonRequestUpdateWithoutTeacherInput, Prisma.LessonRequestUncheckedUpdateWithoutTeacherInput>;
    create: Prisma.XOR<Prisma.LessonRequestCreateWithoutTeacherInput, Prisma.LessonRequestUncheckedCreateWithoutTeacherInput>;
};
export type LessonRequestUpdateWithWhereUniqueWithoutTeacherInput = {
    where: Prisma.LessonRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.LessonRequestUpdateWithoutTeacherInput, Prisma.LessonRequestUncheckedUpdateWithoutTeacherInput>;
};
export type LessonRequestUpdateManyWithWhereWithoutTeacherInput = {
    where: Prisma.LessonRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.LessonRequestUpdateManyMutationInput, Prisma.LessonRequestUncheckedUpdateManyWithoutTeacherInput>;
};
export type LessonRequestCreateManyStudentInput = {
    id?: string;
    teacherId?: string | null;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LessonRequestCreateManyTeacherInput = {
    id?: string;
    studentId: string;
    preferredTime?: string | null;
    message?: string | null;
    status: $Enums.LessonRequestStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LessonRequestUpdateWithoutStudentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    teacher?: Prisma.UserUpdateOneWithoutLessonRequestsAsTeacherNestedInput;
};
export type LessonRequestUncheckedUpdateWithoutStudentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LessonRequestUncheckedUpdateManyWithoutStudentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    teacherId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LessonRequestUpdateWithoutTeacherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    student?: Prisma.UserUpdateOneWithoutLessonRequestsAsStudentNestedInput;
};
export type LessonRequestUncheckedUpdateWithoutTeacherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    studentId?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LessonRequestUncheckedUpdateManyWithoutTeacherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    studentId?: Prisma.StringFieldUpdateOperationsInput | string;
    preferredTime?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumLessonRequestStatusFieldUpdateOperationsInput | $Enums.LessonRequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LessonRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    studentId?: boolean;
    teacherId?: boolean;
    preferredTime?: boolean;
    message?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    student?: boolean | Prisma.LessonRequest$studentArgs<ExtArgs>;
    teacher?: boolean | Prisma.LessonRequest$teacherArgs<ExtArgs>;
}, ExtArgs["result"]["lessonRequest"]>;
export type LessonRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    studentId?: boolean;
    teacherId?: boolean;
    preferredTime?: boolean;
    message?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    student?: boolean | Prisma.LessonRequest$studentArgs<ExtArgs>;
    teacher?: boolean | Prisma.LessonRequest$teacherArgs<ExtArgs>;
}, ExtArgs["result"]["lessonRequest"]>;
export type LessonRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    studentId?: boolean;
    teacherId?: boolean;
    preferredTime?: boolean;
    message?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    student?: boolean | Prisma.LessonRequest$studentArgs<ExtArgs>;
    teacher?: boolean | Prisma.LessonRequest$teacherArgs<ExtArgs>;
}, ExtArgs["result"]["lessonRequest"]>;
export type LessonRequestSelectScalar = {
    id?: boolean;
    studentId?: boolean;
    teacherId?: boolean;
    preferredTime?: boolean;
    message?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LessonRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "studentId" | "teacherId" | "preferredTime" | "message" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["lessonRequest"]>;
export type LessonRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    student?: boolean | Prisma.LessonRequest$studentArgs<ExtArgs>;
    teacher?: boolean | Prisma.LessonRequest$teacherArgs<ExtArgs>;
};
export type LessonRequestIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    student?: boolean | Prisma.LessonRequest$studentArgs<ExtArgs>;
    teacher?: boolean | Prisma.LessonRequest$teacherArgs<ExtArgs>;
};
export type LessonRequestIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    student?: boolean | Prisma.LessonRequest$studentArgs<ExtArgs>;
    teacher?: boolean | Prisma.LessonRequest$teacherArgs<ExtArgs>;
};
export type $LessonRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LessonRequest";
    objects: {
        student: Prisma.$UserPayload<ExtArgs> | null;
        teacher: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        studentId: string;
        teacherId: string | null;
        preferredTime: string | null;
        message: string | null;
        status: $Enums.LessonRequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["lessonRequest"]>;
    composites: {};
};
export type LessonRequestGetPayload<S extends boolean | null | undefined | LessonRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload, S>;
export type LessonRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LessonRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LessonRequestCountAggregateInputType | true;
};
export interface LessonRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LessonRequest'];
        meta: {
            name: 'LessonRequest';
        };
    };
    findUnique<T extends LessonRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, LessonRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LessonRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LessonRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LessonRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, LessonRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LessonRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LessonRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LessonRequestFindManyArgs>(args?: Prisma.SelectSubset<T, LessonRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LessonRequestCreateArgs>(args: Prisma.SelectSubset<T, LessonRequestCreateArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LessonRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, LessonRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LessonRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LessonRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LessonRequestDeleteArgs>(args: Prisma.SelectSubset<T, LessonRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LessonRequestUpdateArgs>(args: Prisma.SelectSubset<T, LessonRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LessonRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, LessonRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LessonRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, LessonRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LessonRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LessonRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LessonRequestUpsertArgs>(args: Prisma.SelectSubset<T, LessonRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__LessonRequestClient<runtime.Types.Result.GetResult<Prisma.$LessonRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LessonRequestCountArgs>(args?: Prisma.Subset<T, LessonRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LessonRequestCountAggregateOutputType> : number>;
    aggregate<T extends LessonRequestAggregateArgs>(args: Prisma.Subset<T, LessonRequestAggregateArgs>): Prisma.PrismaPromise<GetLessonRequestAggregateType<T>>;
    groupBy<T extends LessonRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LessonRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: LessonRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LessonRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LessonRequestFieldRefs;
}
export interface Prisma__LessonRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    student<T extends Prisma.LessonRequest$studentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LessonRequest$studentArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    teacher<T extends Prisma.LessonRequest$teacherArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LessonRequest$teacherArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LessonRequestFieldRefs {
    readonly id: Prisma.FieldRef<"LessonRequest", 'String'>;
    readonly studentId: Prisma.FieldRef<"LessonRequest", 'String'>;
    readonly teacherId: Prisma.FieldRef<"LessonRequest", 'String'>;
    readonly preferredTime: Prisma.FieldRef<"LessonRequest", 'String'>;
    readonly message: Prisma.FieldRef<"LessonRequest", 'String'>;
    readonly status: Prisma.FieldRef<"LessonRequest", 'LessonRequestStatus'>;
    readonly createdAt: Prisma.FieldRef<"LessonRequest", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LessonRequest", 'DateTime'>;
}
export type LessonRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    where: Prisma.LessonRequestWhereUniqueInput;
};
export type LessonRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    where: Prisma.LessonRequestWhereUniqueInput;
};
export type LessonRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    where?: Prisma.LessonRequestWhereInput;
    orderBy?: Prisma.LessonRequestOrderByWithRelationInput | Prisma.LessonRequestOrderByWithRelationInput[];
    cursor?: Prisma.LessonRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LessonRequestScalarFieldEnum | Prisma.LessonRequestScalarFieldEnum[];
};
export type LessonRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    where?: Prisma.LessonRequestWhereInput;
    orderBy?: Prisma.LessonRequestOrderByWithRelationInput | Prisma.LessonRequestOrderByWithRelationInput[];
    cursor?: Prisma.LessonRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LessonRequestScalarFieldEnum | Prisma.LessonRequestScalarFieldEnum[];
};
export type LessonRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    where?: Prisma.LessonRequestWhereInput;
    orderBy?: Prisma.LessonRequestOrderByWithRelationInput | Prisma.LessonRequestOrderByWithRelationInput[];
    cursor?: Prisma.LessonRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LessonRequestScalarFieldEnum | Prisma.LessonRequestScalarFieldEnum[];
};
export type LessonRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LessonRequestCreateInput, Prisma.LessonRequestUncheckedCreateInput>;
};
export type LessonRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LessonRequestCreateManyInput | Prisma.LessonRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LessonRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    data: Prisma.LessonRequestCreateManyInput | Prisma.LessonRequestCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LessonRequestIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LessonRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LessonRequestUpdateInput, Prisma.LessonRequestUncheckedUpdateInput>;
    where: Prisma.LessonRequestWhereUniqueInput;
};
export type LessonRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LessonRequestUpdateManyMutationInput, Prisma.LessonRequestUncheckedUpdateManyInput>;
    where?: Prisma.LessonRequestWhereInput;
    limit?: number;
};
export type LessonRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LessonRequestUpdateManyMutationInput, Prisma.LessonRequestUncheckedUpdateManyInput>;
    where?: Prisma.LessonRequestWhereInput;
    limit?: number;
    include?: Prisma.LessonRequestIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LessonRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    where: Prisma.LessonRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.LessonRequestCreateInput, Prisma.LessonRequestUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LessonRequestUpdateInput, Prisma.LessonRequestUncheckedUpdateInput>;
};
export type LessonRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
    where: Prisma.LessonRequestWhereUniqueInput;
};
export type LessonRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LessonRequestWhereInput;
    limit?: number;
};
export type LessonRequest$studentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type LessonRequest$teacherArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type LessonRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LessonRequestSelect<ExtArgs> | null;
    omit?: Prisma.LessonRequestOmit<ExtArgs> | null;
    include?: Prisma.LessonRequestInclude<ExtArgs> | null;
};
export {};
