const origin = process.env.NAUTERIO_API_URL;
const token = process.env.ACCEPTANCE_STAFF_TOKEN;

if (!origin || !token) {
  console.error("NAUTERIO_API_URL and ACCEPTANCE_STAFF_TOKEN are required");
  process.exit(1);
}

let failed = false;

async function get(path) {
  const response = await fetch(new URL(path, origin), {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return body;
}

try {
  const summary = await get("/v1/admin/pilot/summary");
  const checks = [
    ["failed outbox events", summary.failedEvents === 0, summary.failedEvents],
    ["critical operational issues", summary.criticalIssues === 0, summary.criticalIssues],
    ["document scan count field", typeof summary.documentsScanning === "number", summary.documentsScanning],
    ["oldest pending outbox age under 10 minutes", summary.oldestPendingEventSeconds <= 600, summary.oldestPendingEventSeconds],
  ];
  for (const [name, ok, value] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"} ${name}: ${value}`);
    if (!ok) failed = true;
  }
} catch (error) {
  failed = true;
  console.error(`FAIL worker readiness: ${error instanceof Error ? error.message : String(error)}`);
}

if (failed) process.exit(1);
