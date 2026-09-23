import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { fetchLastQuizAttempt, isOutdatedAttempt } from '@/api/quizApi';

import { TEST_API_BASE_URL } from '../../constants';
import { server } from '../../mocks/server';

const MATERIAL = 'material-1';
const url = `${TEST_API_BASE_URL}/quiz/materials/${MATERIAL}/last-attempt`;

describe('fetchLastQuizAttempt', () => {
  /**
   * The case a student meets on the very first visit to a newly added quiz: no attempt
   * exists, and the server answers with an empty body rather than the four characters
   * "null". That does not arrive as null, so it has to be recognised by shape — missing
   * that turned a blank quiz into "Cannot use 'in' operator to search for 'outdated'".
   */
  it('reads an empty body as no attempt', async () => {
    server.use(http.get(url, () => new HttpResponse(null, { status: 200 })));

    const result = await fetchLastQuizAttempt(MATERIAL);

    expect(result).toBeNull();
    expect(() => isOutdatedAttempt(result)).not.toThrow();
    expect(isOutdatedAttempt(result)).toBe(false);
  });

  it('reads a literal null body as no attempt', async () => {
    server.use(http.get(url, () => HttpResponse.json(null)));

    expect(await fetchLastQuizAttempt(MATERIAL)).toBeNull();
  });

  it('passes a finished attempt through', async () => {
    server.use(
      http.get(url, () =>
        HttpResponse.json({
          attempt_id: 'a1',
          score: 84,
          earned_points: 21,
          total_points: 25,
          answers: [],
        }),
      ),
    );

    const result = await fetchLastQuizAttempt(MATERIAL);

    expect(isOutdatedAttempt(result)).toBe(false);
    expect(result).toMatchObject({ earned_points: 21, total_points: 25 });
  });

  it('recognises an attempt at a quiz that has since changed', async () => {
    server.use(http.get(url, () => HttpResponse.json({ outdated: true })));

    expect(isOutdatedAttempt(await fetchLastQuizAttempt(MATERIAL))).toBe(true);
  });
});
