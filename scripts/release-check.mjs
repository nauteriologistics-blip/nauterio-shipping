import { existsSync, readdirSync, readFileSync } from "node:fs";

const requiredFiles = [
  "render.yaml",
  "pnpm-lock.yaml",
  "packages/database/prisma/schema.prisma",
  "packages/integrations/src/messaging/resend-messaging-adapter.ts",
  "docs/implementation/phase-6-launch-integrations.md",
  "docs/implementation/phase-7-secure-documents.md",
  "docs/implementation/phase-8-document-operations.md",
  "docs/implementation/phase-9-release-acceptance.md",
  "docs/implementation/phase-10-controlled-pilot.md",
  "scripts/pilot-daily-report.mjs",
  "scripts/security-check.mjs",
  "scripts/load-smoke.mjs",
  "scripts/acceptance-production.mjs",
  "packages/integrations/src/storage/s3-compatible-storage.ts",
];
const failures = requiredFiles.filter((file) => !existsSync(file)).map((file) => `Missing ${file}`);

const migrations = readdirSync("packages/database/prisma/migrations", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
for (const expected of [
  "20260817120000_package_public_number",
  "20260817123000_mvp_request_status",
  "20260817130000_shipment_request_review",
  "20260817140000_notification_read_state",
  "20260817150000_revocable_auth_sessions",
  "20260817160000_document_review_workflow",
  "20260817170000_controlled_pilot",
]) {
  if (!migrations.includes(expected)) failures.push(`Missing migration ${expected}`);
}

const blueprint = readFileSync("render.yaml", "utf8");
for (const required of ["healthCheckPath: /v1/health", "LOCAL_AUTH_MODE", "DATABASE_URL", "REDIS_URL", "EMAIL_PROVIDER", "RESEND_API_KEY", "EMAIL_FROM", "OBJECT_STORAGE_ENDPOINT", "MALWARE_SCANNER_URL", "PILOT_MODE", "PILOT_ALLOWED_EMAILS"]) {
  if (!blueprint.includes(required)) failures.push(`Render Blueprint is missing ${required}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Release structure valid: ${migrations.length} migrations found.`);
