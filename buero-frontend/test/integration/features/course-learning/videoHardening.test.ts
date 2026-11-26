import { describe, expect, it } from 'vitest';

import {
  DEFAULT_VOLUME,
  HARDENED_PLAYER_VARS,
  PLAYBACK_RATES,
  WATERMARK_CORNERS,
  YOUTUBE_NOCOOKIE_HOST,
  canSetVolume,
  clampVolume,
  formatClock,
  nextPlaybackRate,
  watermarkCorner,
  watermarkLabel,
} from '@/features/course-learning/MaterialWindow/videoHardening';

/**
 * The lesson videos live unlisted on YouTube, and that is not a lock - the video id has to
 * reach the browser or nothing plays. What can be done is to close the doors YouTube's own
 * player opens, and to put a name on anything that leaks anyway.
 *
 * Those are settings, and settings get quietly edited. Each one below is here because
 * losing it puts a route back to youtube.com in front of a paying student, and because
 * nothing on screen would look any different if it went.
 */
describe('what the player is told', () => {
  /**
   * The one that matters most. YouTube's control bar carries the logo, the share button and
   * the title overlay, and every one of them links out. Turning the bar off is what removes
   * all three at once - which is also why this app has to draw its own.
   */
  it('shows none of YouTube\'s own controls', () => {
    expect(HARDENED_PLAYER_VARS.controls).toBe(0);
  });

  /** Some of YouTube's shortcuts open youtube.com. The app binds its own instead. */
  it('takes YouTube\'s keyboard shortcuts away', () => {
    expect(HARDENED_PLAYER_VARS.disablekb).toBe(1);
  });

  /**
   * YouTube's fullscreen hands the whole screen to YouTube's UI, bar and all, which undoes
   * the rest of this. Fullscreen is done on our own container instead.
   */
  it('hides YouTube\'s fullscreen button', () => {
    expect(HARDENED_PLAYER_VARS.fs).toBe(0);
  });

  /** Cards and annotations are clickable and lead away. */
  it('turns annotations off', () => {
    expect(HARDENED_PLAYER_VARS.iv_load_policy).toBe(3);
  });

  it('keeps related videos on the same channel', () => {
    expect(HARDENED_PLAYER_VARS.rel).toBe(0);
  });

  /**
   * The one setting here that is not about hardening, and the one that is not ours to
   * choose. On iPhone, WebKit gives fullscreen to a `<video>` element alone, through
   * `webkitEnterFullscreen()` - `Element.requestFullscreen` does not exist there for an
   * ordinary element. Our `<video>` is inside YouTube's cross-origin iframe, out of reach,
   * so our own fullscreen button could only stretch a div over the page: Safari's address
   * bar still on screen, no rotation with the phone. Handing the decision to WebKit opens
   * the system player instead, which is what a plain YouTube link does.
   *
   * It costs the watermark and our control bar for as long as the system player is up -
   * both are our DOM and it sits above them.
   */
  it('lets the system player take the screen on a phone', () => {
    expect(HARDENED_PLAYER_VARS.playsinline).toBe(0);
  });

  /**
   * Deliberately absent. YouTube stopped honouring `modestbranding` on 2023-08-15, so
   * carrying it would only suggest the logo was being handled by something other than
   * `controls: 0` - and the next person to read this would believe it.
   */
  it('does not carry the deprecated modestbranding flag', () => {
    expect(HARDENED_PLAYER_VARS).not.toHaveProperty('modestbranding');
  });

  it('serves the player from the cookie-free host', () => {
    expect(YOUTUBE_NOCOOKIE_HOST).toBe('https://www.youtube-nocookie.com');
  });

  /** Frozen, so a caller cannot reach in and loosen one of these for its own case. */
  it('cannot be edited by a caller', () => {
    expect(Object.isFrozen(HARDENED_PLAYER_VARS)).toBe(true);
  });
});

