import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchWritingTask,
  submitWriting,
  type WritingTaskResponse,
} from '@/api/writingApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';
import LessonAttachments from '@/features/course-learning/MaterialWindow/LessonAttachments';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';
import WritingTaskForm from './WritingTaskForm';

export type WritingPanelProps = {
  courseMaterialId: string;
  courseId?: string;
  moduleId?: string;
  materialTitle: string;
  attachments?: MaterialAttachment[];
};

/**
 * A writing task that is a step of the lesson in its own right.
 *
 * The task itself is drawn by `WritingTaskForm`, which the practice's Schreiben block uses
 * too - the student meets the same screen either way round.
 */
const WritingPanel: React.FC<WritingPanelProps> = ({
  courseMaterialId,
  courseId,
  moduleId,
  materialTitle,
  attachments,
}) => {
  const { t } = useTranslation();
  /** In the draft key so two people sharing a browser never see each other's letter. */
  const user = useAppSelector(selectCurrentUser);

  const [task, setTask] = useState<WritingTaskResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTask(await fetchWritingTask(courseMaterialId));
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('writing.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [courseMaterialId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = useCallback(
    (text: string) => submitWriting(courseMaterialId, text),
    [courseMaterialId],
  );

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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-6 sm:px-6">
      <h2 className="pt-6 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
        {materialTitle || t('writing.title')}
      </h2>

      {/**
       * Keyed on the best attempt so that re-reading the task after a mark starts the box from
       * what was actually graded, rather than keeping the text from before it.
       */}
      <WritingTaskForm
        key={task.best?.submitted_at ?? 'fresh'}
        task={task}
        draftKey={user ? `writing:${user.id}:${courseMaterialId}` : null}
        onSubmit={submit}
        onGraded={load}
      />

      <LessonAttachments
        attachments={attachments}
        courseId={courseId}
        moduleId={moduleId}
        materialId={courseMaterialId}
      />
    </div>
  );
};

export default WritingPanel;
