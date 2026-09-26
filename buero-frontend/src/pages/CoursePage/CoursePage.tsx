import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type SimpleBarCore from 'simplebar-core';
import { useSelector } from 'react-redux';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';

import { getCachedCourseProgress, getCachedCourseTree } from '@/api/courseWorkspaceCache';
import { completeCourseMaterial } from '@/api/progressApi';
import type { CourseModule } from '@/features/courses-catalog/CourseStructure';
import {
  CourseLearningSidebar,
  CoursePageSkeleton,
  MaterialWindow,
} from '@/features/course-learning';
import LessonAttachments from '@/features/course-learning/MaterialWindow/LessonAttachments';
import QuizPanel, { type QuizResultSummary } from '@/features/course-learning/QuizPanel/QuizPanel';

import type { LearningLesson } from '@/types/features/learning/LearningPage.types';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import CourseWorkspaceHeader from '@/components/layout/Header/CourseWorkspaceHeader';
import { WorkspaceScrollArea } from '@/components/modal';
import { ROUTES } from '@/helpers/routes';
import { selectCurrentUser, selectUserRole } from '@/redux/slices/user/userSelectors';
import useModal from '@/components/modal/context/useModal';
import {
  type ApiCourseWithTree,
  buildLearningLessonFromMaterial,
  findLockedModuleIds,
  findNextMaterialId,
  findNextModuleFirstMaterialId,
  flattenMaterialsInOrder,
  formatMaterialDuration,
  hasAnyUnlockedMaterial,
  mapApiModulesToCourseStructure,
  scopeToUnlockedModules,
  parseDurationLabelToSeconds,
  mapApiAttachments,
  resolveSelectedMaterialId,
} from './coursePageMappers';

/**
 * The lesson is carried as a query parameter rather than a path segment. It gives the
 * same refresh, back button and bookmark behaviour without touching the route table,
 * and the module need not appear in the address at all — a lesson already knows which
 * module it belongs to.
 */
const LESSON_PARAM = 'lesson';

