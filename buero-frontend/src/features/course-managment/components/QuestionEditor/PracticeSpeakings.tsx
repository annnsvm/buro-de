import React from 'react';
import { usePersistentDraft } from '@/hooks/usePersistentDraft';
import { Pencil, Trash2 } from 'lucide-react';
import type {
  EditorElement,
  PracticeBlockName,
  SaveElementPayload,
} from '@/api/questionEditorApi';

export type PracticeSpeakingsProps = {
  block: PracticeBlockName;
  elements: EditorElement[];
  saving: boolean;
  onSave: (elementId: string | null, payload: SaveElementPayload) => Promise<void>;
  onDelete: (elementId: string) => Promise<void>;
  /** Where to keep the half-written form. Omitting it discards it on unmount, as before. */
  draftKey?: string | null;
};

type Draft = {
  id: string | null;
  title: string;
  body: string;
  sampleAnswer: string;
  hints: string;
};

const blank = (): Draft => ({
  id: null,
  title: '',
  body: '',
  sampleAnswer: '',
  hints: '',
});

/**
 * The prompts a speaking block asks.
 *
 * Nine of these imported into module 2 and were invisible for a day, because every block's tab
 * showed its questions and speaking has none - so the tab read as empty while the work sat in
 * the database. This is that view.
 */
const PracticeSpeakings: React.FC<PracticeSpeakingsProps> = ({
  block,
  elements,
  saving,
  onSave,
  onDelete,
  draftKey = null,
}) => {
  /**
   * The half-written task survives leaving this editor.
   *
   * Switching to another block unmounts this component, which used to destroy everything typed
   * into the form. A rubric runs to several paragraphs, so losing it to a stray click cost real
   * work - and the author had no way of knowing a click would cost anything.
   */
  const {
    value: draft,
    setValue: setDraft,
    clear: forgetDraft,
  } = usePersistentDraft<Draft | null>(draftKey, null);

  const problem = !draft
    ? null
    : !draft.body.trim()
      ? 'Напишіть завдання - це те, що студент прочитає перед тим, як говорити.'
      : !draft.sampleAnswer.trim()
        ? 'Потрібен зразок відповіді: студент слухає себе і порівнює саме з ним. Без зразка завданню нічим себе перевірити.'
        : null;

  const submit = async () => {
    if (!draft || problem) return;
    await onSave(draft.id, {
      block,
      kind: 'rec',
      title: draft.title,
      body: draft.body,
      sample_answer: draft.sampleAnswer,
      hints: draft.hints,
    });
    setDraft(null);
    /** Saved, so there is nothing left to protect. */
    forgetDraft();
  };

  const field = (key: keyof Draft) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setDraft((prev) => (prev ? { ...prev, [key]: event.target.value } : prev));

  const form = (
    <div className="space-y-3 rounded-lg bg-[var(--color-surface-section)] p-3">
      <p className="text-sm font-bold text-[var(--color-text-primary)]">
        {draft?.id ? 'Редагування завдання' : 'Нове завдання на говоріння'}
      </p>

      <label className="block text-sm">
        Завдання - його студент читає перед тим, як говорити
        <textarea
          value={draft?.body ?? ''}
          onChange={field('body')}
          rows={4}
          placeholder="Запишіть 3–4 речення: кому ви сьогодні допомагали і чим."
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        Коротка назва - не обовʼязково
        <input
          type="text"
          value={draft?.title ?? ''}
          onChange={field('title')}
          maxLength={300}
          placeholder="Кому ви допомагали"
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
          Лише для списку. Якщо не вказати - візьметься перше речення завдання.
        </span>
      </label>

      <label className="block text-sm">
        Зразкова відповідь
        <textarea
          value={draft?.sampleAnswer ?? ''}
          onChange={field('sampleAnswer')}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
          Відкривається студенту тільки після того, як він щось записав. Прочитати гарну
          відповідь до того, як сказати свою - це переписати її, а не скласти.
        </span>
      </label>

      <label className="block text-sm">
        Слова-опори - по одному в рядку
        <textarea
          value={draft?.hints ?? ''}
          onChange={field('hints')}
          rows={4}
          placeholder={'Ich helfe …\nIch danke …'}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>

      {problem ? (
        <p className="text-xs font-medium text-[var(--color-error)]">{problem}</p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={saving || Boolean(problem)}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Зберігаємо…' : 'Зберегти завдання'}
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(null);
            forgetDraft();
          }}
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
          <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
            Завдання на говоріння
          </h4>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            Питань тут немає: студент записує відповідь, слухає себе і порівнює з вашим
            зразком. Оцінки немає - перевіряє себе він сам.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDraft(blank())}
          className="shrink-0 rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium"
        >
          Додати завдання
        </button>
      </div>

      {draft && !draft.id ? <div className="mt-3">{form}</div> : null}

      <ul className="mt-3 space-y-2">
        {elements.map((element) =>
          draft?.id === element.id ? (
            <li key={element.id}>{form}</li>
          ) : (
            <li
              key={element.id}
              className="rounded-lg border border-[var(--color-border-subtle)] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {element.body?.trim() || element.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                    {element.sample_answer || '-'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Редагувати завдання ${element.title}`}
                    onClick={() =>
                      setDraft({
                        id: element.id,
                        /** A task saved before the split has its text in the name. */
                        title: element.body?.trim() ? element.title : '',
                        body: element.body?.trim() ? element.body : element.title,
                        sampleAnswer: element.sample_answer ?? '',
                        hints: element.hints ?? '',
                      })
                    }
                    className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Видалити завдання ${element.title}`}
                    onClick={() => void onDelete(element.id)}
                    className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/**
               * Without a model answer the student has nothing to compare their recording
               * against, and the task quietly becomes "say something into the microphone".
               */}
              {!element.sample_answer ? (
                <p className="mt-2 text-xs font-medium text-[var(--color-error)]">
                  Немає зразка відповіді - студенту нічим перевірити себе
                </p>
              ) : null}
            </li>
          ),
        )}
      </ul>

      {elements.length === 0 && !draft ? (
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Завдань на говоріння ще немає. Натисніть «Додати завдання» - або імпортуйте їх із CSV
          рядком типу REC.
        </p>
      ) : null}
    </section>
  );
};

export default PracticeSpeakings;
