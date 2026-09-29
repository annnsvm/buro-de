import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export type PracticePanelProps = {
  courseMaterialId: string;
  courseId?: string;
  moduleId?: string;
  attachments?: MaterialAttachment[];
  /** Offered once every block is done. */
  onMoveOn?: () => void;
  /** Names where "move on" leads, so the hub does not guess. */
  nextStepLabel?: string;
};

/**
 * The practice of one lesson: a hub of blocks the student picks from.
 *
 * The order is theirs, not ours — the cards say what each block is and how far through it they
 * are, and any of them can be started first. A lesson's practice is one sitting broken into
 * parts, not a queue.
 */
const PracticePanel: React.FC<PracticePanelProps> = ({
  courseMaterialId,
  courseId,
  moduleId,
  attachments,
  onMoveOn,
  nextStepLabel,
}) => {
  const { t } = useTranslation();

  const [overview, setOverview] = useState<PracticeOverview | null>(null);
  const [openBlock, setOpenBlock] = useState<PracticeBlockId | null>(null);
  const [loading, setLoading] = useState(true);
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

  /** Coming back from a block re-reads the hub, so its progress is never stale. */
  const closeBlock = useCallback(() => {
    setOpenBlock(null);
    void load();
  }, [load]);

  if (loading) {
    return (
      <p className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
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
        <button
          type="button"
          onClick={closeBlock}
          className="mt-6 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
        >
          {t('practice.backToHub')}
        </button>
        <QuizPanel
          key={openBlock}
          courseMaterialId={courseMaterialId}
          block={openBlock}
          courseId={courseId}
          moduleId={moduleId}
          quizMaterialTitle={t(`practice.blocks.${openBlock}.title`)}
          onMoveOn={closeBlock}
        />
      </div>
    );
  }

  return (
    <>
      <PracticeHub
        overview={overview}
        onOpenBlock={setOpenBlock}
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
