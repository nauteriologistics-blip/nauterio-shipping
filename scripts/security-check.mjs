import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const failures = [];
const render = readFileSync("render.yaml", "utf8");
for (const required of ['LOCAL_AUTH_MODE\n        value: "false"', 'ENABLE_API_DOCS\n        value: "false"', "OBJECT_STORAGE_SECRET_ACCESS_KEY\n        sync: false", "MALWARE_SCANNER_TOKEN\n        sync: false"]) {
  if (!render.includes(required)) failures.push(`Missing production safeguard: ${required.split("\\n")[0]}`);
}
if (!render.includes('PILOT_MODE\n        value: "false"')) failures.push("Public customer registration is not enabled in Render");
const auth = readFileSync("apps/api/src/common/guards/auth.guard.ts", "utf8");
if (!auth.includes("authSession.findFirst")) failures.push("AuthGuard does not verify revocable sessions");
const documents = readFileSync("apps/api/src/modules/documents/documents.module.ts", "utf8");
for (const invariant of ['malwareScanResult !== "CLEAN"', 'authorization !== `Bearer ${config.MALWARE_SCANNER_TOKEN}`', 'identity_document:view']) {
  if (!documents.includes(invariant)) failures.push(`Document security invariant missing: ${invariant}`);
}
for (const file of ["apps/web/next.config.ts", "apps/admin/next.config.ts", "apps/api/src/main.ts"]) {
  const value = readFileSync(file, "utf8");
  for (const header of ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Strict-Transport-Security"]) if (!value.includes(header)) failures.push(`${file} is missing ${header}`);
}

const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const secretPatterns = [/\bAKIA[0-9A-Z]{16}\b/, /\bsk_live_[A-Za-z0-9]{16,}\b/, /\bre_[A-Za-z0-9]{20,}\b/, /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/];
for (const file of tracked) {
  if (file === "scripts/security-check.mjs") continue;
  let value; try { value = readFileSync(file, "utf8"); } catch { continue; }
  if (secretPatterns.some((pattern) => pattern.test(value))) failures.push(`Possible committed secret in ${file}`);
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Security invariants valid; scanned ${tracked.length} tracked files.`);
