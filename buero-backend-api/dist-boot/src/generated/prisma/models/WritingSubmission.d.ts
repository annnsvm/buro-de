import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type WritingSubmissionModel = runtime.Types.Result.DefaultSelection<Prisma.$WritingSubmissionPayload>;
export type AggregateWritingSubmission = {
    _count: WritingSubmissionCountAggregateOutputType | null;
    _avg: WritingSubmissionAvgAggregateOutputType | null;
    _sum: WritingSubmissionSumAggregateOutputType | null;
    _min: WritingSubmissionMinAggregateOutputType | null;
    _max: WritingSubmissionMaxAggregateOutputType | null;
};
export type WritingSubmissionAvgAggregateOutputType = {
    score: number | null;
    maxScore: number | null;
    inputTokens: number | null;
    outputTokens: number | null;
};
export type WritingSubmissionSumAggregateOutputType = {
    score: number | null;
    maxScore: number | null;
    inputTokens: number | null;
    outputTokens: number | null;
};
export type WritingSubmissionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseMaterialId: string | null;
    text: string | null;
    textHash: string | null;
    score: number | null;
    maxScore: number | null;
    inputTokens: number | null;
    outputTokens: number | null;
    createdAt: Date | null;
};
export type WritingSubmissionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseMaterialId: string | null;
    text: string | null;
    textHash: string | null;
    score: number | null;
    maxScore: number | null;
    inputTokens: number | null;
    outputTokens: number | null;
    createdAt: Date | null;
};
export type WritingSubmissionCountAggregateOutputType = {
    id: number;
    userId: number;
    courseMaterialId: number;
    text: number;
    textHash: number;
    score: number;
    maxScore: number;
    assessment: number;
    inputTokens: number;
    outputTokens: number;
    createdAt: number;
    _all: number;
};
export type WritingSubmissionAvgAggregateInputType = {
    score?: true;
    maxScore?: true;
    inputTokens?: true;
    outputTokens?: true;
};
export type WritingSubmissionSumAggregateInputType = {
    score?: true;
    maxScore?: true;
    inputTokens?: true;
    outputTokens?: true;
};
export type WritingSubmissionMinAggregateInputType = {
    id?: true;
    userId?: true;
    courseMaterialId?: true;
    text?: true;
    textHash?: true;
    score?: true;
    maxScore?: true;
    inputTokens?: true;
    outputTokens?: true;
    createdAt?: true;
};
export type WritingSubmissionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    courseMaterialId?: true;
    text?: true;
    textHash?: true;
    score?: true;
    maxScore?: true;
    inputTokens?: true;
    outputTokens?: true;
    createdAt?: true;
};
export type WritingSubmissionCountAggregateInputType = {
    id?: true;
    userId?: true;
    courseMaterialId?: true;
    text?: true;
    textHash?: true;
    score?: true;
    maxScore?: true;
    assessment?: true;
    inputTokens?: true;
    outputTokens?: true;
    createdAt?: true;
    _all?: true;
};
export type WritingSubmissionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WritingSubmissionWhereInput;
    orderBy?: Prisma.WritingSubmissionOrderByWithRelationInput | Prisma.WritingSubmissionOrderByWithRelationInput[];
    cursor?: Prisma.WritingSubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WritingSubmissionCountAggregateInputType;
    _avg?: WritingSubmissionAvgAggregateInputType;
    _sum?: WritingSubmissionSumAggregateInputType;
    _min?: WritingSubmissionMinAggregateInputType;
    _max?: WritingSubmissionMaxAggregateInputType;
};
export type GetWritingSubmissionAggregateType<T extends WritingSubmissionAggregateArgs> = {
    [P in keyof T & keyof AggregateWritingSubmission]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWritingSubmission[P]> : Prisma.GetScalarType<T[P], AggregateWritingSubmission[P]>;
};
export type WritingSubmissionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WritingSubmissionWhereInput;
    orderBy?: Prisma.WritingSubmissionOrderByWithAggregationInput | Prisma.WritingSubmissionOrderByWithAggregationInput[];
    by: Prisma.WritingSubmissionScalarFieldEnum[] | Prisma.WritingSubmissionScalarFieldEnum;
    having?: Prisma.WritingSubmissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WritingSubmissionCountAggregateInputType | true;
    _avg?: WritingSubmissionAvgAggregateInputType;
    _sum?: WritingSubmissionSumAggregateInputType;
    _min?: WritingSubmissionMinAggregateInputType;
    _max?: WritingSubmissionMaxAggregateInputType;
};
export type WritingSubmissionGroupByOutputType = {
    id: string;
    userId: string;
    courseMaterialId: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: runtime.JsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt: Date;
    _count: WritingSubmissionCountAggregateOutputType | null;
    _avg: WritingSubmissionAvgAggregateOutputType | null;
    _sum: WritingSubmissionSumAggregateOutputType | null;
    _min: WritingSubmissionMinAggregateOutputType | null;
    _max: WritingSubmissionMaxAggregateOutputType | null;
};
type GetWritingSubmissionGroupByPayload<T extends WritingSubmissionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WritingSubmissionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WritingSubmissionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WritingSubmissionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WritingSubmissionGroupByOutputType[P]>;
}>>;
export type WritingSubmissionWhereInput = {
    AND?: Prisma.WritingSubmissionWhereInput | Prisma.WritingSubmissionWhereInput[];
    OR?: Prisma.WritingSubmissionWhereInput[];
    NOT?: Prisma.WritingSubmissionWhereInput | Prisma.WritingSubmissionWhereInput[];
    id?: Prisma.StringFilter<"WritingSubmission"> | string;
    userId?: Prisma.StringFilter<"WritingSubmission"> | string;
    courseMaterialId?: Prisma.StringFilter<"WritingSubmission"> | string;
    text?: Prisma.StringFilter<"WritingSubmission"> | string;
    textHash?: Prisma.StringFilter<"WritingSubmission"> | string;
    score?: Prisma.IntFilter<"WritingSubmission"> | number;
    maxScore?: Prisma.IntFilter<"WritingSubmission"> | number;
    assessment?: Prisma.JsonFilter<"WritingSubmission">;
    inputTokens?: Prisma.IntFilter<"WritingSubmission"> | number;
    outputTokens?: Prisma.IntFilter<"WritingSubmission"> | number;
    createdAt?: Prisma.DateTimeFilter<"WritingSubmission"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    courseMaterial?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
};
export type WritingSubmissionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    textHash?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    maxScore?: Prisma.SortOrder;
    assessment?: Prisma.SortOrder;
    inputTokens?: Prisma.SortOrder;
    outputTokens?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    courseMaterial?: Prisma.CourseMaterialOrderByWithRelationInput;
};
export type WritingSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WritingSubmissionWhereInput | Prisma.WritingSubmissionWhereInput[];
    OR?: Prisma.WritingSubmissionWhereInput[];
    NOT?: Prisma.WritingSubmissionWhereInput | Prisma.WritingSubmissionWhereInput[];
    userId?: Prisma.StringFilter<"WritingSubmission"> | string;
    courseMaterialId?: Prisma.StringFilter<"WritingSubmission"> | string;
    text?: Prisma.StringFilter<"WritingSubmission"> | string;
    textHash?: Prisma.StringFilter<"WritingSubmission"> | string;
    score?: Prisma.IntFilter<"WritingSubmission"> | number;
    maxScore?: Prisma.IntFilter<"WritingSubmission"> | number;
    assessment?: Prisma.JsonFilter<"WritingSubmission">;
    inputTokens?: Prisma.IntFilter<"WritingSubmission"> | number;
    outputTokens?: Prisma.IntFilter<"WritingSubmission"> | number;
    createdAt?: Prisma.DateTimeFilter<"WritingSubmission"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    courseMaterial?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
}, "id">;
export type WritingSubmissionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    textHash?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    maxScore?: Prisma.SortOrder;
    assessment?: Prisma.SortOrder;
    inputTokens?: Prisma.SortOrder;
    outputTokens?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.WritingSubmissionCountOrderByAggregateInput;
    _avg?: Prisma.WritingSubmissionAvgOrderByAggregateInput;
    _max?: Prisma.WritingSubmissionMaxOrderByAggregateInput;
    _min?: Prisma.WritingSubmissionMinOrderByAggregateInput;
    _sum?: Prisma.WritingSubmissionSumOrderByAggregateInput;
};
export type WritingSubmissionScalarWhereWithAggregatesInput = {
    AND?: Prisma.WritingSubmissionScalarWhereWithAggregatesInput | Prisma.WritingSubmissionScalarWhereWithAggregatesInput[];
    OR?: Prisma.WritingSubmissionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WritingSubmissionScalarWhereWithAggregatesInput | Prisma.WritingSubmissionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WritingSubmission"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"WritingSubmission"> | string;
    courseMaterialId?: Prisma.StringWithAggregatesFilter<"WritingSubmission"> | string;
    text?: Prisma.StringWithAggregatesFilter<"WritingSubmission"> | string;
    textHash?: Prisma.StringWithAggregatesFilter<"WritingSubmission"> | string;
    score?: Prisma.IntWithAggregatesFilter<"WritingSubmission"> | number;
    maxScore?: Prisma.IntWithAggregatesFilter<"WritingSubmission"> | number;
    assessment?: Prisma.JsonWithAggregatesFilter<"WritingSubmission">;
    inputTokens?: Prisma.IntWithAggregatesFilter<"WritingSubmission"> | number;
    outputTokens?: Prisma.IntWithAggregatesFilter<"WritingSubmission"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WritingSubmission"> | Date | string;
};
export type WritingSubmissionCreateInput = {
    id?: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutWritingSubmissionsInput;
    courseMaterial: Prisma.CourseMaterialCreateNestedOneWithoutWritingSubmissionsInput;
};
export type WritingSubmissionUncheckedCreateInput = {
    id?: string;
    userId: string;
    courseMaterialId: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
};
export type WritingSubmissionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutWritingSubmissionsNestedInput;
    courseMaterial?: Prisma.CourseMaterialUpdateOneRequiredWithoutWritingSubmissionsNestedInput;
};
export type WritingSubmissionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WritingSubmissionCreateManyInput = {
    id?: string;
    userId: string;
    courseMaterialId: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
};
export type WritingSubmissionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WritingSubmissionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WritingSubmissionListRelationFilter = {
    every?: Prisma.WritingSubmissionWhereInput;
    some?: Prisma.WritingSubmissionWhereInput;
    none?: Prisma.WritingSubmissionWhereInput;
};
export type WritingSubmissionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WritingSubmissionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    textHash?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    maxScore?: Prisma.SortOrder;
    assessment?: Prisma.SortOrder;
    inputTokens?: Prisma.SortOrder;
    outputTokens?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WritingSubmissionAvgOrderByAggregateInput = {
    score?: Prisma.SortOrder;
    maxScore?: Prisma.SortOrder;
    inputTokens?: Prisma.SortOrder;
    outputTokens?: Prisma.SortOrder;
};
export type WritingSubmissionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    textHash?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    maxScore?: Prisma.SortOrder;
    inputTokens?: Prisma.SortOrder;
    outputTokens?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WritingSubmissionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    textHash?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    maxScore?: Prisma.SortOrder;
    inputTokens?: Prisma.SortOrder;
    outputTokens?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WritingSubmissionSumOrderByAggregateInput = {
    score?: Prisma.SortOrder;
    maxScore?: Prisma.SortOrder;
    inputTokens?: Prisma.SortOrder;
    outputTokens?: Prisma.SortOrder;
};
export type WritingSubmissionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutUserInput, Prisma.WritingSubmissionUncheckedCreateWithoutUserInput> | Prisma.WritingSubmissionCreateWithoutUserInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutUserInput | Prisma.WritingSubmissionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.WritingSubmissionCreateManyUserInputEnvelope;
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
};
export type WritingSubmissionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutUserInput, Prisma.WritingSubmissionUncheckedCreateWithoutUserInput> | Prisma.WritingSubmissionCreateWithoutUserInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutUserInput | Prisma.WritingSubmissionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.WritingSubmissionCreateManyUserInputEnvelope;
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
};
export type WritingSubmissionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutUserInput, Prisma.WritingSubmissionUncheckedCreateWithoutUserInput> | Prisma.WritingSubmissionCreateWithoutUserInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutUserInput | Prisma.WritingSubmissionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutUserInput | Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.WritingSubmissionCreateManyUserInputEnvelope;
    set?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    disconnect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    delete?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    update?: Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutUserInput | Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.WritingSubmissionUpdateManyWithWhereWithoutUserInput | Prisma.WritingSubmissionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.WritingSubmissionScalarWhereInput | Prisma.WritingSubmissionScalarWhereInput[];
};
export type WritingSubmissionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutUserInput, Prisma.WritingSubmissionUncheckedCreateWithoutUserInput> | Prisma.WritingSubmissionCreateWithoutUserInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutUserInput | Prisma.WritingSubmissionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutUserInput | Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.WritingSubmissionCreateManyUserInputEnvelope;
    set?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    disconnect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    delete?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    update?: Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutUserInput | Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.WritingSubmissionUpdateManyWithWhereWithoutUserInput | Prisma.WritingSubmissionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.WritingSubmissionScalarWhereInput | Prisma.WritingSubmissionScalarWhereInput[];
};
export type WritingSubmissionCreateNestedManyWithoutCourseMaterialInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput> | Prisma.WritingSubmissionCreateWithoutCourseMaterialInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput | Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput[];
    createMany?: Prisma.WritingSubmissionCreateManyCourseMaterialInputEnvelope;
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
};
export type WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput> | Prisma.WritingSubmissionCreateWithoutCourseMaterialInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput | Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput[];
    createMany?: Prisma.WritingSubmissionCreateManyCourseMaterialInputEnvelope;
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
};
export type WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput> | Prisma.WritingSubmissionCreateWithoutCourseMaterialInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput | Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput[];
    upsert?: Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutCourseMaterialInput | Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutCourseMaterialInput[];
    createMany?: Prisma.WritingSubmissionCreateManyCourseMaterialInputEnvelope;
    set?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    disconnect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    delete?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    update?: Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutCourseMaterialInput | Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutCourseMaterialInput[];
    updateMany?: Prisma.WritingSubmissionUpdateManyWithWhereWithoutCourseMaterialInput | Prisma.WritingSubmissionUpdateManyWithWhereWithoutCourseMaterialInput[];
    deleteMany?: Prisma.WritingSubmissionScalarWhereInput | Prisma.WritingSubmissionScalarWhereInput[];
};
export type WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput> | Prisma.WritingSubmissionCreateWithoutCourseMaterialInput[] | Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput | Prisma.WritingSubmissionCreateOrConnectWithoutCourseMaterialInput[];
    upsert?: Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutCourseMaterialInput | Prisma.WritingSubmissionUpsertWithWhereUniqueWithoutCourseMaterialInput[];
    createMany?: Prisma.WritingSubmissionCreateManyCourseMaterialInputEnvelope;
    set?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    disconnect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    delete?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    connect?: Prisma.WritingSubmissionWhereUniqueInput | Prisma.WritingSubmissionWhereUniqueInput[];
    update?: Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutCourseMaterialInput | Prisma.WritingSubmissionUpdateWithWhereUniqueWithoutCourseMaterialInput[];
    updateMany?: Prisma.WritingSubmissionUpdateManyWithWhereWithoutCourseMaterialInput | Prisma.WritingSubmissionUpdateManyWithWhereWithoutCourseMaterialInput[];
    deleteMany?: Prisma.WritingSubmissionScalarWhereInput | Prisma.WritingSubmissionScalarWhereInput[];
};
export type WritingSubmissionCreateWithoutUserInput = {
    id?: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
    courseMaterial: Prisma.CourseMaterialCreateNestedOneWithoutWritingSubmissionsInput;
};
export type WritingSubmissionUncheckedCreateWithoutUserInput = {
    id?: string;
    courseMaterialId: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
};
export type WritingSubmissionCreateOrConnectWithoutUserInput = {
    where: Prisma.WritingSubmissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutUserInput, Prisma.WritingSubmissionUncheckedCreateWithoutUserInput>;
};
export type WritingSubmissionCreateManyUserInputEnvelope = {
    data: Prisma.WritingSubmissionCreateManyUserInput | Prisma.WritingSubmissionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type WritingSubmissionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.WritingSubmissionWhereUniqueInput;
    update: Prisma.XOR<Prisma.WritingSubmissionUpdateWithoutUserInput, Prisma.WritingSubmissionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutUserInput, Prisma.WritingSubmissionUncheckedCreateWithoutUserInput>;
};
export type WritingSubmissionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.WritingSubmissionWhereUniqueInput;
    data: Prisma.XOR<Prisma.WritingSubmissionUpdateWithoutUserInput, Prisma.WritingSubmissionUncheckedUpdateWithoutUserInput>;
};
export type WritingSubmissionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.WritingSubmissionScalarWhereInput;
    data: Prisma.XOR<Prisma.WritingSubmissionUpdateManyMutationInput, Prisma.WritingSubmissionUncheckedUpdateManyWithoutUserInput>;
};
export type WritingSubmissionScalarWhereInput = {
    AND?: Prisma.WritingSubmissionScalarWhereInput | Prisma.WritingSubmissionScalarWhereInput[];
    OR?: Prisma.WritingSubmissionScalarWhereInput[];
    NOT?: Prisma.WritingSubmissionScalarWhereInput | Prisma.WritingSubmissionScalarWhereInput[];
    id?: Prisma.StringFilter<"WritingSubmission"> | string;
    userId?: Prisma.StringFilter<"WritingSubmission"> | string;
    courseMaterialId?: Prisma.StringFilter<"WritingSubmission"> | string;
    text?: Prisma.StringFilter<"WritingSubmission"> | string;
    textHash?: Prisma.StringFilter<"WritingSubmission"> | string;
    score?: Prisma.IntFilter<"WritingSubmission"> | number;
    maxScore?: Prisma.IntFilter<"WritingSubmission"> | number;
    assessment?: Prisma.JsonFilter<"WritingSubmission">;
    inputTokens?: Prisma.IntFilter<"WritingSubmission"> | number;
    outputTokens?: Prisma.IntFilter<"WritingSubmission"> | number;
    createdAt?: Prisma.DateTimeFilter<"WritingSubmission"> | Date | string;
};
export type WritingSubmissionCreateWithoutCourseMaterialInput = {
    id?: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutWritingSubmissionsInput;
};
export type WritingSubmissionUncheckedCreateWithoutCourseMaterialInput = {
    id?: string;
    userId: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
};
export type WritingSubmissionCreateOrConnectWithoutCourseMaterialInput = {
    where: Prisma.WritingSubmissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput>;
};
export type WritingSubmissionCreateManyCourseMaterialInputEnvelope = {
    data: Prisma.WritingSubmissionCreateManyCourseMaterialInput | Prisma.WritingSubmissionCreateManyCourseMaterialInput[];
    skipDuplicates?: boolean;
};
export type WritingSubmissionUpsertWithWhereUniqueWithoutCourseMaterialInput = {
    where: Prisma.WritingSubmissionWhereUniqueInput;
    update: Prisma.XOR<Prisma.WritingSubmissionUpdateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedUpdateWithoutCourseMaterialInput>;
    create: Prisma.XOR<Prisma.WritingSubmissionCreateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedCreateWithoutCourseMaterialInput>;
};
export type WritingSubmissionUpdateWithWhereUniqueWithoutCourseMaterialInput = {
    where: Prisma.WritingSubmissionWhereUniqueInput;
    data: Prisma.XOR<Prisma.WritingSubmissionUpdateWithoutCourseMaterialInput, Prisma.WritingSubmissionUncheckedUpdateWithoutCourseMaterialInput>;
};
export type WritingSubmissionUpdateManyWithWhereWithoutCourseMaterialInput = {
    where: Prisma.WritingSubmissionScalarWhereInput;
    data: Prisma.XOR<Prisma.WritingSubmissionUpdateManyMutationInput, Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialInput>;
};
export type WritingSubmissionCreateManyUserInput = {
    id?: string;
    courseMaterialId: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
};
export type WritingSubmissionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    courseMaterial?: Prisma.CourseMaterialUpdateOneRequiredWithoutWritingSubmissionsNestedInput;
};
export type WritingSubmissionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WritingSubmissionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WritingSubmissionCreateManyCourseMaterialInput = {
    id?: string;
    userId: string;
    text: string;
    textHash: string;
    score: number;
    maxScore: number;
    assessment: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens: number;
    outputTokens: number;
    createdAt?: Date | string;
};
export type WritingSubmissionUpdateWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutWritingSubmissionsNestedInput;
};
export type WritingSubmissionUncheckedUpdateWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    textHash?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    maxScore?: Prisma.IntFieldUpdateOperationsInput | number;
    assessment?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    inputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    outputTokens?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WritingSubmissionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    text?: boolean;
    textHash?: boolean;
    score?: boolean;
    maxScore?: boolean;
    assessment?: boolean;
    inputTokens?: boolean;
    outputTokens?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["writingSubmission"]>;
