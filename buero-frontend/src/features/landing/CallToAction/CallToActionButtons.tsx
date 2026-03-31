import React from 'react';
import { Icon } from '@/components/ui';
import LinkBtn from '@/components/ui/Link';
import { ICON_NAMES } from '@/helpers/iconNames';

type CallToActionButtonsProps = {
  primaryText: string;
  primaryTo: string;
  secondaryText: string;
  secondaryTo: string;
};

const CallToActionButtons: React.FC<CallToActionButtonsProps> = ({
  secondaryText,
  secondaryTo,
}) => (
  <div
    className="flex w-full justify-center"
    aria-label="Call to action buttons"
  >
    <LinkBtn to={secondaryTo} variant="outline" className="px-12">
      {secondaryText}
    </LinkBtn>
  </div>
);

export default CallToActionButtons;
