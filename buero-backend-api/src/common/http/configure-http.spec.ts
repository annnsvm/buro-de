import {
  configureHttp,
  DEFAULT_JSON_LIMIT,
  IMPORT_JSON_LIMIT,
  LARGE_BODY_PATHS,
} from "./configure-http";

/**
 * Why the order of two lines in the bootstrap matters.
 *
 * Uploading a module's practice CSV failed with "Network Error" - nothing else, in the browser
 * or in the server log. Two separate mistakes made that one message:
 *
 * The CSV goes in a single JSON field, and Express's default body limit is 100 kB, which a real
 * module file passes easily. That part would merely have been a 413.
 *
 * But the body parsers were registered before CORS, and a body-parser rejection is answered
 * before any route runs - so the 413 went back without an `Access-Control-Allow-Origin`
 * header, and the browser refused to show it at all. The real cause, the size of the file, was
 * invisible from both ends.
 */
describe("the order of CORS and the body parsers", () => {
  const record = () => {
    const calls: Array<{ kind: "cors" | "use"; path?: string }> = [];
    return {
      calls,
      app: {
        enableCors: () => calls.push({ kind: "cors" }),
        use: (...handlers: unknown[]) =>
          calls.push({
            kind: "use",
            ...(typeof handlers[0] === "string" ? { path: handlers[0] } : {}),
          }),
      },
    };
  };

  /** The one fact that cannot be read off the bootstrap by eye. */
  it("opens CORS before any body is read", () => {
    const { app, calls } = record();
    configureHttp(app, ["http://localhost:5173"]);

    expect(calls[0].kind).toBe("cors");
    expect(calls.filter((call) => call.kind === "use").length).toBeGreaterThan(0);
  });

  it("passes the allowed origins through, and never reflects the request's own", () => {
    const options: Array<Record<string, unknown>> = [];
    configureHttp(
      { enableCors: (opts) => options.push(opts), use: () => {} },
      ["https://buero.de"],
    );

    expect(options[0].origin).toEqual(["https://buero.de"]);
    expect(options[0].origin).not.toBe(true);
    expect(options[0].credentials).toBe(true);
  });

  /** The import's own ceiling comes first, so the general one leaves its body alone. */
  it("gives the import its own limit before the general one", () => {
    const { app, calls } = record();
    configureHttp(app, []);

    const scoped = calls.findIndex((call) => call.path === LARGE_BODY_PATHS[0]);
    const general = calls.findIndex(
      (call) => call.kind === "use" && call.path === undefined,
    );
    expect(scoped).toBeGreaterThan(-1);
    expect(scoped).toBeLessThan(general);
  });

  /**
   * A module's CSV is the largest thing anyone sends, and it is the only thing that needs the
   * room. Raising the limit for every endpoint because of one would be a different mistake.
   */
  it("keeps the raised limit off every other endpoint", () => {
    expect(IMPORT_JSON_LIMIT).not.toBe(DEFAULT_JSON_LIMIT);
    expect(LARGE_BODY_PATHS.every((path) => path.startsWith("/api/"))).toBe(true);
  });
});
