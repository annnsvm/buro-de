import React from 'react';
import CallToActionBackground from './CallToActionBackground';

type CallToActionBannerProps = {
  children: React.ReactNode;
};

const CallToActionBanner: React.FC<CallToActionBannerProps> = ({ children }) => (
  <div className="relative min-h-[26rem] w-full overflow-hidden rounded-[28px] sm:min-h-[26rem] lg:min-h-[28rem]">
    <CallToActionBackground />
    {children}
  </div>
);

export default CallToActionBanner;
