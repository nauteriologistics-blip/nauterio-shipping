import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 config file - replaces datasource.url in schema.prisma (see
 * ADR 0001 section 1.3 and 4.3 for why: driver adapters + no bundled
 * database driver anymore).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
