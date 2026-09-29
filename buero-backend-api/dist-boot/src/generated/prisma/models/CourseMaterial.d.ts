import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type CourseMaterialModel = runtime.Types.Result.DefaultSelection<Prisma.$CourseMaterialPayload>;
export type AggregateCourseMaterial = {
    _count: CourseMaterialCountAggregateOutputType | null;
    _avg: CourseMaterialAvgAggregateOutputType | null;
    _sum: CourseMaterialSumAggregateOutputType | null;
    _min: CourseMaterialMinAggregateOutputType | null;
    _max: CourseMaterialMaxAggregateOutputType | null;
};
export type CourseMaterialAvgAggregateOutputType = {
    passingScore: number | null;
    orderIndex: number | null;
};
export type CourseMaterialSumAggregateOutputType = {
    passingScore: number | null;
    orderIndex: number | null;
};
export type CourseMaterialMinAggregateOutputType = {
    id: string | null;
    moduleId: string | null;
    type: $Enums.CourseMaterialType | null;
    title: string | null;
    quizMode: $Enums.QuizMode | null;
    passingScore: number | null;
    parentMaterialId: string | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourseMaterialMaxAggregateOutputType = {
    id: string | null;
    moduleId: string | null;
    type: $Enums.CourseMaterialType | null;
    title: string | null;
    quizMode: $Enums.QuizMode | null;
    passingScore: number | null;
    parentMaterialId: string | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourseMaterialCountAggregateOutputType = {
    id: number;
    moduleId: number;
    type: number;
    title: number;
    content: number;
    quizMode: number;
    passingScore: number;
    parentMaterialId: number;
    orderIndex: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CourseMaterialAvgAggregateInputType = {
    passingScore?: true;
    orderIndex?: true;
};
export type CourseMaterialSumAggregateInputType = {
    passingScore?: true;
    orderIndex?: true;
};
export type CourseMaterialMinAggregateInputType = {
    id?: true;
    moduleId?: true;
    type?: true;
    title?: true;
    quizMode?: true;
    passingScore?: true;
    parentMaterialId?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourseMaterialMaxAggregateInputType = {
    id?: true;
    moduleId?: true;
    type?: true;
    title?: true;
    quizMode?: true;
    passingScore?: true;
    parentMaterialId?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourseMaterialCountAggregateInputType = {
    id?: true;
    moduleId?: true;
    type?: true;
    title?: true;
    content?: true;
    quizMode?: true;
    passingScore?: true;
    parentMaterialId?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CourseMaterialAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseMaterialWhereInput;
    orderBy?: Prisma.CourseMaterialOrderByWithRelationInput | Prisma.CourseMaterialOrderByWithRelationInput[];
    cursor?: Prisma.CourseMaterialWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourseMaterialCountAggregateInputType;
    _avg?: CourseMaterialAvgAggregateInputType;
    _sum?: CourseMaterialSumAggregateInputType;
    _min?: CourseMaterialMinAggregateInputType;
    _max?: CourseMaterialMaxAggregateInputType;
};
export type GetCourseMaterialAggregateType<T extends CourseMaterialAggregateArgs> = {
    [P in keyof T & keyof AggregateCourseMaterial]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourseMaterial[P]> : Prisma.GetScalarType<T[P], AggregateCourseMaterial[P]>;
};
export type CourseMaterialGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseMaterialWhereInput;
    orderBy?: Prisma.CourseMaterialOrderByWithAggregationInput | Prisma.CourseMaterialOrderByWithAggregationInput[];
    by: Prisma.CourseMaterialScalarFieldEnum[] | Prisma.CourseMaterialScalarFieldEnum;
    having?: Prisma.CourseMaterialScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourseMaterialCountAggregateInputType | true;
    _avg?: CourseMaterialAvgAggregateInputType;
    _sum?: CourseMaterialSumAggregateInputType;
    _min?: CourseMaterialMinAggregateInputType;
    _max?: CourseMaterialMaxAggregateInputType;
};
export type CourseMaterialGroupByOutputType = {
    id: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: runtime.JsonValue;
    quizMode: $Enums.QuizMode | null;
    passingScore: number | null;
    parentMaterialId: string | null;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
    _count: CourseMaterialCountAggregateOutputType | null;
    _avg: CourseMaterialAvgAggregateOutputType | null;
    _sum: CourseMaterialSumAggregateOutputType | null;
    _min: CourseMaterialMinAggregateOutputType | null;
    _max: CourseMaterialMaxAggregateOutputType | null;
};
type GetCourseMaterialGroupByPayload<T extends CourseMaterialGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourseMaterialGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourseMaterialGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourseMaterialGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourseMaterialGroupByOutputType[P]>;
}>>;
export type CourseMaterialWhereInput = {
    AND?: Prisma.CourseMaterialWhereInput | Prisma.CourseMaterialWhereInput[];
    OR?: Prisma.CourseMaterialWhereInput[];
    NOT?: Prisma.CourseMaterialWhereInput | Prisma.CourseMaterialWhereInput[];
    id?: Prisma.StringFilter<"CourseMaterial"> | string;
    moduleId?: Prisma.StringFilter<"CourseMaterial"> | string;
    type?: Prisma.EnumCourseMaterialTypeFilter<"CourseMaterial"> | $Enums.CourseMaterialType;
    title?: Prisma.StringFilter<"CourseMaterial"> | string;
    content?: Prisma.JsonFilter<"CourseMaterial">;
    quizMode?: Prisma.EnumQuizModeNullableFilter<"CourseMaterial"> | $Enums.QuizMode | null;
    passingScore?: Prisma.IntNullableFilter<"CourseMaterial"> | number | null;
    parentMaterialId?: Prisma.StringNullableFilter<"CourseMaterial"> | string | null;
    orderIndex?: Prisma.IntFilter<"CourseMaterial"> | number;
    createdAt?: Prisma.DateTimeFilter<"CourseMaterial"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourseMaterial"> | Date | string;
    module?: Prisma.XOR<Prisma.CourseModuleScalarRelationFilter, Prisma.CourseModuleWhereInput>;
    parentMaterial?: Prisma.XOR<Prisma.CourseMaterialNullableScalarRelationFilter, Prisma.CourseMaterialWhereInput> | null;
    children?: Prisma.CourseMaterialListRelationFilter;
    courseProgress?: Prisma.CourseProgressListRelationFilter;
    quizAttempts?: Prisma.QuizAttemptListRelationFilter;
    writingSubmissions?: Prisma.WritingSubmissionListRelationFilter;
    attachments?: Prisma.MaterialAttachmentListRelationFilter;
    questions?: Prisma.QuestionListRelationFilter;
};
export type CourseMaterialOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    quizMode?: Prisma.SortOrderInput | Prisma.SortOrder;
    passingScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    parentMaterialId?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    module?: Prisma.CourseModuleOrderByWithRelationInput;
    parentMaterial?: Prisma.CourseMaterialOrderByWithRelationInput;
    children?: Prisma.CourseMaterialOrderByRelationAggregateInput;
    courseProgress?: Prisma.CourseProgressOrderByRelationAggregateInput;
    quizAttempts?: Prisma.QuizAttemptOrderByRelationAggregateInput;
    writingSubmissions?: Prisma.WritingSubmissionOrderByRelationAggregateInput;
    attachments?: Prisma.MaterialAttachmentOrderByRelationAggregateInput;
    questions?: Prisma.QuestionOrderByRelationAggregateInput;
};
export type CourseMaterialWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CourseMaterialWhereInput | Prisma.CourseMaterialWhereInput[];
    OR?: Prisma.CourseMaterialWhereInput[];
    NOT?: Prisma.CourseMaterialWhereInput | Prisma.CourseMaterialWhereInput[];
    moduleId?: Prisma.StringFilter<"CourseMaterial"> | string;
    type?: Prisma.EnumCourseMaterialTypeFilter<"CourseMaterial"> | $Enums.CourseMaterialType;
    title?: Prisma.StringFilter<"CourseMaterial"> | string;
    content?: Prisma.JsonFilter<"CourseMaterial">;
    quizMode?: Prisma.EnumQuizModeNullableFilter<"CourseMaterial"> | $Enums.QuizMode | null;
    passingScore?: Prisma.IntNullableFilter<"CourseMaterial"> | number | null;
    parentMaterialId?: Prisma.StringNullableFilter<"CourseMaterial"> | string | null;
    orderIndex?: Prisma.IntFilter<"CourseMaterial"> | number;
    createdAt?: Prisma.DateTimeFilter<"CourseMaterial"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourseMaterial"> | Date | string;
    module?: Prisma.XOR<Prisma.CourseModuleScalarRelationFilter, Prisma.CourseModuleWhereInput>;
    parentMaterial?: Prisma.XOR<Prisma.CourseMaterialNullableScalarRelationFilter, Prisma.CourseMaterialWhereInput> | null;
    children?: Prisma.CourseMaterialListRelationFilter;
    courseProgress?: Prisma.CourseProgressListRelationFilter;
    quizAttempts?: Prisma.QuizAttemptListRelationFilter;
    writingSubmissions?: Prisma.WritingSubmissionListRelationFilter;
    attachments?: Prisma.MaterialAttachmentListRelationFilter;
    questions?: Prisma.QuestionListRelationFilter;
}, "id">;
export type CourseMaterialOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    quizMode?: Prisma.SortOrderInput | Prisma.SortOrder;
    passingScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    parentMaterialId?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CourseMaterialCountOrderByAggregateInput;
    _avg?: Prisma.CourseMaterialAvgOrderByAggregateInput;
    _max?: Prisma.CourseMaterialMaxOrderByAggregateInput;
    _min?: Prisma.CourseMaterialMinOrderByAggregateInput;
    _sum?: Prisma.CourseMaterialSumOrderByAggregateInput;
};
export type CourseMaterialScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourseMaterialScalarWhereWithAggregatesInput | Prisma.CourseMaterialScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourseMaterialScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourseMaterialScalarWhereWithAggregatesInput | Prisma.CourseMaterialScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CourseMaterial"> | string;
    moduleId?: Prisma.StringWithAggregatesFilter<"CourseMaterial"> | string;
    type?: Prisma.EnumCourseMaterialTypeWithAggregatesFilter<"CourseMaterial"> | $Enums.CourseMaterialType;
    title?: Prisma.StringWithAggregatesFilter<"CourseMaterial"> | string;
    content?: Prisma.JsonWithAggregatesFilter<"CourseMaterial">;
    quizMode?: Prisma.EnumQuizModeNullableWithAggregatesFilter<"CourseMaterial"> | $Enums.QuizMode | null;
    passingScore?: Prisma.IntNullableWithAggregatesFilter<"CourseMaterial"> | number | null;
    parentMaterialId?: Prisma.StringNullableWithAggregatesFilter<"CourseMaterial"> | string | null;
    orderIndex?: Prisma.IntWithAggregatesFilter<"CourseMaterial"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CourseMaterial"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"CourseMaterial"> | Date | string;
};
export type CourseMaterialCreateInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialCreateManyInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourseMaterialUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseMaterialUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseMaterialListRelationFilter = {
    every?: Prisma.CourseMaterialWhereInput;
    some?: Prisma.CourseMaterialWhereInput;
    none?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourseMaterialNullableScalarRelationFilter = {
    is?: Prisma.CourseMaterialWhereInput | null;
    isNot?: Prisma.CourseMaterialWhereInput | null;
};
export type CourseMaterialCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    quizMode?: Prisma.SortOrder;
    passingScore?: Prisma.SortOrder;
    parentMaterialId?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourseMaterialAvgOrderByAggregateInput = {
    passingScore?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
};
export type CourseMaterialMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    quizMode?: Prisma.SortOrder;
    passingScore?: Prisma.SortOrder;
    parentMaterialId?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourseMaterialMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    quizMode?: Prisma.SortOrder;
    passingScore?: Prisma.SortOrder;
    parentMaterialId?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourseMaterialSumOrderByAggregateInput = {
    passingScore?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
};
export type CourseMaterialScalarRelationFilter = {
    is?: Prisma.CourseMaterialWhereInput;
    isNot?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialCreateNestedManyWithoutModuleInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutModuleInput, Prisma.CourseMaterialUncheckedCreateWithoutModuleInput> | Prisma.CourseMaterialCreateWithoutModuleInput[] | Prisma.CourseMaterialUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutModuleInput | Prisma.CourseMaterialCreateOrConnectWithoutModuleInput[];
    createMany?: Prisma.CourseMaterialCreateManyModuleInputEnvelope;
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
};
export type CourseMaterialUncheckedCreateNestedManyWithoutModuleInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutModuleInput, Prisma.CourseMaterialUncheckedCreateWithoutModuleInput> | Prisma.CourseMaterialCreateWithoutModuleInput[] | Prisma.CourseMaterialUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutModuleInput | Prisma.CourseMaterialCreateOrConnectWithoutModuleInput[];
    createMany?: Prisma.CourseMaterialCreateManyModuleInputEnvelope;
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
};
export type CourseMaterialUpdateManyWithoutModuleNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutModuleInput, Prisma.CourseMaterialUncheckedCreateWithoutModuleInput> | Prisma.CourseMaterialCreateWithoutModuleInput[] | Prisma.CourseMaterialUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutModuleInput | Prisma.CourseMaterialCreateOrConnectWithoutModuleInput[];
    upsert?: Prisma.CourseMaterialUpsertWithWhereUniqueWithoutModuleInput | Prisma.CourseMaterialUpsertWithWhereUniqueWithoutModuleInput[];
    createMany?: Prisma.CourseMaterialCreateManyModuleInputEnvelope;
    set?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    disconnect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    delete?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    update?: Prisma.CourseMaterialUpdateWithWhereUniqueWithoutModuleInput | Prisma.CourseMaterialUpdateWithWhereUniqueWithoutModuleInput[];
    updateMany?: Prisma.CourseMaterialUpdateManyWithWhereWithoutModuleInput | Prisma.CourseMaterialUpdateManyWithWhereWithoutModuleInput[];
    deleteMany?: Prisma.CourseMaterialScalarWhereInput | Prisma.CourseMaterialScalarWhereInput[];
};
export type CourseMaterialUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutModuleInput, Prisma.CourseMaterialUncheckedCreateWithoutModuleInput> | Prisma.CourseMaterialCreateWithoutModuleInput[] | Prisma.CourseMaterialUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutModuleInput | Prisma.CourseMaterialCreateOrConnectWithoutModuleInput[];
    upsert?: Prisma.CourseMaterialUpsertWithWhereUniqueWithoutModuleInput | Prisma.CourseMaterialUpsertWithWhereUniqueWithoutModuleInput[];
    createMany?: Prisma.CourseMaterialCreateManyModuleInputEnvelope;
    set?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    disconnect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    delete?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    update?: Prisma.CourseMaterialUpdateWithWhereUniqueWithoutModuleInput | Prisma.CourseMaterialUpdateWithWhereUniqueWithoutModuleInput[];
    updateMany?: Prisma.CourseMaterialUpdateManyWithWhereWithoutModuleInput | Prisma.CourseMaterialUpdateManyWithWhereWithoutModuleInput[];
    deleteMany?: Prisma.CourseMaterialScalarWhereInput | Prisma.CourseMaterialScalarWhereInput[];
};
export type CourseMaterialCreateNestedOneWithoutChildrenInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutChildrenInput, Prisma.CourseMaterialUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutChildrenInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialCreateNestedManyWithoutParentMaterialInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput> | Prisma.CourseMaterialCreateWithoutParentMaterialInput[] | Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput | Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput[];
    createMany?: Prisma.CourseMaterialCreateManyParentMaterialInputEnvelope;
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
};
export type CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput> | Prisma.CourseMaterialCreateWithoutParentMaterialInput[] | Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput | Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput[];
    createMany?: Prisma.CourseMaterialCreateManyParentMaterialInputEnvelope;
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
};
export type EnumCourseMaterialTypeFieldUpdateOperationsInput = {
    set?: $Enums.CourseMaterialType;
};
export type NullableEnumQuizModeFieldUpdateOperationsInput = {
    set?: $Enums.QuizMode | null;
};
export type CourseMaterialUpdateOneWithoutChildrenNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutChildrenInput, Prisma.CourseMaterialUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutChildrenInput;
    upsert?: Prisma.CourseMaterialUpsertWithoutChildrenInput;
    disconnect?: Prisma.CourseMaterialWhereInput | boolean;
    delete?: Prisma.CourseMaterialWhereInput | boolean;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseMaterialUpdateToOneWithWhereWithoutChildrenInput, Prisma.CourseMaterialUpdateWithoutChildrenInput>, Prisma.CourseMaterialUncheckedUpdateWithoutChildrenInput>;
};
export type CourseMaterialUpdateManyWithoutParentMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput> | Prisma.CourseMaterialCreateWithoutParentMaterialInput[] | Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput | Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput[];
    upsert?: Prisma.CourseMaterialUpsertWithWhereUniqueWithoutParentMaterialInput | Prisma.CourseMaterialUpsertWithWhereUniqueWithoutParentMaterialInput[];
    createMany?: Prisma.CourseMaterialCreateManyParentMaterialInputEnvelope;
    set?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    disconnect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    delete?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    update?: Prisma.CourseMaterialUpdateWithWhereUniqueWithoutParentMaterialInput | Prisma.CourseMaterialUpdateWithWhereUniqueWithoutParentMaterialInput[];
    updateMany?: Prisma.CourseMaterialUpdateManyWithWhereWithoutParentMaterialInput | Prisma.CourseMaterialUpdateManyWithWhereWithoutParentMaterialInput[];
    deleteMany?: Prisma.CourseMaterialScalarWhereInput | Prisma.CourseMaterialScalarWhereInput[];
};
export type CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput> | Prisma.CourseMaterialCreateWithoutParentMaterialInput[] | Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput[];
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput | Prisma.CourseMaterialCreateOrConnectWithoutParentMaterialInput[];
    upsert?: Prisma.CourseMaterialUpsertWithWhereUniqueWithoutParentMaterialInput | Prisma.CourseMaterialUpsertWithWhereUniqueWithoutParentMaterialInput[];
    createMany?: Prisma.CourseMaterialCreateManyParentMaterialInputEnvelope;
    set?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    disconnect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    delete?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    connect?: Prisma.CourseMaterialWhereUniqueInput | Prisma.CourseMaterialWhereUniqueInput[];
    update?: Prisma.CourseMaterialUpdateWithWhereUniqueWithoutParentMaterialInput | Prisma.CourseMaterialUpdateWithWhereUniqueWithoutParentMaterialInput[];
    updateMany?: Prisma.CourseMaterialUpdateManyWithWhereWithoutParentMaterialInput | Prisma.CourseMaterialUpdateManyWithWhereWithoutParentMaterialInput[];
    deleteMany?: Prisma.CourseMaterialScalarWhereInput | Prisma.CourseMaterialScalarWhereInput[];
};
export type CourseMaterialCreateNestedOneWithoutAttachmentsInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutAttachmentsInput, Prisma.CourseMaterialUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutAttachmentsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialUpdateOneRequiredWithoutAttachmentsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutAttachmentsInput, Prisma.CourseMaterialUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutAttachmentsInput;
    upsert?: Prisma.CourseMaterialUpsertWithoutAttachmentsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseMaterialUpdateToOneWithWhereWithoutAttachmentsInput, Prisma.CourseMaterialUpdateWithoutAttachmentsInput>, Prisma.CourseMaterialUncheckedUpdateWithoutAttachmentsInput>;
};
export type CourseMaterialCreateNestedOneWithoutCourseProgressInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutCourseProgressInput, Prisma.CourseMaterialUncheckedCreateWithoutCourseProgressInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutCourseProgressInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialUpdateOneWithoutCourseProgressNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutCourseProgressInput, Prisma.CourseMaterialUncheckedCreateWithoutCourseProgressInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutCourseProgressInput;
    upsert?: Prisma.CourseMaterialUpsertWithoutCourseProgressInput;
    disconnect?: Prisma.CourseMaterialWhereInput | boolean;
    delete?: Prisma.CourseMaterialWhereInput | boolean;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseMaterialUpdateToOneWithWhereWithoutCourseProgressInput, Prisma.CourseMaterialUpdateWithoutCourseProgressInput>, Prisma.CourseMaterialUncheckedUpdateWithoutCourseProgressInput>;
};
export type CourseMaterialCreateNestedOneWithoutWritingSubmissionsInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutWritingSubmissionsInput, Prisma.CourseMaterialUncheckedCreateWithoutWritingSubmissionsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutWritingSubmissionsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialUpdateOneRequiredWithoutWritingSubmissionsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutWritingSubmissionsInput, Prisma.CourseMaterialUncheckedCreateWithoutWritingSubmissionsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutWritingSubmissionsInput;
    upsert?: Prisma.CourseMaterialUpsertWithoutWritingSubmissionsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseMaterialUpdateToOneWithWhereWithoutWritingSubmissionsInput, Prisma.CourseMaterialUpdateWithoutWritingSubmissionsInput>, Prisma.CourseMaterialUncheckedUpdateWithoutWritingSubmissionsInput>;
};
export type CourseMaterialCreateNestedOneWithoutQuizAttemptsInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuizAttemptsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuizAttemptsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutQuizAttemptsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialUpdateOneRequiredWithoutQuizAttemptsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuizAttemptsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuizAttemptsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutQuizAttemptsInput;
    upsert?: Prisma.CourseMaterialUpsertWithoutQuizAttemptsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseMaterialUpdateToOneWithWhereWithoutQuizAttemptsInput, Prisma.CourseMaterialUpdateWithoutQuizAttemptsInput>, Prisma.CourseMaterialUncheckedUpdateWithoutQuizAttemptsInput>;
};
export type CourseMaterialCreateNestedOneWithoutQuestionsInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuestionsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuestionsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutQuestionsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuestionsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuestionsInput>;
    connectOrCreate?: Prisma.CourseMaterialCreateOrConnectWithoutQuestionsInput;
    upsert?: Prisma.CourseMaterialUpsertWithoutQuestionsInput;
    connect?: Prisma.CourseMaterialWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseMaterialUpdateToOneWithWhereWithoutQuestionsInput, Prisma.CourseMaterialUpdateWithoutQuestionsInput>, Prisma.CourseMaterialUncheckedUpdateWithoutQuestionsInput>;
};
export type CourseMaterialCreateWithoutModuleInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutModuleInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutModuleInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutModuleInput, Prisma.CourseMaterialUncheckedCreateWithoutModuleInput>;
};
export type CourseMaterialCreateManyModuleInputEnvelope = {
    data: Prisma.CourseMaterialCreateManyModuleInput | Prisma.CourseMaterialCreateManyModuleInput[];
    skipDuplicates?: boolean;
};
export type CourseMaterialUpsertWithWhereUniqueWithoutModuleInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutModuleInput, Prisma.CourseMaterialUncheckedUpdateWithoutModuleInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutModuleInput, Prisma.CourseMaterialUncheckedCreateWithoutModuleInput>;
};
export type CourseMaterialUpdateWithWhereUniqueWithoutModuleInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutModuleInput, Prisma.CourseMaterialUncheckedUpdateWithoutModuleInput>;
};
export type CourseMaterialUpdateManyWithWhereWithoutModuleInput = {
    where: Prisma.CourseMaterialScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateManyMutationInput, Prisma.CourseMaterialUncheckedUpdateManyWithoutModuleInput>;
};
export type CourseMaterialScalarWhereInput = {
    AND?: Prisma.CourseMaterialScalarWhereInput | Prisma.CourseMaterialScalarWhereInput[];
    OR?: Prisma.CourseMaterialScalarWhereInput[];
    NOT?: Prisma.CourseMaterialScalarWhereInput | Prisma.CourseMaterialScalarWhereInput[];
    id?: Prisma.StringFilter<"CourseMaterial"> | string;
    moduleId?: Prisma.StringFilter<"CourseMaterial"> | string;
    type?: Prisma.EnumCourseMaterialTypeFilter<"CourseMaterial"> | $Enums.CourseMaterialType;
    title?: Prisma.StringFilter<"CourseMaterial"> | string;
    content?: Prisma.JsonFilter<"CourseMaterial">;
    quizMode?: Prisma.EnumQuizModeNullableFilter<"CourseMaterial"> | $Enums.QuizMode | null;
    passingScore?: Prisma.IntNullableFilter<"CourseMaterial"> | number | null;
    parentMaterialId?: Prisma.StringNullableFilter<"CourseMaterial"> | string | null;
    orderIndex?: Prisma.IntFilter<"CourseMaterial"> | number;
    createdAt?: Prisma.DateTimeFilter<"CourseMaterial"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourseMaterial"> | Date | string;
};
export type CourseMaterialCreateWithoutChildrenInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutChildrenInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutChildrenInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutChildrenInput, Prisma.CourseMaterialUncheckedCreateWithoutChildrenInput>;
};
export type CourseMaterialCreateWithoutParentMaterialInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutParentMaterialInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutParentMaterialInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput>;
};
export type CourseMaterialCreateManyParentMaterialInputEnvelope = {
    data: Prisma.CourseMaterialCreateManyParentMaterialInput | Prisma.CourseMaterialCreateManyParentMaterialInput[];
    skipDuplicates?: boolean;
};
export type CourseMaterialUpsertWithoutChildrenInput = {
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutChildrenInput, Prisma.CourseMaterialUncheckedUpdateWithoutChildrenInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutChildrenInput, Prisma.CourseMaterialUncheckedCreateWithoutChildrenInput>;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialUpdateToOneWithWhereWithoutChildrenInput = {
    where?: Prisma.CourseMaterialWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutChildrenInput, Prisma.CourseMaterialUncheckedUpdateWithoutChildrenInput>;
};
export type CourseMaterialUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUpsertWithWhereUniqueWithoutParentMaterialInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedUpdateWithoutParentMaterialInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedCreateWithoutParentMaterialInput>;
};
export type CourseMaterialUpdateWithWhereUniqueWithoutParentMaterialInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutParentMaterialInput, Prisma.CourseMaterialUncheckedUpdateWithoutParentMaterialInput>;
};
export type CourseMaterialUpdateManyWithWhereWithoutParentMaterialInput = {
    where: Prisma.CourseMaterialScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateManyMutationInput, Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialInput>;
};
export type CourseMaterialCreateWithoutAttachmentsInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutAttachmentsInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutAttachmentsInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutAttachmentsInput, Prisma.CourseMaterialUncheckedCreateWithoutAttachmentsInput>;
};
export type CourseMaterialUpsertWithoutAttachmentsInput = {
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutAttachmentsInput, Prisma.CourseMaterialUncheckedUpdateWithoutAttachmentsInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutAttachmentsInput, Prisma.CourseMaterialUncheckedCreateWithoutAttachmentsInput>;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: Prisma.CourseMaterialWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutAttachmentsInput, Prisma.CourseMaterialUncheckedUpdateWithoutAttachmentsInput>;
};
export type CourseMaterialUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialCreateWithoutCourseProgressInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutCourseProgressInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutCourseProgressInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutCourseProgressInput, Prisma.CourseMaterialUncheckedCreateWithoutCourseProgressInput>;
};
export type CourseMaterialUpsertWithoutCourseProgressInput = {
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutCourseProgressInput, Prisma.CourseMaterialUncheckedUpdateWithoutCourseProgressInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutCourseProgressInput, Prisma.CourseMaterialUncheckedCreateWithoutCourseProgressInput>;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialUpdateToOneWithWhereWithoutCourseProgressInput = {
    where?: Prisma.CourseMaterialWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutCourseProgressInput, Prisma.CourseMaterialUncheckedUpdateWithoutCourseProgressInput>;
};
export type CourseMaterialUpdateWithoutCourseProgressInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutCourseProgressInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialCreateWithoutWritingSubmissionsInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutWritingSubmissionsInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutWritingSubmissionsInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutWritingSubmissionsInput, Prisma.CourseMaterialUncheckedCreateWithoutWritingSubmissionsInput>;
};
export type CourseMaterialUpsertWithoutWritingSubmissionsInput = {
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutWritingSubmissionsInput, Prisma.CourseMaterialUncheckedUpdateWithoutWritingSubmissionsInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutWritingSubmissionsInput, Prisma.CourseMaterialUncheckedCreateWithoutWritingSubmissionsInput>;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialUpdateToOneWithWhereWithoutWritingSubmissionsInput = {
    where?: Prisma.CourseMaterialWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutWritingSubmissionsInput, Prisma.CourseMaterialUncheckedUpdateWithoutWritingSubmissionsInput>;
};
export type CourseMaterialUpdateWithoutWritingSubmissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutWritingSubmissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialCreateWithoutQuizAttemptsInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutQuizAttemptsInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
    questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutQuizAttemptsInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuizAttemptsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuizAttemptsInput>;
};
export type CourseMaterialUpsertWithoutQuizAttemptsInput = {
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutQuizAttemptsInput, Prisma.CourseMaterialUncheckedUpdateWithoutQuizAttemptsInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuizAttemptsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuizAttemptsInput>;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialUpdateToOneWithWhereWithoutQuizAttemptsInput = {
    where?: Prisma.CourseMaterialWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutQuizAttemptsInput, Prisma.CourseMaterialUncheckedUpdateWithoutQuizAttemptsInput>;
};
export type CourseMaterialUpdateWithoutQuizAttemptsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutQuizAttemptsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialCreateWithoutQuestionsInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.CourseModuleCreateNestedOneWithoutMaterialsInput;
    parentMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutChildrenInput;
    children?: Prisma.CourseMaterialCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialUncheckedCreateWithoutQuestionsInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.CourseMaterialUncheckedCreateNestedManyWithoutParentMaterialInput;
    courseProgress?: Prisma.CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedCreateNestedManyWithoutCourseMaterialInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedCreateNestedManyWithoutCourseMaterialInput;
    attachments?: Prisma.MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput;
};
export type CourseMaterialCreateOrConnectWithoutQuestionsInput = {
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuestionsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuestionsInput>;
};
export type CourseMaterialUpsertWithoutQuestionsInput = {
    update: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutQuestionsInput, Prisma.CourseMaterialUncheckedUpdateWithoutQuestionsInput>;
    create: Prisma.XOR<Prisma.CourseMaterialCreateWithoutQuestionsInput, Prisma.CourseMaterialUncheckedCreateWithoutQuestionsInput>;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: Prisma.CourseMaterialWhereInput;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateWithoutQuestionsInput, Prisma.CourseMaterialUncheckedUpdateWithoutQuestionsInput>;
};
export type CourseMaterialUpdateWithoutQuestionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutQuestionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialCreateManyModuleInput = {
    id?: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    parentMaterialId?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourseMaterialUpdateWithoutModuleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parentMaterial?: Prisma.CourseMaterialUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutModuleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateManyWithoutModuleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    parentMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseMaterialCreateManyParentMaterialInput = {
    id?: string;
    moduleId: string;
    type: $Enums.CourseMaterialType;
    title: string;
    content: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: $Enums.QuizMode | null;
    passingScore?: number | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourseMaterialUpdateWithoutParentMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.CourseModuleUpdateOneRequiredWithoutMaterialsNestedInput;
    children?: Prisma.CourseMaterialUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateWithoutParentMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.CourseMaterialUncheckedUpdateManyWithoutParentMaterialNestedInput;
    courseProgress?: Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    quizAttempts?: Prisma.QuizAttemptUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    writingSubmissions?: Prisma.WritingSubmissionUncheckedUpdateManyWithoutCourseMaterialNestedInput;
    attachments?: Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput;
    questions?: Prisma.QuestionUncheckedUpdateManyWithoutMaterialNestedInput;
};
export type CourseMaterialUncheckedUpdateManyWithoutParentMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumCourseMaterialTypeFieldUpdateOperationsInput | $Enums.CourseMaterialType;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    quizMode?: Prisma.NullableEnumQuizModeFieldUpdateOperationsInput | $Enums.QuizMode | null;
    passingScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseMaterialCountOutputType = {
    children: number;
    courseProgress: number;
    quizAttempts: number;
    writingSubmissions: number;
    attachments: number;
    questions: number;
};
export type CourseMaterialCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    children?: boolean | CourseMaterialCountOutputTypeCountChildrenArgs;
    courseProgress?: boolean | CourseMaterialCountOutputTypeCountCourseProgressArgs;
    quizAttempts?: boolean | CourseMaterialCountOutputTypeCountQuizAttemptsArgs;
    writingSubmissions?: boolean | CourseMaterialCountOutputTypeCountWritingSubmissionsArgs;
    attachments?: boolean | CourseMaterialCountOutputTypeCountAttachmentsArgs;
    questions?: boolean | CourseMaterialCountOutputTypeCountQuestionsArgs;
};
export type CourseMaterialCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialCountOutputTypeSelect<ExtArgs> | null;
};
export type CourseMaterialCountOutputTypeCountChildrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterialCountOutputTypeCountCourseProgressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseProgressWhereInput;
};
export type CourseMaterialCountOutputTypeCountQuizAttemptsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuizAttemptWhereInput;
};
export type CourseMaterialCountOutputTypeCountWritingSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WritingSubmissionWhereInput;
};
export type CourseMaterialCountOutputTypeCountAttachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MaterialAttachmentWhereInput;
};
export type CourseMaterialCountOutputTypeCountQuestionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
};
export type CourseMaterialSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    moduleId?: boolean;
    type?: boolean;
    title?: boolean;
    content?: boolean;
    quizMode?: boolean;
    passingScore?: boolean;
    parentMaterialId?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    module?: boolean | Prisma.CourseModuleDefaultArgs<ExtArgs>;
    parentMaterial?: boolean | Prisma.CourseMaterial$parentMaterialArgs<ExtArgs>;
    children?: boolean | Prisma.CourseMaterial$childrenArgs<ExtArgs>;
    courseProgress?: boolean | Prisma.CourseMaterial$courseProgressArgs<ExtArgs>;
    quizAttempts?: boolean | Prisma.CourseMaterial$quizAttemptsArgs<ExtArgs>;
    writingSubmissions?: boolean | Prisma.CourseMaterial$writingSubmissionsArgs<ExtArgs>;
    attachments?: boolean | Prisma.CourseMaterial$attachmentsArgs<ExtArgs>;
    questions?: boolean | Prisma.CourseMaterial$questionsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourseMaterialCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courseMaterial"]>;
