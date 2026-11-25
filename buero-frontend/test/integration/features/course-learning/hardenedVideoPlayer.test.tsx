import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The lesson video, and the doors out of it.
 *
 * `videoHardening.test.ts` checks the settings; this checks the things a setting cannot
 * express - that the iframe is unreachable by the mouse, that the right-click menu is
 * refused, and that the student's address is actually on the picture. Each of those is
 * invisible when it breaks: the video still plays, and the way out is simply open again.
 */

let apiLoads: () => Promise<void> = () => Promise.resolve();
vi.mock('@/helpers/youtubeIframeApi', () => ({
  loadYoutubeIframeApi: () => apiLoads(),
}));

const { default: HardenedYouTubePlayer } = await import(
  '@/features/course-learning/MaterialWindow/HardenedYouTubePlayer'
);

type Built = {
  host: string | HTMLElement;
  options: {
    host?: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (e: { target: YoutubePlayerHandle }) => void;
      onStateChange?: (e: { data: number; target: YoutubePlayerHandle }) => void;
      onError?: (e: { data: number }) => void;
    };
  };
};

let built: Built[] = [];
const calls = { play: 0, pause: 0, mute: 0, unMute: 0, destroy: 0 };
const volumeSetTo: number[] = [];
let playerState = 2;

const installFakeYoutube = () => {
  window.YT = {
    Player: function (this: unknown, host: string | HTMLElement, options: Built['options']) {
      const handle: YoutubePlayerHandle = {
        destroy: () => {
          calls.destroy += 1;
        },
        getDuration: () => 750,
        getCurrentTime: () => 42,
        getPlayerState: () => playerState,
        playVideo: () => {
          calls.play += 1;
        },
        pauseVideo: () => {
          calls.pause += 1;
        },
        seekTo: () => undefined,
        mute: () => {
          calls.mute += 1;
        },
        unMute: () => {
          calls.unMute += 1;
        },
        isMuted: () => false,
        setPlaybackRate: () => undefined,
        setVolume: (level: number) => void volumeSetTo.push(level),
        getVolume: () => 100,
      };
      built.push({ host, options });
      options.events?.onReady?.({ target: handle });
      return handle;
      /** The real API is a constructor; the handle it hands back is what the app keeps. */
    } as unknown as Window['YT'] extends undefined ? never : NonNullable<Window['YT']>['Player'],
    PlayerState: { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
  };
};

beforeAll(async () => {
  await i18nReady;
});

beforeEach(() => {
  built = [];
  calls.play = 0;
  calls.pause = 0;
  calls.mute = 0;
  calls.unMute = 0;
  calls.destroy = 0;
  volumeSetTo.length = 0;
  playerState = 2;
  apiLoads = () => Promise.resolve();
  installFakeYoutube();
});

afterEach(() => {
  delete window.YT;
});

const STUDENT = {
  user: {
    currentUser: {
      id: 'u1',
      email: 'student@example.com',
      name: 'Олена',
      role: 'student',
    },
    status: 'idle',
    error: null,
  },
} as never;

const draw = (overrides: Partial<Parameters<typeof HardenedYouTubePlayer>[0]> = {}) =>
  renderWithProviders(
    <HardenedYouTubePlayer
      videoId="dQw4w9WgXcQ"
      title="Lektion 1"
      onUnavailable={vi.fn()}
      {...overrides}
    />,
    { preloadedState: STUDENT },
  );

describe('the way out to YouTube', () => {
  /**
   * The load-bearing one. YouTube draws its title bar - and the "Watch on YouTube" link in
   * it - when the player is hovered. If the frame can take a mouse event at all, that bar
   * comes back, and no amount of player settings hides it.
   */
  it('lets no mouse event reach the frame', async () => {
    draw();

    const frame = await screen.findByTestId('hardened-video-frame');

    expect(frame.className).toContain('pointer-events-none');
  });

  /** Otherwise "Copy video URL" is one right-click away from every student. */
  it('refuses the right-click menu', async () => {
    draw();

    const surface = await screen.findByTestId('hardened-video');
    const menu = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const allowed = surface.dispatchEvent(menu);

    expect(allowed).toBe(false);
  });

  it('asks YouTube for a player with the hardened settings', async () => {
    draw();

    await waitFor(() => expect(built).toHaveLength(1));
    expect(built[0].options.playerVars).toMatchObject({
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      rel: 0,
    });
    expect(built[0].options.host).toBe('https://www.youtube-nocookie.com');
  });
});

describe('the watermark', () => {
  /** What makes a leak attributable instead of anonymous. */
  it('puts the signed-in student on the picture', async () => {
    draw();

    expect(await screen.findByTestId('hardened-video-watermark')).toHaveTextContent(
      'student@example.com',
    );
  });

  /** It must never swallow a click meant for the video underneath it. */
  it('does not take clicks', async () => {
    draw();

    const mark = await screen.findByTestId('hardened-video-watermark');

    expect(mark.className).toContain('pointer-events-none');
  });

  it('shows nothing when nobody is signed in', async () => {
    renderWithProviders(
      <HardenedYouTubePlayer videoId="dQw4w9WgXcQ" title="Lektion 1" onUnavailable={vi.fn()} />,
      { preloadedState: { user: { currentUser: null, status: 'idle', error: null } } as never },
    );

    await waitFor(() => expect(built).toHaveLength(1));
    expect(screen.queryByTestId('hardened-video-watermark')).not.toBeInTheDocument();
  });
});

describe('driving the video ourselves', () => {
  /** With YouTube's bar gone, a click on the picture is the only play button most people use. */
  it('plays when the picture is clicked', async () => {
    draw();
    await waitFor(() => expect(built).toHaveLength(1));

    await userEvent.click(screen.getByTestId('hardened-video-surface'));

    expect(calls.play).toBe(1);
  });

  it('pauses once it is playing', async () => {
    draw();
    await waitFor(() => expect(built).toHaveLength(1));

    await act(async () => {
      built[0].options.events?.onStateChange?.({
        data: 1,
        target: { destroy: () => undefined, getDuration: () => 750 },
      });
    });
    await userEvent.click(screen.getByTestId('hardened-video-surface'));

    expect(calls.pause).toBe(1);
  });

  it('reports the video as finished exactly once', async () => {
    const onEnded = vi.fn();
    draw({ onEnded });
    await waitFor(() => expect(built).toHaveLength(1));

    const target = { destroy: () => undefined, getDuration: () => 750 };
    await act(async () => {
      built[0].options.events?.onStateChange?.({ data: 0, target });
      built[0].options.events?.onStateChange?.({ data: 0, target });
    });

    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it('shows the length it read from the player', async () => {
    draw();
    await waitFor(() => expect(built).toHaveLength(1));

    await act(async () => {
      built[0].options.events?.onStateChange?.({
        data: 1,
        target: { destroy: () => undefined, getDuration: () => 750 },
      });
    });

    expect(await screen.findByTestId('hardened-video-clock')).toHaveTextContent('12:30');
  });
});

describe('when YouTube will not cooperate', () => {
  /**
   * A lesson that cannot be watched is worse than a lesson watched on a player with a logo
   * on it, so the caller is told and falls back to the plain embed.
   */
  it('tells the caller when the API will not load', async () => {
    apiLoads = () => Promise.reject(new Error('blocked'));
    const onUnavailable = vi.fn();

    draw({ onUnavailable });

    await waitFor(() => expect(onUnavailable).toHaveBeenCalled());
  });

  it('tells the caller when the API loads but is not there', async () => {
    delete window.YT;
    const onUnavailable = vi.fn();

    draw({ onUnavailable });

    await waitFor(() => expect(onUnavailable).toHaveBeenCalled());
  });

  it('tells the caller when the video itself errors', async () => {
    const onUnavailable = vi.fn();
    draw({ onUnavailable });
    await waitFor(() => expect(built).toHaveLength(1));

    await act(async () => {
      built[0].options.events?.onError?.({ data: 150 });
    });

    expect(onUnavailable).toHaveBeenCalled();
  });
});

/**
 * Where the player's own layers are allowed to reach, and what "fullscreen" means on a
 * phone. Both were reported from a real iPhone, one after the other.
 */
describe('on a phone', () => {
  /**
   * The bar was drawn straight over the open burger menu.
   *
   * The workspace header is `sticky z-20`, which makes it a stacking context, and the menu
   * lives inside it - so the menu's own `z-50` is sealed inside a layer numbered 20. The
   * player's bar carried `z-20` in the page's own context and came later in the document,
   * and at equal numbers the later element wins. Isolating keeps this component's layers
   * to itself, which is where they always belonged.
   */
  it('keeps its own layers to itself', async () => {
    draw();

    const shell = await screen.findByTestId('hardened-video');

    expect(shell.className).toContain('isolate');
  });

  /**
   * iPhone Safari has no `requestFullscreen` for an ordinary element, and a YouTube embed
   * is an iframe rather than a `<video>`, so there is nothing native to ask. The call was
   * written optionally, so the button did nothing at all and said nothing about it.
   */
  it('covers the page itself when the browser cannot', async () => {
    draw();
    const shell = await screen.findByTestId('hardened-video');
    expect(Element.prototype.requestFullscreen).toBeUndefined();

    await userEvent.click(screen.getByTestId('hardened-video-fullscreen'));

    expect(shell.className).toContain('fixed');
    expect(shell.style.height).toBe('100dvh');
  });

  it('gives that back on a second press', async () => {
    draw();
    const shell = await screen.findByTestId('hardened-video');

    await userEvent.click(screen.getByTestId('hardened-video-fullscreen'));
    await userEvent.click(screen.getByTestId('hardened-video-fullscreen'));

    expect(shell.className).not.toContain('fixed');
  });

  it('says which way the button goes', async () => {
    draw();
    const button = screen.getByTestId('hardened-video-fullscreen');
    expect(button).toHaveAttribute('aria-label', 'На весь екран');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-label', 'Вийти з повного екрана');
  });
});

describe('where the browser does have fullscreen', () => {
  /** Preferred when it exists, because it hides the browser's own chrome as well. */
  it('asks the browser rather than covering the page', async () => {
    const request = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(Element.prototype, 'requestFullscreen', {
      configurable: true,
      writable: true,
      value: request,
    });

    try {
      draw();
      const shell = await screen.findByTestId('hardened-video');

      await userEvent.click(screen.getByTestId('hardened-video-fullscreen'));

      expect(request).toHaveBeenCalled();
      expect(shell.className).not.toContain('fixed');
    } finally {
      delete (Element.prototype as { requestFullscreen?: unknown }).requestFullscreen;
    }
  });
});

/**
 * Setting the level, not only silencing it.
 *
 * With YouTube's control bar gone its volume slider went with it, leaving mute as the only
 * thing a student could do - which on a listening exercise is the difference between
 * turning a German speaker down a little and turning them off.
 */
describe('the volume', () => {
  it('offers a slider where the browser allows one', async () => {
    draw();

    expect(await screen.findByTestId('hardened-video-volume')).toBeInTheDocument();
  });

  it('passes the level to the player', async () => {
    draw();
    await waitFor(() => expect(built).toHaveLength(1));

    const slider = screen.getByTestId('hardened-video-volume');
    fireEvent.change(slider, { target: { value: '30' } });

    expect(volumeSetTo).toContain(30);
  });

  /** Dragged all the way down means silence, and the speaker icon should agree. */
  it('mutes when dragged to zero', async () => {
    draw();
    await waitFor(() => expect(built).toHaveLength(1));

    fireEvent.change(screen.getByTestId('hardened-video-volume'), {
      target: { value: '0' },
    });

    expect(calls.mute).toBe(1);
  });

  /** Dragging it up is a request to hear something, so it cannot stay muted. */
  it('unmutes when dragged back up', async () => {
    draw();
    await waitFor(() => expect(built).toHaveLength(1));
    const slider = screen.getByTestId('hardened-video-volume');

    fireEvent.change(slider, { target: { value: '0' } });
    fireEvent.change(slider, { target: { value: '60' } });

    expect(calls.unMute).toBeGreaterThan(0);
    expect(volumeSetTo).toContain(60);
  });

  /** Otherwise unmuting leaves a raised speaker icon and a silent video. */
  it('gives the level back when unmuting from zero', async () => {
    draw();
    await waitFor(() => expect(built).toHaveLength(1));

    fireEvent.change(screen.getByTestId('hardened-video-volume'), {
      target: { value: '0' },
    });
    await userEvent.click(screen.getByLabelText('Увімкнути звук'));

    expect(volumeSetTo[volumeSetTo.length - 1]).toBe(100);
  });

  /**
   * iOS gives the level to the hardware buttons and ignores the setter, so a slider there
   * would move and change nothing. Muting still works, and stays.
   */
  it('is only a mute button where the level cannot be set', async () => {
    const real = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
      configurable: true,
      get: () => 1,
      set: () => undefined,
    });

    try {
      draw();
      await waitFor(() => expect(built).toHaveLength(1));

      expect(screen.queryByTestId('hardened-video-volume')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Вимкнути звук')).toBeInTheDocument();
    } finally {
      if (real) Object.defineProperty(HTMLMediaElement.prototype, 'volume', real);
    }
  });
});

/**
 * What the player does with a phone screen once it is covering it, and how it keeps out of
 * the way while a lesson is running.
 */
const startPlaying = async () => {
  await waitFor(() => expect(built).toHaveLength(1));
  await act(async () => {
    built[0].options.events?.onStateChange?.({
      data: 1,
      target: { destroy: () => undefined, getDuration: () => 750 },
    });
  });
};

describe('the control bar while a lesson plays', () => {
  /**
   * It sits over the lower part of the picture, which on a language video is often exactly
   * where the speaker or the subtitles are.
   */
  it('gets out of the way on its own', async () => {
    /** `waitFor` polls on timers, so real time has to keep driving them. */
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      draw();
      await startPlaying();

      expect(screen.getByTestId('hardened-video-controls').className).toContain(
        'opacity-100',
      );
      await act(async () => {
        vi.advanceTimersByTime(3100);
      });

      expect(screen.getByTestId('hardened-video-controls').className).toContain(
        'opacity-0',
      );
    } finally {
      vi.useRealTimers();
    }
  });

  /** Stopped, there is nothing behind them worth seeing, so they stay. */
  it('stays while the lesson is paused', async () => {
    /** `waitFor` polls on timers, so real time has to keep driving them. */
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      draw();
      await startPlaying();
      /**
       * Paused first, and only then the clock. In one step the hide timer left over from
       * playing fires before React has run the effect that would have cleared it, which is
       * an artefact of the test rather than of the player.
       */
      await act(async () => {
        built[0].options.events?.onStateChange?.({
          data: 2,
          target: { destroy: () => undefined, getDuration: () => 750 },
        });
      });
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByTestId('hardened-video-controls').className).toContain(
        'opacity-100',
      );
    } finally {
      vi.useRealTimers();
    }
  });

  /**
   * The first tap asks to see the controls. Pausing the lesson because someone wanted to
   * check how much of it was left is the kind of small annoyance that makes a player feel
   * broken.
   */
  it('comes back on a tap without pausing the lesson', async () => {
    /** `waitFor` polls on timers, so real time has to keep driving them. */
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      draw();
      await startPlaying();
      await act(async () => {
        vi.advanceTimersByTime(3100);
      });
      calls.pause = 0;

      await act(async () => {
        screen.getByTestId('hardened-video-surface').click();
      });

      expect(screen.getByTestId('hardened-video-controls').className).toContain(
        'opacity-100',
      );
      expect(calls.pause).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('covering a phone screen', () => {
  /**
   * `inset-0` measures against a box that on iOS runs under the browser's own bar, which
   * put the bottom of the picture - and the control bar with it - out of sight. The dynamic
   * units track what is actually visible.
   */
  it('is sized against what is actually visible', async () => {
    draw();
    const shell = await screen.findByTestId('hardened-video');

    await userEvent.click(screen.getByTestId('hardened-video-fullscreen'));

    expect(shell.style.height).toBe('100dvh');
    expect(shell.style.width).toBe('100dvw');
  });

  /**
   * No turning, by anyone. The player fills the screen the way the screen is being held,
   * and the phone's own rotation turns the video - which is what every other video on that
   * phone does. A quarter turn applied in CSS would have forced landscape on an upright
   * phone, and it is both unfamiliar and one more thing to break.
   */
  it('never turns itself', async () => {
    draw();
    const shell = await screen.findByTestId('hardened-video');

    await userEvent.click(screen.getByTestId('hardened-video-fullscreen'));

    expect(shell.style.transform).toBe('');
  });

  /** Otherwise a drag on the seek bar scrolls the lesson behind the video. */
  it('holds the page behind it still', async () => {
    draw();
    await screen.findByTestId('hardened-video');

    await userEvent.click(screen.getByTestId('hardened-video-fullscreen'));

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('gives the page back when it is closed', async () => {
    draw();
    await screen.findByTestId('hardened-video');
    const button = screen.getByTestId('hardened-video-fullscreen');

    await userEvent.click(button);
    await userEvent.click(button);

    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
