import { ICON_NAMES } from "@/helpers/iconNames";

type IconName = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];


export type { IconName };