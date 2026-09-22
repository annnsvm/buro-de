import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ExerciseRendererProps } from './exercise.types';

/**
 * Putting the words of a sentence in order — the exercise that drills German word
 * order, which is where most learners of the language struggle.
 *
 * Words are tapped into place rather than dragged: tapping works the same with a
 * finger and a mouse, needs no pointer precision, and keeps the exercise usable on a
 * phone, where most of this studying happens.
 */
const OrderingExercise: React.FC<ExerciseRendererProps> = ({
  question,
  answer,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const chosen = Array.isArray(answer) ? answer : answer ? [answer] : [];
  const tokens = question.tokens ?? [];

  /** Tokens can repeat, so positions are tracked rather than values. */
  const usedCounts = chosen.reduce<Record<string, number>>((acc, token) => {
    acc[token] = (acc[token] ?? 0) + 1;
    return acc;
  }, {});
  const remaining: Array<{ token: string; key: string }> = [];
  const seen: Record<string, number> = {};
  tokens.forEach((token, index) => {
    seen[token] = (seen[token] ?? 0) + 1;
    if (seen[token] > (usedCounts[token] ?? 0)) {
      remaining.push({ token, key: `${token}-${index}` });
    }
  });

  const append = (token: string) => {
    if (disabled) return;
    onChange([...chosen, token]);
  };

  const removeAt = (position: number) => {
    if (disabled) return;
    onChange(chosen.filter((_, index) => index !== position));
  };

  return (
    <div className="space-y-4">
      <div
        className="min-h-[56px] rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-neutral-white)] p-3"
        aria-live="polite"
        aria-label={t('quiz.yourSentence')}
      >
        {chosen.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t('quiz.tapWordsInOrder')}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chosen.map((token, position) => (
              <button
                key={`${token}-${position}`}
                type="button"
                onClick={() => removeAt(position)}
                disabled={disabled}
                aria-label={t('quiz.removeWord', { word: token })}
                className="rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-sm text-[var(--color-text-on-accent)] disabled:opacity-70"
              >
                {token}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {remaining.map(({ token, key }) => (
          <button
            key={key}
            type="button"
            onClick={() => append(token)}
            disabled={disabled}
            className="rounded-full border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)] disabled:opacity-70"
          >
            {token}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderingExercise;
