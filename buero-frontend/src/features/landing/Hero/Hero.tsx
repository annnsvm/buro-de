import { Container, Section } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import Reveal from '../shared/Reveal';
import HeroBackground from './HeroBackground';
import HeroTitle from './HeroTitle';
import HeroActionBtn from './HeroActionBtn';
import HeroBenefits from './HeroBenefits';
import HeroPreview from './HeroPreview';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Section className="relative pb-0">
      <div className="relative flex min-h-dvh w-full items-center overflow-hidden pt-[calc(6rem+3.125rem)]">
        <HeroBackground />
        <Container className="relative z-10 grid w-full items-center gap-12 text-[var(--color-white)] lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:gap-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center" aria-label="Hero Content">
            <Reveal>
              <HeroTitle>
                <span className="block">{t('landing.heroTitle1')}</span>
                <span className="block text-[var(--color-accent-primary)]">{t('landing.heroTitle2')}</span>
              </HeroTitle>
            </Reveal>
            <Reveal delayMs={140} className="flex w-full flex-col items-center gap-8">
              <p className="max-w-[38rem] text-[1.25rem] leading-[1.5] font-normal text-balance text-[var(--color-white)]">
                {t('landing.heroDescription')}
              </p>
              <HeroActionBtn />
            </Reveal>
            <HeroBenefits />
          </div>
          <Reveal delayMs={180}>
            <HeroPreview />
          </Reveal>
        </Container>
      </div>
    </Section>
  );
};

export default Hero;
