import React from 'react';
import LandingCta from '../shared/LandingCta';

type CallToActionButtonsProps = {
  primaryText: string;
  primaryTo: string;
};

const CallToActionButtons: React.FC<CallToActionButtonsProps> = ({
  primaryText,
  primaryTo,
}) => (
  <div className="flex w-full" aria-label="Call to action buttons">
    <LandingCta label={primaryText} to={primaryTo} align="start" />
  </div>
);

export default CallToActionButtons;
