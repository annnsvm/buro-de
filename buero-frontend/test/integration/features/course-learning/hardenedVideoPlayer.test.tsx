import { act, screen, waitFor } from '@testing-library/react';
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
