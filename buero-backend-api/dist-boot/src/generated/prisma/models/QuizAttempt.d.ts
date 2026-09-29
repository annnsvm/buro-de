import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type QuizAttemptModel = runtime.Types.Result.DefaultSelection<Prisma.$QuizAttemptPayload>;
export type AggregateQuizAttempt = {
    _count: QuizAttemptCountAggregateOutputType | null;
    _avg: QuizAttemptAvgAggregateOutputType | null;
    _sum: QuizAttemptSumAggregateOutputType | null;
    _min: QuizAttemptMinAggregateOutputType | null;
    _max: QuizAttemptMaxAggregateOutputType | null;
};
export type QuizAttemptAvgAggregateOutputType = {
    score: runtime.Decimal | null;
};
export type QuizAttemptSumAggregateOutputType = {
    score: runtime.Decimal | null;
};
export type QuizAttemptMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseMaterialId: string | null;
    score: runtime.Decimal | null;
    completedAt: Date | null;
    createdAt: Date | null;
};
export type QuizAttemptMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseMaterialId: string | null;
    score: runtime.Decimal | null;
    completedAt: Date | null;
    createdAt: Date | null;
};
export type QuizAttemptCountAggregateOutputType = {
    id: number;
    userId: number;
    courseMaterialId: number;
    score: number;
    answersSnapshot: number;
    completedAt: number;
    createdAt: number;
    _all: number;
};
export type QuizAttemptAvgAggregateInputType = {
    score?: true;
};
export type QuizAttemptSumAggregateInputType = {
    score?: true;
};
export type QuizAttemptMinAggregateInputType = {
    id?: true;
    userId?: true;
    courseMaterialId?: true;
    score?: true;
    completedAt?: true;
    createdAt?: true;
};
export type QuizAttemptMaxAggregateInputType = {
    id?: true;
    userId?: true;
    courseMaterialId?: true;
    score?: true;
    completedAt?: true;
    createdAt?: true;
};
export type QuizAttemptCountAggregateInputType = {
    id?: true;
    userId?: true;
    courseMaterialId?: true;
    score?: true;
    answersSnapshot?: true;
    completedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type QuizAttemptAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuizAttemptWhereInput;
    orderBy?: Prisma.QuizAttemptOrderByWithRelationInput | Prisma.QuizAttemptOrderByWithRelationInput[];
    cursor?: Prisma.QuizAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | QuizAttemptCountAggregateInputType;
    _avg?: QuizAttemptAvgAggregateInputType;
    _sum?: QuizAttemptSumAggregateInputType;
    _min?: QuizAttemptMinAggregateInputType;
    _max?: QuizAttemptMaxAggregateInputType;
};
export type GetQuizAttemptAggregateType<T extends QuizAttemptAggregateArgs> = {
    [P in keyof T & keyof AggregateQuizAttempt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuizAttempt[P]> : Prisma.GetScalarType<T[P], AggregateQuizAttempt[P]>;
};
export type QuizAttemptGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuizAttemptWhereInput;
    orderBy?: Prisma.QuizAttemptOrderByWithAggregationInput | Prisma.QuizAttemptOrderByWithAggregationInput[];
    by: Prisma.QuizAttemptScalarFieldEnum[] | Prisma.QuizAttemptScalarFieldEnum;
    having?: Prisma.QuizAttemptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuizAttemptCountAggregateInputType | true;
    _avg?: QuizAttemptAvgAggregateInputType;
    _sum?: QuizAttemptSumAggregateInputType;
    _min?: QuizAttemptMinAggregateInputType;
    _max?: QuizAttemptMaxAggregateInputType;
};
export type QuizAttemptGroupByOutputType = {
    id: string;
    userId: string;
    courseMaterialId: string;
    score: runtime.Decimal | null;
    answersSnapshot: runtime.JsonValue | null;
    completedAt: Date | null;
    createdAt: Date;
    _count: QuizAttemptCountAggregateOutputType | null;
    _avg: QuizAttemptAvgAggregateOutputType | null;
    _sum: QuizAttemptSumAggregateOutputType | null;
    _min: QuizAttemptMinAggregateOutputType | null;
    _max: QuizAttemptMaxAggregateOutputType | null;
};
type GetQuizAttemptGroupByPayload<T extends QuizAttemptGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuizAttemptGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuizAttemptGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuizAttemptGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuizAttemptGroupByOutputType[P]>;
}>>;
export type QuizAttemptWhereInput = {
    AND?: Prisma.QuizAttemptWhereInput | Prisma.QuizAttemptWhereInput[];
    OR?: Prisma.QuizAttemptWhereInput[];
    NOT?: Prisma.QuizAttemptWhereInput | Prisma.QuizAttemptWhereInput[];
    id?: Prisma.StringFilter<"QuizAttempt"> | string;
    userId?: Prisma.StringFilter<"QuizAttempt"> | string;
    courseMaterialId?: Prisma.StringFilter<"QuizAttempt"> | string;
    score?: Prisma.DecimalNullableFilter<"QuizAttempt"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.JsonNullableFilter<"QuizAttempt">;
    completedAt?: Prisma.DateTimeNullableFilter<"QuizAttempt"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"QuizAttempt"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    courseMaterial?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
    questionAttempts?: Prisma.QuestionAttemptListRelationFilter;
};
export type QuizAttemptOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    score?: Prisma.SortOrderInput | Prisma.SortOrder;
    answersSnapshot?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    courseMaterial?: Prisma.CourseMaterialOrderByWithRelationInput;
    questionAttempts?: Prisma.QuestionAttemptOrderByRelationAggregateInput;
};
export type QuizAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.QuizAttemptWhereInput | Prisma.QuizAttemptWhereInput[];
    OR?: Prisma.QuizAttemptWhereInput[];
    NOT?: Prisma.QuizAttemptWhereInput | Prisma.QuizAttemptWhereInput[];
    userId?: Prisma.StringFilter<"QuizAttempt"> | string;
    courseMaterialId?: Prisma.StringFilter<"QuizAttempt"> | string;
    score?: Prisma.DecimalNullableFilter<"QuizAttempt"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.JsonNullableFilter<"QuizAttempt">;
    completedAt?: Prisma.DateTimeNullableFilter<"QuizAttempt"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"QuizAttempt"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    courseMaterial?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
    questionAttempts?: Prisma.QuestionAttemptListRelationFilter;
}, "id">;
export type QuizAttemptOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    score?: Prisma.SortOrderInput | Prisma.SortOrder;
    answersSnapshot?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.QuizAttemptCountOrderByAggregateInput;
    _avg?: Prisma.QuizAttemptAvgOrderByAggregateInput;
    _max?: Prisma.QuizAttemptMaxOrderByAggregateInput;
    _min?: Prisma.QuizAttemptMinOrderByAggregateInput;
    _sum?: Prisma.QuizAttemptSumOrderByAggregateInput;
};
export type QuizAttemptScalarWhereWithAggregatesInput = {
    AND?: Prisma.QuizAttemptScalarWhereWithAggregatesInput | Prisma.QuizAttemptScalarWhereWithAggregatesInput[];
    OR?: Prisma.QuizAttemptScalarWhereWithAggregatesInput[];
    NOT?: Prisma.QuizAttemptScalarWhereWithAggregatesInput | Prisma.QuizAttemptScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"QuizAttempt"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"QuizAttempt"> | string;
    courseMaterialId?: Prisma.StringWithAggregatesFilter<"QuizAttempt"> | string;
    score?: Prisma.DecimalNullableWithAggregatesFilter<"QuizAttempt"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.JsonNullableWithAggregatesFilter<"QuizAttempt">;
    completedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"QuizAttempt"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"QuizAttempt"> | Date | string;
};
export type QuizAttemptCreateInput = {
    id?: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutQuizAttemptsInput;
    courseMaterial: Prisma.CourseMaterialCreateNestedOneWithoutQuizAttemptsInput;
    questionAttempts?: Prisma.QuestionAttemptCreateNestedManyWithoutQuizAttemptInput;
};
export type QuizAttemptUncheckedCreateInput = {
    id?: string;
    userId: string;
    courseMaterialId: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    questionAttempts?: Prisma.QuestionAttemptUncheckedCreateNestedManyWithoutQuizAttemptInput;
};
export type QuizAttemptUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutQuizAttemptsNestedInput;
    courseMaterial?: Prisma.CourseMaterialUpdateOneRequiredWithoutQuizAttemptsNestedInput;
    questionAttempts?: Prisma.QuestionAttemptUpdateManyWithoutQuizAttemptNestedInput;
};
export type QuizAttemptUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    questionAttempts?: Prisma.QuestionAttemptUncheckedUpdateManyWithoutQuizAttemptNestedInput;
};
export type QuizAttemptCreateManyInput = {
    id?: string;
    userId: string;
    courseMaterialId: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type QuizAttemptUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuizAttemptUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuizAttemptListRelationFilter = {
    every?: Prisma.QuizAttemptWhereInput;
    some?: Prisma.QuizAttemptWhereInput;
    none?: Prisma.QuizAttemptWhereInput;
};
export type QuizAttemptOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type QuizAttemptCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    answersSnapshot?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuizAttemptAvgOrderByAggregateInput = {
    score?: Prisma.SortOrder;
};
export type QuizAttemptMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuizAttemptMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type QuizAttemptSumOrderByAggregateInput = {
    score?: Prisma.SortOrder;
};
export type QuizAttemptNullableScalarRelationFilter = {
    is?: Prisma.QuizAttemptWhereInput | null;
    isNot?: Prisma.QuizAttemptWhereInput | null;
};
export type QuizAttemptCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutUserInput, Prisma.QuizAttemptUncheckedCreateWithoutUserInput> | Prisma.QuizAttemptCreateWithoutUserInput[] | Prisma.QuizAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutUserInput | Prisma.QuizAttemptCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.QuizAttemptCreateManyUserInputEnvelope;
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
};
export type QuizAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutUserInput, Prisma.QuizAttemptUncheckedCreateWithoutUserInput> | Prisma.QuizAttemptCreateWithoutUserInput[] | Prisma.QuizAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutUserInput | Prisma.QuizAttemptCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.QuizAttemptCreateManyUserInputEnvelope;
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
};
export type QuizAttemptUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutUserInput, Prisma.QuizAttemptUncheckedCreateWithoutUserInput> | Prisma.QuizAttemptCreateWithoutUserInput[] | Prisma.QuizAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutUserInput | Prisma.QuizAttemptCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.QuizAttemptUpsertWithWhereUniqueWithoutUserInput | Prisma.QuizAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.QuizAttemptCreateManyUserInputEnvelope;
    set?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    delete?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    update?: Prisma.QuizAttemptUpdateWithWhereUniqueWithoutUserInput | Prisma.QuizAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.QuizAttemptUpdateManyWithWhereWithoutUserInput | Prisma.QuizAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.QuizAttemptScalarWhereInput | Prisma.QuizAttemptScalarWhereInput[];
};
export type QuizAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutUserInput, Prisma.QuizAttemptUncheckedCreateWithoutUserInput> | Prisma.QuizAttemptCreateWithoutUserInput[] | Prisma.QuizAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutUserInput | Prisma.QuizAttemptCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.QuizAttemptUpsertWithWhereUniqueWithoutUserInput | Prisma.QuizAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.QuizAttemptCreateManyUserInputEnvelope;
    set?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    delete?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    update?: Prisma.QuizAttemptUpdateWithWhereUniqueWithoutUserInput | Prisma.QuizAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.QuizAttemptUpdateManyWithWhereWithoutUserInput | Prisma.QuizAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.QuizAttemptScalarWhereInput | Prisma.QuizAttemptScalarWhereInput[];
};
export type QuizAttemptCreateNestedManyWithoutCourseMaterialInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput> | Prisma.QuizAttemptCreateWithoutCourseMaterialInput[] | Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput | Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput[];
    createMany?: Prisma.QuizAttemptCreateManyCourseMaterialInputEnvelope;
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
};
export type QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput> | Prisma.QuizAttemptCreateWithoutCourseMaterialInput[] | Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput | Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput[];
    createMany?: Prisma.QuizAttemptCreateManyCourseMaterialInputEnvelope;
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
};
export type QuizAttemptUpdateManyWithoutCourseMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput> | Prisma.QuizAttemptCreateWithoutCourseMaterialInput[] | Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput | Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput[];
    upsert?: Prisma.QuizAttemptUpsertWithWhereUniqueWithoutCourseMaterialInput | Prisma.QuizAttemptUpsertWithWhereUniqueWithoutCourseMaterialInput[];
    createMany?: Prisma.QuizAttemptCreateManyCourseMaterialInputEnvelope;
    set?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    delete?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    update?: Prisma.QuizAttemptUpdateWithWhereUniqueWithoutCourseMaterialInput | Prisma.QuizAttemptUpdateWithWhereUniqueWithoutCourseMaterialInput[];
    updateMany?: Prisma.QuizAttemptUpdateManyWithWhereWithoutCourseMaterialInput | Prisma.QuizAttemptUpdateManyWithWhereWithoutCourseMaterialInput[];
    deleteMany?: Prisma.QuizAttemptScalarWhereInput | Prisma.QuizAttemptScalarWhereInput[];
};
export type QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput> | Prisma.QuizAttemptCreateWithoutCourseMaterialInput[] | Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput | Prisma.QuizAttemptCreateOrConnectWithoutCourseMaterialInput[];
    upsert?: Prisma.QuizAttemptUpsertWithWhereUniqueWithoutCourseMaterialInput | Prisma.QuizAttemptUpsertWithWhereUniqueWithoutCourseMaterialInput[];
    createMany?: Prisma.QuizAttemptCreateManyCourseMaterialInputEnvelope;
    set?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    delete?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    connect?: Prisma.QuizAttemptWhereUniqueInput | Prisma.QuizAttemptWhereUniqueInput[];
    update?: Prisma.QuizAttemptUpdateWithWhereUniqueWithoutCourseMaterialInput | Prisma.QuizAttemptUpdateWithWhereUniqueWithoutCourseMaterialInput[];
    updateMany?: Prisma.QuizAttemptUpdateManyWithWhereWithoutCourseMaterialInput | Prisma.QuizAttemptUpdateManyWithWhereWithoutCourseMaterialInput[];
    deleteMany?: Prisma.QuizAttemptScalarWhereInput | Prisma.QuizAttemptScalarWhereInput[];
};
export type QuizAttemptCreateNestedOneWithoutQuestionAttemptsInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutQuestionAttemptsInput, Prisma.QuizAttemptUncheckedCreateWithoutQuestionAttemptsInput>;
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutQuestionAttemptsInput;
    connect?: Prisma.QuizAttemptWhereUniqueInput;
};
export type QuizAttemptUpdateOneWithoutQuestionAttemptsNestedInput = {
    create?: Prisma.XOR<Prisma.QuizAttemptCreateWithoutQuestionAttemptsInput, Prisma.QuizAttemptUncheckedCreateWithoutQuestionAttemptsInput>;
    connectOrCreate?: Prisma.QuizAttemptCreateOrConnectWithoutQuestionAttemptsInput;
    upsert?: Prisma.QuizAttemptUpsertWithoutQuestionAttemptsInput;
    disconnect?: Prisma.QuizAttemptWhereInput | boolean;
    delete?: Prisma.QuizAttemptWhereInput | boolean;
    connect?: Prisma.QuizAttemptWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.QuizAttemptUpdateToOneWithWhereWithoutQuestionAttemptsInput, Prisma.QuizAttemptUpdateWithoutQuestionAttemptsInput>, Prisma.QuizAttemptUncheckedUpdateWithoutQuestionAttemptsInput>;
};
export type QuizAttemptCreateWithoutUserInput = {
    id?: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    courseMaterial: Prisma.CourseMaterialCreateNestedOneWithoutQuizAttemptsInput;
    questionAttempts?: Prisma.QuestionAttemptCreateNestedManyWithoutQuizAttemptInput;
};
export type QuizAttemptUncheckedCreateWithoutUserInput = {
    id?: string;
    courseMaterialId: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    questionAttempts?: Prisma.QuestionAttemptUncheckedCreateNestedManyWithoutQuizAttemptInput;
};
export type QuizAttemptCreateOrConnectWithoutUserInput = {
    where: Prisma.QuizAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuizAttemptCreateWithoutUserInput, Prisma.QuizAttemptUncheckedCreateWithoutUserInput>;
};
export type QuizAttemptCreateManyUserInputEnvelope = {
    data: Prisma.QuizAttemptCreateManyUserInput | Prisma.QuizAttemptCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type QuizAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.QuizAttemptWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuizAttemptUpdateWithoutUserInput, Prisma.QuizAttemptUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.QuizAttemptCreateWithoutUserInput, Prisma.QuizAttemptUncheckedCreateWithoutUserInput>;
};
export type QuizAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.QuizAttemptWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuizAttemptUpdateWithoutUserInput, Prisma.QuizAttemptUncheckedUpdateWithoutUserInput>;
};
export type QuizAttemptUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.QuizAttemptScalarWhereInput;
    data: Prisma.XOR<Prisma.QuizAttemptUpdateManyMutationInput, Prisma.QuizAttemptUncheckedUpdateManyWithoutUserInput>;
};
export type QuizAttemptScalarWhereInput = {
    AND?: Prisma.QuizAttemptScalarWhereInput | Prisma.QuizAttemptScalarWhereInput[];
    OR?: Prisma.QuizAttemptScalarWhereInput[];
    NOT?: Prisma.QuizAttemptScalarWhereInput | Prisma.QuizAttemptScalarWhereInput[];
    id?: Prisma.StringFilter<"QuizAttempt"> | string;
    userId?: Prisma.StringFilter<"QuizAttempt"> | string;
    courseMaterialId?: Prisma.StringFilter<"QuizAttempt"> | string;
    score?: Prisma.DecimalNullableFilter<"QuizAttempt"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.JsonNullableFilter<"QuizAttempt">;
    completedAt?: Prisma.DateTimeNullableFilter<"QuizAttempt"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"QuizAttempt"> | Date | string;
};
export type QuizAttemptCreateWithoutCourseMaterialInput = {
    id?: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutQuizAttemptsInput;
    questionAttempts?: Prisma.QuestionAttemptCreateNestedManyWithoutQuizAttemptInput;
};
export type QuizAttemptUncheckedCreateWithoutCourseMaterialInput = {
    id?: string;
    userId: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    questionAttempts?: Prisma.QuestionAttemptUncheckedCreateNestedManyWithoutQuizAttemptInput;
};
export type QuizAttemptCreateOrConnectWithoutCourseMaterialInput = {
    where: Prisma.QuizAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuizAttemptCreateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput>;
};
export type QuizAttemptCreateManyCourseMaterialInputEnvelope = {
    data: Prisma.QuizAttemptCreateManyCourseMaterialInput | Prisma.QuizAttemptCreateManyCourseMaterialInput[];
    skipDuplicates?: boolean;
};
export type QuizAttemptUpsertWithWhereUniqueWithoutCourseMaterialInput = {
    where: Prisma.QuizAttemptWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuizAttemptUpdateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedUpdateWithoutCourseMaterialInput>;
    create: Prisma.XOR<Prisma.QuizAttemptCreateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedCreateWithoutCourseMaterialInput>;
};
export type QuizAttemptUpdateWithWhereUniqueWithoutCourseMaterialInput = {
    where: Prisma.QuizAttemptWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuizAttemptUpdateWithoutCourseMaterialInput, Prisma.QuizAttemptUncheckedUpdateWithoutCourseMaterialInput>;
};
export type QuizAttemptUpdateManyWithWhereWithoutCourseMaterialInput = {
    where: Prisma.QuizAttemptScalarWhereInput;
    data: Prisma.XOR<Prisma.QuizAttemptUpdateManyMutationInput, Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialInput>;
};
export type QuizAttemptCreateWithoutQuestionAttemptsInput = {
    id?: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutQuizAttemptsInput;
    courseMaterial: Prisma.CourseMaterialCreateNestedOneWithoutQuizAttemptsInput;
};
export type QuizAttemptUncheckedCreateWithoutQuestionAttemptsInput = {
    id?: string;
    userId: string;
    courseMaterialId: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type QuizAttemptCreateOrConnectWithoutQuestionAttemptsInput = {
    where: Prisma.QuizAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuizAttemptCreateWithoutQuestionAttemptsInput, Prisma.QuizAttemptUncheckedCreateWithoutQuestionAttemptsInput>;
};
export type QuizAttemptUpsertWithoutQuestionAttemptsInput = {
    update: Prisma.XOR<Prisma.QuizAttemptUpdateWithoutQuestionAttemptsInput, Prisma.QuizAttemptUncheckedUpdateWithoutQuestionAttemptsInput>;
    create: Prisma.XOR<Prisma.QuizAttemptCreateWithoutQuestionAttemptsInput, Prisma.QuizAttemptUncheckedCreateWithoutQuestionAttemptsInput>;
    where?: Prisma.QuizAttemptWhereInput;
};
export type QuizAttemptUpdateToOneWithWhereWithoutQuestionAttemptsInput = {
    where?: Prisma.QuizAttemptWhereInput;
    data: Prisma.XOR<Prisma.QuizAttemptUpdateWithoutQuestionAttemptsInput, Prisma.QuizAttemptUncheckedUpdateWithoutQuestionAttemptsInput>;
};
export type QuizAttemptUpdateWithoutQuestionAttemptsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutQuizAttemptsNestedInput;
    courseMaterial?: Prisma.CourseMaterialUpdateOneRequiredWithoutQuizAttemptsNestedInput;
};
export type QuizAttemptUncheckedUpdateWithoutQuestionAttemptsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuizAttemptCreateManyUserInput = {
    id?: string;
    courseMaterialId: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type QuizAttemptUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    courseMaterial?: Prisma.CourseMaterialUpdateOneRequiredWithoutQuizAttemptsNestedInput;
    questionAttempts?: Prisma.QuestionAttemptUpdateManyWithoutQuizAttemptNestedInput;
};
export type QuizAttemptUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    questionAttempts?: Prisma.QuestionAttemptUncheckedUpdateManyWithoutQuizAttemptNestedInput;
};
export type QuizAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuizAttemptCreateManyCourseMaterialInput = {
    id?: string;
    userId: string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type QuizAttemptUpdateWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutQuizAttemptsNestedInput;
    questionAttempts?: Prisma.QuestionAttemptUpdateManyWithoutQuizAttemptNestedInput;
};
export type QuizAttemptUncheckedUpdateWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    questionAttempts?: Prisma.QuestionAttemptUncheckedUpdateManyWithoutQuizAttemptNestedInput;
};
export type QuizAttemptUncheckedUpdateManyWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    answersSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuizAttemptCountOutputType = {
    questionAttempts: number;
};
export type QuizAttemptCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    questionAttempts?: boolean | QuizAttemptCountOutputTypeCountQuestionAttemptsArgs;
};
export type QuizAttemptCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptCountOutputTypeSelect<ExtArgs> | null;
};
export type QuizAttemptCountOutputTypeCountQuestionAttemptsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionAttemptWhereInput;
};
export type QuizAttemptSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    score?: boolean;
    answersSnapshot?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
    questionAttempts?: boolean | Prisma.QuizAttempt$questionAttemptsArgs<ExtArgs>;
    _count?: boolean | Prisma.QuizAttemptCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["quizAttempt"]>;
