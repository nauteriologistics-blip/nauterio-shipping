import { createLogger } from "@nauterio/observability";

/** REL-011: single process-lifetime pino logger for the worker, replacing
 * the bare `console.log`/`console.error` calls scattered across its jobs
 * and queue adapter - structured JSON output, same shape as the API's. */
export const workerLogger = createLogger({
  service: "worker",
  environment: process.env.NODE_ENV ?? "development",
});
