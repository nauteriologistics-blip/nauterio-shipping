import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { Request, Response } from "express";

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

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = String(request.headers["x-correlation-id"] ?? "unknown");

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "INTERNAL_ERROR";
    let message = "An unexpected error occurred.";
    let fieldErrors: Record<string, string[]> | undefined;

    // Every 5xx is logged server-side with correlation ID (spec section 34.1
    // telemetry requirement) - the client response never gets this detail,
    // but it must never be silently swallowed either.
    if (!(exception instanceof HttpException) || exception.getStatus() >= 500) {
      this.logger.error(
        `Unhandled exception [correlationId=${correlationId}]: ${
          exception instanceof Error ? exception.stack : String(exception)
        }`
      );
    }

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
    }

    const structured: StructuredError = {
      code,
      message,
      fieldErrors,
      correlationId,
      retryable: status >= 500,
    };

    response.status(status).json(structured);
  }
}
