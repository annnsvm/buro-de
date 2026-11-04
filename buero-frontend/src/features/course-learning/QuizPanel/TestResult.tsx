import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuizPartResult, QuizQuestion } from '@/api/quizApi';
import { BLOCK_ART } from '@/features/course-learning/PracticePanel/illustrations/BlockArt';
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from '@/features/course-learning/PracticePanel/ui/buttons';

/** One question that cost a point, with everything known about why. */
export type TestMistake = {
  question: QuizQuestion;
  /** Where it sits in its own part, which is how the student counted it. */
  position: number;
  /** What they answered, as they wrote it. Empty when they left it blank. */
  given: string;
  /** Withheld after a failed test, so a retake is not copying. */
  accepted: string[];
  explanation: string | null;
  reviewLesson: string | null;
};

export type TestResultProps = {
  /** The best percentage, which is the one that counts. */
  percent: number;
  earnedPoints: number | null;
  totalPoints: number | null;
  passingScore: number | null;
  passed: boolean | null;
  parts: readonly QuizPartResult[];
  mistakes: readonly TestMistake[];
  onRetry: () => void;
  /** Offered only where there is somewhere to go. */
  onMoveOn?: () => void;
  moveOnLabel?: string;
};

/** How many mistakes are shown before the rest are folded away. */
const SHOWN_AT_FIRST = 2;

/**
 * What a module test comes to.
 *
 * The mark first, because that is what the student came back for, and then the part of the
 * screen that is actually worth reading: which skill let them down and which lesson to go
 * back over. A result that says only "48%" tells a student they failed and nothing about
 * what to do next.
 *
 * A failed test keeps the same colours as a passed one. Red would say they had done
 * something wrong; they have done something incompletely, and the screen's job is to send
 * them back to the lessons, not to scold them.
 */
