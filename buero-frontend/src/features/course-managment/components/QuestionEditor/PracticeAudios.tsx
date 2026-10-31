import React, { useRef, useState } from 'react';
import { usePersistentDraft } from '@/hooks/usePersistentDraft';
import { Pencil, Trash2 } from 'lucide-react';
import {
  PRACTICE_AUDIO_MAX_BYTES,
  type EditorElement,
  type PracticeBlockName,
  type SaveElementPayload,
} from '@/api/questionEditorApi';

export type PracticeAudiosProps = {
  block: PracticeBlockName;
  elements: EditorElement[];
  saving: boolean;
  onSave: (elementId: string | null, payload: SaveElementPayload) => Promise<void>;
  onDelete: (elementId: string) => Promise<void>;
  /** Where to keep the half-written form. Omitting it discards it on unmount, as before. */
  draftKey?: string | null;
  onUploadAudio: (elementId: string, file: File) => Promise<void>;
  /** All at once, matched to the records by file name. */
  onUploadBatch: (files: File[]) => Promise<void>;
  onAddQuestion: (elementId: string) => void;
};

type Draft = { id: string | null; title: string; transcript: string };

/**
 * The recordings a listening block asks about.
 *
 * A recording is made in two steps, and the panel does not pretend otherwise: the entry is
 * created with its title, then the file is attached to it. Uploading into something that does
 * not exist yet would mean holding the file in the browser until a save succeeds, and losing
 * it if the save did not.
 *
 * The transcript is written here but the student does not see it until every question about
 * the recording is answered - otherwise the block tests reading, not listening.
 */
const PracticeAudios: React.FC<PracticeAudiosProps> = ({
  block,
  elements,
  saving,
  onSave,
  onDelete,
  draftKey = null,
  onUploadAudio,
  onUploadBatch,
  onAddQuestion,
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
  const [batching, setBatching] = useState(false);
  const batchPicker = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [tooLarge, setTooLarge] = useState<string | null>(null);
  const pickers = useRef<Record<string, HTMLInputElement | null>>({});

  const submit = async () => {
    if (!draft) return;
    await onSave(draft.id, {
      block,
      kind: 'audio',
      title: draft.title,
      transcript: draft.transcript,
    });
    setDraft(null);
    /** Saved, so there is nothing left to protect. */
    forgetDraft();
  };

  /** Refused here as well as on the server, so a long upload does not end in a rejection. */
  const choose = async (elementId: string, file?: File) => {
    setTooLarge(null);
    if (!file) return;
    if (file.size > PRACTICE_AUDIO_MAX_BYTES) {
      setTooLarge(elementId);
      return;
    }
    setUploading(elementId);
    try {
      await onUploadAudio(elementId, file);
    } finally {
      setUploading(null);
    }
  };

  const form = (
    <div className="space-y-3 rounded-lg bg-[var(--color-surface-section)] p-3">
      <p className="text-sm font-bold text-[var(--color-text-primary)]">
        {draft?.id ? 'Редагування запису' : 'Новий запис'}
      </p>
      <label className="block text-sm">
        Заголовок - його студент бачить над програвачем
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
        Текст запису - відкриється студенту після всіх відповідей про цей запис
        <textarea
          value={draft?.transcript ?? ''}
          onChange={(event) =>
            setDraft((prev) => (prev ? { ...prev, transcript: event.target.value } : prev))
          }
          rows={6}
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
          {saving ? 'Зберігаємо…' : 'Зберегти запис'}
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
            Записи для аудіювання
          </h4>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            Спочатку запис, потім файл до нього, потім питання. MP3, OGG, WAV, M4A - до 15 МБ.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {/**
           * Sixteen recordings in a module, each already named by the imported row - so they go
           * up together and land by name, rather than one dialog at a time with a chance to put
           * each under the wrong question.
           */}
          <input
            ref={batchPicker}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(event) => {
              const chosen = Array.from(event.target.files ?? []);
              if (!chosen.length) return;
              setBatching(true);
              void onUploadBatch(chosen).finally(() => setBatching(false));
            }}
          />
          <button
            type="button"
            onClick={() => batchPicker.current?.click()}
            disabled={batching}
            className="rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            {batching ? 'Завантажуємо…' : 'Завантажити всі файли'}
          </button>
          <button
            type="button"
            onClick={() => setDraft({ id: null, title: '', transcript: '' })}
            className="rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium"
          >
            Додати запис
          </button>
        </div>
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
                    {element.title}
                  </p>
                  {element.audio_url ? (
                    /* Played here, because the only way to know it is the right take is to hear it. */
                    <audio
                      src={element.audio_url}
                      controls
                      preload="none"
                      className="mt-2 w-full max-w-sm"
                    />
                  ) : (
                    <p className="mt-1 text-xs font-medium text-[var(--color-error)]">
                      {element.audio_file_name
                        ? /* Named, so the right file can be found among sixteen of them. */
                          `Очікується файл ${element.audio_file_name} - ще не завантажено`
                        : 'Файл ще не завантажено - студент не почує нічого'}
                    </p>
                  )}
                  {element.transcript ? null : (
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      Тексту запису немає - студенту не буде що відкрити після відповідей
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Редагувати запис ${element.title}`}
                    onClick={() =>
                      setDraft({
                        id: element.id,
                        title: element.title,
                        transcript: element.transcript ?? '',
                      })
                    }
                    className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Видалити запис ${element.title}`}
                    onClick={() => void onDelete(element.id)}
                    className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {tooLarge === element.id ? (
                <p className="mt-2 text-xs font-medium text-[var(--color-error)]" role="alert">
                  Файл завеликий - максимум 15 МБ
                </p>
              ) : null}

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p
                  className={[
                    'text-xs font-medium',
                    element.question_count === 0
                      ? 'text-[var(--color-error)]'
                      : 'text-[var(--color-text-secondary)]',
                  ].join(' ')}
                >
                  {element.question_count === 0
                    ? 'Питань про цей запис ще немає - студент його не почує'
                    : `Питань про цей запис: ${element.question_count}`}
                </p>

                <div className="flex flex-wrap gap-2">
                  <input
                    ref={(node) => {
                      pickers.current[element.id] = node;
                    }}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(event) => void choose(element.id, event.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => pickers.current[element.id]?.click()}
                    disabled={uploading === element.id}
                    className="rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    {uploading === element.id
                      ? 'Завантажуємо…'
                      : element.audio_url
                        ? 'Замінити файл'
                        : 'Завантажити файл'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddQuestion(element.id)}
                    className="rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-medium text-white"
                  >
                    Додати питання про цей запис
                  </button>
                </div>
              </div>
            </li>
          ),
        )}
      </ul>

      {elements.length === 0 && !draft ? (
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Записів ще немає. Натисніть «Додати запис» - і тоді до нього можна буде завантажити файл і
          додати питання.
        </p>
      ) : null}
    </section>
  );
};

export default PracticeAudios;
