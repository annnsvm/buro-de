import React, { useEffect, useState } from 'react';
import { Button, Spinner } from '@/components/ui';
import type { CourseCreateActionsProps } from '@/types/features/courseManagment/CourseCreateActions.types';

const CourseCreateActions: React.FC<CourseCreateActionsProps> = ({
  mode,
  canCreate,
  isCreating,
  canUpdate,
  isUpdating,
  lastCommitKind,
  error,
  onCreateCourse,
  onUpdateCourse,
}) => {
  const isEditMode = mode === 'edit';
  const [needsConfirm, setNeedsConfirm] = useState(false);

  useEffect(() => {
    if (!canUpdate) setNeedsConfirm(false);
  }, [canUpdate]);

  const editSyncedLabel =
    lastCommitKind === 'update'
      ? 'Оновлено'
      : lastCommitKind === 'create'
        ? 'Створено'
        : 'Збережено';

  const buttonLabel = isUpdating ? (
    <span className="inline-flex items-center gap-2">
      <Spinner variant="onPrimary" className="size-5" />
      Оновлюємо
    </span>
  ) : isEditMode ? (
    canUpdate ? (
      needsConfirm ? (
        'Підтвердити'
      ) : (
        'Зберегти зміни'
      )
    ) : (
      editSyncedLabel
    )
  ) : isCreating ? (
    <span className="inline-flex items-center gap-2">
      <Spinner variant="onPrimary" className="size-5" />
      Створюємо
    </span>
  ) : (
    'Створити курс'
  );

  const buttonDisabled = isEditMode ? !canUpdate || isUpdating : !canCreate || isCreating;

  const handleClick = () => {
    if (!isEditMode) {
      onCreateCourse();
      return;
    }
    if (!needsConfirm) {
      setNeedsConfirm(true);
      return;
    }
    onUpdateCourse();
  };

  return (
    <section
      className="rounded-2xl bg-[var(--color-surface-background)] p-6"
      aria-label="Збереження курсу"
    >
      <div className="flex flex-col flex-wrap items-center justify-between gap-3">
        <div className="min-w-[220px] flex-1 self-start">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{isEditMode ? 'Зміни курсу' : 'Створення курсу'}</p>
          <p className="mt-1 text-center text-xs text-[var(--color-text-secondary)]">
            {isEditMode
              ? 'Порядок модулів, порядок уроків і дані курсу зберігаються лише після «Зберегти зміни» → «Підтвердити».'
              : 'Коли курс створено, до нього можна додавати модулі й матеріали.'}
          </p>
        </div>

        <Button
          type="button"
          variant="solid"
          onClick={handleClick}
          disabled={buttonDisabled}
        >
          {buttonLabel}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </section>
  );
};

export default CourseCreateActions;
