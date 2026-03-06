import LinkBtn from '@/components/ui/Link';
import React from 'react';

const HeroActionBtn: React.FC = () => {
  return (
    <ul className="flex flex-wrap gap-3 sm:gap-4" aria-label="Hero Links">
      <li>
        <LinkBtn to={'/'} variant="primary">
          Start free trial
        </LinkBtn>
      </li>
      <li>
        <LinkBtn to={'/'} variant="outline">
          Explore courses
        </LinkBtn>
      </li>
    </ul>
  );
};

export default HeroActionBtn;
