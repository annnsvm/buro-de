import { HttpStatus } from "@nestjs/common";
import { parseBodyParserError } from "./all-exceptions.filter";

/**
 * What the author is told when a file is too large.
 *
 * The body parsers refuse a request before any route runs, so what they throw never reaches
 * the HttpException branch of the filter. It used to fall through to a bare 500: "Internal
 * Server Error" locally, and in production the message is hidden entirely - so the answer said
 * nothing, and the log said nothing, about the one fact that mattered.
 */
describe("an error thrown by the body parsers", () => {
  /** The shape body-parser actually throws, built the way it builds it. */
  const tooLarge = (limit: number, length: number) =>
    Object.assign(new Error("request entity too large"), {
      type: "entity.too.large",
      status: 413,
      statusCode: 413,
      limit,
      length,
    });

  it("answers a too-large body with 413, not 500", () => {
    const refused = parseBodyParserError(tooLarge(1024 * 1024, 3 * 1024 * 1024));
    expect(refused?.statusCode).toBe(HttpStatus.PAYLOAD_TOO_LARGE);
  });

  /** Both numbers, because "too large" without them leaves nothing to act on. */
  it("says how large the file is and how large it may be", () => {
    const refused = parseBodyParserError(tooLarge(10 * 1024 * 1024, 12 * 1024 * 1024));
    expect(refused?.message).toContain("12 МБ");
    expect(refused?.message).toContain("10 МБ");
  });

  it("reports an unreadable body as the client's 400", () => {
    const refused = parseBodyParserError(
      Object.assign(new Error("Unexpected token"), {
        type: "entity.parse.failed",
        status: 400,
      }),
    );
    expect(refused?.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  /**
   * Everything else must keep falling through to the 500 branch. Treating an ordinary bug as
   * a client error would hide it: a 500 is logged with its stack, a 400 is not.
   */
  it.each([
    ["a plain error", new Error("boom")],
    ["a Prisma failure", Object.assign(new Error("P2002"), { code: "P2002" })],
    ["something with a status but no type", Object.assign(new Error("x"), { status: 418 })],
    ["null", null],
    ["a string", "boom"],
  ])("leaves %s alone", (_name, exception) => {
    expect(parseBodyParserError(exception)).toBeNull();
  });
});