export type CourseMaterialSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    moduleId?: boolean;
    type?: boolean;
    title?: boolean;
    content?: boolean;
    quizMode?: boolean;
    passingScore?: boolean;
    parentMaterialId?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    module?: boolean | Prisma.CourseModuleDefaultArgs<ExtArgs>;
    parentMaterial?: boolean | Prisma.CourseMaterial$parentMaterialArgs<ExtArgs>;
}, ExtArgs["result"]["courseMaterial"]>;
export type CourseMaterialSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    moduleId?: boolean;
    type?: boolean;
    title?: boolean;
    content?: boolean;
    quizMode?: boolean;
    passingScore?: boolean;
    parentMaterialId?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    module?: boolean | Prisma.CourseModuleDefaultArgs<ExtArgs>;
    parentMaterial?: boolean | Prisma.CourseMaterial$parentMaterialArgs<ExtArgs>;
}, ExtArgs["result"]["courseMaterial"]>;
export type CourseMaterialSelectScalar = {
    id?: boolean;
    moduleId?: boolean;
    type?: boolean;
    title?: boolean;
    content?: boolean;
    quizMode?: boolean;
    passingScore?: boolean;
    parentMaterialId?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CourseMaterialOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "moduleId" | "type" | "title" | "content" | "quizMode" | "passingScore" | "parentMaterialId" | "orderIndex" | "createdAt" | "updatedAt", ExtArgs["result"]["courseMaterial"]>;
export type CourseMaterialInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    module?: boolean | Prisma.CourseModuleDefaultArgs<ExtArgs>;
    parentMaterial?: boolean | Prisma.CourseMaterial$parentMaterialArgs<ExtArgs>;
    children?: boolean | Prisma.CourseMaterial$childrenArgs<ExtArgs>;
    courseProgress?: boolean | Prisma.CourseMaterial$courseProgressArgs<ExtArgs>;
    quizAttempts?: boolean | Prisma.CourseMaterial$quizAttemptsArgs<ExtArgs>;
    writingSubmissions?: boolean | Prisma.CourseMaterial$writingSubmissionsArgs<ExtArgs>;
    attachments?: boolean | Prisma.CourseMaterial$attachmentsArgs<ExtArgs>;
    questions?: boolean | Prisma.CourseMaterial$questionsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourseMaterialCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CourseMaterialIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    module?: boolean | Prisma.CourseModuleDefaultArgs<ExtArgs>;
    parentMaterial?: boolean | Prisma.CourseMaterial$parentMaterialArgs<ExtArgs>;
};
export type CourseMaterialIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    module?: boolean | Prisma.CourseModuleDefaultArgs<ExtArgs>;
    parentMaterial?: boolean | Prisma.CourseMaterial$parentMaterialArgs<ExtArgs>;
};
export type $CourseMaterialPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourseMaterial";
    objects: {
        module: Prisma.$CourseModulePayload<ExtArgs>;
        parentMaterial: Prisma.$CourseMaterialPayload<ExtArgs> | null;
        children: Prisma.$CourseMaterialPayload<ExtArgs>[];
        courseProgress: Prisma.$CourseProgressPayload<ExtArgs>[];
        quizAttempts: Prisma.$QuizAttemptPayload<ExtArgs>[];
        writingSubmissions: Prisma.$WritingSubmissionPayload<ExtArgs>[];
        attachments: Prisma.$MaterialAttachmentPayload<ExtArgs>[];
        questions: Prisma.$QuestionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        moduleId: string;
        type: $Enums.CourseMaterialType;
        title: string;
        content: runtime.JsonValue;
        quizMode: $Enums.QuizMode | null;
        passingScore: number | null;
        parentMaterialId: string | null;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["courseMaterial"]>;
    composites: {};
};
export type CourseMaterialGetPayload<S extends boolean | null | undefined | CourseMaterialDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload, S>;
export type CourseMaterialCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourseMaterialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourseMaterialCountAggregateInputType | true;
};
export interface CourseMaterialDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourseMaterial'];
        meta: {
            name: 'CourseMaterial';
        };
    };
    findUnique<T extends CourseMaterialFindUniqueArgs>(args: Prisma.SelectSubset<T, CourseMaterialFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourseMaterialFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourseMaterialFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourseMaterialFindFirstArgs>(args?: Prisma.SelectSubset<T, CourseMaterialFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourseMaterialFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourseMaterialFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourseMaterialFindManyArgs>(args?: Prisma.SelectSubset<T, CourseMaterialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourseMaterialCreateArgs>(args: Prisma.SelectSubset<T, CourseMaterialCreateArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourseMaterialCreateManyArgs>(args?: Prisma.SelectSubset<T, CourseMaterialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourseMaterialCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourseMaterialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourseMaterialDeleteArgs>(args: Prisma.SelectSubset<T, CourseMaterialDeleteArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourseMaterialUpdateArgs>(args: Prisma.SelectSubset<T, CourseMaterialUpdateArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourseMaterialDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourseMaterialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourseMaterialUpdateManyArgs>(args: Prisma.SelectSubset<T, CourseMaterialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourseMaterialUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourseMaterialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourseMaterialUpsertArgs>(args: Prisma.SelectSubset<T, CourseMaterialUpsertArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourseMaterialCountArgs>(args?: Prisma.Subset<T, CourseMaterialCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourseMaterialCountAggregateOutputType> : number>;
    aggregate<T extends CourseMaterialAggregateArgs>(args: Prisma.Subset<T, CourseMaterialAggregateArgs>): Prisma.PrismaPromise<GetCourseMaterialAggregateType<T>>;
    groupBy<T extends CourseMaterialGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourseMaterialGroupByArgs['orderBy'];
    } : {
        orderBy?: CourseMaterialGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourseMaterialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseMaterialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourseMaterialFieldRefs;
}
export interface Prisma__CourseMaterialClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    module<T extends Prisma.CourseModuleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseModuleDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseModuleClient<runtime.Types.Result.GetResult<Prisma.$CourseModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    parentMaterial<T extends Prisma.CourseMaterial$parentMaterialArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterial$parentMaterialArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    children<T extends Prisma.CourseMaterial$childrenArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterial$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    courseProgress<T extends Prisma.CourseMaterial$courseProgressArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterial$courseProgressArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    quizAttempts<T extends Prisma.CourseMaterial$quizAttemptsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterial$quizAttemptsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    writingSubmissions<T extends Prisma.CourseMaterial$writingSubmissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterial$writingSubmissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WritingSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    attachments<T extends Prisma.CourseMaterial$attachmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterial$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    questions<T extends Prisma.CourseMaterial$questionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterial$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourseMaterialFieldRefs {
    readonly id: Prisma.FieldRef<"CourseMaterial", 'String'>;
    readonly moduleId: Prisma.FieldRef<"CourseMaterial", 'String'>;
    readonly type: Prisma.FieldRef<"CourseMaterial", 'CourseMaterialType'>;
    readonly title: Prisma.FieldRef<"CourseMaterial", 'String'>;
    readonly content: Prisma.FieldRef<"CourseMaterial", 'Json'>;
    readonly quizMode: Prisma.FieldRef<"CourseMaterial", 'QuizMode'>;
    readonly passingScore: Prisma.FieldRef<"CourseMaterial", 'Int'>;
    readonly parentMaterialId: Prisma.FieldRef<"CourseMaterial", 'String'>;
    readonly orderIndex: Prisma.FieldRef<"CourseMaterial", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"CourseMaterial", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"CourseMaterial", 'DateTime'>;
}
export type CourseMaterialFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where?: Prisma.CourseMaterialWhereInput;
    orderBy?: Prisma.CourseMaterialOrderByWithRelationInput | Prisma.CourseMaterialOrderByWithRelationInput[];
    cursor?: Prisma.CourseMaterialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseMaterialScalarFieldEnum | Prisma.CourseMaterialScalarFieldEnum[];
};
export type CourseMaterialFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where?: Prisma.CourseMaterialWhereInput;
    orderBy?: Prisma.CourseMaterialOrderByWithRelationInput | Prisma.CourseMaterialOrderByWithRelationInput[];
    cursor?: Prisma.CourseMaterialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseMaterialScalarFieldEnum | Prisma.CourseMaterialScalarFieldEnum[];
};
export type CourseMaterialFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where?: Prisma.CourseMaterialWhereInput;
    orderBy?: Prisma.CourseMaterialOrderByWithRelationInput | Prisma.CourseMaterialOrderByWithRelationInput[];
    cursor?: Prisma.CourseMaterialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseMaterialScalarFieldEnum | Prisma.CourseMaterialScalarFieldEnum[];
};
export type CourseMaterialCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseMaterialCreateInput, Prisma.CourseMaterialUncheckedCreateInput>;
};
export type CourseMaterialCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourseMaterialCreateManyInput | Prisma.CourseMaterialCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourseMaterialCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    data: Prisma.CourseMaterialCreateManyInput | Prisma.CourseMaterialCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourseMaterialIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourseMaterialUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateInput, Prisma.CourseMaterialUncheckedUpdateInput>;
    where: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourseMaterialUpdateManyMutationInput, Prisma.CourseMaterialUncheckedUpdateManyInput>;
    where?: Prisma.CourseMaterialWhereInput;
    limit?: number;
};
export type CourseMaterialUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseMaterialUpdateManyMutationInput, Prisma.CourseMaterialUncheckedUpdateManyInput>;
    where?: Prisma.CourseMaterialWhereInput;
    limit?: number;
    include?: Prisma.CourseMaterialIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourseMaterialUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where: Prisma.CourseMaterialWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseMaterialCreateInput, Prisma.CourseMaterialUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourseMaterialUpdateInput, Prisma.CourseMaterialUncheckedUpdateInput>;
};
export type CourseMaterialDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where: Prisma.CourseMaterialWhereUniqueInput;
};
export type CourseMaterialDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseMaterialWhereInput;
    limit?: number;
};
export type CourseMaterial$parentMaterialArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseMaterial$childrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where?: Prisma.CourseMaterialWhereInput;
    orderBy?: Prisma.CourseMaterialOrderByWithRelationInput | Prisma.CourseMaterialOrderByWithRelationInput[];
    cursor?: Prisma.CourseMaterialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseMaterialScalarFieldEnum | Prisma.CourseMaterialScalarFieldEnum[];
};
export type CourseMaterial$courseProgressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
    where?: Prisma.CourseProgressWhereInput;
    orderBy?: Prisma.CourseProgressOrderByWithRelationInput | Prisma.CourseProgressOrderByWithRelationInput[];
    cursor?: Prisma.CourseProgressWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseProgressScalarFieldEnum | Prisma.CourseProgressScalarFieldEnum[];
};
export type CourseMaterial$quizAttemptsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourseMaterial$writingSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourseMaterial$attachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
    where?: Prisma.MaterialAttachmentWhereInput;
    orderBy?: Prisma.MaterialAttachmentOrderByWithRelationInput | Prisma.MaterialAttachmentOrderByWithRelationInput[];
    cursor?: Prisma.MaterialAttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MaterialAttachmentScalarFieldEnum | Prisma.MaterialAttachmentScalarFieldEnum[];
};
export type CourseMaterial$questionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourseMaterialDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
};
export {};
