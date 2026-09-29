import { HeroTitleProps } from '@/types/features/home/Hero.types';
import React from 'react';

const HeroTitle: React.FC<HeroTitleProps> = ({ children }) => {
  return (
    <h1
      className="flex flex-col gap-1 text-center font-[family-name:var(--font-heading)] text-[clamp(2.5rem,5.2vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.045em] text-white"
      aria-label="Hero Title"
    >
      {children}
    </h1>
  );
};

export default HeroTitle;
