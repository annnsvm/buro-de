import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormField, Input } from '@/components/ui';
import { extractYouTubeVideoId } from '@/features/course-managment/helpers/extractYouTubeVideoId';
import { formatSeconds } from '@/features/course-managment/helpers/formatSeconds';
import { loadYoutubeIframeApi } from '@/helpers/youtubeIframeApi';
import { fetchYoutubePreview, type YoutubePreview } from '@/api/youtubeApi';
import type { CourseMaterialVideoFieldsProps } from '@/types/features/courseManagment/CourseMaterialVideoFields.types';

/**
 * Adding a video: paste the link, and the rest fills itself in.
 *
 * The title and the thumbnail come from YouTube through our own server; the length comes from the
 * player, which is the only thing that knows it without an API key. All three are only ever
 * suggestions — every field stays editable, and nothing here can stop the form being saved if
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

  const handleBlur = () => {
    const id = extractYouTubeVideoId(youtubeVideoId.trim());
    if (id && id !== youtubeVideoId.trim()) onYoutubeVideoIdChange(id);
  };

  /** Fills the title only when it is still empty — never overwrites what the teacher wrote. */
  const suggestTitle = useCallback(
    (title: string | null) => {
      if (title) onYoutubeTitleFound?.(title);
    },
    [onYoutubeTitleFound],
  );

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

  /**
   * A hidden player, purely to be asked how long the video is. It also proves the id plays at
   * all — a video that will not load here would not have loaded for a student either.
   */
  useEffect(() => {
    if (!resolvedId || !playerHost.current) return;
    let cancelled = false;
    let player: { destroy?: () => void } | null = null;

    void loadYoutubeIframeApi()
      .then(() => {
        if (cancelled || !playerHost.current || !window.YT?.Player) return;
        player = new window.YT.Player(playerHost.current, {
          videoId: resolvedId,
          events: {
            onReady: (event) => {
              if (cancelled) return;
              const formatted = formatSeconds(event.target.getDuration?.() ?? 0);
              if (formatted) onYoutubeVideoDurationChange(formatted);
            },
          },
        });
      })
      .catch(() => {
        /* No player, no automatic length — the field is still there to type into. */
      });

    return () => {
      cancelled = true;
      player?.destroy?.();
    };
    // The duration callback is stable enough; re-running on it would remount the player.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedId]);

  return (
    <>
      <FormField label="YouTube link or video id" name="youtubeVideoIdTab">
        <Input
          id="youtubeVideoIdTab"
          placeholder="Video id or paste watch / youtu.be / embed URL"
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
                : (preview?.title ?? 'Відео не знайдено — перевірте посилання')}
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

      <FormField label="Video duration" name="youtubeVideoDurationTab">
        <Input
          id="youtubeVideoDurationTab"
          placeholder="Підставиться саме"
          value={youtubeVideoDuration}
          onChange={(e) => onYoutubeVideoDurationChange(e.target.value)}
          disabled={isSubmitting}
        />
      </FormField>
    </>
  );
};

export default CourseMaterialVideoFields;
