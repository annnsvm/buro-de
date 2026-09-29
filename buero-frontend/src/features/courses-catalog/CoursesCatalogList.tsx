import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Section } from '@/components/layout';
import CourseCard from './CourseCard';
import CatalogPathStep from './CatalogPathStep';
import TeacherSortableCoursesGrid from './TeacherSortableCoursesGrid';
import { buildCatalogSections, levelRangeLabel } from './catalogSections';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';

type CoursesGridProps = {
  courses: CourseCardProps[];
  canReorderCourses?: boolean;
  /** Ids the "where do I start" block pointed at, highlighted in place. */
  recommendedCourseIds?: readonly string[];
};

/**
 * The catalogue, split into the two things it actually contains.
 *
 * One flat grid presented every course as an equally plausible place to begin, which is
 * the hardest version of the only question a visitor has. Language courses are now shown
 * as a route in order, and integration guides as a separate set — so the page answers
 * "in what order" before it is asked.
 *
 * The recommendation is drawn as a ring around the card rather than inside it: the card
 * says what a course is, and that does not change because of how someone answered three
 * questions.
 */
const CoursesCatalogList = ({
  courses,
  canReorderCourses = false,
  recommendedCourseIds = [],
}: CoursesGridProps) => {
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectUserRole);
  const { t } = useTranslation();

  const handleCourseDeleted = useCallback(() => {
    void dispatch(fetchCoursesCatalogThunk({ force: true }));
  }, [dispatch]);

  /**
   * Teachers keep the single sortable grid: the sections are a reading order for students,
   * while the teacher's job here is to drag courses into the order itself.
   */
  if (role === 'teacher') {
    return (
      <Section className="pt-12 pb-28">
        <Container>
          <TeacherSortableCoursesGrid
            courses={courses}
            dragEnabled={canReorderCourses}
            onCourseDeleted={handleCourseDeleted}
          />
        </Container>
      </Section>
    );
  }

  const sections = buildCatalogSections(courses);

  return (
    <Section className="pt-12 pb-28">
      <Container className="flex flex-col gap-16">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-4xl">
                {t(`courses.sections.${section.id}.title`)}
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-right">
                {t(`courses.sections.${section.id}.subtitle`)}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {section.courses.map((course, index) => {
                const isRecommended = recommendedCourseIds.includes(course.id);
                return (
                  <li key={course.id} className="flex min-w-0 flex-col gap-3">
                    {section.isPath ? (
                      <CatalogPathStep
                        step={index + 1}
                        levelLabel={levelRangeLabel(course)}
                        isRecommended={isRecommended}
                        connected={index < section.courses.length - 1}
                      />
                    ) : null}
                    <div
                      className={[
                        'flex flex-1 rounded-2xl transition-shadow',
                        isRecommended
                          ? 'ring-2 ring-[var(--color-accent-primary)] ring-offset-2 ring-offset-[var(--color-soapstone-base)]'
                          : '',
                      ].join(' ')}
                    >
                      <CourseCard
                        {...course}
                        imagePriority={index < 3}
                        variant="catalog"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Container>
    </Section>
  );
};

export default CoursesCatalogList;
