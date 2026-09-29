import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TeacherProfileModel = runtime.Types.Result.DefaultSelection<Prisma.$TeacherProfilePayload>;
export type AggregateTeacherProfile = {
    _count: TeacherProfileCountAggregateOutputType | null;
    _min: TeacherProfileMinAggregateOutputType | null;
    _max: TeacherProfileMaxAggregateOutputType | null;
};
export type TeacherProfileMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    bio: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TeacherProfileMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    bio: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TeacherProfileCountAggregateOutputType = {
    id: number;
    userId: number;
    bio: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TeacherProfileMinAggregateInputType = {
    id?: true;
    userId?: true;
    bio?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TeacherProfileMaxAggregateInputType = {
    id?: true;
    userId?: true;
    bio?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TeacherProfileCountAggregateInputType = {
    id?: true;
    userId?: true;
    bio?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TeacherProfileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeacherProfileWhereInput;
    orderBy?: Prisma.TeacherProfileOrderByWithRelationInput | Prisma.TeacherProfileOrderByWithRelationInput[];
    cursor?: Prisma.TeacherProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TeacherProfileCountAggregateInputType;
    _min?: TeacherProfileMinAggregateInputType;
    _max?: TeacherProfileMaxAggregateInputType;
};
export type GetTeacherProfileAggregateType<T extends TeacherProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateTeacherProfile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeacherProfile[P]> : Prisma.GetScalarType<T[P], AggregateTeacherProfile[P]>;
};
export type TeacherProfileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeacherProfileWhereInput;
    orderBy?: Prisma.TeacherProfileOrderByWithAggregationInput | Prisma.TeacherProfileOrderByWithAggregationInput[];
    by: Prisma.TeacherProfileScalarFieldEnum[] | Prisma.TeacherProfileScalarFieldEnum;
    having?: Prisma.TeacherProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeacherProfileCountAggregateInputType | true;
    _min?: TeacherProfileMinAggregateInputType;
    _max?: TeacherProfileMaxAggregateInputType;
};
export type TeacherProfileGroupByOutputType = {
    id: string;
    userId: string;
    bio: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: TeacherProfileCountAggregateOutputType | null;
    _min: TeacherProfileMinAggregateOutputType | null;
    _max: TeacherProfileMaxAggregateOutputType | null;
};
type GetTeacherProfileGroupByPayload<T extends TeacherProfileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeacherProfileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeacherProfileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeacherProfileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeacherProfileGroupByOutputType[P]>;
}>>;
export type TeacherProfileWhereInput = {
    AND?: Prisma.TeacherProfileWhereInput | Prisma.TeacherProfileWhereInput[];
    OR?: Prisma.TeacherProfileWhereInput[];
    NOT?: Prisma.TeacherProfileWhereInput | Prisma.TeacherProfileWhereInput[];
    id?: Prisma.StringFilter<"TeacherProfile"> | string;
    userId?: Prisma.StringFilter<"TeacherProfile"> | string;
    bio?: Prisma.StringNullableFilter<"TeacherProfile"> | string | null;
    isActive?: Prisma.BoolFilter<"TeacherProfile"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TeacherProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TeacherProfile"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TeacherProfileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TeacherProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.TeacherProfileWhereInput | Prisma.TeacherProfileWhereInput[];
    OR?: Prisma.TeacherProfileWhereInput[];
    NOT?: Prisma.TeacherProfileWhereInput | Prisma.TeacherProfileWhereInput[];
    bio?: Prisma.StringNullableFilter<"TeacherProfile"> | string | null;
    isActive?: Prisma.BoolFilter<"TeacherProfile"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TeacherProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TeacherProfile"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId">;
export type TeacherProfileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TeacherProfileCountOrderByAggregateInput;
    _max?: Prisma.TeacherProfileMaxOrderByAggregateInput;
    _min?: Prisma.TeacherProfileMinOrderByAggregateInput;
};
export type TeacherProfileScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeacherProfileScalarWhereWithAggregatesInput | Prisma.TeacherProfileScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeacherProfileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeacherProfileScalarWhereWithAggregatesInput | Prisma.TeacherProfileScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TeacherProfile"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TeacherProfile"> | string;
    bio?: Prisma.StringNullableWithAggregatesFilter<"TeacherProfile"> | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"TeacherProfile"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TeacherProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"TeacherProfile"> | Date | string;
};
export type TeacherProfileCreateInput = {
    id?: string;
    bio?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTeacherProfileInput;
};
export type TeacherProfileUncheckedCreateInput = {
    id?: string;
    userId: string;
    bio?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherProfileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTeacherProfileNestedInput;
};
export type TeacherProfileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherProfileCreateManyInput = {
    id?: string;
    userId: string;
    bio?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherProfileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherProfileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherProfileNullableScalarRelationFilter = {
    is?: Prisma.TeacherProfileWhereInput | null;
    isNot?: Prisma.TeacherProfileWhereInput | null;
};
export type TeacherProfileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeacherProfileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeacherProfileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeacherProfileCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeacherProfileCreateWithoutUserInput, Prisma.TeacherProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherProfileCreateOrConnectWithoutUserInput;
    connect?: Prisma.TeacherProfileWhereUniqueInput;
};
export type TeacherProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeacherProfileCreateWithoutUserInput, Prisma.TeacherProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherProfileCreateOrConnectWithoutUserInput;
    connect?: Prisma.TeacherProfileWhereUniqueInput;
};
export type TeacherProfileUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeacherProfileCreateWithoutUserInput, Prisma.TeacherProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherProfileCreateOrConnectWithoutUserInput;
    upsert?: Prisma.TeacherProfileUpsertWithoutUserInput;
    disconnect?: Prisma.TeacherProfileWhereInput | boolean;
    delete?: Prisma.TeacherProfileWhereInput | boolean;
    connect?: Prisma.TeacherProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeacherProfileUpdateToOneWithWhereWithoutUserInput, Prisma.TeacherProfileUpdateWithoutUserInput>, Prisma.TeacherProfileUncheckedUpdateWithoutUserInput>;
};
export type TeacherProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeacherProfileCreateWithoutUserInput, Prisma.TeacherProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherProfileCreateOrConnectWithoutUserInput;
    upsert?: Prisma.TeacherProfileUpsertWithoutUserInput;
    disconnect?: Prisma.TeacherProfileWhereInput | boolean;
    delete?: Prisma.TeacherProfileWhereInput | boolean;
    connect?: Prisma.TeacherProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeacherProfileUpdateToOneWithWhereWithoutUserInput, Prisma.TeacherProfileUpdateWithoutUserInput>, Prisma.TeacherProfileUncheckedUpdateWithoutUserInput>;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type TeacherProfileCreateWithoutUserInput = {
    id?: string;
    bio?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherProfileUncheckedCreateWithoutUserInput = {
    id?: string;
    bio?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherProfileCreateOrConnectWithoutUserInput = {
    where: Prisma.TeacherProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeacherProfileCreateWithoutUserInput, Prisma.TeacherProfileUncheckedCreateWithoutUserInput>;
};
export type TeacherProfileUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.TeacherProfileUpdateWithoutUserInput, Prisma.TeacherProfileUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TeacherProfileCreateWithoutUserInput, Prisma.TeacherProfileUncheckedCreateWithoutUserInput>;
    where?: Prisma.TeacherProfileWhereInput;
};
export type TeacherProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.TeacherProfileWhereInput;
    data: Prisma.XOR<Prisma.TeacherProfileUpdateWithoutUserInput, Prisma.TeacherProfileUncheckedUpdateWithoutUserInput>;
};
export type TeacherProfileUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherProfileUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherProfileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    bio?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teacherProfile"]>;
export type TeacherProfileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    bio?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teacherProfile"]>;
export type TeacherProfileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    bio?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teacherProfile"]>;
export type TeacherProfileSelectScalar = {
    id?: boolean;
    userId?: boolean;
    bio?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TeacherProfileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "bio" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["teacherProfile"]>;
export type TeacherProfileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TeacherProfileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TeacherProfileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TeacherProfilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TeacherProfile";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        bio: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["teacherProfile"]>;
    composites: {};
};
export type TeacherProfileGetPayload<S extends boolean | null | undefined | TeacherProfileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload, S>;
export type TeacherProfileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeacherProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeacherProfileCountAggregateInputType | true;
};
export interface TeacherProfileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TeacherProfile'];
        meta: {
            name: 'TeacherProfile';
        };
    };
    findUnique<T extends TeacherProfileFindUniqueArgs>(args: Prisma.SelectSubset<T, TeacherProfileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TeacherProfileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeacherProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TeacherProfileFindFirstArgs>(args?: Prisma.SelectSubset<T, TeacherProfileFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TeacherProfileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeacherProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TeacherProfileFindManyArgs>(args?: Prisma.SelectSubset<T, TeacherProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TeacherProfileCreateArgs>(args: Prisma.SelectSubset<T, TeacherProfileCreateArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TeacherProfileCreateManyArgs>(args?: Prisma.SelectSubset<T, TeacherProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TeacherProfileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TeacherProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TeacherProfileDeleteArgs>(args: Prisma.SelectSubset<T, TeacherProfileDeleteArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TeacherProfileUpdateArgs>(args: Prisma.SelectSubset<T, TeacherProfileUpdateArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TeacherProfileDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeacherProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TeacherProfileUpdateManyArgs>(args: Prisma.SelectSubset<T, TeacherProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TeacherProfileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TeacherProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TeacherProfileUpsertArgs>(args: Prisma.SelectSubset<T, TeacherProfileUpsertArgs<ExtArgs>>): Prisma.Prisma__TeacherProfileClient<runtime.Types.Result.GetResult<Prisma.$TeacherProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TeacherProfileCountArgs>(args?: Prisma.Subset<T, TeacherProfileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeacherProfileCountAggregateOutputType> : number>;
    aggregate<T extends TeacherProfileAggregateArgs>(args: Prisma.Subset<T, TeacherProfileAggregateArgs>): Prisma.PrismaPromise<GetTeacherProfileAggregateType<T>>;
    groupBy<T extends TeacherProfileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeacherProfileGroupByArgs['orderBy'];
    } : {
        orderBy?: TeacherProfileGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeacherProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeacherProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TeacherProfileFieldRefs;
}
export interface Prisma__TeacherProfileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TeacherProfileFieldRefs {
    readonly id: Prisma.FieldRef<"TeacherProfile", 'String'>;
    readonly userId: Prisma.FieldRef<"TeacherProfile", 'String'>;
    readonly bio: Prisma.FieldRef<"TeacherProfile", 'String'>;
    readonly isActive: Prisma.FieldRef<"TeacherProfile", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"TeacherProfile", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"TeacherProfile", 'DateTime'>;
}
export type TeacherProfileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    where: Prisma.TeacherProfileWhereUniqueInput;
};
export type TeacherProfileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    where: Prisma.TeacherProfileWhereUniqueInput;
};
export type TeacherProfileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    where?: Prisma.TeacherProfileWhereInput;
    orderBy?: Prisma.TeacherProfileOrderByWithRelationInput | Prisma.TeacherProfileOrderByWithRelationInput[];
    cursor?: Prisma.TeacherProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeacherProfileScalarFieldEnum | Prisma.TeacherProfileScalarFieldEnum[];
};
export type TeacherProfileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    where?: Prisma.TeacherProfileWhereInput;
    orderBy?: Prisma.TeacherProfileOrderByWithRelationInput | Prisma.TeacherProfileOrderByWithRelationInput[];
    cursor?: Prisma.TeacherProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeacherProfileScalarFieldEnum | Prisma.TeacherProfileScalarFieldEnum[];
};
export type TeacherProfileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    where?: Prisma.TeacherProfileWhereInput;
    orderBy?: Prisma.TeacherProfileOrderByWithRelationInput | Prisma.TeacherProfileOrderByWithRelationInput[];
    cursor?: Prisma.TeacherProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeacherProfileScalarFieldEnum | Prisma.TeacherProfileScalarFieldEnum[];
};
export type TeacherProfileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeacherProfileCreateInput, Prisma.TeacherProfileUncheckedCreateInput>;
};
export type TeacherProfileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TeacherProfileCreateManyInput | Prisma.TeacherProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TeacherProfileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    data: Prisma.TeacherProfileCreateManyInput | Prisma.TeacherProfileCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TeacherProfileIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TeacherProfileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeacherProfileUpdateInput, Prisma.TeacherProfileUncheckedUpdateInput>;
    where: Prisma.TeacherProfileWhereUniqueInput;
};
export type TeacherProfileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TeacherProfileUpdateManyMutationInput, Prisma.TeacherProfileUncheckedUpdateManyInput>;
    where?: Prisma.TeacherProfileWhereInput;
    limit?: number;
};
export type TeacherProfileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeacherProfileUpdateManyMutationInput, Prisma.TeacherProfileUncheckedUpdateManyInput>;
    where?: Prisma.TeacherProfileWhereInput;
    limit?: number;
    include?: Prisma.TeacherProfileIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TeacherProfileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    where: Prisma.TeacherProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeacherProfileCreateInput, Prisma.TeacherProfileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TeacherProfileUpdateInput, Prisma.TeacherProfileUncheckedUpdateInput>;
};
export type TeacherProfileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
    where: Prisma.TeacherProfileWhereUniqueInput;
};
export type TeacherProfileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeacherProfileWhereInput;
    limit?: number;
};
export type TeacherProfileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherProfileSelect<ExtArgs> | null;
    omit?: Prisma.TeacherProfileOmit<ExtArgs> | null;
    include?: Prisma.TeacherProfileInclude<ExtArgs> | null;
};
export {};
