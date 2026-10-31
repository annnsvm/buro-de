import React from 'react';
import { usePersistentDraft } from '@/hooks/usePersistentDraft';
import { Pencil, Trash2 } from 'lucide-react';
import type {
  EditorElement,
  PracticeBlockName,
  SaveElementPayload,
} from '@/api/questionEditorApi';

export type PracticeWritingsProps = {
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
  criteria: string;
  minSentences: string;
  maxSentences: string;
  sampleAnswer: string;
};

const blank = (): Draft => ({
  id: null,
  title: '',
  body: '',
  criteria: '',
  minSentences: '',
  maxSentences: '',
  sampleAnswer: '',
});

/** The criteria are one per line, which is how a person writes a list. */
const splitCriteria = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:\d+[.)]|[-–—•])\s*/, '').trim())
    .filter(Boolean);

/**
 * The letters a writing block asks for.
 *
 * Unlike the other blocks, nothing here is a question: a letter is marked against the rubric
 * its author wrote, so the rubric is the task. Each row says how many criteria it carries and
 * what the letter is marked out of, because a task saved without them reaches the student as
 * one that cannot be checked at all.
 */
const PracticeWritings: React.FC<PracticeWritingsProps> = ({
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

  const criteria = draft ? splitCriteria(draft.criteria) : [];
  const min = Number(draft?.minSentences);
  const max = Number(draft?.maxSentences);
  /**
   * What the server would refuse, said before the save rather than after it.
   *
   * The grader takes two to ten criteria, and the length criterion is settled by counting, so
   * there has to be a range to count against.
   */
  const problem = !draft
    ? null
    : !draft.body.trim()
      ? 'Напишіть завдання - це те, що студент прочитає перед тим, як писати.'
      : criteria.length < 2
        ? 'Потрібно щонайменше два критерії - по одному в рядку.'
        : criteria.length > 10
          ? 'Критеріїв не більше десяти.'
          : !Number.isInteger(min) || min < 1 || !Number.isInteger(max) || max < min
            ? 'Вкажіть, скільки речень має бути в тілі листа - від і до.'
            : !draft.sampleAnswer.trim()
              ? 'Потрібен зразок відповіді: саме його студент читає, коли перевірок на місяць більше немає.'
              : null;

  const submit = async () => {
    if (!draft || problem) return;
    await onSave(draft.id, {
      block,
      kind: 'write',
      title: draft.title,
      body: draft.body,
      criteria,
      min_sentences: min,
      max_sentences: max,
      sample_answer: draft.sampleAnswer,
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
        {draft?.id ? 'Редагування письмового завдання' : 'Нове письмове завдання'}
      </p>

      {/**
        * The task first, and it is the only required one of the two.
        *
        * These used to be a single field carrying the name's 300-character limit, which
        * refused a real prompt and left nowhere to type it. A task runs to a paragraph - the
        * situation, then what to write - and that belongs here.
        */}
      <label className="block text-sm">
        Завдання - про що писати. Його студент читає перед тим, як почати
        <textarea
          value={draft?.body ?? ''}
          onChange={field('body')}
          rows={6}
          placeholder={
            'Ви захворіли. На 10:00 у вас була нарада, яку тепер треба скасувати або ' +
            'перенести. Напишіть листа керівникові.'
          }
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
          placeholder="Лист керівникові"
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
          Лише для списку й заголовка, коли в блоці кілька листів. Якщо не вказати - візьметься
          перше речення завдання.
        </span>
      </label>

      <label className="block text-sm">
        Критерії оцінювання - по одному в рядку
        <textarea
          value={draft?.criteria ?? ''}
          onChange={field('criteria')}
          rows={7}
          placeholder={
            'У тілі листа 6–8 речень; є звертання і формула прощання\n' +
            'Є речення з weil, побудоване правильно\n' +
            'Текст зрозумілий і ввічливий'
          }
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
          Студент бачить їх до написання, перевірка оцінює саме за ними, і в результаті вони
          цитуються назад. Лист оцінюється з {criteria.length || '-'} балів.
        </span>
      </label>

      <div className="flex gap-3">
        <label className="block text-sm">
          Речень у тілі листа, від
          <input
            type="number"
            min={1}
            value={draft?.minSentences ?? ''}
            onChange={field('minSentences')}
            className="mt-1 block w-24 rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          до
          <input
            type="number"
            min={1}
            value={draft?.maxSentences ?? ''}
            onChange={field('maxSentences')}
            className="mt-1 block w-24 rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm">
        Зразок відповіді на всі бали
        <textarea
          value={draft?.sampleAnswer ?? ''}
          onChange={field('sampleAnswer')}
          rows={6}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
        <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
          Студент читає його і перевіряє себе сам, коли перевірок на місяць більше немає. Без
          зразка завдання в такому разі просто зламається.
        </span>
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
            Письмові завдання
          </h4>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            Питань тут немає: студент пише лист, а перевірка оцінює його за вашими критеріями.
            Три спроби на завдання.
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
                    {element.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                    {element.body?.trim() || '-'}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {element.min_sentences && element.max_sentences
                      ? `${element.min_sentences}–${element.max_sentences} речень у тілі листа`
                      : 'Кількість речень не вказана'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Редагувати завдання ${element.title}`}
                    onClick={() =>
                      setDraft({
                        id: element.id,
                        /**
                         * A task saved before the two fields were split has its text in the
                         * name. It is loaded as the task, where it belongs - otherwise
                         * opening it to edit would offer a 300-character box holding a
                         * paragraph, and saving would be refused.
                         */
                        title: element.body?.trim() ? element.title : '',
                        body: element.body?.trim() ? element.body : element.title,
                        criteria: element.criteria.join('\n'),
                        minSentences: element.min_sentences?.toString() ?? '',
                        maxSentences: element.max_sentences?.toString() ?? '',
                        sampleAnswer: element.sample_answer ?? '',
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
               * A task the student cannot be marked on is the one failure that is invisible
               * from the lesson page: the block simply reports the task as not ready. Which of
               * the three pieces is missing is said here, where it can be fixed.
               */}
              <p
                className={[
                  'mt-2 text-xs font-medium',
                  element.criteria.length >= 2 &&
                  element.min_sentences &&
                  element.max_sentences &&
                  element.sample_answer
                    ? 'text-[var(--color-text-secondary)]'
                    : 'text-[var(--color-error)]',
                ].join(' ')}
              >
                {element.criteria.length < 2
                  ? 'Критеріїв менше двох - цей лист неможливо перевірити'
                  : !element.min_sentences || !element.max_sentences
                    ? 'Не вказано, скільки речень має бути - цей лист неможливо перевірити'
                    : !element.sample_answer
                      ? 'Немає зразка відповіді - коли перевірок на місяць не залишиться, завдання зламається'
                      : `Критеріїв: ${element.criteria.length}. Лист оцінюється з ${element.criteria.length} балів`}
              </p>
            </li>
          ),
        )}
      </ul>

      {elements.length === 0 && !draft ? (
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Письмових завдань ще немає. Натисніть «Додати завдання» - або імпортуйте їх із CSV
          рядком типу WRITE.
        </p>
      ) : null}
    </section>
  );
};

export default PracticeWritings;
