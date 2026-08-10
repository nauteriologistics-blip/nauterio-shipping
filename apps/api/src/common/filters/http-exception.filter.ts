import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Prisma } from "@nauterio/database";
import type { Request, Response } from "express";
import { apiLogger } from "../../logger";

/**
 * Structured error shape from spec section 26.1: code, user-safe message,
 * field errors, correlation ID, retry guidance. `message` is written for
 * the API consumer, never a raw stack trace (CLAUDE.md: no unsafe casts;
 * error handling only at trust boundaries - this IS that boundary).
 */
interface StructuredError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId: string;
  retryable: boolean;
}

// DATA-016(b)/SEC-013: these are permanent client errors, not transient
// server failures - a well-behaved client honouring `retryable` would
// otherwise retry a request that can never succeed (and, per DATA-003,
// each retry churns an idempotency-record row). Mapped explicitly instead
// of falling through to the generic 500/retryable:true branch.
const PRISMA_ERROR_MAPPING: Record<string, { status: HttpStatus; message: string }> = {
  P2002: { status: HttpStatus.CONFLICT, message: "A record with this value already exists." },
  P2003: { status: HttpStatus.UNPROCESSABLE_ENTITY, message: "The request references a record that does not exist." },
  P2023: { status: HttpStatus.BAD_REQUEST, message: "The request contains a malformed identifier." },
  P2025: { status: HttpStatus.NOT_FOUND, message: "The requested record was not found." },
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = request.correlationId ?? "unknown";

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "INTERNAL_ERROR";
    let message = "An unexpected error occurred.";
    let fieldErrors: Record<string, string[]> | undefined;
    let retryable = true;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      code = HttpStatus[status] ?? "ERROR";
      if (typeof body === "string") {
        message = body;
      } else if (typeof body === "object" && body !== null) {
        const b = body as { message?: string | string[] };
        if (Array.isArray(b.message)) {
          message = "Validation failed.";
          fieldErrors = { _general: b.message };
        } else {
          message = b.message ?? message;
        }
      }
      retryable = status >= HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError && PRISMA_ERROR_MAPPING[exception.code]) {
      const mapped = PRISMA_ERROR_MAPPING[exception.code];
      status = mapped.status;
      code = HttpStatus[status] ?? "ERROR";
      message = mapped.message;
      retryable = false;
    }

    // Every 5xx is logged server-side with correlation ID (spec section 34.1
    // telemetry requirement) - the client response never gets this detail,
    // but it must never be silently swallowed either. A malformed ID or
    // other now-mapped client error no longer reaches this branch, so it no
    // longer floods the error log or an error-budget alert at ERROR level.
    // REL-011: structured JSON via pino (correlationId as a real field, the
    // stack as `err`), not an interpolated string a log processor can't
    // parse or filter on.
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      apiLogger.child({ correlationId }).error({ err: exception }, "Unhandled exception");
    }

    const structured: StructuredError = {
      code,
      message,
      fieldErrors,
      correlationId,
      retryable,
    };

    response.status(status).json(structured);
  }
}
