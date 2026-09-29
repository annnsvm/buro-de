import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type QuestionAttemptModel = runtime.Types.Result.DefaultSelection<Prisma.$QuestionAttemptPayload>;
export type AggregateQuestionAttempt = {
    _count: QuestionAttemptCountAggregateOutputType | null;
    _min: QuestionAttemptMinAggregateOutputType | null;
    _max: QuestionAttemptMaxAggregateOutputType | null;
};
export type QuestionAttemptMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    questionId: string | null;
    quizAttemptId: string | null;
    isCorrect: boolean | null;
    answeredAt: Date | null;
};
export type QuestionAttemptMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    questionId: string | null;
    quizAttemptId: string | null;
    isCorrect: boolean | null;
    answeredAt: Date | null;
};
export type QuestionAttemptCountAggregateOutputType = {
    id: number;
    userId: number;
    questionId: number;
    quizAttemptId: number;
    isCorrect: number;
    rawAnswer: number;
    answeredAt: number;
    _all: number;
};
export type QuestionAttemptMinAggregateInputType = {
    id?: true;
    userId?: true;
    questionId?: true;
    quizAttemptId?: true;
    isCorrect?: true;
    answeredAt?: true;
};
export type QuestionAttemptMaxAggregateInputType = {
    id?: true;
    userId?: true;
    questionId?: true;
    quizAttemptId?: true;
    isCorrect?: true;
    answeredAt?: true;
};
export type QuestionAttemptCountAggregateInputType = {
    id?: true;
    userId?: true;
    questionId?: true;
    quizAttemptId?: true;
    isCorrect?: true;
    rawAnswer?: true;
    answeredAt?: true;
    _all?: true;
};
export type QuestionAttemptAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionAttemptWhereInput;
    orderBy?: Prisma.QuestionAttemptOrderByWithRelationInput | Prisma.QuestionAttemptOrderByWithRelationInput[];
    cursor?: Prisma.QuestionAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | QuestionAttemptCountAggregateInputType;
    _min?: QuestionAttemptMinAggregateInputType;
    _max?: QuestionAttemptMaxAggregateInputType;
};
export type GetQuestionAttemptAggregateType<T extends QuestionAttemptAggregateArgs> = {
    [P in keyof T & keyof AggregateQuestionAttempt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuestionAttempt[P]> : Prisma.GetScalarType<T[P], AggregateQuestionAttempt[P]>;
};
export type QuestionAttemptGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionAttemptWhereInput;
    orderBy?: Prisma.QuestionAttemptOrderByWithAggregationInput | Prisma.QuestionAttemptOrderByWithAggregationInput[];
    by: Prisma.QuestionAttemptScalarFieldEnum[] | Prisma.QuestionAttemptScalarFieldEnum;
    having?: Prisma.QuestionAttemptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuestionAttemptCountAggregateInputType | true;
    _min?: QuestionAttemptMinAggregateInputType;
    _max?: QuestionAttemptMaxAggregateInputType;
};
export type QuestionAttemptGroupByOutputType = {
    id: string;
    userId: string;
    questionId: string;
    quizAttemptId: string | null;
    isCorrect: boolean;
    rawAnswer: runtime.JsonValue;
    answeredAt: Date;
    _count: QuestionAttemptCountAggregateOutputType | null;
    _min: QuestionAttemptMinAggregateOutputType | null;
    _max: QuestionAttemptMaxAggregateOutputType | null;
};
type GetQuestionAttemptGroupByPayload<T extends QuestionAttemptGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuestionAttemptGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuestionAttemptGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuestionAttemptGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuestionAttemptGroupByOutputType[P]>;
}>>;
export type QuestionAttemptWhereInput = {
    AND?: Prisma.QuestionAttemptWhereInput | Prisma.QuestionAttemptWhereInput[];
    OR?: Prisma.QuestionAttemptWhereInput[];
    NOT?: Prisma.QuestionAttemptWhereInput | Prisma.QuestionAttemptWhereInput[];
    id?: Prisma.StringFilter<"QuestionAttempt"> | string;
    userId?: Prisma.StringFilter<"QuestionAttempt"> | string;
    questionId?: Prisma.StringFilter<"QuestionAttempt"> | string;
    quizAttemptId?: Prisma.StringNullableFilter<"QuestionAttempt"> | string | null;
    isCorrect?: Prisma.BoolFilter<"QuestionAttempt"> | boolean;
    rawAnswer?: Prisma.JsonFilter<"QuestionAttempt">;
    answeredAt?: Prisma.DateTimeFilter<"QuestionAttempt"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    question?: Prisma.XOR<Prisma.QuestionScalarRelationFilter, Prisma.QuestionWhereInput>;
    quizAttempt?: Prisma.XOR<Prisma.QuizAttemptNullableScalarRelationFilter, Prisma.QuizAttemptWhereInput> | null;
};
export type QuestionAttemptOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    quizAttemptId?: Prisma.SortOrderInput | Prisma.SortOrder;
    isCorrect?: Prisma.SortOrder;
    rawAnswer?: Prisma.SortOrder;
    answeredAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    question?: Prisma.QuestionOrderByWithRelationInput;
    quizAttempt?: Prisma.QuizAttemptOrderByWithRelationInput;
};
export type QuestionAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.QuestionAttemptWhereInput | Prisma.QuestionAttemptWhereInput[];
    OR?: Prisma.QuestionAttemptWhereInput[];
    NOT?: Prisma.QuestionAttemptWhereInput | Prisma.QuestionAttemptWhereInput[];
    userId?: Prisma.StringFilter<"QuestionAttempt"> | string;
    questionId?: Prisma.StringFilter<"QuestionAttempt"> | string;
    quizAttemptId?: Prisma.StringNullableFilter<"QuestionAttempt"> | string | null;
    isCorrect?: Prisma.BoolFilter<"QuestionAttempt"> | boolean;
    rawAnswer?: Prisma.JsonFilter<"QuestionAttempt">;
    answeredAt?: Prisma.DateTimeFilter<"QuestionAttempt"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    question?: Prisma.XOR<Prisma.QuestionScalarRelationFilter, Prisma.QuestionWhereInput>;
    quizAttempt?: Prisma.XOR<Prisma.QuizAttemptNullableScalarRelationFilter, Prisma.QuizAttemptWhereInput> | null;
}, "id">;
export type QuestionAttemptOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    quizAttemptId?: Prisma.SortOrderInput | Prisma.SortOrder;
    isCorrect?: Prisma.SortOrder;
    rawAnswer?: Prisma.SortOrder;
    answeredAt?: Prisma.SortOrder;
    _count?: Prisma.QuestionAttemptCountOrderByAggregateInput;
    _max?: Prisma.QuestionAttemptMaxOrderByAggregateInput;
    _min?: Prisma.QuestionAttemptMinOrderByAggregateInput;
};
export type QuestionAttemptScalarWhereWithAggregatesInput = {
    AND?: Prisma.QuestionAttemptScalarWhereWithAggregatesInput | Prisma.QuestionAttemptScalarWhereWithAggregatesInput[];
    OR?: Prisma.QuestionAttemptScalarWhereWithAggregatesInput[];
    NOT?: Prisma.QuestionAttemptScalarWhereWithAggregatesInput | Prisma.QuestionAttemptScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"QuestionAttempt"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"QuestionAttempt"> | string;
    questionId?: Prisma.StringWithAggregatesFilter<"QuestionAttempt"> | string;
    quizAttemptId?: Prisma.StringNullableWithAggregatesFilter<"QuestionAttempt"> | string | null;
    isCorrect?: Prisma.BoolWithAggregatesFilter<"QuestionAttempt"> | boolean;
    rawAnswer?: Prisma.JsonWithAggregatesFilter<"QuestionAttempt">;
    answeredAt?: Prisma.DateTimeWithAggregatesFilter<"QuestionAttempt"> | Date | string;
};
export type QuestionAttemptCreateInput = {
    id?: string;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutQuestionAttemptsInput;
    question: Prisma.QuestionCreateNestedOneWithoutAttemptsInput;
    quizAttempt?: Prisma.QuizAttemptCreateNestedOneWithoutQuestionAttemptsInput;
};
export type QuestionAttemptUncheckedCreateInput = {
    id?: string;
    userId: string;
    questionId: string;
    quizAttemptId?: string | null;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutQuestionAttemptsNestedInput;
    question?: Prisma.QuestionUpdateOneRequiredWithoutAttemptsNestedInput;
    quizAttempt?: Prisma.QuizAttemptUpdateOneWithoutQuestionAttemptsNestedInput;
};
export type QuestionAttemptUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.StringFieldUpdateOperationsInput | string;
    quizAttemptId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptCreateManyInput = {
    id?: string;
    userId: string;
    questionId: string;
    quizAttemptId?: string | null;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.StringFieldUpdateOperationsInput | string;
    quizAttemptId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptListRelationFilter = {
    every?: Prisma.QuestionAttemptWhereInput;
    some?: Prisma.QuestionAttemptWhereInput;
    none?: Prisma.QuestionAttemptWhereInput;
};
export type QuestionAttemptOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type QuestionAttemptCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    quizAttemptId?: Prisma.SortOrder;
    isCorrect?: Prisma.SortOrder;
    rawAnswer?: Prisma.SortOrder;
    answeredAt?: Prisma.SortOrder;
};
export type QuestionAttemptMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    quizAttemptId?: Prisma.SortOrder;
    isCorrect?: Prisma.SortOrder;
    answeredAt?: Prisma.SortOrder;
};
export type QuestionAttemptMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    quizAttemptId?: Prisma.SortOrder;
    isCorrect?: Prisma.SortOrder;
    answeredAt?: Prisma.SortOrder;
};
export type QuestionAttemptCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutUserInput, Prisma.QuestionAttemptUncheckedCreateWithoutUserInput> | Prisma.QuestionAttemptCreateWithoutUserInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutUserInput | Prisma.QuestionAttemptCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.QuestionAttemptCreateManyUserInputEnvelope;
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
};
export type QuestionAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutUserInput, Prisma.QuestionAttemptUncheckedCreateWithoutUserInput> | Prisma.QuestionAttemptCreateWithoutUserInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutUserInput | Prisma.QuestionAttemptCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.QuestionAttemptCreateManyUserInputEnvelope;
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
};
export type QuestionAttemptUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutUserInput, Prisma.QuestionAttemptUncheckedCreateWithoutUserInput> | Prisma.QuestionAttemptCreateWithoutUserInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutUserInput | Prisma.QuestionAttemptCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutUserInput | Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.QuestionAttemptCreateManyUserInputEnvelope;
    set?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    delete?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    update?: Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutUserInput | Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.QuestionAttemptUpdateManyWithWhereWithoutUserInput | Prisma.QuestionAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
};
export type QuestionAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutUserInput, Prisma.QuestionAttemptUncheckedCreateWithoutUserInput> | Prisma.QuestionAttemptCreateWithoutUserInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutUserInput | Prisma.QuestionAttemptCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutUserInput | Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.QuestionAttemptCreateManyUserInputEnvelope;
    set?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    delete?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    update?: Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutUserInput | Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.QuestionAttemptUpdateManyWithWhereWithoutUserInput | Prisma.QuestionAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
};
export type QuestionAttemptCreateNestedManyWithoutQuizAttemptInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput> | Prisma.QuestionAttemptCreateWithoutQuizAttemptInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuizAttemptInputEnvelope;
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
};
export type QuestionAttemptUncheckedCreateNestedManyWithoutQuizAttemptInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput> | Prisma.QuestionAttemptCreateWithoutQuizAttemptInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuizAttemptInputEnvelope;
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
};
export type QuestionAttemptUpdateManyWithoutQuizAttemptNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput> | Prisma.QuestionAttemptCreateWithoutQuizAttemptInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput[];
    upsert?: Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuizAttemptInput | Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuizAttemptInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuizAttemptInputEnvelope;
    set?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    delete?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    update?: Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuizAttemptInput | Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuizAttemptInput[];
    updateMany?: Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuizAttemptInput | Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuizAttemptInput[];
    deleteMany?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
};
export type QuestionAttemptUncheckedUpdateManyWithoutQuizAttemptNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput> | Prisma.QuestionAttemptCreateWithoutQuizAttemptInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuizAttemptInput[];
    upsert?: Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuizAttemptInput | Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuizAttemptInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuizAttemptInputEnvelope;
    set?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    delete?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    update?: Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuizAttemptInput | Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuizAttemptInput[];
    updateMany?: Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuizAttemptInput | Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuizAttemptInput[];
    deleteMany?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
};
export type QuestionAttemptCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput> | Prisma.QuestionAttemptCreateWithoutQuestionInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuestionInputEnvelope;
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
};
export type QuestionAttemptUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput> | Prisma.QuestionAttemptCreateWithoutQuestionInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuestionInputEnvelope;
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
};
export type QuestionAttemptUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput> | Prisma.QuestionAttemptCreateWithoutQuestionInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuestionInput | Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuestionInputEnvelope;
    set?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    delete?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    update?: Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuestionInput | Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuestionInput | Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
};
export type QuestionAttemptUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput> | Prisma.QuestionAttemptCreateWithoutQuestionInput[] | Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput | Prisma.QuestionAttemptCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuestionInput | Prisma.QuestionAttemptUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.QuestionAttemptCreateManyQuestionInputEnvelope;
    set?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    disconnect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    delete?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    connect?: Prisma.QuestionAttemptWhereUniqueInput | Prisma.QuestionAttemptWhereUniqueInput[];
    update?: Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuestionInput | Prisma.QuestionAttemptUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuestionInput | Prisma.QuestionAttemptUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
};
export type QuestionAttemptCreateWithoutUserInput = {
    id?: string;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
    question: Prisma.QuestionCreateNestedOneWithoutAttemptsInput;
    quizAttempt?: Prisma.QuizAttemptCreateNestedOneWithoutQuestionAttemptsInput;
};
export type QuestionAttemptUncheckedCreateWithoutUserInput = {
    id?: string;
    questionId: string;
    quizAttemptId?: string | null;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptCreateOrConnectWithoutUserInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutUserInput, Prisma.QuestionAttemptUncheckedCreateWithoutUserInput>;
};
export type QuestionAttemptCreateManyUserInputEnvelope = {
    data: Prisma.QuestionAttemptCreateManyUserInput | Prisma.QuestionAttemptCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type QuestionAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionAttemptUpdateWithoutUserInput, Prisma.QuestionAttemptUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutUserInput, Prisma.QuestionAttemptUncheckedCreateWithoutUserInput>;
};
export type QuestionAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateWithoutUserInput, Prisma.QuestionAttemptUncheckedUpdateWithoutUserInput>;
};
export type QuestionAttemptUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.QuestionAttemptScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateManyMutationInput, Prisma.QuestionAttemptUncheckedUpdateManyWithoutUserInput>;
};
export type QuestionAttemptScalarWhereInput = {
    AND?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
    OR?: Prisma.QuestionAttemptScalarWhereInput[];
    NOT?: Prisma.QuestionAttemptScalarWhereInput | Prisma.QuestionAttemptScalarWhereInput[];
    id?: Prisma.StringFilter<"QuestionAttempt"> | string;
    userId?: Prisma.StringFilter<"QuestionAttempt"> | string;
    questionId?: Prisma.StringFilter<"QuestionAttempt"> | string;
    quizAttemptId?: Prisma.StringNullableFilter<"QuestionAttempt"> | string | null;
    isCorrect?: Prisma.BoolFilter<"QuestionAttempt"> | boolean;
    rawAnswer?: Prisma.JsonFilter<"QuestionAttempt">;
    answeredAt?: Prisma.DateTimeFilter<"QuestionAttempt"> | Date | string;
};
export type QuestionAttemptCreateWithoutQuizAttemptInput = {
    id?: string;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutQuestionAttemptsInput;
    question: Prisma.QuestionCreateNestedOneWithoutAttemptsInput;
};
export type QuestionAttemptUncheckedCreateWithoutQuizAttemptInput = {
    id?: string;
    userId: string;
    questionId: string;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptCreateOrConnectWithoutQuizAttemptInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput>;
};
export type QuestionAttemptCreateManyQuizAttemptInputEnvelope = {
    data: Prisma.QuestionAttemptCreateManyQuizAttemptInput | Prisma.QuestionAttemptCreateManyQuizAttemptInput[];
    skipDuplicates?: boolean;
};
export type QuestionAttemptUpsertWithWhereUniqueWithoutQuizAttemptInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionAttemptUpdateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedUpdateWithoutQuizAttemptInput>;
    create: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuizAttemptInput>;
};
export type QuestionAttemptUpdateWithWhereUniqueWithoutQuizAttemptInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateWithoutQuizAttemptInput, Prisma.QuestionAttemptUncheckedUpdateWithoutQuizAttemptInput>;
};
export type QuestionAttemptUpdateManyWithWhereWithoutQuizAttemptInput = {
    where: Prisma.QuestionAttemptScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateManyMutationInput, Prisma.QuestionAttemptUncheckedUpdateManyWithoutQuizAttemptInput>;
};
export type QuestionAttemptCreateWithoutQuestionInput = {
    id?: string;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutQuestionAttemptsInput;
    quizAttempt?: Prisma.QuizAttemptCreateNestedOneWithoutQuestionAttemptsInput;
};
export type QuestionAttemptUncheckedCreateWithoutQuestionInput = {
    id?: string;
    userId: string;
    quizAttemptId?: string | null;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptCreateOrConnectWithoutQuestionInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput>;
};
export type QuestionAttemptCreateManyQuestionInputEnvelope = {
    data: Prisma.QuestionAttemptCreateManyQuestionInput | Prisma.QuestionAttemptCreateManyQuestionInput[];
    skipDuplicates?: boolean;
};
export type QuestionAttemptUpsertWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionAttemptUpdateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedUpdateWithoutQuestionInput>;
    create: Prisma.XOR<Prisma.QuestionAttemptCreateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedCreateWithoutQuestionInput>;
};
export type QuestionAttemptUpdateWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.QuestionAttemptWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateWithoutQuestionInput, Prisma.QuestionAttemptUncheckedUpdateWithoutQuestionInput>;
};
export type QuestionAttemptUpdateManyWithWhereWithoutQuestionInput = {
    where: Prisma.QuestionAttemptScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateManyMutationInput, Prisma.QuestionAttemptUncheckedUpdateManyWithoutQuestionInput>;
};
export type QuestionAttemptCreateManyUserInput = {
    id?: string;
    questionId: string;
    quizAttemptId?: string | null;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    question?: Prisma.QuestionUpdateOneRequiredWithoutAttemptsNestedInput;
    quizAttempt?: Prisma.QuizAttemptUpdateOneWithoutQuestionAttemptsNestedInput;
};
export type QuestionAttemptUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.StringFieldUpdateOperationsInput | string;
    quizAttemptId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.StringFieldUpdateOperationsInput | string;
    quizAttemptId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptCreateManyQuizAttemptInput = {
    id?: string;
    userId: string;
    questionId: string;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptUpdateWithoutQuizAttemptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutQuestionAttemptsNestedInput;
    question?: Prisma.QuestionUpdateOneRequiredWithoutAttemptsNestedInput;
};
export type QuestionAttemptUncheckedUpdateWithoutQuizAttemptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.StringFieldUpdateOperationsInput | string;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptUncheckedUpdateManyWithoutQuizAttemptInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    questionId?: Prisma.StringFieldUpdateOperationsInput | string;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptCreateManyQuestionInput = {
    id?: string;
    userId: string;
    quizAttemptId?: string | null;
    isCorrect: boolean;
    rawAnswer: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Date | string;
};
export type QuestionAttemptUpdateWithoutQuestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutQuestionAttemptsNestedInput;
    quizAttempt?: Prisma.QuizAttemptUpdateOneWithoutQuestionAttemptsNestedInput;
};
export type QuestionAttemptUncheckedUpdateWithoutQuestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    quizAttemptId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptUncheckedUpdateManyWithoutQuestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    quizAttemptId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isCorrect?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rawAnswer?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    answeredAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionAttemptSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    questionId?: boolean;
    quizAttemptId?: boolean;
    isCorrect?: boolean;
    rawAnswer?: boolean;
    answeredAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    quizAttempt?: boolean | Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs>;
}, ExtArgs["result"]["questionAttempt"]>;
export type QuestionAttemptSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    questionId?: boolean;
    quizAttemptId?: boolean;
    isCorrect?: boolean;
    rawAnswer?: boolean;
    answeredAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    quizAttempt?: boolean | Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs>;
}, ExtArgs["result"]["questionAttempt"]>;
export type QuestionAttemptSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    questionId?: boolean;
    quizAttemptId?: boolean;
    isCorrect?: boolean;
    rawAnswer?: boolean;
    answeredAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    quizAttempt?: boolean | Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs>;
}, ExtArgs["result"]["questionAttempt"]>;
export type QuestionAttemptSelectScalar = {
    id?: boolean;
    userId?: boolean;
    questionId?: boolean;
    quizAttemptId?: boolean;
    isCorrect?: boolean;
    rawAnswer?: boolean;
    answeredAt?: boolean;
};
export type QuestionAttemptOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "questionId" | "quizAttemptId" | "isCorrect" | "rawAnswer" | "answeredAt", ExtArgs["result"]["questionAttempt"]>;
export type QuestionAttemptInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    quizAttempt?: boolean | Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs>;
};
export type QuestionAttemptIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    quizAttempt?: boolean | Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs>;
};
export type QuestionAttemptIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    quizAttempt?: boolean | Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs>;
};
export type $QuestionAttemptPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "QuestionAttempt";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        question: Prisma.$QuestionPayload<ExtArgs>;
        quizAttempt: Prisma.$QuizAttemptPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        questionId: string;
        quizAttemptId: string | null;
        isCorrect: boolean;
        rawAnswer: runtime.JsonValue;
        answeredAt: Date;
    }, ExtArgs["result"]["questionAttempt"]>;
    composites: {};
};
export type QuestionAttemptGetPayload<S extends boolean | null | undefined | QuestionAttemptDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload, S>;
export type QuestionAttemptCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<QuestionAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuestionAttemptCountAggregateInputType | true;
};
export interface QuestionAttemptDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['QuestionAttempt'];
        meta: {
            name: 'QuestionAttempt';
        };
    };
    findUnique<T extends QuestionAttemptFindUniqueArgs>(args: Prisma.SelectSubset<T, QuestionAttemptFindUniqueArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends QuestionAttemptFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, QuestionAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends QuestionAttemptFindFirstArgs>(args?: Prisma.SelectSubset<T, QuestionAttemptFindFirstArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends QuestionAttemptFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, QuestionAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends QuestionAttemptFindManyArgs>(args?: Prisma.SelectSubset<T, QuestionAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends QuestionAttemptCreateArgs>(args: Prisma.SelectSubset<T, QuestionAttemptCreateArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends QuestionAttemptCreateManyArgs>(args?: Prisma.SelectSubset<T, QuestionAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends QuestionAttemptCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, QuestionAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends QuestionAttemptDeleteArgs>(args: Prisma.SelectSubset<T, QuestionAttemptDeleteArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends QuestionAttemptUpdateArgs>(args: Prisma.SelectSubset<T, QuestionAttemptUpdateArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends QuestionAttemptDeleteManyArgs>(args?: Prisma.SelectSubset<T, QuestionAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends QuestionAttemptUpdateManyArgs>(args: Prisma.SelectSubset<T, QuestionAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends QuestionAttemptUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, QuestionAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends QuestionAttemptUpsertArgs>(args: Prisma.SelectSubset<T, QuestionAttemptUpsertArgs<ExtArgs>>): Prisma.Prisma__QuestionAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends QuestionAttemptCountArgs>(args?: Prisma.Subset<T, QuestionAttemptCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuestionAttemptCountAggregateOutputType> : number>;
    aggregate<T extends QuestionAttemptAggregateArgs>(args: Prisma.Subset<T, QuestionAttemptAggregateArgs>): Prisma.PrismaPromise<GetQuestionAttemptAggregateType<T>>;
    groupBy<T extends QuestionAttemptGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: QuestionAttemptGroupByArgs['orderBy'];
    } : {
        orderBy?: QuestionAttemptGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, QuestionAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: QuestionAttemptFieldRefs;
}
export interface Prisma__QuestionAttemptClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    question<T extends Prisma.QuestionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.QuestionDefaultArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    quizAttempt<T extends Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.QuestionAttempt$quizAttemptArgs<ExtArgs>>): Prisma.Prisma__QuizAttemptClient<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface QuestionAttemptFieldRefs {
    readonly id: Prisma.FieldRef<"QuestionAttempt", 'String'>;
    readonly userId: Prisma.FieldRef<"QuestionAttempt", 'String'>;
    readonly questionId: Prisma.FieldRef<"QuestionAttempt", 'String'>;
    readonly quizAttemptId: Prisma.FieldRef<"QuestionAttempt", 'String'>;
    readonly isCorrect: Prisma.FieldRef<"QuestionAttempt", 'Boolean'>;
    readonly rawAnswer: Prisma.FieldRef<"QuestionAttempt", 'Json'>;
    readonly answeredAt: Prisma.FieldRef<"QuestionAttempt", 'DateTime'>;
}
export type QuestionAttemptFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
    where: Prisma.QuestionAttemptWhereUniqueInput;
};
export type QuestionAttemptFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
    where: Prisma.QuestionAttemptWhereUniqueInput;
};
export type QuestionAttemptFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type QuestionAttemptFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type QuestionAttemptFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type QuestionAttemptCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionAttemptCreateInput, Prisma.QuestionAttemptUncheckedCreateInput>;
};
export type QuestionAttemptCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.QuestionAttemptCreateManyInput | Prisma.QuestionAttemptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type QuestionAttemptCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    data: Prisma.QuestionAttemptCreateManyInput | Prisma.QuestionAttemptCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.QuestionAttemptIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type QuestionAttemptUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateInput, Prisma.QuestionAttemptUncheckedUpdateInput>;
    where: Prisma.QuestionAttemptWhereUniqueInput;
};
export type QuestionAttemptUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateManyMutationInput, Prisma.QuestionAttemptUncheckedUpdateManyInput>;
    where?: Prisma.QuestionAttemptWhereInput;
    limit?: number;
};
export type QuestionAttemptUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionAttemptUpdateManyMutationInput, Prisma.QuestionAttemptUncheckedUpdateManyInput>;
    where?: Prisma.QuestionAttemptWhereInput;
    limit?: number;
    include?: Prisma.QuestionAttemptIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type QuestionAttemptUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
    where: Prisma.QuestionAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionAttemptCreateInput, Prisma.QuestionAttemptUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.QuestionAttemptUpdateInput, Prisma.QuestionAttemptUncheckedUpdateInput>;
};
export type QuestionAttemptDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
    where: Prisma.QuestionAttemptWhereUniqueInput;
};
export type QuestionAttemptDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionAttemptWhereInput;
    limit?: number;
};
export type QuestionAttempt$quizAttemptArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuizAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuizAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuizAttemptInclude<ExtArgs> | null;
    where?: Prisma.QuizAttemptWhereInput;
};
export type QuestionAttemptDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionAttemptSelect<ExtArgs> | null;
    omit?: Prisma.QuestionAttemptOmit<ExtArgs> | null;
    include?: Prisma.QuestionAttemptInclude<ExtArgs> | null;
};
export {};
