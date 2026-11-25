import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import LessonVideoMissing from '@/features/course-learning/MaterialWindow/LessonVideoMissing';
import { buildLearningLessonFromMaterial } from '@/pages/CoursePage/coursePageMappers';
import type { ApiCourseMaterial } from '@/pages/CoursePage/coursePageMappers';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What a student meets when the author has made a video lesson but not linked the video yet.
 *
 * It used to be Rick Astley. `buildLearningLessonFromMaterial` finished with
 * `videoUrl: embed || 'https://www.youtube.com/embed/dQw4w9WgXcQ'`, so a lesson saved
 * without its link played a hard-coded video instead - and because something played, the
 * lesson looked finished to the student and raised nothing anywhere for the author.
 *
 * A lesson written before its recording exists is the normal shape of a course being made,
 * the same way a listening task arrives before its mp3. It just has to say so.
 */
beforeAll(async () => {
  await i18nReady;
});

const videoMaterial = (content: unknown): ApiCourseMaterial =>
  ({
    id: 'm1',
    title: 'Deine ersten Wörter',
    type: 'video',
    orderIndex: 0,
    content,
  }) as unknown as ApiCourseMaterial;

describe('a video lesson with no link yet', () => {
  it('carries no video at all, rather than a stand-in', () => {
    const lesson = buildLearningLessonFromMaterial('A1', videoMaterial({}), 0, 10);

    expect(lesson.videoUrl).toBe('');
  });

  it('carries no video when the content is missing entirely', () => {
    const lesson = buildLearningLessonFromMaterial('A1', videoMaterial(null), 0, 10);

    expect(lesson.videoUrl).toBe('');
  });

  it('carries no video when the id is only whitespace', () => {
    const lesson = buildLearningLessonFromMaterial(
      'A1',
      videoMaterial({ youtube_video_id: '   ' }),
      0,
      10,
    );

    expect(lesson.videoUrl).toBe('');
  });

  /** And still builds the embed when the link is there, which is the whole point. */
  it('still builds the embed when the lesson has its link', () => {
    const lesson = buildLearningLessonFromMaterial(
      'A1',
      videoMaterial({ youtube_video_id: 'abcdefghijk' }),
      0,
      10,
    );

    expect(lesson.videoUrl).toBe('https://www.youtube.com/embed/abcdefghijk');
  });

  it('tells the student the video is not there yet', () => {
    renderWithProviders(<LessonVideoMissing />);

    expect(screen.getByTestId('video-missing')).toBeInTheDocument();
    expect(screen.getByText(/відео ще не додано/)).toBeInTheDocument();
  });

  /** Not "something went wrong": nothing did, the recording is simply still coming. */
  it('reads as unfinished rather than broken', () => {
    renderWithProviders(<LessonVideoMissing />);

    expect(screen.getByText(/з’явиться незабаром/)).toBeInTheDocument();
  });
});

/**
 * The guard that would have caught the original.
 *
 * A stand-in video id is the kind of thing that goes in while something is being wired up
 * and then stays, because everything looks like it works. Nothing else in these tests would
 * notice it coming back somewhere new - a different mapper, a default prop, a storybook
 * fixture - so the source itself is checked.
 */
describe('no hard-coded video anywhere in the app', () => {
  const sourceFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      return /\.(ts|tsx)$/.test(entry) ? [path] : [];
    });

  it('never falls back to a fixed YouTube id', () => {
    const offenders = sourceFiles('src').filter((path) =>
      readFileSync(path, 'utf8').includes('dQw4w9WgXcQ'),
    );

    expect(offenders).toEqual([]);
  });
});
