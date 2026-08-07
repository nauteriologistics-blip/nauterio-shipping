/**
 * Cross-cutting business validation shared between apps/web and apps/api
 * (ADR 0001 section 3.1). Domain-specific validation (permission evaluation,
 * volumetric weight) lives in dedicated files here, not scattered across
 * NestJS controllers or React components (CLAUDE.md: business logic belongs
 * in domain/application services).
 */
export * from "./volumetric-weight";
export * from "./permission-evaluator";
