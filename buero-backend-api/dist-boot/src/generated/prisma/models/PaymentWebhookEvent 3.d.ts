import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PaymentWebhookEventModel = runtime.Types.Result.DefaultSelection<Prisma.$PaymentWebhookEventPayload>;
export type AggregatePaymentWebhookEvent = {
    _count: PaymentWebhookEventCountAggregateOutputType | null;
    _min: PaymentWebhookEventMinAggregateOutputType | null;
    _max: PaymentWebhookEventMaxAggregateOutputType | null;
};
export type PaymentWebhookEventMinAggregateOutputType = {
    id: string | null;
    provider: string | null;
    eventKey: string | null;
    processedAt: Date | null;
};
export type PaymentWebhookEventMaxAggregateOutputType = {
    id: string | null;
    provider: string | null;
    eventKey: string | null;
    processedAt: Date | null;
};
export type PaymentWebhookEventCountAggregateOutputType = {
    id: number;
    provider: number;
    eventKey: number;
    processedAt: number;
    _all: number;
};
export type PaymentWebhookEventMinAggregateInputType = {
    id?: true;
    provider?: true;
    eventKey?: true;
    processedAt?: true;
};
export type PaymentWebhookEventMaxAggregateInputType = {
    id?: true;
    provider?: true;
    eventKey?: true;
    processedAt?: true;
};
export type PaymentWebhookEventCountAggregateInputType = {
    id?: true;
    provider?: true;
    eventKey?: true;
    processedAt?: true;
    _all?: true;
};
export type PaymentWebhookEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWebhookEventWhereInput;
    orderBy?: Prisma.PaymentWebhookEventOrderByWithRelationInput | Prisma.PaymentWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PaymentWebhookEventCountAggregateInputType;
    _min?: PaymentWebhookEventMinAggregateInputType;
    _max?: PaymentWebhookEventMaxAggregateInputType;
};
export type GetPaymentWebhookEventAggregateType<T extends PaymentWebhookEventAggregateArgs> = {
    [P in keyof T & keyof AggregatePaymentWebhookEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePaymentWebhookEvent[P]> : Prisma.GetScalarType<T[P], AggregatePaymentWebhookEvent[P]>;
};
export type PaymentWebhookEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWebhookEventWhereInput;
    orderBy?: Prisma.PaymentWebhookEventOrderByWithAggregationInput | Prisma.PaymentWebhookEventOrderByWithAggregationInput[];
    by: Prisma.PaymentWebhookEventScalarFieldEnum[] | Prisma.PaymentWebhookEventScalarFieldEnum;
    having?: Prisma.PaymentWebhookEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PaymentWebhookEventCountAggregateInputType | true;
    _min?: PaymentWebhookEventMinAggregateInputType;
    _max?: PaymentWebhookEventMaxAggregateInputType;
};
export type PaymentWebhookEventGroupByOutputType = {
    id: string;
    provider: string;
    eventKey: string;
    processedAt: Date;
    _count: PaymentWebhookEventCountAggregateOutputType | null;
    _min: PaymentWebhookEventMinAggregateOutputType | null;
    _max: PaymentWebhookEventMaxAggregateOutputType | null;
};
type GetPaymentWebhookEventGroupByPayload<T extends PaymentWebhookEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PaymentWebhookEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PaymentWebhookEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PaymentWebhookEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PaymentWebhookEventGroupByOutputType[P]>;
}>>;
export type PaymentWebhookEventWhereInput = {
    AND?: Prisma.PaymentWebhookEventWhereInput | Prisma.PaymentWebhookEventWhereInput[];
    OR?: Prisma.PaymentWebhookEventWhereInput[];
    NOT?: Prisma.PaymentWebhookEventWhereInput | Prisma.PaymentWebhookEventWhereInput[];
    id?: Prisma.StringFilter<"PaymentWebhookEvent"> | string;
    provider?: Prisma.StringFilter<"PaymentWebhookEvent"> | string;
    eventKey?: Prisma.StringFilter<"PaymentWebhookEvent"> | string;
    processedAt?: Prisma.DateTimeFilter<"PaymentWebhookEvent"> | Date | string;
};
export type PaymentWebhookEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventKey?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type PaymentWebhookEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    eventKey?: string;
    AND?: Prisma.PaymentWebhookEventWhereInput | Prisma.PaymentWebhookEventWhereInput[];
    OR?: Prisma.PaymentWebhookEventWhereInput[];
    NOT?: Prisma.PaymentWebhookEventWhereInput | Prisma.PaymentWebhookEventWhereInput[];
    provider?: Prisma.StringFilter<"PaymentWebhookEvent"> | string;
    processedAt?: Prisma.DateTimeFilter<"PaymentWebhookEvent"> | Date | string;
}, "id" | "eventKey">;
export type PaymentWebhookEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventKey?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
    _count?: Prisma.PaymentWebhookEventCountOrderByAggregateInput;
    _max?: Prisma.PaymentWebhookEventMaxOrderByAggregateInput;
    _min?: Prisma.PaymentWebhookEventMinOrderByAggregateInput;
};
export type PaymentWebhookEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.PaymentWebhookEventScalarWhereWithAggregatesInput | Prisma.PaymentWebhookEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.PaymentWebhookEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PaymentWebhookEventScalarWhereWithAggregatesInput | Prisma.PaymentWebhookEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PaymentWebhookEvent"> | string;
    provider?: Prisma.StringWithAggregatesFilter<"PaymentWebhookEvent"> | string;
    eventKey?: Prisma.StringWithAggregatesFilter<"PaymentWebhookEvent"> | string;
    processedAt?: Prisma.DateTimeWithAggregatesFilter<"PaymentWebhookEvent"> | Date | string;
};
export type PaymentWebhookEventCreateInput = {
    id?: string;
    provider?: string;
    eventKey: string;
    processedAt?: Date | string;
};
export type PaymentWebhookEventUncheckedCreateInput = {
    id?: string;
    provider?: string;
    eventKey: string;
    processedAt?: Date | string;
};
export type PaymentWebhookEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventKey?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentWebhookEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventKey?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentWebhookEventCreateManyInput = {
    id?: string;
    provider?: string;
    eventKey: string;
    processedAt?: Date | string;
};
export type PaymentWebhookEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventKey?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentWebhookEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    provider?: Prisma.StringFieldUpdateOperationsInput | string;
    eventKey?: Prisma.StringFieldUpdateOperationsInput | string;
    processedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PaymentWebhookEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventKey?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type PaymentWebhookEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventKey?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type PaymentWebhookEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    provider?: Prisma.SortOrder;
    eventKey?: Prisma.SortOrder;
    processedAt?: Prisma.SortOrder;
};
export type PaymentWebhookEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provider?: boolean;
    eventKey?: boolean;
    processedAt?: boolean;
}, ExtArgs["result"]["paymentWebhookEvent"]>;
export type PaymentWebhookEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provider?: boolean;
    eventKey?: boolean;
    processedAt?: boolean;
}, ExtArgs["result"]["paymentWebhookEvent"]>;
export type PaymentWebhookEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    provider?: boolean;
    eventKey?: boolean;
    processedAt?: boolean;
}, ExtArgs["result"]["paymentWebhookEvent"]>;
export type PaymentWebhookEventSelectScalar = {
    id?: boolean;
    provider?: boolean;
    eventKey?: boolean;
    processedAt?: boolean;
};
export type PaymentWebhookEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "provider" | "eventKey" | "processedAt", ExtArgs["result"]["paymentWebhookEvent"]>;
export type $PaymentWebhookEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PaymentWebhookEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        provider: string;
        eventKey: string;
        processedAt: Date;
    }, ExtArgs["result"]["paymentWebhookEvent"]>;
    composites: {};
};
export type PaymentWebhookEventGetPayload<S extends boolean | null | undefined | PaymentWebhookEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload, S>;
export type PaymentWebhookEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PaymentWebhookEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PaymentWebhookEventCountAggregateInputType | true;
};
export interface PaymentWebhookEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PaymentWebhookEvent'];
        meta: {
            name: 'PaymentWebhookEvent';
        };
    };
    findUnique<T extends PaymentWebhookEventFindUniqueArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PaymentWebhookEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PaymentWebhookEventFindFirstArgs>(args?: Prisma.SelectSubset<T, PaymentWebhookEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PaymentWebhookEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PaymentWebhookEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PaymentWebhookEventFindManyArgs>(args?: Prisma.SelectSubset<T, PaymentWebhookEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PaymentWebhookEventCreateArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventCreateArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PaymentWebhookEventCreateManyArgs>(args?: Prisma.SelectSubset<T, PaymentWebhookEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PaymentWebhookEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PaymentWebhookEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PaymentWebhookEventDeleteArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventDeleteArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PaymentWebhookEventUpdateArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventUpdateArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PaymentWebhookEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, PaymentWebhookEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PaymentWebhookEventUpdateManyArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PaymentWebhookEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PaymentWebhookEventUpsertArgs>(args: Prisma.SelectSubset<T, PaymentWebhookEventUpsertArgs<ExtArgs>>): Prisma.Prisma__PaymentWebhookEventClient<runtime.Types.Result.GetResult<Prisma.$PaymentWebhookEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PaymentWebhookEventCountArgs>(args?: Prisma.Subset<T, PaymentWebhookEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PaymentWebhookEventCountAggregateOutputType> : number>;
    aggregate<T extends PaymentWebhookEventAggregateArgs>(args: Prisma.Subset<T, PaymentWebhookEventAggregateArgs>): Prisma.PrismaPromise<GetPaymentWebhookEventAggregateType<T>>;
    groupBy<T extends PaymentWebhookEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PaymentWebhookEventGroupByArgs['orderBy'];
    } : {
        orderBy?: PaymentWebhookEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PaymentWebhookEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentWebhookEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PaymentWebhookEventFieldRefs;
}
export interface Prisma__PaymentWebhookEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PaymentWebhookEventFieldRefs {
    readonly id: Prisma.FieldRef<"PaymentWebhookEvent", 'String'>;
    readonly provider: Prisma.FieldRef<"PaymentWebhookEvent", 'String'>;
    readonly eventKey: Prisma.FieldRef<"PaymentWebhookEvent", 'String'>;
    readonly processedAt: Prisma.FieldRef<"PaymentWebhookEvent", 'DateTime'>;
}
export type PaymentWebhookEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    where: Prisma.PaymentWebhookEventWhereUniqueInput;
};
export type PaymentWebhookEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    where: Prisma.PaymentWebhookEventWhereUniqueInput;
};
export type PaymentWebhookEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.PaymentWebhookEventWhereInput;
    orderBy?: Prisma.PaymentWebhookEventOrderByWithRelationInput | Prisma.PaymentWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentWebhookEventScalarFieldEnum | Prisma.PaymentWebhookEventScalarFieldEnum[];
};
export type PaymentWebhookEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.PaymentWebhookEventWhereInput;
    orderBy?: Prisma.PaymentWebhookEventOrderByWithRelationInput | Prisma.PaymentWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentWebhookEventScalarFieldEnum | Prisma.PaymentWebhookEventScalarFieldEnum[];
};
export type PaymentWebhookEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    where?: Prisma.PaymentWebhookEventWhereInput;
    orderBy?: Prisma.PaymentWebhookEventOrderByWithRelationInput | Prisma.PaymentWebhookEventOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWebhookEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentWebhookEventScalarFieldEnum | Prisma.PaymentWebhookEventScalarFieldEnum[];
};
export type PaymentWebhookEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentWebhookEventCreateInput, Prisma.PaymentWebhookEventUncheckedCreateInput>;
};
export type PaymentWebhookEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PaymentWebhookEventCreateManyInput | Prisma.PaymentWebhookEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PaymentWebhookEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    data: Prisma.PaymentWebhookEventCreateManyInput | Prisma.PaymentWebhookEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PaymentWebhookEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentWebhookEventUpdateInput, Prisma.PaymentWebhookEventUncheckedUpdateInput>;
    where: Prisma.PaymentWebhookEventWhereUniqueInput;
};
export type PaymentWebhookEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PaymentWebhookEventUpdateManyMutationInput, Prisma.PaymentWebhookEventUncheckedUpdateManyInput>;
    where?: Prisma.PaymentWebhookEventWhereInput;
    limit?: number;
};
export type PaymentWebhookEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PaymentWebhookEventUpdateManyMutationInput, Prisma.PaymentWebhookEventUncheckedUpdateManyInput>;
    where?: Prisma.PaymentWebhookEventWhereInput;
    limit?: number;
};
export type PaymentWebhookEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    where: Prisma.PaymentWebhookEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.PaymentWebhookEventCreateInput, Prisma.PaymentWebhookEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PaymentWebhookEventUpdateInput, Prisma.PaymentWebhookEventUncheckedUpdateInput>;
};
export type PaymentWebhookEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
    where: Prisma.PaymentWebhookEventWhereUniqueInput;
};
export type PaymentWebhookEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWebhookEventWhereInput;
    limit?: number;
};
export type PaymentWebhookEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentWebhookEventSelect<ExtArgs> | null;
    omit?: Prisma.PaymentWebhookEventOmit<ExtArgs> | null;
};
export {};
