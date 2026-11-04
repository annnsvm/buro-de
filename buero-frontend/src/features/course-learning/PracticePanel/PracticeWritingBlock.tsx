import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchPracticeWritingTasks,
  submitPracticeWriting,
  type PracticeWritingResponse,
} from '@/api/writingApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';
import WritingTaskForm from '@/features/course-learning/WritingPanel/WritingTaskForm';
import BlockHeader from './ui/BlockHeader';

export type PracticeWritingBlockProps = {
  courseMaterialId: string;
  /** Drawn in the header, so a block shows one way back rather than two. */
  onBack?: () => void;
  /**
   * Where a finished letter leads: on to the next lesson when nothing else in the practice
   * is waiting, and back to the other blocks when something is. The practice decides which;
   * the block only offers it.
   */
  finish?: { label: string; onClick: () => void };
};

/**
 * The Schreiben block of a practice.
 *
 * The letters of one lesson, each with the rubric its author wrote and its own three goes. It
 * draws the same form a standalone writing material draws, so a student who has met one has
 * met the other.
 */
const PracticeWritingBlock: React.FC<PracticeWritingBlockProps> = ({
  courseMaterialId,
  onBack,
  finish,
}) => {
  const { t } = useTranslation();
  /** In the draft key so two people sharing a browser never see each other's letter. */
  const user = useAppSelector(selectCurrentUser);

  const [data, setData] = useState<PracticeWritingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchPracticeWritingTasks(courseMaterialId));
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('writing.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [courseMaterialId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <p className="px-6 py-12 text-center text-[var(--color-lesson-muted)]">
        {t('writing.loading')}
      </p>
    );
  }

  if (!data) {
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

  const { tasks, unusable } = data;
  /** A single task needs no heading of its own; the block already carries one. */
  const headed = tasks.length > 1;

  return (
    <section>
      <BlockHeader
        block="schreiben"
        title={t('practice.blocks.schreiben.title')}
        badges={[t('practice.optional')]}
        onBack={onBack}
        intro={t('practice.writing.intro')}
      />

      {tasks.length === 0 && unusable.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-lesson-muted)]">
          {t('practice.writing.empty')}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-12">
        {tasks.map((task, index) => (
          <WritingTaskForm
            /**
             * Keyed on the best attempt so a fresh mark restarts the box from the letter that
             * was actually graded, rather than leaving the text from before it.
             */
            key={`${task.element_id}:${task.best?.submitted_at ?? 'fresh'}`}
            task={task}
            draftKey={
              user ? `writing:${user.id}:${courseMaterialId}:${task.element_id}` : null
            }
            heading={headed ? task.title : null}
            position={index + 1}
            finish={finish}
            onSubmit={(text) => submitPracticeWriting(task.element_id, text)}
            onGraded={load}
          />
        ))}
      </div>

      {/**
       * A task the teacher has not finished writing is named rather than hidden. Saying "this
       * one is not ready yet" costs the student a shrug; leaving it out silently costs them
       * work they were set and never saw.
       */}
      {unusable.length > 0 ? (
        <ul className="mt-10 space-y-2">
          {unusable.map((entry) => (
            <li
              key={entry.element_id}
              className="rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-sm text-[var(--color-lesson-muted)]"
            >
              <span className="font-semibold text-[var(--color-lesson-body)]">
                {entry.title}
              </span>
              <span className="mt-0.5 block">{t('practice.writing.notReady')}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

export default PracticeWritingBlock;
