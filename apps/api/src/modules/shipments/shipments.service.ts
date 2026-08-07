import { Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { randomUUID } from "node:crypto";

/**
 * Owns the Shipment lifecycle (spec section 24.1's module ownership rule -
 * other modules never write to the shipments table directly). Creation is
 * intentionally minimal at this stage: it proves the schema/API path end
 * to end. Booking-flow conversion (Booking -> Shipment), payment-gated
 * activation, and the outbox event this should publish on creation
 * (ShipmentCreated) are follow-up work once BillingModule exists to react
 * to it - see ADR 0001 section 3.3's event-vs-direct-call rule.
 */
@Injectable()
export class ShipmentsService {
  async getById(id: string) {
    const prisma = getPrismaClient();
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: { packages: true, trackingEvents: { orderBy: { eventTime: "desc" } } },
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }
    return shipment;
  }

  generateTrackingNumber(): string {
    // NT-<10 digits>-US, matching the existing frontend's expected shape.
    const digits = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
    return `NT-${digits}-US`;
  }
}
