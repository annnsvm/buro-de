import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  createEditorQuestion,
  deleteEditorQuestion,
  fetchEditorQuestions,
  updateEditorQuestion,
  type EditorQuestion,
  type SaveQuestionPayload,
} from '@/api/questionEditorApi';
import type { QuizQuestionType } from '@/api/quizApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';

export type QuestionEditorProps = {
  courseId: string;
  moduleId: string;
  materialId: string;
};

const TYPE_LABELS: Record<QuizQuestionType, string> = {
  single_choice: 'Один варіант',
  multi_choice: 'Кілька варіантів',
  fill_blank: 'Вписати слово',
  text_input: 'Вписати речення',
  ordering: 'Порядок слів',
};

/**
 * Options get their id here rather than on the server. Without one there is nothing to
 * mark as correct, so a brand new question could never be saved: the answer key stayed
 * empty and the save was refused.
 */
const newOption = () => ({ id: crypto.randomUUID(), text: '' });

const blankQuestion = (): EditorQuestion => ({
  id: '',
  type: 'single_choice',
  prompt: '',
  accepted_answers: [],
  explanation: null,
  points: 1,
  skills: [],
  order_index: 0,
  options: [newOption(), newOption()],
  tokens: [],
});

/**
 * Editing the questions of a quiz on the platform.
 *
 * Questions arrive by import and are corrected here, so this works directly on the
 * questions rather than on a blob of JSON attached to the material. The server
 * refuses a question a student could not answer, and the reason is shown here rather
 * than the save quietly doing nothing.
 */
const QuestionEditor: React.FC<QuestionEditorProps> = ({
  courseId,
  moduleId,
  materialId,
}) => {
  const [questions, setQuestions] = useState<EditorQuestion[]>([]);
  const [draft, setDraft] = useState<EditorQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setQuestions(await fetchEditorQuestions(courseId, moduleId, materialId));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Не вдалося завантажити питання'));
    } finally {
      setLoading(false);
    }
  }, [courseId, moduleId, materialId]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const payload: SaveQuestionPayload = {
        type: draft.type,
        prompt: draft.prompt,
        accepted_answers: draft.accepted_answers,
        explanation: draft.explanation ?? undefined,
        points: draft.points,
        ...(draft.type === 'single_choice' || draft.type === 'multi_choice'
          ? { options: draft.options }
          : {}),
        ...(draft.type === 'ordering' ? { tokens: draft.tokens } : {}),
      };
      if (draft.id) {
        await updateEditorQuestion(courseId, moduleId, materialId, draft.id, payload);
      } else {
        await createEditorQuestion(courseId, moduleId, materialId, payload);
      }
      setDraft(null);
      await load();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Не вдалося зберегти питання'));
    } finally {
      setSaving(false);
    }
  }, [draft, courseId, moduleId, materialId, load]);

  const remove = useCallback(
    async (questionId: string) => {
      setError(null);
      try {
        await deleteEditorQuestion(courseId, moduleId, materialId, questionId);
        await load();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Не вдалося видалити питання'));
      }
    },
    [courseId, moduleId, materialId, load],
  );

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
        Завантаження питань…
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Питань у квізі: {questions.length}
        </p>
        <button
          type="button"
          onClick={() => setDraft(blankQuestion())}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white"
        >
          Додати питання
        </button>
      </div>

      {error ? (
        <p className="text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {draft ? (
        <QuestionForm
          draft={draft}
          saving={saving}
          onChange={setDraft}
          onCancel={() => setDraft(null)}
          onSave={() => void save()}
        />
      ) : null}

      <ul className="space-y-2">
        {questions.map((question, index) => (
          <li
            key={question.id}
            className="rounded-xl border border-[var(--color-border-default)] p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => setDraft(question)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
                  {index + 1} · {TYPE_LABELS[question.type]}
                  {question.points > 1 ? ` · ${question.points} бали` : ''}
                </span>
                <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                  {question.prompt || '—'}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Відповідь: {answerLabel(question)}
                </p>
              </button>
              <button
                type="button"
                aria-label={`Видалити питання ${index + 1}`}
                onClick={() => void remove(question.id)}
                className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {questions.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--color-text-secondary)]">
          Питань ще немає. Завантажте їх із CSV або додайте вручну.
        </p>
      ) : null}
    </div>
  );
};

