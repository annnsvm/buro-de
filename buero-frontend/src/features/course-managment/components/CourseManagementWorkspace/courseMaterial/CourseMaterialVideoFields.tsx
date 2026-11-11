import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormField, Input } from '@/components/ui';
import { extractYouTubeVideoId } from '@/features/course-managment/helpers/extractYouTubeVideoId';
import { useYoutubeDuration } from '@/features/course-managment/helpers/useYoutubeDuration';
import { fetchYoutubePreview, type YoutubePreview } from '@/api/youtubeApi';
import type { CourseMaterialVideoFieldsProps } from '@/types/features/courseManagment/CourseMaterialVideoFields.types';

/**
 * Adding a video: paste the link, and the rest fills itself in.
 *
 * The title and the thumbnail come from YouTube through our own server; the length comes from
 * the player, which is the only thing that knows it without an API key. All three are only ever
 * suggestions - every field stays editable, and nothing here can stop the form being saved if
 * YouTube is slow, private or unreachable.
 */
const CourseMaterialVideoFields: React.FC<
  CourseMaterialVideoFieldsProps & { onYoutubeTitleFound?: (title: string) => void }
> = ({
  youtubeVideoId,
  youtubeVideoDuration,
  isSubmitting,
  onYoutubeVideoIdChange,
  onYoutubeVideoDurationChange,
  onYoutubeTitleFound,
}) => {
  const [preview, setPreview] = useState<YoutubePreview | null>(null);
  const [looking, setLooking] = useState(false);
  const playerHost = useRef<HTMLDivElement | null>(null);

  /** Only a settled, eleven-character id is worth asking about. */
  const resolvedId = extractYouTubeVideoId(youtubeVideoId.trim()) ?? '';

  /**
   * The video this form opened on, which for a saved lesson is the one already stored.
   * Kept so that opening a lesson to rename it does not quietly rewrite its length and leave
   * the form looking unsaved.
   */
  const idAtOpen = useRef(resolvedId);

  /** Which video the length on screen was read for, so an answer is taken only once. */
  const filledFor = useRef<string | null>(null);

  const handleBlur = () => {
    const id = extractYouTubeVideoId(youtubeVideoId.trim());
    if (id && id !== youtubeVideoId.trim()) onYoutubeVideoIdChange(id);
  };

  /** Fills the title only when it is still empty - never overwrites what the teacher wrote. */
  const suggestTitle = useCallback(
    (title: string | null) => {
      if (title) onYoutubeTitleFound?.(title);
    },
    [onYoutubeTitleFound],
  );

  /**
   * What to do with a length once YouTube gives one up.
   *
   * It is written in two cases: the field is empty, or this is a different video from the one
   * the form opened on. A length a teacher corrected by hand is never overwritten.
   */
  const takeDuration = useCallback(
    (duration: string) => {
      if (filledFor.current === resolvedId) return;
      const isSavedVideo = resolvedId === idAtOpen.current;
      if (isSavedVideo && youtubeVideoDuration.trim()) return;
      filledFor.current = resolvedId;
      onYoutubeVideoDurationChange(duration);
    },
    [resolvedId, youtubeVideoDuration, onYoutubeVideoDurationChange],
  );

  const { isReading } = useYoutubeDuration(resolvedId, playerHost, takeDuration);

  useEffect(() => {
    if (!resolvedId) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    setLooking(true);

    void fetchYoutubePreview(resolvedId)
      .then((found) => {
        if (cancelled) return;
        setPreview(found);
        suggestTitle(found.title);
      })
      /** A failed lookup is silent: the fields are all typeable. */
      .catch(() => {
        if (!cancelled) setPreview(null);
      })
      .finally(() => {
        if (!cancelled) setLooking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedId, suggestTitle]);

  return (
    <>
      <FormField label="Посилання на YouTube або id відео" name="youtubeVideoIdTab">
        <Input
          id="youtubeVideoIdTab"
          placeholder="id відео або посилання watch / youtu.be / embed"
          value={youtubeVideoId}
          onChange={(e) => onYoutubeVideoIdChange(e.target.value)}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </FormField>

      {resolvedId ? (
        <div className="flex items-start gap-4 rounded-xl bg-[var(--color-surface-section)] p-3">
          {/* The picture is the quickest way to see whether this is the video meant. */}
          {preview?.thumbnailUrl ? (
            <img
              src={preview.thumbnailUrl}
              alt=""
              className="h-[68px] w-[120px] shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="h-[68px] w-[120px] shrink-0 rounded-lg bg-[var(--color-dawn-pink-light)]" />
          )}
          <div className="min-w-0 text-sm">
            <p className="font-medium text-[var(--color-text-primary)]">
              {looking
                ? 'Шукаємо відео…'
                : (preview?.title ?? 'Відео не знайдено - перевірте посилання')}
            </p>
            {preview?.authorName ? (
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                {preview.authorName}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Off-screen rather than hidden: a display:none player does not load, and so never
          reports a duration. */}
      <div className="h-0 overflow-hidden" aria-hidden>
        <div ref={playerHost} />
      </div>

      <FormField label="Тривалість відео" name="youtubeVideoDurationTab">
        <Input
          id="youtubeVideoDurationTab"
          placeholder="Підставиться саме"
          value={youtubeVideoDuration}
          onChange={(e) => onYoutubeVideoDurationChange(e.target.value)}
          disabled={isSubmitting}
        />
      </FormField>
      {/* Says why the field is still empty, so nobody starts typing over an answer on its way. */}
      {isReading && !youtubeVideoDuration.trim() ? (
        <p className="-mt-2 text-xs text-[var(--color-text-secondary)]">
          Читаємо тривалість з YouTube…
        </p>
      ) : null}
    </>
  );
};

export default CourseMaterialVideoFields;
