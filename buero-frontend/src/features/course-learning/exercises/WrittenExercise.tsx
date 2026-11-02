import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ExerciseRendererProps } from './exercise.types';

/**
 * Typing the answer: one word into a gap, or a whole sentence.
 *
 * This is the exercise that actually makes someone recall the German rather than
 * recognise it among four options, which is why the authored content leans on it.
 * The server accepts `ae/oe/ue/ss` for the umlauts, so no German keyboard is needed.
 */
const WrittenExercise: React.FC<ExerciseRendererProps> = ({
  question,
  answer,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const value = Array.isArray(answer) ? (answer[0] ?? '') : answer;
  const isSentence = question.type === 'text_input';
  const inputId = `${question.id}-answer`;
  const FIELD =
    'w-full rounded-[14px] border-[1.5px] border-[var(--color-surface-section)] bg-[var(--color-neutral-white)] px-4 py-3 font-mono text-[1.05rem] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)] disabled:opacity-70';

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="sr-only">
        {question.prompt}
      </label>
      {isSentence ? (
        <textarea
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={3}
          autoComplete="off"
          spellCheck={false}
          placeholder={t('quiz.writeSentence')}
          className={`${FIELD} leading-relaxed`}
        />
      ) : (
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          placeholder={t('quiz.writeWord')}
          className={`${FIELD} min-h-13`}
        />
      )}
      <p className="text-[0.8rem] text-[var(--color-text-secondary)]">
        {t('quiz.umlautHint')}
      </p>
    </div>
  );
};

export default WrittenExercise;
