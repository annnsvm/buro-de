import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type QuestionModel = runtime.Types.Result.DefaultSelection<Prisma.$QuestionPayload>;
export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null;
    _avg: QuestionAvgAggregateOutputType | null;
    _sum: QuestionSumAggregateOutputType | null;
    _min: QuestionMinAggregateOutputType | null;
    _max: QuestionMaxAggregateOutputType | null;
};
export type QuestionAvgAggregateOutputType = {
    points: number | null;
    orderIndex: number | null;
};
export type QuestionSumAggregateOutputType = {
    points: number | null;
    orderIndex: number | null;
};
export type QuestionMinAggregateOutputType = {
    id: string | null;
    materialId: string | null;
    type: $Enums.QuestionType | null;
    prompt: string | null;
    explanation: string | null;
    points: number | null;
    block: $Enums.PracticeBlock | null;
    partTitle: string | null;
    reviewLesson: string | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type QuestionMaxAggregateOutputType = {
    id: string | null;
    materialId: string | null;
    type: $Enums.QuestionType | null;
    prompt: string | null;
    explanation: string | null;
    points: number | null;
    block: $Enums.PracticeBlock | null;
    partTitle: string | null;
    reviewLesson: string | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type QuestionCountAggregateOutputType = {
    id: number;
    materialId: number;
    type: number;
    prompt: number;
    payload: number;
    acceptedAnswers: number;
    explanation: number;
    points: number;
    skills: number;
    block: number;
    partTitle: number;
    reviewLesson: number;
    orderIndex: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type QuestionAvgAggregateInputType = {
    points?: true;
    orderIndex?: true;
};
export type QuestionSumAggregateInputType = {
    points?: true;
    orderIndex?: true;
};
export type QuestionMinAggregateInputType = {
    id?: true;
    materialId?: true;
    type?: true;
    prompt?: true;
    explanation?: true;
    points?: true;
    block?: true;
    partTitle?: true;
    reviewLesson?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type QuestionMaxAggregateInputType = {
    id?: true;
    materialId?: true;
    type?: true;
    prompt?: true;
    explanation?: true;
    points?: true;
    block?: true;
    partTitle?: true;
    reviewLesson?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type QuestionCountAggregateInputType = {
    id?: true;
    materialId?: true;
    type?: true;
    prompt?: true;
    payload?: true;
    acceptedAnswers?: true;
    explanation?: true;
    points?: true;
    skills?: true;
    block?: true;
    partTitle?: true;
    reviewLesson?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type QuestionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | QuestionCountAggregateInputType;
    _avg?: QuestionAvgAggregateInputType;
    _sum?: QuestionSumAggregateInputType;
    _min?: QuestionMinAggregateInputType;
    _max?: QuestionMaxAggregateInputType;
};
export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
    [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuestion[P]> : Prisma.GetScalarType<T[P], AggregateQuestion[P]>;
};
export type QuestionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithAggregationInput | Prisma.QuestionOrderByWithAggregationInput[];
    by: Prisma.QuestionScalarFieldEnum[] | Prisma.QuestionScalarFieldEnum;
    having?: Prisma.QuestionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuestionCountAggregateInputType | true;
    _avg?: QuestionAvgAggregateInputType;
    _sum?: QuestionSumAggregateInputType;
    _min?: QuestionMinAggregateInputType;
    _max?: QuestionMaxAggregateInputType;
};
export type QuestionGroupByOutputType = {
    id: string;
    materialId: string;
    type: $Enums.QuestionType;
    prompt: string;
    payload: runtime.JsonValue;
    acceptedAnswers: string[];
    explanation: string | null;
    points: number;
    skills: string[];
    block: $Enums.PracticeBlock;
    partTitle: string | null;
    reviewLesson: string | null;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
    _count: QuestionCountAggregateOutputType | null;
    _avg: QuestionAvgAggregateOutputType | null;
    _sum: QuestionSumAggregateOutputType | null;
    _min: QuestionMinAggregateOutputType | null;
    _max: QuestionMaxAggregateOutputType | null;
};
type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuestionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuestionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuestionGroupByOutputType[P]>;
}>>;
export type QuestionWhereInput = {
    AND?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    OR?: Prisma.QuestionWhereInput[];
    NOT?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    id?: Prisma.StringFilter<"Question"> | string;
    materialId?: Prisma.StringFilter<"Question"> | string;
    type?: Prisma.EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType;
    prompt?: Prisma.StringFilter<"Question"> | string;
    payload?: Prisma.JsonFilter<"Question">;
    acceptedAnswers?: Prisma.StringNullableListFilter<"Question">;
    explanation?: Prisma.StringNullableFilter<"Question"> | string | null;
    points?: Prisma.IntFilter<"Question"> | number;
    skills?: Prisma.StringNullableListFilter<"Question">;
    block?: Prisma.EnumPracticeBlockFilter<"Question"> | $Enums.PracticeBlock;
    partTitle?: Prisma.StringNullableFilter<"Question"> | string | null;
    reviewLesson?: Prisma.StringNullableFilter<"Question"> | string | null;
    orderIndex?: Prisma.IntFilter<"Question"> | number;
    createdAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    material?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
    attempts?: Prisma.QuestionAttemptListRelationFilter;
};
export type QuestionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    acceptedAnswers?: Prisma.SortOrder;
    explanation?: Prisma.SortOrderInput | Prisma.SortOrder;
    points?: Prisma.SortOrder;
    skills?: Prisma.SortOrder;
    block?: Prisma.SortOrder;
    partTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewLesson?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    material?: Prisma.CourseMaterialOrderByWithRelationInput;
    attempts?: Prisma.QuestionAttemptOrderByRelationAggregateInput;
};
export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    OR?: Prisma.QuestionWhereInput[];
    NOT?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    materialId?: Prisma.StringFilter<"Question"> | string;
    type?: Prisma.EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType;
    prompt?: Prisma.StringFilter<"Question"> | string;
    payload?: Prisma.JsonFilter<"Question">;
    acceptedAnswers?: Prisma.StringNullableListFilter<"Question">;
    explanation?: Prisma.StringNullableFilter<"Question"> | string | null;
    points?: Prisma.IntFilter<"Question"> | number;
    skills?: Prisma.StringNullableListFilter<"Question">;
    block?: Prisma.EnumPracticeBlockFilter<"Question"> | $Enums.PracticeBlock;
    partTitle?: Prisma.StringNullableFilter<"Question"> | string | null;
    reviewLesson?: Prisma.StringNullableFilter<"Question"> | string | null;
    orderIndex?: Prisma.IntFilter<"Question"> | number;
    createdAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    material?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
    attempts?: Prisma.QuestionAttemptListRelationFilter;
}, "id">;
export type QuestionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    acceptedAnswers?: Prisma.SortOrder;
    explanation?: Prisma.SortOrderInput | Prisma.SortOrder;
    points?: Prisma.SortOrder;
    skills?: Prisma.SortOrder;
    block?: Prisma.SortOrder;
    partTitle?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewLesson?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.QuestionCountOrderByAggregateInput;
    _avg?: Prisma.QuestionAvgOrderByAggregateInput;
    _max?: Prisma.QuestionMaxOrderByAggregateInput;
    _min?: Prisma.QuestionMinOrderByAggregateInput;
    _sum?: Prisma.QuestionSumOrderByAggregateInput;
};
export type QuestionScalarWhereWithAggregatesInput = {
    AND?: Prisma.QuestionScalarWhereWithAggregatesInput | Prisma.QuestionScalarWhereWithAggregatesInput[];
    OR?: Prisma.QuestionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.QuestionScalarWhereWithAggregatesInput | Prisma.QuestionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    materialId?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    type?: Prisma.EnumQuestionTypeWithAggregatesFilter<"Question"> | $Enums.QuestionType;
    prompt?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    payload?: Prisma.JsonWithAggregatesFilter<"Question">;
    acceptedAnswers?: Prisma.StringNullableListFilter<"Question">;
    explanation?: Prisma.StringNullableWithAggregatesFilter<"Question"> | string | null;
    points?: Prisma.IntWithAggregatesFilter<"Question"> | number;
    skills?: Prisma.StringNullableListFilter<"Question">;
    block?: Prisma.EnumPracticeBlockWithAggregatesFilter<"Question"> | $Enums.PracticeBlock;
    partTitle?: Prisma.StringNullableWithAggregatesFilter<"Question"> | string | null;
    reviewLesson?: Prisma.StringNullableWithAggregatesFilter<"Question"> | string | null;
    orderIndex?: Prisma.IntWithAggregatesFilter<"Question"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Question"> | Date | string;
};
export type QuestionCreateInput = {
    id: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    material: Prisma.CourseMaterialCreateNestedOneWithoutQuestionsInput;
    attempts?: Prisma.QuestionAttemptCreateNestedManyWithoutQuestionInput;
};
export type QuestionUncheckedCreateInput = {
    id: string;
    materialId: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attempts?: Prisma.QuestionAttemptUncheckedCreateNestedManyWithoutQuestionInput;
};
export type QuestionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    material?: Prisma.CourseMaterialUpdateOneRequiredWithoutQuestionsNestedInput;
    attempts?: Prisma.QuestionAttemptUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    materialId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.QuestionAttemptUncheckedUpdateManyWithoutQuestionNestedInput;
};
export type QuestionCreateManyInput = {
    id: string;
    materialId: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type QuestionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    materialId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionListRelationFilter = {
    every?: Prisma.QuestionWhereInput;
    some?: Prisma.QuestionWhereInput;
    none?: Prisma.QuestionWhereInput;
};
export type QuestionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type QuestionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    acceptedAnswers?: Prisma.SortOrder;
    explanation?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    skills?: Prisma.SortOrder;
    block?: Prisma.SortOrder;
    partTitle?: Prisma.SortOrder;
    reviewLesson?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type QuestionAvgOrderByAggregateInput = {
    points?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
};
export type QuestionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    explanation?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    block?: Prisma.SortOrder;
    partTitle?: Prisma.SortOrder;
    reviewLesson?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type QuestionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    explanation?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    block?: Prisma.SortOrder;
    partTitle?: Prisma.SortOrder;
    reviewLesson?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type QuestionSumOrderByAggregateInput = {
    points?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
};
export type QuestionScalarRelationFilter = {
    is?: Prisma.QuestionWhereInput;
    isNot?: Prisma.QuestionWhereInput;
};
export type QuestionCreateNestedManyWithoutMaterialInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutMaterialInput, Prisma.QuestionUncheckedCreateWithoutMaterialInput> | Prisma.QuestionCreateWithoutMaterialInput[] | Prisma.QuestionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutMaterialInput | Prisma.QuestionCreateOrConnectWithoutMaterialInput[];
    createMany?: Prisma.QuestionCreateManyMaterialInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUncheckedCreateNestedManyWithoutMaterialInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutMaterialInput, Prisma.QuestionUncheckedCreateWithoutMaterialInput> | Prisma.QuestionCreateWithoutMaterialInput[] | Prisma.QuestionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutMaterialInput | Prisma.QuestionCreateOrConnectWithoutMaterialInput[];
    createMany?: Prisma.QuestionCreateManyMaterialInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUpdateManyWithoutMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutMaterialInput, Prisma.QuestionUncheckedCreateWithoutMaterialInput> | Prisma.QuestionCreateWithoutMaterialInput[] | Prisma.QuestionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutMaterialInput | Prisma.QuestionCreateOrConnectWithoutMaterialInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutMaterialInput | Prisma.QuestionUpsertWithWhereUniqueWithoutMaterialInput[];
    createMany?: Prisma.QuestionCreateManyMaterialInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutMaterialInput | Prisma.QuestionUpdateWithWhereUniqueWithoutMaterialInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutMaterialInput | Prisma.QuestionUpdateManyWithWhereWithoutMaterialInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionUncheckedUpdateManyWithoutMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutMaterialInput, Prisma.QuestionUncheckedCreateWithoutMaterialInput> | Prisma.QuestionCreateWithoutMaterialInput[] | Prisma.QuestionUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutMaterialInput | Prisma.QuestionCreateOrConnectWithoutMaterialInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutMaterialInput | Prisma.QuestionUpsertWithWhereUniqueWithoutMaterialInput[];
    createMany?: Prisma.QuestionCreateManyMaterialInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutMaterialInput | Prisma.QuestionUpdateWithWhereUniqueWithoutMaterialInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutMaterialInput | Prisma.QuestionUpdateManyWithWhereWithoutMaterialInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionCreateacceptedAnswersInput = {
    set: string[];
};
export type QuestionCreateskillsInput = {
    set: string[];
};
export type EnumQuestionTypeFieldUpdateOperationsInput = {
    set?: $Enums.QuestionType;
};
export type QuestionUpdateacceptedAnswersInput = {
    set?: string[];
    push?: string | string[];
};
export type QuestionUpdateskillsInput = {
    set?: string[];
    push?: string | string[];
};
export type EnumPracticeBlockFieldUpdateOperationsInput = {
    set?: $Enums.PracticeBlock;
};
export type QuestionCreateNestedOneWithoutAttemptsInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAttemptsInput, Prisma.QuestionUncheckedCreateWithoutAttemptsInput>;
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAttemptsInput;
    connect?: Prisma.QuestionWhereUniqueInput;
};
export type QuestionUpdateOneRequiredWithoutAttemptsNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutAttemptsInput, Prisma.QuestionUncheckedCreateWithoutAttemptsInput>;
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutAttemptsInput;
    upsert?: Prisma.QuestionUpsertWithoutAttemptsInput;
    connect?: Prisma.QuestionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.QuestionUpdateToOneWithWhereWithoutAttemptsInput, Prisma.QuestionUpdateWithoutAttemptsInput>, Prisma.QuestionUncheckedUpdateWithoutAttemptsInput>;
};
export type QuestionCreateWithoutMaterialInput = {
    id: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attempts?: Prisma.QuestionAttemptCreateNestedManyWithoutQuestionInput;
};
export type QuestionUncheckedCreateWithoutMaterialInput = {
    id: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attempts?: Prisma.QuestionAttemptUncheckedCreateNestedManyWithoutQuestionInput;
};
export type QuestionCreateOrConnectWithoutMaterialInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutMaterialInput, Prisma.QuestionUncheckedCreateWithoutMaterialInput>;
};
export type QuestionCreateManyMaterialInputEnvelope = {
    data: Prisma.QuestionCreateManyMaterialInput | Prisma.QuestionCreateManyMaterialInput[];
    skipDuplicates?: boolean;
};
export type QuestionUpsertWithWhereUniqueWithoutMaterialInput = {
    where: Prisma.QuestionWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutMaterialInput, Prisma.QuestionUncheckedUpdateWithoutMaterialInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutMaterialInput, Prisma.QuestionUncheckedCreateWithoutMaterialInput>;
};
export type QuestionUpdateWithWhereUniqueWithoutMaterialInput = {
    where: Prisma.QuestionWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutMaterialInput, Prisma.QuestionUncheckedUpdateWithoutMaterialInput>;
};
export type QuestionUpdateManyWithWhereWithoutMaterialInput = {
    where: Prisma.QuestionScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyWithoutMaterialInput>;
};
export type QuestionScalarWhereInput = {
    AND?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
    OR?: Prisma.QuestionScalarWhereInput[];
    NOT?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
    id?: Prisma.StringFilter<"Question"> | string;
    materialId?: Prisma.StringFilter<"Question"> | string;
    type?: Prisma.EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType;
    prompt?: Prisma.StringFilter<"Question"> | string;
    payload?: Prisma.JsonFilter<"Question">;
    acceptedAnswers?: Prisma.StringNullableListFilter<"Question">;
    explanation?: Prisma.StringNullableFilter<"Question"> | string | null;
    points?: Prisma.IntFilter<"Question"> | number;
    skills?: Prisma.StringNullableListFilter<"Question">;
    block?: Prisma.EnumPracticeBlockFilter<"Question"> | $Enums.PracticeBlock;
    partTitle?: Prisma.StringNullableFilter<"Question"> | string | null;
    reviewLesson?: Prisma.StringNullableFilter<"Question"> | string | null;
    orderIndex?: Prisma.IntFilter<"Question"> | number;
    createdAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Question"> | Date | string;
};
export type QuestionCreateWithoutAttemptsInput = {
    id: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    material: Prisma.CourseMaterialCreateNestedOneWithoutQuestionsInput;
};
export type QuestionUncheckedCreateWithoutAttemptsInput = {
    id: string;
    materialId: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type QuestionCreateOrConnectWithoutAttemptsInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutAttemptsInput, Prisma.QuestionUncheckedCreateWithoutAttemptsInput>;
};
export type QuestionUpsertWithoutAttemptsInput = {
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutAttemptsInput, Prisma.QuestionUncheckedUpdateWithoutAttemptsInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutAttemptsInput, Prisma.QuestionUncheckedCreateWithoutAttemptsInput>;
    where?: Prisma.QuestionWhereInput;
};
export type QuestionUpdateToOneWithWhereWithoutAttemptsInput = {
    where?: Prisma.QuestionWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutAttemptsInput, Prisma.QuestionUncheckedUpdateWithoutAttemptsInput>;
};
export type QuestionUpdateWithoutAttemptsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    material?: Prisma.CourseMaterialUpdateOneRequiredWithoutQuestionsNestedInput;
};
export type QuestionUncheckedUpdateWithoutAttemptsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    materialId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionCreateManyMaterialInput = {
    id: string;
    type?: $Enums.QuestionType;
    prompt: string;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionCreateacceptedAnswersInput | string[];
    explanation?: string | null;
    points?: number;
    skills?: Prisma.QuestionCreateskillsInput | string[];
    block?: $Enums.PracticeBlock;
    partTitle?: string | null;
    reviewLesson?: string | null;
    orderIndex?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type QuestionUpdateWithoutMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.QuestionAttemptUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateWithoutMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.QuestionAttemptUncheckedUpdateManyWithoutQuestionNestedInput;
};
export type QuestionUncheckedUpdateManyWithoutMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    acceptedAnswers?: Prisma.QuestionUpdateacceptedAnswersInput | string[];
    explanation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    skills?: Prisma.QuestionUpdateskillsInput | string[];
    block?: Prisma.EnumPracticeBlockFieldUpdateOperationsInput | $Enums.PracticeBlock;
    partTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewLesson?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type QuestionCountOutputType = {
    attempts: number;
};
export type QuestionCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    attempts?: boolean | QuestionCountOutputTypeCountAttemptsArgs;
};
export type QuestionCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionCountOutputTypeSelect<ExtArgs> | null;
};
export type QuestionCountOutputTypeCountAttemptsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionAttemptWhereInput;
};
export type QuestionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    materialId?: boolean;
    type?: boolean;
    prompt?: boolean;
    payload?: boolean;
    acceptedAnswers?: boolean;
    explanation?: boolean;
    points?: boolean;
    skills?: boolean;
    block?: boolean;
    partTitle?: boolean;
    reviewLesson?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
    attempts?: boolean | Prisma.Question$attemptsArgs<ExtArgs>;
    _count?: boolean | Prisma.QuestionCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    materialId?: boolean;
    type?: boolean;
    prompt?: boolean;
    payload?: boolean;
    acceptedAnswers?: boolean;
    explanation?: boolean;
    points?: boolean;
    skills?: boolean;
    block?: boolean;
    partTitle?: boolean;
    reviewLesson?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    materialId?: boolean;
    type?: boolean;
    prompt?: boolean;
    payload?: boolean;
    acceptedAnswers?: boolean;
    explanation?: boolean;
    points?: boolean;
    skills?: boolean;
    block?: boolean;
    partTitle?: boolean;
    reviewLesson?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectScalar = {
    id?: boolean;
    materialId?: boolean;
    type?: boolean;
    prompt?: boolean;
    payload?: boolean;
    acceptedAnswers?: boolean;
    explanation?: boolean;
    points?: boolean;
    skills?: boolean;
    block?: boolean;
    partTitle?: boolean;
    reviewLesson?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type QuestionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "materialId" | "type" | "prompt" | "payload" | "acceptedAnswers" | "explanation" | "points" | "skills" | "block" | "partTitle" | "reviewLesson" | "orderIndex" | "createdAt" | "updatedAt", ExtArgs["result"]["question"]>;
export type QuestionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
    attempts?: boolean | Prisma.Question$attemptsArgs<ExtArgs>;
    _count?: boolean | Prisma.QuestionCountOutputTypeDefaultArgs<ExtArgs>;
};
export type QuestionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type $QuestionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Question";
    objects: {
        material: Prisma.$CourseMaterialPayload<ExtArgs>;
        attempts: Prisma.$QuestionAttemptPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        materialId: string;
        type: $Enums.QuestionType;
        prompt: string;
        payload: runtime.JsonValue;
        acceptedAnswers: string[];
        explanation: string | null;
        points: number;
        skills: string[];
        block: $Enums.PracticeBlock;
        partTitle: string | null;
        reviewLesson: string | null;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["question"]>;
    composites: {};
};
export type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$QuestionPayload, S>;
export type QuestionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuestionCountAggregateInputType | true;
};
export interface QuestionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Question'];
        meta: {
            name: 'Question';
        };
    };
    findUnique<T extends QuestionFindUniqueArgs>(args: Prisma.SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends QuestionFindFirstArgs>(args?: Prisma.SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends QuestionFindManyArgs>(args?: Prisma.SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends QuestionCreateArgs>(args: Prisma.SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends QuestionCreateManyArgs>(args?: Prisma.SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends QuestionDeleteArgs>(args: Prisma.SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends QuestionUpdateArgs>(args: Prisma.SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends QuestionDeleteManyArgs>(args?: Prisma.SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends QuestionUpdateManyArgs>(args: Prisma.SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends QuestionUpsertArgs>(args: Prisma.SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends QuestionCountArgs>(args?: Prisma.Subset<T, QuestionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuestionCountAggregateOutputType> : number>;
    aggregate<T extends QuestionAggregateArgs>(args: Prisma.Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>;
    groupBy<T extends QuestionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: QuestionGroupByArgs['orderBy'];
    } : {
        orderBy?: QuestionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: QuestionFieldRefs;
}
export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    material<T extends Prisma.CourseMaterialDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterialDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    attempts<T extends Prisma.Question$attemptsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Question$attemptsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface QuestionFieldRefs {
    readonly id: Prisma.FieldRef<"Question", 'String'>;
    readonly materialId: Prisma.FieldRef<"Question", 'String'>;
    readonly type: Prisma.FieldRef<"Question", 'QuestionType'>;
    readonly prompt: Prisma.FieldRef<"Question", 'String'>;
    readonly payload: Prisma.FieldRef<"Question", 'Json'>;
    readonly acceptedAnswers: Prisma.FieldRef<"Question", 'String[]'>;
    readonly explanation: Prisma.FieldRef<"Question", 'String'>;
    readonly points: Prisma.FieldRef<"Question", 'Int'>;
    readonly skills: Prisma.FieldRef<"Question", 'String[]'>;
    readonly block: Prisma.FieldRef<"Question", 'PracticeBlock'>;
    readonly partTitle: Prisma.FieldRef<"Question", 'String'>;
    readonly reviewLesson: Prisma.FieldRef<"Question", 'String'>;
    readonly orderIndex: Prisma.FieldRef<"Question", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Question", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Question", 'DateTime'>;
}
export type QuestionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionScalarFieldEnum | Prisma.QuestionScalarFieldEnum[];
};
export type QuestionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionScalarFieldEnum | Prisma.QuestionScalarFieldEnum[];
};
export type QuestionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionScalarFieldEnum | Prisma.QuestionScalarFieldEnum[];
};
export type QuestionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionCreateInput, Prisma.QuestionUncheckedCreateInput>;
};
export type QuestionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.QuestionCreateManyInput | Prisma.QuestionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type QuestionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    data: Prisma.QuestionCreateManyInput | Prisma.QuestionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.QuestionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type QuestionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionUpdateInput, Prisma.QuestionUncheckedUpdateInput>;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyInput>;
    where?: Prisma.QuestionWhereInput;
    limit?: number;
};
export type QuestionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyInput>;
    where?: Prisma.QuestionWhereInput;
    limit?: number;
    include?: Prisma.QuestionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type QuestionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateInput, Prisma.QuestionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.QuestionUpdateInput, Prisma.QuestionUncheckedUpdateInput>;
};
export type QuestionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    limit?: number;
};
export type Question$attemptsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type QuestionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
};
export {};
