import { IconName } from "@/types/helpers/iconSpite.types";

type IconProps = {
  name: IconName;
  width?: number;
  height?: number;
  size?: number;
  /** Товщина обводки (stroke-width). Впливає на іконки з stroke. */
  strokeWidth?: number;
  className?: string;
  color?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
};

export type { IconProps };