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
  LOCAL_AUTH_MODE: z.coerce.boolean().default(true),
  CORRELATION_ID_HEADER: z.string().default("x-correlation-id"),
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
