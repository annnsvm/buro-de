import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PlacementResultModel = runtime.Types.Result.DefaultSelection<Prisma.$PlacementResultPayload>;
export type AggregatePlacementResult = {
    _count: PlacementResultCountAggregateOutputType | null;
    _avg: PlacementResultAvgAggregateOutputType | null;
    _sum: PlacementResultSumAggregateOutputType | null;
    _min: PlacementResultMinAggregateOutputType | null;
    _max: PlacementResultMaxAggregateOutputType | null;
};
export type PlacementResultAvgAggregateOutputType = {
    rawScore: number | null;
};
export type PlacementResultSumAggregateOutputType = {
    rawScore: number | null;
};
export type PlacementResultMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    level: $Enums.Level | null;
    rawScore: number | null;
    completedAt: Date | null;
};
export type PlacementResultMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    level: $Enums.Level | null;
    rawScore: number | null;
    completedAt: Date | null;
};
export type PlacementResultCountAggregateOutputType = {
    id: number;
    userId: number;
    level: number;
    rawScore: number;
    completedAt: number;
    _all: number;
};
export type PlacementResultAvgAggregateInputType = {
    rawScore?: true;
};
export type PlacementResultSumAggregateInputType = {
    rawScore?: true;
};
export type PlacementResultMinAggregateInputType = {
    id?: true;
    userId?: true;
    level?: true;
    rawScore?: true;
    completedAt?: true;
};
export type PlacementResultMaxAggregateInputType = {
    id?: true;
    userId?: true;
    level?: true;
    rawScore?: true;
    completedAt?: true;
};
export type PlacementResultCountAggregateInputType = {
    id?: true;
    userId?: true;
    level?: true;
    rawScore?: true;
    completedAt?: true;
    _all?: true;
};
export type PlacementResultAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlacementResultWhereInput;
    orderBy?: Prisma.PlacementResultOrderByWithRelationInput | Prisma.PlacementResultOrderByWithRelationInput[];
    cursor?: Prisma.PlacementResultWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlacementResultCountAggregateInputType;
    _avg?: PlacementResultAvgAggregateInputType;
    _sum?: PlacementResultSumAggregateInputType;
    _min?: PlacementResultMinAggregateInputType;
    _max?: PlacementResultMaxAggregateInputType;
};
export type GetPlacementResultAggregateType<T extends PlacementResultAggregateArgs> = {
    [P in keyof T & keyof AggregatePlacementResult]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlacementResult[P]> : Prisma.GetScalarType<T[P], AggregatePlacementResult[P]>;
};
export type PlacementResultGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlacementResultWhereInput;
    orderBy?: Prisma.PlacementResultOrderByWithAggregationInput | Prisma.PlacementResultOrderByWithAggregationInput[];
    by: Prisma.PlacementResultScalarFieldEnum[] | Prisma.PlacementResultScalarFieldEnum;
    having?: Prisma.PlacementResultScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlacementResultCountAggregateInputType | true;
    _avg?: PlacementResultAvgAggregateInputType;
    _sum?: PlacementResultSumAggregateInputType;
    _min?: PlacementResultMinAggregateInputType;
    _max?: PlacementResultMaxAggregateInputType;
};
export type PlacementResultGroupByOutputType = {
    id: string;
    userId: string;
    level: $Enums.Level;
    rawScore: number | null;
    completedAt: Date;
    _count: PlacementResultCountAggregateOutputType | null;
    _avg: PlacementResultAvgAggregateOutputType | null;
    _sum: PlacementResultSumAggregateOutputType | null;
    _min: PlacementResultMinAggregateOutputType | null;
    _max: PlacementResultMaxAggregateOutputType | null;
};
type GetPlacementResultGroupByPayload<T extends PlacementResultGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlacementResultGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlacementResultGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlacementResultGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlacementResultGroupByOutputType[P]>;
}>>;
export type PlacementResultWhereInput = {
    AND?: Prisma.PlacementResultWhereInput | Prisma.PlacementResultWhereInput[];
    OR?: Prisma.PlacementResultWhereInput[];
    NOT?: Prisma.PlacementResultWhereInput | Prisma.PlacementResultWhereInput[];
    id?: Prisma.StringFilter<"PlacementResult"> | string;
    userId?: Prisma.StringFilter<"PlacementResult"> | string;
    level?: Prisma.EnumLevelFilter<"PlacementResult"> | $Enums.Level;
    rawScore?: Prisma.IntNullableFilter<"PlacementResult"> | number | null;
    completedAt?: Prisma.DateTimeFilter<"PlacementResult"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PlacementResultOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    rawScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type PlacementResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PlacementResultWhereInput | Prisma.PlacementResultWhereInput[];
    OR?: Prisma.PlacementResultWhereInput[];
    NOT?: Prisma.PlacementResultWhereInput | Prisma.PlacementResultWhereInput[];
    userId?: Prisma.StringFilter<"PlacementResult"> | string;
    level?: Prisma.EnumLevelFilter<"PlacementResult"> | $Enums.Level;
    rawScore?: Prisma.IntNullableFilter<"PlacementResult"> | number | null;
    completedAt?: Prisma.DateTimeFilter<"PlacementResult"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type PlacementResultOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    rawScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    _count?: Prisma.PlacementResultCountOrderByAggregateInput;
    _avg?: Prisma.PlacementResultAvgOrderByAggregateInput;
    _max?: Prisma.PlacementResultMaxOrderByAggregateInput;
    _min?: Prisma.PlacementResultMinOrderByAggregateInput;
    _sum?: Prisma.PlacementResultSumOrderByAggregateInput;
};
export type PlacementResultScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlacementResultScalarWhereWithAggregatesInput | Prisma.PlacementResultScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlacementResultScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlacementResultScalarWhereWithAggregatesInput | Prisma.PlacementResultScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PlacementResult"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"PlacementResult"> | string;
    level?: Prisma.EnumLevelWithAggregatesFilter<"PlacementResult"> | $Enums.Level;
    rawScore?: Prisma.IntNullableWithAggregatesFilter<"PlacementResult"> | number | null;
    completedAt?: Prisma.DateTimeWithAggregatesFilter<"PlacementResult"> | Date | string;
};
export type PlacementResultCreateInput = {
    id?: string;
    level: $Enums.Level;
    rawScore?: number | null;
    completedAt: Date | string;
    user: Prisma.UserCreateNestedOneWithoutPlacementResultsInput;
};
export type PlacementResultUncheckedCreateInput = {
    id?: string;
    userId: string;
    level: $Enums.Level;
    rawScore?: number | null;
    completedAt: Date | string;
};
export type PlacementResultUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level;
    rawScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPlacementResultsNestedInput;
};
export type PlacementResultUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level;
    rawScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementResultCreateManyInput = {
    id?: string;
    userId: string;
    level: $Enums.Level;
    rawScore?: number | null;
    completedAt: Date | string;
};
export type PlacementResultUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level;
    rawScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementResultUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level;
    rawScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementResultListRelationFilter = {
    every?: Prisma.PlacementResultWhereInput;
    some?: Prisma.PlacementResultWhereInput;
    none?: Prisma.PlacementResultWhereInput;
};
export type PlacementResultOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PlacementResultCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    rawScore?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type PlacementResultAvgOrderByAggregateInput = {
    rawScore?: Prisma.SortOrder;
};
export type PlacementResultMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    rawScore?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type PlacementResultMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    rawScore?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type PlacementResultSumOrderByAggregateInput = {
    rawScore?: Prisma.SortOrder;
};
export type PlacementResultCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PlacementResultCreateWithoutUserInput, Prisma.PlacementResultUncheckedCreateWithoutUserInput> | Prisma.PlacementResultCreateWithoutUserInput[] | Prisma.PlacementResultUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PlacementResultCreateOrConnectWithoutUserInput | Prisma.PlacementResultCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PlacementResultCreateManyUserInputEnvelope;
    connect?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
};
export type PlacementResultUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PlacementResultCreateWithoutUserInput, Prisma.PlacementResultUncheckedCreateWithoutUserInput> | Prisma.PlacementResultCreateWithoutUserInput[] | Prisma.PlacementResultUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PlacementResultCreateOrConnectWithoutUserInput | Prisma.PlacementResultCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PlacementResultCreateManyUserInputEnvelope;
    connect?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
};
export type PlacementResultUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PlacementResultCreateWithoutUserInput, Prisma.PlacementResultUncheckedCreateWithoutUserInput> | Prisma.PlacementResultCreateWithoutUserInput[] | Prisma.PlacementResultUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PlacementResultCreateOrConnectWithoutUserInput | Prisma.PlacementResultCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PlacementResultUpsertWithWhereUniqueWithoutUserInput | Prisma.PlacementResultUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PlacementResultCreateManyUserInputEnvelope;
    set?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    disconnect?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    delete?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    connect?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    update?: Prisma.PlacementResultUpdateWithWhereUniqueWithoutUserInput | Prisma.PlacementResultUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PlacementResultUpdateManyWithWhereWithoutUserInput | Prisma.PlacementResultUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PlacementResultScalarWhereInput | Prisma.PlacementResultScalarWhereInput[];
};
export type PlacementResultUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PlacementResultCreateWithoutUserInput, Prisma.PlacementResultUncheckedCreateWithoutUserInput> | Prisma.PlacementResultCreateWithoutUserInput[] | Prisma.PlacementResultUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PlacementResultCreateOrConnectWithoutUserInput | Prisma.PlacementResultCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PlacementResultUpsertWithWhereUniqueWithoutUserInput | Prisma.PlacementResultUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PlacementResultCreateManyUserInputEnvelope;
    set?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    disconnect?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    delete?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    connect?: Prisma.PlacementResultWhereUniqueInput | Prisma.PlacementResultWhereUniqueInput[];
    update?: Prisma.PlacementResultUpdateWithWhereUniqueWithoutUserInput | Prisma.PlacementResultUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PlacementResultUpdateManyWithWhereWithoutUserInput | Prisma.PlacementResultUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PlacementResultScalarWhereInput | Prisma.PlacementResultScalarWhereInput[];
};
export type EnumLevelFieldUpdateOperationsInput = {
    set?: $Enums.Level;
};
export type PlacementResultCreateWithoutUserInput = {
    id?: string;
    level: $Enums.Level;
    rawScore?: number | null;
    completedAt: Date | string;
};
export type PlacementResultUncheckedCreateWithoutUserInput = {
    id?: string;
    level: $Enums.Level;
    rawScore?: number | null;
    completedAt: Date | string;
};
export type PlacementResultCreateOrConnectWithoutUserInput = {
    where: Prisma.PlacementResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlacementResultCreateWithoutUserInput, Prisma.PlacementResultUncheckedCreateWithoutUserInput>;
};
export type PlacementResultCreateManyUserInputEnvelope = {
    data: Prisma.PlacementResultCreateManyUserInput | Prisma.PlacementResultCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type PlacementResultUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.PlacementResultWhereUniqueInput;
    update: Prisma.XOR<Prisma.PlacementResultUpdateWithoutUserInput, Prisma.PlacementResultUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.PlacementResultCreateWithoutUserInput, Prisma.PlacementResultUncheckedCreateWithoutUserInput>;
};
export type PlacementResultUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.PlacementResultWhereUniqueInput;
    data: Prisma.XOR<Prisma.PlacementResultUpdateWithoutUserInput, Prisma.PlacementResultUncheckedUpdateWithoutUserInput>;
};
export type PlacementResultUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.PlacementResultScalarWhereInput;
    data: Prisma.XOR<Prisma.PlacementResultUpdateManyMutationInput, Prisma.PlacementResultUncheckedUpdateManyWithoutUserInput>;
};
export type PlacementResultScalarWhereInput = {
    AND?: Prisma.PlacementResultScalarWhereInput | Prisma.PlacementResultScalarWhereInput[];
    OR?: Prisma.PlacementResultScalarWhereInput[];
    NOT?: Prisma.PlacementResultScalarWhereInput | Prisma.PlacementResultScalarWhereInput[];
    id?: Prisma.StringFilter<"PlacementResult"> | string;
    userId?: Prisma.StringFilter<"PlacementResult"> | string;
    level?: Prisma.EnumLevelFilter<"PlacementResult"> | $Enums.Level;
    rawScore?: Prisma.IntNullableFilter<"PlacementResult"> | number | null;
    completedAt?: Prisma.DateTimeFilter<"PlacementResult"> | Date | string;
};
export type PlacementResultCreateManyUserInput = {
    id?: string;
    level: $Enums.Level;
    rawScore?: number | null;
    completedAt: Date | string;
};
export type PlacementResultUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level;
    rawScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementResultUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level;
    rawScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementResultUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level;
    rawScore?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementResultSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    rawScore?: boolean;
    completedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["placementResult"]>;
