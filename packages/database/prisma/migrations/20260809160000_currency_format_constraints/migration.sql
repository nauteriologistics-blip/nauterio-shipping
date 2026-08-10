-- DATA-011(b): every currency column is CHAR(3) with no CHECK on the value.
-- Reproduced by the audit: `UPDATE shipments SET currency = 'zz9'` succeeded,
-- and CHAR(3) pads rather than rejects, so 'E ' and 'EUR' are both storable
-- and unequal. This adds a format CHECK (three uppercase ASCII letters,
-- matching real ISO 4217 codes) to every currency column in the schema.
--
-- Cross-table currency-agreement constraints (e.g. payment.currency must
-- equal payment_allocation.currency) are intentionally NOT added here -
-- those tables are still empty (DATA-018's own scope-not-yet-built
-- assessment) and a same-table CHECK cannot express a cross-table
-- invariant anyway; that needs a trigger, to be added alongside the payment
-- handler itself per DATA-018's recommended fix, not speculatively now.
--
-- NOT VALID + VALIDATE CONSTRAINT (see docs/runbooks/database-migrations.md)
-- so this never takes a table-rewriting lock, matching every other CHECK
-- added in this codebase.

ALTER TABLE "organisations" ADD CONSTRAINT "organisations_credit_limit_currency_valid" CHECK ("credit_limit_currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "organisation_members" ADD CONSTRAINT "organisation_members_approval_limit_currency_valid" CHECK ("approval_limit_currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "rate_cards" ADD CONSTRAINT "rate_cards_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "quote_lines" ADD CONSTRAINT "quote_lines_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_declared_value_currency_valid" CHECK ("declared_value_currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "charges" ADD CONSTRAINT "charges_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "payments" ADD CONSTRAINT "payments_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_currency_valid" CHECK ("currency" ~ '^[A-Z]{3}$') NOT VALID;
ALTER TABLE "claim_decisions" ADD CONSTRAINT "claim_decisions_compensation_currency_valid" CHECK ("compensation_currency" ~ '^[A-Z]{3}$') NOT VALID;

ALTER TABLE "organisations" VALIDATE CONSTRAINT "organisations_credit_limit_currency_valid";
ALTER TABLE "organisation_members" VALIDATE CONSTRAINT "organisation_members_approval_limit_currency_valid";
ALTER TABLE "rate_cards" VALIDATE CONSTRAINT "rate_cards_currency_valid";
ALTER TABLE "quotes" VALIDATE CONSTRAINT "quotes_currency_valid";
ALTER TABLE "quote_lines" VALIDATE CONSTRAINT "quote_lines_currency_valid";
ALTER TABLE "shipments" VALIDATE CONSTRAINT "shipments_declared_value_currency_valid";
ALTER TABLE "shipments" VALIDATE CONSTRAINT "shipments_currency_valid";
ALTER TABLE "shipment_items" VALIDATE CONSTRAINT "shipment_items_currency_valid";
ALTER TABLE "charges" VALIDATE CONSTRAINT "charges_currency_valid";
ALTER TABLE "invoices" VALIDATE CONSTRAINT "invoices_currency_valid";
ALTER TABLE "invoice_lines" VALIDATE CONSTRAINT "invoice_lines_currency_valid";
ALTER TABLE "payments" VALIDATE CONSTRAINT "payments_currency_valid";
ALTER TABLE "payment_allocations" VALIDATE CONSTRAINT "payment_allocations_currency_valid";
ALTER TABLE "refunds" VALIDATE CONSTRAINT "refunds_currency_valid";
ALTER TABLE "claim_decisions" VALIDATE CONSTRAINT "claim_decisions_compensation_currency_valid";
