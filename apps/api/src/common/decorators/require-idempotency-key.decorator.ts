import { SetMetadata } from "@nestjs/common";

export const IDEMPOTENCY_KEY_METADATA = "requireIdempotencyKey";

/** Declares that a route must be called with an `Idempotency-Key` header
 * (spec section 26.1: create/financial/booking operations that a client may
 * retry after a timeout must be safe to retry). See IdempotencyInterceptor. */
export const RequireIdempotencyKey = () => SetMetadata(IDEMPOTENCY_KEY_METADATA, true);
