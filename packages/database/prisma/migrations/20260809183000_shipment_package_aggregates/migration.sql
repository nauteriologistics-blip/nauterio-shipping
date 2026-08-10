-- DATA-019: Shipment.packageCount/totalActualWeightKg/totalVolumetricWeightKg/
-- totalChargeableWeightKg duplicate facts derivable from the packages table,
-- with nothing recomputing them. Confirmed by code inspection: no code path
-- anywhere creates a Package row yet (grep across apps/api/src and
-- apps/worker/src for `.package.create` returns nothing) - these fields are
-- currently set once, directly, from the booking draft's declared weight
-- (BookingsService.confirmBooking), not derived from packages at all. That
-- makes "drop the column and compute on read" (the audit's suggestion for
-- the cheap-to-derive case) premature: computing from an always-empty
-- packages table would return zero/nothing today, silently breaking the
-- current declared-weight behaviour every existing shipment relies on.
--
-- Instead: a trigger that keeps these fields in sync with real Package rows
-- THE MOMENT any exist, so the drift this finding describes is impossible
-- from the day a package-management feature is built, rather than needing
-- another audit pass to discover it then. Inert today (fires only on an
-- actual packages INSERT/UPDATE/DELETE, which never happens yet) - this is
-- the same "fix the mechanism now, safe until the real caller exists"
-- precedent as DATA-013's tracking-number generator fix.
--
-- Behavioural note for whenever a package-management feature lands: the
-- FIRST Package row ever inserted for a shipment will immediately overwrite
-- that shipment's booking-time-declared weight fields with the sum of its
-- actual packages - which is the correct, intended transition (the real
-- physical packages become the source of truth the moment they exist), but
-- is worth knowing in advance rather than discovering by surprise.
--
-- outstandingAmountMinorUnits is NOT addressed here: unlike the weight
-- fields, there is no existing formula anywhere in this codebase for what
-- "outstanding" means in terms of Charge/Payment/PaymentAllocation rows
-- (none of which are ever created by any code path either - DATA-018's own
-- empty-table finding). Inventing that formula now, with nothing to
-- validate it against, would be exactly the kind of speculative business
-- logic CLAUDE.md's engineering rules warn against - it needs a real
-- billing-flow design first, tracked in docs/audit/BACKEND_AUDIT_FIX_PLAN.md
-- alongside DATA-018's other payment-flow-dependent items.

CREATE OR REPLACE FUNCTION recompute_shipment_package_aggregates() RETURNS trigger AS $$
DECLARE
  target_shipment_id UUID;
BEGIN
  target_shipment_id := COALESCE(NEW.shipment_id, OLD.shipment_id);

  UPDATE shipments SET
    package_count = (SELECT COUNT(*) FROM packages WHERE shipment_id = target_shipment_id),
    total_actual_weight_kg = (SELECT COALESCE(SUM(actual_weight_kg), 0) FROM packages WHERE shipment_id = target_shipment_id),
    total_volumetric_weight_kg = (SELECT COALESCE(SUM(volumetric_weight_kg), 0) FROM packages WHERE shipment_id = target_shipment_id),
    total_chargeable_weight_kg = (SELECT COALESCE(SUM(chargeable_weight_kg), 0) FROM packages WHERE shipment_id = target_shipment_id)
  WHERE id = target_shipment_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER packages_maintain_shipment_aggregates
  AFTER INSERT OR UPDATE OR DELETE ON packages
  FOR EACH ROW EXECUTE FUNCTION recompute_shipment_package_aggregates();
