import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type WritingAssessment,
  type WritingAttempt,
  type WritingSubmitResponse,
  type WritingTaskResponse,
} from '@/api/writingApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { usePersistentDraft } from '@/hooks/usePersistentDraft';
import { readMarks } from './marks';

export type WritingTaskFormProps = {
  task: WritingTaskResponse;
  /** The author's heading, when a block holds more than one task. */
  heading?: string | null;
  /** Sends the letter. Which endpoint it reaches is the caller's business, not the form's. */
  onSubmit: (text: string) => Promise<WritingSubmitResponse>;
  /** Re-read the task after a graded submission: the attempts and the best result both move. */
  onGraded: () => void | Promise<void>;
  /**
   * Where to keep the half-written letter, unique per student and per task. Omitting it keeps
   * the old behaviour, where leaving the screen discards whatever was typed.
   */
  draftKey?: string | null;
};

/**
 * One writing task: the condition, the rubric, the box, and the mark.
 *
 * Two things are on screen before a single word is written: what to write, and exactly what it
 * will be marked against. A student who can see the criteria can check their own letter before
 * spending an attempt - which is both the cheaper path and the one that teaches more, because
 * re-reading your own work against a list is the skill the task is for.
 *
 * It knows nothing about where the task came from. That is what lets a writing material and a
 * practice's Schreiben block show the student the same thing rather than two near-copies that
 * drift apart.
 */
const WritingTaskForm: React.FC<WritingTaskFormProps> = ({
  task,
  heading,
  onSubmit,
  onGraded,
  draftKey = null,
}) => {
  const { t } = useTranslation();

  /**
   * The best attempt is shown back, so returning to the task is not a blank page - and anything
   * typed since is kept on top of it.
   *
   * A letter turned away for being too short is the case this matters most in: nothing was
   * graded, so there is no best attempt to fall back on, and the student was sent away to write
   * more. Losing the paragraph they had already written is what made that feel like a penalty.
   */
  const {
    value: text,
    setValue: setText,
    clear: forgetDraft,
    restored: draftRestored,
  } = usePersistentDraft<string>(draftKey, task.best?.text ?? '');
  const [result, setResult] = useState<WritingSubmitResponse | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const response = await onSubmit(text);
      setResult(response);
      if (response.status === 'graded') {
        /**
         * Graded, so the letter is on the record and the draft has done its job. A refusal
         * keeps it: the student is about to edit exactly that text.
         */
        forgetDraft();
        await onGraded();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('writing.submitFailed')));
    } finally {
      setSending(false);
    }
  }, [forgetDraft, onGraded, onSubmit, sending, t, text]);

  const graded = result?.status === 'graded' ? result : null;
  const best = task.best;
  /** Whatever is newest: the attempt just made, or the best one restored on opening. */
  /**
   * The allowance is spent and will not refill. Told apart from every other reason the box is
   * closed: a pause ends by itself, a tripped budget comes back next month, this one does not.
   */
  const usedUp = !task.can_submit && task.blocked_reason === 'used_up';

  const shown =
    graded ??
    (best
      ? { score: best.score, max_score: task.max_score, assessment: best.assessment }
      : null);

  return (
    <div>
      {heading ? (
        <h3 className="text-[1.05rem] font-semibold text-[var(--color-text-primary)]">
          {heading}
        </h3>
      ) : null}

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
        {task.task}
      </p>

      {/**
       * The rubric, in full, before writing. It is the same wording the grader is given and the
       * same wording the result quotes back, so nothing can be lost against a rule the student
       * was not shown.
       */}
      <section className="mt-6 rounded-2xl bg-[var(--color-surface-section)] p-5">
        <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
          {t('writing.criteriaTitle', { count: task.max_score })}
        </h4>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--color-text-secondary)]">
          {task.criteria.map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ol>
      </section>

      {/**
        * When the allowance is spent the box goes away and the history takes its place.
        *
        * Leaving an empty box that refuses everything sent to it would be worse than saying so:
        * the student would keep rewriting and keep being turned away. What is left is their own
        * versions and what the checker said about each, which is the part that still teaches.
        */}
      {usedUp ? (
        <section className="mt-6 rounded-2xl bg-[var(--color-surface-section)] p-5">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {t('writing.allChecksUsed')}
          </p>
        </section>
      ) : (
        <label className="mt-6 block">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {t('writing.yourLetter')}
          </span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={12}
            disabled={sending || !task.can_submit}
            /**
              * No placeholder.
              *
              * It read "Betreff: … / Sehr geehrte Frau …", which told every student their text
              * had to be a formal letter. A good third of the tasks are not: a message in a
              * group chat, a forum post, a note on the fridge, a shop review, an advert for the
              * neighbours' chat. What the text should look like is in the task, in the author's
              * words, and an empty box does not argue with it.
              */
            className="mt-2 block w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm leading-relaxed outline-none disabled:opacity-60"
          />
        </label>
      )}

      {/**
        * Said out loud, because the whole point is that the student can trust it. Silence after
        * text reappears is indistinguishable from luck.
        */}
      {draftRestored ? (
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {t('writing.draftRestored')}
        </p>
      ) : null}

      <AttemptLine task={task} />

      {error ? (
        <p className="mt-4 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {result && result.status !== 'graded' ? <Refusal result={result} /> : null}

      {usedUp ? null : (
        <button
          type="button"
          onClick={() => void send()}
          /** Dead while a check is running, which is half of the double-click guard. */
          disabled={sending || !text.trim() || !task.can_submit}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
        >
          {sending ? t('writing.checking') : t('writing.check')}
        </button>
      )}

      {shown ? (
        <Result
          score={shown.score}
          maxScore={shown.max_score}
          assessment={shown.assessment}
          criteriaText={task.criteria}
          justGraded={Boolean(graded)}
          repeated={graded?.repeated ?? false}
        />
      ) : null}

      {/** Every earlier version, so a student can see what they changed and what it earned. */}
      <History attempts={task.attempts ?? []} criteriaText={task.criteria} open={usedUp} />
    </div>
  );
};

/**
 * How many checks are left, out of how many there were.
 *
 * Both numbers, because the allowance does not refill: "two left" means something different when
 * there were three to begin with than when a teacher granted five. It is said before the button
 * rather than after it is pressed.
 */
const AttemptLine: React.FC<{ task: WritingTaskResponse }> = ({ task }) => {
  const { t } = useTranslation();

  if (task.blocked_reason === 'budget') {
    return (
      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        {t('writing.selfCheckHint')}
      </p>
    );
  }

  /** Nothing to count down to; the sentence above the history says what happened. */
  if (task.blocked_reason === 'used_up') return null;

  const retry = task.retry_at ? new Date(task.retry_at) : null;

  return (
    <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
      {t('writing.checksLeft', {
        left: task.attempts_left,
        total: task.attempts_per_window,
      })}
      {/**
       * The pause, said on the same line. It is seconds away, so it does not deserve a block of
       * its own - and it must not read as "you have run out", which is what a bare "come back
       * later" sounded like.
       */}
      {!task.can_submit && task.blocked_reason === 'cooldown' && retry ? (
        <span className="ml-2 text-[var(--color-text-primary)]">
          {t('writing.waitASecond', {
            time: retry.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          })}
        </span>
      ) : null}
      {!task.can_submit && task.blocked_reason === 'daily' && retry ? (
        <span className="ml-2 text-[var(--color-text-primary)]">
          {t('writing.comeBackAt', {
            time: retry.toLocaleString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'long',
            }),
          })}
        </span>
      ) : null}
    </p>
  );
};

