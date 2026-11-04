import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeBlockId } from '@/api/practiceApi';
import { BLOCK_ART } from '@/features/course-learning/PracticePanel/illustrations/BlockArt';
import {
  DISABLED_BUTTON,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from '@/features/course-learning/PracticePanel/ui/buttons';
import { SCREEN_TITLE, SECTION_TITLE } from '@/features/course-learning/PracticePanel/ui/headings';

export type TestHubPart = {
  block: PracticeBlockId;
  /** Questions in the part, and how many of them have an answer. */
  total: number;
  answered: number;
  /** The texts and recordings it is built on, for the line under its name. */
  texts: number;
  recordings: number;
};

export type TestHubProps = {
  parts: readonly TestHubPart[];
  /** The percentage the author set, or null when she set none. */
  passingScore: number | null;
  /** The teacher's own name for this test, when she gave it one. */
  title?: string | null;
  /** The module it closes, for the heading when she did not. */
  moduleTitle?: string | null;
  onOpenPart: (block: PracticeBlockId) => void;
  onFinish: () => void;
  submitting: boolean;
};

/**
 * The front page of a module test: what it is made of, and how far through it you are.
 *
 * Built the same way the practice hub is, because to a student it is the same screen - a
 * list of parts, each with its drawing, its size and the way in. The one thing it does not
 * borrow is a score: a test is marked when it is handed in, so these cards count answers
 * given, never points earned. Showing "8 of 10" before the test is submitted would hand
 * over the result one part at a time.
 */
const TestHub: React.FC<TestHubProps> = ({
  parts,
  passingScore,
  title,
  moduleTitle,
  onOpenPart,
  onFinish,
  submitting,
}) => {
  const { t } = useTranslation();

  const answered = parts.reduce((sum, part) => sum + part.answered, 0);
  const total = parts.reduce((sum, part) => sum + part.total, 0);
  const filledParts = parts.filter(
    (part) => part.total > 0 && part.answered === part.total,
  ).length;
  const ready = total > 0 && answered === total;
  /** Only the width of the bar; never a number on screen, where it would read as a mark. */
  const share = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-7 pt-6">
      <header className="flex flex-col gap-3">
        {/**
         * One heading, and only one.
         *
         * The student was reading "Тест модуля" three times before a single question: above
         * the page, on a label, and as the title. The teacher's own name for the test is the
         * one that shows; where she has not given one, the heading names the module itself,
         * so one module's test can be told from another's.
         */}
        <h2 className={SCREEN_TITLE}>
          {title?.trim()
            ? title
            : moduleTitle
              ? t('quiz.finalTestOf', { module: moduleTitle })
              : t('quiz.testEyebrowFinal')}
        </h2>

        <p className="max-w-prose text-base text-[var(--color-lesson-muted)]">
          {t('quiz.testIntroOrder')}
          {passingScore != null ? ` ${t('quiz.testIntroPass', { passing: passingScore })}` : ''}
        </p>
      </header>

      {/**
       * How much of the test is filled in - counted in answers, never in percent.
       *
       * It was shown as a percentage beside the pass mark, and the two read as one
       * comparison: "62%" next to "pass mark 60%" says the student has passed, when
       * nothing has been marked at all and half the test is empty. Two different
       * quantities must not share a unit on the same line. The mark to reach is said
       * once, in the sentence above, where it belongs.
       */}
      <section className="rounded-[22px] bg-[var(--color-surface-section)] px-6 py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-sm font-medium text-[var(--color-lesson-muted)]">
            {t('quiz.testFilledNow')}
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-heading)] text-[1.9rem] leading-none font-bold tracking-[-0.04em] text-[var(--color-lesson-accent)] tabular-nums">
              {t('quiz.answersOf', { answered, total })}
            </span>
            <span className="text-sm text-[var(--color-lesson-muted)]">
              {t('quiz.answersLabel')}
            </span>
          </span>
        </div>

        <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-dawn-pink-dark)]/35">
          <div
            className="h-full rounded-full bg-[var(--color-lesson-accent)] transition-[width]"
            style={{ width: `${share}%` }}
          />
        </div>

        <p className="mt-2.5 text-[13px] text-[var(--color-lesson-muted)]">
          {t('quiz.testPartsDone', { done: filledParts, total: parts.length })}
        </p>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2">
        {parts.map((part) => (
          <li key={part.block}>
            <PartCard part={part} onOpen={() => onOpenPart(part.block)} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-dawn-pink-dark)]/35 pt-7">
        <p
          id="finish-test-hint"
          className="max-w-[420px] text-sm text-[var(--color-lesson-muted)]"
        >
          {ready ? '' : t('quiz.finishWhenAllParts', { total: parts.length })}
        </p>
        <button
          type="button"
          onClick={onFinish}
          disabled={!ready || submitting}
          aria-describedby={ready ? undefined : 'finish-test-hint'}
          className={[
            ready && !submitting ? PRIMARY_BUTTON : DISABLED_BUTTON,
            'min-w-[180px]',
          ].join(' ')}
        >
          {submitting ? t('quiz.submitting') : t('quiz.submitTest')}
        </button>
      </div>
    </div>
  );
};

