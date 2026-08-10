import { createLogger } from "@nauterio/observability";

/**
 * REL-011: single process-lifetime pino logger for the API - `main.ts`
 * wires it into Nest's own logging via `NestPinoLoggerAdapter`, and
 * individual call sites that already have a request's correlation ID
 * (`AllExceptionsFilter`, `IdempotencyInterceptor`) call `.child({
 * correlationId })` on it rather than each constructing their own logger.
 */
export const apiLogger = createLogger({
  service: "api",
  environment: process.env.NODE_ENV ?? "development",
});
