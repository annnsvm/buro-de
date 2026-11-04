import React from 'react';
import type { QuizMaterialMode } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

export type QuizModeFieldsProps = {
  /**
   * Whether the choice between a lesson quiz and a module test is still open.
   *
   * It is not, for anything made from now on: a quiz created here is the module's final
   * test, because the practice does what a lesson quiz used to do and does it better. The
   * choice is still shown for a quiz that already exists as a lesson quiz, so the ones
   * already in the course can be seen for what they are and converted if their author
   * wants - taking the option away entirely would have stranded them.
   */
  showModeChoice: boolean;
  quizMode: QuizMaterialMode;
  passingScore: number;
  isSubmitting: boolean;
  onQuizModeChange: (mode: QuizMaterialMode) => void;
  onPassingScoreChange: (score: number) => void;
};

/**
 * What a test is marked out of, and - where it is still a question - what kind it is.
 *
 * The two kinds are counted differently and a student meets the difference at once: a
 * lesson quiz marks each answer as it comes and scores questions, a test marks nothing
 * until the end and scores the points the author gave each task.
 */
const QuizModeFields: React.FC<QuizModeFieldsProps> = ({
  showModeChoice,
  quizMode,
  passingScore,
  isSubmitting,
  onQuizModeChange,
  onPassingScoreChange,
}) => {
  const scored = !showModeChoice || quizMode === 'test';

  return (
    <fieldset className="space-y-3 rounded-xl bg-[var(--color-surface-section)] p-4">
      <legend className="text-sm font-semibold text-[var(--color-text-primary)]">
        {showModeChoice ? 'Що це за перевірка' : 'Фінальний тест модуля'}
      </legend>

      {showModeChoice ? (
        <>
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
              <span className="font-medium text-[var(--color-text-primary)]">
                Квіз уроку
              </span>
              <span className="block text-xs text-[var(--color-text-secondary)]">
                Кожна відповідь перевіряється одразу, разом із поясненням. Результат -
                відсоток правильних відповідей, бали питань не враховуються. Спроб скільки
                завгодно.
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
              <span className="font-medium text-[var(--color-text-primary)]">
                Тест модуля
              </span>
              <span className="block text-xs text-[var(--color-text-secondary)]">
                Відповіді перевіряються всі разом наприкінці. Результат рахується в балах,
                які ви поставили питанням. Правильні відповіді відкриються лише після
                зарахування.
              </span>
            </span>
          </label>
        </>
      ) : (
        <p className="text-xs text-[var(--color-text-secondary)]">
          Відповіді перевіряються всі разом наприкінці, результат рахується в балах питань,
          а правильні відповіді відкриваються лише після зарахування.
        </p>
      )}

      {scored ? (
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
            Відсоток, а не бали: тест можна доповнити питанням, і поріг залишиться тим
            самим. Для тесту на 25 балів 60% - це 15 балів.
          </span>
        </label>
      ) : null}
    </fieldset>
  );
};

export default QuizModeFields;
