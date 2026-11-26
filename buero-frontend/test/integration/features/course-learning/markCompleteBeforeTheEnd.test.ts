import { describe, expect, it } from 'vitest';

import {
  MIN_WATCHED_FRACTION,
  UNLOCK_TAIL_SECONDS,
  unlockAtSeconds,
  watchedEnough,
} from '@/features/course-learning/MaterialWindow/watchedEnough';

/**
 * "Mark as complete" used to wait for YouTube's `ENDED` event, which arrives at the last
 * second of the video and nowhere earlier. A student who had watched the lesson and
 * stopped during the outro got no credit for it, and the course recorded nothing.
 *
 * It now turns on a few minutes from the end. Two numbers decide where, and the stricter
 * of them wins: a floor, so the opening of a short clip does not unlock it, and a tail,
 * so a long lesson does not ask for more patience than a few minutes.
 */
const minutes = (n: number) => n * 60;
const beforeTheEnd = (duration: number) => duration - (unlockAtSeconds(duration) ?? 0);

describe('how far from the end a lesson unlocks', () => {
  /** The length these lessons actually are: "близько 10 хвилин" says the lesson page. */
  it('unlocks three minutes from the end of a ten-minute lesson', () => {
    expect(beforeTheEnd(minutes(10))).toBe(minutes(3));
  });

  it('unlocks four and a half minutes from the end of a fifteen-minute one', () => {
    expect(beforeTheEnd(minutes(15))).toBe(minutes(4.5));
  });

  /** The tail caps here, so an hour-long lesson does not unlock at the halfway mark. */
  it('never gives away more than the tail, however long the lesson', () => {
    expect(beforeTheEnd(minutes(20))).toBe(UNLOCK_TAIL_SECONDS);
    expect(beforeTheEnd(minutes(60))).toBe(UNLOCK_TAIL_SECONDS);
  });

  /**
   * And the floor holds underneath, because on a two-minute clip a five-minute tail would
   * mean the first frame - the student would be credited for pressing play.
   */
  it('still asks for most of a short clip', () => {
    expect(unlockAtSeconds(minutes(2))).toBe(minutes(2) * MIN_WATCHED_FRACTION);
    expect(unlockAtSeconds(30)).toBe(30 * MIN_WATCHED_FRACTION);
    expect(watchedEnough(1, minutes(2))).toBe(false);
  });

  it('never unlocks on the first frame', () => {
    for (const seconds of [5, 30, minutes(1), minutes(10), minutes(60)]) {
      expect(unlockAtSeconds(seconds)).toBeGreaterThan(0);
      expect(watchedEnough(0, seconds)).toBe(false);
    }
  });
});

describe('the moment itself', () => {
  it('is closed before the mark and open at it', () => {
    const duration = minutes(10);
    const at = unlockAtSeconds(duration) as number;

    expect(watchedEnough(at - 1, duration)).toBe(false);
    expect(watchedEnough(at, duration)).toBe(true);
    expect(watchedEnough(at + 1, duration)).toBe(true);
    expect(watchedEnough(duration, duration)).toBe(true);
  });
});

/**
 * The player answers 0, NaN or Infinity for the length until the video's metadata has
 * arrived, and the check runs four times a second from the first frame onwards. Any of
 * those read as a number would unlock the button before the lesson had started.
 */
describe('before the player knows how long the video is', () => {
  it('says nothing is watched yet rather than everything', () => {
    for (const duration of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(unlockAtSeconds(duration)).toBeNull();
      expect(watchedEnough(0, duration)).toBe(false);
      expect(watchedEnough(99999, duration)).toBe(false);
    }
  });

  it('does not unlock on a position it cannot read', () => {
    expect(watchedEnough(Number.NaN, minutes(10))).toBe(false);
    expect(watchedEnough(Number.POSITIVE_INFINITY, minutes(10))).toBe(false);
  });
});
