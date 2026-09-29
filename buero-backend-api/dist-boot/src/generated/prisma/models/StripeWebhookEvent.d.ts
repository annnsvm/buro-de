import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type StripeWebhookEventModel = runtime.Types.Result.DefaultSelection<Prisma.$StripeWebhookEventPayload>;
export type AggregateStripeWebhookEvent = {
    _count: StripeWebhookEventCountAggregateOutputType | null;
    _min: StripeWebhookEventMinAggregateOutputType | null;
    _max: StripeWebhookEventMaxAggregateOutputType | null;
};
export type StripeWebhookEventMinAggregateOutputType = {
    id: string | null;
    stripeEventId: string | null;
    processedAt: Date | null;
};
export type StripeWebhookEventMaxAggregateOutputType = {
    id: string | null;
    stripeEventId: string | null;
    processedAt: Date | null;
};
export type StripeWebhookEventCountAggregateOutputType = {
    id: number;
    stripeEventId: number;
    processedAt: number;
    _all: number;
};
export type StripeWebhookEventMinAggregateInputType = {
    id?: true;
    stripeEventId?: true;
    processedAt?: true;
};
export type StripeWebhookEventMaxAggregateInputType = {
    id?: true;
    stripeEventId?: true;
    processedAt?: true;
};
export type StripeWebhookEventCountAggregateInputType = {
    id?: true;
    stripeEventId?: true;
    processedAt?: true;
    _all?: true;
};
export type StripeWebhookEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StripeWebhookEventWhereInput;
    orderBy?: Prisma.StripeWebhookEventOrderByWithRelationInput | Prisma.StripeWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.StripeWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StripeWebhookEventCountAggregateInputType;
    _min?: StripeWebhookEventMinAggregateInputType;
    _max?: StripeWebhookEventMaxAggregateInputType;
};
export type GetStripeWebhookEventAggregateType<T extends StripeWebhookEventAggregateArgs> = {
    [P in keyof T & keyof AggregateStripeWebhookEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStripeWebhookEvent[P]> : Prisma.GetScalarType<T[P], AggregateStripeWebhookEvent[P]>;
};
export type StripeWebhookEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StripeWebhookEventWhereInput;
    orderBy?: Prisma.StripeWebhookEventOrderByWithAggregationInput | Prisma.StripeWebhookEventOrderByWithAggregationInput[];
    by: Prisma.StripeWebhookEventScalarFieldEnum[] | Prisma.StripeWebhookEventScalarFieldEnum;
    having?: Prisma.StripeWebhookEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StripeWebhookEventCountAggregateInputType | true;
    _min?: StripeWebhookEventMinAggregateInputType;
    _max?: StripeWebhookEventMaxAggregateInputType;
};
export type StripeWebhookEventGroupByOutputType = {
    id: string;
    stripeEventId: string;
    processedAt: Date;
    _count: StripeWebhookEventCountAggregateOutputType | null;
    _min: StripeWebhookEventMinAggregateOutputType | null;
    _max: StripeWebhookEventMaxAggregateOutputType | null;
};
type GetStripeWebhookEventGroupByPayload<T extends StripeWebhookEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StripeWebhookEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StripeWebhookEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StripeWebhookEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StripeWebhookEventGroupByOutputType[P]>;
}>>;
export type StripeWebhookEventWhereInput = {
    AND?: Prisma.StripeWebhookEventWhereInput | Prisma.StripeWebhookEventWhereInput[];
    OR?: Prisma.StripeWebhookEventWhereInput[];
    NOT?: Prisma.StripeWebhookEventWhereInput | Prisma.StripeWebhookEventWhereInput[];
    id?: Prisma.StringFilter<"StripeWebhookEvent"> | string;
    stripeEventId?: Prisma.StringFilter<"StripeWebhookEvent"> | string;
    processedAt?: Prisma.DateTimeFilter<"StripeWebhookEvent"> | Date | string;
};
export type StripeWebhookEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    stripeEventId?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type StripeWebhookEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    stripeEventId?: string;
    AND?: Prisma.StripeWebhookEventWhereInput | Prisma.StripeWebhookEventWhereInput[];
    OR?: Prisma.StripeWebhookEventWhereInput[];
    NOT?: Prisma.StripeWebhookEventWhereInput | Prisma.StripeWebhookEventWhereInput[];
    processedAt?: Prisma.DateTimeFilter<"StripeWebhookEvent"> | Date | string;
}, "id" | "stripeEventId">;
export type StripeWebhookEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    stripeEventId?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
    _count?: Prisma.StripeWebhookEventCountOrderByAggregateInput;
    _max?: Prisma.StripeWebhookEventMaxOrderByAggregateInput;
    _min?: Prisma.StripeWebhookEventMinOrderByAggregateInput;
};
export type StripeWebhookEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.StripeWebhookEventScalarWhereWithAggregatesInput | Prisma.StripeWebhookEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.StripeWebhookEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StripeWebhookEventScalarWhereWithAggregatesInput | Prisma.StripeWebhookEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StripeWebhookEvent"> | string;
    stripeEventId?: Prisma.StringWithAggregatesFilter<"StripeWebhookEvent"> | string;
    processedAt?: Prisma.DateTimeWithAggregatesFilter<"StripeWebhookEvent"> | Date | string;
};
export type StripeWebhookEventCreateInput = {
    id?: string;
    stripeEventId: string;
    processedAt?: Date | string;
};
export type StripeWebhookEventUncheckedCreateInput = {
    id?: string;
    stripeEventId: string;
    processedAt?: Date | string;
};
export type StripeWebhookEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeEventId?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StripeWebhookEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeEventId?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StripeWebhookEventCreateManyInput = {
    id?: string;
    stripeEventId: string;
    processedAt?: Date | string;
};
export type StripeWebhookEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeEventId?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StripeWebhookEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stripeEventId?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StripeWebhookEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stripeEventId?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type StripeWebhookEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stripeEventId?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type StripeWebhookEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stripeEventId?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type StripeWebhookEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stripeEventId?: boolean;
    processedAt?: boolean;
}, ExtArgs["result"]["stripeWebhookEvent"]>;
export type StripeWebhookEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stripeEventId?: boolean;
    processedAt?: boolean;
}, ExtArgs["result"]["stripeWebhookEvent"]>;
export type StripeWebhookEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stripeEventId?: boolean;
    processedAt?: boolean;
}, ExtArgs["result"]["stripeWebhookEvent"]>;
export type StripeWebhookEventSelectScalar = {
    id?: boolean;
    stripeEventId?: boolean;
    processedAt?: boolean;
};
export type StripeWebhookEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "stripeEventId" | "processedAt", ExtArgs["result"]["stripeWebhookEvent"]>;
export type $StripeWebhookEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StripeWebhookEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        stripeEventId: string;
        processedAt: Date;
    }, ExtArgs["result"]["stripeWebhookEvent"]>;
    composites: {};
};
export type StripeWebhookEventGetPayload<S extends boolean | null | undefined | StripeWebhookEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload, S>;
export type StripeWebhookEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StripeWebhookEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StripeWebhookEventCountAggregateInputType | true;
};
export interface StripeWebhookEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StripeWebhookEvent'];
        meta: {
            name: 'StripeWebhookEvent';
        };
    };
    findUnique<T extends StripeWebhookEventFindUniqueArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StripeWebhookEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StripeWebhookEventFindFirstArgs>(args?: Prisma.SelectSubset<T, StripeWebhookEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StripeWebhookEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StripeWebhookEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StripeWebhookEventFindManyArgs>(args?: Prisma.SelectSubset<T, StripeWebhookEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StripeWebhookEventCreateArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventCreateArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StripeWebhookEventCreateManyArgs>(args?: Prisma.SelectSubset<T, StripeWebhookEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StripeWebhookEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StripeWebhookEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StripeWebhookEventDeleteArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventDeleteArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StripeWebhookEventUpdateArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventUpdateArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StripeWebhookEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, StripeWebhookEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StripeWebhookEventUpdateManyArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StripeWebhookEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StripeWebhookEventUpsertArgs>(args: Prisma.SelectSubset<T, StripeWebhookEventUpsertArgs<ExtArgs>>): Prisma.Prisma__StripeWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$StripeWebhookEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StripeWebhookEventCountArgs>(args?: Prisma.Subset<T, StripeWebhookEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StripeWebhookEventCountAggregateOutputType> : number>;
    aggregate<T extends StripeWebhookEventAggregateArgs>(args: Prisma.Subset<T, StripeWebhookEventAggregateArgs>): Prisma.PrismaPromise<GetStripeWebhookEventAggregateType<T>>;
    groupBy<T extends StripeWebhookEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StripeWebhookEventGroupByArgs['orderBy'];
    } : {
        orderBy?: StripeWebhookEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StripeWebhookEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStripeWebhookEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StripeWebhookEventFieldRefs;
}
export interface Prisma__StripeWebhookEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StripeWebhookEventFieldRefs {
    readonly id: Prisma.FieldRef<"StripeWebhookEvent", 'String'>;
    readonly stripeEventId: Prisma.FieldRef<"StripeWebhookEvent", 'String'>;
    readonly processedAt: Prisma.FieldRef<"StripeWebhookEvent", 'DateTime'>;
}
export type StripeWebhookEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    where: Prisma.StripeWebhookEventWhereUniqueInput;
};
export type StripeWebhookEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    where: Prisma.StripeWebhookEventWhereUniqueInput;
};
export type StripeWebhookEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.StripeWebhookEventWhereInput;
    orderBy?: Prisma.StripeWebhookEventOrderByWithRelationInput | Prisma.StripeWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.StripeWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StripeWebhookEventScalarFieldEnum | Prisma.StripeWebhookEventScalarFieldEnum[];
};
export type StripeWebhookEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.StripeWebhookEventWhereInput;
    orderBy?: Prisma.StripeWebhookEventOrderByWithRelationInput | Prisma.StripeWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.StripeWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StripeWebhookEventScalarFieldEnum | Prisma.StripeWebhookEventScalarFieldEnum[];
};
export type StripeWebhookEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.StripeWebhookEventWhereInput;
    orderBy?: Prisma.StripeWebhookEventOrderByWithRelationInput | Prisma.StripeWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.StripeWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StripeWebhookEventScalarFieldEnum | Prisma.StripeWebhookEventScalarFieldEnum[];
};
export type StripeWebhookEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StripeWebhookEventCreateInput, Prisma.StripeWebhookEventUncheckedCreateInput>;
};
export type StripeWebhookEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StripeWebhookEventCreateManyInput | Prisma.StripeWebhookEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StripeWebhookEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    data: Prisma.StripeWebhookEventCreateManyInput | Prisma.StripeWebhookEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StripeWebhookEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StripeWebhookEventUpdateInput, Prisma.StripeWebhookEventUncheckedUpdateInput>;
    where: Prisma.StripeWebhookEventWhereUniqueInput;
};
export type StripeWebhookEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StripeWebhookEventUpdateManyMutationInput, Prisma.StripeWebhookEventUncheckedUpdateManyInput>;
    where?: Prisma.StripeWebhookEventWhereInput;
    limit?: number;
};
export type StripeWebhookEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StripeWebhookEventUpdateManyMutationInput, Prisma.StripeWebhookEventUncheckedUpdateManyInput>;
    where?: Prisma.StripeWebhookEventWhereInput;
    limit?: number;
};
export type StripeWebhookEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    where: Prisma.StripeWebhookEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.StripeWebhookEventCreateInput, Prisma.StripeWebhookEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StripeWebhookEventUpdateInput, Prisma.StripeWebhookEventUncheckedUpdateInput>;
};
export type StripeWebhookEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
    where: Prisma.StripeWebhookEventWhereUniqueInput;
};
export type StripeWebhookEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StripeWebhookEventWhereInput;
    limit?: number;
};
export type StripeWebhookEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StripeWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.StripeWebhookEventOmit<ExtArgs> | null;
};
export {};
