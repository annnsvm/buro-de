import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeElement } from '@/api/quizApi';

export type ListeningAudioProps = {
  element: PracticeElement;
};

/** Slow enough to pick the words apart, and normal. Anything between is noise. */
const SPEEDS = [0.75, 1] as const;

/**
 * The recording a set of questions is about.
 *
 * Two things matter for speech and almost nothing else does: being able to slow it down,
 * and being able to hear a passage again without hunting for the spot. So the player has a
 * speed switch and a replay, and no scrubbing refinements beyond the bar the browser gives.
 *
 * Plays are not limited. An exam would cap them at two; this is practice, and a student who
 * needs a sixth listen is doing exactly what the block is for.
 */
const ListeningAudio: React.FC<ListeningAudioProps> = ({ element }) => {
  const { t } = useTranslation();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  /** The element is created by the browser, so the rate has to be set on it, not in JSX. */
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);

  const replay = () => {
    if (!audio.current) return;
    audio.current.currentTime = 0;
    void audio.current.play();
  };

  return (
    <section className="mb-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-section)] p-4 sm:p-5">
      <h3 className="text-base font-bold text-[var(--color-text-primary)]">{element.title}</h3>

      {element.audio_url ? (
        <>
          <audio
            ref={audio}
            src={element.audio_url}
            controls
            preload="metadata"
            className="mt-3 w-full"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={replay}
              className="rounded-full border border-[var(--color-border-default)] px-4 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-dawn-pink-light)]"
            >
              {t('practice.replay')}
            </button>

            <span className="ml-auto flex items-center gap-1" role="group">
              {SPEEDS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSpeed(value)}
                  aria-pressed={speed === value}
                  className={[
                    'rounded-full px-3 py-1.5 text-sm font-medium transition',
                    speed === value
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-neutral-white)]'
                      : 'border border-[var(--color-border-default)] text-[var(--color-text-secondary)]',
                  ].join(' ')}
                >
                  {value}×
                </button>
              ))}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          {t('practice.audioMissing')}
        </p>
      )}

      {/**
       * The transcript arrives from the server only once every question about this recording
       * has been answered. Until then the student is told it is coming - so the block does not
       * look as though it is hiding something, and reading cannot replace listening.
       */}
      {element.has_transcript ? (
        element.transcript ? (
          <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-3">
            <button
              type="button"
              onClick={() => setTranscriptOpen((open) => !open)}
              aria-expanded={transcriptOpen}
              className="text-sm font-semibold text-[var(--color-burnt-siena-dark)]"
            >
              {transcriptOpen ? t('practice.hideTranscript') : t('practice.showTranscript')}
            </button>
            {transcriptOpen ? (
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
                {element.transcript}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 border-t border-[var(--color-border-subtle)] pt-3 text-xs text-[var(--color-text-secondary)]">
            {t('practice.transcriptLocked')}
          </p>
        )
      ) : null}
    </section>
  );
};

export default ListeningAudio;
