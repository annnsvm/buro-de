import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchWritingTask,
  submitWriting,
  type CriterionVerdict,
  type WritingSubmitResponse,
  type WritingTaskResponse,
} from '@/api/writingApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import LessonAttachments from '@/features/course-learning/MaterialWindow/LessonAttachments';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';

export type WritingPanelProps = {
  courseMaterialId: string;
  courseId?: string;
  moduleId?: string;
  materialTitle: string;
  attachments?: MaterialAttachment[];
};

/**
 * The writing task, as a step of the lesson.
 *
 * Two things are on screen before a single word is written: what to write, and exactly what it
 * will be marked against. A student who can see the criteria can check their own letter before
 * spending an attempt — which is both the cheaper path and the one that teaches more, because
 * re-reading your own work against a list is the skill the task is for.
 */
const WritingPanel: React.FC<WritingPanelProps> = ({
  courseMaterialId,
  courseId,
  moduleId,
  materialTitle,
  attachments,
}) => {
  const { t } = useTranslation();

  const [task, setTask] = useState<WritingTaskResponse | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState<WritingSubmitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await fetchWritingTask(courseMaterialId);
      setTask(loaded);
      /** The best attempt is shown back, so returning to the task is not a blank page. */
      if (loaded.best) setText(loaded.best.text);
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('writing.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [courseMaterialId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const send = useCallback(async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const response = await submitWriting(courseMaterialId, text);
      setResult(response);
      /** Attempts and the best result both move on a graded submission. */
      if (response.status === 'graded') await load();
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('writing.submitFailed')));
    } finally {
      setSending(false);
    }
  }, [courseMaterialId, load, sending, t, text]);

  if (loading) {
    return (
      <p className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
        {t('writing.loading')}
      </p>
    );
  }

  if (!task) {
    return (
      <div className="space-y-4 px-6 py-12 text-center">
        <p className="text-sm text-[var(--color-error)]">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white"
        >
          {t('writing.tryAgain')}
        </button>
      </div>
    );
  }

  const graded = result?.status === 'graded' ? result : null;
  const best = task.best;
  /** Whatever is newest: the attempt just made, or the best one restored on opening. */
  const shown = graded ?? (best ? { score: best.score, max_score: task.max_score, assessment: best.assessment } : null);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-6 sm:px-6">
      <h2 className="pt-6 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
        {materialTitle || t('writing.title')}
      </h2>

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
        {task.task}
      </p>

      {/**
       * The rubric, in full, before writing. It is the same wording the grader is given and the
       * same wording the result quotes back, so nothing can be lost against a rule the student
       * was not shown.
       */}
      <section className="mt-6 rounded-2xl bg-[var(--color-surface-section)] p-5">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          {t('writing.criteriaTitle', { count: task.max_score })}
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--color-text-secondary)]">
          {task.criteria.map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ol>
      </section>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t('writing.yourLetter')}
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={12}
          disabled={sending || !task.can_submit}
          placeholder={t('writing.placeholder')}
          className="mt-2 block w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm leading-relaxed outline-none disabled:opacity-60"
        />
      </label>

      <AttemptLine task={task} />

      {error ? (
        <p className="mt-4 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {result && result.status !== 'graded' ? <Refusal result={result} /> : null}

      <button
        type="button"
        onClick={() => void send()}
        disabled={sending || !text.trim() || !task.can_submit}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
      >
        {sending ? t('writing.checking') : t('writing.check')}
      </button>

      {shown ? (
        <Result
          score={shown.score}
          maxScore={shown.max_score}
          criteria={shown.assessment.criteria}
          criteriaText={task.criteria}
          justGraded={Boolean(graded)}
          repeated={graded?.repeated ?? false}
        />
      ) : null}

      <LessonAttachments
        attachments={attachments}
        courseId={courseId}
        moduleId={moduleId}
        materialId={courseMaterialId}
      />
    </div>
  );
};

/** How many goes are left, said before the button rather than after it is pressed. */
const AttemptLine: React.FC<{ task: WritingTaskResponse }> = ({ task }) => {
  const { t } = useTranslation();

  if (task.can_submit) {
    return (
      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        {t('writing.attemptsLeft', { count: task.attempts_left })}
      </p>
    );
  }

  if (task.blocked_reason === 'budget') {
    return (
      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        {t('writing.selfCheckHint')}
      </p>
    );
  }

  const retry = task.retry_at ? new Date(task.retry_at) : null;
  return (
    <p className="mt-2 text-xs text-[var(--color-text-primary)]">
      {retry
        ? t('writing.comeBackAt', {
            time: retry.toLocaleString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'long',
            }),
          })
        : t('writing.noAttemptsLeft')}
    </p>
  );
};

/**
 * A submission that was not graded.
 *
 * Deliberately not styled as an error. Too short is a request to keep writing, and it costs the
 * student nothing — saying so plainly is the difference between a nudge and a punishment.
 */
const Refusal: React.FC<{
  result: Extract<WritingSubmitResponse, { status: 'needs_more' | 'blocked' }>;
}> = ({ result }) => {
  const { t } = useTranslation();

  if (result.status === 'needs_more') {
    return (
      <div className="mt-4 rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-sm">
        <p className="font-semibold text-[var(--color-text-primary)]">
          {t(`writing.needsMore.${result.reason}`, {
            min: result.min_sentences,
            max: result.max_sentences,
            count: result.body_sentences,
          })}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {t('writing.attemptNotSpent')}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-sm">
      <p className="font-semibold text-[var(--color-text-primary)]">
        {result.self_check ? t('writing.selfCheckTitle') : t('writing.blocked')}
      </p>
      {result.model_answer ? (
        <>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {t('writing.selfCheckHint')}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--color-neutral-white)] p-3 text-xs whitespace-pre-wrap text-[var(--color-text-primary)]">
            {result.model_answer}
          </pre>
        </>
      ) : null}
    </div>
  );
};

/** The mark, and one line per criterion saying what earned or lost it. */
const Result: React.FC<{
  score: number;
  maxScore: number;
  criteria: CriterionVerdict[];
  criteriaText: string[];
  justGraded: boolean;
  repeated: boolean;
}> = ({ score, maxScore, criteria, criteriaText, justGraded, repeated }) => {
  const { t } = useTranslation();

  return (
    <section
      className="mt-8 rounded-2xl border border-[var(--color-border-default)] p-5"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
        {justGraded ? t('writing.yourResult') : t('writing.bestResult')}
      </p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-[var(--color-primary)]">
        {t('writing.pointsOf', { score, total: maxScore })}
      </p>

      {/* Sending the same text again is answered from the record, not paid for twice. */}
      {repeated ? (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {t('writing.repeated')}
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {[...criteria]
          .sort((a, b) => a.id - b.id)
          .map((verdict) => (
            <li key={verdict.id} className="flex gap-3 text-sm">
              <span
                aria-hidden
                className={[
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  verdict.met
                    ? 'bg-[var(--color-success-soft)] text-[var(--color-success-text)]'
                    : 'bg-[var(--color-error-soft)] text-[var(--color-error)]',
                ].join(' ')}
              >
                {verdict.met ? '✓' : '—'}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-[var(--color-text-primary)]">
                  {criteriaText[verdict.id - 1] ?? ''}
                </span>
                <span className="mt-0.5 block text-[var(--color-text-secondary)]">
                  {verdict.note}
                </span>
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default WritingPanel;
