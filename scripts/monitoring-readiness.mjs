const requiredEnv = [
  "NAUTERIO_API_URL",
  "NAUTERIO_WEB_URL",
  "NAUTERIO_ADMIN_URL",
  "ACCEPTANCE_STAFF_TOKEN",
  "DATABASE_RESTORE_EVIDENCE_URL",
  "RENDER_LOGS_EVIDENCE_URL",
  "NEON_BACKUP_EVIDENCE_URL",
  "UPSTASH_METRICS_EVIDENCE_URL",
];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing readiness evidence variables: ${missing.join(", ")}`);
  process.exit(1);
}

const checks = [
  ["API health", process.env.NAUTERIO_API_URL, "/v1/health", 200],
  ["API no-index healthz", process.env.NAUTERIO_API_URL, "/v1/healthz", 204],
  ["Customer web", process.env.NAUTERIO_WEB_URL, "/", 200],
  ["Admin web", process.env.NAUTERIO_ADMIN_URL, "/login", 200],
];

let failed = false;
for (const [name, origin, path, expected] of checks) {
  try {
    const response = await fetch(new URL(path, origin), { redirect: "manual", signal: AbortSignal.timeout(10_000) });
    const ok = response.status === expected;
    console.log(`${ok ? "PASS" : "FAIL"} ${name}: HTTP ${response.status}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.error(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) process.exit(1);