/** One part: its drawing, what it holds, and the way in. */
const PartCard: React.FC<{ part: TestHubPart; onOpen: () => void }> = ({
  part,
  onOpen,
}) => {
  const { t } = useTranslation();
  const Art = BLOCK_ART[part.block];
  const full = part.total > 0 && part.answered === part.total;
  /**
   * Once a part has been touched the way in says "continue", full or not: a finished part
   * can still be gone back over, and offering to "start" something already answered reads
   * as an invitation to lose the work.
   */
  const touched = part.answered > 0;

  /** What is inside, in the author's own units: texts, recordings, questions. */
  const made: string[] = [];
  if (part.texts > 0) made.push(t('quiz.partTexts', { count: part.texts }));
  if (part.recordings > 0) {
    made.push(t('quiz.partRecordings', { count: part.recordings }));
  }
  made.push(t('quiz.partQuestions', { count: part.total }));

  return (
    <div className="flex h-full flex-col gap-3 rounded-[20px] bg-[var(--color-neutral-white)] p-3.5">
      <div className="relative flex items-center justify-center rounded-[14px] bg-[var(--color-surface-section)] py-4">
        <Art size={150} />
        {full ? (
          <span
            aria-hidden
            className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-[var(--color-lesson-accent)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4.5 4.5L19 7" />
            </svg>
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className={SECTION_TITLE}>
          {t(`practice.blocks.${part.block}.title`)}
        </span>
        {full ? (
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-lesson-accent)] tabular-nums">
            {part.answered}/{part.total}
          </span>
        ) : null}
      </div>

      {/* Two units joined by a comma, not by a separator character. */}
      <span className="text-sm text-[var(--color-lesson-muted)]">
        {made.join(', ')}
      </span>

      {/** A part part-way through shows how far, so "continue" means something. */}
      {touched && !full ? (
        <span className="flex items-center gap-3">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-dawn-pink-dark)]/35">
            <span
              className="block h-full rounded-full bg-[var(--color-lesson-accent)]"
              style={{ width: `${(part.answered / part.total) * 100}%` }}
            />
          </span>
          <span className="text-sm text-[var(--color-lesson-muted)] tabular-nums">
            {part.answered}/{part.total}
          </span>
        </span>
      ) : null}

      <button
        type="button"
        onClick={onOpen}
        className={[
          touched && !full ? PRIMARY_BUTTON : SECONDARY_BUTTON,
          'mt-auto w-full',
        ].join(' ')}
      >
        {touched ? t('quiz.partContinue') : t('quiz.partStart')}
      </button>
    </div>
  );
};

export default TestHub;
