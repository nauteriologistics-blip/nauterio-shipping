ALTER TYPE "ShipmentRequestStatus" ADD VALUE IF NOT EXISTS 'AWAITING_PAYMENT' AFTER 'APPROVED';
ALTER TYPE "ShipmentRequestStatus" ADD VALUE IF NOT EXISTS 'PAID' AFTER 'AWAITING_PAYMENT';

-- One priced quote may fund only one booking. Without this constraint two
-- concurrent drafts could reuse a single anonymous quote and receive two
-- invoices from one commercial snapshot.
CREATE UNIQUE INDEX "bookings_quote_id_key" ON "bookings"("quote_id");

ALTER TABLE "payments" ADD COLUMN "provider_checkout_url" TEXT;
CREATE UNIQUE INDEX "payment_allocations_payment_id_invoice_id_key" ON "payment_allocations"("payment_id", "invoice_id");

ALTER TABLE "invoices" ADD COLUMN "booking_id" UUID, ADD COLUMN "quote_id" UUID;
CREATE UNIQUE INDEX "invoices_booking_id_key" ON "invoices"("booking_id");
CREATE INDEX "invoices_customer_user_id_id_idx" ON "invoices"("customer_user_id", "id");
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "shipments" ADD COLUMN "operational_hold" BOOLEAN NOT NULL DEFAULT false, ADD COLUMN "hold_reason" TEXT, ADD COLUMN "held_at" TIMESTAMP(3), ADD COLUMN "held_by_user_id" UUID;
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_held_by_user_id_fkey" FOREIGN KEY ("held_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_operational_hold_consistency_check" CHECK (
  ("operational_hold" = false AND "hold_reason" IS NULL AND "held_at" IS NULL)
  OR ("operational_hold" = true AND length(trim("hold_reason")) > 0 AND "held_at" IS NOT NULL)
);

CREATE TYPE "SupportConversationStatus" AS ENUM ('OPEN', 'WAITING_FOR_CUSTOMER', 'WAITING_FOR_AGENT', 'RESOLVED', 'CLOSED');
CREATE TYPE "SupportAuthorType" AS ENUM ('CUSTOMER', 'STAFF', 'BOT', 'SYSTEM');
CREATE TABLE "support_conversations" (
  "id" UUID NOT NULL DEFAULT uuidv7(), "customer_user_id" UUID NOT NULL, "shipment_id" UUID, "assigned_staff_user_id" UUID,
  "subject" TEXT NOT NULL, "status" "SupportConversationStatus" NOT NULL DEFAULT 'WAITING_FOR_AGENT',
  "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, CONSTRAINT "support_conversations_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "support_messages" (
  "id" UUID NOT NULL DEFAULT uuidv7(), "conversation_id" UUID NOT NULL, "author_user_id" UUID,
  "author_type" "SupportAuthorType" NOT NULL, "body" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "read_at" TIMESTAMP(3), CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "support_conversations" ADD CONSTRAINT "support_conversations_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_conversations" ADD CONSTRAINT "support_conversations_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "support_conversations" ADD CONSTRAINT "support_conversations_assigned_staff_user_id_fkey" FOREIGN KEY ("assigned_staff_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "support_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "support_conversations_customer_user_id_last_message_at_idx" ON "support_conversations"("customer_user_id", "last_message_at");
CREATE INDEX "support_conversations_status_last_message_at_idx" ON "support_conversations"("status", "last_message_at");
CREATE INDEX "support_messages_conversation_id_id_idx" ON "support_messages"("conversation_id", "id");
