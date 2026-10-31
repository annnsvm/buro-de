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

export type PracticeWritingBlockProps = {
  courseMaterialId: string;
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
      <p className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
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
    <section className="pt-6">
      <header className="flex flex-col gap-2">
        <span className="text-[0.7rem] font-bold tracking-[0.14em] text-[var(--color-burnt-siena-dark)] uppercase">
          {t('practice.optional')}
        </span>
        <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.5rem,3vw,2rem)] leading-[1.08] font-bold tracking-[-0.035em] text-[var(--color-text-primary)]">
          {t('practice.blocks.schreiben.title')}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t('practice.writing.intro')}
        </p>
      </header>

      {tasks.length === 0 && unusable.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-secondary)]">
          {t('practice.writing.empty')}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-12">
        {tasks.map((task) => (
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
              className="rounded-xl bg-[var(--color-surface-section)] px-4 py-3 text-sm text-[var(--color-text-secondary)]"
            >
              <span className="font-semibold text-[var(--color-text-primary)]">
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
