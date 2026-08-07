import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { newCorrelationId } from "@nauterio/observability";
import type { Request, Response } from "express";

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
    const correlationId = (Array.isArray(incoming) ? incoming[0] : incoming) || newCorrelationId();
    req.headers[this.headerName.toLowerCase()] = correlationId;
    res.setHeader(this.headerName, correlationId);

    return next.handle().pipe(tap());
  }
}
