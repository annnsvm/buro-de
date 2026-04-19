import { describe, expect, it } from 'vitest';

import { materialContentPayload } from '@/features/course-managment/domain/materialContentPayload';

describe('materialContentPayload', () => {
  it('maps video material to youtube fields', () => {
    expect(
      materialContentPayload({
        type: 'video',
        title: 'Lesson 1',
        youtubeVideoId: 'dQw4w9WgXcQ',
        youtubeVideoDuration: '212',
      }),
    ).toEqual({
      youtube_video_id: 'dQw4w9WgXcQ',
      duration: '212',
    });
  });

  it('maps quiz material to questions structure', () => {
    const out = materialContentPayload({
      type: 'quiz',
      title: 'Quiz 1',
      quizQuestions: [
        {
          id: '',
          question: '2+2?',
          answers: [
            { id: '', text: '4', isCorrect: true },
            { id: '', text: '5', isCorrect: false },
          ],
        },
      ],
    });
    expect(out).toHaveProperty('questions');
    const questions = out.questions as Array<Record<string, unknown>>;
    expect(questions).toHaveLength(1);
    expect(questions[0].text).toBe('2+2?');
    expect(questions[0].correct).toBeTruthy();
  });
});
