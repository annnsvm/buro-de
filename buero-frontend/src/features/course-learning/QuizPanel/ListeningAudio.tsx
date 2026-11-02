import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeElement } from '@/api/quizApi';
import Folder from '@/features/course-learning/PracticePanel/ui/Folder';

export type ListeningAudioProps = {
  element: PracticeElement;
};

/** Slow enough to pick the words apart, and normal. Anything between is noise. */
const SPEEDS = [0.75, 1] as const;

/** mm:ss, and 0:00 until the browser has read the file's length. */
const clock = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

/**
 * The recording a set of questions is about.
 *
 * Two things matter for speech and almost nothing else does: being able to slow it down,
 * and being able to hear a passage again without hunting for the spot. So the player has a
 * speed switch and a replay.
 *
 * The browser's own controls were replaced by these, which means everything they gave has to
 * be given back: the track below is a real range input, so it can be dragged, and it can be
 * moved with the arrow keys by someone who never touches a mouse. Volume is the one thing not
 * rebuilt - it belongs to the device, and a second slider for it would crowd the player.
 *
 * Plays are not limited. An exam would cap them at two; this is practice, and a student who
 * needs a sixth listen is doing exactly what the block is for.
 */
const ListeningAudio: React.FC<ListeningAudioProps> = ({ element }) => {
  const { t } = useTranslation();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [at, setAt] = useState(0);
  const [length, setLength] = useState(0);

  /** The element is created by the browser, so the rate has to be set on it, not in JSX. */
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);

  const replay = () => {
    if (!audio.current) return;
    audio.current.currentTime = 0;
    void audio.current.play();
  };

  /**
   * Decided by the same state the button is labelled from.
   *
   * Reading `paused` off the element instead would let the two disagree - the button could
   * say "pause" and start playback - and it is kept true by the play, pause and ended events
   * below, which are the only things that move it.
   */
  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (playing) el.pause();
    else void el.play();
  };

  const seek = (seconds: number) => {
    if (audio.current) audio.current.currentTime = seconds;
    setAt(seconds);
  };

  return (
    <Folder className="mb-6" tab={element.title}>
      {element.audio_url ? (
        <>
          {/**
           * Kept in the page without its own controls: it is the thing that plays, and the
           * row below is what the student presses.
           */}
          <audio
            ref={audio}
            src={element.audio_url}
            preload="metadata"
            onLoadedMetadata={(event) => setLength(event.currentTarget.duration)}
            onTimeUpdate={(event) => setAt(event.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? t('practice.pause') : t('practice.play')}
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)] transition hover:bg-[var(--color-accent-primary-hover)]"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1.5" />
                  <rect x="14" y="5" width="4" height="14" rx="1.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden className="ml-1 size-6" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              )}
            </button>

            <input
              type="range"
              min={0}
              max={length || 0}
              step={0.1}
              value={Math.min(at, length || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label={t('practice.seek')}
              aria-valuetext={`${clock(at)} / ${clock(length)}`}
              className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--color-surface-section)] accent-[var(--color-accent-primary)]"
              style={{
                /** Played is coral, the rest is the surface the track sits on. */
                background: `linear-gradient(to right, var(--color-accent-primary) ${
                  length ? (at / length) * 100 : 0
                }%, var(--color-surface-section) 0%)`,
              }}
            />

            <span className="shrink-0 font-mono text-sm whitespace-nowrap text-[var(--color-text-secondary)]">
              {clock(at)} / {clock(length)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={replay}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-[var(--color-surface-section)] bg-[var(--color-neutral-white)] px-4 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-dawn-pink-light)]"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
              {t('practice.replay')}
            </button>

            <span
              className="ml-auto flex items-center gap-1 rounded-full bg-[var(--color-burnt-siena-lightest)] p-1"
              role="group"
            >
              {SPEEDS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSpeed(value)}
                  aria-pressed={speed === value}
                  className={[
                    'min-h-9 rounded-full px-3.5 text-sm font-medium transition',
                    speed === value
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)]'
                      : 'text-[var(--color-text-secondary)]',
                  ].join(' ')}
                >
                  {value}×
                </button>
              ))}
            </span>
          </div>
        </>
      ) : (
        /**
         * Said as a notice rather than a grey aside.
         *
         * The author writes the row and uploads the mp3 afterwards, so a student can reach a
         * listening task before there is anything to play. A faint line under the heading read
         * like something had gone wrong on their side; this says the task is being prepared,
         * and that its questions are coming with it - which is why there are none below.
         */
        <p role="status" className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
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
          <div className="mt-4 border-t border-dashed border-[var(--color-surface-section)] pt-3">
            <button
              type="button"
              onClick={() => setTranscriptOpen((open) => !open)}
              aria-expanded={transcriptOpen}
              className="text-sm font-semibold text-[var(--color-burnt-siena-dark)]"
            >
              {transcriptOpen ? t('practice.hideTranscript') : t('practice.showTranscript')}
            </button>
            {transcriptOpen ? (
              <p className="mt-2 leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
                {element.transcript}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 flex items-center gap-2 border-t border-dashed border-[var(--color-surface-section)] pt-3 text-sm text-[var(--color-text-secondary)]">
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10" width="16" height="10" rx="2.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            {t('practice.transcriptLocked')}
          </p>
        )
      ) : null}
    </Folder>
  );
};

export default ListeningAudio;
