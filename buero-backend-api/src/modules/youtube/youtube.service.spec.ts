import { BadRequestException } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

/**
 * Filling the teacher's form from YouTube.
 *
 * The whole point of this is to save typing, so nothing here may ever stop the form working: a
 * video that does not exist, a YouTube that is slow or down, a reply in a shape we did not
 * expect — each has to come back as "nothing found" rather than as an error.
 */
describe('YoutubeService', () => {
  let service: YoutubeService;
  let fetchMock: jest.Mock;

  const VALID_ID = 'dQw4w9WgXcQ';

  beforeEach(() => {
    service = new YoutubeService();
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  const replyWith = (body: unknown, ok = true) =>
    fetchMock.mockResolvedValue({ ok, json: () => Promise.resolve(body) });

  describe('a video that exists', () => {
    it('returns its title and thumbnail', async () => {
      replyWith({
        title: 'Deutsch A2.1 — Lektion 1',
        thumbnail_url: 'https://i.ytimg.com/vi/x/hqdefault.jpg',
        author_name: 'Büro.de',
      });

      await expect(service.getPreview(VALID_ID)).resolves.toEqual({
        found: true,
        title: 'Deutsch A2.1 — Lektion 1',
        thumbnailUrl: 'https://i.ytimg.com/vi/x/hqdefault.jpg',
        authorName: 'Büro.de',
      });
    });

    it('asks YouTube for that exact video', async () => {
      replyWith({ title: 'x' });
      await service.getPreview(VALID_ID);

      expect(String(fetchMock.mock.calls[0][0])).toContain(
        encodeURIComponent(`https://www.youtube.com/watch?v=${VALID_ID}`),
      );
    });
  });

  describe('refusing an id that is not one', () => {
    /** Checked before the request, so a malformed id never becomes an outbound call. */
    it.each(['', 'short', 'way-too-long-to-be-an-id', 'has spaces', '../../etc'])(
      'rejects %p without calling out',
      async (id) => {
        await expect(service.getPreview(id)).rejects.toBeInstanceOf(BadRequestException);
        expect(fetchMock).not.toHaveBeenCalled();
      },
    );

    it('accepts the eleven characters a real id is made of', async () => {
      replyWith({ title: 'x' });
      await expect(service.getPreview('a-B_1234567')).resolves.toMatchObject({
        found: true,
      });
    });
  });

  describe('when YouTube cannot help', () => {
    it('says nothing was found for a video that is not public', async () => {
      replyWith({}, false);
      await expect(service.getPreview(VALID_ID)).resolves.toMatchObject({ found: false });
    });

    /** The form must keep working when YouTube does not: the teacher can always type it. */
    it('says nothing was found when the request fails', async () => {
      fetchMock.mockRejectedValue(new Error('network down'));
      await expect(service.getPreview(VALID_ID)).resolves.toEqual({
        found: false,
        title: null,
        thumbnailUrl: null,
      });
    });

    it('does not trust the shape of what comes back', async () => {
      replyWith({ title: 42, thumbnail_url: null });
      await expect(service.getPreview(VALID_ID)).resolves.toMatchObject({
        found: true,
        title: null,
        thumbnailUrl: null,
      });
    });
  });
});
