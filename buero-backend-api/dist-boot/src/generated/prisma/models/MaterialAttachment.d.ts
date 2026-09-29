import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type MaterialAttachmentModel = runtime.Types.Result.DefaultSelection<Prisma.$MaterialAttachmentPayload>;
export type AggregateMaterialAttachment = {
    _count: MaterialAttachmentCountAggregateOutputType | null;
    _avg: MaterialAttachmentAvgAggregateOutputType | null;
    _sum: MaterialAttachmentSumAggregateOutputType | null;
    _min: MaterialAttachmentMinAggregateOutputType | null;
    _max: MaterialAttachmentMaxAggregateOutputType | null;
};
export type MaterialAttachmentAvgAggregateOutputType = {
    sizeBytes: number | null;
    orderIndex: number | null;
};
export type MaterialAttachmentSumAggregateOutputType = {
    sizeBytes: number | null;
    orderIndex: number | null;
};
export type MaterialAttachmentMinAggregateOutputType = {
    id: string | null;
    materialId: string | null;
    kind: $Enums.AttachmentKind | null;
    title: string | null;
    url: string | null;
    fileName: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    storageKey: string | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MaterialAttachmentMaxAggregateOutputType = {
    id: string | null;
    materialId: string | null;
    kind: $Enums.AttachmentKind | null;
    title: string | null;
    url: string | null;
    fileName: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    storageKey: string | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MaterialAttachmentCountAggregateOutputType = {
    id: number;
    materialId: number;
    kind: number;
    title: number;
    url: number;
    fileName: number;
    mimeType: number;
    sizeBytes: number;
    storageKey: number;
    orderIndex: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MaterialAttachmentAvgAggregateInputType = {
    sizeBytes?: true;
    orderIndex?: true;
};
export type MaterialAttachmentSumAggregateInputType = {
    sizeBytes?: true;
    orderIndex?: true;
};
export type MaterialAttachmentMinAggregateInputType = {
    id?: true;
    materialId?: true;
    kind?: true;
    title?: true;
    url?: true;
    fileName?: true;
    mimeType?: true;
    sizeBytes?: true;
    storageKey?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MaterialAttachmentMaxAggregateInputType = {
    id?: true;
    materialId?: true;
    kind?: true;
    title?: true;
    url?: true;
    fileName?: true;
    mimeType?: true;
    sizeBytes?: true;
    storageKey?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MaterialAttachmentCountAggregateInputType = {
    id?: true;
    materialId?: true;
    kind?: true;
    title?: true;
    url?: true;
    fileName?: true;
    mimeType?: true;
    sizeBytes?: true;
    storageKey?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MaterialAttachmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MaterialAttachmentWhereInput;
    orderBy?: Prisma.MaterialAttachmentOrderByWithRelationInput | Prisma.MaterialAttachmentOrderByWithRelationInput[];
    cursor?: Prisma.MaterialAttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MaterialAttachmentCountAggregateInputType;
    _avg?: MaterialAttachmentAvgAggregateInputType;
    _sum?: MaterialAttachmentSumAggregateInputType;
    _min?: MaterialAttachmentMinAggregateInputType;
    _max?: MaterialAttachmentMaxAggregateInputType;
};
export type GetMaterialAttachmentAggregateType<T extends MaterialAttachmentAggregateArgs> = {
    [P in keyof T & keyof AggregateMaterialAttachment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMaterialAttachment[P]> : Prisma.GetScalarType<T[P], AggregateMaterialAttachment[P]>;
};
export type MaterialAttachmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MaterialAttachmentWhereInput;
    orderBy?: Prisma.MaterialAttachmentOrderByWithAggregationInput | Prisma.MaterialAttachmentOrderByWithAggregationInput[];
    by: Prisma.MaterialAttachmentScalarFieldEnum[] | Prisma.MaterialAttachmentScalarFieldEnum;
    having?: Prisma.MaterialAttachmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MaterialAttachmentCountAggregateInputType | true;
    _avg?: MaterialAttachmentAvgAggregateInputType;
    _sum?: MaterialAttachmentSumAggregateInputType;
    _min?: MaterialAttachmentMinAggregateInputType;
    _max?: MaterialAttachmentMaxAggregateInputType;
};
export type MaterialAttachmentGroupByOutputType = {
    id: string;
    materialId: string;
    kind: $Enums.AttachmentKind;
    title: string;
    url: string;
    fileName: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    storageKey: string | null;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
    _count: MaterialAttachmentCountAggregateOutputType | null;
    _avg: MaterialAttachmentAvgAggregateOutputType | null;
    _sum: MaterialAttachmentSumAggregateOutputType | null;
    _min: MaterialAttachmentMinAggregateOutputType | null;
    _max: MaterialAttachmentMaxAggregateOutputType | null;
};
type GetMaterialAttachmentGroupByPayload<T extends MaterialAttachmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MaterialAttachmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MaterialAttachmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MaterialAttachmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MaterialAttachmentGroupByOutputType[P]>;
}>>;
export type MaterialAttachmentWhereInput = {
    AND?: Prisma.MaterialAttachmentWhereInput | Prisma.MaterialAttachmentWhereInput[];
    OR?: Prisma.MaterialAttachmentWhereInput[];
    NOT?: Prisma.MaterialAttachmentWhereInput | Prisma.MaterialAttachmentWhereInput[];
    id?: Prisma.StringFilter<"MaterialAttachment"> | string;
    materialId?: Prisma.StringFilter<"MaterialAttachment"> | string;
    kind?: Prisma.EnumAttachmentKindFilter<"MaterialAttachment"> | $Enums.AttachmentKind;
    title?: Prisma.StringFilter<"MaterialAttachment"> | string;
    url?: Prisma.StringFilter<"MaterialAttachment"> | string;
    fileName?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    mimeType?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    sizeBytes?: Prisma.IntNullableFilter<"MaterialAttachment"> | number | null;
    storageKey?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    orderIndex?: Prisma.IntFilter<"MaterialAttachment"> | number;
    createdAt?: Prisma.DateTimeFilter<"MaterialAttachment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MaterialAttachment"> | Date | string;
    material?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
};
export type MaterialAttachmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    fileName?: Prisma.SortOrderInput | Prisma.SortOrder;
    mimeType?: Prisma.SortOrderInput | Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrderInput | Prisma.SortOrder;
    storageKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    material?: Prisma.CourseMaterialOrderByWithRelationInput;
};
export type MaterialAttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MaterialAttachmentWhereInput | Prisma.MaterialAttachmentWhereInput[];
    OR?: Prisma.MaterialAttachmentWhereInput[];
    NOT?: Prisma.MaterialAttachmentWhereInput | Prisma.MaterialAttachmentWhereInput[];
    materialId?: Prisma.StringFilter<"MaterialAttachment"> | string;
    kind?: Prisma.EnumAttachmentKindFilter<"MaterialAttachment"> | $Enums.AttachmentKind;
    title?: Prisma.StringFilter<"MaterialAttachment"> | string;
    url?: Prisma.StringFilter<"MaterialAttachment"> | string;
    fileName?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    mimeType?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    sizeBytes?: Prisma.IntNullableFilter<"MaterialAttachment"> | number | null;
    storageKey?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    orderIndex?: Prisma.IntFilter<"MaterialAttachment"> | number;
    createdAt?: Prisma.DateTimeFilter<"MaterialAttachment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MaterialAttachment"> | Date | string;
    material?: Prisma.XOR<Prisma.CourseMaterialScalarRelationFilter, Prisma.CourseMaterialWhereInput>;
}, "id">;
export type MaterialAttachmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    fileName?: Prisma.SortOrderInput | Prisma.SortOrder;
    mimeType?: Prisma.SortOrderInput | Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrderInput | Prisma.SortOrder;
    storageKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MaterialAttachmentCountOrderByAggregateInput;
    _avg?: Prisma.MaterialAttachmentAvgOrderByAggregateInput;
    _max?: Prisma.MaterialAttachmentMaxOrderByAggregateInput;
    _min?: Prisma.MaterialAttachmentMinOrderByAggregateInput;
    _sum?: Prisma.MaterialAttachmentSumOrderByAggregateInput;
};
export type MaterialAttachmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.MaterialAttachmentScalarWhereWithAggregatesInput | Prisma.MaterialAttachmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.MaterialAttachmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MaterialAttachmentScalarWhereWithAggregatesInput | Prisma.MaterialAttachmentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MaterialAttachment"> | string;
    materialId?: Prisma.StringWithAggregatesFilter<"MaterialAttachment"> | string;
    kind?: Prisma.EnumAttachmentKindWithAggregatesFilter<"MaterialAttachment"> | $Enums.AttachmentKind;
    title?: Prisma.StringWithAggregatesFilter<"MaterialAttachment"> | string;
    url?: Prisma.StringWithAggregatesFilter<"MaterialAttachment"> | string;
    fileName?: Prisma.StringNullableWithAggregatesFilter<"MaterialAttachment"> | string | null;
    mimeType?: Prisma.StringNullableWithAggregatesFilter<"MaterialAttachment"> | string | null;
    sizeBytes?: Prisma.IntNullableWithAggregatesFilter<"MaterialAttachment"> | number | null;
    storageKey?: Prisma.StringNullableWithAggregatesFilter<"MaterialAttachment"> | string | null;
    orderIndex?: Prisma.IntWithAggregatesFilter<"MaterialAttachment"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MaterialAttachment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"MaterialAttachment"> | Date | string;
};
export type MaterialAttachmentCreateInput = {
    id?: string;
    kind: $Enums.AttachmentKind;
    title: string;
    url: string;
    fileName?: string | null;
    mimeType?: string | null;
    sizeBytes?: number | null;
    storageKey?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    material: Prisma.CourseMaterialCreateNestedOneWithoutAttachmentsInput;
};
export type MaterialAttachmentUncheckedCreateInput = {
    id?: string;
    materialId: string;
    kind: $Enums.AttachmentKind;
    title: string;
    url: string;
    fileName?: string | null;
    mimeType?: string | null;
    sizeBytes?: number | null;
    storageKey?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MaterialAttachmentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumAttachmentKindFieldUpdateOperationsInput | $Enums.AttachmentKind;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    storageKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    material?: Prisma.CourseMaterialUpdateOneRequiredWithoutAttachmentsNestedInput;
};
export type MaterialAttachmentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    materialId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumAttachmentKindFieldUpdateOperationsInput | $Enums.AttachmentKind;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    storageKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MaterialAttachmentCreateManyInput = {
    id?: string;
    materialId: string;
    kind: $Enums.AttachmentKind;
    title: string;
    url: string;
    fileName?: string | null;
    mimeType?: string | null;
    sizeBytes?: number | null;
    storageKey?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MaterialAttachmentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumAttachmentKindFieldUpdateOperationsInput | $Enums.AttachmentKind;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    storageKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MaterialAttachmentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    materialId?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumAttachmentKindFieldUpdateOperationsInput | $Enums.AttachmentKind;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    storageKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MaterialAttachmentListRelationFilter = {
    every?: Prisma.MaterialAttachmentWhereInput;
    some?: Prisma.MaterialAttachmentWhereInput;
    none?: Prisma.MaterialAttachmentWhereInput;
};
export type MaterialAttachmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MaterialAttachmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MaterialAttachmentAvgOrderByAggregateInput = {
    sizeBytes?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
};
export type MaterialAttachmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MaterialAttachmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    materialId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MaterialAttachmentSumOrderByAggregateInput = {
    sizeBytes?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
};
export type MaterialAttachmentCreateNestedManyWithoutMaterialInput = {
    create?: Prisma.XOR<Prisma.MaterialAttachmentCreateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput> | Prisma.MaterialAttachmentCreateWithoutMaterialInput[] | Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput | Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput[];
    createMany?: Prisma.MaterialAttachmentCreateManyMaterialInputEnvelope;
    connect?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
};
export type MaterialAttachmentUncheckedCreateNestedManyWithoutMaterialInput = {
    create?: Prisma.XOR<Prisma.MaterialAttachmentCreateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput> | Prisma.MaterialAttachmentCreateWithoutMaterialInput[] | Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput | Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput[];
    createMany?: Prisma.MaterialAttachmentCreateManyMaterialInputEnvelope;
    connect?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
};
export type MaterialAttachmentUpdateManyWithoutMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.MaterialAttachmentCreateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput> | Prisma.MaterialAttachmentCreateWithoutMaterialInput[] | Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput | Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput[];
    upsert?: Prisma.MaterialAttachmentUpsertWithWhereUniqueWithoutMaterialInput | Prisma.MaterialAttachmentUpsertWithWhereUniqueWithoutMaterialInput[];
    createMany?: Prisma.MaterialAttachmentCreateManyMaterialInputEnvelope;
    set?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    disconnect?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    delete?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    connect?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    update?: Prisma.MaterialAttachmentUpdateWithWhereUniqueWithoutMaterialInput | Prisma.MaterialAttachmentUpdateWithWhereUniqueWithoutMaterialInput[];
    updateMany?: Prisma.MaterialAttachmentUpdateManyWithWhereWithoutMaterialInput | Prisma.MaterialAttachmentUpdateManyWithWhereWithoutMaterialInput[];
    deleteMany?: Prisma.MaterialAttachmentScalarWhereInput | Prisma.MaterialAttachmentScalarWhereInput[];
};
export type MaterialAttachmentUncheckedUpdateManyWithoutMaterialNestedInput = {
    create?: Prisma.XOR<Prisma.MaterialAttachmentCreateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput> | Prisma.MaterialAttachmentCreateWithoutMaterialInput[] | Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput[];
    connectOrCreate?: Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput | Prisma.MaterialAttachmentCreateOrConnectWithoutMaterialInput[];
    upsert?: Prisma.MaterialAttachmentUpsertWithWhereUniqueWithoutMaterialInput | Prisma.MaterialAttachmentUpsertWithWhereUniqueWithoutMaterialInput[];
    createMany?: Prisma.MaterialAttachmentCreateManyMaterialInputEnvelope;
    set?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    disconnect?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    delete?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    connect?: Prisma.MaterialAttachmentWhereUniqueInput | Prisma.MaterialAttachmentWhereUniqueInput[];
    update?: Prisma.MaterialAttachmentUpdateWithWhereUniqueWithoutMaterialInput | Prisma.MaterialAttachmentUpdateWithWhereUniqueWithoutMaterialInput[];
    updateMany?: Prisma.MaterialAttachmentUpdateManyWithWhereWithoutMaterialInput | Prisma.MaterialAttachmentUpdateManyWithWhereWithoutMaterialInput[];
    deleteMany?: Prisma.MaterialAttachmentScalarWhereInput | Prisma.MaterialAttachmentScalarWhereInput[];
};
export type EnumAttachmentKindFieldUpdateOperationsInput = {
    set?: $Enums.AttachmentKind;
};
export type MaterialAttachmentCreateWithoutMaterialInput = {
    id?: string;
    kind: $Enums.AttachmentKind;
    title: string;
    url: string;
    fileName?: string | null;
    mimeType?: string | null;
    sizeBytes?: number | null;
    storageKey?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MaterialAttachmentUncheckedCreateWithoutMaterialInput = {
    id?: string;
    kind: $Enums.AttachmentKind;
    title: string;
    url: string;
    fileName?: string | null;
    mimeType?: string | null;
    sizeBytes?: number | null;
    storageKey?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MaterialAttachmentCreateOrConnectWithoutMaterialInput = {
    where: Prisma.MaterialAttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MaterialAttachmentCreateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput>;
};
export type MaterialAttachmentCreateManyMaterialInputEnvelope = {
    data: Prisma.MaterialAttachmentCreateManyMaterialInput | Prisma.MaterialAttachmentCreateManyMaterialInput[];
    skipDuplicates?: boolean;
};
export type MaterialAttachmentUpsertWithWhereUniqueWithoutMaterialInput = {
    where: Prisma.MaterialAttachmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.MaterialAttachmentUpdateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedUpdateWithoutMaterialInput>;
    create: Prisma.XOR<Prisma.MaterialAttachmentCreateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedCreateWithoutMaterialInput>;
};
export type MaterialAttachmentUpdateWithWhereUniqueWithoutMaterialInput = {
    where: Prisma.MaterialAttachmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.MaterialAttachmentUpdateWithoutMaterialInput, Prisma.MaterialAttachmentUncheckedUpdateWithoutMaterialInput>;
};
export type MaterialAttachmentUpdateManyWithWhereWithoutMaterialInput = {
    where: Prisma.MaterialAttachmentScalarWhereInput;
    data: Prisma.XOR<Prisma.MaterialAttachmentUpdateManyMutationInput, Prisma.MaterialAttachmentUncheckedUpdateManyWithoutMaterialInput>;
};
export type MaterialAttachmentScalarWhereInput = {
    AND?: Prisma.MaterialAttachmentScalarWhereInput | Prisma.MaterialAttachmentScalarWhereInput[];
    OR?: Prisma.MaterialAttachmentScalarWhereInput[];
    NOT?: Prisma.MaterialAttachmentScalarWhereInput | Prisma.MaterialAttachmentScalarWhereInput[];
    id?: Prisma.StringFilter<"MaterialAttachment"> | string;
    materialId?: Prisma.StringFilter<"MaterialAttachment"> | string;
    kind?: Prisma.EnumAttachmentKindFilter<"MaterialAttachment"> | $Enums.AttachmentKind;
    title?: Prisma.StringFilter<"MaterialAttachment"> | string;
    url?: Prisma.StringFilter<"MaterialAttachment"> | string;
    fileName?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    mimeType?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    sizeBytes?: Prisma.IntNullableFilter<"MaterialAttachment"> | number | null;
    storageKey?: Prisma.StringNullableFilter<"MaterialAttachment"> | string | null;
    orderIndex?: Prisma.IntFilter<"MaterialAttachment"> | number;
    createdAt?: Prisma.DateTimeFilter<"MaterialAttachment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MaterialAttachment"> | Date | string;
};
export type MaterialAttachmentCreateManyMaterialInput = {
    id?: string;
    kind: $Enums.AttachmentKind;
    title: string;
    url: string;
    fileName?: string | null;
    mimeType?: string | null;
    sizeBytes?: number | null;
    storageKey?: string | null;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MaterialAttachmentUpdateWithoutMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumAttachmentKindFieldUpdateOperationsInput | $Enums.AttachmentKind;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    storageKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MaterialAttachmentUncheckedUpdateWithoutMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumAttachmentKindFieldUpdateOperationsInput | $Enums.AttachmentKind;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    storageKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MaterialAttachmentUncheckedUpdateManyWithoutMaterialInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumAttachmentKindFieldUpdateOperationsInput | $Enums.AttachmentKind;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    storageKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MaterialAttachmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    materialId?: boolean;
    kind?: boolean;
    title?: boolean;
    url?: boolean;
    fileName?: boolean;
    mimeType?: boolean;
    sizeBytes?: boolean;
    storageKey?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["materialAttachment"]>;
export type MaterialAttachmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    materialId?: boolean;
    kind?: boolean;
    title?: boolean;
    url?: boolean;
    fileName?: boolean;
    mimeType?: boolean;
    sizeBytes?: boolean;
    storageKey?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["materialAttachment"]>;
export type MaterialAttachmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    materialId?: boolean;
    kind?: boolean;
    title?: boolean;
    url?: boolean;
    fileName?: boolean;
    mimeType?: boolean;
    sizeBytes?: boolean;
    storageKey?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["materialAttachment"]>;
export type MaterialAttachmentSelectScalar = {
    id?: boolean;
    materialId?: boolean;
    kind?: boolean;
    title?: boolean;
    url?: boolean;
    fileName?: boolean;
    mimeType?: boolean;
    sizeBytes?: boolean;
    storageKey?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MaterialAttachmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "materialId" | "kind" | "title" | "url" | "fileName" | "mimeType" | "sizeBytes" | "storageKey" | "orderIndex" | "createdAt" | "updatedAt", ExtArgs["result"]["materialAttachment"]>;
export type MaterialAttachmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type MaterialAttachmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type MaterialAttachmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    material?: boolean | Prisma.CourseMaterialDefaultArgs<ExtArgs>;
};
export type $MaterialAttachmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MaterialAttachment";
    objects: {
        material: Prisma.$CourseMaterialPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        materialId: string;
        kind: $Enums.AttachmentKind;
        title: string;
        url: string;
        fileName: string | null;
        mimeType: string | null;
        sizeBytes: number | null;
        storageKey: string | null;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["materialAttachment"]>;
    composites: {};
};
export type MaterialAttachmentGetPayload<S extends boolean | null | undefined | MaterialAttachmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload, S>;
export type MaterialAttachmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MaterialAttachmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MaterialAttachmentCountAggregateInputType | true;
};
export interface MaterialAttachmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MaterialAttachment'];
        meta: {
            name: 'MaterialAttachment';
        };
    };
    findUnique<T extends MaterialAttachmentFindUniqueArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MaterialAttachmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MaterialAttachmentFindFirstArgs>(args?: Prisma.SelectSubset<T, MaterialAttachmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MaterialAttachmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MaterialAttachmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MaterialAttachmentFindManyArgs>(args?: Prisma.SelectSubset<T, MaterialAttachmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MaterialAttachmentCreateArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentCreateArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MaterialAttachmentCreateManyArgs>(args?: Prisma.SelectSubset<T, MaterialAttachmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MaterialAttachmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MaterialAttachmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MaterialAttachmentDeleteArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentDeleteArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MaterialAttachmentUpdateArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentUpdateArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MaterialAttachmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, MaterialAttachmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MaterialAttachmentUpdateManyArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MaterialAttachmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MaterialAttachmentUpsertArgs>(args: Prisma.SelectSubset<T, MaterialAttachmentUpsertArgs<ExtArgs>>): Prisma.Prisma__MaterialAttachmentClient<runtime.Types.Result.GetResult<Prisma.$MaterialAttachmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MaterialAttachmentCountArgs>(args?: Prisma.Subset<T, MaterialAttachmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MaterialAttachmentCountAggregateOutputType> : number>;
    aggregate<T extends MaterialAttachmentAggregateArgs>(args: Prisma.Subset<T, MaterialAttachmentAggregateArgs>): Prisma.PrismaPromise<GetMaterialAttachmentAggregateType<T>>;
    groupBy<T extends MaterialAttachmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MaterialAttachmentGroupByArgs['orderBy'];
    } : {
        orderBy?: MaterialAttachmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MaterialAttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaterialAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MaterialAttachmentFieldRefs;
}
export interface Prisma__MaterialAttachmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    material<T extends Prisma.CourseMaterialDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseMaterialDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseMaterialClient<runtime.Types.Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MaterialAttachmentFieldRefs {
    readonly id: Prisma.FieldRef<"MaterialAttachment", 'String'>;
    readonly materialId: Prisma.FieldRef<"MaterialAttachment", 'String'>;
    readonly kind: Prisma.FieldRef<"MaterialAttachment", 'AttachmentKind'>;
    readonly title: Prisma.FieldRef<"MaterialAttachment", 'String'>;
    readonly url: Prisma.FieldRef<"MaterialAttachment", 'String'>;
    readonly fileName: Prisma.FieldRef<"MaterialAttachment", 'String'>;
    readonly mimeType: Prisma.FieldRef<"MaterialAttachment", 'String'>;
    readonly sizeBytes: Prisma.FieldRef<"MaterialAttachment", 'Int'>;
    readonly storageKey: Prisma.FieldRef<"MaterialAttachment", 'String'>;
    readonly orderIndex: Prisma.FieldRef<"MaterialAttachment", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"MaterialAttachment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"MaterialAttachment", 'DateTime'>;
}
export type MaterialAttachmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
    where: Prisma.MaterialAttachmentWhereUniqueInput;
};
export type MaterialAttachmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
    where: Prisma.MaterialAttachmentWhereUniqueInput;
};
export type MaterialAttachmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MaterialAttachmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MaterialAttachmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MaterialAttachmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MaterialAttachmentCreateInput, Prisma.MaterialAttachmentUncheckedCreateInput>;
};
export type MaterialAttachmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MaterialAttachmentCreateManyInput | Prisma.MaterialAttachmentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MaterialAttachmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    data: Prisma.MaterialAttachmentCreateManyInput | Prisma.MaterialAttachmentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MaterialAttachmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MaterialAttachmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MaterialAttachmentUpdateInput, Prisma.MaterialAttachmentUncheckedUpdateInput>;
    where: Prisma.MaterialAttachmentWhereUniqueInput;
};
export type MaterialAttachmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MaterialAttachmentUpdateManyMutationInput, Prisma.MaterialAttachmentUncheckedUpdateManyInput>;
    where?: Prisma.MaterialAttachmentWhereInput;
    limit?: number;
};
export type MaterialAttachmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MaterialAttachmentUpdateManyMutationInput, Prisma.MaterialAttachmentUncheckedUpdateManyInput>;
    where?: Prisma.MaterialAttachmentWhereInput;
    limit?: number;
    include?: Prisma.MaterialAttachmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MaterialAttachmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
    where: Prisma.MaterialAttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MaterialAttachmentCreateInput, Prisma.MaterialAttachmentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MaterialAttachmentUpdateInput, Prisma.MaterialAttachmentUncheckedUpdateInput>;
};
export type MaterialAttachmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
    where: Prisma.MaterialAttachmentWhereUniqueInput;
};
export type MaterialAttachmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MaterialAttachmentWhereInput;
    limit?: number;
};
export type MaterialAttachmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MaterialAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.MaterialAttachmentOmit<ExtArgs> | null;
    include?: Prisma.MaterialAttachmentInclude<ExtArgs> | null;
};
export {};
