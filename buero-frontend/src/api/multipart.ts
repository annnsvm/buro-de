/**
 * Lets the browser set its own `Content-Type` for a file upload.
 *
 * The shared axios instance sends `application/json` on every request. For a `FormData` body
 * that header is actively wrong: the browser must write `multipart/form-data` together with the
 * boundary string that separates the parts, and nothing on the server can parse the body
 * without it. The upload then arrives looking empty, and the API answers "no file sent" for a
 * request that plainly carried one.
 *
 * Deleting the header rather than overwriting it is deliberate: axios fills in the correct one,
 * boundary and all, only when it finds none.
 */
export const stripJsonContentType = [
  (data: unknown, headers: { delete?: (key: string) => void }) => {
    if (headers && typeof headers.delete === 'function') {
      headers.delete('Content-Type');
    }
    return data;
  },
];