/**
 * A submission that was not graded.
 *
 * Deliberately not styled as an error. Too short is a request to keep writing, and it costs the
 * student nothing - saying so plainly is the difference between a nudge and a punishment.
 */
const Refusal: React.FC<{
  result: Exclude<WritingSubmitResponse, { status: 'graded' }>;
}> = ({ result }) => {
  const { t } = useTranslation();

  /**
   * The checker answered with something we could not read, twice.
   *
   * Our fault, and said as our fault: the student keeps the check and there is nothing for them
   * to fix. Reporting it as a problem with their text would send them rewriting a letter that
   * was never looked at.
   */
  if (result.status === 'unavailable') {
    return (
      <div className="mt-4 rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-sm">
        <p className="font-semibold text-[var(--color-text-primary)]">
          {t('writing.unavailable')}
        </p>
        {/**
          * Neutral on purpose. The old line said "write more and send again", which is true of a
          * text that was too short and false of one that was copied, was in the wrong language,
          * or was never looked at. Each refusal above already says what to do.
          */}
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {t('writing.checkNotSpent')}
        </p>
      </div>
    );
  }

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
          {t('writing.checkNotSpent')}
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

/**
 * The mark, what to fix, and one line per criterion that did not earn its point.
 *
 * An awarded criterion is a tick and nothing else. The checker is told not to explain a point it
 * gave, and the screen would have no room for it anyway: five sentences saying "yes, this was
 * fine" bury the one that says what went wrong.
 */
const Result: React.FC<{
  score: number;
  maxScore: number;
  assessment: WritingAssessment;
  criteriaText: string[];
  justGraded: boolean;
  repeated: boolean;
}> = ({ score, maxScore, assessment, criteriaText, justGraded, repeated }) => {
  const { t } = useTranslation();
  const marks = readMarks(assessment);
  const corrections = assessment.corrections ?? [];

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

      {assessment.praise ? (
        <p className="mt-4 text-sm text-[var(--color-success-text)]">{assessment.praise}</p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {marks.map((mark) => (
          <li key={mark.n} className="flex gap-3 text-sm">
            <span
              aria-hidden
              className={[
                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                mark.earned
                  ? 'bg-[var(--color-success-soft)] text-[var(--color-success-text)]'
                  : 'bg-[var(--color-error-soft)] text-[var(--color-error)]',
              ].join(' ')}
            >
              {mark.earned ? '✓' : '-'}
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-[var(--color-text-primary)]">
                {criteriaText[mark.n - 1] ?? ''}
              </span>
              {/* Only when the point was lost. A tick needs no sentence beneath it. */}
              {mark.comment ? (
                <span className="mt-0.5 block text-[var(--color-text-secondary)]">
                  {mark.comment}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      {/**
       * What to fix, as wrong against right.
       *
       * The part a mark on its own cannot give. "You lost a point on word order" leaves the
       * student to find which words; this names them.
       */}
      {corrections.length > 0 ? (
        <section className="mt-6 rounded-xl bg-[var(--color-surface-section)] p-4">
          <h5 className="text-xs font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
            {t('writing.whatToFix')}
          </h5>
          <ul className="mt-3 space-y-3">
            {corrections.map((fix) => (
              <li key={`${fix.wrong}-${fix.right}`} className="text-sm">
                <span className="text-[var(--color-error)] line-through">{fix.wrong}</span>
                <span className="mx-2 text-[var(--color-text-secondary)]" aria-hidden>
                  →
                </span>
                <span className="font-medium text-[var(--color-success-text)]">{fix.right}</span>
                {fix.why ? (
                  <span className="mt-0.5 block text-xs text-[var(--color-text-secondary)]">
                    {fix.why}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {assessment.summary ? (
        <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-primary)]">
          {assessment.summary}
        </p>
      ) : null}
    </section>
  );
};

/**
 * Every version the student sent, and what the checker said about each.
 *
 * Folded away while they still have checks - the current result is what matters then - and open
 * once the allowance is spent, because at that point this is the whole of what they have left to
 * work from. What changed between the second version and the third is the part that teaches.
 */
const History: React.FC<{
  attempts: WritingAttempt[];
  criteriaText: string[];
  open: boolean;
}> = ({ attempts, criteriaText, open }) => {
  const { t } = useTranslation();

  /** One attempt is already on screen as the result; a history of it would be the same thing. */
  if (attempts.length < 2) return null;

  return (
    <details open={open} className="mt-8">
      <summary className="cursor-pointer text-sm font-semibold text-[var(--color-text-primary)]">
        {t('writing.earlierAttempts', { count: attempts.length })}
      </summary>

      <ol className="mt-4 space-y-6">
        {attempts.map((attempt, index) => {
          const marks = readMarks(attempt.assessment);
          const lost = marks.filter((mark) => !mark.earned);
          return (
            <li
              key={attempt.submitted_at}
              className="rounded-2xl border border-[var(--color-border-subtle)] p-4"
            >
              <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-xs font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
                  {t('writing.attemptNumber', { number: attempts.length - index })}
                </span>
                <span className="font-[family-name:var(--font-heading)] text-lg font-bold tabular-nums text-[var(--color-primary)]">
                  {t('writing.pointsOf', {
                    score: attempt.score,
                    total: attempt.max_score,
                  })}
                </span>
              </p>

              <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--color-surface-section)] p-3 text-xs leading-relaxed whitespace-pre-wrap text-[var(--color-text-primary)]">
                {attempt.text}
              </pre>

              {attempt.assessment.summary ? (
                <p className="mt-3 text-sm text-[var(--color-text-primary)]">
                  {attempt.assessment.summary}
                </p>
              ) : null}

              {lost.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {lost.map((mark) => (
                    <li key={mark.n} className="text-xs text-[var(--color-text-secondary)]">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {criteriaText[mark.n - 1] ?? ''}
                      </span>
                      {mark.comment ? ` - ${mark.comment}` : ''}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </details>
  );
};

export default WritingTaskForm;
