import { describe, expect, it, vi } from 'vitest';
import { stripJsonContentType } from '@/api/multipart';

/**
 * The header that has to be absent for a file upload to arrive.
 *
 * The shared axios instance sets `Content-Type: application/json` on everything. On a FormData
 * body that is not merely wrong but destructive: without the browser's own
 * `multipart/form-data` header and its boundary, the server parses no parts at all and reports
 * that no file was sent - for a request that carried one. This went unnoticed because the
 * uploads that already worked each carried a private copy of this workaround.
 */
describe('sending a file through the shared axios instance', () => {
  const run = (headers: { delete?: (key: string) => void }) =>
    stripJsonContentType[0]('body', headers);

  it('removes the JSON content type so the browser can set its own', () => {
    const remove = vi.fn();
    run({ delete: remove });
    expect(remove).toHaveBeenCalledWith('Content-Type');
  });

  it('passes the body through untouched', () => {
    expect(run({ delete: vi.fn() })).toBe('body');
  });

  /** Older axios versions hand over a plain object; it must not throw there. */
  it('does nothing when the headers cannot be edited', () => {
    expect(() => run({})).not.toThrow();
  });
});
