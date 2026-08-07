-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OrganisationStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OrganisationMemberRole" AS ENUM ('ORGANISATION_ADMIN', 'ORGANISATION_MEMBER');

-- CreateEnum
CREATE TYPE "OrganisationMemberStatus" AS ENUM ('INVITED', 'ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('SENDER', 'RECEIVER');

-- CreateEnum
CREATE TYPE "ServiceId" AS ENUM ('AIR_EXPRESS', 'AIR_ECONOMY', 'OCEAN_FREIGHT');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'ACCEPTED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BookingStep" AS ENUM ('PACKAGE_DETAILS', 'ADDRESSES', 'SERVICE', 'REVIEW', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ShipmentLifecycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ACTION_REQUIRED', 'DELIVERED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TrackingEventSourceType" AS ENUM ('STAFF', 'WAREHOUSE_SCAN', 'DRIVER', 'CARRIER_API', 'PARTNER_WEBHOOK', 'SYSTEM_AUTOMATION');

-- CreateEnum
CREATE TYPE "TrackingEventVisibility" AS ENUM ('INTERNAL', 'AUTHENTICATED_CUSTOMER', 'PUBLIC', 'RESTRICTED_PROOF');

-- CreateEnum
CREATE TYPE "PickupStatus" AS ENUM ('REQUESTED', 'SCHEDULED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('SCHEDULED', 'OUT_FOR_DELIVERY', 'ATTEMPTED', 'DELIVERED', 'HELD_FOR_COLLECTION', 'FAILED');

-- CreateEnum
CREATE TYPE "ManifestStatus" AS ENUM ('OPEN', 'DISPATCHED', 'RECONCILED');

-- CreateEnum
CREATE TYPE "CustomsCaseStatus" AS ENUM ('OPEN', 'ACTION_REQUIRED', 'UNDER_REVIEW', 'CLEARED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentReviewStatus" AS ENUM ('PROCESSING', 'APPROVED', 'REJECTED', 'REPLACEMENT_REQUIRED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('COMMERCIAL_INVOICE', 'PACKING_LIST', 'IDENTITY_DOCUMENT', 'CUSTOMS_SUPPORTING_EVIDENCE', 'PROOF_OF_DELIVERY_PHOTO', 'SIGNATURE', 'GENERATED_LABEL', 'GENERATED_INVOICE', 'GENERATED_RECEIPT', 'GENERATED_CUSTOMS_REQUEST', 'GENERATED_CLAIM_ACKNOWLEDGEMENT', 'GENERATED_CREDIT_NOTE', 'GENERATED_REFUND_CONFIRMATION', 'GENERATED_RETURN_LABEL', 'OTHER');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('FREIGHT', 'CUSTOMS_FILING', 'PICKUP', 'INSURANCE', 'STORAGE', 'SURCHARGE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'VOID');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('REQUESTED', 'APPROVED', 'PROCESSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SETTLED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'IN_APP');

-- CreateEnum
CREATE TYPE "OutboxEventStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "cognito_sub" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "preferred_language" TEXT NOT NULL DEFAULT 'en',
    "marketing_consent" BOOLEAN NOT NULL DEFAULT false,
    "staff_role" TEXT,
    "staff_warehouse_ids" UUID[] DEFAULT ARRAY[]::UUID[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisations" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "legal_name" TEXT NOT NULL,
    "trading_name" TEXT,
    "vat_number" TEXT,
    "eori_number" TEXT,
    "status" "OrganisationStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "credit_limit_amount_minor_units" BIGINT,
    "credit_limit_currency" CHAR(3),
    "contract_reference" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_members" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "organisation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "OrganisationMemberRole" NOT NULL,
    "status" "OrganisationMemberStatus" NOT NULL DEFAULT 'INVITED',
    "approval_limit_amount_minor_units" BIGINT,
    "approval_limit_currency" CHAR(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisation_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID,
    "organisation_id" UUID,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "postal_code" TEXT NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "provider_validated" BOOLEAN NOT NULL DEFAULT false,
    "provider_result_json" JSONB,
    "customer_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID,
    "role" "ContactRole" NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "company_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" "ServiceId" NOT NULL,
    "name" TEXT NOT NULL,
    "transit_label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "service_id" "ServiceId" NOT NULL,
    "origin_country" CHAR(2) NOT NULL,
    "destination_country" CHAR(2) NOT NULL,
    "active_from" TIMESTAMP(3) NOT NULL,
    "active_to" TIMESTAMP(3),

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_cards" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "service_id" "ServiceId" NOT NULL,
    "version" INTEGER NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL,
    "effective_to" TIMESTAMP(3),
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_rules" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "rate_card_id" UUID NOT NULL,
    "min_weight_kg" DOUBLE PRECISION NOT NULL,
    "max_weight_kg" DOUBLE PRECISION,
    "flat_fee_amount_minor_units" BIGINT NOT NULL,
    "per_kg_amount_minor_units" BIGINT NOT NULL,
    "minimum_charge_amount_minor_units" BIGINT NOT NULL,

    CONSTRAINT "rate_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID,
    "organisation_id" UUID,
    "service_id" "ServiceId" NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "input_snapshot_json" JSONB NOT NULL,
    "actual_weight_kg" DOUBLE PRECISION NOT NULL,
    "volumetric_weight_kg" DOUBLE PRECISION NOT NULL,
    "chargeable_weight_kg" DOUBLE PRECISION NOT NULL,
    "is_indicative" BOOLEAN NOT NULL DEFAULT true,
    "total_amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_lines" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "quote_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quote_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID,
    "organisation_id" UUID,
    "quote_id" UUID,
    "current_step" "BookingStep" NOT NULL DEFAULT 'PACKAGE_DETAILS',
    "draft_data_json" JSONB NOT NULL,
    "converted_shipment_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "tracking_number" TEXT NOT NULL,
    "customer_reference" TEXT,
    "organisation_id" UUID,
    "owner_user_id" UUID,
    "sender_name_snapshot" TEXT NOT NULL,
    "sender_address_snapshot" JSONB NOT NULL,
    "receiver_name_snapshot" TEXT NOT NULL,
    "receiver_address_snapshot" JSONB NOT NULL,
    "service_id" "ServiceId" NOT NULL,
    "package_count" INTEGER NOT NULL DEFAULT 1,
    "total_actual_weight_kg" DOUBLE PRECISION NOT NULL,
    "total_volumetric_weight_kg" DOUBLE PRECISION NOT NULL,
    "total_chargeable_weight_kg" DOUBLE PRECISION NOT NULL,
    "declared_value_amount_minor_units" BIGINT NOT NULL,
    "declared_value_currency" CHAR(3) NOT NULL,
    "is_de_minimis_eligible" BOOLEAN NOT NULL DEFAULT true,
    "customs_case_id" UUID,
    "pickup_target_at" TIMESTAMP(3),
    "dispatch_target_at" TIMESTAMP(3),
    "estimated_delivery_from" TIMESTAMP(3),
    "estimated_delivery_to" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "lifecycle_status" "ShipmentLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
    "current_tracking_code" TEXT NOT NULL DEFAULT 'SHIPMENT_CREATED',
    "action_required_reason" TEXT,
    "quote_id" UUID,
    "total_amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "outstanding_amount_minor_units" BIGINT NOT NULL DEFAULT 0,
    "created_by_user_id" UUID,
    "source" TEXT NOT NULL DEFAULT 'web',
    "version" INTEGER NOT NULL DEFAULT 1,
    "legal_hold" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "actual_weight_kg" DOUBLE PRECISION NOT NULL,
    "length_cm" DOUBLE PRECISION NOT NULL,
    "width_cm" DOUBLE PRECISION NOT NULL,
    "height_cm" DOUBLE PRECISION NOT NULL,
    "volumetric_weight_kg" DOUBLE PRECISION NOT NULL,
    "chargeable_weight_kg" DOUBLE PRECISION NOT NULL,
    "condition" TEXT NOT NULL DEFAULT 'GOOD',
    "label_document_id" UUID,
    "current_storage_location_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_items" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "hs_code" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit_value_amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "country_of_origin" CHAR(2) NOT NULL,

    CONSTRAINT "shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "package_id" UUID,
    "canonical_code" TEXT NOT NULL,
    "public_title_en" TEXT NOT NULL,
    "public_title_it" TEXT NOT NULL,
    "public_description_en" TEXT,
    "public_description_it" TEXT,
    "internal_description" TEXT,
    "source_type" "TrackingEventSourceType" NOT NULL,
    "source_id" TEXT,
    "source_event_id" TEXT,
    "dedup_key" TEXT,
    "event_time" TIMESTAMP(3) NOT NULL,
    "source_timezone" TEXT,
    "received_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location_json" JSONB,
    "visibility" "TrackingEventVisibility" NOT NULL DEFAULT 'AUTHENTICATED_CUSTOMER',
    "evidence_document_id" UUID,
    "correction_of_id" UUID,
    "actor_user_id" UUID,
    "reason" TEXT,
    "notification_state" TEXT NOT NULL DEFAULT 'NOT_ELIGIBLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_tracking_events" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "provider" TEXT NOT NULL,
    "provider_event_id" TEXT NOT NULL,
    "raw_payload_json" JSONB NOT NULL,
    "mapped_tracking_event_id" UUID,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickups" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "window_start" TIMESTAMP(3) NOT NULL,
    "window_end" TIMESTAMP(3) NOT NULL,
    "status" "PickupStatus" NOT NULL DEFAULT 'REQUESTED',
    "assigned_driver_user_id" UUID,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "evidence_document_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pickups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "window_start" TIMESTAMP(3),
    "window_end" TIMESTAMP(3),
    "status" "DeliveryStatus" NOT NULL DEFAULT 'SCHEDULED',
    "assigned_driver_user_id" UUID,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "signature_document_id" UUID,
    "proof_photo_document_id" UUID,
    "recipient_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "city" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_locations" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "warehouse_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "parent_id" UUID,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_movements" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "package_id" UUID NOT NULL,
    "from_location_id" UUID,
    "to_location_id" UUID,
    "scanned_by_user_id" UUID,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manifests" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "warehouse_id" UUID NOT NULL,
    "carrier_name" TEXT NOT NULL,
    "service_id" "ServiceId" NOT NULL,
    "status" "ManifestStatus" NOT NULL DEFAULT 'OPEN',
    "dispatched_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manifests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manifest_items" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "manifest_id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "package_id" UUID NOT NULL,

    CONSTRAINT "manifest_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customs_cases" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "status" "CustomsCaseStatus" NOT NULL DEFAULT 'OPEN',
    "action_type" TEXT,
    "deadline_at" TIMESTAMP(3),
    "broker_reference" TEXT,
    "outcome_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customs_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "owner_user_id" UUID,
    "shipment_id" UUID,
    "type" "DocumentType" NOT NULL,
    "current_version_id" UUID,
    "review_status" "DocumentReviewStatus" NOT NULL DEFAULT 'PROCESSING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "document_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "s3_object_key" TEXT NOT NULL,
    "s3_bucket" TEXT NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "content_type" TEXT NOT NULL,
    "malware_scan_result" TEXT NOT NULL DEFAULT 'PENDING',
    "template_version" TEXT,
    "locale" TEXT,
    "generator_source_hash" TEXT,
    "uploaded_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charges" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "type" "ChargeType" NOT NULL,
    "amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "organisation_id" UUID,
    "customer_user_id" UUID,
    "invoice_number" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "total_amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "issued_at" TIMESTAMP(3),
    "due_at" TIMESTAMP(3),
    "document_id" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_lines" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "invoice_id" UUID NOT NULL,
    "shipment_id" UUID,
    "description" TEXT NOT NULL,
    "amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,

    CONSTRAINT "invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "provider" "PaymentProvider" NOT NULL,
    "provider_payment_id" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "payment_id" UUID NOT NULL,
    "provider_event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "signature_verified" BOOLEAN NOT NULL,
    "raw_payload_json" JSONB NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_allocations" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "payment_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "payment_id" UUID NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'REQUESTED',
    "amount_minor_units" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "approved_by_user_id" UUID,
    "provider_refund_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "shipment_id" UUID NOT NULL,
    "submitted_by_user_id" UUID NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reason_category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_evidence" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "claim_id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_decisions" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "claim_id" UUID NOT NULL,
    "decision" TEXT NOT NULL,
    "decided_by_user_id" UUID NOT NULL,
    "compensation_amount_minor_units" BIGINT,
    "compensation_currency" CHAR(3),
    "reason" TEXT NOT NULL,
    "decided_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "returns" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "claim_id" UUID,
    "original_shipment_id" UUID NOT NULL,
    "return_shipment_id" UUID,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_links" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID,
    "shipment_id" UUID,
    "zendesk_ticket_id" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID,
    "template_code" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "rendered_subject" TEXT,
    "rendered_body_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_attempts" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "notification_id" UUID NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "provider_message_id" TEXT,
    "status" TEXT NOT NULL,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_pages" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "slug" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_it" TEXT NOT NULL,
    "current_policy_version_id" UUID,

    CONSTRAINT "content_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_versions" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "content_page_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "body_en" TEXT NOT NULL,
    "body_it" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "effective_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "actor_user_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "before_json" JSONB,
    "after_json" JSONB,
    "correlation_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "device_info" TEXT,
    "reason" TEXT,
    "approval_reference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "event_type" TEXT NOT NULL,
    "event_version" INTEGER NOT NULL DEFAULT 1,
    "correlation_id" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "status" "OutboxEventStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inbox_events" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "source" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_clients" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "organisation_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "api_client_id" UUID NOT NULL,
    "hashed_key" TEXT NOT NULL,
    "last_four_chars" TEXT NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "api_client_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "hashed_secret" TEXT NOT NULL,
    "event_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_delivery_at" TIMESTAMP(3),
    "last_failure_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cognito_sub_key" ON "users"("cognito_sub");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "organisations_status_idx" ON "organisations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_members_organisation_id_user_id_key" ON "organisation_members"("organisation_id", "user_id");

-- CreateIndex
CREATE INDEX "addresses_user_id_idx" ON "addresses"("user_id");

-- CreateIndex
CREATE INDEX "addresses_organisation_id_idx" ON "addresses"("organisation_id");

-- CreateIndex
CREATE INDEX "rate_cards_service_id_approved_idx" ON "rate_cards"("service_id", "approved");

-- CreateIndex
CREATE INDEX "quotes_user_id_idx" ON "quotes"("user_id");

-- CreateIndex
CREATE INDEX "quotes_organisation_id_idx" ON "quotes"("organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_converted_shipment_id_key" ON "bookings"("converted_shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_tracking_number_key" ON "shipments"("tracking_number");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_customs_case_id_key" ON "shipments"("customs_case_id");

-- CreateIndex
CREATE INDEX "shipments_lifecycle_status_idx" ON "shipments"("lifecycle_status");

-- CreateIndex
CREATE INDEX "shipments_organisation_id_idx" ON "shipments"("organisation_id");

-- CreateIndex
CREATE INDEX "shipments_owner_user_id_idx" ON "shipments"("owner_user_id");

-- CreateIndex
CREATE INDEX "shipments_current_tracking_code_idx" ON "shipments"("current_tracking_code");

-- CreateIndex
CREATE INDEX "packages_shipment_id_idx" ON "packages"("shipment_id");

-- CreateIndex
CREATE INDEX "shipment_items_shipment_id_idx" ON "shipment_items"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracking_events_dedup_key_key" ON "tracking_events"("dedup_key");

-- CreateIndex
CREATE INDEX "tracking_events_shipment_id_event_time_idx" ON "tracking_events"("shipment_id", "event_time");

-- CreateIndex
CREATE INDEX "tracking_events_canonical_code_idx" ON "tracking_events"("canonical_code");

-- CreateIndex
CREATE UNIQUE INDEX "external_tracking_events_provider_provider_event_id_key" ON "external_tracking_events"("provider", "provider_event_id");

-- CreateIndex
CREATE INDEX "pickups_shipment_id_idx" ON "pickups"("shipment_id");

-- CreateIndex
CREATE INDEX "deliveries_shipment_id_idx" ON "deliveries"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "storage_locations_warehouse_id_code_key" ON "storage_locations"("warehouse_id", "code");

-- CreateIndex
CREATE INDEX "package_movements_package_id_idx" ON "package_movements"("package_id");

-- CreateIndex
CREATE UNIQUE INDEX "manifest_items_manifest_id_package_id_key" ON "manifest_items"("manifest_id", "package_id");

-- CreateIndex
CREATE UNIQUE INDEX "customs_cases_shipment_id_key" ON "customs_cases"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_current_version_id_key" ON "documents"("current_version_id");

-- CreateIndex
CREATE INDEX "documents_shipment_id_idx" ON "documents"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_versions_document_id_version_number_key" ON "document_versions"("document_id", "version_number");

-- CreateIndex
CREATE INDEX "charges_shipment_id_idx" ON "charges"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_organisation_id_idx" ON "invoices"("organisation_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_provider_payment_id_key" ON "payments"("provider", "provider_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_events_provider_event_id_key" ON "payment_events"("provider_event_id");

-- CreateIndex
CREATE INDEX "claims_shipment_id_idx" ON "claims"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "returns_return_shipment_id_key" ON "returns"("return_shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "support_links_zendesk_ticket_id_key" ON "support_links"("zendesk_ticket_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_pages_slug_key" ON "content_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "content_pages_current_policy_version_id_key" ON "content_pages"("current_policy_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_versions_content_page_id_version_number_key" ON "policy_versions"("content_page_id", "version_number");

-- CreateIndex
CREATE INDEX "audit_events_entity_type_entity_id_idx" ON "audit_events"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_events_actor_user_id_idx" ON "audit_events"("actor_user_id");

-- CreateIndex
CREATE INDEX "outbox_events_status_created_at_idx" ON "outbox_events"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "inbox_events_source_message_id_key" ON "inbox_events"("source", "message_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_hashed_key_key" ON "api_keys"("hashed_key");

-- AddForeignKey
ALTER TABLE "organisation_members" ADD CONSTRAINT "organisation_members_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_members" ADD CONSTRAINT "organisation_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_cards" ADD CONSTRAINT "rate_cards_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_rules" ADD CONSTRAINT "rate_rules_rate_card_id_fkey" FOREIGN KEY ("rate_card_id") REFERENCES "rate_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_lines" ADD CONSTRAINT "quote_lines_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_current_storage_location_id_fkey" FOREIGN KEY ("current_storage_location_id") REFERENCES "storage_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_correction_of_id_fkey" FOREIGN KEY ("correction_of_id") REFERENCES "tracking_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "storage_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_movements" ADD CONSTRAINT "package_movements_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manifests" ADD CONSTRAINT "manifests_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manifest_items" ADD CONSTRAINT "manifest_items_manifest_id_fkey" FOREIGN KEY ("manifest_id") REFERENCES "manifests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manifest_items" ADD CONSTRAINT "manifest_items_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manifest_items" ADD CONSTRAINT "manifest_items_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_decisions" ADD CONSTRAINT "claim_decisions_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_links" ADD CONSTRAINT "support_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_attempts" ADD CONSTRAINT "delivery_attempts_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_versions" ADD CONSTRAINT "policy_versions_content_page_id_fkey" FOREIGN KEY ("content_page_id") REFERENCES "content_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_clients" ADD CONSTRAINT "api_clients_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_api_client_id_fkey" FOREIGN KEY ("api_client_id") REFERENCES "api_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_api_client_id_fkey" FOREIGN KEY ("api_client_id") REFERENCES "api_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
