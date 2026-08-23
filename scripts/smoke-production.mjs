const targets = [
  ["API liveness", process.env.NAUTERIO_API_URL, "/v1/health", 200],
  ["API no-index keepalive healthz", process.env.NAUTERIO_API_URL, "/v1/healthz", 204],
  ["API readiness", process.env.NAUTERIO_API_URL, "/v1/health/ready", 200],
  ["Customer website", process.env.NAUTERIO_WEB_URL, "/", 200],
  ["Customer sign-in", process.env.NAUTERIO_WEB_URL, "/signin", 200],
  ["Admin website", process.env.NAUTERIO_ADMIN_URL, "/login", 200],
  ["API docs disabled", process.env.NAUTERIO_API_URL, "/docs", 404],
  ["Protected profile rejects anonymous access", process.env.NAUTERIO_API_URL, "/v1/me", 401],
];

const missing = targets.filter(([, origin]) => !origin).map(([name]) => name);
if (missing.length) {
  console.error(`Missing deployment origins for: ${missing.join(", ")}`);
  process.exit(1);
}

let failed = false;
for (const [name, origin, path, expected] of targets) {
  const url = new URL(path, origin);
  try {
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(10_000) });
    const ok = response.status === expected;
    console.log(`${ok ? "PASS" : "FAIL"} ${name}: ${response.status} ${url}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.error(`FAIL ${name}: ${url} (${error instanceof Error ? error.message : String(error)})`);
  }
}
if (failed) process.exit(1);
