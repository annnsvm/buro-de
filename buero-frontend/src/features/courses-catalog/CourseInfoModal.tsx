import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hooks';
import { BaseDialog, useModal } from '@/components/modal';
import { Button } from '@/components/ui';
import CheckoutButton from '@/features/subscriptions/components/CheckoutButton';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { subscriptionApi } from '@/api/subscriptionApi';
import { prefetchCourseWorkspace } from '@/api/courseWorkspaceCache';
import { optimizeCloudinaryUrl } from '@/helpers/optimizeCloudinaryUrl';
import { getCoursePath } from '@/helpers/routes';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import CourseStructure from './CourseStructure';
import { courseStructureKeyFromModules } from './courseStructure.helpers';
import { userHasAccessToCourse } from './courseAccessModal.helpers';
import { fetchCourseByIdThunk } from '@/redux/slices/coursesCatalog/courseDetailsThunks';
import { clearCourseDetails } from '@/redux/slices/coursesCatalog/courseDetailsSlice';
import {
  selectCourseDetailsData,
  selectCourseDetailsStatus,
} from '@/redux/slices/coursesCatalog/courseDetailsSelectors';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';
import { requestCourseTrial } from '@/features/courses-catalog/courseTrialFlow';
import {
  applyTrialModuleScope,
  type ApiCourseWithTree,
} from '@/pages/CoursePage/coursePageMappers';
import { isCourseComingSoon } from './isCourseComingSoon';

const useQuietScrollRef = () => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  return useCallback((node: HTMLDivElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!node) return;

    let timer = 0;
    const onScroll = () => {
      node.classList.add('is-scrolling');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => node.classList.remove('is-scrolling'), 700);
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    cleanupRef.current = () => {
      node.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
      node.classList.remove('is-scrolling');
    };
  }, []);
};

type CourseInfoModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onExitAnimationComplete?: () => void;
  courseId: string;
  course: CourseInfoData;
};