/** Shows the answer key the way the author wrote it, not as internal option ids. */
const answerLabel = (question: EditorQuestion): string => {
  if (question.type === 'single_choice' || question.type === 'multi_choice') {
    const byId = new Map(question.options.map((option) => [option.id, option.text]));
    return question.accepted_answers
      .map((accepted) =>
        accepted
          .split(',')
          .map((id) => byId.get(id.trim()) ?? id.trim())
          .join(', '),
      )
      .join(' / ');
  }
  return question.accepted_answers.join(' / ');
};

const QuestionForm: React.FC<{
  draft: EditorQuestion;
  saving: boolean;
  onChange: (draft: EditorQuestion) => void;
  onCancel: () => void;
  onSave: () => void;
}> = ({ draft, saving, onChange, onCancel, onSave }) => {
  const isChoice = draft.type === 'single_choice' || draft.type === 'multi_choice';

  return (
    <div className="space-y-3 rounded-xl bg-[var(--color-surface-section)] p-4">
      <label className="block text-sm">
        Тип
        <select
          value={draft.type}
          onChange={(event) =>
            onChange({
              ...draft,
              type: event.target.value as QuizQuestionType,
              // The answer key means something different per type, so it is cleared.
              accepted_answers: [],
            })
          }
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        >
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Питання
        <textarea
          value={draft.prompt}
          onChange={(event) => onChange({ ...draft, prompt: event.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>

      {isChoice ? (
        <fieldset className="space-y-2 text-sm">
          <legend>Варіанти — позначте правильні</legend>
          {draft.options.map((option, index) => {
            const key = option.id || `option-${index}`;
            const selected = draft.accepted_answers
              .flatMap((accepted) => accepted.split(','))
              .map((value) => value.trim())
              .includes(option.id);
            return (
              <div key={key} className="flex items-center gap-2">
                <input
                  type={draft.type === 'multi_choice' ? 'checkbox' : 'radio'}
                  name="correct-option"
                  checked={selected}
                  onChange={() => {
                    if (draft.type === 'single_choice') {
                      onChange({ ...draft, accepted_answers: [option.id] });
                      return;
                    }
                    const chosen = new Set(
                      draft.accepted_answers.flatMap((accepted) =>
                        accepted.split(',').map((value) => value.trim()),
                      ),
                    );
                    if (chosen.has(option.id)) chosen.delete(option.id);
                    else chosen.add(option.id);
                    onChange({
                      ...draft,
                      accepted_answers: chosen.size
                        ? [[...chosen].sort().join(',')]
                        : [],
                    });
                  }}
                  className="accent-[var(--color-primary)]"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(event) => {
                    const options = [...draft.options];
                    options[index] = { ...option, text: event.target.value };
                    onChange({ ...draft, options });
                  }}
                  className="flex-1 rounded-lg border border-[var(--color-border-default)] px-3 py-2"
                />
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              onChange({ ...draft, options: [...draft.options, newOption()] })
            }
            className="text-xs text-[var(--color-primary)]"
          >
            Додати варіант
          </button>
        </fieldset>
      ) : (
        <label className="block text-sm">
          Правильні відповіді — кожна з нового рядка
          <textarea
            value={draft.accepted_answers.join('\n')}
            onChange={(event) =>
              onChange({
                ...draft,
                accepted_answers: event.target.value.split('\n'),
              })
            }
            rows={3}
            className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          />
        </label>
      )}

      {draft.type === 'ordering' ? (
        <label className="block text-sm">
          Слова для впорядкування — через кому
          <input
            type="text"
            value={draft.tokens.join(', ')}
            onChange={(event) =>
              onChange({
                ...draft,
                tokens: event.target.value.split(',').map((token) => token.trim()),
              })
            }
            className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          />
        </label>
      ) : null}

      <label className="block text-sm">
        Пояснення — показується студенту після відповіді
        <textarea
          value={draft.explanation ?? ''}
          onChange={(event) => onChange({ ...draft, explanation: event.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        Бали
        <input
          type="number"
          min={1}
          value={draft.points}
          onChange={(event) =>
            onChange({ ...draft, points: Math.max(1, Number(event.target.value)) })
          }
          className="mt-1 block w-24 rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Зберігаємо…' : 'Зберегти питання'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--color-border-default)] px-5 py-2 text-sm"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
};

export default QuestionEditor;
