import React from 'react';
import type { WritingTaskDraft } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

export type WritingTaskFieldsProps = {
  draft: WritingTaskDraft;
  isSubmitting: boolean;
  onChange: (next: WritingTaskDraft) => void;
};

const inputClass =
  'mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2 text-sm outline-none disabled:opacity-60';

/**
 * Authoring a writing task.
 *
 * The criteria are written here rather than in code, because every module brings its own. They
 * are used three times over, word for word: shown to the student before they write, sent to the
 * grader, and quoted back beside the mark. That is why they are free text and not a fixed list —
 * a criterion is a sentence the teacher wrote, not an option from a menu.
 *
 * The first criterion is the one about length and the letter's formulas. It is always decided by
 * counting rather than by the grader, so the mark that gates the next module does not rest on a
 * model having counted sentences correctly.
 */
const WritingTaskFields: React.FC<WritingTaskFieldsProps> = ({
  draft,
  isSubmitting,
  onChange,
}) => {
  const setCriterion = (index: number, value: string) => {
    const criteria = [...draft.criteria];
    criteria[index] = value;
    onChange({ ...draft, criteria });
  };

  return (
    <fieldset className="space-y-4 rounded-xl bg-[var(--color-surface-section)] p-4">
      <legend className="text-sm font-semibold text-[var(--color-text-primary)]">
        Письмове завдання
      </legend>

      <label className="block text-sm">
        Умова для студента
        <textarea
          value={draft.task}
          onChange={(event) => onChange({ ...draft, task: event.target.value })}
          rows={4}
          disabled={isSubmitting}
          className={inputClass}
        />
      </label>

      <div className="flex flex-wrap items-end gap-4 text-sm">
        <label className="block">
          Речень у тілі — від
          <input
            type="number"
            min={1}
            value={draft.minSentences}
            onChange={(event) =>
              onChange({ ...draft, minSentences: Math.max(1, Number(event.target.value) || 1) })
            }
            disabled={isSubmitting}
            className={`${inputClass} w-24`}
          />
        </label>
        <label className="block">
          до
          <input
            type="number"
            min={1}
            value={draft.maxSentences}
            onChange={(event) =>
              onChange({ ...draft, maxSentences: Math.max(1, Number(event.target.value) || 1) })
            }
            disabled={isSubmitting}
            className={`${inputClass} w-24`}
          />
        </label>
        <p className="basis-full text-xs text-[var(--color-text-secondary)]">
          Коротший лист повертається студентові з проханням дописати — спроба не зараховується і
          перевірка не оплачується.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          Критерії — по одному балу за кожен
        </p>
        {draft.criteria.map((criterion, index) => (
          <label key={index} className="block text-sm">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {index === 0 ? '1 — обсяг і формули листа (перевіряється підрахунком)' : index + 1}
            </span>
            <textarea
              value={criterion}
              onChange={(event) => setCriterion(index, event.target.value)}
              rows={2}
              disabled={isSubmitting}
              className={inputClass}
            />
          </label>
        ))}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...draft, criteria: [...draft.criteria, ''] })}
            disabled={isSubmitting || draft.criteria.length >= 10}
            className="rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            Додати критерій
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...draft, criteria: draft.criteria.slice(0, -1) })}
            disabled={isSubmitting || draft.criteria.length <= 2}
            className="rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            Прибрати останній
          </button>
        </div>
      </div>

      <label className="block text-sm">
        Зразок відповіді на максимальний бал
        <textarea
          value={draft.modelAnswer}
          onChange={(event) => onChange({ ...draft, modelAnswer: event.target.value })}
          rows={6}
          disabled={isSubmitting}
          className={inputClass}
        />
        {/* Shown only if the monthly budget runs out, so the task degrades to self-marking
            instead of breaking. Never shown while checking works. */}
        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
          Показується студентові лише якщо автоматична перевірка тимчасово недоступна — тоді він
          звіряється зі зразком сам. Поки перевірка працює, зразок не видно.
        </span>
      </label>
    </fieldset>
  );
};

export default WritingTaskFields;
