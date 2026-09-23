import React from 'react';
import type { QuizMaterialMode } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

export type QuizModeFieldsProps = {
  quizMode: QuizMaterialMode;
  passingScore: number;
  isSubmitting: boolean;
  onQuizModeChange: (mode: QuizMaterialMode) => void;
  onPassingScoreChange: (score: number) => void;
};

/**
 * The one decision that separates a lesson quiz from a module test.
 *
 * It has to be made here rather than inferred later, because the two are counted
 * differently and a student meets the difference immediately: a practice quiz marks
 * each answer as it comes and scores questions, a test marks nothing until the end and
 * scores the points the author gave each task. Choosing it by accident — which is what
 * happened while the mode could only be set by the CSV import — means a module test
 * that hands out its answer key, or a lesson quiz that refuses to say anything until
 * the last question.
 */
const QuizModeFields: React.FC<QuizModeFieldsProps> = ({
  quizMode,
  passingScore,
  isSubmitting,
  onQuizModeChange,
  onPassingScoreChange,
}) => (
  <fieldset className="space-y-3 rounded-xl bg-[var(--color-surface-section)] p-4">
    <legend className="text-sm font-semibold text-[var(--color-text-primary)]">
      Що це за перевірка
    </legend>

    <label className="flex items-start gap-3 text-sm">
      <input
        type="radio"
        name="quizMode"
        checked={quizMode === 'practice'}
        onChange={() => onQuizModeChange('practice')}
        disabled={isSubmitting}
        className="mt-1 accent-[var(--color-primary)]"
      />
      <span>
        <span className="font-medium text-[var(--color-text-primary)]">Квіз уроку</span>
        <span className="block text-xs text-[var(--color-text-secondary)]">
          Кожна відповідь перевіряється одразу, разом із поясненням. Результат — відсоток
          правильних відповідей, бали питань не враховуються. Спроб скільки завгодно.
        </span>
      </span>
    </label>

    <label className="flex items-start gap-3 text-sm">
      <input
        type="radio"
        name="quizMode"
        checked={quizMode === 'test'}
        onChange={() => onQuizModeChange('test')}
        disabled={isSubmitting}
        className="mt-1 accent-[var(--color-primary)]"
      />
      <span>
        <span className="font-medium text-[var(--color-text-primary)]">Тест модуля</span>
        <span className="block text-xs text-[var(--color-text-secondary)]">
          Відповіді перевіряються всі разом наприкінці. Результат рахується в балах, які ви
          поставили питанням. Правильні відповіді відкриються лише після зарахування.
        </span>
      </span>
    </label>

    {quizMode === 'test' ? (
      <label className="flex flex-wrap items-center gap-2 pt-1 text-sm text-[var(--color-text-primary)]">
        Для зарахування потрібно
        <input
          id="quizPassingScore"
          type="number"
          min={1}
          max={100}
          value={passingScore}
          onChange={(event) =>
            onPassingScoreChange(
              Math.min(100, Math.max(1, Number(event.target.value) || 1)),
            )
          }
          disabled={isSubmitting}
          className="w-20 rounded-[12px] border border-[var(--color-border-default)] px-3 py-2 outline-none"
        />
        % балів
        <span className="basis-full text-xs text-[var(--color-text-secondary)]">
          Відсоток, а не бали: тест можна доповнити питанням, і поріг залишиться тим самим.
          Для тесту на 25 балів 60% — це 15 балів.
        </span>
      </label>
    ) : null}
  </fieldset>
);

export default QuizModeFields;