const CoursePage: React.FC = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pushUiModal } = useModal();

  const [course, setCourse] = useState<ApiCourseWithTree | null>(null);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResultSummary | null>(
    null,
  );
  const [completedMaterialIds, setCompletedMaterialIds] = useState<Set<string>>(() => new Set());
  const [videoCompletionSaving, setVideoCompletionSaving] = useState(false);
  const [videoCompletionError, setVideoCompletionError] = useState<string | null>(null);
  const [courseOutline, setCourseOutline] = useState<CourseModule[]>([]);
  const [lockedModuleIds, setLockedModuleIds] = useState<ReadonlySet<string>>(() => new Set());
  const [courseStructureMobileOpen, setCourseStructureMobileOpen] = useState(false);
  const mainScrollRef = useRef<SimpleBarCore | null>(null);
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);


  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;
    const load = async () => {
      setLoadStatus('loading');
      setLoadError(null);
      setCourseOutline([]);
      setLockedModuleIds(new Set());
      setCompletedMaterialIds(new Set());
      try {
        const [data, progress] = await Promise.all([
          getCachedCourseTree(courseId),
          getCachedCourseProgress(courseId),
        ]);
        if (cancelled) return;

        /**
         * The server now withholds content for modules the user has not paid for, so
         * a course with nothing unlocked cannot be studied at all. Say so instead of
         * rendering an empty player.
         */
        if ((data.modules?.length ?? 0) > 0 && !hasAnyUnlockedMaterial(data)) {
          setLoadError(t('coursePage.noAccess'));
          setLoadStatus('error');
          setCourse(null);
          return;
        }

        const courseForUi = scopeToUnlockedModules(data);
        setCourse(courseForUi);

        // The full outline stays visible; locked modules are marked, not hidden.
        setCourseOutline(mapApiModulesToCourseStructure(data.modules ?? []));
        setLockedModuleIds(findLockedModuleIds(data));

        setQuizResult(null);
        setCompletedMaterialIds(
          new Set(progress?.completed_materials.map((row) => row.course_material_id) ?? []),
        );
        setLoadStatus('idle');
      } catch (err: unknown) {
        if (cancelled) return;
        const status =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
        if (status === 403) {
          setLoadError(t('coursePage.noAccess'));
          setLoadStatus('error');
          setCourse(null);
          return;
        }
        const message =
          err && typeof err === 'object' && 'response' in err
            ? String(
                (err as { response?: { data?: { message?: unknown } } }).response?.data?.message ??
                  '',
              )
            : err instanceof Error
              ? err.message
              : t('coursePage.loadFailed');
        setLoadError(message || t('coursePage.loadFailed'));
        setLoadStatus('error');
        setCourse(null);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId, t]);

  const structureModules = useMemo(() => {
    if (courseOutline.length > 0) return courseOutline;
    return mapApiModulesToCourseStructure(course?.modules);
  }, [courseOutline, course?.modules]);

  const flatMaterials = useMemo(() => (course ? flattenMaterialsInOrder(course) : []), [course]);

  /**
   * The lesson being read lives in the address bar, not in component state. Keeping it
   * in state meant a refresh threw the student back to the start of the course, the
   * back button left the page entirely, and a lesson could not be bookmarked.
   */
  const lessonParam = searchParams.get(LESSON_PARAM);
  const selectedMaterialId = useMemo(
    () => resolveSelectedMaterialId(flatMaterials, lessonParam, completedMaterialIds),
    [flatMaterials, lessonParam, completedMaterialIds],
  );

  /**
   * Writes that fallback into the address as soon as the course is known, replacing the
   * entry rather than adding one — arriving at a course should not put a step in the
   * history that the back button has to walk through.
   *
   * It also pins the lesson down. Left unpinned, finishing a video would change where
   * "no lesson named" points to, and the student would be moved on mid-lesson.
   */
  useEffect(() => {
    if (!selectedMaterialId || selectedMaterialId === lessonParam) return;
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set(LESSON_PARAM, selectedMaterialId);
        return next;
      },
      { replace: true },
    );
  }, [selectedMaterialId, lessonParam, setSearchParams]);

  /** Moving to another lesson is a step the back button can undo. */
  const goToMaterial = useCallback(
    (materialId: string) => {
      setQuizResult(null);
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set(LESSON_PARAM, materialId);
        return next;
      });
    },
    [setSearchParams],
  );

  const selectedMaterial = useMemo(
    () => flatMaterials.find((r) => r.material.id === selectedMaterialId)?.material,
    [flatMaterials, selectedMaterialId],
  );

  const selectedModuleId = useMemo(
    () => flatMaterials.find((r) => r.material.id === selectedMaterialId)?.moduleId ?? null,
    [flatMaterials, selectedMaterialId],
  );

  const isQuizSelected = Boolean(
    selectedMaterial && String(selectedMaterial.type).toLowerCase() === 'quiz',
  );


  const currentLesson: LearningLesson | undefined = useMemo(() => {
    if (!course?.title) return undefined;
    const idx = flatMaterials.findIndex((r) => r.material.id === selectedMaterialId);
    const ref = idx >= 0 ? flatMaterials[idx] : flatMaterials[0];
    if (!ref) return undefined;
    const base = buildLearningLessonFromMaterial(
      course.title,
      ref.material,
      idx >= 0 ? idx : 0,
      flatMaterials.length,
    );
    const total = flatMaterials.length;
    const completedCount = flatMaterials.filter((r) =>
      completedMaterialIds.has(r.material.id),
    ).length;
    return {
      ...base,
      progress: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      progressText:
        total > 0
          ? t('coursePage.progressCompletedText', { current: completedCount, total })
          : t('coursePage.progressCompletedText', { current: 0, total: 0 }),
    };
  }, [course, flatMaterials, selectedMaterialId, completedMaterialIds, t]);

  const isStudentVideoProgress =
    currentUser?.role === 'student' &&
    Boolean(
      selectedMaterialId &&
      selectedMaterial &&
      String(selectedMaterial.type).toLowerCase() === 'video',
    );

  const videoFallbackSeconds = useMemo(() => {
    if (!selectedMaterial || String(selectedMaterial.type).toLowerCase() !== 'video') return null;
    return parseDurationLabelToSeconds(formatMaterialDuration(selectedMaterial)) ?? 480;
  }, [selectedMaterial]);

  const handleMarkVideoComplete = useCallback(async () => {
    if (!courseId || !selectedMaterialId || !selectedModuleId || currentUser?.role !== 'student') {
      return;
    }
    setVideoCompletionError(null);
    setVideoCompletionSaving(true);
    try {
      await completeCourseMaterial(courseId, selectedModuleId, selectedMaterialId);
      setCompletedMaterialIds((prev) => new Set(prev).add(selectedMaterialId));
    } catch (err: unknown) {
      setVideoCompletionError(getErrorMessage(err, t('coursePage.progressUpdateFailed')));
    } finally {
      setVideoCompletionSaving(false);
    }
  }, [courseId, selectedMaterialId, selectedModuleId, currentUser?.role, t]);

  const handleSelectLesson = useCallback(
    (payload: { moduleId: string; materialId: string }) => {
      if (lockedModuleIds.has(payload.moduleId)) return;
      goToMaterial(payload.materialId);
    },
    [goToMaterial, lockedModuleIds],
  );

  /**
   * The next step through the course, whatever kind of material it is.
   *
   * This used to look for the next *video*, so "next lesson" stepped straight over the
   * quiz that belongs to the lesson just watched — the student was carried past the
   * practice without being shown it.
   */
  const nextMaterialId = useMemo(
    () => findNextMaterialId(flatMaterials, selectedMaterialId),
    [flatMaterials, selectedMaterialId],
  );

  const handleNextLesson = useCallback(() => {
    if (!nextMaterialId) return;
    goToMaterial(nextMaterialId);
  }, [nextMaterialId, goToMaterial]);

  /**
   * Where a finished quiz leads. A lesson quiz goes to the next lesson of any kind; a
   * module test goes to the first lesson of the next module, because finishing a test
   * means the module is behind you even when material still follows it in order.
   *
   * Undefined at the end of the course, which hides the button rather than offering a
   * step that goes nowhere.
   */
  const quizMoveOnTarget = useMemo(() => {
    if (!isQuizSelected || !selectedMaterialId) return null;
    const isTest = selectedMaterial?.quizMode === 'test';
    return isTest
      ? findNextModuleFirstMaterialId(flatMaterials, selectedMaterialId)
      : findNextMaterialId(flatMaterials, selectedMaterialId);
  }, [isQuizSelected, selectedMaterial, selectedMaterialId, flatMaterials]);

  const isFirstScrollRef = useRef(true);
  useEffect(() => {
    const el = mainScrollRef.current?.getScrollElement();
    if (!el) return;
    if (isFirstScrollRef.current) {
      el.scrollTo({ top: 0 });
      isFirstScrollRef.current = false;
    } else {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedMaterialId]);

  useEffect(() => {
    setVideoCompletionError(null);
  }, [selectedMaterialId]);

  const handleAddWord = useCallback(() => {
    pushUiModal({ type: 'addVocabulary' });
  }, [pushUiModal]);

  if (!courseId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-white)]">
        <p className="text-[var(--color-text-secondary)]">{t('coursePage.missingId')}</p>
      </div>
    );
  }

  if (loadStatus === 'loading') {
    return <CoursePageSkeleton />;
  }

  if (loadStatus === 'error' || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-neutral-white)] px-4">
        <p className="max-w-md text-center text-[var(--color-error)]">{loadError ?? t('coursePage.notFound')}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <NavLink
            to={ROUTES.COURSES}
            className="rounded-full border border-[var(--opacity-neutral-darkest-15)] px-4 py-2 text-[1.125rem] text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
          >
            {t('coursePage.allCourses')}
          </NavLink>
          <NavLink
            to={ROUTES.MY_LEARNING}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-[1.125rem] text-[var(--color-text-on-accent)] hover:bg-[var(--color-primary-hover)]"
          >
            {t('header.myLearning')}
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]">
      <CourseLearningSidebar
        modules={structureModules}
        onSelectLesson={handleSelectLesson}
        selectedMaterialId={selectedMaterialId}
        completedMaterialIds={completedMaterialIds}
        lockedModuleIds={lockedModuleIds}
        checkoutCourseId={lockedModuleIds.size > 0 ? courseId : undefined}
        coursePrice={course.price ?? null}
        courseStructureMobileOpen={courseStructureMobileOpen}
        onCourseStructureMobileChange={setCourseStructureMobileOpen}
        hideMobileFloatingStructureButton
      />

      <WorkspaceScrollArea
        ref={mainScrollRef}
        className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-[var(--color-soapstone-base)]"
      >
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col bg-[var(--color-soapstone-base)]">
        <CourseWorkspaceHeader
          desktopStart={
            <>
              {userRole === 'student' ? (
                <NavLink
                  to={ROUTES.MY_LEARNING}
                  className="text-[1.125rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                >
                  {t('header.myLearning')}
                </NavLink>
              ) : null}
              {userRole === 'student' ? (
                <NavLink
                  to={ROUTES.VOCABULARY.replace(':courseId', courseId)}
                  className="text-[1.125rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                >
                  {t('coursePage.vocabulary')}
                </NavLink>
              ) : null}
              <NavLink
                to={ROUTES.COURSES}
                className="text-[1.125rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
              >
                {t('coursePage.allCourses')}
              </NavLink>
            </>
          }
          renderMobileNav={({ className: navClass }) => (
            <nav className={navClass} aria-label={t('coursePage.quickLinks')}>
              {userRole === 'student' ? (
                <NavLink
                  to={ROUTES.MY_LEARNING}
                  className={({ isActive }) =>
                    [
                      'text-lg font-medium transition-colors',
                      isActive
                        ? 'text-[var(--color-primary)]'
                        : 'text-white/95 hover:text-[var(--color-primary)]',
                    ].join(' ')
                  }
                >
                  {t('header.myLearning')}
                </NavLink>
              ) : null}
              {userRole === 'student' ? (
                <NavLink
                  to={ROUTES.VOCABULARY.replace(':courseId', courseId)}
                  className={({ isActive }) =>
                    [
                      'text-lg font-medium transition-colors',
                      isActive
                        ? 'text-[var(--color-primary)]'
                        : 'text-white/95 hover:text-[var(--color-primary)]',
                    ].join(' ')
                  }
                >
                  {t('coursePage.vocabulary')}
                </NavLink>
              ) : null}
              <NavLink
                to={ROUTES.COURSES}
                className={({ isActive }) =>
                  [
                    'text-lg font-medium transition-colors',
                    isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-white/95 hover:text-[var(--color-primary)]',
                  ].join(' ')
                }
              >
                {t('coursePage.allCourses')}
              </NavLink>
            </nav>
          )}
          onOpenCourseStructure={() => setCourseStructureMobileOpen(true)}
        />

        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--color-soapstone-base)]"
          aria-label={t('coursePage.lessonContent')}
        >
          {flatMaterials.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-8 text-[var(--color-text-secondary)]">
              {t('coursePage.noLessons')}
            </div>
          ) : null}
          {flatMaterials.length > 0 && currentLesson && !isQuizSelected ? (
            <MaterialWindow
              key={selectedMaterialId ?? currentLesson.materialId ?? currentLesson.videoUrl}
              lesson={currentLesson}
              courseId={courseId}
              moduleId={selectedModuleId ?? undefined}
              hasNextLesson={Boolean(nextMaterialId)}
              onNextLesson={handleNextLesson}
              isVideoLessonCompleted={
                isStudentVideoProgress && selectedMaterialId
                  ? completedMaterialIds.has(selectedMaterialId)
                  : false
              }
              onMarkVideoComplete={
                isStudentVideoProgress && selectedModuleId ? handleMarkVideoComplete : undefined
              }
              isVideoCompletionSaving={videoCompletionSaving}
              videoCompletionError={videoCompletionError}
              fallbackMarkReadyAfterSeconds={videoFallbackSeconds}
              onAddWord={handleAddWord}
            />
          ) : null}
          {flatMaterials.length > 0 && isQuizSelected && selectedMaterial ? (
            <QuizPanel
              key={selectedMaterial.id}
              courseMaterialId={selectedMaterial.id}
              courseId={courseId}
              moduleId={selectedModuleId ?? undefined}
              quizMaterialTitle={selectedMaterial.title || t('coursePage.quiz')}
              attachments={mapApiAttachments(selectedMaterial.attachments)}
              onQuizResult={setQuizResult}
              onMoveOn={
                quizMoveOnTarget ? () => goToMaterial(quizMoveOnTarget) : undefined
              }
            />
          ) : null}
        </section>
        </div>
      </WorkspaceScrollArea>

    </div>
  );
};

export default CoursePage;
