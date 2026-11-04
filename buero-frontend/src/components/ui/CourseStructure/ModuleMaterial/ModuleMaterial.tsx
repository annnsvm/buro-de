import React from 'react';
import { GripVertical } from 'lucide-react';
import Icon from '../../Icon';
import { ModuleMaterialProps } from '@/types/components/ui/ModuleMaterial.types';
import { ICON_NAMES } from '@/helpers/iconNames';

/**
 * The line under a material's name in the sidebar: a video says how long it is, and
 * everything else says what it is. Falling through to the raw type name showed the
 * teacher "quiz" and "practice" in a panel that is otherwise entirely in Ukrainian.
 */
const KIND_LABELS: Partial<Record<string, string>> = {
  quiz: 'Тест',
  practice: 'Практика',
  writing: 'Письмо',
};

const ModuleMaterial: React.FC<ModuleMaterialProps> = ({
  material,
  onSelectMaterial,
  onRequestDeleteMaterial,
  onPublishMaterial,
  isPublishingMaterial = false,
  dragHandleProps,
  isDragging = false,
  sortableRef,
  sortableStyle,
}) => {
  const { type, id, title, content, publishedAt } = material;
  /** Undefined on a student's tree, where a draft never arrives; null means a draft. */
  const isDraft = publishedAt === null;
  const durationLabel =
    type === 'video' && typeof content?.duration === 'string'
      ? content.duration
      : type === 'video'
          ? 'Відео'
          : (KIND_LABELS[type] ?? type.replace('_', ' '));

  const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    onRequestDeleteMaterial?.(id);
  };

  const deleteAriaLabel =
    type === 'video'
      ? 'Видалити відеоурок'
      : type === 'quiz'
        ? 'Видалити тест'
        : 'Видалити матеріал';

  const renderDragHandle = () =>
    dragHandleProps ? (
      <button
        type="button"
        {...dragHandleProps}
        className="flex shrink-0 cursor-grab touch-none items-center justify-center rounded-lg px-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
    ) : null;

  const renderMainButton = (iconName: string, iconWrapperClass: string, iconColor: string) => (
    <button
      type="button"
      onClick={() => onSelectMaterial(id)}
      className="flex min-w-0 flex-1 items-center justify-between py-2 text-left"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconWrapperClass}`}
        >
          <Icon name={iconName} size={18} color={iconColor} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-medium text-[var(--color-text-primary)]">
            {title || 'Матеріал без назви'}
          </span>
          {/**
           * Said on the row rather than only on the module, because after an import the
           * list is a mix: eight new practices waiting and the lessons that were always
           * there. Without it the teacher cannot tell which is which.
           */}
          <span className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="capitalize">{durationLabel}</span>
            {isDraft ? (
              <span className="rounded-full bg-[var(--color-dawn-pink-light)] px-2 py-0.5 text-[0.7rem] font-semibold text-[var(--color-burnt-siena-dark)]">
                чернетка
              </span>
            ) : null}
          </span>
        </div>
      </div>
    </button>
  );

  /**
   * Shown only on a draft, and only to someone who can act on it.
   *
   * It sits beside the bin rather than under the row because the list is read down the
   * left edge: a button that moved the titles apart would make the module harder to scan
   * for the sake of a state most rows are not in.
   */
  const renderPublishButton = () =>
    isDraft && onPublishMaterial ? (
      <button
        type="button"
        aria-label={`Опублікувати ${title || 'матеріал без назви'}`}
        title="Опублікувати - студенти побачать цей матеріал"
        tabIndex={0}
        disabled={isPublishingMaterial}
        className="flex shrink-0 items-center justify-center rounded-lg px-2 hover:bg-[var(--color-surface-section)] disabled:opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          onPublishMaterial(id);
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          e.stopPropagation();
          onPublishMaterial(id);
        }}
      >
        <Icon
          name={ICON_NAMES.EYE_PSW_SHOW}
          size={18}
          className="text-[var(--color-burnt-siena-dark)]"
        />
      </button>
    ) : null;

  const renderDeleteButton = () =>
    onRequestDeleteMaterial ? (
      <button
        type="button"
        aria-label={deleteAriaLabel}
        tabIndex={0}
        className="flex shrink-0 items-center justify-center rounded-lg px-2 hover:bg-[var(--color-surface-section)]"
        onClick={(e) => {
          e.stopPropagation();
          onRequestDeleteMaterial(id);
        }}
        onKeyDown={handleDeleteKeyDown}
      >
        <Icon name={ICON_NAMES.TRASH} size={18} className="text-[var(--color-text-secondary)]" />
      </button>
    ) : null;

  const rowClassName = `flex items-stretch gap-1 rounded-lg ${
    isDragging ? 'bg-[var(--color-surface-section)] opacity-80 shadow-sm' : ''
  }`;

  switch (type) {
    case 'video': {
      return (
        <li ref={sortableRef} style={sortableStyle}>
          <div className={rowClassName}>
            {renderDragHandle()}
            {renderMainButton(ICON_NAMES.PLAY_ARROW, 'bg-[var(--color-primary)]', 'var(--color-white)')}
            {renderPublishButton()}
            {renderDeleteButton()}
          </div>
        </li>
      );
    }
    default: {
      return (
        <li ref={sortableRef} style={sortableStyle}>
          <div className={rowClassName}>
            {renderDragHandle()}
            {renderMainButton(
              ICON_NAMES.BOOK,
              'bg-[var(--color-surface-section)]',
              'var(--color-text-primary)',
            )}
            {renderPublishButton()}
            {renderDeleteButton()}
          </div>
        </li>
      );
    }
  }
};

export default ModuleMaterial;
