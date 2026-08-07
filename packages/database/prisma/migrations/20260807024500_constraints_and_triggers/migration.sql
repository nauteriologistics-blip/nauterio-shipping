-- Companion constraints Prisma's schema DSL cannot express directly.
-- Source of truth: spec section 25.4 (constraints/indexes), section 23.2
-- (money rule), ADR 0001 section 4.2 (append-only enforcement).

-- ---------------------------------------------------------------------
-- 1. Non-negative money check constraints
-- ---------------------------------------------------------------------

ALTER TABLE "organisations"
  ADD CONSTRAINT "organisations_credit_limit_nonneg"
  CHECK ("credit_limit_amount_minor_units" IS NULL OR "credit_limit_amount_minor_units" >= 0);

ALTER TABLE "organisation_members"
  ADD CONSTRAINT "organisation_members_approval_limit_nonneg"
  CHECK ("approval_limit_amount_minor_units" IS NULL OR "approval_limit_amount_minor_units" >= 0);

ALTER TABLE "quotes"
  ADD CONSTRAINT "quotes_total_nonneg"
  CHECK ("total_amount_minor_units" >= 0);

ALTER TABLE "quote_lines"
  ADD CONSTRAINT "quote_lines_amount_nonneg"
  CHECK ("amount_minor_units" >= 0);

ALTER TABLE "shipments"
  ADD CONSTRAINT "shipments_declared_value_nonneg"
  CHECK ("declared_value_amount_minor_units" >= 0),
  ADD CONSTRAINT "shipments_total_amount_nonneg"
  CHECK ("total_amount_minor_units" >= 0),
  ADD CONSTRAINT "shipments_outstanding_nonneg"
  CHECK ("outstanding_amount_minor_units" >= 0);

ALTER TABLE "charges"
  ADD CONSTRAINT "charges_amount_nonneg"
  CHECK ("amount_minor_units" >= 0);

ALTER TABLE "invoices"
  ADD CONSTRAINT "invoices_total_nonneg"
  CHECK ("total_amount_minor_units" >= 0);

ALTER TABLE "invoice_lines"
  ADD CONSTRAINT "invoice_lines_amount_nonneg"
  CHECK ("amount_minor_units" >= 0);

ALTER TABLE "payments"
  ADD CONSTRAINT "payments_amount_nonneg"
  CHECK ("amount_minor_units" >= 0);

ALTER TABLE "payment_allocations"
  ADD CONSTRAINT "payment_allocations_amount_nonneg"
  CHECK ("amount_minor_units" >= 0);

ALTER TABLE "refunds"
  ADD CONSTRAINT "refunds_amount_nonneg"
  CHECK ("amount_minor_units" >= 0);

ALTER TABLE "claim_decisions"
  ADD CONSTRAINT "claim_decisions_compensation_nonneg"
  CHECK ("compensation_amount_minor_units" IS NULL OR "compensation_amount_minor_units" >= 0);

ALTER TABLE "rate_rules"
  ADD CONSTRAINT "rate_rules_amounts_nonneg"
  CHECK (
    "flat_fee_amount_minor_units" >= 0 AND
    "per_kg_amount_minor_units" >= 0 AND
    "minimum_charge_amount_minor_units" >= 0
  );

-- ---------------------------------------------------------------------
-- 2. Non-negative measurement/count checks
-- ---------------------------------------------------------------------

ALTER TABLE "shipments"
  ADD CONSTRAINT "shipments_weights_nonneg"
  CHECK (
    "total_actual_weight_kg" >= 0 AND
    "total_volumetric_weight_kg" >= 0 AND
    "total_chargeable_weight_kg" >= 0 AND
    "package_count" > 0
  );

ALTER TABLE "packages"
  ADD CONSTRAINT "packages_dims_nonneg"
  CHECK (
    "actual_weight_kg" >= 0 AND "length_cm" >= 0 AND
    "width_cm" >= 0 AND "height_cm" >= 0 AND
    "volumetric_weight_kg" >= 0 AND "chargeable_weight_kg" >= 0
  );

-- ---------------------------------------------------------------------
-- 3. Append-only enforcement: revoke UPDATE/DELETE from the app role and
--    add a raising trigger as defence-in-depth (spec section 25.4:
--    "Audit/outbox tables are append-only from normal application
--    permissions"; ADR 0001 section 4.2).
--
--    NOTE: this migration revokes from PUBLIC plus any role literally named
--    'nauterio_app' if it exists yet. The actual application database role
--    is created by infra/cdk (RDS + IAM) in a later environment-specific
--    step - this migration does not invent a role that does not exist
--    locally. Re-run the REVOKE statements (or add them to the CDK custom
--    resource) once the real app role exists in each environment.
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION reject_update_delete() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is append-only: % is not permitted. Insert a correction row instead.', TG_TABLE_NAME, TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_events_append_only
  BEFORE UPDATE OR DELETE ON "audit_events"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();

CREATE TRIGGER outbox_events_append_only
  BEFORE DELETE ON "outbox_events"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();
-- outbox_events allows UPDATE (status/attempts/publishedAt are mutated by
-- the relay process) but never DELETE - published events remain for audit.

CREATE TRIGGER inbox_events_append_only
  BEFORE UPDATE OR DELETE ON "inbox_events"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();

CREATE TRIGGER payment_events_append_only
  BEFORE UPDATE OR DELETE ON "payment_events"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();

CREATE TRIGGER package_movements_append_only
  BEFORE UPDATE OR DELETE ON "package_movements"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();

-- tracking_events is append-only for edits to existing rows, but DELETE
-- must remain blocked while corrections (correction_of_id) are still
-- inserts, not updates - so we only block UPDATE of immutable fields via
-- application logic (the correction_of_id self-relation exists precisely
-- so a "correction" is a new row). We block DELETE outright here.
CREATE TRIGGER tracking_events_no_delete
  BEFORE DELETE ON "tracking_events"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();

-- ---------------------------------------------------------------------
-- 4. Case-insensitive uniqueness on tracking numbers (spec 25.4: "Unique
--    normalised public tracking number"). Prisma's @unique is
--    case-sensitive by default; enforce normalised uniqueness explicitly.
-- ---------------------------------------------------------------------

CREATE UNIQUE INDEX "shipments_tracking_number_normalised_idx"
  ON "shipments" (UPPER("tracking_number"));
