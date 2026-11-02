import type { WritingAssessment } from '@/api/writingApi';

/**
 * One criterion's verdict, whichever shape it was stored in.
 *
 * Attempts graded before the amendment are stored with `id`/`met`/`note`; everything since uses
 * `n`/`point`/`comment`. Old attempts are not going to be re-marked, so both have to render, and
 * this is the one place that knows the difference.
 *
 * It lives here rather than beside the HTTP client on purpose: it is pure, and a test that mocks
 * the client module must not be able to mock this away with it.
 */
export const readMarks = (
  assessment: WritingAssessment | null | undefined,
): Array<{ n: number; earned: boolean; comment: string }> =>
  (assessment?.criteria ?? [])
    .map((mark) =>
      'point' in mark
        ? { n: mark.n, earned: mark.point === 1, comment: mark.comment }
        : { n: mark.id, earned: mark.met, comment: mark.note },
    )
    .sort((a, b) => a.n - b.n);