export type QuizAttemptSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    score?: boolean;
    answersSnapshot?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["quizAttempt"]>;
export type QuizAttemptSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    score?: boolean;
    answersSnapshot?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["quizAttempt"]>;
export type QuizAttemptSelectScalar = {
    id?: boolean;
    userId?: boolean;
    courseMaterialId?: boolean;
    score?: boolean;
    answersSnapshot?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
};
export type QuizAttemptOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "courseMaterialId" | "score" | "answersSnapshot" | "completedAt" | "createdAt", ExtArgs["result"]["quizAttempt"]>;
export type QuizAttemptInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
    questionAttempts?: boolean | Prisma.QuizAttempt$questionAttemptsArgs<ExtArgs>;
    _count?: boolean | Prisma.QuizAttemptCountOutputTypeDefaultArgs<ExtArgs>;
};
export type QuizAttemptIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type QuizAttemptIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type $QuizAttemptPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "QuizAttempt";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        courseMaterial: Prisma.$CourseMaterialPayload<ExtArgs>;
        questionAttempts: Prisma.$QuestionAttemptPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        courseMaterialId: string;
        score: runtime.Decimal | null;
        answersSnapshot: runtime.JsonValue | null;
        completedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["quizAttempt"]>;
    composites: {};
};
export type QuizAttemptGetPayload<S extends boolean | null | undefined | QuizAttemptDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload, S>;
export type QuizAttemptCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<QuizAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuizAttemptCountAggregateInputType | true;
};
export interface QuizAttemptDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['QuizAttempt'];
        meta: {
            name: 'QuizAttempt';
        };
    };
    findUnique<T extends QuizAttemptFindUniqueArgs>(args: Prisma.SelectSubset<T, QuizAttemptFindUniqueArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends QuizAttemptFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, QuizAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends QuizAttemptFindFirstArgs>(args?: Prisma.SelectSubset<T, QuizAttemptFindFirstArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends QuizAttemptFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, QuizAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends QuizAttemptFindManyArgs>(args?: Prisma.SelectSubset<T, QuizAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends QuizAttemptCreateArgs>(args: Prisma.SelectSubset<T, QuizAttemptCreateArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends QuizAttemptCreateManyArgs>(args?: Prisma.SelectSubset<T, QuizAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends QuizAttemptCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, QuizAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends QuizAttemptDeleteArgs>(args: Prisma.SelectSubset<T, QuizAttemptDeleteArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends QuizAttemptUpdateArgs>(args: Prisma.SelectSubset<T, QuizAttemptUpdateArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends QuizAttemptDeleteManyArgs>(args?: Prisma.SelectSubset<T, QuizAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends QuizAttemptUpdateManyArgs>(args: Prisma.SelectSubset<T, QuizAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends QuizAttemptUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, QuizAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends QuizAttemptUpsertArgs>(args: Prisma.SelectSubset<T, QuizAttemptUpsertArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends QuizAttemptCountArgs>(args?: Prisma.Subset<T, QuizAttemptCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuizAttemptCountAggregateOutputType> : number>;
    aggregate<T extends QuizAttemptAggregateArgs>(args: Prisma.Subset<T, QuizAttemptAggregateArgs>): Prisma.PrismaPromise<GetQuizAttemptAggregateType<T>>;
    groupBy<T extends QuizAttemptGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: QuizAttemptGroupByArgs['orderBy'];
    } : {
        orderBy?: QuizAttemptGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, QuizAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: QuizAttemptFieldRefs;
}
export interface Prisma__QuizAttemptClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    courseMaterial<T extends Prisma.CourseMaterialDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterialDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    questionAttempts<T extends Prisma.QuizAttempt$questionAttemptsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.QuizAttempt$questionAttemptsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface QuizAttemptFieldRefs {
    readonly id: Prisma.FieldRef<"QuizAttempt", 'String'>;
    readonly userId: Prisma.FieldRef<"QuizAttempt", 'String'>;
    readonly courseMaterialId: Prisma.FieldRef<"QuizAttempt", 'String'>;
    readonly score: Prisma.FieldRef<"QuizAttempt", 'Decimal'>;
    readonly answersSnapshot: Prisma.FieldRef<"QuizAttempt", 'Json'>;
    readonly completedAt: Prisma.FieldRef<"QuizAttempt", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"QuizAttempt", 'DateTime'>;
}
export type QuizAttemptFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where: Prisma.QuizAttemptWhereUniqueInput;
};
export type QuizAttemptFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where: Prisma.QuizAttemptWhereUniqueInput;
};
export type QuizAttemptFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where?: Prisma.QuizAttemptWhereInput;
    orderBy?: Prisma.QuizAttemptOrderByWithRelationInput | Prisma.QuizAttemptOrderByWithRelationInput[];
    cursor?: Prisma.QuizAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuizAttemptScalarFieldEnum | Prisma.QuizAttemptScalarFieldEnum[];
};
export type QuizAttemptFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where?: Prisma.QuizAttemptWhereInput;
    orderBy?: Prisma.QuizAttemptOrderByWithRelationInput | Prisma.QuizAttemptOrderByWithRelationInput[];
    cursor?: Prisma.QuizAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuizAttemptScalarFieldEnum | Prisma.QuizAttemptScalarFieldEnum[];
};
export type QuizAttemptFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where?: Prisma.QuizAttemptWhereInput;
    orderBy?: Prisma.QuizAttemptOrderByWithRelationInput | Prisma.QuizAttemptOrderByWithRelationInput[];
    cursor?: Prisma.QuizAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuizAttemptScalarFieldEnum | Prisma.QuizAttemptScalarFieldEnum[];
};
export type QuizAttemptCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuizAttemptCreateInput, Prisma.QuizAttemptUncheckedCreateInput>;
};
export type QuizAttemptCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.QuizAttemptCreateManyInput | Prisma.QuizAttemptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type QuizAttemptCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    data: Prisma.QuizAttemptCreateManyInput | Prisma.QuizAttemptCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.QuizAttemptIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type QuizAttemptUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuizAttemptUpdateInput, Prisma.QuizAttemptUncheckedUpdateInput>;
    where: Prisma.QuizAttemptWhereUniqueInput;
};
export type QuizAttemptUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.QuizAttemptUpdateManyMutationInput, Prisma.QuizAttemptUncheckedUpdateManyInput>;
    where?: Prisma.QuizAttemptWhereInput;
    limit?: number;
};
export type QuizAttemptUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuizAttemptUpdateManyMutationInput, Prisma.QuizAttemptUncheckedUpdateManyInput>;
    where?: Prisma.QuizAttemptWhereInput;
    limit?: number;
    include?: Prisma.QuizAttemptIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type QuizAttemptUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where: Prisma.QuizAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuizAttemptCreateInput, Prisma.QuizAttemptUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.QuizAttemptUpdateInput, Prisma.QuizAttemptUncheckedUpdateInput>;
};
export type QuizAttemptDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where: Prisma.QuizAttemptWhereUniqueInput;
};
export type QuizAttemptDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuizAttemptWhereInput;
    limit?: number;
};
export type QuizAttempt$questionAttemptsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
    where?: Prisma.QuestionAttemptWhereInput;
    orderBy?: Prisma.QuestionAttemptOrderByWithRelationInput | Prisma.QuestionAttemptOrderByWithRelationInput[];
    cursor?: Prisma.QuestionAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionAttemptScalarFieldEnum | Prisma.QuestionAttemptScalarFieldEnum[];
};
export type QuizAttemptDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
};
export {};