const CourseInfoModal: React.FC<CourseInfoModalProps> = ({
  isOpen,
  handleOpenChange,
  onExitAnimationComplete,
  courseId,
  course,
}) => {
  const { pushUiModal } = useModal();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const fullCourseData = useSelector(selectCourseDetailsData);
  const status = useSelector(selectCourseDetailsStatus);
  const isLoading = status === 'loading';
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const [accessResolved, setAccessResolved] = useState(false);
  const [hasCourseAccess, setHasCourseAccess] = useState(false);
  const [localPublished, setLocalPublished] = useState<boolean | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const modalScrollRef = useQuietScrollRef();
  const leftScrollRef = useQuietScrollRef();
  const rightScrollRef = useQuietScrollRef();

  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';
  const publishedEffective =
    localPublished ?? (typeof course.isPublished === 'boolean' ? course.isPublished : false);

  useEffect(() => {
    if (isOpen && courseId) {
      dispatch(fetchCourseByIdThunk(courseId));
    } else if (!isOpen) {
      dispatch(clearCourseDetails());
    }
  }, [isOpen, courseId, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setAccessResolved(false);
      setHasCourseAccess(false);
      setLocalPublished(null);
    } else {
      setLocalPublished(null);
      setDescriptionOpen(false);
    }
  }, [isOpen, courseId]);

  useEffect(() => {
    if (!isOpen || !courseId) return;

    if (!isAuthenticated || !isStudent) {
      setAccessResolved(true);
      setHasCourseAccess(false);
      return;
    }

    let cancelled = false;
    setAccessResolved(false);

    void (async () => {
      try {
        const list = await subscriptionApi.getMyAccess();
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        const hasAccess = userHasAccessToCourse(arr, courseId);
        setHasCourseAccess(hasAccess);
        if (hasAccess) prefetchCourseWorkspace(courseId);
      } catch {
        if (!cancelled) {
          setHasCourseAccess(false);
        }
      } finally {
        if (!cancelled) setAccessResolved(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, courseId, isAuthenticated, isStudent]);

  const handleClose = () => handleOpenChange(false);

  const handleContinueLearning = () => {
    prefetchCourseWorkspace(courseId);
    handleClose();
    navigate(getCoursePath(courseId));
  };

  const handleTryForFree = async () => {
    if (course.hasTrial === false) return;
    await requestCourseTrial(courseId, isAuthenticated, dispatch, navigate);
    handleClose();
  };

  const handleTogglePublication = useCallback(async () => {
    if (!courseId || isPublishing) return;
    const next = !publishedEffective;
    setIsPublishing(true);
    try {
      await apiInstance.patch(API_ENDPOINTS.courses.update(courseId), {
        is_published: next,
      });
      setLocalPublished(next);
      dispatch(fetchCoursesCatalogThunk({ force: true }));
      dispatch(fetchCourseByIdThunk(courseId));
    } finally {
      setIsPublishing(false);
    }
  }, [courseId, dispatch, isPublishing, publishedEffective]);

  const handleContactSupport = () => {
    pushUiModal({
      type: 'contactSupport',
      courseId,
      subject: t('courses.modal.supportSubject'),
    });
  };

  const cleanPrice =
    parseFloat(
      String(course.price)
        .replace(/[^\d.,]/g, '')
        .replace(',', '.'),
    ) || 69;

  const totalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(cleanPrice);

  /**
   * A trial is a standing per-course free tier, so an active trial on another course
   * must not hide this one's button. Courses already unlocked show "Continue learning"
   * via `hasCourseAccess` above, so reaching here means the student may still try it.
   */
  const canShowTryForFree = course.hasTrial !== false;

  const comingSoon = isCourseComingSoon({
    isPublished: publishedEffective,
    lessonsCount: course.lessonsCount,
  });

  const scopedCourseDetails = useMemo(() => {
    if (!fullCourseData) return null;
    return applyTrialModuleScope(fullCourseData as ApiCourseWithTree);
  }, [fullCourseData]);

  const hasAnyMaterials = scopedCourseDetails?.modules?.some(
    (mod) => mod.materials && mod.materials.length > 0,
  );

  const rawModules =
    hasAnyMaterials && scopedCourseDetails?.modules ? scopedCourseDetails.modules : [];

  const descriptionIsLong = course.description.trim().length > 140;

  const contentClassName = [
    'buero-dialog-panel-tall relative z-[1] flex min-h-0 w-[min(920px,calc(100vw-1rem))] flex-col overflow-hidden',
    'sm:w-[min(920px,calc(100vw-2rem))]',
    'rounded-xl sm:rounded-2xl bg-[var(--color-neutral-white)] focus:outline-none',
  ].join(' ');
  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      openCloseAnimation
      onExitAnimationComplete={onExitAnimationComplete}
      contentClassName={contentClassName}
      closeButtonClassName="border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
    >
      <div
        ref={modalScrollRef}
        className="buero-scroll-quiet h-full min-h-0 overflow-y-auto lg:grid lg:h-full lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden"
      >
        <div
          ref={leftScrollRef}
          className="buero-scroll-quiet px-5 pt-16 pb-6 sm:px-8 sm:pt-20 sm:pb-8 md:pt-24 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pt-5 lg:pb-4"
        >
          <div className="mx-auto w-full max-w-[26rem] overflow-hidden rounded-[24px] bg-[var(--color-soapstone-base)] lg:max-w-[22rem]">
            <img
              src={optimizeCloudinaryUrl(course.imageUrl, 'modal')}
              alt=""
              className="aspect-[16/10] w-full object-cover"
              decoding="async"
            />
          </div>

          <h2 className="mt-3 text-2xl leading-snug font-semibold tracking-[-0.02em] text-[var(--color-neutral-darkest)] sm:text-3xl">
            {course.title}
          </h2>
          <p
            className={[
              'mt-2 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]',
              descriptionOpen ? '' : 'line-clamp-2',
            ].join(' ')}
          >
            {course.description}
          </p>
          {descriptionIsLong ? (
            <button
              type="button"
              onClick={() => setDescriptionOpen((open) => !open)}
              className="mt-2 text-base font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-border-strong)] underline-offset-4"
            >
              {descriptionOpen ? t('courses.modal.readLess') : t('courses.modal.readMore')}
            </button>
          ) : null}

          <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-[var(--color-border-default)] py-3 text-sm text-[var(--color-text-secondary)]">
            <div>
              <dt>{t('courses.modal.lessons')}</dt>
              <dd className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--color-neutral-darkest)]">
                {course.lessonsCount}
              </dd>
            </div>
            <div>
              <dt>{t('courses.modal.duration')}</dt>
              <dd className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--color-neutral-darkest)]">
                {t('courses.modal.hours', { count: course.durationHours })}
              </dd>
            </div>
            <div>
              <dt>{t('courses.level')}</dt>
              <dd className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
                {course.levelLabel}
              </dd>
            </div>
          </dl>

          <div className="mt-3" role="region" aria-label={t('courses.modal.priceActions')}>
            <p className="text-3xl font-semibold tracking-[-0.02em] text-[var(--color-neutral-darkest)] sm:text-4xl">
              {totalPrice}
            </p>
            <p className="mt-1 text-base text-[var(--color-text-secondary)]">{t('courses.modal.priceNote')}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {isTeacher ? (
                <Button
                  type="button"
                  variant="outlineDark"
                  className="rounded-full px-6 py-3 text-base font-semibold"
                  disabled={isPublishing}
                  onClick={handleTogglePublication}
                  aria-label={
                    publishedEffective
                      ? t('courses.modal.unpublishCourse')
                      : t('courses.modal.publishCourse')
                  }
                >
                  {isPublishing
                    ? t('courses.modal.saving')
                    : publishedEffective
                      ? t('courses.modal.unpublish')
                      : t('courses.modal.publish')}
                </Button>
              ) : isStudent && isAuthenticated && !accessResolved ? (
                <p className="text-sm text-[var(--color-text-secondary)]" aria-live="polite">
                  {t('courses.modal.checkingAccess')}
                </p>
              ) : isStudent && isAuthenticated && hasCourseAccess ? (
                <Button
                  type="button"
                  variant="solid"
                  className="rounded-full border-0 px-6 py-3 text-base font-semibold text-[var(--color-text-on-accent)]"
                  onClick={handleContinueLearning}
                >
                  {t('courses.continueLearning')}
                </Button>
              ) : comingSoon ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-section)] px-6 py-3 text-base font-semibold text-[var(--color-text-secondary)]"
                >
                  {t('courses.comingSoon')}
                </button>
              ) : (
                <>
                  <CheckoutButton
                    courseId={courseId}
                    label={t('courses.modal.buyCourse')}
                    onRequireAuth={handleClose}
                    className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-[var(--color-text-on-accent)] hover:bg-[var(--color-primary-hover)]"
                  />
                  {canShowTryForFree ? (
                    <button
                      type="button"
                      onClick={handleTryForFree}
                      className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-neutral-white)] px-6 py-3 text-base font-semibold text-[var(--color-text-primary)] hover:bg-[var(--opacity-neutral-darkest-5)]"
                      aria-label={t('courses.modal.tryForFreeAria')}
                    >
                      {t('courses.modal.tryForFree')}
                    </button>
                  ) : null}
                </>
              )}
            </div>
            {canShowTryForFree && !hasCourseAccess && !comingSoon && !isTeacher ? (
              <p className="mt-3 text-base text-[var(--color-text-secondary)]">{t('courses.modal.trialNote')}</p>
            ) : null}
            <button
              type="button"
              onClick={handleContactSupport}
              className="mt-2 text-base font-semibold text-[var(--color-text-secondary)] underline decoration-[var(--color-border-default)] underline-offset-4 hover:text-[var(--color-text-primary)]"
            >
              {t('courses.modal.contactSupport')}
            </button>
          </div>
        </div>

        <aside className="flex flex-col border-t border-[var(--color-border-default)] bg-[var(--color-soapstone-base)] lg:h-full lg:min-h-0 lg:overflow-hidden lg:border-t-0 lg:border-l">
          <h3 className="flex min-h-16 items-center px-5 pr-[4.5rem] font-[family-name:var(--font-heading)] text-2xl font-bold tracking-[-0.03em] text-[var(--color-cod-gray-base)] sm:min-h-[4.5rem] sm:px-6 sm:pr-20 md:min-h-[5.75rem] md:pr-28">
            {t('courses.modal.program')}
          </h3>
          <div
            ref={rightScrollRef}
            className="buero-scroll-quiet px-3 pt-2 pb-6 sm:px-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
          >
            {isLoading && rawModules.length === 0 ? (
              <p className="px-2 py-4 text-base text-[var(--color-text-secondary)]">
                {t('courses.modal.loadingStructure')}
              </p>
            ) : (
              <div className="rounded-[24px] border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-3 py-4">
                <CourseStructure
                  key={`${courseId}-${courseStructureKeyFromModules(rawModules)}`}
                  modules={rawModules}
                />
              </div>
            )}
          </div>
        </aside>
      </div>
    </BaseDialog>
  );
};

export default CourseInfoModal;