export type PlacementResultSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    rawScore?: boolean;
    completedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["placementResult"]>;
export type PlacementResultSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    rawScore?: boolean;
    completedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["placementResult"]>;
export type PlacementResultSelectScalar = {
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    rawScore?: boolean;
    completedAt?: boolean;
};
export type PlacementResultOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "level" | "rawScore" | "completedAt", ExtArgs["result"]["placementResult"]>;
export type PlacementResultInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PlacementResultIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PlacementResultIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PlacementResultPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PlacementResult";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        level: $Enums.Level;
        rawScore: number | null;
        completedAt: Date;
    }, ExtArgs["result"]["placementResult"]>;
    composites: {};
};
export type PlacementResultGetPayload<S extends boolean | null | undefined | PlacementResultDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload, S>;
export type PlacementResultCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlacementResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlacementResultCountAggregateInputType | true;
};
export interface PlacementResultDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PlacementResult'];
        meta: {
            name: 'PlacementResult';
        };
    };
    findUnique<T extends PlacementResultFindUniqueArgs>(args: Prisma.SelectSubset<T, PlacementResultFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlacementResultFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlacementResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlacementResultFindFirstArgs>(args?: Prisma.SelectSubset<T, PlacementResultFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlacementResultFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlacementResultFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlacementResultFindManyArgs>(args?: Prisma.SelectSubset<T, PlacementResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlacementResultCreateArgs>(args: Prisma.SelectSubset<T, PlacementResultCreateArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlacementResultCreateManyArgs>(args?: Prisma.SelectSubset<T, PlacementResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlacementResultCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlacementResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlacementResultDeleteArgs>(args: Prisma.SelectSubset<T, PlacementResultDeleteArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlacementResultUpdateArgs>(args: Prisma.SelectSubset<T, PlacementResultUpdateArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlacementResultDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlacementResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlacementResultUpdateManyArgs>(args: Prisma.SelectSubset<T, PlacementResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlacementResultUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlacementResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlacementResultUpsertArgs>(args: Prisma.SelectSubset<T, PlacementResultUpsertArgs<ExtArgs>>): Prisma.Prisma__PlacementResultClient<runtime.Types.Result.GetResult<Prisma.$PlacementResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlacementResultCountArgs>(args?: Prisma.Subset<T, PlacementResultCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlacementResultCountAggregateOutputType> : number>;
    aggregate<T extends PlacementResultAggregateArgs>(args: Prisma.Subset<T, PlacementResultAggregateArgs>): Prisma.PrismaPromise<GetPlacementResultAggregateType<T>>;
    groupBy<T extends PlacementResultGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlacementResultGroupByArgs['orderBy'];
    } : {
        orderBy?: PlacementResultGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlacementResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlacementResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlacementResultFieldRefs;
}
export interface Prisma__PlacementResultClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlacementResultFieldRefs {
    readonly id: Prisma.FieldRef<"PlacementResult", 'String'>;
    readonly userId: Prisma.FieldRef<"PlacementResult", 'String'>;
    readonly level: Prisma.FieldRef<"PlacementResult", 'Level'>;
    readonly rawScore: Prisma.FieldRef<"PlacementResult", 'Int'>;
    readonly completedAt: Prisma.FieldRef<"PlacementResult", 'DateTime'>;
}
export type PlacementResultFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    where: Prisma.PlacementResultWhereUniqueInput;
};
export type PlacementResultFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    where: Prisma.PlacementResultWhereUniqueInput;
};
export type PlacementResultFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    where?: Prisma.PlacementResultWhereInput;
    orderBy?: Prisma.PlacementResultOrderByWithRelationInput | Prisma.PlacementResultOrderByWithRelationInput[];
    cursor?: Prisma.PlacementResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlacementResultScalarFieldEnum | Prisma.PlacementResultScalarFieldEnum[];
};
export type PlacementResultFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    where?: Prisma.PlacementResultWhereInput;
    orderBy?: Prisma.PlacementResultOrderByWithRelationInput | Prisma.PlacementResultOrderByWithRelationInput[];
    cursor?: Prisma.PlacementResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlacementResultScalarFieldEnum | Prisma.PlacementResultScalarFieldEnum[];
};
export type PlacementResultFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    where?: Prisma.PlacementResultWhereInput;
    orderBy?: Prisma.PlacementResultOrderByWithRelationInput | Prisma.PlacementResultOrderByWithRelationInput[];
    cursor?: Prisma.PlacementResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlacementResultScalarFieldEnum | Prisma.PlacementResultScalarFieldEnum[];
};
export type PlacementResultCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlacementResultCreateInput, Prisma.PlacementResultUncheckedCreateInput>;
};
export type PlacementResultCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlacementResultCreateManyInput | Prisma.PlacementResultCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlacementResultCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    data: Prisma.PlacementResultCreateManyInput | Prisma.PlacementResultCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PlacementResultIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PlacementResultUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlacementResultUpdateInput, Prisma.PlacementResultUncheckedUpdateInput>;
    where: Prisma.PlacementResultWhereUniqueInput;
};
export type PlacementResultUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlacementResultUpdateManyMutationInput, Prisma.PlacementResultUncheckedUpdateManyInput>;
    where?: Prisma.PlacementResultWhereInput;
    limit?: number;
};
export type PlacementResultUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlacementResultUpdateManyMutationInput, Prisma.PlacementResultUncheckedUpdateManyInput>;
    where?: Prisma.PlacementResultWhereInput;
    limit?: number;
    include?: Prisma.PlacementResultIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PlacementResultUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    where: Prisma.PlacementResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlacementResultCreateInput, Prisma.PlacementResultUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlacementResultUpdateInput, Prisma.PlacementResultUncheckedUpdateInput>;
};
export type PlacementResultDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
    where: Prisma.PlacementResultWhereUniqueInput;
};
export type PlacementResultDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlacementResultWhereInput;
    limit?: number;
};
export type PlacementResultDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementResultSelect<ExtArgs> | null;
    omit?: Prisma.PlacementResultOmit<ExtArgs> | null;
    include?: Prisma.PlacementResultInclude<ExtArgs> | null;
};
export {};
