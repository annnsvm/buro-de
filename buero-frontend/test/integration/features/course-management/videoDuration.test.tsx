import { act, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The length of a video lesson is read from YouTube, not typed.
 *
 * This is here because it used to be typed by hand even though the code looked like it filled
 * itself in. The form asked the player for the duration once, inside `onReady` - and the player
 * answers 0 until it has the video's metadata, which for many videos is after `onReady` has
 * already fired. So the first test below is the one that matters: an answer that arrives late
 * still lands in the field.
 */

vi.mock('@/helpers/youtubeIframeApi', () => ({
  loadYoutubeIframeApi: () => Promise.resolve(),
}));

const fetchYoutubePreview = vi.fn();
vi.mock('@/api/youtubeApi', () => ({
  fetchYoutubePreview: (...a: unknown[]) => fetchYoutubePreview(...a),
}));

const { default: CourseMaterialVideoFields } = await import(
  '@/features/course-managment/components/CourseManagementWorkspace/courseMaterial/CourseMaterialVideoFields'
);

/** A stand-in player whose answer the test controls, the way YouTube's own changes over time. */
type FakePlayer = {
  seconds: number;
  readyFired: boolean;
  fireStateChange: () => void;
};

let player: FakePlayer | null = null;
let playersBuilt = 0;
let destroyed = 0;
/** What the player knows before `onReady` fires. Zero is the awkward case the fix is for. */
let secondsAtBuild = 0;

const installFakeYoutube = () => {
  window.YT = {
    Player: function (
      this: unknown,
      _host: string | HTMLElement,
      options: {
        events?: {
          onReady?: (e: { target: YoutubePlayerHandle }) => void;
          onStateChange?: (e: { data: number; target: YoutubePlayerHandle }) => void;
        };
      },
    ) {
      playersBuilt += 1;
      const handle: YoutubePlayerHandle = {
        destroy: () => {
          destroyed += 1;
        },
        getDuration: () => player?.seconds ?? 0,
      };
      player = {
        seconds: secondsAtBuild,
        readyFired: false,
        fireStateChange: () =>
          options.events?.onStateChange?.({ data: 5, target: handle }),
      };
      /** The real API calls this as soon as the player exists, metadata or not. */
      options.events?.onReady?.({ target: handle });
      if (player) player.readyFired = true;
      return handle;
    } as unknown as Window['YT'] extends undefined ? never : NonNullable<Window['YT']>['Player'],
    PlayerState: { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
  };
};

/** The form around the field, holding the state the real editor holds. */
const Harness: React.FC<{ startId?: string; startDuration?: string }> = ({
  startId = '',
  startDuration = '',
}) => {
  const [id, setId] = useState(startId);
  const [duration, setDuration] = useState(startDuration);
  return (
    <CourseMaterialVideoFields
      youtubeVideoId={id}
      youtubeVideoDuration={duration}
      isSubmitting={false}
      onYoutubeVideoIdChange={setId}
      onYoutubeVideoDurationChange={setDuration}
    />
  );
};

const durationField = () => screen.getByPlaceholderText('Підставиться саме') as HTMLInputElement;

/** Lets the mocked promises settle inside React's own batching. */
const settle = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

beforeAll(async () => {
  await i18nReady;
});

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: false });
  player = null;
  secondsAtBuild = 0;
  playersBuilt = 0;
  destroyed = 0;
  fetchYoutubePreview.mockReset().mockResolvedValue({
    found: true,
    title: 'Lektion 1',
    thumbnailUrl: null,
    authorName: null,
  });
  installFakeYoutube();
});

afterEach(() => {
  vi.useRealTimers();
  delete window.YT;
});

describe('reading how long a video is', () => {
  it('takes an answer that arrives after the player said it was ready', async () => {
    renderWithProviders(<Harness startId="dQw4w9WgXcQ" />);
    await settle();

    /** This is the state the old code gave up in. */
    expect(player?.readyFired).toBe(true);
    expect(durationField().value).toBe('');
    expect(screen.getByText(/Читаємо тривалість/)).toBeInTheDocument();

    /** 7 minutes 12 seconds, the moment the metadata lands. */
    player!.seconds = 432;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(durationField().value).toBe('7:12');
    expect(screen.queryByText(/Читаємо тривалість/)).not.toBeInTheDocument();
  });

  it('takes an answer that is there straight away', async () => {
    /** A player that already has the metadata when it reports ready. */
    secondsAtBuild = 3750;

    renderWithProviders(<Harness startId="dQw4w9WgXcQ" />);
    await settle();

    /** No timer has run: this one was answered inside `onReady`. */
    expect(durationField().value).toBe('1:02:30');
    expect(screen.queryByText(/Читаємо тривалість/)).not.toBeInTheDocument();
  });

  it('reads it from a state change without waiting for the next tick', async () => {
    renderWithProviders(<Harness startId="dQw4w9WgXcQ" />);
    await settle();

    player!.seconds = 95;
    await act(async () => {
      player!.fireStateChange();
    });

    expect(durationField().value).toBe('1:35');
  });

  it('leaves the length a saved lesson already has', async () => {
    renderWithProviders(<Harness startId="dQw4w9WgXcQ" startDuration="7:10" />);
    await settle();

    player!.seconds = 432;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    /** 7:12 is what YouTube says; 7:10 is what the teacher saved, and it wins. */
    expect(durationField().value).toBe('7:10');
  });

  it('stops saying it is reading once it has given up', async () => {
    renderWithProviders(<Harness startId="dQw4w9WgXcQ" />);
    await settle();
    expect(screen.getByText(/Читаємо тривалість/)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(11_000);
    });

    expect(durationField().value).toBe('');
    expect(screen.queryByText(/Читаємо тривалість/)).not.toBeInTheDocument();
  });

  it('asks nothing until there is a whole video id', async () => {
    renderWithProviders(<Harness startId="dQw4w9Wg" />);
    await settle();

    expect(playersBuilt).toBe(0);
    expect(screen.queryByText(/Читаємо тривалість/)).not.toBeInTheDocument();
  });

  it('tears the player down when the field goes away', async () => {
    const { unmount } = renderWithProviders(<Harness startId="dQw4w9WgXcQ" />);
    await settle();
    expect(playersBuilt).toBe(1);

    unmount();
    expect(destroyed).toBe(1);
  });
});
