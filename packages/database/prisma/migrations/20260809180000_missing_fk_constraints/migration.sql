-- DATA-009: 31 unconstrained reference columns, confirmed by schema
-- inspection. Adds a real foreign key (and, on the Prisma side, a real
-- @relation) for every genuine local reference that was previously a bare
-- UUID column with nothing enforcing it - not for columns that reference
-- an EXTERNAL system's identifier (provider_event_id, provider_payment_id,
-- zendesk_ticket_id, etc. - correctly left unconstrained, there is no local
-- table for them to reference) or the polymorphic audit_events.entity_id
-- (which can't have a single FK since it points at a different table
-- depending on entity_type - a deliberate, standard pattern for
-- polymorphic associations, not a gap).
--
-- Also drops shipments.customs_case_id: it duplicated
-- customs_cases.shipment_id as a second, independently-unconstrained
-- unique pointer between the same two tables ("both sides of the
-- shipment<->customs-case link" the audit named specifically) - confirmed
-- unused anywhere in application code before removing it. The single real
-- relation now lives on customs_cases.shipment_id below.
--
-- All FK target tables were confirmed empty or free of any row that would
-- violate the new constraint before this was applied (see
-- docs/audit/BACKEND_AUDIT_EVIDENCE.md) - a plain ADD CONSTRAINT (not
-- NOT VALID + VALIDATE) is safe and instant on tables with no rows to scan.


-- DropIndex
DROP INDEX "shipments_customs_case_id_key";

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "customs_case_id";

-- AddForeignKey
ALTER TABLE "rate_cards" ADD CONSTRAINT "rate_cards_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_converted_shipment_id_fkey" FOREIGN KEY ("converted_shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_label_document_id_fkey" FOREIGN KEY ("label_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_tracking_events" ADD CONSTRAINT "external_tracking_events_mapped_tracking_event_id_fkey" FOREIGN KEY ("mapped_tracking_event_id") REFERENCES "tracking_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_assigned_driver_user_id_fkey" FOREIGN KEY ("assigned_driver_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_assigned_driver_user_id_fkey" FOREIGN KEY ("assigned_driver_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_signature_document_id_fkey" FOREIGN KEY ("signature_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_proof_photo_document_id_fkey" FOREIGN KEY ("proof_photo_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_movements" ADD CONSTRAINT "package_movements_from_location_id_fkey" FOREIGN KEY ("from_location_id") REFERENCES "storage_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_movements" ADD CONSTRAINT "package_movements_to_location_id_fkey" FOREIGN KEY ("to_location_id") REFERENCES "storage_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_movements" ADD CONSTRAINT "package_movements_scanned_by_user_id_fkey" FOREIGN KEY ("scanned_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manifests" ADD CONSTRAINT "manifests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_cases" ADD CONSTRAINT "customs_cases_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "document_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_decisions" ADD CONSTRAINT "claim_decisions_decided_by_user_id_fkey" FOREIGN KEY ("decided_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_original_shipment_id_fkey" FOREIGN KEY ("original_shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_return_shipment_id_fkey" FOREIGN KEY ("return_shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_links" ADD CONSTRAINT "support_links_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_pages" ADD CONSTRAINT "content_pages_current_policy_version_id_fkey" FOREIGN KEY ("current_policy_version_id") REFERENCES "policy_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idempotency_records" ADD CONSTRAINT "idempotency_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

