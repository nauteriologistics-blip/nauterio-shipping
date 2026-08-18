const origin = process.env.NAUTERIO_API_URL;
const customerToken = process.env.ACCEPTANCE_CUSTOMER_TOKEN;
const staffToken = process.env.ACCEPTANCE_STAFF_TOKEN;
if (!origin || !customerToken || !staffToken) { console.error("NAUTERIO_API_URL, ACCEPTANCE_CUSTOMER_TOKEN, and ACCEPTANCE_STAFF_TOKEN are required"); process.exit(1); }

let failed = false;
async function check(name, path, token, validate = () => true) {
  try {
    const response = await fetch(new URL(path, origin), { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) });
    const body = await response.json().catch(() => null);
    const ok = response.ok && validate(body);
    console.log(`${ok ? "PASS" : "FAIL"} ${name}: HTTP ${response.status}`);
    if (!ok) failed = true;
  } catch (error) { failed = true; console.error(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`); }
}
await check("Customer identity", "/v1/me", customerToken, (body) => body?.staffRole == null);
await check("Customer document centre", "/v1/documents", customerToken, Array.isArray);
await check("Customer shipment dashboard", "/v1/shipments?limit=1", customerToken, (body) => Array.isArray(body?.items));
await check("Staff identity", "/v1/me", staffToken, (body) => typeof body?.staffRole === "string");
await check("Admin shipment requests", "/v1/bookings/admin/requests?status=SUBMITTED&limit=1", staffToken, (body) => Array.isArray(body?.items));
await check("Admin document queue", "/v1/admin/documents?status=PROCESSING", staffToken, Array.isArray);
await check("Pilot health summary", "/v1/admin/pilot/summary", staffToken, (body) => typeof body?.failedEvents === "number" && typeof body?.openIssues === "number");
if (failed) process.exit(1);
