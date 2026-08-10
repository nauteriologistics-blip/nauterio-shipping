import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

/** Reads the correlation ID that CorrelationIdInterceptor already
 * validated/generated onto `req.correlationId` (see main.ts) - the same
 * trusted value AllExceptionsFilter reads for error logs, so a request's
 * audit events and its error logs (if any) can be joined on this value.
 * SEC-014: reading the interceptor's own validated field, rather than
 * re-reading the raw header under a hard-coded name here, means this can
 * never drift from a configurable header name and never returns an
 * unvalidated, attacker-controlled value. */
export const CorrelationId = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return req.correlationId ?? "unknown";
});
