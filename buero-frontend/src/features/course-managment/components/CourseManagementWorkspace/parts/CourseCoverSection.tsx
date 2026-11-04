import React from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { CourseCoverSectionProps } from '@/types/features/courseManagment/CourseCoverSection.types';

const CourseCoverSection: React.FC<CourseCoverSectionProps> = ({
  coverPreviewUrl,
  disabled,
  onPick,
  onClear,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const previewUrl = URL.createObjectURL(file);
    onPick(file, previewUrl);
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  };

  return (
    <section aria-label="Обкладинка курсу">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handlePick}
        className="sr-only"
        aria-label="Завантажити обкладинку курсу"
        disabled={disabled}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Додати зображення курсу"
        className={`relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-neutral-lighter)] ${
          disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
        }`}
      >
        {coverPreviewUrl ? (
          <>
            <img
              src={coverPreviewUrl}
              alt="Обкладинка курсу"
              className="h-full w-full object-cover"
              decoding="async"
            />
            {!disabled ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                  if (inputRef.current) inputRef.current.value = '';
                }}
                aria-label="Прибрати зображення"
                className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white hover:bg-black/70"
              >
                Прибрати
              </button>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
            <Icon name={ICON_NAMES.ADD_PHOTO} size={180} ariaHidden />
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Завантажте зображення курсу</p>
            <p className="text-xs">Натисніть, щоб вибрати файл</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseCoverSection;

