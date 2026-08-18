const origin = process.env.NAUTERIO_API_URL;
const requests = Number(process.env.SMOKE_REQUESTS ?? 40);
const concurrency = Number(process.env.SMOKE_CONCURRENCY ?? 10);
const p95LimitMs = Number(process.env.SMOKE_P95_LIMIT_MS ?? 2000);
if (!origin) { console.error("NAUTERIO_API_URL is required"); process.exit(1); }
const durations = []; let failures = 0; let next = 0;
async function worker() { while (next < requests) { next += 1; const started = performance.now(); try { const response = await fetch(new URL("/v1/health", origin), { signal: AbortSignal.timeout(5000) }); if (!response.ok) failures += 1; } catch { failures += 1; } durations.push(performance.now() - started); } }
await Promise.all(Array.from({ length: Math.min(concurrency, requests) }, () => worker()));
durations.sort((a, b) => a - b); const p95 = durations[Math.max(0, Math.ceil(durations.length * 0.95) - 1)];
console.log(`Load smoke: requests=${requests} failures=${failures} p95=${p95.toFixed(1)}ms limit=${p95LimitMs}ms`);
if (failures || p95 > p95LimitMs) process.exit(1);
