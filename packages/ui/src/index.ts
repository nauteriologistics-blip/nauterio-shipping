/**
 * Shared design tokens and component library between apps/web and apps/admin
 * (ADR 0001 section 3.1). Empty scaffold for now - components migrate here
 * as apps/admin is built out; apps/web's existing components stay local
 * until there is a second consumer, per "don't add abstractions beyond
 * what the task requires".
 */
export const BRAND_COLORS = {
  navy: "#081F3D",
  orange: "#F28C18",
} as const;
