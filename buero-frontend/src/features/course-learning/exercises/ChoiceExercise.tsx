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
    <fieldset className="space-y-2" disabled={disabled}>
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
              'flex min-h-13 cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] bg-[var(--color-neutral-white)] px-4 py-2.5 transition',
              checked
                ? 'border-[var(--color-accent-primary)] bg-[var(--color-burnt-siena-lightest)]'
                : 'border-transparent hover:border-[var(--color-burnt-siena-lighter)]',
              disabled ? 'cursor-not-allowed opacity-70' : '',
              /** The focus ring belongs to the row, since the control itself is not drawn. */
              'focus-within:ring-2 focus-within:ring-[var(--color-accent-primary)]',
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
              /**
               * Hidden to the eye, not to the keyboard.
               *
               * `sr-only` keeps it focusable and operable with the arrow keys and the space
               * bar; `hidden` or `display:none` would have taken the whole question away from
               * anyone not using a mouse. The square beside it is what gets drawn instead.
               */
              className="sr-only"
            />
            <span
              aria-hidden
              className={[
                'flex size-7 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-heading)] text-sm font-bold uppercase transition',
                checked
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)]'
                  : 'bg-[var(--color-burnt-siena-lightest)] text-[var(--color-text-secondary)]',
              ].join(' ')}
            >
              {letterLabel(index)}
            </span>
            <span
              className={[
                'text-[var(--color-text-primary)]',
                checked ? 'font-semibold' : '',
              ].join(' ')}
            >
              {option.text}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
};

export default ChoiceExercise;
