import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';

import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';
import { loadYoutubeIframeApi } from '@/helpers/youtubeIframeApi';
import {
  DEFAULT_VOLUME,
  HARDENED_PLAYER_VARS,
  PLAYBACK_RATES,
  WATERMARK_MOVE_INTERVAL_MS,
  YOUTUBE_NOCOOKIE_HOST,
  canSetVolume,
  clampVolume,
  formatClock,
  nextPlaybackRate,
  watermarkCorner,
  watermarkLabel,
} from './videoHardening';

export type HardenedYouTubePlayerProps = {
  videoId: string;
  title: string;
  onEnded?: () => void;
  /** The API did not load, or the player would not start: the caller shows a plain embed. */
  onUnavailable: () => void;
  className?: string;
};

const CORNER_CLASS: Record<string, string> = {
  'top-left': 'left-3 top-3',
  'top-right': 'right-3 top-3',
  'bottom-left': 'left-3 bottom-20',
  'bottom-right': 'right-3 bottom-20',
};

/**
 * The lesson video, with every door back to YouTube closed and the student's name on it.
 *
 * See `videoHardening.ts` for what this does and does not achieve - in short, YouTube's own
 * control bar is gone, because the logo, the title overlay and the share button all live in
 * it, and this draws its own bar instead. The iframe takes no pointer events at all, so the
 * title bar cannot even be summoned by hovering, and the context menu is refused so that
 * "Copy video URL" is not one right-click away.
 *
 * None of that stops someone who opens the developer tools. The watermark is what addresses
 * that: it cannot prevent a recording, but it decides whether a recording has a name on it.
 */
