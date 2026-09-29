import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section } from '@/components/layout';
import Reveal from '@/features/landing/shared/Reveal';
import CatalogBackground from './CatalogBackground';

export type CoursesCatalogHeroProps = {
  /**
   * The "where do I start" block, beside the title rather than below the fold.
   *
   * It takes the place the search box used to hold. Search answers "which of these is
   * called X", which is not the question someone arriving at a course catalogue has; it now
   * sits in the filter bar with the other ways of narrowing the list.
   */
  whereToStartSlot?: ReactNode;
};

const CoursesCatalogHero: FC<CoursesCatalogHeroProps> = ({ whereToStartSlot }) => {
  const { t } = useTranslation();

  return (
    <Section className="pb-0">
      <div className="relative flex min-h-[calc(36rem-20px)] w-full items-center overflow-hidden sm:min-h-[calc(40rem-20px)] lg:min-h-[calc(46rem-20px)]">
        <CatalogBackground />
        <Container className="relative z-10 flex w-full flex-col gap-8 py-28 sm:py-32 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-36">
          <div className="min-w-0 max-w-xl flex-1">
            <Reveal>
              <p className="mb-4 text-xs font-bold tracking-[0.16em] uppercase text-[var(--color-accent-primary)]">
                {t('courses.catalogEyebrow')}
              </p>
              <h1 className="mb-5 max-w-full font-[family-name:var(--font-heading)] text-4xl leading-[0.95] font-bold tracking-[-0.04em] break-words text-[var(--color-white)] sm:text-6xl lg:text-7xl">
                {t('courses.catalogTitle')}
              </h1>
            </Reveal>
            <Reveal delayMs={140}>
              <p className="max-w-full text-base leading-relaxed text-balance text-white/85 sm:max-w-md sm:text-lg">
                {t('courses.catalogDescription')}
              </p>
            </Reveal>
          </div>

          {whereToStartSlot ? (
            <Reveal delayMs={220}>
              <div className="w-full min-w-0 lg:w-[420px] lg:shrink-0">{whereToStartSlot}</div>
            </Reveal>
          ) : null}
        </Container>
      </div>
    </Section>
  );
};

export default CoursesCatalogHero;
