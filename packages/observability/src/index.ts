import pino from "pino";
import { randomUUID } from "node:crypto";

/**
 * Structured JSON logger factory (ADR 0001 section 10). Every log line
 * carries environment, service, and correlation ID - callers must not
 * bypass this by calling console.log directly (CLAUDE.md: never log
 * secrets/PII; safe identifiers only).
 */
export interface LoggerContext {
  service: string;
  environment: string;
  correlationId?: string;
}

export function createLogger(context: LoggerContext) {
  return pino({
    base: {
      service: context.service,
      environment: context.environment,
    },
    redact: ["req.headers.authorization", "*.password", "*.token", "*.secret"],
  }).child({ correlationId: context.correlationId });
}

export function newCorrelationId(): string {
  return randomUUID();
}
