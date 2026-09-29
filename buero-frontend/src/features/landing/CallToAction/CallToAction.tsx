import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import type { CallToActionProps } from '@/types/features/home/CallToAction.types';
import CallToActionBanner from './CallToActionBanner';
import CallToActionButtons from './CallToActionButtons';

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryButtonText,
  primaryButtonTo = ROUTES.COURSES,
}) => {
  const { t } = useTranslation();

  return (
    <Section className="bg-[var(--color-cod-gray-dark)] py-6 sm:py-10 lg:py-12">
      <Container>
        <CallToActionBanner>
          <div className="relative z-10 flex min-h-[26rem] flex-col justify-start px-6 pt-8 pb-28 text-[var(--color-white)] sm:min-h-[26rem] sm:justify-center sm:px-10 sm:py-12 lg:min-h-[28rem] lg:px-14 lg:py-14">
            <div className="max-w-lg">
              <h2 className="max-w-[11em] font-[family-name:var(--font-heading)] text-[clamp(1.85rem,3.1vw,3.15rem)] leading-[0.98] font-bold tracking-[-0.04em]">
                {title ?? t('landing.ctaTitle')}
              </h2>
              <p className="mt-4 max-w-md text-base leading-[1.5] font-normal text-white/90 sm:text-[1.05rem]">
                {description ?? t('landing.ctaDescription')}
              </p>
              <div className="mt-6">
                <CallToActionButtons
                  primaryText={primaryButtonText ?? t('landing.startFreeTrial')}
                  primaryTo={primaryButtonTo}
                />
              </div>
            </div>

            <article className="pointer-events-none absolute right-[-8%] bottom-[-10%] w-[68%] max-w-[260px] rotate-[7deg] rounded-[24px] border border-white/25 bg-white/15 p-4 text-white backdrop-blur-md sm:right-[-3%] sm:bottom-[-6%] sm:w-[40%] sm:max-w-[380px] sm:p-6">
              <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-accent-primary)] uppercase">
                {t('landing.ctaCardLanguage')}
              </p>
              <div className="mt-3 h-1 w-16 rounded-full bg-[var(--color-accent-primary)]/80" />
              <p className="mt-2 font-[family-name:var(--font-heading)] text-6xl leading-none font-bold tracking-[-0.06em] text-white/90 sm:text-7xl">
                B1
              </p>
            </article>
          </div>
        </CallToActionBanner>
      </Container>
    </Section>
  );
};

export default CallToAction;
