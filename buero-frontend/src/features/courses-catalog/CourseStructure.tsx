import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import { nestMaterials } from './nestMaterials';

export type CourseMaterial = {
  id: string;
  moduleId: string;
  type: string;
  title: string;
  duration?: string;
  orderIndex?: number;
  /** Set on a practice: the lesson it hangs under in the list. */
  parentMaterialId?: string | null;
  /** Which blocks a practice contains, for the line under its name. */
  blocks?: string[];
};

export type CourseModule = {
  id: string;
  title: string;
  orderIndex?: number;
  materials: CourseMaterial[];
};

type CourseStructureProps = {
  modules: CourseModule[];
  onSelectLesson?: (payload: { moduleId: string; materialId: string }) => void;
  selectedMaterialId?: string | null;
  completedMaterialIds?: ReadonlySet<string>;
};

const CourseStructure: React.FC<CourseStructureProps> = ({
  modules,
  onSelectLesson,
  selectedMaterialId,
  completedMaterialIds,
}) => {
  const { t } = useTranslation();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const sorted = [...modules].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const first = sorted[0]?.id;
    return first ? new Set([first]) : new Set();
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!selectedMaterialId) return;
    const parentModule = modules.find((m) =>
      m.materials?.some((material) => material.id === selectedMaterialId),
    );
    if (!parentModule) return;
    setExpandedModules((prev) => {
      if (prev.has(parentModule.id)) return prev;
      const next = new Set(prev);
      next.add(parentModule.id);
      return next;
    });
  }, [selectedMaterialId, modules]);

  if (!modules || modules.length === 0) return null;

  const sortedModules = [...modules].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="space-y-6 py-2">
      {sortedModules.map((mod, modIdx) => {
        const completedCount =
          mod.materials?.filter((m) => completedMaterialIds?.has(m.id)).length ?? 0;
        const totalCount = mod.materials?.length ?? 0;

        return (
          <div key={mod.id}>
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="flex w-full items-center justify-between px-2 py-1 text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-neutral-dark)]">
                  {t('courses.structure.module')} {modIdx + 1}
                </span>
                <span className="mt-0.5 text-base font-semibold leading-tight text-[var(--color-neutral-darkest)]">
                  {mod.title}
                </span>
                <span className="mt-0.5 text-sm text-[var(--color-neutral-dark)]">
                  {t('courses.structure.completed', {
                    completed: completedCount,
                    total: totalCount,
                  })}
                </span>
              </div>
              <Icon
                name={expandedModules.has(mod.id) ? 'icon-chevron-up' : 'icon-chevron-down'}
                size={20}
                className="shrink-0 text-[var(--color-neutral-darkest)]"
              />
            </button>

            {expandedModules.has(mod.id) && mod.materials && mod.materials.length > 0 ? (
              <div className="mt-3 space-y-3 pl-2">
                {nestMaterials(mod.materials).map(({ material, children }) => (
                  <div key={material.id} className="space-y-2">
                    <LessonRow
                      lesson={material}
                      moduleId={mod.id}
                      isSelected={selectedMaterialId === material.id}
                      isCompleted={completedMaterialIds?.has(material.id) ?? false}
                      onSelect={onSelectLesson}
                    />
                    {/* A practice sits indented under the lesson it belongs to. */}
                    {children.map((child) => (
                      <div key={child.id} className="pl-6">
                        <LessonRow
                          lesson={child}
                          moduleId={mod.id}
                          isSelected={selectedMaterialId === child.id}
                          isCompleted={completedMaterialIds?.has(child.id) ?? false}
                          onSelect={onSelectLesson}
                          isNested
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

type LessonRowProps = {
  lesson: CourseMaterial;
  moduleId: string;
  isSelected: boolean;
  isCompleted: boolean;
  onSelect?: (payload: { moduleId: string; materialId: string }) => void;
  /** A practice under its lesson: smaller, and captioned with what is inside it. */
  isNested?: boolean;
};

const LessonRow: React.FC<LessonRowProps> = ({
  lesson,
  moduleId,
  isSelected,
  isCompleted,
  onSelect,
  isNested = false,
}) => {
  const { t } = useTranslation();
  const type = String(lesson.type).toLowerCase();
  const isVideo = type === 'video';
  const hasQuestions = type === 'quiz' || type === 'practice';

  const completedVideo = isVideo && isCompleted;
  const completedExercise = hasQuestions && isCompleted;

  const rowBgClass = isSelected
    ? 'bg-[var(--color-dawn-pink-light)]'
    : completedVideo
      ? 'bg-[#f5f3f0]'
      : completedExercise
        ? 'bg-[#eef2fc]'
        : '';
  const iconWrapClass = completedVideo
    ? 'bg-[#6b9f7a]'
    : completedExercise
      ? 'bg-[#6b7eb8]'
      : 'bg-[var(--color-primary)]';
  const iconName = isCompleted
    ? ICON_NAMES.CHECK
    : hasQuestions
      ? ICON_NAMES.HELP
      : ICON_NAMES.PLAY_ARROW;

  /**
   * A practice is captioned "Übungen" rather than by the blocks it holds. Naming them here would
   * be a second list to keep in step with the one on the hub, and a practice that gains a
   * listening block would keep saying "Grammatik" until someone noticed.
   */
  const caption =
    type === 'practice' ? t('coursePage.exercises') : isVideo ? lesson.duration : null;

  return (
    <button
      type="button"
      onClick={() => onSelect?.({ moduleId, materialId: lesson.id })}
      className={`flex w-full min-w-0 items-center gap-3 rounded-lg p-2 text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${rowBgClass}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg ${iconWrapClass} ${isNested ? 'h-8 w-8' : 'h-10 w-10'}`}
        aria-hidden
      >
        <Icon name={iconName} size={isNested ? 15 : 18} color="var(--color-white)" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span
          className={`truncate font-semibold text-[var(--color-neutral-darkest)] ${isNested ? 'text-[13px]' : 'text-sm'}`}
        >
          {lesson.title || t('coursePage.practice')}
        </span>
        {caption ? (
          <span className="truncate text-xs text-[var(--color-neutral-dark)]">{caption}</span>
        ) : null}
      </div>
    </button>
  );
};

export default CourseStructure;
