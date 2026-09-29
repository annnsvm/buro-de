import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * The two course faces from the landing composition, sitting on the existing photo.
 *
 * They are a picture of what the catalogue contains, not links: the button under the
 * title is what takes someone to the courses.
 */
const HeroPreview: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto h-[340px] w-full max-w-[460px] sm:h-[420px] lg:mx-0 lg:max-w-none">
      <article className="@container absolute top-0 right-0 w-[82%] rotate-[8deg] rounded-[28px] border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md sm:p-6">
        <p className="text-[11px] font-bold tracking-[0.14em] text-white/80 uppercase">
          {t('landing.heroCardIntegration')}
        </p>
        <div className="mt-3 h-0.5 w-14 bg-[var(--color-accent-primary)]/80" />
        <div className="mt-2 h-px w-full bg-white/20" />
        <p className="mt-6 max-w-full font-[family-name:var(--font-heading)] text-[clamp(1.75rem,14cqi,3.75rem)] leading-none font-bold tracking-[-0.04em] sm:mt-8">
          Ankommen
        </p>
      </article>

      <article className="absolute bottom-0 left-0 w-[74%] -rotate-[7deg] rounded-[28px] border border-white/25 bg-white/15 p-5 text-white backdrop-blur-md sm:p-6">
        <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-accent-primary)] uppercase">
          {t('landing.heroCardLanguage')}
        </p>
        <div className="mt-3 h-1 w-20 rounded-full bg-[var(--color-accent-primary)]/80" />
        <p className="mt-2 font-[family-name:var(--font-heading)] text-7xl leading-none font-bold tracking-[-0.06em] text-white/90 sm:text-8xl">
          A1
        </p>
      </article>
    </div>
  );
};

export default HeroPreview;
