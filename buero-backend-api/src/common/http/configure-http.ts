import { json, text, urlencoded } from "express";

/** Just the two methods this needs, so it can be driven by a stub in a test. */
export type HttpTarget = {
  enableCors: (options: Record<string, unknown>) => void;
  use: (...handlers: unknown[]) => void;
};

/**
 * How large a JSON body may be.
 *
 * Express's own default is 100 kB, which is ample for every request this application makes
 * but one: importing a module's questions sends the whole CSV - reading texts, transcripts and
 * all - in a single JSON field. A real module file passes 100 kB easily.
 */
export const DEFAULT_JSON_LIMIT = "1mb";
export const IMPORT_JSON_LIMIT = "10mb";

/**
 * The paths that carry an authored file rather than a form.
 *
 * Scoped rather than global on purpose: the import needs room, and nothing else should get it
 * just because the import does. Everything under here is behind a teacher's token.
 */
export const LARGE_BODY_PATHS = ["/api/courses"];

/**
 * CORS and the body parsers, in that order.
 *
 * The order is the entire point. A body-parser rejection is answered before any route runs, so
 * if CORS is registered afterwards that answer carries no `Access-Control-Allow-Origin` header
 * - and a browser does not report such a response as the 413 it is. It reports a network
 * failure. An author uploading a CSV one kilobyte over the limit was told only
 * "Network Error", with nothing on screen or in the log to connect that to the size of her
 * file.
 */
export const configureHttp = (app: HttpTarget, allowedOrigins: string[]) => {
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  /**
   * First match wins: body-parser marks the request as read, so the general limit below leaves
   * an already-parsed import body alone.
   */
  for (const path of LARGE_BODY_PATHS) {
    app.use(path, json({ limit: IMPORT_JSON_LIMIT }));
  }

  // WayForPay шле callback то як JSON, то як form-urlencoded, то як text/plain
  app.use(json({ limit: DEFAULT_JSON_LIMIT }));
  app.use(urlencoded({ extended: true, limit: DEFAULT_JSON_LIMIT }));
  app.use(text({ type: "text/plain", limit: DEFAULT_JSON_LIMIT }));
};