const HardenedYouTubePlayer: React.FC<HardenedYouTubePlayerProps> = ({
  videoId,
  title,
  onEnded,
  onUnavailable,
  className = '',
}) => {
  const { t } = useTranslation();
  const user = useAppSelector(selectCurrentUser);
  const mark = watermarkLabel(user);

  const containerRef = useRef<HTMLDivElement>(null);
  const hostWrapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YoutubePlayerHandle | undefined>(undefined);
  const hostId = useId().replace(/:/g, '');

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  /**
   * Asked once, of the browser rather than of the user agent. iOS makes the volume setter
   * do nothing, so a slider there would move and change nothing - worse than not having
   * one. The mute button stays, because muting does still work.
   */
  const [volumeIsAdjustable] = useState(() => canSetVolume());
  const [rate, setRate] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  /**
   * iPhone Safari has no `requestFullscreen` for an ordinary element - only iPad does, and
   * only a `<video>` can go fullscreen natively, which a YouTube embed is not. So on a
   * phone the button did nothing at all, silently, because the call was optional. The
   * fallback is to cover the page with the player ourselves.
   */
  const [coversPage, setCoversPage] = useState(false);
  const [watermarkStep, setWatermarkStep] = useState(0);

  /**
   * Kept in refs as well as state because the player's callbacks are registered once, when
   * it is built, and would otherwise keep looking at the first render's values.
   */
  const onEndedRef = useRef(onEnded);
  const onUnavailableRef = useRef(onUnavailable);
  const endedEmittedRef = useRef(false);
  useEffect(() => {
    onEndedRef.current = onEnded;
    onUnavailableRef.current = onUnavailable;
  }, [onEnded, onUnavailable]);

  const signalEnded = useCallback(() => {
    if (endedEmittedRef.current) return;
    endedEmittedRef.current = true;
    onEndedRef.current?.();
  }, []);

  /** Build the player. */
  useEffect(() => {
    const wrap = hostWrapRef.current;
    if (!wrap || !videoId) return;

    let cancelled = false;
    endedEmittedRef.current = false;
    const host = document.createElement('div');
    host.id = `yt-hardened-${hostId}`;
    host.style.width = '100%';
    host.style.height = '100%';
    wrap.appendChild(host);

    const teardown = () => {
      try {
        playerRef.current?.destroy();
      } catch {
        void 0;
      }
      playerRef.current = undefined;
      wrap.innerHTML = '';
    };

    const giveUp = () => {
      if (cancelled) return;
      teardown();
      onUnavailableRef.current();
    };

    void loadYoutubeIframeApi()
      .then(() => {
        if (cancelled) return;
        if (!window.YT?.Player || !window.YT.PlayerState) {
          giveUp();
          return;
        }
        try {
          const player = new window.YT.Player(host, {
            videoId,
            width: '100%',
            height: '100%',
            host: YOUTUBE_NOCOOKIE_HOST,
            playerVars: { ...HARDENED_PLAYER_VARS },
            events: {
              onReady: (event) => {
                if (cancelled) return;
                setReady(true);
                setDuration(event.target.getDuration?.() ?? 0);
                setMuted(Boolean(event.target.isMuted?.()));
                const level = event.target.getVolume?.();
                if (typeof level === 'number') setVolume(clampVolume(level));
              },
              onStateChange: (event) => {
                if (cancelled || !window.YT) return;
                const { PLAYING, PAUSED, ENDED } = window.YT.PlayerState;
                if (event.data === PLAYING) {
                  setPlaying(true);
                  /** Metadata has certainly arrived by now, so the length is real. */
                  setDuration(event.target.getDuration?.() ?? 0);
                }
                if (event.data === PAUSED) setPlaying(false);
                if (event.data === ENDED) {
                  setPlaying(false);
                  signalEnded();
                }
              },
              onError: () => {
                giveUp();
              },
            },
          });
          if (cancelled) {
            try {
              player.destroy();
            } catch {
              void 0;
            }
            wrap.innerHTML = '';
            return;
          }
          playerRef.current = player;
        } catch {
          giveUp();
        }
      })
      .catch(() => {
        giveUp();
      });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [videoId, hostId, signalEnded]);

  /** Where we are in the video, for the bar. Only while it is actually moving. */
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setElapsed(player.getCurrentTime?.() ?? 0);
      const length = player.getDuration?.() ?? 0;
      if (length > 0) setDuration(length);
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  /** Move the watermark, so a single crop does not clear it. */
  useEffect(() => {
    if (!mark) return;
    const id = window.setInterval(
      () => setWatermarkStep((step) => step + 1),
      WATERMARK_MOVE_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [mark]);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo?.();
    else player.playVideo?.();
  }, [playing]);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      player.unMute?.();
      setMuted(false);
      /** Unmuting a slider sitting at zero would otherwise still play nothing. */
      if (volume === 0) {
        player.setVolume?.(DEFAULT_VOLUME);
        setVolume(DEFAULT_VOLUME);
      }
    } else {
      player.mute?.();
      setMuted(true);
    }
  }, [muted, volume]);

  /**
   * Moving the slider off zero also unmutes: someone dragging it up is asking to hear
   * something, and leaving them with a silent player and a raised slider is a puzzle.
   */
  const changeVolume = useCallback((next: number) => {
    const player = playerRef.current;
    if (!player) return;
    const level = clampVolume(next);
    player.setVolume?.(level);
    setVolume(level);
    if (level === 0) {
      player.mute?.();
      setMuted(true);
    } else {
      player.unMute?.();
      setMuted(false);
    }
  }, []);

  const cycleRate = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const next = nextPlaybackRate(rate);
    player.setPlaybackRate?.(next);
    setRate(next);
  }, [rate]);

  const seekBy = useCallback(
    (seconds: number) => {
      const player = playerRef.current;
      if (!player) return;
      const at = Math.max(0, (player.getCurrentTime?.() ?? 0) + seconds);
      player.seekTo?.(at, true);
      setElapsed(at);
    },
    [],
  );

  const seekToFraction = useCallback(
    (fraction: number) => {
      const player = playerRef.current;
      if (!player || duration <= 0) return;
      const at = Math.min(Math.max(fraction, 0), 1) * duration;
      player.seekTo?.(at, true);
      setElapsed(at);
    },
    [duration],
  );

  const toggleFullscreen = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;

    /** Where it exists, the real thing: it hides the browser's own chrome too. */
    if (typeof node.requestFullscreen === 'function') {
      if (document.fullscreenElement === node) {
        void document.exitFullscreen?.();
      } else {
        void node.requestFullscreen();
      }
      return;
    }

    setCoversPage((on) => !on);
  }, []);

  /** Ours, because YouTube's own shortcuts are off and some of them open youtube.com. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key.toLowerCase();
    if (key === ' ' || key === 'k') {
      event.preventDefault();
      togglePlay();
    } else if (key === 'arrowright') {
      event.preventDefault();
      seekBy(5);
    } else if (key === 'arrowleft') {
      event.preventDefault();
      seekBy(-5);
    } else if (key === 'm') {
      event.preventDefault();
      toggleMute();
    } else if (key === 'f') {
      event.preventDefault();
      toggleFullscreen();
    } else if (key === 'escape' && coversPage) {
      /** Native fullscreen has its own way out; the stand-in needs one. */
      event.preventDefault();
      setCoversPage(false);
    }
  };

  const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;
  const expanded = fullscreen || coversPage;

  /**
   * `isolate` is the load-bearing word.
   *
   * Without it the bar, the watermark and the spinner take their z-index from whatever
   * stacking context the page happens to put them in - and on the lesson screen that is the
   * same one the workspace header sits in, at the same level, later in the document. The
   * burger menu lives inside that header, so its own z-50 is sealed inside a layer numbered
   * 20, and the player's controls were drawn straight over the open menu. Isolating keeps
   * this component's layers to itself, which is what they were always meant to be.
   */
  const shell = coversPage
    ? 'fixed inset-0 z-[100] h-full w-full bg-black'
    : 'relative isolate h-full w-full overflow-hidden bg-black';
  const BTN =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

  return (
    <div
      ref={containerRef}
      data-testid="hardened-video"
      className={`${shell} ${coversPage ? '' : className}`}
      /** "Copy video URL" is not a right-click away. */
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label={title}
    >
      {/**
       * `pointer-events-none` is the load-bearing part: with nothing reaching the iframe,
       * YouTube never sees a hover, so the title bar and its link out are never drawn -
       * and a click cannot land on anything of YouTube's even if one slipped through.
       */}
      <div
        ref={hostWrapRef}
        data-testid="hardened-video-frame"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />

      {/** Takes the clicks the iframe is not allowed to have. */}
      <button
        type="button"
        data-testid="hardened-video-surface"
        onClick={togglePlay}
        className="absolute inset-0 h-full w-full cursor-pointer bg-transparent focus:outline-none"
        aria-label={playing ? t('coursePage.videoPause') : t('coursePage.videoPlay')}
        tabIndex={-1}
      />

      {mark ? (
        <span
          data-testid="hardened-video-watermark"
          className={`pointer-events-none absolute z-10 select-none rounded bg-black/20 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white/40 ${
            CORNER_CLASS[watermarkCorner(watermarkStep)]
          }`}
          aria-hidden
        >
          {mark}
        </span>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-3 pt-10">
        <div className="pointer-events-auto flex flex-col gap-1.5">
          {/**
           * A button rather than an input: a range slider on a dark gradient needs its
           * thumb and track restyled in every browser to look like anything, and all this
           * has to do is take a click at a position and turn it into a time.
           */}
          <button
            type="button"
            data-testid="hardened-video-seek"
            className="group h-4 w-full cursor-pointer bg-transparent focus-visible:outline-none"
            aria-label={t('coursePage.videoSeek')}
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect();
              if (box.width <= 0) return;
              seekToFraction((event.clientX - box.left) / box.width);
            }}
          >
            <span className="relative block h-1 w-full rounded-full bg-white/25 transition-all group-hover:h-1.5">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-lesson-accent)]"
                style={{ width: `${progress * 100}%` }}
              />
            </span>
          </button>

          <div className="flex items-center gap-1">
            <button type="button" onClick={togglePlay} className={BTN} aria-label={playing ? t('coursePage.videoPause') : t('coursePage.videoPlay')}>
              {playing ? (
                <Pause className="h-4 w-4 fill-current" strokeWidth={0} aria-hidden />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={0} aria-hidden />
              )}
            </button>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={toggleMute}
                className={BTN}
                aria-label={muted ? t('coursePage.videoUnmute') : t('coursePage.videoMute')}
              >
                {muted ? (
                  <VolumeX className="h-4 w-4" aria-hidden />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden />
                )}
              </button>

              {/**
               * Absent where it could not work. On iOS the level belongs to the hardware
               * buttons and the setter does nothing, so the slider would move and change
               * nothing - see `canSetVolume`.
               */}
              {volumeIsAdjustable ? (
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={muted ? 0 : volume}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  aria-label={t('coursePage.videoVolume')}
                  data-testid="hardened-video-volume"
                  className="h-1 w-16 cursor-pointer accent-[var(--color-lesson-accent)] sm:w-20"
                />
              ) : null}
            </div>

            <span className="px-1 text-xs tabular-nums text-white/80" data-testid="hardened-video-clock">
              {formatClock(elapsed)} / {formatClock(duration > 0 ? duration : null)}
            </span>

            <span className="flex-1" />

            {/** Slowing German down is the difference between a doable listening task and a wall. */}
            <button
              type="button"
              onClick={cycleRate}
              className="flex h-9 shrink-0 items-center justify-center rounded-full px-2.5 text-xs font-semibold tabular-nums text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label={t('coursePage.videoSpeed')}
              data-testid="hardened-video-rate"
            >
              {rate}x
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className={BTN}
              data-testid="hardened-video-fullscreen"
              aria-label={
                expanded
                  ? t('coursePage.videoExitFullscreen')
                  : t('coursePage.videoFullscreen')
              }
            >
              {expanded ? <Minimize className="h-4 w-4" aria-hidden /> : <Maximize className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {!ready ? (
        <span className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center text-sm text-white/70">
          {t('coursePage.videoLoading')}
        </span>
      ) : null}
    </div>
  );
};

export { PLAYBACK_RATES };
export default HardenedYouTubePlayer;
