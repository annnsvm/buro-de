import LinkBtn from '@/components/ui/Link';
import { Container } from '@/components/layout';
import { getCoursePath } from '@/helpers/routes';
import type { MyProgressCourse, ResumeLesson } from '@/api/progressApi';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

type MyLearningHeroProps = {
  name: string;
  resume: ResumeLesson | null;
  progressCourses: readonly MyProgressCourse[];
};

const finishedCourseTitle = (
  progressCourses: readonly MyProgressCourse[],
  resumeCourseId: string,
): string | null => {
  const finished = progressCourses.find(
    (course) => course.completion_percent === 100 && course.course_id !== resumeCourseId && course.course_title,
  );
  return finished?.course_title ?? null;
};

const MyLearningHero: FC<MyLearningHeroProps> = ({ name, resume, progressCourses }) => {
  const { t } = useTranslation();
  const finished = resume ? finishedCourseTitle(progressCourses, resume.course_id) : null;
  const hint = resume
    ? finished
      ? t('myLearning.continueAfter', { done: finished, course: resume.course_title })
      : t('myLearning.continueHint', { course: resume.course_title })
    : null;

  return (
    <section className="bg-[var(--color-soapstone-base)] pt-6 pb-8 sm:pt-8 sm:pb-10">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="min-w-0 max-w-xl">
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-[var(--color-accent-primary)] uppercase">
            {t('myLearning.eyebrow')}
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl leading-[0.95] font-bold tracking-[-0.04em] text-[var(--color-cod-gray-base)] sm:text-6xl">
            {name ? t('myLearning.greeting', { name }) : t('myLearning.greetingPlain')}
          </h1>
          {hint ? (
            <p className="mt-4 max-w-md text-base leading-[1.5] text-[var(--color-text-secondary)] sm:text-[1.125rem]">
              {hint}
            </p>
          ) : null}
        </div>

        {resume ? (
          <article className="w-full shrink-0 rounded-[28px] border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] p-6 sm:p-7 lg:w-[420px]">
            <p className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
              {t('myLearning.continueMeta', {
                course: resume.course_title,
                current: resume.lesson_number,
                total: resume.lesson_total,
              })}
            </p>
            <div className="mt-3 h-0.5 w-14 bg-[var(--color-accent-primary)]" />
            <p className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-[-0.03em] text-[var(--color-cod-gray-base)] sm:text-3xl">
              {resume.material_title}
            </p>
            <p className="mt-2 font-[family-name:var(--font-heading)] text-6xl leading-none font-bold tracking-[-0.05em] text-[var(--color-cod-gray-base)] sm:text-7xl">
              {resume.course_level ?? resume.course_title}
            </p>
            <div className="mt-6">
              <LinkBtn
                to={`${getCoursePath(resume.course_id)}?lesson=${resume.material_id}`}
                variant="dark"
                className="!w-auto px-6"
              >
                {t('myLearning.continueLesson')}
              </LinkBtn>
            </div>
          </article>
        ) : null}
      </Container>
    </section>
  );
};

export default MyLearningHero;
