import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

/** Reads the correlation ID that CorrelationIdInterceptor already
 * generated/propagated onto the request (see main.ts) - same header name
 * AllExceptionsFilter reads for error logs, so a request's audit events and
 * its error logs (if any) can be joined on this value. */
export const CorrelationId = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return String(req.headers["x-correlation-id"] ?? "unknown");
});
