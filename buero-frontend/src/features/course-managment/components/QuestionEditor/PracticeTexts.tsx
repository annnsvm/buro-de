import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { EditorElement, PracticeBlockName, SaveElementPayload } from '@/api/questionEditorApi';

export type PracticeTextsProps = {
  block: PracticeBlockName;
  elements: EditorElement[];
  saving: boolean;
  onSave: (elementId: string | null, payload: SaveElementPayload) => Promise<void>;
  onDelete: (elementId: string) => Promise<void>;
  /** Opens the question form already pointed at this text. */
  onAddQuestion: (elementId: string) => void;
};

type Draft = { id: string | null; title: string; body: string };

/**
 * The texts a reading block asks about.
 *
 * A text and its questions are added in that order, and the panel says so: a text on its own
 * is never shown to anyone, so each one carries the count of questions about it and the way to
 * add the next. The text being edited replaces its own row rather than appearing above it —
 * showing the same text twice, once in a form and once in a list, read as two different things.
 */
const PracticeTexts: React.FC<PracticeTextsProps> = ({
  block,
  elements,
  saving,
  onSave,
  onDelete,
  onAddQuestion,
}) => {
  const [draft, setDraft] = useState<Draft | null>(null);

  const submit = async () => {
    if (!draft) return;
    await onSave(draft.id, { block, kind: 'text', title: draft.title, body: draft.body });
    setDraft(null);
  };

  const form = (
    <div className="space-y-3 rounded-lg bg-[var(--color-surface-section)] p-3">
      <p className="text-sm font-bold text-[var(--color-text-primary)]">
        {draft?.id ? 'Редагування тексту' : 'Новий текст'}
      </p>
      <label className="block text-sm">
        Заголовок — його студент бачить над текстом
        <input
          type="text"
          value={draft?.title ?? ''}
          onChange={(event) =>
            setDraft((prev) => (prev ? { ...prev, title: event.target.value } : prev))
          }
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Текст — його студент читає, відповідаючи на питання
        <textarea
          value={draft?.body ?? ''}
          onChange={(event) =>
            setDraft((prev) => (prev ? { ...prev, body: event.target.value } : prev))
          }
          rows={10}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={saving || !draft?.title.trim()}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Зберігаємо…' : 'Зберегти текст'}
        </button>
        <button
          type="button"
          onClick={() => setDraft(null)}
          className="rounded-full border border-[var(--color-border-default)] px-5 py-2 text-sm"
        >
          Скасувати
        </button>
      </div>
    </div>
  );

  return (
    <section className="rounded-xl border border-[var(--color-border-default)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Тексти для читання</h4>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            Спочатку текст, потім питання до нього. Студент читає текст і бачить його весь час, поки
            відповідає.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDraft({ id: null, title: '', body: '' })}
          className="shrink-0 rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium"
        >
          Додати текст
        </button>
      </div>

      {/* A brand new text has no row of its own yet, so its form goes at the top. */}
      {draft && !draft.id ? <div className="mt-3">{form}</div> : null}

      <ul className="mt-3 space-y-2">
        {elements.map((element) =>
          draft?.id === element.id ? (
            /* The text being edited becomes the form, so it is never on screen twice. */
            <li key={element.id}>{form}</li>
          ) : (
            <li
              key={element.id}
              className="rounded-lg border border-[var(--color-border-subtle)] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {element.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                    {element.body || '—'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Редагувати текст ${element.title}`}
                    onClick={() =>
                      setDraft({
                        id: element.id,
                        title: element.title,
                        body: element.body ?? '',
                      })
                    }
                    className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Видалити текст ${element.title}`}
                    onClick={() => void onDelete(element.id)}
                    className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                {/**
                 * A text no question points at is never shown to a student — nothing on the
                 * lesson page would reveal that, so it is said here instead.
                 */}
                <p
                  className={[
                    'text-xs font-medium',
                    element.question_count === 0
                      ? 'text-[var(--color-error)]'
                      : 'text-[var(--color-text-secondary)]',
                  ].join(' ')}
                >
                  {element.question_count === 0
                    ? 'Питань про цей текст ще немає — студент його не побачить'
                    : `Питань про цей текст: ${element.question_count}`}
                </p>
                <button
                  type="button"
                  onClick={() => onAddQuestion(element.id)}
                  className="rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-medium text-white"
                >
                  Додати питання про цей текст
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {elements.length === 0 && !draft ? (
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Текстів ще немає. Натисніть «Додати текст» — і тоді до нього можна буде додавати питання.
        </p>
      ) : null}
    </section>
  );
};

export default PracticeTexts;
