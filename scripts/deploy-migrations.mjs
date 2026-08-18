import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const concurrentMigration = "20260809150000_concurrent_indexes";
const concurrentMigrationFile = fileURLToPath(
  new URL(`../packages/database/prisma/migrations/${concurrentMigration}/migration.sql`, import.meta.url)
);
const databaseDirectory = fileURLToPath(new URL("../packages/database/", import.meta.url));
const prismaCli = fileURLToPath(new URL("../packages/database/node_modules/prisma/build/index.js", import.meta.url));

function runPrisma(args, allowFailure = false) {
  // Invoke the installed CLI directly. Going through pnpm revalidates the
  // entire lockfile against registry metadata on every free-tier cold start,
  // which can add several minutes before Render sees an open HTTP port.
  const result = spawnSync(process.execPath, [prismaCli, ...args], {
    cwd: databaseDirectory,
    env: process.env,
    encoding: "utf8",
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error(`Prisma command failed with exit code ${result.status ?? 1}: ${args.join(" ")}`);
  }
  return result;
}

const firstDeploy = runPrisma(["migrate", "deploy"], true);
if (firstDeploy.status === 0) process.exit(0);

const deployOutput = `${firstDeploy.stdout ?? ""}\n${firstDeploy.stderr ?? ""}`;
if (!deployOutput.includes(concurrentMigration)) {
  throw new Error("Prisma migrate deploy failed for an unexpected reason; refusing to alter migration history.");
}

console.warn(
  `[migrations] ${concurrentMigration} requires non-transactional execution; applying its documented deployment path.`
);

// A failed Prisma attempt leaves a failed history row. Marking it rolled
// back is required before the migration can be recorded as manually applied.
runPrisma(["migrate", "resolve", "--rolled-back", concurrentMigration]);
runPrisma(["db", "execute", "--file", concurrentMigrationFile]);
runPrisma(["migrate", "resolve", "--applied", concurrentMigration]);
runPrisma(["migrate", "deploy"]);

console.log("[migrations] All production migrations are applied.");