describe('the watermark', () => {
  /**
   * The address, not the name: two students can share a name, and the address is what
   * identifies the account a video was served to.
   */
  it('names the account by its address', () => {
    expect(watermarkLabel({ email: 'student@example.com', name: 'Олена' })).toBe(
      'student@example.com',
    );
  });

  it('shows nothing when there is nobody to name', () => {
    expect(watermarkLabel(null)).toBeNull();
    expect(watermarkLabel(undefined)).toBeNull();
    expect(watermarkLabel({ email: '   ' })).toBeNull();
    expect(watermarkLabel({ name: 'Олена' })).toBeNull();
  });

  /**
   * It moves because a mark in a fixed corner is cropped off once and the video is clean
   * from then on.
   */
  it('visits every corner as the video runs', () => {
    const seen = new Set(
      Array.from({ length: WATERMARK_CORNERS.length }, (_, step) => watermarkCorner(step)),
    );

    expect(seen.size).toBe(WATERMARK_CORNERS.length);
  });

  it('wraps round rather than running off the end', () => {
    expect(watermarkCorner(WATERMARK_CORNERS.length)).toBe(watermarkCorner(0));
    expect(watermarkCorner(WATERMARK_CORNERS.length * 7 + 2)).toBe(watermarkCorner(2));
  });

  /** A clock that jumps, or a step that arrives fractional, must not throw mid-lesson. */
  it('survives a step that is negative or fractional', () => {
    expect(WATERMARK_CORNERS).toContain(watermarkCorner(-1));
    expect(WATERMARK_CORNERS).toContain(watermarkCorner(-9));
    expect(WATERMARK_CORNERS).toContain(watermarkCorner(2.7));
  });
});

describe('playback speed', () => {
  /** Not hardening - a slower German sentence is the difference between doable and a wall. */
  it('offers a speed below one', () => {
    expect(PLAYBACK_RATES.some((rate) => rate < 1)).toBe(true);
  });

  it('cycles back to the start', () => {
    const last = PLAYBACK_RATES[PLAYBACK_RATES.length - 1];

    expect(nextPlaybackRate(last)).toBe(PLAYBACK_RATES[0]);
  });

  it('returns to normal speed from a rate it does not know', () => {
    expect(nextPlaybackRate(3.5)).toBe(1);
  });
});

describe('the clock', () => {
  it('reads as a player clock', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(42)).toBe('0:42');
    expect(formatClock(750)).toBe('12:30');
    expect(formatClock(3750)).toBe('1:02:30');
  });

  /**
   * The player answers 0, NaN or Infinity until it has the video's metadata, and `NaN:NaN`
   * on screen is a bug a student sees.
   */
  it('says it does not know yet rather than printing nonsense', () => {
    expect(formatClock(null)).toBe('--:--');
    expect(formatClock(undefined)).toBe('--:--');
    expect(formatClock(Number.NaN)).toBe('--:--');
    expect(formatClock(Number.POSITIVE_INFINITY)).toBe('--:--');
    expect(formatClock(-5)).toBe('--:--');
  });
});

describe('whether the volume can be set at all', () => {
  /**
   * Asked of the browser, not of the user agent string. iOS gives the level to the
   * hardware buttons and makes the setter a no-op, so a slider there would move and change
   * nothing - and the only honest answer is not to draw one.
   */
  it('is true where a media element keeps the level it was given', () => {
    expect(canSetVolume()).toBe(true);
  });

  it('is false where the setter is ignored, the way iOS ignores it', () => {
    const real = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
      configurable: true,
      get: () => 1,
      set: () => undefined,
    });

    try {
      expect(canSetVolume()).toBe(false);
    } finally {
      if (real) Object.defineProperty(HTMLMediaElement.prototype, 'volume', real);
    }
  });
});

describe('the level itself', () => {
  it('stays inside what the player accepts', () => {
    expect(clampVolume(-20)).toBe(0);
    expect(clampVolume(250)).toBe(100);
    expect(clampVolume(42.6)).toBe(43);
  });

  it('falls back to the default rather than passing on nonsense', () => {
    expect(clampVolume(Number.NaN)).toBe(DEFAULT_VOLUME);
    expect(clampVolume(Number.POSITIVE_INFINITY)).toBe(DEFAULT_VOLUME);
  });
});
