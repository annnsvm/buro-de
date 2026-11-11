import { useEffect, useRef, useState, type RefObject } from 'react';
import { loadYoutubeIframeApi } from '@/helpers/youtubeIframeApi';
import { formatSeconds } from './formatSeconds';

/**
 * Asks YouTube how long a video is, so nobody has to type it.
 *
 * There is no way to get a duration out of YouTube without an API key except by loading the
 * player and asking it, which is what this does in an off-screen host element.
 *
 * The catch, and the reason this is a hook rather than three lines in `onReady`: `getDuration`
 * answers 0 until the player has the video's metadata, and `onReady` fires before that happens
 * for a good share of videos. Asking once and believing the answer is why the field kept coming
 * up empty. So the question is asked again on every state change and on a short timer, until
 * there is a real answer or the timer gives up.
 */

/** Often enough to feel instant, rarely enough to cost nothing. */
const POLL_EVERY_MS = 250;

/** Past this, the video is private, removed, or the network is gone. The field stays typeable. */
const GIVE_UP_AFTER_MS = 10_000;

export type DurationReading = {
  /** True while there is still a chance of an answer, so the form can say what it is doing. */
  isReading: boolean;
};

export const useYoutubeDuration = (
  videoId: string,
  host: RefObject<HTMLDivElement | null>,
  onFound: (duration: string) => void,
): DurationReading => {
  const [isReading, setIsReading] = useState(false);

  /**
   * Held in a ref, not a dependency: the caller's callback changes identity on every render,
   * and taking it as a dependency would tear down and rebuild the player each time.
   */
  const report = useRef(onFound);
  report.current = onFound;

  useEffect(() => {
    if (!videoId || !host.current) {
      setIsReading(false);
      return;
    }

    let cancelled = false;
    let player: YoutubePlayerHandle | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let deadline: ReturnType<typeof setTimeout> | null = null;

    const stopAsking = () => {
      if (timer) clearInterval(timer);
      if (deadline) clearTimeout(deadline);
      timer = null;
      deadline = null;
      if (!cancelled) setIsReading(false);
    };

    /**
     * One attempt. `from` is the player the event handed us, which exists even before the
     * constructor has returned - some players call `onReady` synchronously.
     */
    const tryRead = (from?: YoutubePlayerHandle | null): boolean => {
      if (cancelled) return true;
      const seconds = (from ?? player)?.getDuration?.() ?? 0;
      const formatted = formatSeconds(seconds);
      if (!formatted) return false;
      stopAsking();
      report.current(formatted);
      return true;
    };

    setIsReading(true);

    void loadYoutubeIframeApi()
      .then(() => {
        if (cancelled || !host.current || !window.YT?.Player) {
          stopAsking();
          return;
        }
        player = new window.YT.Player(host.current, {
          videoId,
          /** Nothing should play. The player is here to be asked a question, not watched. */
          playerVars: { autoplay: 0, controls: 0, rel: 0 },
          events: {
            onReady: (event) => {
              if (tryRead(event.target)) return;
              timer = setInterval(() => void tryRead(), POLL_EVERY_MS);
              deadline = setTimeout(stopAsking, GIVE_UP_AFTER_MS);
            },
            /** Cueing is usually where the metadata lands, so it is worth another look. */
            onStateChange: (event) => void tryRead(event.target),
          },
        });
      })
      .catch(() => {
        /* No player, no automatic length - the field is still there to type into. */
        stopAsking();
      });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      if (deadline) clearTimeout(deadline);
      try {
        player?.destroy?.();
      } catch {
        /* A player torn down mid-load throws on destroy; there is nothing to do about it. */
      }
    };
  }, [videoId, host]);

  return { isReading };
};
