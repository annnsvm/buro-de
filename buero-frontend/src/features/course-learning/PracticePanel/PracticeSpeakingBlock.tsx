import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchSpeakingTasks,
  uploadSpeakingRecording,
  type SpeakingTask,
} from '@/api/speakingApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { asClock, useRecorder } from './useRecorder';

export type PracticeSpeakingBlockProps = {
  courseMaterialId: string;
};

/**
 * The Sprechen block of a practice.
 *
 * Nothing here is graded, and that is a decision rather than a gap: marking spoken German
 * automatically would be a judgement the platform cannot make honestly. The student makes it
 * instead - record, listen to yourself, then read what a full answer sounds like. The model
 * answer stays closed until there is a recording, because reading it first turns the task into
 * reading aloud.
 */
const PracticeSpeakingBlock: React.FC<PracticeSpeakingBlockProps> = ({
  courseMaterialId,
}) => {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<SpeakingTask[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks((await fetchSpeakingTasks(courseMaterialId)).tasks);
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('practice.speaking.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [courseMaterialId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  /** One task's saved answer replaces its own row; the others are left as they are. */
  const replace = useCallback((saved: SpeakingTask) => {
    setTasks((prev) =>
      prev
        ? prev.map((task) =>
            task.element_id === saved.element_id ? saved : task,
          )
        : prev,
    );
  }, []);

  if (loading) {
    return (
      <p className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
        {t('practice.speaking.loading')}
      </p>
    );
  }

  if (!tasks) {
    return (
      <div className="space-y-4 px-6 py-12 text-center">
        <p className="text-sm text-[var(--color-error)]">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white"
        >
          {t('practice.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <section className="pt-6">
      <header className="flex flex-col gap-2">
        <span className="text-[0.7rem] font-bold tracking-[0.14em] text-[var(--color-burnt-siena-dark)] uppercase">
          {t('practice.optional')}
        </span>
        <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.5rem,3vw,2rem)] leading-[1.08] font-bold tracking-[-0.035em] text-[var(--color-text-primary)]">
          {t('practice.blocks.sprechen.title')}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t('practice.speaking.intro')}
        </p>
      </header>

      {tasks.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
          {t('practice.speaking.empty')}
        </p>
      ) : null}

      <ol className="mt-8 flex flex-col gap-8">
        {tasks.map((task, index) => (
          <li key={task.element_id}>
            <SpeakingTaskCard task={task} position={index + 1} onSaved={replace} />
          </li>
        ))}
      </ol>
    </section>
  );
};

/** One prompt: record it, hear it back, then compare it against the author's own answer. */
const SpeakingTaskCard: React.FC<{
  task: SpeakingTask;
  position: number;
  onSaved: (saved: SpeakingTask) => void;
}> = ({ task, position, onSaved }) => {
  const { t } = useTranslation();
  const recorder = useRecorder();

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async () => {
    if (!recorder.take || sending) return;
    setSending(true);
    setError(null);
    try {
      onSaved(
        await uploadSpeakingRecording(
          task.element_id,
          recorder.take.blob,
          recorder.take.seconds,
        ),
      );
      recorder.discard();
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('practice.speaking.saveFailed')));
    } finally {
      setSending(false);
    }
  }, [onSaved, recorder, sending, t, task.element_id]);

  return (
    <article className="rounded-2xl border border-[var(--color-border-default)] p-5">
      <div className="flex items-start gap-4">
        <span
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-section)] text-[13px] font-bold text-[var(--color-text-secondary)] tabular-nums"
          aria-hidden
        >
          {String(position).padStart(2, '0')}
        </span>
        <p className="text-[15px] leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
          {task.task}
        </p>
      </div>

      {recorder.state === 'unsupported' ? (
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          {t('practice.speaking.unsupported')}
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {recorder.state === 'recording' ? (
            <>
              <button
                type="button"
                onClick={recorder.stop}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-error)] px-6 py-2.5 text-sm font-semibold text-white"
              >
                <span className="size-2.5 rounded-sm bg-white" aria-hidden />
                {t('practice.speaking.stop')}
              </button>
              {/* The clock is the only sign anything is being captured. */}
              <span
                className="text-sm font-semibold text-[var(--color-text-primary)] tabular-nums"
                role="timer"
                aria-live="off"
              >
                {asClock(recorder.seconds)}
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void recorder.start()}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--color-neutral-white)]"
            >
              <span className="size-2.5 rounded-full bg-current" aria-hidden />
              {recorder.take || task.recording
                ? t('practice.speaking.again')
                : t('practice.speaking.record')}
            </button>
          )}
        </div>
      )}

      {/**
       * Listening to the take before sending it is the point of the task, so it is offered
       * before the button that sends it - and discarding costs nothing.
       */}
      {recorder.take ? (
        <div className="mt-4 rounded-xl bg-[var(--color-surface-section)] p-4">
          <p className="text-xs font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
            {t('practice.speaking.yourTake', { time: asClock(recorder.take.seconds) })}
          </p>
          <audio src={recorder.take.url} controls className="mt-3 w-full" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void send()}
              disabled={sending}
              className="rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {sending
                ? t('practice.speaking.saving')
                : t('practice.speaking.save')}
            </button>
            <button
              type="button"
              onClick={recorder.discard}
              disabled={sending}
              className="rounded-full border border-[var(--color-border-default)] px-6 py-2 text-sm"
            >
              {t('practice.speaking.discard')}
            </button>
          </div>
        </div>
      ) : null}

      {recorder.state === 'denied' ? (
        <p className="mt-4 text-sm text-[var(--color-text-primary)]">
          {t('practice.speaking.denied')}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {/* What was sent, so coming back a week later still has the attempt in it. */}
      {task.recording && !recorder.take ? (
        <div className="mt-4">
          <p className="text-xs font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
            {t('practice.speaking.saved')}
          </p>
          <audio src={task.recording.audio_url} controls className="mt-2 w-full" />
        </div>
      ) : null}

      {/**
       * Earned by recording, not by asking. The comparison is the marking: there is no score,
       * because none would be honest.
       */}
      {task.answer_open && task.sample_answer ? (
        <div className="mt-5 rounded-xl border border-[var(--color-border-subtle)] p-4">
          <p className="text-xs font-bold tracking-[0.12em] text-[var(--color-burnt-siena-dark)] uppercase">
            {t('practice.speaking.modelAnswer')}
          </p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
            {task.sample_answer}
          </p>
          {task.hints.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {task.hints.map((hint) => (
                <li
                  key={hint}
                  className="rounded-full bg-[var(--color-surface-section)] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  {hint}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
            {t('practice.speaking.compareHint')}
          </p>
        </div>
      ) : null}
    </article>
  );
};

export default PracticeSpeakingBlock;
