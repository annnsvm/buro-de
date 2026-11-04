import React, { useState } from 'react';
import { BaseDialog, ModalBody, ModalFooter } from '@/components/modal';
import { Button, FormField, Input } from '@/components/ui';
import { Spinner } from '@/components/ui';
import type { CreateCourseModuleModalProps } from '@/types/features/courseManagment/CreateCourseModuleModal.types';

const CreateCourseModuleModal: React.FC<CreateCourseModuleModalProps> = ({
  isOpen,
  handleOpenChange,
  onSubmitModule,
  initialTitle = '',
  mode = 'create',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setError(null);
    setIsSubmitting(false);
    setTitle(initialTitle);
    handleOpenChange(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Вкажіть назву модуля');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitModule({ title: trimmedTitle });
      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : mode === 'edit'
              ? 'Не вдалося оновити модуль'
              : 'Не вдалося створити модуль';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      openCloseAnimation
      contentClassName="relative z-[1] w-full max-w-[560px] rounded-2xl bg-white p-6 focus:outline-none lg:p-12"
    >
      <ModalBody>
        <div className="flex items-center justify-center flex-col gap-2">
          <p className="text-center text-sm text-[1.75rem] font-bold text-[var(--color-text-primary)]">
            {mode === 'edit' ? 'Редагувати модуль' : 'Новий модуль'}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {mode === 'edit' ? 'Змініть назву модуля.' : 'Додайте до курсу ще один модуль.'}
          </p>
        </div>

        <FormField label="Назва модуля" name="moduleTitle">
          <Input
            id="moduleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Напр. Як навчатися на цьому курсі"
            disabled={isSubmitting}
          />
        </FormField>

        {error ? (
          <p role="alert" className="mt-2 text-sm text-[var(--color-error)]">
            {error}
          </p>
        ) : null}
      </ModalBody>

      <ModalFooter className="mt-4 flex-row justify-center gap-2">
        <Button type="button" variant="outlineDark" onClick={handleClose} disabled={isSubmitting}>
          Скасувати
        </Button>
        <Button
          type="button"
          variant="solid"
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner variant="onPrimary" className="size-5" />
              {mode === 'edit' ? 'Оновлюємо' : 'Створюємо'}
            </span>
          ) : (
            mode === 'edit' ? 'Зберегти' : 'Створити модуль'
          )}
        </Button>
      </ModalFooter>
    </BaseDialog>
  );
};

export default CreateCourseModuleModal;