const TestResult: React.FC<TestResultProps> = ({
  percent,
  earnedPoints,
  totalPoints,
  passingScore,
  passed,
  parts,
  mistakes,
  onRetry,
  onMoveOn,
  moveOnLabel,
}) => {
  const { t } = useTranslation();
  const [allShown, setAllShown] = useState(false);

  const failed = passed === false;
  /** A failed test shows every mistake at once: that list is the way back. */
  const visible = failed || allShown ? mistakes : mistakes.slice(0, SHOWN_AT_FIRST);
  const hidden = mistakes.length - visible.length;

  return (
    <section className="flex flex-col gap-8 pt-6" role="status" aria-live="polite">
      <header className="rounded-3xl bg-[var(--color-surface-section)] p-7">
        <div className="flex flex-col items-center gap-7 sm:flex-row">
          <span className="flex size-32 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-[3px] border-[var(--color-burnt-siena-dark)] bg-[var(--color-neutral-white)]">
            <span className="font-[family-name:var(--font-heading)] text-[2.3rem] leading-none font-bold tracking-[-0.04em] text-[var(--color-burnt-siena-dark)] tabular-nums">
              {percent}%
            </span>
            {/** Said only when it is true; a failed stamp says the number and no more. */}
            {passed ? (
              <span className="mt-1 text-[0.65rem] font-bold tracking-[0.18em] text-[var(--color-burnt-siena-dark)] uppercase">
                {t('quiz.resultStamp')}
              </span>
            ) : null}
          </span>

          <div className="min-w-0 text-center sm:text-left">
            {earnedPoints != null && totalPoints != null ? (
              <p className="text-xs font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
                {t('quiz.resultPointsOf', {
                  earned: earnedPoints,
                  total: totalPoints,
                })}
              </p>
            ) : null}
            <h3 className="mt-1.5 font-[family-name:var(--font-heading)] text-[1.75rem] leading-tight font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
              {passed
                ? t('quiz.resultPassedTitle')
                : t('quiz.resultAlmostTitle', { passing: passingScore ?? 0 })}
            </h3>
            <p className="mt-2 leading-relaxed text-[var(--color-text-primary)]">
              {passed
                ? t('quiz.resultPassedNote', { passing: passingScore ?? 0 })
                : t('quiz.resultAlmostNote')}
            </p>
          </div>
        </div>

        {/**
         * The mark against the line it had to clear. The marker is the point of the bar:
         * a percentage on its own does not say how close "almost" was.
         */}
        {passingScore != null ? (
          <div className="mt-6">
            <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-[var(--color-dawn-pink-dark)]/35">
              <div
                className="h-full rounded-full bg-[var(--color-accent-primary)]"
                style={{ width: `${Math.min(100, percent)}%` }}
              />
            </div>
            <div
              className="relative -mt-3.5 h-3.5"
              style={{ paddingLeft: `${Math.min(100, passingScore)}%` }}
            >
              <span
                aria-hidden
                className="absolute top-[-5px] block h-6 w-[3px] -translate-x-1/2 rounded-sm bg-[var(--color-text-primary)]"
              />
            </div>
            <p
              className="mt-1.5 text-[13px] text-[var(--color-text-secondary)]"
              style={{ paddingLeft: `${Math.min(92, passingScore)}%` }}
            >
              {t('quiz.resultThreshold', { passing: passingScore })}
            </p>
          </div>
        ) : null}
      </header>

      {parts.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h4 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
            {t('quiz.byParts')}
          </h4>
          <ul className="flex flex-col gap-2.5">
            {parts.map((part) => (
              <li key={part.title}>
                <PartRow part={part} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mistakes.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h4 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
            {t('quiz.whatToWorkOn')}
          </h4>

          <ul className="flex flex-col gap-3">
            {visible.map((mistake) => (
              <li key={mistake.question.id}>
                <MistakeCard mistake={mistake} />
              </li>
            ))}
          </ul>

          {/** Two at a time by default: a wall of eleven is not a place to start. */}
          {hidden > 0 ? (
            <button
              type="button"
              onClick={() => setAllShown(true)}
              className="self-start text-sm font-semibold text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
            >
              {t('quiz.showAllMistakes', { count: mistakes.length })}
            </button>
          ) : null}
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-[var(--color-dawn-pink-dark)]/35 pt-7">
        {/** Passed: on. Failed: the retake is the thing to do, so it leads. */}
        {passed && onMoveOn ? (
          <button type="button" onClick={onMoveOn} className={PRIMARY_BUTTON}>
            {moveOnLabel ?? t('quiz.nextModule')}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onRetry}
          className={passed ? SECONDARY_BUTTON : PRIMARY_BUTTON}
        >
          {t('quiz.oneMoreTime')}
        </button>
        {!passed && onMoveOn ? (
          <button type="button" onClick={onMoveOn} className={SECONDARY_BUTTON}>
            {t('quiz.backToLessons')}
          </button>
        ) : null}
      </div>
    </section>
  );
};

/** One part of the test, with the share of its points the student earned. */
const PartRow: React.FC<{ part: QuizPartResult }> = ({ part }) => {
  const { t } = useTranslation();
  /**
   * The parts of a test are its skills, where the author named them - but a test written
   * before blocks existed is split by lesson, and "2.1" has no drawing. Looked up rather
   * than indexed, so such a part keeps its name and simply goes without one.
   */
  const Art: React.FC<{ size?: number }> | null =
    (BLOCK_ART as Partial<Record<string, React.FC<{ size?: number }>>>)[
      part.title
    ] ?? null;
  const share =
    part.total_points > 0 ? (part.earned_points / part.total_points) * 100 : 0;

  return (
    <div className="flex items-center gap-4 rounded-[20px] bg-[var(--color-neutral-white)] p-3 pr-5">
      {Art ? (
        <span
          aria-hidden
          className="flex size-16 shrink-0 items-center justify-center rounded-[14px] bg-[var(--color-surface-section)]"
        >
          <Art size={56} />
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
          {Art ? t(`practice.blocks.${part.title}.title`) : part.title}
        </span>
        <span className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-dawn-pink-dark)]/35">
          <span
            className="block h-full rounded-full bg-[var(--color-accent-primary)]"
            style={{ width: `${share}%` }}
          />
        </span>
      </span>

      <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--color-accent-primary)] tabular-nums">
        {part.earned_points}/{part.total_points}
      </span>
    </div>
  );
};

/** One mistake: what was asked, what was answered, and where to go back to. */
const MistakeCard: React.FC<{ mistake: TestMistake }> = ({ mistake }) => {
  const { t } = useTranslation();
  const { question, position, given, accepted, explanation, reviewLesson } = mistake;
  const block = question.block;

  return (
    <article className="rounded-[18px] border-[1.5px] border-[var(--color-dawn-pink-dark)]/45 bg-[var(--color-neutral-white)] px-[22px] py-[18px]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {/* Two labels, told apart by a gap rather than by a separator character. */}
        <p className="flex flex-wrap items-center gap-x-4 text-xs font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
          {block ? <span>{t(`practice.blocks.${block}.title`)}</span> : null}
          <span>{t('quiz.questionNumber', { number: position })}</span>
        </p>
        {reviewLesson ? (
          <span className="text-sm font-semibold text-[var(--color-burnt-siena-dark)]">
            {t('quiz.revisitLesson', { lesson: reviewLesson })}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-[var(--color-text-primary)]">{question.prompt}</p>

      {/**
       * What was written against what was wanted - but only once the test has been passed.
       * After a failure the answer key stays back, or a retake is copying.
       */}
      {accepted.length > 0 ? (
        <p className="mt-2.5 flex flex-wrap items-center gap-2">
          {given ? (
            <span className="font-mono text-[var(--color-text-secondary)] line-through decoration-[var(--color-accent-primary)] decoration-2">
              {given}
            </span>
          ) : null}
          <span aria-hidden className="text-[var(--color-text-secondary)]">
            →
          </span>
          <span className="rounded-md bg-[var(--color-burnt-siena-lighter)] px-2 py-0.5 font-mono font-medium text-[var(--color-text-primary)]">
            {accepted[0]}
          </span>
        </p>
      ) : null}

      {explanation ? (
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{explanation}</p>
      ) : null}
    </article>
  );
};

export default TestResult;
