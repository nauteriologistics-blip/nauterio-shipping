import pino, { type Logger as PinoLogger } from "pino";
import { randomUUID } from "node:crypto";

export type { PinoLogger };

/**
 * Structured JSON logger factory (ADR 0001 section 10). Every log line
 * carries environment and service - callers must not bypass this by calling
 * console.log directly (CLAUDE.md: never log secrets/PII; safe identifiers
 * only).
 *
 * REL-011: `correlationId` was previously required at creation time, which
 * doesn't fit a per-request value - a caller would need a new logger
 * instance per request. It's optional here; call `.child({ correlationId })`
 * on the returned logger at the point a request's correlation ID is known,
 * which is the normal pino pattern for per-request context on a
 * process-lifetime base logger.
 */
export interface LoggerContext {
  service: string;
  environment: string;
}

export function createLogger(context: LoggerContext): PinoLogger {
  return pino({
    base: {
      service: context.service,
      environment: context.environment,
    },
    redact: ["req.headers.authorization", "*.password", "*.token", "*.secret"],
  });
}

export function newCorrelationId(): string {
  return randomUUID();
}

/**
 * REL-011: bridges a pino logger into Nest's own `LoggerService` interface,
 * so `app.useLogger(...)` routes Nest's OWN internal framework logs (route
 * mapping, lifecycle events, etc.) through the same structured JSON output
 * as every application-level log call - previously these were two
 * disconnected systems (Nest's plain-text built-in `Logger` vs. this
 * package's pino factory, which nothing actually called).
 */
export class NestPinoLoggerAdapter {
  constructor(private readonly logger: PinoLogger) {}

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.info({ context: lastContext(optionalParams) }, String(message));
  }
  error(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.error({ context: lastContext(optionalParams), trace: optionalParams[0] }, String(message));
  }
  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.warn({ context: lastContext(optionalParams) }, String(message));
  }
  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.debug({ context: lastContext(optionalParams) }, String(message));
  }
  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.trace({ context: lastContext(optionalParams) }, String(message));
  }
}

// Nest's LoggerService methods receive a variadic tail where the last
// argument is conventionally the calling class/context name - pino wants it
// as a structured field, not appended to the message string.
function lastContext(optionalParams: unknown[]): unknown {
  return optionalParams.length > 0 ? optionalParams[optionalParams.length - 1] : undefined;
}
