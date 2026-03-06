import { HeroSubtextProps } from '@/types/features/home/Hero.types';
import React from 'react';

const HeroSubtext: React.FC<HeroSubtextProps> = ({ children }) => {
  return (
    <p className="text-base leading-[1.5] font-semibold sm:text-[1.3rem] md:text-[1.25rem]">
      {children}
    </p>
  );
};

export default HeroSubtext;
