import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLessonNote, saveLessonNote } from '@/api/lessonNotesApi';
import { usePersistentDraft } from '@/hooks/usePersistentDraft';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';

export type LessonNotesProps = {
  materialId: string;
};

/** Long enough not to send a request per keystroke, short enough to feel automatic. */
const SAVE_AFTER_MS = 1200;

type Status = 'loading' | 'idle' | 'saving' | 'saved' | 'failed';

/**
 * What a student writes down for themselves while working through a lesson.
 *
 * This box used to be decoration. It had a placeholder and nothing else - no state, no request,
 * nothing stored - so every note ever typed into it was discarded the moment the page changed.
 *
 * Notes are kept on the server, unlike the drafts elsewhere in the product, and the difference
 * is deliberate: a draft is the few minutes between typing and sending, while a note is meant to
 * be there when the lesson is opened again half a year later, from another machine. Only the
 * server can promise that.
 *
 * The device keeps a copy as well, but only as a fallback for a save that did not go through.
 * It is cleared the moment the server has the text, so anything still sitting there is work that
 * was never saved - which is why it wins on the next visit.
 */
const LessonNotes: React.FC<LessonNotesProps> = ({ materialId }) => {
  const { t, i18n } = useTranslation();
  const user = useAppSelector(selectCurrentUser);

  /**
   * The local fallback. Keyed by student as well as lesson, so two people sharing a browser
   * never see each other's notes.
   */
  const {
    value: text,
    setValue: setText,
    clear: forgetLocal,
  } = usePersistentDraft<string>(
    user ? `note:${user.id}:${materialId}` : null,
    '',
  );

  const [status, setStatus] = useState<Status>('loading');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [recovered, setRecovered] = useState(false);

  /** What the server is known to hold, so an unchanged note is never saved again. */
  const onServer = useRef<string | null>(null);
  /** Survives the unmount save, which runs after the last render. */
  const latest = useRef(text);
  latest.current = text;

  const push = useCallback(
    async (value: string) => {
      setStatus('saving');
      try {
        const saved = await saveLessonNote(materialId, value);
        onServer.current = saved.text;
        setSavedAt(saved.updated_at);
        setStatus('saved');
        /** The server has it, so the device no longer needs to. */
        forgetLocal();
      } catch {
        /**
         * Nothing is thrown away on a failed save. The text stays in the box and on the device,
         * and the next keystroke starts another attempt.
         */
        setStatus('failed');
      }
    },
    [forgetLocal, materialId],
  );

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const note = await fetchLessonNote(materialId);
        if (!active) return;
        onServer.current = note.text;

        /**
         * A local copy that differs is text the server never received: the copy is cleared on
         * every successful save, so whatever is left is newer than what came back. It wins, and
         * is sent straight away rather than waiting for the next keystroke.
         */
        const unsaved = latest.current;
        if (unsaved.trim() && unsaved !== note.text) {
          setRecovered(true);
          setStatus('idle');
          void push(unsaved);
          return;
        }

        setText(note.text);
        setSavedAt(note.updated_at);
        setStatus('idle');
      } catch {
        if (active) setStatus('failed');
      }
    })();

    return () => {
      active = false;
    };
    // `setText` and `push` are stable; re-running on them would refetch on every save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId]);

  /** Saves a little after typing stops. */
  useEffect(() => {
    if (status === 'loading') return;
    if (onServer.current === null || text === onServer.current) return;

    const id = window.setTimeout(() => void push(text), SAVE_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [push, status, text]);

  /**
   * Leaving the page before the timer fires must not cost the note.
   *
   * The request is sent on the way out and nothing waits for it - if it does not arrive, the
   * device still holds the text and the next visit sends it.
   */
  useEffect(
    () => () => {
      if (onServer.current !== null && latest.current !== onServer.current) {
        void saveLessonNote(materialId, latest.current).catch(() => undefined);
      }
    },
    [materialId],
  );

  const when = savedAt
    ? new Date(savedAt).toLocaleString(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <section className="mt-6 rounded-[20px] bg-[var(--color-neutral-white)] p-6 shadow-sm sm:mt-8 sm:rounded-[22px] md:mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-xl font-semibold text-[#56504c] sm:text-2xl md:text-[2rem]">
          {t('coursePage.lessonNotes')}
        </h2>

        {/**
         * Whether the note is safe, said in the one place the student looks for it. A box that
         * saves silently is indistinguishable from the box this used to be.
         */}
        <p
          className={[
            'text-xs',
            status === 'failed'
              ? 'text-[var(--color-error)]'
              : 'text-[var(--color-text-secondary)]',
          ].join(' ')}
          role="status"
          aria-live="polite"
        >
          {status === 'saving'
            ? t('coursePage.notesSaving')
            : status === 'failed'
              ? t('coursePage.notesSaveFailed')
              : when
                ? t('coursePage.notesSavedAt', { when })
                : ''}
        </p>
      </div>

      {/**
        * Stays for the visit rather than clearing when the re-save succeeds. It is a fact about
        * what happened to the student's text, not a status - and a notice that flashes for a
        * moment is one nobody reads.
        */}
      {recovered ? (
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {t('coursePage.notesRecovered')}
        </p>
      ) : null}

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label={t('coursePage.lessonNotes')}
        placeholder={t('coursePage.notesPlaceholder')}
        className="mt-4 min-h-[120px] w-full rounded-lg border border-[#cfc4be] bg-[var(--color-neutral-white)] px-4 py-3 text-sm text-[#1f1c1a] outline-none placeholder:text-[#75706c] focus:border-[#b8aaa1] sm:min-h-[132px]"
      />

      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        {t('coursePage.notesHint')}
      </p>
    </section>
  );
};

export default LessonNotes;
