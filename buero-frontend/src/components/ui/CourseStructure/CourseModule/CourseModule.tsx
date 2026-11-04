import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import Icon from '../../Icon';
import ModuleMaterial from '../ModuleMaterial/ModuleMaterial';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ModuleMaterialType, ModulesProps } from '@/types/components/ui/ModuleMaterial.types';
import CourseStructureAsideActionButton from '@/features/course-managment/components/CourseManagementWorkspace/courseStructureAside/CourseStructureAsideActionButton';

const CourseModule: React.FC<ModulesProps> = ({
  module,
  onCreateMaterial,
  onImportQuestions,
  onSelectMaterial,
  onEditModule,
  onRequestDeleteModule,
  onRequestDeleteMaterial,
  onPublishModule,
  isPublishingModule = false,
  onPublishMaterial,
  publishingMaterialId,
  displayPosition,
  dragHandleProps,
  isDragging = false,
  forceExpanded = false,
  setDropTargetRef,
  renderMaterialsList,
  sortableRef,
  sortableStyle,
}) => {
  const { id, title, orderIndex, materials } = module;
  const [isExpanded, setIsExpanded] = useState(false);
  /**
   * How many materials of this module no student can see yet. Counted here rather than
   * asked of the server: the editor already holds the whole tree, and a count that lagged
   * behind the list beside it would be worse than none.
   */
  const drafts = materials.filter((item) => item.publishedAt === null).length;

  const expanded = isExpanded || forceExpanded;
  /**
   * Modules are numbered from zero: module 0 holds the course instructions and
   * module 1 is the first teaching module, which is also what the free trial covers.
   */
  const moduleNumber = displayPosition ?? orderIndex ?? 0;

  return (
    <li ref={sortableRef} style={sortableStyle} className={isDragging ? 'z-10 opacity-80' : undefined}>
      <div ref={setDropTargetRef} className="rounded-lg bg-[var(--color-surface-card)]">
        <div className="flex items-center gap-2 px-4 py-3">
          {dragHandleProps ? (
            <button
              type="button"
              {...dragHandleProps}
              className="flex shrink-0 cursor-grab touch-none items-center justify-center rounded-lg p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex min-w-0 flex-1 items-center justify-between text-left"
          >
            <div>
              <div className="flex flex-col font-bold text-[var(--color-text-primary)]">
                <span className="text-[var(--color-text-secondary)]">МОДУЛЬ {moduleNumber}</span>
                <span>{title}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {materials.length} lessons
              </p>
            </div>
            <Icon
              name={expanded ? ICON_NAMES.CHEVRON_UP : ICON_NAMES.CHEVRON_DOWN}
              size={20}
              className="text-[var(--color-text-secondary)]"
            />
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={`Edit module ${title}`}
              onClick={() => onEditModule(id, title)}
              className="rounded p-1 hover:bg-[var(--color-surface-section)]"
            >
              <Icon name={ICON_NAMES.EDIT} size={16} className="text-[var(--color-text-secondary)]" />
            </button>
            {onRequestDeleteModule ? (
              <button
                type="button"
                aria-label={`Delete module ${title}`}
                tabIndex={0}
                onClick={() => onRequestDeleteModule(id, title)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  onRequestDeleteModule(id, title);
                }}
                className="rounded p-1 hover:bg-[var(--color-surface-section)]"
              >
                <Icon name={ICON_NAMES.TRASH} size={16} className="text-[var(--color-text-secondary)]" />
              </button>
            ) : null}
          </div>
        </div>
        {expanded ? (
          <div className="px-4 pb-4">
            {materials.length > 0 ? (
              <ul className="mt-2 space-y-2 pl-4">
                {renderMaterialsList
                  ? renderMaterialsList()
                  : materials.map((material: ModuleMaterialType) => (
                      <ModuleMaterial
                        onPublishMaterial={
                          onPublishMaterial
                            ? (materialId) => onPublishMaterial(id, materialId)
                            : undefined
                        }
                        isPublishingMaterial={publishingMaterialId === material.id}
                        key={material.id}
                        material={material}
                        onSelectMaterial={(materialId) => onSelectMaterial(id, materialId)}
                        onRequestDeleteMaterial={
                          onRequestDeleteMaterial
                            ? (materialId) => onRequestDeleteMaterial(id, materialId)
                            : undefined
                        }
                      />
                    ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                Матеріалів ще немає - додайте перший.
              </p>
            )}
            {/**
              * The act that matches an import: everything that arrived, released together.
              *
              * Drawn only while something is waiting, so a finished module carries no button
              * asking to be pressed. Editing something already published needs none of this -
              * a correction reaches the student at once; this is about what has never been
              * shown to anyone.
              */}
            {drafts > 0 && onPublishModule ? (
              <div className="mt-3 rounded-xl bg-[var(--color-surface-section)] px-3 py-3">
                <p className="text-xs text-[var(--color-text-primary)]">
                  <span className="font-semibold">Чернеток: {drafts}</span> - студенти цього
                  ще не бачать.
                </p>
                {/**
                 * Said here because the per-row button is an icon, and an icon nobody looks
                 * for is a feature nobody has. This is the one place a teacher is already
                 * reading when she wonders how to let something out.
                 */}
                {onPublishMaterial ? (
                  <p className="mt-1 text-[0.7rem] text-[var(--color-text-secondary)]">
                    Готове можна випускати окремо - кнопкою в рядку матеріалу.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => onPublishModule(id)}
                  disabled={isPublishingModule}
                  className="mt-2 w-full rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                >
                  {isPublishingModule ? 'Публікуємо…' : 'Опублікувати модуль'}
                </button>
              </div>
            ) : null}

            <CourseStructureAsideActionButton
              label="Додати матеріал"
              ariaLabel="Додати матеріал"
              onClick={() => onCreateMaterial(id)}
              className="mt-3"
            />
            {onImportQuestions ? (
              <CourseStructureAsideActionButton
                label="Імпорт питань з CSV"
                ariaLabel="Імпорт питань з CSV"
                onClick={() => onImportQuestions(id, title)}
                className="mt-2"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default CourseModule;
