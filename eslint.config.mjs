// REL-019: apps/api and apps/worker had no eslint.config.* at all, so
// `eslint` (v9, flat-config-only) exited with "couldn't find an eslint.config
// file" and the CI lint-and-typecheck job could not have passed. This is the
// single config both apps' `lint` scripts pick up via ESLint's upward
// directory search (apps/web and apps/admin keep their own
// Next.js-flavoured eslint.config.mjs, which takes precedence in their
// directories since it is nearer).
//
// typescript-eslint's `recommendedTypeChecked` plus `no-floating-promises`/
// `no-misused-promises` as errors is the specific ask: those two rules would
// have caught REL-006 (unawaited `pollOnce()` inside the old `setInterval`)
// and REL-010 (fire-and-forget `.catch()` writes in `IdempotencyInterceptor`)
// before they shipped.
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/coverage/**"],
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["apps/api/src/**/*.ts", "apps/worker/src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      // CLAUDE.md already forbids *unexplained* `any` via code review, which
      // needs human judgment about whether a given `any` is justified - a
      // blanket lint rule can't make that call, so it's left to review
      // rather than enforced here.
      "@typescript-eslint/no-explicit-any": "off",
      // REL-011: every console.* call in both apps was replaced with the
      // structured pino logger from apps/{api,worker}/src/logger.ts. This
      // rule is what keeps that true - REL-019's own finding was explicit
      // that the `// eslint-disable-next-line no-console` comments littering
      // this codebase were "suppressing a rule that was never enforced,
      // which is also why REL-011's console.* sprawl went unnoticed".
      // Enforcing it now is what makes this fix durable instead of a
      // one-time cleanup.
      "no-console": "error",
    },
  }
);
