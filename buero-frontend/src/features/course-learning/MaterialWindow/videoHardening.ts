/**
 * What is done to a lesson video, and what cannot be.
 *
 * The videos are unlisted on YouTube and embedded here. That is not a lock: the video id
 * has to reach the browser or nothing plays, so anyone willing to open the developer tools
 * can take it and watch the lesson on youtube.com. No player setting changes that, and
 * nothing in this file pretends to. The only real fix is a host that signs expiring URLs.
 *
 * What is worth doing in the meantime is two different things, and it helps to keep them
 * apart:
 *
 * 1. Close the easy doors. YouTube's own control bar carries the logo, the title overlay
 *    and the share button, and the right-click menu offers "Copy video URL" - four ways to
 *    leave for youtube.com without meaning anything by it. `HARDENED_PLAYER_VARS` turns
 *    the control bar off and the app draws its own, so none of those exist.
 *
 * 2. Make a leak attributable. A watermark cannot stop a screen recording, but it decides
 *    whether a recording that turns up is anonymous or has a name on it. That is the part
 *    that actually deters, so the label is the student's own address and it moves, which
 *    makes it costly to crop away.
 */

/** Serves the player without YouTube's tracking cookies. */
export const YOUTUBE_NOCOOKIE_HOST = 'https://www.youtube-nocookie.com';

/**
 * Note what is *not* here: `modestbranding`. YouTube stopped honouring it on 2023-08-15,
 * so passing it only suggests the logo is being dealt with when it is not. The logo goes
 * because `controls: 0` removes the bar it sits in.
 */
export const HARDENED_PLAYER_VARS: Readonly<Record<string, number>> = Object.freeze({
  autoplay: 1,
  /** No YouTube control bar: no logo, no share button, no title overlay on hover. */
  controls: 0,
  /** Related videos, when they appear at all, stay on this channel. */
  rel: 0,
  /**
   * On iPhone, let the video take the screen instead of staying in the page.
   *
   * This is the only route to a real fullscreen there, and it is not ours to choose
   * otherwise. WebKit gives fullscreen to a `<video>` element alone, through
   * `webkitEnterFullscreen()`; `Element.requestFullscreen` does not exist for an ordinary
   * element on iPhone (iPad has it, iPhone does not). Our `<video>` is inside YouTube's
   * cross-origin iframe, so we cannot call that method on it, and our own button can only
   * stretch a div to the size of the page - which leaves Safari's address bar and tabs on
   * screen, cannot rotate with the phone, and is what students were complaining about.
   *
   * `playsinline: 0` hands the decision to WebKit, which opens the system player: full
   * screen, rotates with the phone, with Apple's controls rather than YouTube's. The
   * hardening survives it - the system player carries no logo, no share button and no way
   * to youtube.com - but two things do not: the watermark and our own control bar are our
   * DOM, and the system player sits above them.
   *
   * Affects iOS only; every other platform ignores this parameter and keeps the bar below.
   */
  playsinline: 0,
  /** YouTube's keyboard shortcuts off - some of them open youtube.com. Ours replace them. */
  disablekb: 1,
  /** No annotation or card overlays, which are clickable and lead away. */
  iv_load_policy: 3,
  /** No YouTube fullscreen button; fullscreen is done on our container, so our bar stays. */
  fs: 0,
});

/**
 * The speeds offered, and why there are any.
 *
 * Not a hardening measure - a language one. A German sentence at 0.75 is the difference
 * between a listening exercise a beginner can do and one they cannot, and YouTube's own
 * speed menu went away with its control bar.
 */
export const PLAYBACK_RATES: readonly number[] = Object.freeze([0.75, 1, 1.25, 1.5]);

export const nextPlaybackRate = (current: number): number => {
  const index = PLAYBACK_RATES.indexOf(current);
  if (index < 0) return 1;
  return PLAYBACK_RATES[(index + 1) % PLAYBACK_RATES.length];
};

/**
 * What the watermark says.
 *
 * The address rather than the name: two students can share a name, and the address is what
 * identifies the account the video was served to. Nothing is shown when there is nobody to
 * name - a faint smudge over a lesson with no information in it is only a defect.
 */
export const watermarkLabel = (
  user: { email?: string | null; name?: string | null } | null | undefined,
): string | null => {
  const email = user?.email?.trim();
  if (email) return email;
  return null;
};

/**
 * Where the watermark sits on a given step of its cycle.
 *
 * It moves because a fixed corner is cropped off once and the video is clean after that.
 * Four corners rather than random placement so it never lands over the middle of the
 * picture, and so a test can say where it should be.
 */
export const WATERMARK_CORNERS = Object.freeze([
  'top-left',
  'bottom-right',
  'top-right',
  'bottom-left',
] as const);

export type WatermarkCorner = (typeof WATERMARK_CORNERS)[number];

export const watermarkCorner = (step: number): WatermarkCorner => {
  const count = WATERMARK_CORNERS.length;
  /** Negative and fractional steps included, so a clock that jumps cannot throw. */
  const index = ((Math.floor(step) % count) + count) % count;
  return WATERMARK_CORNERS[index];
};

/** How long each corner is held, in milliseconds. */
export const WATERMARK_MOVE_INTERVAL_MS = 25_000;

/**
 * Seconds as a clock, the way a player shows them: `0:42`, `12:30`, `1:02:30`.
 *
 * Guards the junk the player hands back before it has the video's metadata - zero, NaN,
 * Infinity - because `--:--` is honest and `NaN:NaN` is a bug on the screen.
 */
export const formatClock = (seconds: number | null | undefined): string => {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '--:--';
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

/** Where the player starts, when it has nothing else to say. */
export const DEFAULT_VOLUME = 100;

/**
 * Whether this browser lets a page set the volume at all.
 *
 * iOS hands the level to the hardware buttons and makes the `volume` setter do nothing -
 * WebKit implements it as a no-op - so a slider there would move and change nothing, which
 * is worse than not offering one. Muting still works, and stays.
 *
 * Asked of the browser rather than of the user agent string: a silent element is given a
 * level and read back, so what is being tested is the behaviour itself. A browser that
 * starts allowing it will be believed the day it does, and one that stops will be believed
 * too, without anyone editing a list of devices.
 */
export const canSetVolume = (): boolean => {
  if (typeof document === 'undefined') return false;
  try {
    const probe = document.createElement('audio');
    probe.volume = 0.5;
    return probe.volume === 0.5;
  } catch {
    return false;
  }
};

/** Keeps a level inside the range the player accepts, whatever the input hands over. */
export const clampVolume = (value: number): number => {
  if (!Number.isFinite(value)) return DEFAULT_VOLUME;
  return Math.min(100, Math.max(0, Math.round(value)));
};

/** How long the bar stays after a touch before it gets out of the way again. */
export const CONTROLS_IDLE_MS = 3_000;
