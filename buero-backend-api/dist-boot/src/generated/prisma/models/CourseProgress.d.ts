import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CourseProgressModel = runtime.Types.Result.DefaultSelection<Prisma.$CourseProgressPayload>;
export type AggregateCourseProgress = {
    _count: CourseProgressCountAggregateOutputType | null;
    _avg: CourseProgressAvgAggregateOutputType | null;
    _sum: CourseProgressSumAggregateOutputType | null;
    _min: CourseProgressMinAggregateOutputType | null;
    _max: CourseProgressMaxAggregateOutputType | null;
};
export type CourseProgressAvgAggregateOutputType = {
    score: runtime.Decimal | null;
};
export type CourseProgressSumAggregateOutputType = {
    score: runtime.Decimal | null;
};
export type CourseProgressMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    courseMaterialId: string | null;
    completedAt: Date | null;
    score: runtime.Decimal | null;
    createdAt: Date | null;
};
export type CourseProgressMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    courseMaterialId: string | null;
    completedAt: Date | null;
    score: runtime.Decimal | null;
    createdAt: Date | null;
};
export type CourseProgressCountAggregateOutputType = {
    id: number;
    userId: number;
    courseId: number;
    courseMaterialId: number;
    completedAt: number;
    score: number;
    createdAt: number;
    _all: number;
};
export type CourseProgressAvgAggregateInputType = {
    score?: true;
};
export type CourseProgressSumAggregateInputType = {
    score?: true;
};
export type CourseProgressMinAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    courseMaterialId?: true;
    completedAt?: true;
    score?: true;
    createdAt?: true;
};
export type CourseProgressMaxAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    courseMaterialId?: true;
    completedAt?: true;
    score?: true;
    createdAt?: true;
};
export type CourseProgressCountAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    courseMaterialId?: true;
    completedAt?: true;
    score?: true;
    createdAt?: true;
    _all?: true;
};
export type CourseProgressAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseProgressWhereInput;
    orderBy?: Prisma.CourseProgressOrderByWithRelationInput | Prisma.CourseProgressOrderByWithRelationInput[];
    cursor?: Prisma.CourseProgressWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourseProgressCountAggregateInputType;
    _avg?: CourseProgressAvgAggregateInputType;
    _sum?: CourseProgressSumAggregateInputType;
    _min?: CourseProgressMinAggregateInputType;
    _max?: CourseProgressMaxAggregateInputType;
};
export type GetCourseProgressAggregateType<T extends CourseProgressAggregateArgs> = {
    [P in keyof T & keyof AggregateCourseProgress]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourseProgress[P]> : Prisma.GetScalarType<T[P], AggregateCourseProgress[P]>;
};
export type CourseProgressGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseProgressWhereInput;
    orderBy?: Prisma.CourseProgressOrderByWithAggregationInput | Prisma.CourseProgressOrderByWithAggregationInput[];
    by: Prisma.CourseProgressScalarFieldEnum[] | Prisma.CourseProgressScalarFieldEnum;
    having?: Prisma.CourseProgressScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourseProgressCountAggregateInputType | true;
    _avg?: CourseProgressAvgAggregateInputType;
    _sum?: CourseProgressSumAggregateInputType;
    _min?: CourseProgressMinAggregateInputType;
    _max?: CourseProgressMaxAggregateInputType;
};
export type CourseProgressGroupByOutputType = {
    id: string;
    userId: string;
    courseId: string;
    courseMaterialId: string | null;
    completedAt: Date;
    score: runtime.Decimal | null;
    createdAt: Date;
    _count: CourseProgressCountAggregateOutputType | null;
    _avg: CourseProgressAvgAggregateOutputType | null;
    _sum: CourseProgressSumAggregateOutputType | null;
    _min: CourseProgressMinAggregateOutputType | null;
    _max: CourseProgressMaxAggregateOutputType | null;
};
type GetCourseProgressGroupByPayload<T extends CourseProgressGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourseProgressGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourseProgressGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourseProgressGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourseProgressGroupByOutputType[P]>;
}>>;
export type CourseProgressWhereInput = {
    AND?: Prisma.CourseProgressWhereInput | Prisma.CourseProgressWhereInput[];
    OR?: Prisma.CourseProgressWhereInput[];
    NOT?: Prisma.CourseProgressWhereInput | Prisma.CourseProgressWhereInput[];
    id?: Prisma.StringFilter<"CourseProgress"> | string;
    userId?: Prisma.StringFilter<"CourseProgress"> | string;
    courseId?: Prisma.StringFilter<"CourseProgress"> | string;
    courseMaterialId?: Prisma.StringNullableFilter<"CourseProgress"> | string | null;
    completedAt?: Prisma.DateTimeFilter<"CourseProgress"> | Date | string;
    score?: Prisma.DecimalNullableFilter<"CourseProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourseProgress"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    courseMaterial?: Prisma.XOR<Prisma.CourseMaterialNullableScalarRelationFilter, Prisma.CourseMaterialWhereInput> | null;
};
export type CourseProgressOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    score?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    course?: Prisma.CourseOrderByWithRelationInput;
    courseMaterial?: Prisma.CourseMaterialOrderByWithRelationInput;
};
export type CourseProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_courseId_courseMaterialId?: Prisma.CourseProgressUserIdCourseIdCourseMaterialIdCompoundUniqueInput;
    AND?: Prisma.CourseProgressWhereInput | Prisma.CourseProgressWhereInput[];
    OR?: Prisma.CourseProgressWhereInput[];
    NOT?: Prisma.CourseProgressWhereInput | Prisma.CourseProgressWhereInput[];
    userId?: Prisma.StringFilter<"CourseProgress"> | string;
    courseId?: Prisma.StringFilter<"CourseProgress"> | string;
    courseMaterialId?: Prisma.StringNullableFilter<"CourseProgress"> | string | null;
    completedAt?: Prisma.DateTimeFilter<"CourseProgress"> | Date | string;
    score?: Prisma.DecimalNullableFilter<"CourseProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourseProgress"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    courseMaterial?: Prisma.XOR<Prisma.CourseMaterialNullableScalarRelationFilter, Prisma.CourseMaterialWhereInput> | null;
}, "id" | "userId_courseId_courseMaterialId">;
export type CourseProgressOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    score?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CourseProgressCountOrderByAggregateInput;
    _avg?: Prisma.CourseProgressAvgOrderByAggregateInput;
    _max?: Prisma.CourseProgressMaxOrderByAggregateInput;
    _min?: Prisma.CourseProgressMinOrderByAggregateInput;
    _sum?: Prisma.CourseProgressSumOrderByAggregateInput;
};
export type CourseProgressScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourseProgressScalarWhereWithAggregatesInput | Prisma.CourseProgressScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourseProgressScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourseProgressScalarWhereWithAggregatesInput | Prisma.CourseProgressScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CourseProgress"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"CourseProgress"> | string;
    courseId?: Prisma.StringWithAggregatesFilter<"CourseProgress"> | string;
    courseMaterialId?: Prisma.StringNullableWithAggregatesFilter<"CourseProgress"> | string | null;
    completedAt?: Prisma.DateTimeWithAggregatesFilter<"CourseProgress"> | Date | string;
    score?: Prisma.DecimalNullableWithAggregatesFilter<"CourseProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CourseProgress"> | Date | string;
};
export type CourseProgressCreateInput = {
    id?: string;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutCourseProgressInput;
    course: Prisma.CourseCreateNestedOneWithoutCourseProgressInput;
    courseMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutCourseProgressInput;
};
export type CourseProgressUncheckedCreateInput = {
    id?: string;
    userId: string;
    courseId: string;
    courseMaterialId?: string | null;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCourseProgressNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutCourseProgressNestedInput;
    courseMaterial?: Prisma.CourseMaterialUpdateOneWithoutCourseProgressNestedInput;
};
export type CourseProgressUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressCreateManyInput = {
    id?: string;
    userId: string;
    courseId: string;
    courseMaterialId?: string | null;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressListRelationFilter = {
    every?: Prisma.CourseProgressWhereInput;
    some?: Prisma.CourseProgressWhereInput;
    none?: Prisma.CourseProgressWhereInput;
};
export type CourseProgressOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourseProgressUserIdCourseIdCourseMaterialIdCompoundUniqueInput = {
    userId: string;
    courseId: string;
    courseMaterialId: string;
};
export type CourseProgressCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourseProgressAvgOrderByAggregateInput = {
    score?: Prisma.SortOrder;
};
export type CourseProgressMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourseProgressMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    courseMaterialId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourseProgressSumOrderByAggregateInput = {
    score?: Prisma.SortOrder;
};
export type CourseProgressCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutUserInput, Prisma.CourseProgressUncheckedCreateWithoutUserInput> | Prisma.CourseProgressCreateWithoutUserInput[] | Prisma.CourseProgressUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutUserInput | Prisma.CourseProgressCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CourseProgressCreateManyUserInputEnvelope;
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
};
export type CourseProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutUserInput, Prisma.CourseProgressUncheckedCreateWithoutUserInput> | Prisma.CourseProgressCreateWithoutUserInput[] | Prisma.CourseProgressUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutUserInput | Prisma.CourseProgressCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CourseProgressCreateManyUserInputEnvelope;
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
};
export type CourseProgressUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutUserInput, Prisma.CourseProgressUncheckedCreateWithoutUserInput> | Prisma.CourseProgressCreateWithoutUserInput[] | Prisma.CourseProgressUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutUserInput | Prisma.CourseProgressCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CourseProgressUpsertWithWhereUniqueWithoutUserInput | Prisma.CourseProgressUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CourseProgressCreateManyUserInputEnvelope;
    set?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    disconnect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    delete?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    update?: Prisma.CourseProgressUpdateWithWhereUniqueWithoutUserInput | Prisma.CourseProgressUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CourseProgressUpdateManyWithWhereWithoutUserInput | Prisma.CourseProgressUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
};
export type CourseProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutUserInput, Prisma.CourseProgressUncheckedCreateWithoutUserInput> | Prisma.CourseProgressCreateWithoutUserInput[] | Prisma.CourseProgressUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutUserInput | Prisma.CourseProgressCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CourseProgressUpsertWithWhereUniqueWithoutUserInput | Prisma.CourseProgressUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CourseProgressCreateManyUserInputEnvelope;
    set?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    disconnect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    delete?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    update?: Prisma.CourseProgressUpdateWithWhereUniqueWithoutUserInput | Prisma.CourseProgressUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CourseProgressUpdateManyWithWhereWithoutUserInput | Prisma.CourseProgressUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
};
export type CourseProgressCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseInput, Prisma.CourseProgressUncheckedCreateWithoutCourseInput> | Prisma.CourseProgressCreateWithoutCourseInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseInput | Prisma.CourseProgressCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseInputEnvelope;
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
};
export type CourseProgressUncheckedCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseInput, Prisma.CourseProgressUncheckedCreateWithoutCourseInput> | Prisma.CourseProgressCreateWithoutCourseInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseInput | Prisma.CourseProgressCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseInputEnvelope;
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
};
export type CourseProgressUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseInput, Prisma.CourseProgressUncheckedCreateWithoutCourseInput> | Prisma.CourseProgressCreateWithoutCourseInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseInput | Prisma.CourseProgressCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseInput | Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseInputEnvelope;
    set?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    disconnect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    delete?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    update?: Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseInput | Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.CourseProgressUpdateManyWithWhereWithoutCourseInput | Prisma.CourseProgressUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
};
export type CourseProgressUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseInput, Prisma.CourseProgressUncheckedCreateWithoutCourseInput> | Prisma.CourseProgressCreateWithoutCourseInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseInput | Prisma.CourseProgressCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseInput | Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseInputEnvelope;
    set?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    disconnect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    delete?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    update?: Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseInput | Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.CourseProgressUpdateManyWithWhereWithoutCourseInput | Prisma.CourseProgressUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
};
export type CourseProgressCreateNestedManyWithoutCourseMaterialInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput> | Prisma.CourseProgressCreateWithoutCourseMaterialInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput | Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseMaterialInputEnvelope;
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
};
export type CourseProgressUncheckedCreateNestedManyWithoutCourseMaterialInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput> | Prisma.CourseProgressCreateWithoutCourseMaterialInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput | Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseMaterialInputEnvelope;
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
};
export type CourseProgressUpdateManyWithoutCourseMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput> | Prisma.CourseProgressCreateWithoutCourseMaterialInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput | Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput[];
    upsert?: Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseMaterialInput | Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseMaterialInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseMaterialInputEnvelope;
    set?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    disconnect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    delete?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    update?: Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseMaterialInput | Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseMaterialInput[];
    updateMany?: Prisma.CourseProgressUpdateManyWithWhereWithoutCourseMaterialInput | Prisma.CourseProgressUpdateManyWithWhereWithoutCourseMaterialInput[];
    deleteMany?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
};
export type CourseProgressUncheckedUpdateManyWithoutCourseMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput> | Prisma.CourseProgressCreateWithoutCourseMaterialInput[] | Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput[];
    connectOrCreate?: Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput | Prisma.CourseProgressCreateOrConnectWithoutCourseMaterialInput[];
    upsert?: Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseMaterialInput | Prisma.CourseProgressUpsertWithWhereUniqueWithoutCourseMaterialInput[];
    createMany?: Prisma.CourseProgressCreateManyCourseMaterialInputEnvelope;
    set?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    disconnect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    delete?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    connect?: Prisma.CourseProgressWhereUniqueInput | Prisma.CourseProgressWhereUniqueInput[];
    update?: Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseMaterialInput | Prisma.CourseProgressUpdateWithWhereUniqueWithoutCourseMaterialInput[];
    updateMany?: Prisma.CourseProgressUpdateManyWithWhereWithoutCourseMaterialInput | Prisma.CourseProgressUpdateManyWithWhereWithoutCourseMaterialInput[];
    deleteMany?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
};
export type CourseProgressCreateWithoutUserInput = {
    id?: string;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutCourseProgressInput;
    courseMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutCourseProgressInput;
};
export type CourseProgressUncheckedCreateWithoutUserInput = {
    id?: string;
    courseId: string;
    courseMaterialId?: string | null;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressCreateOrConnectWithoutUserInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseProgressCreateWithoutUserInput, Prisma.CourseProgressUncheckedCreateWithoutUserInput>;
};
export type CourseProgressCreateManyUserInputEnvelope = {
    data: Prisma.CourseProgressCreateManyUserInput | Prisma.CourseProgressCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type CourseProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseProgressUpdateWithoutUserInput, Prisma.CourseProgressUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.CourseProgressCreateWithoutUserInput, Prisma.CourseProgressUncheckedCreateWithoutUserInput>;
};
export type CourseProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseProgressUpdateWithoutUserInput, Prisma.CourseProgressUncheckedUpdateWithoutUserInput>;
};
export type CourseProgressUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.CourseProgressScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseProgressUpdateManyMutationInput, Prisma.CourseProgressUncheckedUpdateManyWithoutUserInput>;
};
export type CourseProgressScalarWhereInput = {
    AND?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
    OR?: Prisma.CourseProgressScalarWhereInput[];
    NOT?: Prisma.CourseProgressScalarWhereInput | Prisma.CourseProgressScalarWhereInput[];
    id?: Prisma.StringFilter<"CourseProgress"> | string;
    userId?: Prisma.StringFilter<"CourseProgress"> | string;
    courseId?: Prisma.StringFilter<"CourseProgress"> | string;
    courseMaterialId?: Prisma.StringNullableFilter<"CourseProgress"> | string | null;
    completedAt?: Prisma.DateTimeFilter<"CourseProgress"> | Date | string;
    score?: Prisma.DecimalNullableFilter<"CourseProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourseProgress"> | Date | string;
};
export type CourseProgressCreateWithoutCourseInput = {
    id?: string;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutCourseProgressInput;
    courseMaterial?: Prisma.CourseMaterialCreateNestedOneWithoutCourseProgressInput;
};
export type CourseProgressUncheckedCreateWithoutCourseInput = {
    id?: string;
    userId: string;
    courseMaterialId?: string | null;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressCreateOrConnectWithoutCourseInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseInput, Prisma.CourseProgressUncheckedCreateWithoutCourseInput>;
};
export type CourseProgressCreateManyCourseInputEnvelope = {
    data: Prisma.CourseProgressCreateManyCourseInput | Prisma.CourseProgressCreateManyCourseInput[];
    skipDuplicates?: boolean;
};
export type CourseProgressUpsertWithWhereUniqueWithoutCourseInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseProgressUpdateWithoutCourseInput, Prisma.CourseProgressUncheckedUpdateWithoutCourseInput>;
    create: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseInput, Prisma.CourseProgressUncheckedCreateWithoutCourseInput>;
};
export type CourseProgressUpdateWithWhereUniqueWithoutCourseInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseProgressUpdateWithoutCourseInput, Prisma.CourseProgressUncheckedUpdateWithoutCourseInput>;
};
export type CourseProgressUpdateManyWithWhereWithoutCourseInput = {
    where: Prisma.CourseProgressScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseProgressUpdateManyMutationInput, Prisma.CourseProgressUncheckedUpdateManyWithoutCourseInput>;
};
export type CourseProgressCreateWithoutCourseMaterialInput = {
    id?: string;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutCourseProgressInput;
    course: Prisma.CourseCreateNestedOneWithoutCourseProgressInput;
};
export type CourseProgressUncheckedCreateWithoutCourseMaterialInput = {
    id?: string;
    userId: string;
    courseId: string;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressCreateOrConnectWithoutCourseMaterialInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput>;
};
export type CourseProgressCreateManyCourseMaterialInputEnvelope = {
    data: Prisma.CourseProgressCreateManyCourseMaterialInput | Prisma.CourseProgressCreateManyCourseMaterialInput[];
    skipDuplicates?: boolean;
};
export type CourseProgressUpsertWithWhereUniqueWithoutCourseMaterialInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseProgressUpdateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedUpdateWithoutCourseMaterialInput>;
    create: Prisma.XOR<Prisma.CourseProgressCreateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedCreateWithoutCourseMaterialInput>;
};
export type CourseProgressUpdateWithWhereUniqueWithoutCourseMaterialInput = {
    where: Prisma.CourseProgressWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseProgressUpdateWithoutCourseMaterialInput, Prisma.CourseProgressUncheckedUpdateWithoutCourseMaterialInput>;
};
export type CourseProgressUpdateManyWithWhereWithoutCourseMaterialInput = {
    where: Prisma.CourseProgressScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseProgressUpdateManyMutationInput, Prisma.CourseProgressUncheckedUpdateManyWithoutCourseMaterialInput>;
};
export type CourseProgressCreateManyUserInput = {
    id?: string;
    courseId: string;
    courseMaterialId?: string | null;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutCourseProgressNestedInput;
    courseMaterial?: Prisma.CourseMaterialUpdateOneWithoutCourseProgressNestedInput;
};
export type CourseProgressUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressCreateManyCourseInput = {
    id?: string;
    userId: string;
    courseMaterialId?: string | null;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCourseProgressNestedInput;
    courseMaterial?: Prisma.CourseMaterialUpdateOneWithoutCourseProgressNestedInput;
};
export type CourseProgressUncheckedUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressUncheckedUpdateManyWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseMaterialId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressCreateManyCourseMaterialInput = {
    id?: string;
    userId: string;
    courseId: string;
    completedAt: Date | string;
    score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
};
export type CourseProgressUpdateWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCourseProgressNestedInput;
    course?: Prisma.CourseUpdateOneRequiredWithoutCourseProgressNestedInput;
};
export type CourseProgressUncheckedUpdateWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressUncheckedUpdateManyWithoutCourseMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourseProgressSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    courseMaterialId?: boolean;
    completedAt?: boolean;
    score?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseProgress$courseMaterialArgs<ExtArgs>;
}, ExtArgs["result"]["courseProgress"]>;
export type CourseProgressSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    courseMaterialId?: boolean;
    completedAt?: boolean;
    score?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseProgress$courseMaterialArgs<ExtArgs>;
}, ExtArgs["result"]["courseProgress"]>;
export type CourseProgressSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    courseMaterialId?: boolean;
    completedAt?: boolean;
    score?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseProgress$courseMaterialArgs<ExtArgs>;
}, ExtArgs["result"]["courseProgress"]>;
export type CourseProgressSelectScalar = {
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    courseMaterialId?: boolean;
    completedAt?: boolean;
    score?: boolean;
    createdAt?: boolean;
};
export type CourseProgressOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "courseId" | "courseMaterialId" | "completedAt" | "score" | "createdAt", ExtArgs["result"]["courseProgress"]>;
export type CourseProgressInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseProgress$courseMaterialArgs<ExtArgs>;
};
export type CourseProgressIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseProgress$courseMaterialArgs<ExtArgs>;
};
export type CourseProgressIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    courseMaterial?: boolean | Prisma.CourseProgress$courseMaterialArgs<ExtArgs>;
};
export type $CourseProgressPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourseProgress";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        course: Prisma.$CoursePayload<ExtArgs>;
        courseMaterial: Prisma.$CourseMaterialPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        courseId: string;
        courseMaterialId: string | null;
        completedAt: Date;
        score: runtime.Decimal | null;
        createdAt: Date;
    }, ExtArgs["result"]["courseProgress"]>;
    composites: {};
};
export type CourseProgressGetPayload<S extends boolean | null | undefined | CourseProgressDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload, S>;
export type CourseProgressCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourseProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourseProgressCountAggregateInputType | true;
};
export interface CourseProgressDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourseProgress'];
        meta: {
            name: 'CourseProgress';
        };
    };
    findUnique<T extends CourseProgressFindUniqueArgs>(args: Prisma.SelectSubset<T, CourseProgressFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourseProgressFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourseProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourseProgressFindFirstArgs>(args?: Prisma.SelectSubset<T, CourseProgressFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourseProgressFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourseProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourseProgressFindManyArgs>(args?: Prisma.SelectSubset<T, CourseProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourseProgressCreateArgs>(args: Prisma.SelectSubset<T, CourseProgressCreateArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourseProgressCreateManyArgs>(args?: Prisma.SelectSubset<T, CourseProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourseProgressCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourseProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourseProgressDeleteArgs>(args: Prisma.SelectSubset<T, CourseProgressDeleteArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourseProgressUpdateArgs>(args: Prisma.SelectSubset<T, CourseProgressUpdateArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourseProgressDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourseProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourseProgressUpdateManyArgs>(args: Prisma.SelectSubset<T, CourseProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourseProgressUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourseProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourseProgressUpsertArgs>(args: Prisma.SelectSubset<T, CourseProgressUpsertArgs<ExtArgs>>): Prisma.Prisma__CourseProgressClient<runtime.Types.Result.GetResult<Prisma.$CourseProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourseProgressCountArgs>(args?: Prisma.Subset<T, CourseProgressCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourseProgressCountAggregateOutputType> : number>;
    aggregate<T extends CourseProgressAggregateArgs>(args: Prisma.Subset<T, CourseProgressAggregateArgs>): Prisma.PrismaPromise<GetCourseProgressAggregateType<T>>;
    groupBy<T extends CourseProgressGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourseProgressGroupByArgs['orderBy'];
    } : {
        orderBy?: CourseProgressGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourseProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourseProgressFieldRefs;
}
export interface Prisma__CourseProgressClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    course<T extends Prisma.CourseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    courseMaterial<T extends Prisma.CourseProgress$courseMaterialArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseProgress$courseMaterialArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourseProgressFieldRefs {
    readonly id: Prisma.FieldRef<"CourseProgress", 'String'>;
    readonly userId: Prisma.FieldRef<"CourseProgress", 'String'>;
    readonly courseId: Prisma.FieldRef<"CourseProgress", 'String'>;
    readonly courseMaterialId: Prisma.FieldRef<"CourseProgress", 'String'>;
    readonly completedAt: Prisma.FieldRef<"CourseProgress", 'DateTime'>;
    readonly score: Prisma.FieldRef<"CourseProgress", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"CourseProgress", 'DateTime'>;
}
export type CourseProgressFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
    where: Prisma.CourseProgressWhereUniqueInput;
};
export type CourseProgressFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
    where: Prisma.CourseProgressWhereUniqueInput;
};
export type CourseProgressFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourseProgressFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourseProgressFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourseProgressCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseProgressCreateInput, Prisma.CourseProgressUncheckedCreateInput>;
};
export type CourseProgressCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourseProgressCreateManyInput | Prisma.CourseProgressCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourseProgressCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    data: Prisma.CourseProgressCreateManyInput | Prisma.CourseProgressCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourseProgressIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourseProgressUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseProgressUpdateInput, Prisma.CourseProgressUncheckedUpdateInput>;
    where: Prisma.CourseProgressWhereUniqueInput;
};
export type CourseProgressUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourseProgressUpdateManyMutationInput, Prisma.CourseProgressUncheckedUpdateManyInput>;
    where?: Prisma.CourseProgressWhereInput;
    limit?: number;
};
export type CourseProgressUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourseProgressUpdateManyMutationInput, Prisma.CourseProgressUncheckedUpdateManyInput>;
    where?: Prisma.CourseProgressWhereInput;
    limit?: number;
    include?: Prisma.CourseProgressIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourseProgressUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
    where: Prisma.CourseProgressWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseProgressCreateInput, Prisma.CourseProgressUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourseProgressUpdateInput, Prisma.CourseProgressUncheckedUpdateInput>;
};
export type CourseProgressDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
    where: Prisma.CourseProgressWhereUniqueInput;
};
export type CourseProgressDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseProgressWhereInput;
    limit?: number;
};
export type CourseProgress$courseMaterialArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseMaterialSelect<ExtArgs> | null;
    omit?: Prisma.CourseMaterialOmit<ExtArgs> | null;
    include?: Prisma.CourseMaterialInclude<ExtArgs> | null;
    where?: Prisma.CourseMaterialWhereInput;
};
export type CourseProgressDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseProgressSelect<ExtArgs> | null;
    omit?: Prisma.CourseProgressOmit<ExtArgs> | null;
    include?: Prisma.CourseProgressInclude<ExtArgs> | null;
};
export {};
