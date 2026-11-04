import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type WritingAssessment,
  type WritingAttempt,
  type WritingSubmitResponse,
  type WritingTaskResponse,
} from '@/api/writingApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { usePersistentDraft } from '@/hooks/usePersistentDraft';
import Folder from '../PracticePanel/ui/Folder';
import QuestionCard from '../PracticePanel/ui/QuestionCard';
import Segments from '../PracticePanel/ui/Segments';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '../PracticePanel/ui/buttons';
import { readMarks } from './marks';
import { parseWritingPrompt } from './prompt';
import { formatDay } from '@/helpers/formatDate';
import { SCREEN_TITLE } from '@/features/course-learning/PracticePanel/ui/headings';

export type WritingTaskFormProps = {
  task: WritingTaskResponse;
  /** The author's heading, when a block holds more than one task. */
  heading?: string | null;
  /** Which task this is inside its block, for the number down the left of the card. */
  position?: number;
  /**
   * Where a checked letter leads next. Offered beside "write it again", and only where there
   * is somewhere to go: a writing material opened on its own has no practice to return to.
   */
  finish?: { label: string; onClick: () => void };
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
  position = 1,
  finish,
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
  /** So "write it again" puts the student back in the box rather than next to it. */
  const box = useRef<HTMLTextAreaElement | null>(null);
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
      <QuestionCard
        position={position}
        prompt={heading ?? <Prompt task={task.task} />}
      >
        {heading ? <Prompt task={task.task} /> : null}
      </QuestionCard>

      {/**
       * The rubric, in full, before writing. It is the same wording the grader is given and the
       * same wording the result quotes back, so nothing can be lost against a rule the student
       * was not shown.
       */}
      <Folder
        className="mt-6"
        tab={t('writing.criteriaTitle', { count: task.max_score })}
      >
        <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {task.criteria.map((criterion) => (
            <li
              key={criterion}
              className="flex min-h-10 items-start gap-3 py-1 text-[0.95rem] text-[var(--color-lesson-body)]"
            >
              {/** A mark not yet earned: the same bar the result fills in. */}
              <span
                aria-hidden
                className="mt-2 h-2 w-3.5 shrink-0 rounded-sm bg-[var(--color-dawn-pink-dark)]/45"
              />
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </Folder>

      {/**
        * When the allowance is spent the box goes away and the history takes its place.
        *
        * Leaving an empty box that refuses everything sent to it would be worse than saying so:
        * the student would keep rewriting and keep being turned away. What is left is their own
        * versions and what the checker said about each, which is the part that still teaches.
        */}
      {usedUp ? (
        <section className="mt-6 rounded-2xl bg-[var(--color-surface-section)] p-5">
          <p className="text-sm font-semibold text-[var(--color-lesson-body)]">
            {t('writing.allChecksUsed')}
          </p>
        </section>
      ) : (
        <label className="mt-6 block">
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-lesson-body)]">
            {t('writing.yourLetter')}
          </span>
          <textarea
            ref={box}
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
            /**
              * Ruled like a sheet of paper, and set in a monospaced face.
              *
              * Both are for proof-reading German rather than for decoration: the ruling gives
              * the eye a line to follow in a language whose sentences run long, and a fixed
              * width makes a missing space or a doubled letter visible. The lines are painted
              * as a background on a fixed line-height, so they stay under the text as it grows.
              */
            style={{
              backgroundImage:
                'repeating-linear-gradient(transparent 0 27px, var(--color-surface-section) 27px 28px)',
            }}
            className="mt-3 block w-full resize-y rounded-[18px] border-[1.5px] border-[var(--color-surface-section)] bg-[var(--color-neutral-white)] py-3.5 pr-5 pl-8 font-mono text-[0.95rem] leading-7 text-[var(--color-lesson-body)] outline-none focus:border-[var(--color-lesson-accent)] disabled:opacity-60"
          />
        </label>
      )}

      {/**
        * Said out loud, because the whole point is that the student can trust it. Silence after
        * text reappears is indistinguishable from luck.
        */}
      {draftRestored ? (
        <p className="mt-2 text-xs text-[var(--color-lesson-muted)]">
          {t('writing.draftRestored')}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {result && result.status !== 'graded' ? <Refusal result={result} /> : null}

      {usedUp ? null : (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <AttemptLine task={task} />
          <button
            type="button"
            onClick={() => void send()}
            /** Dead while a check is running, which is half of the double-click guard. */
            disabled={sending || !text.trim() || !task.can_submit}
            className={`${PRIMARY_BUTTON} w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]`}
          >
            {sending ? t('writing.checking') : t('writing.check')}
          </button>
        </div>
      )}

      {shown ? (
        <Result
          score={shown.score}
          maxScore={shown.max_score}
          assessment={shown.assessment}
          criteriaText={task.criteria}
          justGraded={Boolean(graded)}
          repeated={graded?.repeated ?? false}
          /**
           * Offered only when there is a check left to spend. With the allowance gone the box
           * is not on screen at all, and a button that scrolls to nothing is worse than none.
           */
          finish={finish}
          onWriteAgain={
            usedUp
              ? undefined
              : () => {
                  box.current?.focus();
                  box.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
          }
        />
      ) : null}

      {/** Every earlier version, so a student can see what they changed and what it earned. */}
      <History attempts={task.attempts ?? []} criteriaText={task.criteria} open={usedUp} />
    </div>
  );
};

/**
 * The task as its author wrote it.
 *
 * Her files give it in four labelled parts, and the labels are hers: the situation, what to
 * write, what the text must contain, and the words to lean on. Shown as one paragraph, the
 * third of those - the part a mark actually depends on - was the easiest to skim past. A task
 * written without the labels is shown whole, exactly as before.
 */
const Prompt: React.FC<{ task: string }> = ({ task }) => {
  const { sections, props, plain } = parseWritingPrompt(task);

  if (sections.length === 0 && props.length === 0) {
    return (
      <p className="mt-3 leading-relaxed whitespace-pre-line text-[var(--color-lesson-body)]">
        {task}
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {plain ? (
        <p className="leading-relaxed font-normal whitespace-pre-line text-[var(--color-lesson-body)]">
          {plain}
        </p>
      ) : null}

      {sections.map((section, index) => (
        <div key={section.label}>
          <h4 className="font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-lesson-muted)] sm:text-[13px]">
            {section.label}
          </h4>
          <p
            className={[
              'mt-1.5 leading-relaxed whitespace-pre-line',
              /**
               * The first part is the situation; the rest is what to do about it.
               *
               * The weight is set on both, not only on the first: the card around them is
               * styled semibold for a one-line question, and without saying so the rest of a
               * four-part task would inherit it and read as four headings.
               */
              index === 0
                ? 'font-semibold text-[var(--color-lesson-body)]'
                : 'font-normal text-[var(--color-lesson-body)]',
            ].join(' ')}
          >
            {section.text}
          </p>
        </div>
      ))}

      {/**
       * The words to lean on, as separate pills rather than one line joined by middots.
       * They are a list of things to use, and a student picking one reads them one at a time.
       */}
      {props.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {props.map((word) => (
            <li
              key={word}
              className="rounded-2xl bg-[var(--color-burnt-siena-lightest)] px-3 py-1.5 font-mono text-sm font-normal text-[var(--color-lesson-body)]"
            >
              {word}
            </li>
          ))}
        </ul>
      ) : null}
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
      <p className="mt-2 text-xs text-[var(--color-lesson-muted)]">
        {t('writing.selfCheckHint')}
      </p>
    );
  }

  /** Nothing to count down to; the sentence above the history says what happened. */
  if (task.blocked_reason === 'used_up') return null;

  const retry = task.retry_at ? new Date(task.retry_at) : null;

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-lesson-muted)]">
      {/**
       * The allowance as dots, spent ones filled.
       *
       * The same shape the hub uses for blocks and the result uses for criteria, so "how many
       * of these have I used" reads the same way everywhere. The sentence beside it carries the
       * meaning; the dots are there to be counted at a glance.
       */}
      <Segments
        filled={Math.max(0, task.attempts_per_window - task.attempts_left)}
        total={task.attempts_per_window}
        size="sm"
      />
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
        <span className="ml-2 text-[var(--color-lesson-body)]">
          {t('writing.waitASecond', {
            /** The reader's language, not the machine's: see `formatDate`. */
            time: retry.toLocaleTimeString('uk-UA', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          })}
        </span>
      ) : null}
      {!task.can_submit && task.blocked_reason === 'daily' && retry ? (
        <span className="ml-2 text-[var(--color-lesson-body)]">
          {t('writing.comeBackAt', {
            time: `${formatDay(retry)}, ${retry.toLocaleTimeString('uk-UA', {
              hour: '2-digit',
              minute: '2-digit',
            })}`,
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
        <p className="font-semibold text-[var(--color-lesson-body)]">
          {t('writing.unavailable')}
        </p>
        {/**
          * Neutral on purpose. The old line said "write more and send again", which is true of a
          * text that was too short and false of one that was copied, was in the wrong language,
          * or was never looked at. Each refusal above already says what to do.
          */}
        <p className="mt-1 text-xs text-[var(--color-lesson-muted)]">
          {t('writing.checkNotSpent')}
        </p>
      </div>
    );
  }

  if (result.status === 'needs_more') {
    return (
      <div className="mt-4 rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-sm">
        <p className="font-semibold text-[var(--color-lesson-body)]">
          {t(`writing.needsMore.${result.reason}`, {
            min: result.min_sentences,
            max: result.max_sentences,
            count: result.body_sentences,
          })}
        </p>
        <p className="mt-1 text-xs text-[var(--color-lesson-muted)]">
          {t('writing.checkNotSpent')}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-sm">
      <p className="font-semibold text-[var(--color-lesson-body)]">
        {result.self_check ? t('writing.selfCheckTitle') : t('writing.blocked')}
      </p>
      {result.model_answer ? (
        <>
          <p className="mt-1 text-xs text-[var(--color-lesson-muted)]">
            {t('writing.selfCheckHint')}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--color-neutral-white)] p-3 text-xs whitespace-pre-wrap text-[var(--color-lesson-body)]">
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
  /** Offered only while a check is left to spend; the box is gone otherwise. */
  onWriteAgain?: () => void;
  /** Where to go once the letter is behind them, when there is anywhere to go. */
  finish?: { label: string; onClick: () => void };
}> = ({
  score,
  maxScore,
  assessment,
  criteriaText,
  justGraded,
  repeated,
  onWriteAgain,
  finish,
}) => {
  const { t } = useTranslation();
  const marks = readMarks(assessment);
  const corrections = assessment.corrections ?? [];
  const earned = marks.filter((mark) => mark.earned);
  const lost = marks.filter((mark) => !mark.earned);
  const full = maxScore > 0 && score === maxScore;

  return (
    <section className="mt-8" role="status" aria-live="polite">
      {/**
       * The mark as a stamp on a sheet.
       *
       * It is the one number the student came back for, so it is read before anything else and
       * from across the room. The sentence beside it is the checker's own praise - the first
       * thing it found worth saying - rather than a label the screen made up.
       */}
      <header className="flex flex-col items-center gap-6 rounded-3xl bg-[var(--color-surface-section)] p-7 sm:flex-row sm:items-center">
        <span className="flex size-32 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-[3px] border-[var(--color-lesson-accent)] bg-[var(--color-neutral-white)]">
          <span className="font-[family-name:var(--font-heading)] text-[2.6rem] leading-none font-bold tracking-[-0.04em] text-[var(--color-lesson-accent)] tabular-nums">
            {score}/{maxScore}
          </span>
          <span className="mt-1 font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-lesson-accent)] sm:text-[13px]">
            {t('writing.pointsStamp')}
          </span>
        </span>

        <div className="min-w-0 text-center sm:text-left">
          <p className="font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-lesson-muted)] sm:text-[13px]">
            {justGraded ? t('writing.yourResult') : t('writing.bestResult')}
          </p>
          <h4 className={`mt-1.5 ${SCREEN_TITLE}`}>
            {full ? t('writing.allPoints') : t('writing.checked')}
          </h4>
          {assessment.praise ? (
            <p className="mt-2 leading-relaxed text-[var(--color-lesson-body)]">
              {assessment.praise}
            </p>
          ) : null}
          {/* Sending the same text again is answered from the record, not paid for twice. */}
          {repeated ? (
            <p className="mt-2 text-sm text-[var(--color-lesson-muted)]">
              {t('writing.repeated')}
            </p>
          ) : null}
        </div>
      </header>

      <MarkList
        title={t('writing.earned')}
        marks={earned}
        criteriaText={criteriaText}
        earned
        score={score}
        maxScore={maxScore}
      />

      {/** The criteria that cost a point, each with the sentence that says why. */}
      {lost.length > 0 ? (
        <MarkList title={t('writing.notEarned')} marks={lost} criteriaText={criteriaText} />
      ) : null}

      {/**
       * What to fix, as wrong against right.
       *
       * The part a mark on its own cannot give. "You lost a point on word order" leaves the
       * student to find which words; this names them.
       */}
      {corrections.length > 0 ? (
        <section className="mt-7">
          <h5 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-lesson-body)]">
            {t('writing.whatToFix')}
          </h5>
          <ul className="mt-3 flex flex-col gap-4 rounded-[18px] border-[1.5px] border-[var(--color-surface-section)] bg-[var(--color-neutral-white)] px-[22px] py-5">
            {corrections.map((fix) => (
              <li key={`${fix.wrong}-${fix.right}`}>
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[var(--color-lesson-muted)] line-through decoration-[var(--color-lesson-accent)] decoration-2">
                    {fix.wrong}
                  </span>
                  <span className="text-[var(--color-lesson-muted)]" aria-hidden>
                    →
                  </span>
                  <span className="rounded-md bg-[var(--color-burnt-siena-lighter)] px-2 py-0.5 font-mono font-medium text-[var(--color-lesson-body)]">
                    {fix.right}
                  </span>
                </p>
                {fix.why ? (
                  <p className="mt-1 text-sm text-[var(--color-lesson-muted)]">{fix.why}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/**
       * Whose comment this is, said plainly.
       *
       * It was going to be headed "the teacher's comment", which would have told the student
       * the author read their letter herself. She does not - the checker writes it against her
       * criteria - and a student who believed otherwise would take a disagreement about a mark
       * to her as a personal slight.
       */}
      {assessment.summary ? (
        <section className="mt-7 flex gap-3.5">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-lesson-accent)] font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-text-on-accent)]"
          >
            b
          </span>
          <div className="min-w-0">
            <p className="text-[0.8rem] font-semibold text-[var(--color-lesson-muted)]">
              {t('writing.checkComment')}
            </p>
            <p className="mt-0.5 leading-relaxed text-[var(--color-lesson-body)]">
              {assessment.summary}
            </p>
          </div>
        </section>
      ) : null}

      {finish || onWriteAgain ? (
        <div className="mt-7 flex flex-wrap gap-3">
          {/** On first, because once a letter is marked most students are done with it. */}
          {finish ? (
            <button type="button" onClick={finish.onClick} className={PRIMARY_BUTTON}>
              {finish.label}
            </button>
          ) : null}
          {onWriteAgain ? (
            <button type="button" onClick={onWriteAgain} className={SECONDARY_BUTTON}>
              {t('writing.writeAgain')}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

/**
 * One list of criteria, earned or lost.
 *
 * Two columns, because a criterion is a short line and a single column of seven left the eye
 * travelling further than the text was worth. The tick is a plain stroke rather than a tick in
 * a circle: a circle reads as a control to press.
 */
const MarkList: React.FC<{
  title: string;
  marks: ReturnType<typeof readMarks>;
  criteriaText: string[];
  earned?: boolean;
  score?: number;
  maxScore?: number;
}> = ({ title, marks, criteriaText, earned = false, score, maxScore }) => {
  const { t } = useTranslation();
  if (marks.length === 0) return null;

  return (
    <section className="mt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h5 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-lesson-body)]">
          {title}
        </h5>
        {earned && score != null && maxScore != null ? (
          <span className="flex items-center gap-3">
            <Segments filled={score} total={maxScore} />
            <span className="text-sm text-[var(--color-lesson-muted)]">
              {t('writing.pointsOf', { score, total: maxScore })}
            </span>
          </span>
        ) : null}
      </div>

      <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {marks.map((mark) => (
          <li key={mark.n} className="flex min-h-10 items-start gap-3 py-1">
            {earned ? (
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="mt-1 size-[18px] shrink-0"
                fill="none"
                stroke="var(--color-lesson-accent)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4.5 4.5L19 7" />
              </svg>
            ) : (
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="mt-1 size-[18px] shrink-0"
                fill="none"
                stroke="var(--color-lesson-muted)"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            )}
            <span className="min-w-0 text-[0.95rem]">
              <span className="text-[var(--color-lesson-body)]">
                {criteriaText[mark.n - 1] ?? ''}
              </span>
              {/* Only when the point was lost. A tick needs no sentence beneath it. */}
              {mark.comment ? (
                <span className="mt-0.5 block text-sm text-[var(--color-lesson-muted)]">
                  {mark.comment}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
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
    <details
      open={open}
      className="mt-9 border-t border-[var(--color-dawn-pink-dark)]/35 pt-7"
    >
      <summary className="cursor-pointer font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-lesson-body)]">
        {t('writing.earlierAttempts', { count: attempts.length })}
      </summary>

      <ol className="mt-4 flex flex-col gap-6">
        {attempts.map((attempt, index) => {
          const marks = readMarks(attempt.assessment);
          const lost = marks.filter((mark) => !mark.earned);
          return (
            <li key={attempt.submitted_at}>
              <Folder
                tab={
                  <span className="flex items-center gap-3">
                    <span>
                      {t('writing.attemptNumber', { number: attempts.length - index })}
                    </span>
                    <Segments
                      filled={attempt.score}
                      total={attempt.max_score}
                      size="sm"
                    />
                    <span className="font-[family-name:var(--font-heading)] text-[0.95rem] font-bold text-[var(--color-lesson-accent)] tabular-nums">
                      {attempt.score}/{attempt.max_score}
                    </span>
                  </span>
                }
              >
                {/**
                 * The student's own text, ruled like the sheet they wrote it on and marked
                 * down the left as something quoted back rather than something to edit.
                 */}
                <pre
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(transparent 0 27px, var(--color-surface-section) 27px 28px)',
                  }}
                  className="overflow-x-auto border-l-[1.5px] border-[var(--color-burnt-siena-light)] py-0.5 pl-4 font-mono text-[0.9rem] leading-7 whitespace-pre-wrap text-[var(--color-lesson-body)]"
                >
                  {attempt.text}
                </pre>

                {attempt.assessment.summary ? (
                  <p className="mt-4 leading-relaxed text-[var(--color-lesson-body)]">
                    {attempt.assessment.summary}
                  </p>
                ) : null}

                {lost.length > 0 ? (
                  <>
                    <p className="mt-5 font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-lesson-muted)] sm:text-[13px]">
                      {t('writing.notEarned')}
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {lost.map((mark) => (
                        <li key={mark.n} className="flex items-start gap-2.5 text-sm">
                          <svg
                            aria-hidden
                            viewBox="0 0 24 24"
                            className="mt-1 size-4 shrink-0"
                            fill="none"
                            stroke="var(--color-lesson-muted)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          >
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                          <span className="min-w-0">
                            <span className="font-semibold text-[var(--color-lesson-body)]">
                              {criteriaText[mark.n - 1] ?? ''}
                            </span>
                            {mark.comment ? (
                              <span className="text-[var(--color-lesson-muted)]">
                                {` - ${mark.comment}`}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </Folder>
            </li>
          );
        })}
      </ol>
    </details>
  );
};

export default WritingTaskForm;
