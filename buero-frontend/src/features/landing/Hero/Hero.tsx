import { Container, Section } from '@/components/layout';
import HeroBackground from './HeroBackground';
import HeroTitle from './HeroTitle';
import HeroActionBtn from './HeroActionBtn';
import HeroSubtext from './HeroSubtext';

const Hero: React.FC = () => {
  return (
    <Section className="py-0">
      <div className="relative h-[900px] w-full overflow-hidden">
        <HeroBackground />
        <Container className="relative z-10 flex justify-center pt-60 md:pt-47 text-[var(--color-white)]">
          <div className="flex w-full max-w-[640px] flex-col gap-12 sm:gap-18 md:gap-20" aria-label="Hero Content">
            <HeroTitle>
              <span>Learn German.</span>
              <span>Live German.</span>
            </HeroTitle>
            <HeroSubtext>
              More than language course. Master German while learning to navigate real life in
              Germany — from bureaucracy to Brezeln
            </HeroSubtext>
            <HeroActionBtn />
          </div>
        </Container>
      </div>
    </Section>
  );
};

export { Hero };
