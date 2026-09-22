import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ExerciseRendererProps } from './exercise.types';

const letterLabel = (index: number) => String.fromCharCode(97 + index);

/**
 * Picking one option or several.
 *
 * The control matches the question: radio buttons when exactly one answer is wanted,
 * checkboxes when several are. Previously everything was a checkbox, which left the
 * student guessing how many to tick.
 */
const ChoiceExercise: React.FC<ExerciseRendererProps> = ({
  question,
  answer,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const multi = question.type === 'multi_choice';
  const selected = Array.isArray(answer) ? answer : answer ? [answer] : [];

  const toggle = (optionId: string) => {
    if (disabled) return;
    if (!multi) {
      onChange(optionId);
      return;
    }
    onChange(
      selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId],
    );
  };

  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="sr-only">{question.prompt}</legend>
      {multi ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t('quiz.chooseSeveral')}
        </p>
      ) : null}

      {(question.options ?? []).map((option, index) => {
        const checked = selected.includes(option.id);
        const inputId = `${question.id}-${option.id}`;
        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={[
              'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition',
              checked
                ? 'border-[var(--color-primary)] bg-[var(--color-neutral-white)]'
                : 'border-[var(--color-border-default)] bg-[var(--color-neutral-white)] hover:border-[var(--color-primary)]',
              disabled ? 'cursor-not-allowed opacity-70' : '',
            ].join(' ')}
          >
            <input
              id={inputId}
              /** The option text is the label, so a screen reader reads the answer. */
              type={multi ? 'checkbox' : 'radio'}
              name={question.id}
              checked={checked}
              onChange={() => toggle(option.id)}
              disabled={disabled}
              className="h-4 w-4 shrink-0 accent-[var(--color-primary)]"
            />
            <span className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">
              {letterLabel(index)}
            </span>
            <span className="text-[var(--color-text-primary)]">{option.text}</span>
          </label>
        );
      })}
    </fieldset>
  );
};

export default ChoiceExercise;
