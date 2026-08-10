import { z } from "zod";

/**
 * Typed environment configuration that fails fast on missing/invalid values
 * (ADR 0001 section 3.1). Import `loadApiConfig()` once at process start in
 * apps/api and apps/worker - never read `process.env` directly elsewhere.
 */
const apiConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),
  COGNITO_USER_POOL_ID: z.string().optional(),
  COGNITO_CLIENT_ID: z.string().optional(),
  COGNITO_REGION: z.string().optional(),
  // SEC-007: z.coerce.boolean() cannot express `false` for a string env var
  // - Boolean("false") is `true` in JS, so LOCAL_AUTH_MODE=false would have
  // silently stayed enabled. An explicit string enum has no such trap.
  LOCAL_AUTH_MODE: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  CORRELATION_ID_HEADER: z.string().default("x-correlation-id"),
  // SEC-007 residual: Swagger was gated on `NODE_ENV !== "production"`, so
  // it still served in `staging`. A dedicated flag, defaulting off, means a
  // `staging` deployment must opt in explicitly rather than getting docs
  // (and the full route/DTO inventory) by default.
  ENABLE_API_DOCS: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  // SEC-008/REL-004: the throttler's default storage is an in-process Map,
  // so each ECS task counts independently and the effective rate limit
  // multiplies by task count. Optional because no Redis/Valkey instance
  // exists in every environment (e.g. local dev) - falls back to the
  // in-memory default when unset, which is correct for a single process but
  // must be set in any multi-instance deployment.
  REDIS_URL: z.string().optional(),
  // Customer registration (spec 27.1): base URL of apps/web, used to build
  // the email-verification link. Real email delivery is not wired (no SES
  // identity configured in this environment) - in non-production, the
  // register endpoint returns this link directly in its response instead
  // of sending it, so the flow is testable without SES.
  WEB_APP_URL: z.string().default("http://localhost:3000"),
});

export type ApiConfig = z.infer<typeof apiConfigSchema>;

export function loadApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const result = apiConfigSchema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  return result.data;
}
