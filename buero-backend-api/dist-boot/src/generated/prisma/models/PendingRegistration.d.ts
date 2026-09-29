import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PendingRegistrationModel = runtime.Types.Result.DefaultSelection<Prisma.$PendingRegistrationPayload>;
export type AggregatePendingRegistration = {
    _count: PendingRegistrationCountAggregateOutputType | null;
    _avg: PendingRegistrationAvgAggregateOutputType | null;
    _sum: PendingRegistrationSumAggregateOutputType | null;
    _min: PendingRegistrationMinAggregateOutputType | null;
    _max: PendingRegistrationMaxAggregateOutputType | null;
};
export type PendingRegistrationAvgAggregateOutputType = {
    attempts: number | null;
};
export type PendingRegistrationSumAggregateOutputType = {
    attempts: number | null;
};
export type PendingRegistrationMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    passwordHash: string | null;
    role: $Enums.Role | null;
    language: $Enums.Language | null;
    locale: string | null;
    codeHash: string | null;
    expiresAt: Date | null;
    attempts: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PendingRegistrationMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    passwordHash: string | null;
    role: $Enums.Role | null;
    language: $Enums.Language | null;
    locale: string | null;
    codeHash: string | null;
    expiresAt: Date | null;
    attempts: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PendingRegistrationCountAggregateOutputType = {
    id: number;
    email: number;
    name: number;
    passwordHash: number;
    role: number;
    language: number;
    locale: number;
    codeHash: number;
    expiresAt: number;
    attempts: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PendingRegistrationAvgAggregateInputType = {
    attempts?: true;
};
export type PendingRegistrationSumAggregateInputType = {
    attempts?: true;
};
export type PendingRegistrationMinAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    passwordHash?: true;
    role?: true;
    language?: true;
    locale?: true;
    codeHash?: true;
    expiresAt?: true;
    attempts?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PendingRegistrationMaxAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    passwordHash?: true;
    role?: true;
    language?: true;
    locale?: true;
    codeHash?: true;
    expiresAt?: true;
    attempts?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PendingRegistrationCountAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    passwordHash?: true;
    role?: true;
    language?: true;
    locale?: true;
    codeHash?: true;
    expiresAt?: true;
    attempts?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PendingRegistrationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PendingRegistrationWhereInput;
    orderBy?: Prisma.PendingRegistrationOrderByWithRelationInput | Prisma.PendingRegistrationOrderByWithRelationInput[];
    cursor?: Prisma.PendingRegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PendingRegistrationCountAggregateInputType;
    _avg?: PendingRegistrationAvgAggregateInputType;
    _sum?: PendingRegistrationSumAggregateInputType;
    _min?: PendingRegistrationMinAggregateInputType;
    _max?: PendingRegistrationMaxAggregateInputType;
};
export type GetPendingRegistrationAggregateType<T extends PendingRegistrationAggregateArgs> = {
    [P in keyof T & keyof AggregatePendingRegistration]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePendingRegistration[P]> : Prisma.GetScalarType<T[P], AggregatePendingRegistration[P]>;
};
export type PendingRegistrationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PendingRegistrationWhereInput;
    orderBy?: Prisma.PendingRegistrationOrderByWithAggregationInput | Prisma.PendingRegistrationOrderByWithAggregationInput[];
    by: Prisma.PendingRegistrationScalarFieldEnum[] | Prisma.PendingRegistrationScalarFieldEnum;
    having?: Prisma.PendingRegistrationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PendingRegistrationCountAggregateInputType | true;
    _avg?: PendingRegistrationAvgAggregateInputType;
    _sum?: PendingRegistrationSumAggregateInputType;
    _min?: PendingRegistrationMinAggregateInputType;
    _max?: PendingRegistrationMaxAggregateInputType;
};
export type PendingRegistrationGroupByOutputType = {
    id: string;
    email: string;
    name: string | null;
    passwordHash: string;
    role: $Enums.Role;
    language: $Enums.Language;
    locale: string;
    codeHash: string;
    expiresAt: Date;
    attempts: number;
    createdAt: Date;
    updatedAt: Date;
    _count: PendingRegistrationCountAggregateOutputType | null;
    _avg: PendingRegistrationAvgAggregateOutputType | null;
    _sum: PendingRegistrationSumAggregateOutputType | null;
    _min: PendingRegistrationMinAggregateOutputType | null;
    _max: PendingRegistrationMaxAggregateOutputType | null;
};
type GetPendingRegistrationGroupByPayload<T extends PendingRegistrationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PendingRegistrationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PendingRegistrationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PendingRegistrationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PendingRegistrationGroupByOutputType[P]>;
}>>;
export type PendingRegistrationWhereInput = {
    AND?: Prisma.PendingRegistrationWhereInput | Prisma.PendingRegistrationWhereInput[];
    OR?: Prisma.PendingRegistrationWhereInput[];
    NOT?: Prisma.PendingRegistrationWhereInput | Prisma.PendingRegistrationWhereInput[];
    id?: Prisma.StringFilter<"PendingRegistration"> | string;
    email?: Prisma.StringFilter<"PendingRegistration"> | string;
    name?: Prisma.StringNullableFilter<"PendingRegistration"> | string | null;
    passwordHash?: Prisma.StringFilter<"PendingRegistration"> | string;
    role?: Prisma.EnumRoleFilter<"PendingRegistration"> | $Enums.Role;
    language?: Prisma.EnumLanguageFilter<"PendingRegistration"> | $Enums.Language;
    locale?: Prisma.StringFilter<"PendingRegistration"> | string;
    codeHash?: Prisma.StringFilter<"PendingRegistration"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PendingRegistration"> | Date | string;
    attempts?: Prisma.IntFilter<"PendingRegistration"> | number;
    createdAt?: Prisma.DateTimeFilter<"PendingRegistration"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PendingRegistration"> | Date | string;
};
export type PendingRegistrationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    language?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PendingRegistrationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.PendingRegistrationWhereInput | Prisma.PendingRegistrationWhereInput[];
    OR?: Prisma.PendingRegistrationWhereInput[];
    NOT?: Prisma.PendingRegistrationWhereInput | Prisma.PendingRegistrationWhereInput[];
    name?: Prisma.StringNullableFilter<"PendingRegistration"> | string | null;
    passwordHash?: Prisma.StringFilter<"PendingRegistration"> | string;
    role?: Prisma.EnumRoleFilter<"PendingRegistration"> | $Enums.Role;
    language?: Prisma.EnumLanguageFilter<"PendingRegistration"> | $Enums.Language;
    locale?: Prisma.StringFilter<"PendingRegistration"> | string;
    codeHash?: Prisma.StringFilter<"PendingRegistration"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PendingRegistration"> | Date | string;
    attempts?: Prisma.IntFilter<"PendingRegistration"> | number;
    createdAt?: Prisma.DateTimeFilter<"PendingRegistration"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PendingRegistration"> | Date | string;
}, "id" | "email">;
export type PendingRegistrationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    language?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PendingRegistrationCountOrderByAggregateInput;
    _avg?: Prisma.PendingRegistrationAvgOrderByAggregateInput;
    _max?: Prisma.PendingRegistrationMaxOrderByAggregateInput;
    _min?: Prisma.PendingRegistrationMinOrderByAggregateInput;
    _sum?: Prisma.PendingRegistrationSumOrderByAggregateInput;
};
export type PendingRegistrationScalarWhereWithAggregatesInput = {
    AND?: Prisma.PendingRegistrationScalarWhereWithAggregatesInput | Prisma.PendingRegistrationScalarWhereWithAggregatesInput[];
    OR?: Prisma.PendingRegistrationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PendingRegistrationScalarWhereWithAggregatesInput | Prisma.PendingRegistrationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PendingRegistration"> | string;
    email?: Prisma.StringWithAggregatesFilter<"PendingRegistration"> | string;
    name?: Prisma.StringNullableWithAggregatesFilter<"PendingRegistration"> | string | null;
    passwordHash?: Prisma.StringWithAggregatesFilter<"PendingRegistration"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"PendingRegistration"> | $Enums.Role;
    language?: Prisma.EnumLanguageWithAggregatesFilter<"PendingRegistration"> | $Enums.Language;
    locale?: Prisma.StringWithAggregatesFilter<"PendingRegistration"> | string;
    codeHash?: Prisma.StringWithAggregatesFilter<"PendingRegistration"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string;
    attempts?: Prisma.IntWithAggregatesFilter<"PendingRegistration"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string;
};
export type PendingRegistrationCreateInput = {
    id?: string;
    email: string;
    name?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    language?: $Enums.Language;
    locale?: string;
    codeHash: string;
    expiresAt: Date | string;
    attempts?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PendingRegistrationUncheckedCreateInput = {
    id?: string;
    email: string;
    name?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    language?: $Enums.Language;
    locale?: string;
    codeHash: string;
    expiresAt: Date | string;
    attempts?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PendingRegistrationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    language?: Prisma.EnumLanguageFieldUpdateOperationsInput | $Enums.Language;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PendingRegistrationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    language?: Prisma.EnumLanguageFieldUpdateOperationsInput | $Enums.Language;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PendingRegistrationCreateManyInput = {
    id?: string;
    email: string;
    name?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    language?: $Enums.Language;
    locale?: string;
    codeHash: string;
    expiresAt: Date | string;
    attempts?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PendingRegistrationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    language?: Prisma.EnumLanguageFieldUpdateOperationsInput | $Enums.Language;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PendingRegistrationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    language?: Prisma.EnumLanguageFieldUpdateOperationsInput | $Enums.Language;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attempts?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PendingRegistrationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    language?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PendingRegistrationAvgOrderByAggregateInput = {
    attempts?: Prisma.SortOrder;
};
export type PendingRegistrationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    language?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PendingRegistrationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    language?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    attempts?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PendingRegistrationSumOrderByAggregateInput = {
    attempts?: Prisma.SortOrder;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type PendingRegistrationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    language?: boolean;
    locale?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["pendingRegistration"]>;
export type PendingRegistrationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    language?: boolean;
    locale?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["pendingRegistration"]>;
export type PendingRegistrationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    language?: boolean;
    locale?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["pendingRegistration"]>;
export type PendingRegistrationSelectScalar = {
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    language?: boolean;
    locale?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    attempts?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PendingRegistrationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "role" | "language" | "locale" | "codeHash" | "expiresAt" | "attempts" | "createdAt" | "updatedAt", ExtArgs["result"]["pendingRegistration"]>;
export type $PendingRegistrationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PendingRegistration";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        name: string | null;
        passwordHash: string;
        role: $Enums.Role;
        language: $Enums.Language;
        locale: string;
        codeHash: string;
        expiresAt: Date;
        attempts: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["pendingRegistration"]>;
    composites: {};
};
export type PendingRegistrationGetPayload<S extends boolean | null | undefined | PendingRegistrationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload, S>;
export type PendingRegistrationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PendingRegistrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PendingRegistrationCountAggregateInputType | true;
};
export interface PendingRegistrationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PendingRegistration'];
        meta: {
            name: 'PendingRegistration';
        };
    };
    findUnique<T extends PendingRegistrationFindUniqueArgs>(args: Prisma.SelectSubset<T, PendingRegistrationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PendingRegistrationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PendingRegistrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PendingRegistrationFindFirstArgs>(args?: Prisma.SelectSubset<T, PendingRegistrationFindFirstArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PendingRegistrationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PendingRegistrationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PendingRegistrationFindManyArgs>(args?: Prisma.SelectSubset<T, PendingRegistrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PendingRegistrationCreateArgs>(args: Prisma.SelectSubset<T, PendingRegistrationCreateArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PendingRegistrationCreateManyArgs>(args?: Prisma.SelectSubset<T, PendingRegistrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PendingRegistrationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PendingRegistrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PendingRegistrationDeleteArgs>(args: Prisma.SelectSubset<T, PendingRegistrationDeleteArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PendingRegistrationUpdateArgs>(args: Prisma.SelectSubset<T, PendingRegistrationUpdateArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PendingRegistrationDeleteManyArgs>(args?: Prisma.SelectSubset<T, PendingRegistrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PendingRegistrationUpdateManyArgs>(args: Prisma.SelectSubset<T, PendingRegistrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PendingRegistrationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PendingRegistrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PendingRegistrationUpsertArgs>(args: Prisma.SelectSubset<T, PendingRegistrationUpsertArgs<ExtArgs>>): Prisma.Prisma__PendingRegistrationClient<runtime.Types.Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PendingRegistrationCountArgs>(args?: Prisma.Subset<T, PendingRegistrationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PendingRegistrationCountAggregateOutputType> : number>;
    aggregate<T extends PendingRegistrationAggregateArgs>(args: Prisma.Subset<T, PendingRegistrationAggregateArgs>): Prisma.PrismaPromise<GetPendingRegistrationAggregateType<T>>;
    groupBy<T extends PendingRegistrationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PendingRegistrationGroupByArgs['orderBy'];
    } : {
        orderBy?: PendingRegistrationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PendingRegistrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingRegistrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PendingRegistrationFieldRefs;
}
export interface Prisma__PendingRegistrationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PendingRegistrationFieldRefs {
    readonly id: Prisma.FieldRef<"PendingRegistration", 'String'>;
    readonly email: Prisma.FieldRef<"PendingRegistration", 'String'>;
    readonly name: Prisma.FieldRef<"PendingRegistration", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"PendingRegistration", 'String'>;
    readonly role: Prisma.FieldRef<"PendingRegistration", 'Role'>;
    readonly language: Prisma.FieldRef<"PendingRegistration", 'Language'>;
    readonly locale: Prisma.FieldRef<"PendingRegistration", 'String'>;
    readonly codeHash: Prisma.FieldRef<"PendingRegistration", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"PendingRegistration", 'DateTime'>;
    readonly attempts: Prisma.FieldRef<"PendingRegistration", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"PendingRegistration", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PendingRegistration", 'DateTime'>;
}
export type PendingRegistrationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    where: Prisma.PendingRegistrationWhereUniqueInput;
};
export type PendingRegistrationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    where: Prisma.PendingRegistrationWhereUniqueInput;
};
export type PendingRegistrationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    where?: Prisma.PendingRegistrationWhereInput;
    orderBy?: Prisma.PendingRegistrationOrderByWithRelationInput | Prisma.PendingRegistrationOrderByWithRelationInput[];
    cursor?: Prisma.PendingRegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PendingRegistrationScalarFieldEnum | Prisma.PendingRegistrationScalarFieldEnum[];
};
export type PendingRegistrationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    where?: Prisma.PendingRegistrationWhereInput;
    orderBy?: Prisma.PendingRegistrationOrderByWithRelationInput | Prisma.PendingRegistrationOrderByWithRelationInput[];
    cursor?: Prisma.PendingRegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PendingRegistrationScalarFieldEnum | Prisma.PendingRegistrationScalarFieldEnum[];
};
export type PendingRegistrationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    where?: Prisma.PendingRegistrationWhereInput;
    orderBy?: Prisma.PendingRegistrationOrderByWithRelationInput | Prisma.PendingRegistrationOrderByWithRelationInput[];
    cursor?: Prisma.PendingRegistrationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PendingRegistrationScalarFieldEnum | Prisma.PendingRegistrationScalarFieldEnum[];
};
export type PendingRegistrationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PendingRegistrationCreateInput, Prisma.PendingRegistrationUncheckedCreateInput>;
};
export type PendingRegistrationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PendingRegistrationCreateManyInput | Prisma.PendingRegistrationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PendingRegistrationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    data: Prisma.PendingRegistrationCreateManyInput | Prisma.PendingRegistrationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PendingRegistrationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PendingRegistrationUpdateInput, Prisma.PendingRegistrationUncheckedUpdateInput>;
    where: Prisma.PendingRegistrationWhereUniqueInput;
};
export type PendingRegistrationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PendingRegistrationUpdateManyMutationInput, Prisma.PendingRegistrationUncheckedUpdateManyInput>;
    where?: Prisma.PendingRegistrationWhereInput;
    limit?: number;
};
export type PendingRegistrationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PendingRegistrationUpdateManyMutationInput, Prisma.PendingRegistrationUncheckedUpdateManyInput>;
    where?: Prisma.PendingRegistrationWhereInput;
    limit?: number;
};
export type PendingRegistrationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    where: Prisma.PendingRegistrationWhereUniqueInput;
    create: Prisma.XOR<Prisma.PendingRegistrationCreateInput, Prisma.PendingRegistrationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PendingRegistrationUpdateInput, Prisma.PendingRegistrationUncheckedUpdateInput>;
};
export type PendingRegistrationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
    where: Prisma.PendingRegistrationWhereUniqueInput;
};
export type PendingRegistrationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PendingRegistrationWhereInput;
    limit?: number;
};
export type PendingRegistrationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PendingRegistrationSelect<ExtArgs> | null;
    omit?: Prisma.PendingRegistrationOmit<ExtArgs> | null;
};
export {};