export type WritingSubmissionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    text?: boolean;
    textHash?: boolean;
    score?: boolean;
    maxScore?: boolean;
    assessment?: boolean;
    inputTokens?: boolean;
    outputTokens?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["writingSubmission"]>;
export type WritingSubmissionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    text?: boolean;
    textHash?: boolean;
    score?: boolean;
    maxScore?: boolean;
    assessment?: boolean;
    inputTokens?: boolean;
    outputTokens?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["writingSubmission"]>;
export type WritingSubmissionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    text?: boolean;
    textHash?: boolean;
    score?: boolean;
    maxScore?: boolean;
    assessment?: boolean;
    inputTokens?: boolean;
    outputTokens?: boolean;
    createdAt?: boolean;
};
export type WritingSubmissionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "courseMaterialId" | "text" | "textHash" | "score" | "maxScore" | "assessment" | "inputTokens" | "outputTokens" | "createdAt", ExtArgs["result"]["writingSubmission"]>;
export type WritingSubmissionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type WritingSubmissionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type WritingSubmissionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type $WritingSubmissionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WritingSubmission";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        courseMaterial: Prisma.$CourseMaterialPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        courseMaterialId: string;
        text: string;
        textHash: string;
        score: number;
        maxScore: number;
        assessment: runtime.JsonValue;
        inputTokens: number;
        outputTokens: number;
        createdAt: Date;
    }, ExtArgs["result"]["writingSubmission"]>;
    composites: {};
};
export type WritingSubmissionGetPayload<S extends boolean | null | undefined | WritingSubmissionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload, S>;
export type WritingSubmissionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WritingSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WritingSubmissionCountAggregateInputType | true;
};
export interface WritingSubmissionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WritingSubmission'];
        meta: {
            name: 'WritingSubmission';
        };
    };
    findUnique<T extends WritingSubmissionFindUniqueArgs>(args: Prisma.SelectSubset<T, WritingSubmissionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WritingSubmissionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WritingSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WritingSubmissionFindFirstArgs>(args?: Prisma.SelectSubset<T, WritingSubmissionFindFirstArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WritingSubmissionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WritingSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WritingSubmissionFindManyArgs>(args?: Prisma.SelectSubset<T, WritingSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WritingSubmissionCreateArgs>(args: Prisma.SelectSubset<T, WritingSubmissionCreateArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WritingSubmissionCreateManyArgs>(args?: Prisma.SelectSubset<T, WritingSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WritingSubmissionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WritingSubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WritingSubmissionDeleteArgs>(args: Prisma.SelectSubset<T, WritingSubmissionDeleteArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WritingSubmissionUpdateArgs>(args: Prisma.SelectSubset<T, WritingSubmissionUpdateArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WritingSubmissionDeleteManyArgs>(args?: Prisma.SelectSubset<T, WritingSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WritingSubmissionUpdateManyArgs>(args: Prisma.SelectSubset<T, WritingSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WritingSubmissionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WritingSubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WritingSubmissionUpsertArgs>(args: Prisma.SelectSubset<T, WritingSubmissionUpsertArgs<ExtArgs>>): Prisma.Prisma__WritingSubmissionClient<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WritingSubmissionCountArgs>(args?: Prisma.Subset<T, WritingSubmissionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WritingSubmissionCountAggregateOutputType> : number>;
    aggregate<T extends WritingSubmissionAggregateArgs>(args: Prisma.Subset<T, WritingSubmissionAggregateArgs>): Prisma.PrismaPromise<GetWritingSubmissionAggregateType<T>>;
    groupBy<T extends WritingSubmissionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WritingSubmissionGroupByArgs['orderBy'];
    } : {
        orderBy?: WritingSubmissionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WritingSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWritingSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WritingSubmissionFieldRefs;
}
export interface Prisma__WritingSubmissionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    courseMaterial<T extends Prisma.CourseMaterialDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterialDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WritingSubmissionFieldRefs {
    readonly id: Prisma.FieldRef<"WritingSubmission", 'String'>;
    readonly userId: Prisma.FieldRef<"WritingSubmission", 'String'>;
    readonly courseMaterialId: Prisma.FieldRef<"WritingSubmission", 'String'>;
    readonly text: Prisma.FieldRef<"WritingSubmission", 'String'>;
    readonly textHash: Prisma.FieldRef<"WritingSubmission", 'String'>;
    readonly score: Prisma.FieldRef<"WritingSubmission", 'Int'>;
    readonly maxScore: Prisma.FieldRef<"WritingSubmission", 'Int'>;
    readonly assessment: Prisma.FieldRef<"WritingSubmission", 'Json'>;
    readonly inputTokens: Prisma.FieldRef<"WritingSubmission", 'Int'>;
    readonly outputTokens: Prisma.FieldRef<"WritingSubmission", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"WritingSubmission", 'DateTime'>;
}
export type WritingSubmissionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    where: Prisma.WritingSubmissionWhereUniqueInput;
};
export type WritingSubmissionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    where: Prisma.WritingSubmissionWhereUniqueInput;
};
export type WritingSubmissionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    where?: Prisma.WritingSubmissionWhereInput;
    orderBy?: Prisma.WritingSubmissionOrderByWithRelationInput | Prisma.WritingSubmissionOrderByWithRelationInput[];
    cursor?: Prisma.WritingSubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WritingSubmissionScalarFieldEnum | Prisma.WritingSubmissionScalarFieldEnum[];
};
export type WritingSubmissionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    where?: Prisma.WritingSubmissionWhereInput;
    orderBy?: Prisma.WritingSubmissionOrderByWithRelationInput | Prisma.WritingSubmissionOrderByWithRelationInput[];
    cursor?: Prisma.WritingSubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WritingSubmissionScalarFieldEnum | Prisma.WritingSubmissionScalarFieldEnum[];
};
export type WritingSubmissionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    where?: Prisma.WritingSubmissionWhereInput;
    orderBy?: Prisma.WritingSubmissionOrderByWithRelationInput | Prisma.WritingSubmissionOrderByWithRelationInput[];
    cursor?: Prisma.WritingSubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WritingSubmissionScalarFieldEnum | Prisma.WritingSubmissionScalarFieldEnum[];
};
export type WritingSubmissionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WritingSubmissionCreateInput, Prisma.WritingSubmissionUncheckedCreateInput>;
};
export type WritingSubmissionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WritingSubmissionCreateManyInput | Prisma.WritingSubmissionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WritingSubmissionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    data: Prisma.WritingSubmissionCreateManyInput | Prisma.WritingSubmissionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WritingSubmissionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WritingSubmissionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WritingSubmissionUpdateInput, Prisma.WritingSubmissionUncheckedUpdateInput>;
    where: Prisma.WritingSubmissionWhereUniqueInput;
};
export type WritingSubmissionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WritingSubmissionUpdateManyMutationInput, Prisma.WritingSubmissionUncheckedUpdateManyInput>;
    where?: Prisma.WritingSubmissionWhereInput;
    limit?: number;
};
export type WritingSubmissionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WritingSubmissionUpdateManyMutationInput, Prisma.WritingSubmissionUncheckedUpdateManyInput>;
    where?: Prisma.WritingSubmissionWhereInput;
    limit?: number;
    include?: Prisma.WritingSubmissionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WritingSubmissionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    where: Prisma.WritingSubmissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.WritingSubmissionCreateInput, Prisma.WritingSubmissionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WritingSubmissionUpdateInput, Prisma.WritingSubmissionUncheckedUpdateInput>;
};
export type WritingSubmissionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
    where: Prisma.WritingSubmissionWhereUniqueInput;
};
export type WritingSubmissionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WritingSubmissionWhereInput;
    limit?: number;
};
export type WritingSubmissionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WritingSubmissionSelect<ExtArgs> | null;
    omit?: Prisma.WritingSubmissionOmit<ExtArgs> | null;
    include?: Prisma.WritingSubmissionInclude<ExtArgs> | null;
};
export {};
