import type { ArgumentsHost } from "@nestjs/common";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { Request, Response } from "express";
import { AllExceptionsFilter } from "./all-exceptions.filter";
import { AUTH_ERROR, notFound } from "../../modules/auth/auth-error-codes";

/**
 * The link between a named failure and a client that can read the name.
 *
 * The services throw exceptions carrying a `code`, and the frontend decides what to say
 * from that code - but nothing in between was tested, and the filter is where it would be
 * lost: it rebuilds the response body field by field, so a field it does not know about is
 * silently dropped. A code that never arrives looks exactly like a code that was never
 * thrown, and the screen falls back to its generic sentence without anything going wrong
 * anywhere that could be seen.
 */
const answer = () => {
  const json = jest.fn();
  const res = { status: jest.fn().mockReturnValue({ json }), json } as unknown as Response;
  const host = {
    switchToHttp: () => ({
      getResponse: () => res,
      getRequest: () => ({ url: "/api/auth/login", method: "POST" }) as Request,
    }),
  } as unknown as ArgumentsHost;
  return { host, body: () => json.mock.calls[0]?.[0] as Record<string, unknown> };
};

describe("AllExceptionsFilter and the error code", () => {
  const filter = new AllExceptionsFilter(true);

  it("puts the thrown code in the response body", () => {
    const { host, body } = answer();

    filter.catch(
      notFound(AUTH_ERROR.accountNotFound, "No account uses this email address"),
      host,
    );

    expect(body()).toMatchObject({
      statusCode: 404,
      code: "ACCOUNT_NOT_FOUND",
      message: "No account uses this email address",
    });
  });

  /** Most of the API throws without a code, and those answers must not grow an empty one. */
  it("leaves the field off an exception that carries no code", () => {
    const { host, body } = answer();

    filter.catch(new BadRequestException("Something unrelated"), host);

    expect(body()).not.toHaveProperty("code");
  });

  it("ignores a code that is not a string", () => {
    const { host, body } = answer();

    filter.catch(new BadRequestException({ code: 42, message: "odd" }), host);

    expect(body()).not.toHaveProperty("code");
  });

  /** The validation pipe's own refusal: an array of sentences, and one name for all of them. */
  it("carries a code alongside a list of messages", () => {
    const { host, body } = answer();

    filter.catch(
      new BadRequestException({
        code: AUTH_ERROR.validationFailed,
        message: ["Password must be at least 9 characters"],
      }),
      host,
    );

    expect(body()).toMatchObject({
      code: "VALIDATION_FAILED",
      message: ["Password must be at least 9 characters"],
    });
  });

  it("keeps working for an exception thrown the plain way", () => {
    const { host, body } = answer();

    filter.catch(new NotFoundException("Course not found"), host);

    expect(body()).toMatchObject({ statusCode: 404, message: "Course not found" });
  });
});
