import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  fetchPracticeOverview,
  type PracticeBlockId,
  type PracticeOverview,
} from '@/api/practiceApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import QuizPanel from '@/features/course-learning/QuizPanel/QuizPanel';
import LessonAttachments from '@/features/course-learning/MaterialWindow/LessonAttachments';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';
import PracticeHub from './PracticeHub';
import PracticeSpeakingBlock from './PracticeSpeakingBlock';
import PracticeWritingBlock from './PracticeWritingBlock';

export type PracticePanelProps = {
  courseMaterialId: string;
  courseId?: string;
  moduleId?: string;
  attachments?: MaterialAttachment[];
  /** Offered once every block is done. */
  onMoveOn?: () => void;
  /**
   * Called once the required blocks are all behind the student, so the lesson can be counted
   * towards the course. The practice does not own that record; it only knows when it is true.
   */
  onAllRequiredDone?: () => void;
  /** Names where "move on" leads, so the hub does not guess. */
  nextStepLabel?: string;
};

/**
 * The practice of one lesson: a hub of blocks the student picks from.
 *
 * The order is theirs, not ours - the cards say what each block is and how far through it they
 * are, and any of them can be started first. A lesson's practice is one sitting broken into
 * parts, not a queue.
 */
/** The block a student is in, kept in the address bar. */
const BLOCK_PARAM = 'block';

/** Only these five; anything else in the address bar is somebody editing the URL. */
const BLOCKS: readonly PracticeBlockId[] = [
  'grammatik',
  'lesen',
  'horen',
  'sprechen',
  'schreiben',
];

const PracticePanel: React.FC<PracticePanelProps> = ({
  courseMaterialId,
  courseId,
  moduleId,
  attachments,
  onMoveOn,
  onAllRequiredDone,
  nextStepLabel,
}) => {
  const { t } = useTranslation();

  const [overview, setOverview] = useState<PracticeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Which block is open is a place, not a piece of component state.
   *
   * It was held in `useState`, so opening one added nothing to the browser's history - and
   * the back button, which a student uses to mean "out of this block", took them out of the
   * lesson entirely. In the address bar it is a step back can undo, and a block can be linked
   * to directly.
   */
  const raw = searchParams.get(BLOCK_PARAM);
  const openBlock = useMemo(
    () => BLOCKS.find((block) => block === raw) ?? null,
    [raw],
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOverview(await fetchPracticeOverview(courseMaterialId));
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('practice.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [courseMaterialId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Reported the moment it becomes true, and not again.
   *
   * The hub is re-read every time the student comes back from a block, so without the guard
   * this would fire on every return once the practice was finished. A practice with nothing
   * required in it is never "all done" - there is nothing to be done.
   */
  const reported = useRef(false);
  useEffect(() => {
    if (!overview || !onAllRequiredDone || reported.current) return;
    if (overview.total_count === 0) return;
    if (overview.done_count < overview.total_count) return;
    reported.current = true;
    onAllRequiredDone();
  }, [overview, onAllRequiredDone]);

  /** Opening one is a step, so it is pushed rather than replaced: back closes the block. */
  const openBlockNamed = useCallback(
    (block: PracticeBlockId) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set(BLOCK_PARAM, block);
        return next;
      });
    },
    [setSearchParams],
  );

  /** Coming back from a block re-reads the hub, so its progress is never stale. */
  const closeBlock = useCallback(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete(BLOCK_PARAM);
      return next;
    });
    void load();
  }, [load, setSearchParams]);

  /**
   * Whether anything the course counts is still outstanding.
   *
   * It decides what the end of the writing block offers: the next lesson when there is
   * nothing left to come back for, and the way back to the other blocks when there is.
   * Optional blocks are not counted here - they never have to be done, so leaving one undone
   * is not a reason to send a student back to the hub.
   */
  const requiredLeft = (overview?.blocks ?? []).filter(
    (entry) => !entry.optional && entry.ready && !entry.done,
  ).length;

  if (loading) {
    return (
      <p className="px-6 py-12 text-center text-[var(--color-lesson-muted)]">
        {t('practice.loading')}
      </p>
    );
  }

  if (!overview) {
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

  if (openBlock) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pb-6 sm:px-6">
        {/**
         * Writing is not a set of questions, so it is not the question player.
         *
         * It is one letter marked against the author's own rubric, and the screen for that
         * already exists as a material of its own - the block shows that same screen rather
         * than a second, slightly different one.
         */}
        {openBlock === 'schreiben' ? (
          <PracticeWritingBlock
            courseMaterialId={courseMaterialId}
            onBack={closeBlock}
            /**
             * Where a finished letter leads. With every required block behind them the
             * student has no reason to return to the hub, so the offer is the next lesson;
             * with work still waiting, it is the hub.
             */
            finish={
              requiredLeft === 0 && onMoveOn
                ? { label: nextStepLabel ?? t('practice.toHub'), onClick: onMoveOn }
                : { label: t('practice.toHub'), onClick: closeBlock }
            }
          />
        ) : openBlock === 'sprechen' ? (
          /**
           * Speaking asks no questions either: the student records, listens to themselves and
           * compares that against the author's own answer. There is no score, because marking
           * spoken German automatically is not a judgement this platform can make honestly.
           */
          <PracticeSpeakingBlock
            courseMaterialId={courseMaterialId}
            onBack={closeBlock}
          />
        ) : (
          <QuizPanel
            key={openBlock}
            onBack={closeBlock}
            courseMaterialId={courseMaterialId}
            block={openBlock}
            courseId={courseId}
            moduleId={moduleId}
            quizMaterialTitle={t(`practice.blocks.${openBlock}.title`)}
            onMoveOn={closeBlock}
            moveOnLabel={t('practice.toHub')}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <PracticeHub
        overview={overview}
        onOpenBlock={openBlockNamed}
        onMoveOn={onMoveOn}
        nextStepLabel={nextStepLabel ?? t('practice.nextLesson')}
      />
      <LessonAttachments
        attachments={attachments}
        courseId={courseId}
        moduleId={moduleId}
        materialId={courseMaterialId}
      />
    </>
  );
};

export default PracticePanel;
