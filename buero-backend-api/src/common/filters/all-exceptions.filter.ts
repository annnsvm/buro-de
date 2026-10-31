import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";

export type ApiErrorBody = {
  statusCode: number;
  error: string;
  message: string | string[] | Record<string, unknown>;
  timestamp: string;
  path: string;
  stack?: string;
};

/**
 * Єдиний формат JSON для помилок API. HttpException - з винятку; інше - 500;
 * у production без stack і без внутрішніх повідомлень для клієнта.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter<unknown> {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly isProduction: boolean) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const path = req.url ?? req.originalUrl ?? "";
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const { error, message } = this.parseHttpException(exception);
      const body: ApiErrorBody = {
        statusCode,
        error,
        message,
        timestamp,
        path,
      };

      this.logHttpException(statusCode, req, exception, message);

      res.status(statusCode).json(body);
      return;
    }

    /**
     * The body parsers refuse a request before any route runs, so what they throw is never an
     * HttpException and used to fall through to a bare 500 - "Internal Server Error" in
     * development and nothing at all in production.
     *
     * A CSV a kilobyte over the limit is the commonest case, and the one where a plain 500
     * costs the most: there is nothing in that answer, or in the log, to connect it to the
     * size of the file the author just chose.
     */
    const refused = parseBodyParserError(exception);
    if (refused) {
      const body: ApiErrorBody = {
        statusCode: refused.statusCode,
        error: this.defaultErrorLabel(refused.statusCode),
        message: refused.message,
        timestamp,
        path,
      };
      this.logger.warn(`${req.method} ${path} ${refused.statusCode} - ${refused.message}`);
      res.status(refused.statusCode).json(body);
      return;
    }

    const err = exception instanceof Error ? exception : new Error(String(exception));
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const body: ApiErrorBody = {
      statusCode,
      error: "Internal Server Error",
      message: this.isProduction ? "Internal server error" : err.message,
      timestamp,
      path,
    };
    if (!this.isProduction && err.stack) {
      body.stack = err.stack;
    }

    this.logger.error(
      `${req.method} ${path} ${statusCode} - ${err.message}`,
      err.stack,
    );

    res.status(statusCode).json(body);
  }

  private parseHttpException(exception: HttpException): {
    error: string;
    message: string | string[] | Record<string, unknown>;
  } {
    const statusCode = exception.getStatus();
    const raw = exception.getResponse();

    if (typeof raw === "string") {
      return {
        error: this.defaultErrorLabel(statusCode),
        message: raw,
      };
    }

    if (typeof raw === "object" && raw !== null) {
      const o = raw as Record<string, unknown>;
      const error =
        typeof o.error === "string" ? o.error : this.defaultErrorLabel(statusCode);

      let message: string | string[] | Record<string, unknown>;
      if (Array.isArray(o.message)) {
        message = o.message as string[];
      } else if (typeof o.message === "string") {
        message = o.message;
      } else if (o.message !== undefined && typeof o.message === "object") {
        message = o.message as Record<string, unknown>;
      } else {
        message = exception.message;
      }

      return { error, message };
    }

    return {
      error: this.defaultErrorLabel(statusCode),
      message: exception.message,
    };
  }

  private defaultErrorLabel(statusCode: number): string {
    const key = HttpStatus[statusCode];
    if (typeof key === "string" && key.includes("_")) {
      return key
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
    }
    return "Error";
  }

  private logHttpException(
    statusCode: number,
    req: Request,
    exception: HttpException,
    message: string | string[] | Record<string, unknown>,
  ): void {
    const path = req.url ?? req.originalUrl ?? "";
    const summary = `${req.method} ${path} ${statusCode}`;
    const msgPreview =
      typeof message === "string"
        ? message
        : JSON.stringify(message).slice(0, 500);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${summary} - ${msgPreview}`,
        exception.stack,
      );
      return;
    }

    if (statusCode >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(`${summary} - ${msgPreview}`);
    }
  }
}

/** Megabytes, to one decimal, for a message a person reads rather than a byte count. */
const inMegabytes = (bytes: number): string =>
  `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} МБ`;

/**
 * An error thrown by `express.json` and friends, read back into an answer.
 *
 * body-parser puts the HTTP status it means on the error itself and names the reason in
 * `type`. Both are honoured here: the status so the answer is not a 500, and the type so the
 * sentence says which of the three things went wrong.
 */
export const parseBodyParserError = (
  exception: unknown,
): { statusCode: number; message: string } | null => {
  if (typeof exception !== "object" || exception === null) return null;
  const o = exception as {
    type?: unknown;
    status?: unknown;
    statusCode?: unknown;
    limit?: unknown;
    length?: unknown;
  };
  const status =
    typeof o.status === "number"
      ? o.status
      : typeof o.statusCode === "number"
        ? o.statusCode
        : null;
  if (status === null || typeof o.type !== "string" || !o.type.startsWith("entity.")) {
    return null;
  }

  if (o.type === "entity.too.large") {
    const limit = typeof o.limit === "number" ? inMegabytes(o.limit) : null;
    const length = typeof o.length === "number" ? inMegabytes(o.length) : null;
    return {
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
      message:
        "Файл завеликий" +
        (length ? `: ${length}` : "") +
        (limit ? `, а максимум ${limit}` : "") +
        ". Розділіть його на частини й завантажте по одній.",
    };
  }

  return {
    statusCode: HttpStatus.BAD_REQUEST,
    message: "Не вдалося прочитати тіло запиту - перевірте формат файлу.",
  };
};
