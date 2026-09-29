import { useTranslation } from 'react-i18next';

const BENEFITS = ['heroBenefitPace', 'heroBenefitLifetime', 'heroBenefitTrial'] as const;

const HeroBenefits = () => {
  const { t } = useTranslation();

  return (
    <ul
      className="flex max-w-lg flex-wrap justify-center gap-x-6 gap-y-2"
      aria-label={t('landing.heroBenefits')}
    >
      {BENEFITS.map((key, index) => (
        <li
          key={key}
          className="buero-hero-benefit flex items-center gap-2 text-sm text-white/80"
          style={{ animationDelay: `${360 + index * 110}ms` }}
        >
          <span
            className="size-1.5 shrink-0 rounded-full bg-[var(--color-accent-primary)]"
            aria-hidden
          />
          {t(`landing.${key}`)}
        </li>
      ))}
    </ul>
  );
};

export default HeroBenefits;
