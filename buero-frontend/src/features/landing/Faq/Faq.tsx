import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container, Section, SectionTitle, Text, Title } from '@/components/layout';
import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ROUTES } from '@/helpers/routes';

type FaqItem = {
  q: string;
  a: string;
  /** Where the full answer lives, for the questions a short answer cannot finish. */
  readMore?: { to: string; label: string };
};

const FAQ_ITEMS: readonly FaqItem[] = [
  { q: 'faqQ1', a: 'faqA1' },
  { q: 'faqQ2', a: 'faqA2' },
  { q: 'faqQ3', a: 'faqA3' },
  { q: 'faqQ4', a: 'faqA4' },
  { q: 'faqQ5', a: 'faqA5' },
  { q: 'faqQ6', a: 'faqA6' },
  { q: 'faqQ8', a: 'faqA8' },
  /**
   * Money back is the one answer somebody reads before deciding to pay, and the short
   * version cannot carry the conditions, so it points at the terms rather than paraphrasing
   * them into something the offer does not say.
   */
  {
    q: 'faqQ7',
    a: 'faqA7',
    readMore: { to: ROUTES.PAYMENT, label: 'faqLinkPayment' },
  },
];

const Faq: React.FC = () => {
  const { t } = useTranslation();
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="scroll-mt-8 bg-[var(--color-soapstone-base)] py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <SectionTitle label={t('landing.faqSection')} className="mb-4">
            {t('landing.faqSection')}
          </SectionTitle>
          <Title className="mb-4">{t('landing.faqTitle')}</Title>
          <Text label={t('landing.faqSubtitle')} className="mb-10">
            {t('landing.faqSubtitle')}
          </Text>
        </div>

        <div className="mx-auto max-w-3xl divide-y divide-[var(--opacity-neutral-darkest-15)] border-y border-[var(--opacity-neutral-darkest-15)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-[family-name:var(--font-heading)] text-[1.05rem] leading-[1.35] font-semibold text-[var(--color-cod-gray-base)] sm:text-[1.2rem]">
                      {t(`landing.${item.q}`)}
                    </span>
                    <Icon
                      name={isOpen ? ICON_NAMES.CHEVRON_UP : ICON_NAMES.CHEVRON_DOWN}
                      size={18}
                      color="var(--color-burnt-siena-dark)"
                      className="shrink-0"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5"
                >
                  <p className="max-w-[640px] text-[1.05rem] leading-[1.6] text-[var(--color-text-primary)]">
                    {t(`landing.${item.a}`)}
                  </p>
                  {item.readMore ? (
                    <Link
                      to={item.readMore.to}
                      className="mt-3 inline-block text-[1.05rem] text-[var(--color-burnt-siena-dark)] underline underline-offset-4 hover:opacity-80"
                    >
                      {t(`landing.${item.readMore.label}`)}
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default Faq;
