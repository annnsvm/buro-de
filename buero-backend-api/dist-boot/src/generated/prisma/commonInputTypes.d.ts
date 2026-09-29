import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums";
import type * as Prisma from "./internal/prismaNamespace";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type EnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | Prisma.EnumLanguageFieldRefInput<$PrismaModel>;
    in?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type EnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | Prisma.EnumLanguageFieldRefInput<$PrismaModel>;
    in?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLanguageFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLanguageFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLevelNullableFilter<$PrismaModel> | $Enums.Level | null;
};
export type EnumLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.Level | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLevelNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLevelNullableFilter<$PrismaModel>;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type EnumCourseMaterialTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseMaterialType | Prisma.EnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCourseMaterialTypeFilter<$PrismaModel> | $Enums.CourseMaterialType;
};
export type JsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>, Required<JsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
export type JsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type EnumQuizModeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizMode | Prisma.EnumQuizModeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumQuizModeNullableFilter<$PrismaModel> | $Enums.QuizMode | null;
};
export type EnumCourseMaterialTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseMaterialType | Prisma.EnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCourseMaterialTypeWithAggregatesFilter<$PrismaModel> | $Enums.CourseMaterialType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCourseMaterialTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCourseMaterialTypeFilter<$PrismaModel>;
};
export type JsonWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonFilter<$PrismaModel>;
};
export type EnumQuizModeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizMode | Prisma.EnumQuizModeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumQuizModeNullableWithAggregatesFilter<$PrismaModel> | $Enums.QuizMode | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumQuizModeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumQuizModeNullableFilter<$PrismaModel>;
};
export type EnumAttachmentKindFilter<$PrismaModel = never> = {
    equals?: $Enums.AttachmentKind | Prisma.EnumAttachmentKindFieldRefInput<$PrismaModel>;
    in?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAttachmentKindFilter<$PrismaModel> | $Enums.AttachmentKind;
};
export type EnumAttachmentKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttachmentKind | Prisma.EnumAttachmentKindFieldRefInput<$PrismaModel>;
    in?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAttachmentKindWithAggregatesFilter<$PrismaModel> | $Enums.AttachmentKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAttachmentKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAttachmentKindFilter<$PrismaModel>;
};
export type EnumUserCourseAccessTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCourseAccessType | Prisma.EnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserCourseAccessTypeFilter<$PrismaModel> | $Enums.UserCourseAccessType;
};
export type EnumUserCourseAccessTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCourseAccessType | Prisma.EnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserCourseAccessTypeWithAggregatesFilter<$PrismaModel> | $Enums.UserCourseAccessType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserCourseAccessTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserCourseAccessTypeFilter<$PrismaModel>;
};
export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | Prisma.EnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus;
};
export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | Prisma.EnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSubscriptionStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSubscriptionStatusFilter<$PrismaModel>;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type JsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
};
export type EnumLessonRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonRequestStatus | Prisma.EnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLessonRequestStatusFilter<$PrismaModel> | $Enums.LessonRequestStatus;
};
export type EnumLessonRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonRequestStatus | Prisma.EnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLessonRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.LessonRequestStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLessonRequestStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLessonRequestStatusFilter<$PrismaModel>;
};
export type EnumVocabularyCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.VocabularyCategory | Prisma.EnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVocabularyCategoryFilter<$PrismaModel> | $Enums.VocabularyCategory;
};
export type EnumVocabularyCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VocabularyCategory | Prisma.EnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVocabularyCategoryWithAggregatesFilter<$PrismaModel> | $Enums.VocabularyCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumVocabularyCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumVocabularyCategoryFilter<$PrismaModel>;
};
export type EnumLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLevelFilter<$PrismaModel> | $Enums.Level;
};
export type EnumLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLevelWithAggregatesFilter<$PrismaModel> | $Enums.Level;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLevelFilter<$PrismaModel>;
};
export type EnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | Prisma.EnumQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType;
};
export type EnumPracticeBlockFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticeBlock | Prisma.EnumPracticeBlockFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticeBlockFilter<$PrismaModel> | $Enums.PracticeBlock;
};
export type EnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | Prisma.EnumQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumQuestionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumQuestionTypeFilter<$PrismaModel>;
};
export type EnumPracticeBlockWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticeBlock | Prisma.EnumPracticeBlockFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticeBlockWithAggregatesFilter<$PrismaModel> | $Enums.PracticeBlock;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPracticeBlockFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPracticeBlockFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type NestedEnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | Prisma.EnumLanguageFieldRefInput<$PrismaModel>;
    in?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type NestedEnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | Prisma.EnumLanguageFieldRefInput<$PrismaModel>;
    in?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Language[] | Prisma.ListEnumLanguageFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLanguageFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLanguageFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLevelNullableFilter<$PrismaModel> | $Enums.Level | null;
};
export type NestedEnumLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.Level | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLevelNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLevelNullableFilter<$PrismaModel>;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumCourseMaterialTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseMaterialType | Prisma.EnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCourseMaterialTypeFilter<$PrismaModel> | $Enums.CourseMaterialType;
};
export type NestedEnumQuizModeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizMode | Prisma.EnumQuizModeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumQuizModeNullableFilter<$PrismaModel> | $Enums.QuizMode | null;
};
export type NestedEnumCourseMaterialTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseMaterialType | Prisma.EnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CourseMaterialType[] | Prisma.ListEnumCourseMaterialTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCourseMaterialTypeWithAggregatesFilter<$PrismaModel> | $Enums.CourseMaterialType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCourseMaterialTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCourseMaterialTypeFilter<$PrismaModel>;
};
export type NestedJsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedEnumQuizModeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizMode | Prisma.EnumQuizModeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.QuizMode[] | Prisma.ListEnumQuizModeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumQuizModeNullableWithAggregatesFilter<$PrismaModel> | $Enums.QuizMode | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumQuizModeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumQuizModeNullableFilter<$PrismaModel>;
};
export type NestedEnumAttachmentKindFilter<$PrismaModel = never> = {
    equals?: $Enums.AttachmentKind | Prisma.EnumAttachmentKindFieldRefInput<$PrismaModel>;
    in?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAttachmentKindFilter<$PrismaModel> | $Enums.AttachmentKind;
};
export type NestedEnumAttachmentKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttachmentKind | Prisma.EnumAttachmentKindFieldRefInput<$PrismaModel>;
    in?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AttachmentKind[] | Prisma.ListEnumAttachmentKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAttachmentKindWithAggregatesFilter<$PrismaModel> | $Enums.AttachmentKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAttachmentKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAttachmentKindFilter<$PrismaModel>;
};
export type NestedEnumUserCourseAccessTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCourseAccessType | Prisma.EnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserCourseAccessTypeFilter<$PrismaModel> | $Enums.UserCourseAccessType;
};
export type NestedEnumUserCourseAccessTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCourseAccessType | Prisma.EnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserCourseAccessType[] | Prisma.ListEnumUserCourseAccessTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserCourseAccessTypeWithAggregatesFilter<$PrismaModel> | $Enums.UserCourseAccessType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserCourseAccessTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserCourseAccessTypeFilter<$PrismaModel>;
};
export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | Prisma.EnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus;
};
export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | Prisma.EnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SubscriptionStatus[] | Prisma.ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSubscriptionStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSubscriptionStatusFilter<$PrismaModel>;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedJsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedEnumLessonRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonRequestStatus | Prisma.EnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLessonRequestStatusFilter<$PrismaModel> | $Enums.LessonRequestStatus;
};
export type NestedEnumLessonRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonRequestStatus | Prisma.EnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LessonRequestStatus[] | Prisma.ListEnumLessonRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLessonRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.LessonRequestStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLessonRequestStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLessonRequestStatusFilter<$PrismaModel>;
};
export type NestedEnumVocabularyCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.VocabularyCategory | Prisma.EnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVocabularyCategoryFilter<$PrismaModel> | $Enums.VocabularyCategory;
};
export type NestedEnumVocabularyCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VocabularyCategory | Prisma.EnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.VocabularyCategory[] | Prisma.ListEnumVocabularyCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumVocabularyCategoryWithAggregatesFilter<$PrismaModel> | $Enums.VocabularyCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumVocabularyCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumVocabularyCategoryFilter<$PrismaModel>;
};
export type NestedEnumLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLevelFilter<$PrismaModel> | $Enums.Level;
};
export type NestedEnumLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Level[] | Prisma.ListEnumLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLevelWithAggregatesFilter<$PrismaModel> | $Enums.Level;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLevelFilter<$PrismaModel>;
};
export type NestedEnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | Prisma.EnumQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType;
};
export type NestedEnumPracticeBlockFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticeBlock | Prisma.EnumPracticeBlockFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticeBlockFilter<$PrismaModel> | $Enums.PracticeBlock;
};
export type NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | Prisma.EnumQuestionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuestionType[] | Prisma.ListEnumQuestionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumQuestionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumQuestionTypeFilter<$PrismaModel>;
};
export type NestedEnumPracticeBlockWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PracticeBlock | Prisma.EnumPracticeBlockFieldRefInput<$PrismaModel>;
    in?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PracticeBlock[] | Prisma.ListEnumPracticeBlockFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPracticeBlockWithAggregatesFilter<$PrismaModel> | $Enums.PracticeBlock;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPracticeBlockFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPracticeBlockFilter<$PrismaModel>;
};
