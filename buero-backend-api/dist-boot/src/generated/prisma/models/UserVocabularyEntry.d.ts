import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type UserVocabularyEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$UserVocabularyEntryPayload>;
export type AggregateUserVocabularyEntry = {
    _count: UserVocabularyEntryCountAggregateOutputType | null;
    _min: UserVocabularyEntryMinAggregateOutputType | null;
    _max: UserVocabularyEntryMaxAggregateOutputType | null;
};
export type UserVocabularyEntryMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    word: string | null;
    translation: string | null;
    category: $Enums.VocabularyCategory | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserVocabularyEntryMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    courseId: string | null;
    word: string | null;
    translation: string | null;
    category: $Enums.VocabularyCategory | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserVocabularyEntryCountAggregateOutputType = {
    id: number;
    userId: number;
    courseId: number;
    word: number;
    translation: number;
    category: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserVocabularyEntryMinAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    word?: true;
    translation?: true;
    category?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserVocabularyEntryMaxAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    word?: true;
    translation?: true;
    category?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserVocabularyEntryCountAggregateInputType = {
    id?: true;
    userId?: true;
    courseId?: true;
    word?: true;
    translation?: true;
    category?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserVocabularyEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserVocabularyEntryWhereInput;
    orderBy?: Prisma.UserVocabularyEntryOrderByWithRelationInput | Prisma.UserVocabularyEntryOrderByWithRelationInput[];
    cursor?: Prisma.UserVocabularyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserVocabularyEntryCountAggregateInputType;
    _min?: UserVocabularyEntryMinAggregateInputType;
    _max?: UserVocabularyEntryMaxAggregateInputType;
};
export type GetUserVocabularyEntryAggregateType<T extends UserVocabularyEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateUserVocabularyEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserVocabularyEntry[P]> : Prisma.GetScalarType<T[P], AggregateUserVocabularyEntry[P]>;
};
export type UserVocabularyEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserVocabularyEntryWhereInput;
    orderBy?: Prisma.UserVocabularyEntryOrderByWithAggregationInput | Prisma.UserVocabularyEntryOrderByWithAggregationInput[];
    by: Prisma.UserVocabularyEntryScalarFieldEnum[] | Prisma.UserVocabularyEntryScalarFieldEnum;
    having?: Prisma.UserVocabularyEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserVocabularyEntryCountAggregateInputType | true;
    _min?: UserVocabularyEntryMinAggregateInputType;
    _max?: UserVocabularyEntryMaxAggregateInputType;
};
export type UserVocabularyEntryGroupByOutputType = {
    id: string;
    userId: string;
    courseId: string | null;
    word: string;
    translation: string;
    category: $Enums.VocabularyCategory;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: UserVocabularyEntryCountAggregateOutputType | null;
    _min: UserVocabularyEntryMinAggregateOutputType | null;
    _max: UserVocabularyEntryMaxAggregateOutputType | null;
};
type GetUserVocabularyEntryGroupByPayload<T extends UserVocabularyEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserVocabularyEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserVocabularyEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserVocabularyEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserVocabularyEntryGroupByOutputType[P]>;
}>>;
export type UserVocabularyEntryWhereInput = {
    AND?: Prisma.UserVocabularyEntryWhereInput | Prisma.UserVocabularyEntryWhereInput[];
    OR?: Prisma.UserVocabularyEntryWhereInput[];
    NOT?: Prisma.UserVocabularyEntryWhereInput | Prisma.UserVocabularyEntryWhereInput[];
    id?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    userId?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    courseId?: Prisma.StringNullableFilter<"UserVocabularyEntry"> | string | null;
    word?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    translation?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    category?: Prisma.EnumVocabularyCategoryFilter<"UserVocabularyEntry"> | $Enums.VocabularyCategory;
    notes?: Prisma.StringNullableFilter<"UserVocabularyEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"UserVocabularyEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserVocabularyEntry"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseNullableScalarRelationFilter, Prisma.CourseWhereInput> | null;
};
export type UserVocabularyEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrderInput | Prisma.SortOrder;
    word?: Prisma.SortOrder;
    translation?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    course?: Prisma.CourseOrderByWithRelationInput;
};
export type UserVocabularyEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_word?: Prisma.UserVocabularyEntryUserIdWordCompoundUniqueInput;
    AND?: Prisma.UserVocabularyEntryWhereInput | Prisma.UserVocabularyEntryWhereInput[];
    OR?: Prisma.UserVocabularyEntryWhereInput[];
    NOT?: Prisma.UserVocabularyEntryWhereInput | Prisma.UserVocabularyEntryWhereInput[];
    userId?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    courseId?: Prisma.StringNullableFilter<"UserVocabularyEntry"> | string | null;
    word?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    translation?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    category?: Prisma.EnumVocabularyCategoryFilter<"UserVocabularyEntry"> | $Enums.VocabularyCategory;
    notes?: Prisma.StringNullableFilter<"UserVocabularyEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"UserVocabularyEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserVocabularyEntry"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    course?: Prisma.XOR<Prisma.CourseNullableScalarRelationFilter, Prisma.CourseWhereInput> | null;
}, "id" | "userId_word">;
export type UserVocabularyEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrderInput | Prisma.SortOrder;
    word?: Prisma.SortOrder;
    translation?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserVocabularyEntryCountOrderByAggregateInput;
    _max?: Prisma.UserVocabularyEntryMaxOrderByAggregateInput;
    _min?: Prisma.UserVocabularyEntryMinOrderByAggregateInput;
};
export type UserVocabularyEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserVocabularyEntryScalarWhereWithAggregatesInput | Prisma.UserVocabularyEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserVocabularyEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserVocabularyEntryScalarWhereWithAggregatesInput | Prisma.UserVocabularyEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"UserVocabularyEntry"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"UserVocabularyEntry"> | string;
    courseId?: Prisma.StringNullableWithAggregatesFilter<"UserVocabularyEntry"> | string | null;
    word?: Prisma.StringWithAggregatesFilter<"UserVocabularyEntry"> | string;
    translation?: Prisma.StringWithAggregatesFilter<"UserVocabularyEntry"> | string;
    category?: Prisma.EnumVocabularyCategoryWithAggregatesFilter<"UserVocabularyEntry"> | $Enums.VocabularyCategory;
    notes?: Prisma.StringNullableWithAggregatesFilter<"UserVocabularyEntry"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserVocabularyEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"UserVocabularyEntry"> | Date | string;
};
export type UserVocabularyEntryCreateInput = {
    id?: string;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutVocabularyEntriesInput;
    course?: Prisma.CourseCreateNestedOneWithoutVocabularyEntriesInput;
};
export type UserVocabularyEntryUncheckedCreateInput = {
    id?: string;
    userId: string;
    courseId?: string | null;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserVocabularyEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutVocabularyEntriesNestedInput;
    course?: Prisma.CourseUpdateOneWithoutVocabularyEntriesNestedInput;
};
export type UserVocabularyEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserVocabularyEntryCreateManyInput = {
    id?: string;
    userId: string;
    courseId?: string | null;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserVocabularyEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserVocabularyEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserVocabularyEntryListRelationFilter = {
    every?: Prisma.UserVocabularyEntryWhereInput;
    some?: Prisma.UserVocabularyEntryWhereInput;
    none?: Prisma.UserVocabularyEntryWhereInput;
};
export type UserVocabularyEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserVocabularyEntryUserIdWordCompoundUniqueInput = {
    userId: string;
    word: string;
};
export type UserVocabularyEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    word?: Prisma.SortOrder;
    translation?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserVocabularyEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    word?: Prisma.SortOrder;
    translation?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserVocabularyEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    word?: Prisma.SortOrder;
    translation?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserVocabularyEntryCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput> | Prisma.UserVocabularyEntryCreateWithoutUserInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyUserInputEnvelope;
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
};
export type UserVocabularyEntryUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput> | Prisma.UserVocabularyEntryCreateWithoutUserInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyUserInputEnvelope;
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
};
export type UserVocabularyEntryUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput> | Prisma.UserVocabularyEntryCreateWithoutUserInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutUserInput | Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyUserInputEnvelope;
    set?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    disconnect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    delete?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    update?: Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutUserInput | Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutUserInput | Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserVocabularyEntryScalarWhereInput | Prisma.UserVocabularyEntryScalarWhereInput[];
};
export type UserVocabularyEntryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput> | Prisma.UserVocabularyEntryCreateWithoutUserInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutUserInput | Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyUserInputEnvelope;
    set?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    disconnect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    delete?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    update?: Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutUserInput | Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutUserInput | Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserVocabularyEntryScalarWhereInput | Prisma.UserVocabularyEntryScalarWhereInput[];
};
export type UserVocabularyEntryCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput> | Prisma.UserVocabularyEntryCreateWithoutCourseInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyCourseInputEnvelope;
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
};
export type UserVocabularyEntryUncheckedCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput> | Prisma.UserVocabularyEntryCreateWithoutCourseInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyCourseInputEnvelope;
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
};
export type UserVocabularyEntryUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput> | Prisma.UserVocabularyEntryCreateWithoutCourseInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutCourseInput | Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyCourseInputEnvelope;
    set?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    disconnect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    delete?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    update?: Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutCourseInput | Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutCourseInput | Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.UserVocabularyEntryScalarWhereInput | Prisma.UserVocabularyEntryScalarWhereInput[];
};
export type UserVocabularyEntryUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput> | Prisma.UserVocabularyEntryCreateWithoutCourseInput[] | Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput | Prisma.UserVocabularyEntryCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutCourseInput | Prisma.UserVocabularyEntryUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.UserVocabularyEntryCreateManyCourseInputEnvelope;
    set?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    disconnect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    delete?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    connect?: Prisma.UserVocabularyEntryWhereUniqueInput | Prisma.UserVocabularyEntryWhereUniqueInput[];
    update?: Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutCourseInput | Prisma.UserVocabularyEntryUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutCourseInput | Prisma.UserVocabularyEntryUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.UserVocabularyEntryScalarWhereInput | Prisma.UserVocabularyEntryScalarWhereInput[];
};
export type EnumVocabularyCategoryFieldUpdateOperationsInput = {
    set?: $Enums.VocabularyCategory;
};
export type UserVocabularyEntryCreateWithoutUserInput = {
    id?: string;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    course?: Prisma.CourseCreateNestedOneWithoutVocabularyEntriesInput;
};
export type UserVocabularyEntryUncheckedCreateWithoutUserInput = {
    id?: string;
    courseId?: string | null;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserVocabularyEntryCreateOrConnectWithoutUserInput = {
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput>;
};
export type UserVocabularyEntryCreateManyUserInputEnvelope = {
    data: Prisma.UserVocabularyEntryCreateManyUserInput | Prisma.UserVocabularyEntryCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserVocabularyEntryUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserVocabularyEntryUpdateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutUserInput>;
};
export type UserVocabularyEntryUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserVocabularyEntryUpdateWithoutUserInput, Prisma.UserVocabularyEntryUncheckedUpdateWithoutUserInput>;
};
export type UserVocabularyEntryUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserVocabularyEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.UserVocabularyEntryUpdateManyMutationInput, Prisma.UserVocabularyEntryUncheckedUpdateManyWithoutUserInput>;
};
export type UserVocabularyEntryScalarWhereInput = {
    AND?: Prisma.UserVocabularyEntryScalarWhereInput | Prisma.UserVocabularyEntryScalarWhereInput[];
    OR?: Prisma.UserVocabularyEntryScalarWhereInput[];
    NOT?: Prisma.UserVocabularyEntryScalarWhereInput | Prisma.UserVocabularyEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    userId?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    courseId?: Prisma.StringNullableFilter<"UserVocabularyEntry"> | string | null;
    word?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    translation?: Prisma.StringFilter<"UserVocabularyEntry"> | string;
    category?: Prisma.EnumVocabularyCategoryFilter<"UserVocabularyEntry"> | $Enums.VocabularyCategory;
    notes?: Prisma.StringNullableFilter<"UserVocabularyEntry"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"UserVocabularyEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserVocabularyEntry"> | Date | string;
};
export type UserVocabularyEntryCreateWithoutCourseInput = {
    id?: string;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutVocabularyEntriesInput;
};
export type UserVocabularyEntryUncheckedCreateWithoutCourseInput = {
    id?: string;
    userId: string;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserVocabularyEntryCreateOrConnectWithoutCourseInput = {
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput>;
};
export type UserVocabularyEntryCreateManyCourseInputEnvelope = {
    data: Prisma.UserVocabularyEntryCreateManyCourseInput | Prisma.UserVocabularyEntryCreateManyCourseInput[];
    skipDuplicates?: boolean;
};
export type UserVocabularyEntryUpsertWithWhereUniqueWithoutCourseInput = {
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserVocabularyEntryUpdateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedUpdateWithoutCourseInput>;
    create: Prisma.XOR<Prisma.UserVocabularyEntryCreateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedCreateWithoutCourseInput>;
};
export type UserVocabularyEntryUpdateWithWhereUniqueWithoutCourseInput = {
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserVocabularyEntryUpdateWithoutCourseInput, Prisma.UserVocabularyEntryUncheckedUpdateWithoutCourseInput>;
};
export type UserVocabularyEntryUpdateManyWithWhereWithoutCourseInput = {
    where: Prisma.UserVocabularyEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.UserVocabularyEntryUpdateManyMutationInput, Prisma.UserVocabularyEntryUncheckedUpdateManyWithoutCourseInput>;
};
export type UserVocabularyEntryCreateManyUserInput = {
    id?: string;
    courseId?: string | null;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserVocabularyEntryUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneWithoutVocabularyEntriesNestedInput;
};
export type UserVocabularyEntryUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserVocabularyEntryUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserVocabularyEntryCreateManyCourseInput = {
    id?: string;
    userId: string;
    word: string;
    translation: string;
    category?: $Enums.VocabularyCategory;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserVocabularyEntryUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutVocabularyEntriesNestedInput;
};
export type UserVocabularyEntryUncheckedUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserVocabularyEntryUncheckedUpdateManyWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    word?: Prisma.StringFieldUpdateOperationsInput | string;
    translation?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumVocabularyCategoryFieldUpdateOperationsInput | $Enums.VocabularyCategory;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserVocabularyEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    word?: boolean;
    translation?: boolean;
    category?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.UserVocabularyEntry$courseArgs<ExtArgs>;
}, ExtArgs["result"]["userVocabularyEntry"]>;
export type UserVocabularyEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    word?: boolean;
    translation?: boolean;
    category?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.UserVocabularyEntry$courseArgs<ExtArgs>;
}, ExtArgs["result"]["userVocabularyEntry"]>;
export type UserVocabularyEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    word?: boolean;
    translation?: boolean;
    category?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.UserVocabularyEntry$courseArgs<ExtArgs>;
}, ExtArgs["result"]["userVocabularyEntry"]>;
export type UserVocabularyEntrySelectScalar = {
    id?: boolean;
    userId?: boolean;
    courseId?: boolean;
    word?: boolean;
    translation?: boolean;
    category?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserVocabularyEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "courseId" | "word" | "translation" | "category" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["userVocabularyEntry"]>;
export type UserVocabularyEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.UserVocabularyEntry$courseArgs<ExtArgs>;
};
export type UserVocabularyEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.UserVocabularyEntry$courseArgs<ExtArgs>;
};
export type UserVocabularyEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    course?: boolean | Prisma.UserVocabularyEntry$courseArgs<ExtArgs>;
};
export type $UserVocabularyEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserVocabularyEntry";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        course: Prisma.$CoursePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        courseId: string | null;
        word: string;
        translation: string;
        category: $Enums.VocabularyCategory;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["userVocabularyEntry"]>;
    composites: {};
};
export type UserVocabularyEntryGetPayload<S extends boolean | null | undefined | UserVocabularyEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload, S>;
export type UserVocabularyEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserVocabularyEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserVocabularyEntryCountAggregateInputType | true;
};
export interface UserVocabularyEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserVocabularyEntry'];
        meta: {
            name: 'UserVocabularyEntry';
        };
    };
    findUnique<T extends UserVocabularyEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserVocabularyEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserVocabularyEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, UserVocabularyEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserVocabularyEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserVocabularyEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserVocabularyEntryFindManyArgs>(args?: Prisma.SelectSubset<T, UserVocabularyEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserVocabularyEntryCreateArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryCreateArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserVocabularyEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, UserVocabularyEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserVocabularyEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserVocabularyEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserVocabularyEntryDeleteArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserVocabularyEntryUpdateArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserVocabularyEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserVocabularyEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserVocabularyEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserVocabularyEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserVocabularyEntryUpsertArgs>(args: Prisma.SelectSubset<T, UserVocabularyEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__UserVocabularyEntryClient<runtime.Types.Result.GetResult<Prisma.$UserVocabularyEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserVocabularyEntryCountArgs>(args?: Prisma.Subset<T, UserVocabularyEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserVocabularyEntryCountAggregateOutputType> : number>;
    aggregate<T extends UserVocabularyEntryAggregateArgs>(args: Prisma.Subset<T, UserVocabularyEntryAggregateArgs>): Prisma.PrismaPromise<GetUserVocabularyEntryAggregateType<T>>;
    groupBy<T extends UserVocabularyEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserVocabularyEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: UserVocabularyEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserVocabularyEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserVocabularyEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserVocabularyEntryFieldRefs;
}
export interface Prisma__UserVocabularyEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    course<T extends Prisma.UserVocabularyEntry$courseArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserVocabularyEntry$courseArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserVocabularyEntryFieldRefs {
    readonly id: Prisma.FieldRef<"UserVocabularyEntry", 'String'>;
    readonly userId: Prisma.FieldRef<"UserVocabularyEntry", 'String'>;
    readonly courseId: Prisma.FieldRef<"UserVocabularyEntry", 'String'>;
    readonly word: Prisma.FieldRef<"UserVocabularyEntry", 'String'>;
    readonly translation: Prisma.FieldRef<"UserVocabularyEntry", 'String'>;
    readonly category: Prisma.FieldRef<"UserVocabularyEntry", 'VocabularyCategory'>;
    readonly notes: Prisma.FieldRef<"UserVocabularyEntry", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserVocabularyEntry", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"UserVocabularyEntry", 'DateTime'>;
}
export type UserVocabularyEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
};
export type UserVocabularyEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
};
export type UserVocabularyEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    where?: Prisma.UserVocabularyEntryWhereInput;
    orderBy?: Prisma.UserVocabularyEntryOrderByWithRelationInput | Prisma.UserVocabularyEntryOrderByWithRelationInput[];
    cursor?: Prisma.UserVocabularyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserVocabularyEntryScalarFieldEnum | Prisma.UserVocabularyEntryScalarFieldEnum[];
};
export type UserVocabularyEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    where?: Prisma.UserVocabularyEntryWhereInput;
    orderBy?: Prisma.UserVocabularyEntryOrderByWithRelationInput | Prisma.UserVocabularyEntryOrderByWithRelationInput[];
    cursor?: Prisma.UserVocabularyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserVocabularyEntryScalarFieldEnum | Prisma.UserVocabularyEntryScalarFieldEnum[];
};
export type UserVocabularyEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    where?: Prisma.UserVocabularyEntryWhereInput;
    orderBy?: Prisma.UserVocabularyEntryOrderByWithRelationInput | Prisma.UserVocabularyEntryOrderByWithRelationInput[];
    cursor?: Prisma.UserVocabularyEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserVocabularyEntryScalarFieldEnum | Prisma.UserVocabularyEntryScalarFieldEnum[];
};
export type UserVocabularyEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserVocabularyEntryCreateInput, Prisma.UserVocabularyEntryUncheckedCreateInput>;
};
export type UserVocabularyEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserVocabularyEntryCreateManyInput | Prisma.UserVocabularyEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserVocabularyEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    data: Prisma.UserVocabularyEntryCreateManyInput | Prisma.UserVocabularyEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserVocabularyEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserVocabularyEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserVocabularyEntryUpdateInput, Prisma.UserVocabularyEntryUncheckedUpdateInput>;
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
};
export type UserVocabularyEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserVocabularyEntryUpdateManyMutationInput, Prisma.UserVocabularyEntryUncheckedUpdateManyInput>;
    where?: Prisma.UserVocabularyEntryWhereInput;
    limit?: number;
};
export type UserVocabularyEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserVocabularyEntryUpdateManyMutationInput, Prisma.UserVocabularyEntryUncheckedUpdateManyInput>;
    where?: Prisma.UserVocabularyEntryWhereInput;
    limit?: number;
    include?: Prisma.UserVocabularyEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserVocabularyEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserVocabularyEntryCreateInput, Prisma.UserVocabularyEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserVocabularyEntryUpdateInput, Prisma.UserVocabularyEntryUncheckedUpdateInput>;
};
export type UserVocabularyEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
    where: Prisma.UserVocabularyEntryWhereUniqueInput;
};
export type UserVocabularyEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserVocabularyEntryWhereInput;
    limit?: number;
};
export type UserVocabularyEntry$courseArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourseSelect<ExtArgs> | null;
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where?: Prisma.CourseWhereInput;
};
export type UserVocabularyEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserVocabularyEntrySelect<ExtArgs> | null;
    omit?: Prisma.UserVocabularyEntryOmit<ExtArgs> | null;
    include?: Prisma.UserVocabularyEntryInclude<ExtArgs> | null;
};
export {};
