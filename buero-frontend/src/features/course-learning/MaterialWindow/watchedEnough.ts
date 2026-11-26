/**
 * When a lesson counts as watched, which is not the same as watched to the last second.
 *
 * "Mark as complete" used to unlock on YouTube's `ENDED` event alone, so a student had to
 * sit through the outro of every lesson before the course would record it - and a lesson
 * left a minute short counted for nothing, however much of it they had actually done.
 *
 * Two numbers decide it, and the stricter one wins:
 *
 *   - a floor, so a short lesson is not unlocked by watching the opening;
 *   - a tail, so a long lesson does not ask for more than a few minutes of patience.
 *
 * On the ten-to-twenty-minute lessons this course is made of, that lands three to five
 * minutes from the end. A two-minute clip still asks for most of itself, because there a
 * five-minute tail would mean the first frame.
 */

/** However long the lesson, this much of it is behind the student before anything unlocks. */
export const MIN_WATCHED_FRACTION = 0.7;

/** And however long it is, it never asks for more than this many seconds of tail. */
export const UNLOCK_TAIL_SECONDS = 300;

/**
 * The second at which the lesson may be marked complete, or null when the length is not
 * known yet. The player answers 0, NaN or Infinity until the video's metadata arrives,
 * and every one of those would otherwise unlock the button on the first frame.
 */
export const unlockAtSeconds = (duration: number): number | null => {
  if (!Number.isFinite(duration) || duration <= 0) return null;
  return Math.max(duration * MIN_WATCHED_FRACTION, duration - UNLOCK_TAIL_SECONDS);
};

export const watchedEnough = (elapsed: number, duration: number): boolean => {
  const unlockAt = unlockAtSeconds(duration);
  if (unlockAt === null) return false;
  if (!Number.isFinite(elapsed)) return false;
  return elapsed >= unlockAt;
};
