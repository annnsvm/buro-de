import { BadRequestException, Injectable, Logger } from '@nestjs/common';

/**
 * What YouTube can tell us about a video without an API key.
 *
 * Fetched here rather than in the browser because the oEmbed endpoint sends no CORS header, so a
 * page cannot read it directly. Going through the server also means the teacher's form does not
 * depend on YouTube's policy for a third-party origin staying as it is.
 *
 * Only the title and the thumbnail come back. Duration is not part of oEmbed and is read from
 * the player instead, which knows it once the video has loaded.
 */
@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);

  /** A video id is eleven characters of a fixed alphabet; anything else is not one. */
  private static readonly VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

  async getPreview(videoId: string) {
    if (!YoutubeService.VIDEO_ID.test(videoId)) {
      throw new BadRequestException('Некоректний ідентифікатор відео YouTube');
    }

    const url =
      'https://www.youtube.com/oembed?format=json&url=' +
      encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);

    /**
     * A short timeout on purpose: this fills in a form field the teacher can also type. Waiting
     * on YouTube is never worth blocking the form for.
     */
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        /** 401 and 404 both mean "no such public video", which is the teacher's problem to fix. */
        return { found: false as const, title: null, thumbnailUrl: null };
      }
      const data = (await response.json()) as {
        title?: unknown;
        thumbnail_url?: unknown;
        author_name?: unknown;
      };
      return {
        found: true as const,
        title: typeof data.title === 'string' ? data.title : null,
        thumbnailUrl:
          typeof data.thumbnail_url === 'string' ? data.thumbnail_url : null,
        authorName: typeof data.author_name === 'string' ? data.author_name : null,
      };
    } catch (error) {
      this.logger.warn(
        `YouTube preview failed for ${videoId}: ${error instanceof Error ? error.message : error}`,
      );
      /** Never an error to the caller: the teacher can always type the title themselves. */
      return { found: false as const, title: null, thumbnailUrl: null };
    } finally {
      clearTimeout(timeout);
    }
  }
}
