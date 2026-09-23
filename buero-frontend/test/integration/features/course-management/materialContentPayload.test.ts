import { describe, expect, it } from 'vitest';

import { materialContentPayload } from '@/features/course-managment/domain/materialContentPayload';
import { quizMaterialSettings } from '@/features/course-managment/domain/quizMaterialSettings';

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

  /**
   * A quiz's questions live in their own table. Writing an empty `questions` array here
   * would overwrite them, which is how renaming an imported quiz once destroyed it.
   */
  it('writes no questions into a quiz material', () => {
    expect(
      materialContentPayload({
        type: 'quiz',
        title: 'Quiz 1',
        quizMode: 'practice',
        passingScore: null,
      }),
    ).toEqual({});
  });
});

describe('quizMaterialSettings', () => {
  it('sends a threshold with a module test', () => {
    expect(
      quizMaterialSettings({
        type: 'quiz',
        title: 'Module 4 test',
        quizMode: 'test',
        passingScore: 60,
      }),
    ).toEqual({ quiz_mode: 'test', passing_score: 60 });
  });

  it('clears the threshold on a lesson quiz, which has nothing to fail', () => {
    expect(
      quizMaterialSettings({
        type: 'quiz',
        title: 'Lesson 4.1',
        quizMode: 'practice',
        passingScore: null,
      }),
    ).toEqual({ quiz_mode: 'practice', passing_score: null });
  });

  it('says nothing about a video', () => {
    expect(
      quizMaterialSettings({
        type: 'video',
        title: 'Lesson 1',
        youtubeVideoId: 'abc',
        youtubeVideoDuration: '212',
      }),
    ).toEqual({});
  });
});
