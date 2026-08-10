import { NotFoundException } from "@nestjs/common";
import { getPrismaClient, type Prisma } from "@nauterio/database";
import { STAFF_ROLES, type AppRole } from "@nauterio/contracts";

export interface ShipmentScopeCaller {
  role: AppRole;
  userId: string;
  organisationId?: string;
}

/**
 * The Prisma `where` fragment that expresses "shipments this caller may
 * see" (SEC-003 recommendation #1: express scope in the query itself so
 * the database enforces it, rather than loading a record and checking
 * afterward). Shared by every module that reads a shipment or a
 * shipment-scoped child record (customs cases, pickups/deliveries), so the
 * same rule can't drift between them the way it did before this fix.
 */
export function shipmentScopeWhere(caller: ShipmentScopeCaller): Prisma.ShipmentWhereInput {
  if ((STAFF_ROLES as readonly string[]).includes(caller.role)) return {};
  return caller.organisationId
    ? { organisationId: caller.organisationId }
    : { ownerUserId: caller.userId };
}

/**
 * Loads a shipment the caller is scoped to see, or throws 404 - never 403,
 * so a customer probing shipment IDs cannot use the response code to learn
 * whether an ID exists (SEC-004's "existence oracle" note applies equally
 * here).
 */
export async function getScopedShipmentOrThrow(shipmentId: string, caller: ShipmentScopeCaller) {
  const prisma = getPrismaClient();
  const shipment = await prisma.shipment.findFirst({
    where: { id: shipmentId, ...shipmentScopeWhere(caller) },
  });
  if (!shipment) {
    throw new NotFoundException(`Shipment ${shipmentId} not found`);
  }
  return shipment;
}
