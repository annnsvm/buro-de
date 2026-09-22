import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useSlideInSheet } from '@/hooks/useSlideInSheet';
import { courseStructureKeyFromModules } from '@/features/courses-catalog/courseStructure.helpers';
import CourseStructure from '@/features/courses-catalog/CourseStructure';
import type { CourseModule } from '@/features/courses-catalog/CourseStructure';
import { Logo } from '@/components/ui';
import { ROUTES } from '@/helpers/routes';
import TrialSidebarBlurTail from './TrialSidebarBlurTail';
import WorkspaceScrollArea from '@/components/modal/WorkspaceScrollArea';

export type CourseLearningSidebarProps = {
  modules: CourseModule[];
  onSelectLesson: (payload: { moduleId: string; materialId: string }) => void;
  selectedMaterialId: string | null;
  completedMaterialIds?: ReadonlySet<string>;
  lockedModuleIds?: ReadonlySet<string>;
  checkoutCourseId?: string;
  coursePrice?: number | null;
  courseStructureMobileOpen?: boolean;
  onCourseStructureMobileChange?: (open: boolean) => void;
  hideMobileFloatingStructureButton?: boolean;
};

const CourseLearningSidebar: React.FC<CourseLearningSidebarProps> = ({
  modules,
  onSelectLesson,
  selectedMaterialId,
  completedMaterialIds,
  lockedModuleIds,
  checkoutCourseId,
  coursePrice = null,
  courseStructureMobileOpen,
  onCourseStructureMobileChange,
  hideMobileFloatingStructureButton = false,
}) => {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const isControlled =
    courseStructureMobileOpen !== undefined && onCourseStructureMobileChange !== undefined;
  const isOpenMobile = isControlled ? courseStructureMobileOpen! : internalMobileOpen;
  const setIsOpenMobile = isControlled ? onCourseStructureMobileChange! : setInternalMobileOpen;

  const { mounted: sheetMounted, entered: sheetEntered } = useSlideInSheet(isOpenMobile);

  const handleOpen = () => setIsOpenMobile(true);
  const handleClose = () => setIsOpenMobile(false);

  const handleLessonSelect = (payload: { moduleId: string; materialId: string }) => {
    onSelectLesson(payload);
    handleClose();
  };

  const trialOutline =
    Boolean(checkoutCourseId) && Boolean(lockedModuleIds && lockedModuleIds.size > 0);

  const sortedModules = useMemo(
    () => [...modules].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
    [modules],
  );

  /**
   * On a trial the server unlocks the opening modules (module 0 with the course
   * instructions plus the first teaching module). Show every module the caller may
   * actually study — the ones that are not in lockedModuleIds — and reserve the
   * blurred teaser for the first module still behind the paywall.
   */
  const displayModules = useMemo(() => {
    if (!trialOutline) return modules;
    return sortedModules.filter((mod) => !lockedModuleIds?.has(mod.id));
  }, [modules, trialOutline, sortedModules, lockedModuleIds]);

  /**
   * Modules are numbered from zero, so a module's index is its number. Taking it from
   * the position rather than from how many modules are unlocked keeps the teaser right
   * even if the free modules ever stop being a run from the start of the course.
   */
  const nextLockedModulePreview = useMemo(() => {
    const index = sortedModules.findIndex((mod) => lockedModuleIds?.has(mod.id));
    if (index < 0) return null;
    const firstLocked = sortedModules[index];
    return {
      number: index,
      title: firstLocked.title,
      materialCount: firstLocked.materials?.length ?? 0,
    };
  }, [sortedModules, lockedModuleIds]);

  const structureKey = courseStructureKeyFromModules(displayModules);

  const renderStructure = (isMobile: boolean) => {
    const inner = (
      <>
        <CourseStructure
          key={structureKey}
          modules={displayModules}
          onSelectLesson={isMobile ? handleLessonSelect : onSelectLesson}
          selectedMaterialId={selectedMaterialId}
          completedMaterialIds={completedMaterialIds}
        />
        {trialOutline && checkoutCourseId ? (
          <TrialSidebarBlurTail
            courseId={checkoutCourseId}
            previewModule={nextLockedModulePreview}
            moduleNumber={nextLockedModulePreview?.number}
            price={coursePrice}
          />
        ) : null}
      </>
    );

    if (!trialOutline) return inner;

    return <div className="flex min-h-full flex-1 flex-col">{inner}</div>;
  };

  return (
    <>
      {!hideMobileFloatingStructureButton ? (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={handleOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpen();
            }}
            aria-label="Open course structure"
            aria-expanded={isOpenMobile}
            className="fixed top-[4rem] left-4 z-40 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
              Course Structure
            </span>
          </button>
        </div>
      ) : null}

      <aside
        className="hidden h-full min-h-0 w-[320px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:flex"
        aria-label="Course outline"
      >
        <div className="shrink-0 px-6 py-6">
          <Link to={ROUTES.HOME}>
            <Logo isLight={false} width={70} height={28} />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <WorkspaceScrollArea className="flex min-h-0 flex-1 flex-col">
            <div className="pl-4 pr-2 pb-4">{renderStructure(false)}</div>
          </WorkspaceScrollArea>
        </div>
      </aside>

      {sheetMounted ? (
        <div
          className="pointer-events-none fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Course structure"
        >
          <button
            type="button"
            aria-label="Close course structure"
            onClick={handleClose}
            className={[
              'pointer-events-auto absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out',
              sheetEntered ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
          <div
            className={[
              'pointer-events-auto absolute top-0 left-0 z-10 flex h-full max-h-[100vh] w-[320px] max-w-[85vw] flex-col bg-[var(--color-neutral-white)] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform',
              sheetEntered ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] p-4">
              <Link to={ROUTES.HOME} className="px-4 py-8">
                <Logo isLight={false} width={70} height={28} />
              </Link>
            </div>
            <WorkspaceScrollArea className="flex min-h-0 flex-1 flex-col">
              <div className="pl-4 pr-2 pb-4">{renderStructure(true)}</div>
            </WorkspaceScrollArea>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CourseLearningSidebar;
