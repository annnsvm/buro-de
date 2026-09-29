import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StudentProfileModel = runtime.Types.Result.DefaultSelection<Prisma.$StudentProfilePayload>;
export type AggregateStudentProfile = {
    _count: StudentProfileCountAggregateOutputType | null;
    _min: StudentProfileMinAggregateOutputType | null;
    _max: StudentProfileMaxAggregateOutputType | null;
};
export type StudentProfileMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    level: $Enums.Level | null;
    timezone: string | null;
    trialEndsAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type StudentProfileMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    level: $Enums.Level | null;
    timezone: string | null;
    trialEndsAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type StudentProfileCountAggregateOutputType = {
    id: number;
    userId: number;
    level: number;
    timezone: number;
    trialEndsAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type StudentProfileMinAggregateInputType = {
    id?: true;
    userId?: true;
    level?: true;
    timezone?: true;
    trialEndsAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type StudentProfileMaxAggregateInputType = {
    id?: true;
    userId?: true;
    level?: true;
    timezone?: true;
    trialEndsAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type StudentProfileCountAggregateInputType = {
    id?: true;
    userId?: true;
    level?: true;
    timezone?: true;
    trialEndsAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type StudentProfileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StudentProfileWhereInput;
    orderBy?: Prisma.StudentProfileOrderByWithRelationInput | Prisma.StudentProfileOrderByWithRelationInput[];
    cursor?: Prisma.StudentProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StudentProfileCountAggregateInputType;
    _min?: StudentProfileMinAggregateInputType;
    _max?: StudentProfileMaxAggregateInputType;
};
export type GetStudentProfileAggregateType<T extends StudentProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateStudentProfile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStudentProfile[P]> : Prisma.GetScalarType<T[P], AggregateStudentProfile[P]>;
};
export type StudentProfileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StudentProfileWhereInput;
    orderBy?: Prisma.StudentProfileOrderByWithAggregationInput | Prisma.StudentProfileOrderByWithAggregationInput[];
    by: Prisma.StudentProfileScalarFieldEnum[] | Prisma.StudentProfileScalarFieldEnum;
    having?: Prisma.StudentProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StudentProfileCountAggregateInputType | true;
    _min?: StudentProfileMinAggregateInputType;
    _max?: StudentProfileMaxAggregateInputType;
};
export type StudentProfileGroupByOutputType = {
    id: string;
    userId: string;
    level: $Enums.Level | null;
    timezone: string;
    trialEndsAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: StudentProfileCountAggregateOutputType | null;
    _min: StudentProfileMinAggregateOutputType | null;
    _max: StudentProfileMaxAggregateOutputType | null;
};
type GetStudentProfileGroupByPayload<T extends StudentProfileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StudentProfileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StudentProfileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StudentProfileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StudentProfileGroupByOutputType[P]>;
}>>;
export type StudentProfileWhereInput = {
    AND?: Prisma.StudentProfileWhereInput | Prisma.StudentProfileWhereInput[];
    OR?: Prisma.StudentProfileWhereInput[];
    NOT?: Prisma.StudentProfileWhereInput | Prisma.StudentProfileWhereInput[];
    id?: Prisma.StringFilter<"StudentProfile"> | string;
    userId?: Prisma.StringFilter<"StudentProfile"> | string;
    level?: Prisma.EnumLevelNullableFilter<"StudentProfile"> | $Enums.Level | null;
    timezone?: Prisma.StringFilter<"StudentProfile"> | string;
    trialEndsAt?: Prisma.DateTimeNullableFilter<"StudentProfile"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StudentProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StudentProfile"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type StudentProfileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrderInput | Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type StudentProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.StudentProfileWhereInput | Prisma.StudentProfileWhereInput[];
    OR?: Prisma.StudentProfileWhereInput[];
    NOT?: Prisma.StudentProfileWhereInput | Prisma.StudentProfileWhereInput[];
    level?: Prisma.EnumLevelNullableFilter<"StudentProfile"> | $Enums.Level | null;
    timezone?: Prisma.StringFilter<"StudentProfile"> | string;
    trialEndsAt?: Prisma.DateTimeNullableFilter<"StudentProfile"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StudentProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StudentProfile"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId">;
export type StudentProfileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrderInput | Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.StudentProfileCountOrderByAggregateInput;
    _max?: Prisma.StudentProfileMaxOrderByAggregateInput;
    _min?: Prisma.StudentProfileMinOrderByAggregateInput;
};
export type StudentProfileScalarWhereWithAggregatesInput = {
    AND?: Prisma.StudentProfileScalarWhereWithAggregatesInput | Prisma.StudentProfileScalarWhereWithAggregatesInput[];
    OR?: Prisma.StudentProfileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StudentProfileScalarWhereWithAggregatesInput | Prisma.StudentProfileScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StudentProfile"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"StudentProfile"> | string;
    level?: Prisma.EnumLevelNullableWithAggregatesFilter<"StudentProfile"> | $Enums.Level | null;
    timezone?: Prisma.StringWithAggregatesFilter<"StudentProfile"> | string;
    trialEndsAt?: Prisma.DateTimeNullableWithAggregatesFilter<"StudentProfile"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StudentProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"StudentProfile"> | Date | string;
};
export type StudentProfileCreateInput = {
    id?: string;
    level?: $Enums.Level | null;
    timezone?: string;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutStudentProfileInput;
};
export type StudentProfileUncheckedCreateInput = {
    id?: string;
    userId: string;
    level?: $Enums.Level | null;
    timezone?: string;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StudentProfileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutStudentProfileNestedInput;
};
export type StudentProfileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentProfileCreateManyInput = {
    id?: string;
    userId: string;
    level?: $Enums.Level | null;
    timezone?: string;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StudentProfileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentProfileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentProfileNullableScalarRelationFilter = {
    is?: Prisma.StudentProfileWhereInput | null;
    isNot?: Prisma.StudentProfileWhereInput | null;
};
export type StudentProfileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StudentProfileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StudentProfileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    trialEndsAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StudentProfileCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StudentProfileCreateWithoutUserInput, Prisma.StudentProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.StudentProfileCreateOrConnectWithoutUserInput;
    connect?: Prisma.StudentProfileWhereUniqueInput;
};
export type StudentProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StudentProfileCreateWithoutUserInput, Prisma.StudentProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.StudentProfileCreateOrConnectWithoutUserInput;
    connect?: Prisma.StudentProfileWhereUniqueInput;
};
export type StudentProfileUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StudentProfileCreateWithoutUserInput, Prisma.StudentProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.StudentProfileCreateOrConnectWithoutUserInput;
    upsert?: Prisma.StudentProfileUpsertWithoutUserInput;
    disconnect?: Prisma.StudentProfileWhereInput | boolean;
    delete?: Prisma.StudentProfileWhereInput | boolean;
    connect?: Prisma.StudentProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StudentProfileUpdateToOneWithWhereWithoutUserInput, Prisma.StudentProfileUpdateWithoutUserInput>, Prisma.StudentProfileUncheckedUpdateWithoutUserInput>;
};
export type StudentProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StudentProfileCreateWithoutUserInput, Prisma.StudentProfileUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.StudentProfileCreateOrConnectWithoutUserInput;
    upsert?: Prisma.StudentProfileUpsertWithoutUserInput;
    disconnect?: Prisma.StudentProfileWhereInput | boolean;
    delete?: Prisma.StudentProfileWhereInput | boolean;
    connect?: Prisma.StudentProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StudentProfileUpdateToOneWithWhereWithoutUserInput, Prisma.StudentProfileUpdateWithoutUserInput>, Prisma.StudentProfileUncheckedUpdateWithoutUserInput>;
};
export type NullableEnumLevelFieldUpdateOperationsInput = {
    set?: $Enums.Level | null;
};
export type StudentProfileCreateWithoutUserInput = {
    id?: string;
    level?: $Enums.Level | null;
    timezone?: string;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StudentProfileUncheckedCreateWithoutUserInput = {
    id?: string;
    level?: $Enums.Level | null;
    timezone?: string;
    trialEndsAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StudentProfileCreateOrConnectWithoutUserInput = {
    where: Prisma.StudentProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.StudentProfileCreateWithoutUserInput, Prisma.StudentProfileUncheckedCreateWithoutUserInput>;
};
export type StudentProfileUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.StudentProfileUpdateWithoutUserInput, Prisma.StudentProfileUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.StudentProfileCreateWithoutUserInput, Prisma.StudentProfileUncheckedCreateWithoutUserInput>;
    where?: Prisma.StudentProfileWhereInput;
};
export type StudentProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.StudentProfileWhereInput;
    data: Prisma.XOR<Prisma.StudentProfileUpdateWithoutUserInput, Prisma.StudentProfileUncheckedUpdateWithoutUserInput>;
};
export type StudentProfileUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentProfileUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.NullableEnumLevelFieldUpdateOperationsInput | $Enums.Level | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    trialEndsAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentProfileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    timezone?: boolean;
    trialEndsAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["studentProfile"]>;
