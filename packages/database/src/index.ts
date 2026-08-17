import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

/**
 * Prisma 7 requires an explicit driver adapter - there is no bundled
 * database driver anymore (see ADR 0001 section 1.3 and 4.3). The adapter
 * inherits node-postgres's pool behaviour, which has NO default connection
 * or statement timeout, unlike Prisma 6's built-in engine. Every timeout
 * below is set explicitly for that reason - do not remove them "to simplify".
 *
 * In production this pool sits behind RDS Proxy (ADR 0001 section 4.3) so
 * that N horizontally-scaled ECS Fargate tasks do not each hold their own
 * large connection pool against RDS directly.
 */
function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  const poolOptions = {
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 15_000,
    query_timeout: 15_000,
  };

  if (connectionString) {
    return new Pool({ connectionString, ...poolOptions });
  }

  // REL-014: ECS Secrets Manager references can only inject individual
  // string fields, not an assembled connection URL (CDK cannot resolve a
  // secret's value at synth time to build one, and should not be made to
  // try). `pg.Pool` already reads the standard libpq PGHOST/PGPORT/
  // PGDATABASE/PGUSER/PGPASSWORD environment variables itself when no
  // `connectionString` is given, so passing no connection config at all is
  // the correct production shape - only fail fast if genuinely nothing is set.
  if (!process.env.PGHOST) {
    throw new Error(
      "Neither DATABASE_URL nor PGHOST is set - see packages/database/.env.example for local dev, " +
        "or infra/cdk/lib/compute-stack.ts for the ECS Secrets Manager wiring."
    );
  }
  return new Pool(poolOptions);
}

let pool: Pool | undefined;
let client: PrismaClient | undefined;

/** Singleton PrismaClient for the process - never construct PrismaClient directly elsewhere. */
export function getPrismaClient(): PrismaClient {
  if (!client) {
    pool = createPool();
    const adapter = new PrismaPg(pool);
    client = new PrismaClient({ adapter });
  }
  return client;
}

export async function disconnectPrisma(): Promise<void> {
  await client?.$disconnect();
  await pool?.end();
  client = undefined;
  pool = undefined;
}

export * from "@prisma/client";
export * from "./redis";
