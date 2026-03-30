import { Icon } from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import LinkBtn from '@/components/ui/Link';
import { ROUTES } from '@/helpers/routes';
import React from 'react';

const HeroActionBtn: React.FC = () => {
  return (
    <div className="flex w-full justify-center">
      <LinkBtn
        to={ROUTES.COURSES}
        variant="primary"
        className="flex items-center justify-center gap-3 px-20 py-3"
      >
        <span>Get started</span>
        <Icon
          name={ICON_NAMES.ARROW_RIGHT}
          color="var(--color-white)"
          size={15}
          strokeWidth={3}
          className="animate-bounce-x"
        />
      </LinkBtn>
    </div>
  );
};

export default HeroActionBtn;
