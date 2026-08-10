-- DATA-018: no aggregate money constraints existed - refunds could sum to
-- more than the payment they refund, and payment_allocations could sum to
-- more than the payment they allocate. Both tables are still empty (no
-- payment handler exists yet), so this is free to add now and free of any
-- backfill risk - recorded now while it costs nothing, per the finding's
-- own recommendation.
--
-- Implemented as a BEFORE INSERT OR UPDATE trigger (not a CHECK constraint
-- - Postgres CHECK constraints are row-local and cannot reference other
-- rows/tables) that locks the parent payment row with `FOR UPDATE` before
-- computing the sum. This closes the exact race the finding named: "two
-- concurrent approvals of a partial refund both read the same
-- already-refunded total and both pass their check, over-refunding the
-- customer" - the second transaction's trigger blocks on the lock until
-- the first commits or rolls back, then re-reads the now-correct sum,
-- rather than both computing the sum independently and racing.

CREATE OR REPLACE FUNCTION enforce_refund_aggregate() RETURNS trigger AS $$
DECLARE
  payment_amount BIGINT;
  other_refunds_total BIGINT;
BEGIN
  SELECT amount_minor_units INTO payment_amount FROM payments WHERE id = NEW.payment_id FOR UPDATE;
  IF payment_amount IS NULL THEN
    RAISE EXCEPTION 'Payment % does not exist', NEW.payment_id;
  END IF;

  SELECT COALESCE(SUM(amount_minor_units), 0) INTO other_refunds_total
    FROM refunds
    WHERE payment_id = NEW.payment_id AND id != NEW.id;

  IF other_refunds_total + NEW.amount_minor_units > payment_amount THEN
    RAISE EXCEPTION 'Refund total % would exceed payment amount % for payment %',
      other_refunds_total + NEW.amount_minor_units, payment_amount, NEW.payment_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refunds_aggregate_check
  BEFORE INSERT OR UPDATE ON refunds
  FOR EACH ROW EXECUTE FUNCTION enforce_refund_aggregate();

CREATE OR REPLACE FUNCTION enforce_payment_allocation_aggregate() RETURNS trigger AS $$
DECLARE
  payment_amount BIGINT;
  other_allocations_total BIGINT;
BEGIN
  SELECT amount_minor_units INTO payment_amount FROM payments WHERE id = NEW.payment_id FOR UPDATE;
  IF payment_amount IS NULL THEN
    RAISE EXCEPTION 'Payment % does not exist', NEW.payment_id;
  END IF;

  SELECT COALESCE(SUM(amount_minor_units), 0) INTO other_allocations_total
    FROM payment_allocations
    WHERE payment_id = NEW.payment_id AND id != NEW.id;

  IF other_allocations_total + NEW.amount_minor_units > payment_amount THEN
    RAISE EXCEPTION 'Allocation total % would exceed payment amount % for payment %',
      other_allocations_total + NEW.amount_minor_units, payment_amount, NEW.payment_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_allocations_aggregate_check
  BEFORE INSERT OR UPDATE ON payment_allocations
  FOR EACH ROW EXECUTE FUNCTION enforce_payment_allocation_aggregate();

-- DATA-018 (secondary item): PaymentEvent.providerEventId was globally
-- unique with no provider column at all, so a PayPal event id colliding
-- with a Stripe event id would be rejected as a false replay. Table is
-- empty, so the new NOT NULL column needs no backfill.
ALTER TABLE "payment_events" ADD COLUMN "provider" "PaymentProvider" NOT NULL;
DROP INDEX "payment_events_provider_event_id_key";
CREATE UNIQUE INDEX "payment_events_provider_provider_event_id_key" ON "payment_events" ("provider", "provider_event_id");
