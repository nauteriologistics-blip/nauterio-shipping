import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { newCorrelationId } from "@nauterio/observability";
import type { Request, Response } from "express";

declare module "express" {
  interface Request {
    // SEC-014: the one trusted, validated correlation ID for this request -
    // set once here, read everywhere else (CorrelationId decorator,
    // AllExceptionsFilter) instead of each consumer re-reading the raw
    // header under its own hard-coded literal.
    correlationId?: string;
  }
}

// SEC-014: an inbound x-correlation-id of any length/content was accepted
// verbatim and later persisted into audit_events, a table an append-only
// trigger makes permanent - a poisoned value could never be corrected. This
// mirrors newCorrelationId()'s own UUID shape but is intentionally a bit
// more permissive (allows caller-supplied non-UUID trace IDs from a
// partner's own tracing system), while still rejecting anything that could
// carry log-injection payloads or blow past a reasonable column width.
const VALID_CORRELATION_ID = /^[A-Za-z0-9._-]{1,64}$/;

/**
 * Accepts/generates a correlation ID and returns it in the response headers
 * (spec section 26.1). Every log line for this request should include it -
 * see AllExceptionsFilter and packages/observability's logger.
 */
@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  constructor(private readonly headerName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const incoming = req.headers[this.headerName.toLowerCase()];
    const candidate = Array.isArray(incoming) ? incoming[0] : incoming;
    const correlationId = candidate && VALID_CORRELATION_ID.test(candidate) ? candidate : newCorrelationId();

    req.correlationId = correlationId;
    res.setHeader(this.headerName, correlationId);

    return next.handle().pipe(tap());
  }
}
