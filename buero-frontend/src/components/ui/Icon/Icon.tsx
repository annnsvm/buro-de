import { SPRITE_URL } from '@/helpers/iconNames';
import type { IconProps } from '@/types/components/ui/Icon.types';

const DEFAULT_SIZE = 24;

const Icon = ({
  name,
  width,
  height,
  size,
  strokeWidth,
  className = '',
  color = 'currentColor',
  ariaHidden = true,
  ariaLabel,
}: IconProps) => {
  const w = size ?? width ?? DEFAULT_SIZE;
  const h = size ?? height ?? DEFAULT_SIZE;

  return (
    <svg
      className={className}
      width={w}
      height={h}
      fill={color}
      stroke={strokeWidth != null ? color : undefined}
      strokeWidth={strokeWidth}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      focusable={false}
      role={ariaLabel ? 'img' : undefined}
    >
      <use href={`${SPRITE_URL}#${name}`} />
    </svg>
  );
};

export default Icon;
