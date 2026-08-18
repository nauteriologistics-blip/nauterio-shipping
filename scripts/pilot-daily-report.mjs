const origin = process.env.NAUTERIO_API_URL;
const token = process.env.ACCEPTANCE_STAFF_TOKEN;
if (!origin || !token) { console.error("NAUTERIO_API_URL and ACCEPTANCE_STAFF_TOKEN are required"); process.exit(1); }
async function get(path) { const response = await fetch(new URL(path, origin), { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) }); if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`); return response.json(); }
const [summary, issues] = await Promise.all([get("/v1/admin/pilot/summary"), get("/v1/admin/pilot/issues?status=OPEN")]);
const report = { reportDate: new Date().toISOString().slice(0, 10), generatedAt: new Date().toISOString(), summary, openIssues: issues };
console.log(JSON.stringify(report, null, 2));
if (summary.criticalIssues > 0 || summary.failedEvents > 0) process.exitCode = 2;