export type StudentProfileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    timezone?: boolean;
    trialEndsAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["studentProfile"]>;
export type StudentProfileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    timezone?: boolean;
    trialEndsAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["studentProfile"]>;
export type StudentProfileSelectScalar = {
    id?: boolean;
    userId?: boolean;
    level?: boolean;
    timezone?: boolean;
    trialEndsAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type StudentProfileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "level" | "timezone" | "trialEndsAt" | "createdAt" | "updatedAt", ExtArgs["result"]["studentProfile"]>;
export type StudentProfileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StudentProfileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StudentProfileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $StudentProfilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StudentProfile";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        level: $Enums.Level | null;
        timezone: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["studentProfile"]>;
    composites: {};
};
export type StudentProfileGetPayload<S extends boolean | null | undefined | StudentProfileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload, S>;
export type StudentProfileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StudentProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StudentProfileCountAggregateInputType | true;
};
export interface StudentProfileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StudentProfile'];
        meta: {
            name: 'StudentProfile';
        };
    };
    findUnique<T extends StudentProfileFindUniqueArgs>(args: Prisma.SelectSubset<T, StudentProfileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StudentProfileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StudentProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StudentProfileFindFirstArgs>(args?: Prisma.SelectSubset<T, StudentProfileFindFirstArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StudentProfileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StudentProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StudentProfileFindManyArgs>(args?: Prisma.SelectSubset<T, StudentProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StudentProfileCreateArgs>(args: Prisma.SelectSubset<T, StudentProfileCreateArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StudentProfileCreateManyArgs>(args?: Prisma.SelectSubset<T, StudentProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StudentProfileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StudentProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StudentProfileDeleteArgs>(args: Prisma.SelectSubset<T, StudentProfileDeleteArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StudentProfileUpdateArgs>(args: Prisma.SelectSubset<T, StudentProfileUpdateArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StudentProfileDeleteManyArgs>(args?: Prisma.SelectSubset<T, StudentProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StudentProfileUpdateManyArgs>(args: Prisma.SelectSubset<T, StudentProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StudentProfileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StudentProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StudentProfileUpsertArgs>(args: Prisma.SelectSubset<T, StudentProfileUpsertArgs<ExtArgs>>): Prisma.Prisma__StudentProfileClient<runtime.Types.Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StudentProfileCountArgs>(args?: Prisma.Subset<T, StudentProfileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StudentProfileCountAggregateOutputType> : number>;
    aggregate<T extends StudentProfileAggregateArgs>(args: Prisma.Subset<T, StudentProfileAggregateArgs>): Prisma.PrismaPromise<GetStudentProfileAggregateType<T>>;
    groupBy<T extends StudentProfileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StudentProfileGroupByArgs['orderBy'];
    } : {
        orderBy?: StudentProfileGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StudentProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StudentProfileFieldRefs;
}
export interface Prisma__StudentProfileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StudentProfileFieldRefs {
    readonly id: Prisma.FieldRef<"StudentProfile", 'String'>;
    readonly userId: Prisma.FieldRef<"StudentProfile", 'String'>;
    readonly level: Prisma.FieldRef<"StudentProfile", 'Level'>;
    readonly timezone: Prisma.FieldRef<"StudentProfile", 'String'>;
    readonly trialEndsAt: Prisma.FieldRef<"StudentProfile", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"StudentProfile", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"StudentProfile", 'DateTime'>;
}
export type StudentProfileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    where: Prisma.StudentProfileWhereUniqueInput;
};
export type StudentProfileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    where: Prisma.StudentProfileWhereUniqueInput;
};
export type StudentProfileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    where?: Prisma.StudentProfileWhereInput;
    orderBy?: Prisma.StudentProfileOrderByWithRelationInput | Prisma.StudentProfileOrderByWithRelationInput[];
    cursor?: Prisma.StudentProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StudentProfileScalarFieldEnum | Prisma.StudentProfileScalarFieldEnum[];
};
export type StudentProfileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    where?: Prisma.StudentProfileWhereInput;
    orderBy?: Prisma.StudentProfileOrderByWithRelationInput | Prisma.StudentProfileOrderByWithRelationInput[];
    cursor?: Prisma.StudentProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StudentProfileScalarFieldEnum | Prisma.StudentProfileScalarFieldEnum[];
};
export type StudentProfileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    where?: Prisma.StudentProfileWhereInput;
    orderBy?: Prisma.StudentProfileOrderByWithRelationInput | Prisma.StudentProfileOrderByWithRelationInput[];
    cursor?: Prisma.StudentProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StudentProfileScalarFieldEnum | Prisma.StudentProfileScalarFieldEnum[];
};
export type StudentProfileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StudentProfileCreateInput, Prisma.StudentProfileUncheckedCreateInput>;
};
export type StudentProfileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StudentProfileCreateManyInput | Prisma.StudentProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StudentProfileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    data: Prisma.StudentProfileCreateManyInput | Prisma.StudentProfileCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StudentProfileIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StudentProfileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StudentProfileUpdateInput, Prisma.StudentProfileUncheckedUpdateInput>;
    where: Prisma.StudentProfileWhereUniqueInput;
};
export type StudentProfileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StudentProfileUpdateManyMutationInput, Prisma.StudentProfileUncheckedUpdateManyInput>;
    where?: Prisma.StudentProfileWhereInput;
    limit?: number;
};
export type StudentProfileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StudentProfileUpdateManyMutationInput, Prisma.StudentProfileUncheckedUpdateManyInput>;
    where?: Prisma.StudentProfileWhereInput;
    limit?: number;
    include?: Prisma.StudentProfileIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StudentProfileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    where: Prisma.StudentProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.StudentProfileCreateInput, Prisma.StudentProfileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StudentProfileUpdateInput, Prisma.StudentProfileUncheckedUpdateInput>;
};
export type StudentProfileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
    where: Prisma.StudentProfileWhereUniqueInput;
};
export type StudentProfileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StudentProfileWhereInput;
    limit?: number;
};
export type StudentProfileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentProfileSelect<ExtArgs> | null;
    omit?: Prisma.StudentProfileOmit<ExtArgs> | null;
    include?: Prisma.StudentProfileInclude<ExtArgs> | null;
};
export {};
