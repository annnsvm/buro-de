import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PlacementQuestionModel = runtime.Types.Result.DefaultSelection<Prisma.$PlacementQuestionPayload>;
export type AggregatePlacementQuestion = {
    _count: PlacementQuestionCountAggregateOutputType | null;
    _avg: PlacementQuestionAvgAggregateOutputType | null;
    _sum: PlacementQuestionSumAggregateOutputType | null;
    _min: PlacementQuestionMinAggregateOutputType | null;
    _max: PlacementQuestionMaxAggregateOutputType | null;
};
export type PlacementQuestionAvgAggregateOutputType = {
    orderIndex: number | null;
};
export type PlacementQuestionSumAggregateOutputType = {
    orderIndex: number | null;
};
export type PlacementQuestionMinAggregateOutputType = {
    id: string | null;
    level: $Enums.Level | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlacementQuestionMaxAggregateOutputType = {
    id: string | null;
    level: $Enums.Level | null;
    orderIndex: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlacementQuestionCountAggregateOutputType = {
    id: number;
    level: number;
    questionData: number;
    orderIndex: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PlacementQuestionAvgAggregateInputType = {
    orderIndex?: true;
};
export type PlacementQuestionSumAggregateInputType = {
    orderIndex?: true;
};
export type PlacementQuestionMinAggregateInputType = {
    id?: true;
    level?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlacementQuestionMaxAggregateInputType = {
    id?: true;
    level?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlacementQuestionCountAggregateInputType = {
    id?: true;
    level?: true;
    questionData?: true;
    orderIndex?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PlacementQuestionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlacementQuestionWhereInput;
    orderBy?: Prisma.PlacementQuestionOrderByWithRelationInput | Prisma.PlacementQuestionOrderByWithRelationInput[];
    cursor?: Prisma.PlacementQuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlacementQuestionCountAggregateInputType;
    _avg?: PlacementQuestionAvgAggregateInputType;
    _sum?: PlacementQuestionSumAggregateInputType;
    _min?: PlacementQuestionMinAggregateInputType;
    _max?: PlacementQuestionMaxAggregateInputType;
};
export type GetPlacementQuestionAggregateType<T extends PlacementQuestionAggregateArgs> = {
    [P in keyof T & keyof AggregatePlacementQuestion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlacementQuestion[P]> : Prisma.GetScalarType<T[P], AggregatePlacementQuestion[P]>;
};
export type PlacementQuestionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlacementQuestionWhereInput;
    orderBy?: Prisma.PlacementQuestionOrderByWithAggregationInput | Prisma.PlacementQuestionOrderByWithAggregationInput[];
    by: Prisma.PlacementQuestionScalarFieldEnum[] | Prisma.PlacementQuestionScalarFieldEnum;
    having?: Prisma.PlacementQuestionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlacementQuestionCountAggregateInputType | true;
    _avg?: PlacementQuestionAvgAggregateInputType;
    _sum?: PlacementQuestionSumAggregateInputType;
    _min?: PlacementQuestionMinAggregateInputType;
    _max?: PlacementQuestionMaxAggregateInputType;
};
export type PlacementQuestionGroupByOutputType = {
    id: string;
    level: $Enums.Level | null;
    questionData: runtime.JsonValue;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
    _count: PlacementQuestionCountAggregateOutputType | null;
    _avg: PlacementQuestionAvgAggregateOutputType | null;
    _sum: PlacementQuestionSumAggregateOutputType | null;
    _min: PlacementQuestionMinAggregateOutputType | null;
    _max: PlacementQuestionMaxAggregateOutputType | null;
};
type GetPlacementQuestionGroupByPayload<T extends PlacementQuestionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlacementQuestionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlacementQuestionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlacementQuestionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlacementQuestionGroupByOutputType[P]>;
}>>;
export type PlacementQuestionWhereInput = {
    AND?: Prisma.PlacementQuestionWhereInput | Prisma.PlacementQuestionWhereInput[];
    OR?: Prisma.PlacementQuestionWhereInput[];
    NOT?: Prisma.PlacementQuestionWhereInput | Prisma.PlacementQuestionWhereInput[];
    id?: Prisma.StringFilter<"PlacementQuestion"> | string;
    level?: Prisma.EnumLevelNullableFilter<"PlacementQuestion"> | $Enums.Level | null;
    questionData?: Prisma.JsonFilter<"PlacementQuestion">;
    orderIndex?: Prisma.IntFilter<"PlacementQuestion"> | number;
    createdAt?: Prisma.DateTimeFilter<"PlacementQuestion"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PlacementQuestion"> | Date | string;
};
export type PlacementQuestionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    level?: Prisma.SortOrderInput | Prisma.SortOrder;
    questionData?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlacementQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PlacementQuestionWhereInput | Prisma.PlacementQuestionWhereInput[];
    OR?: Prisma.PlacementQuestionWhereInput[];
    NOT?: Prisma.PlacementQuestionWhereInput | Prisma.PlacementQuestionWhereInput[];
    level?: Prisma.EnumLevelNullableFilter<"PlacementQuestion"> | $Enums.Level | null;
    questionData?: Prisma.JsonFilter<"PlacementQuestion">;
    orderIndex?: Prisma.IntFilter<"PlacementQuestion"> | number;
    createdAt?: Prisma.DateTimeFilter<"PlacementQuestion"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PlacementQuestion"> | Date | string;
}, "id">;
export type PlacementQuestionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    level?: Prisma.SortOrderInput | Prisma.SortOrder;
    questionData?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PlacementQuestionCountOrderByAggregateInput;
    _avg?: Prisma.PlacementQuestionAvgOrderByAggregateInput;
    _max?: Prisma.PlacementQuestionMaxOrderByAggregateInput;
    _min?: Prisma.PlacementQuestionMinOrderByAggregateInput;
    _sum?: Prisma.PlacementQuestionSumOrderByAggregateInput;
};
export type PlacementQuestionScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlacementQuestionScalarWhereWithAggregatesInput | Prisma.PlacementQuestionScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlacementQuestionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlacementQuestionScalarWhereWithAggregatesInput | Prisma.PlacementQuestionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PlacementQuestion"> | string;
    level?: Prisma.EnumLevelNullableWithAggregatesFilter<"PlacementQuestion"> | $Enums.Level | null;
    questionData?: Prisma.JsonWithAggregatesFilter<"PlacementQuestion">;
    orderIndex?: Prisma.IntWithAggregatesFilter<"PlacementQuestion"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PlacementQuestion"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PlacementQuestion"> | Date | string;
};
export type PlacementQuestionCreateInput = {
    id?: string;
    level?: $Enums.Level | null;
    questionData: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlacementQuestionUncheckedCreateInput = {
    id?: string;
    level?: $Enums.Level | null;
    questionData: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlacementQuestionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    questionData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementQuestionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    questionData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementQuestionCreateManyInput = {
    id?: string;
    level?: $Enums.Level | null;
    questionData: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    orderIndex: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlacementQuestionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    questionData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementQuestionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    questionData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlacementQuestionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    questionData?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlacementQuestionAvgOrderByAggregateInput = {
    orderIndex?: Prisma.SortOrder;
};
export type PlacementQuestionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlacementQuestionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlacementQuestionSumOrderByAggregateInput = {
    orderIndex?: Prisma.SortOrder;
};
export type PlacementQuestionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    level?: boolean;
    questionData?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["placementQuestion"]>;
export type PlacementQuestionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    level?: boolean;
    questionData?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["placementQuestion"]>;
export type PlacementQuestionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    level?: boolean;
    questionData?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["placementQuestion"]>;
export type PlacementQuestionSelectScalar = {
    id?: boolean;
    level?: boolean;
    questionData?: boolean;
    orderIndex?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PlacementQuestionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "level" | "questionData" | "orderIndex" | "createdAt" | "updatedAt", ExtArgs["result"]["placementQuestion"]>;
export type $PlacementQuestionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PlacementQuestion";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        level: $Enums.Level | null;
        questionData: runtime.JsonValue;
        orderIndex: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["placementQuestion"]>;
    composites: {};
};
export type PlacementQuestionGetPayload<S extends boolean | null | undefined | PlacementQuestionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload, S>;
export type PlacementQuestionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlacementQuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlacementQuestionCountAggregateInputType | true;
};
export interface PlacementQuestionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PlacementQuestion'];
        meta: {
            name: 'PlacementQuestion';
        };
    };
    findUnique<T extends PlacementQuestionFindUniqueArgs>(args: Prisma.SelectSubset<T, PlacementQuestionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlacementQuestionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlacementQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlacementQuestionFindFirstArgs>(args?: Prisma.SelectSubset<T, PlacementQuestionFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlacementQuestionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlacementQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlacementQuestionFindManyArgs>(args?: Prisma.SelectSubset<T, PlacementQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlacementQuestionCreateArgs>(args: Prisma.SelectSubset<T, PlacementQuestionCreateArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlacementQuestionCreateManyArgs>(args?: Prisma.SelectSubset<T, PlacementQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlacementQuestionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlacementQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlacementQuestionDeleteArgs>(args: Prisma.SelectSubset<T, PlacementQuestionDeleteArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlacementQuestionUpdateArgs>(args: Prisma.SelectSubset<T, PlacementQuestionUpdateArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlacementQuestionDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlacementQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlacementQuestionUpdateManyArgs>(args: Prisma.SelectSubset<T, PlacementQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlacementQuestionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlacementQuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlacementQuestionUpsertArgs>(args: Prisma.SelectSubset<T, PlacementQuestionUpsertArgs<ExtArgs>>): Prisma.Prisma__PlacementQuestionClient<runtime.Types.Result.GetResult<Prisma.$PlacementQuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlacementQuestionCountArgs>(args?: Prisma.Subset<T, PlacementQuestionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlacementQuestionCountAggregateOutputType> : number>;
    aggregate<T extends PlacementQuestionAggregateArgs>(args: Prisma.Subset<T, PlacementQuestionAggregateArgs>): Prisma.PrismaPromise<GetPlacementQuestionAggregateType<T>>;
    groupBy<T extends PlacementQuestionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlacementQuestionGroupByArgs['orderBy'];
    } : {
        orderBy?: PlacementQuestionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlacementQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlacementQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlacementQuestionFieldRefs;
}
export interface Prisma__PlacementQuestionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlacementQuestionFieldRefs {
    readonly id: Prisma.FieldRef<"PlacementQuestion", 'String'>;
    readonly level: Prisma.FieldRef<"PlacementQuestion", 'Level'>;
    readonly questionData: Prisma.FieldRef<"PlacementQuestion", 'Json'>;
    readonly orderIndex: Prisma.FieldRef<"PlacementQuestion", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"PlacementQuestion", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PlacementQuestion", 'DateTime'>;
}
export type PlacementQuestionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    where: Prisma.PlacementQuestionWhereUniqueInput;
};
export type PlacementQuestionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    where: Prisma.PlacementQuestionWhereUniqueInput;
};
export type PlacementQuestionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    where?: Prisma.PlacementQuestionWhereInput;
    orderBy?: Prisma.PlacementQuestionOrderByWithRelationInput | Prisma.PlacementQuestionOrderByWithRelationInput[];
    cursor?: Prisma.PlacementQuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlacementQuestionScalarFieldEnum | Prisma.PlacementQuestionScalarFieldEnum[];
};
export type PlacementQuestionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    where?: Prisma.PlacementQuestionWhereInput;
    orderBy?: Prisma.PlacementQuestionOrderByWithRelationInput | Prisma.PlacementQuestionOrderByWithRelationInput[];
    cursor?: Prisma.PlacementQuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlacementQuestionScalarFieldEnum | Prisma.PlacementQuestionScalarFieldEnum[];
};
export type PlacementQuestionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    where?: Prisma.PlacementQuestionWhereInput;
    orderBy?: Prisma.PlacementQuestionOrderByWithRelationInput | Prisma.PlacementQuestionOrderByWithRelationInput[];
    cursor?: Prisma.PlacementQuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlacementQuestionScalarFieldEnum | Prisma.PlacementQuestionScalarFieldEnum[];
};
export type PlacementQuestionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlacementQuestionCreateInput, Prisma.PlacementQuestionUncheckedCreateInput>;
};
export type PlacementQuestionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlacementQuestionCreateManyInput | Prisma.PlacementQuestionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlacementQuestionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    data: Prisma.PlacementQuestionCreateManyInput | Prisma.PlacementQuestionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlacementQuestionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlacementQuestionUpdateInput, Prisma.PlacementQuestionUncheckedUpdateInput>;
    where: Prisma.PlacementQuestionWhereUniqueInput;
};
export type PlacementQuestionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlacementQuestionUpdateManyMutationInput, Prisma.PlacementQuestionUncheckedUpdateManyInput>;
    where?: Prisma.PlacementQuestionWhereInput;
    limit?: number;
};
export type PlacementQuestionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlacementQuestionUpdateManyMutationInput, Prisma.PlacementQuestionUncheckedUpdateManyInput>;
    where?: Prisma.PlacementQuestionWhereInput;
    limit?: number;
};
export type PlacementQuestionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    where: Prisma.PlacementQuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlacementQuestionCreateInput, Prisma.PlacementQuestionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlacementQuestionUpdateInput, Prisma.PlacementQuestionUncheckedUpdateInput>;
};
export type PlacementQuestionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
    where: Prisma.PlacementQuestionWhereUniqueInput;
};
export type PlacementQuestionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlacementQuestionWhereInput;
    limit?: number;
};
export type PlacementQuestionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlacementQuestionSelect<ExtArgs> | null;
    omit?: Prisma.PlacementQuestionOmit<ExtArgs> | null;
};
export {};
