import "dotenv/config";
import { getPrismaClient, disconnectPrisma } from "../src/index";
import { SERVICES } from "@nauterio/contracts";

/**
 * Synthetic seed data for development and testing environment.
 * Complies with spec section 32.2 (no production data in dev).
 * Idempotent (upserts or skip-if-exists).
 */
async function main() {
  const prisma = getPrismaClient();

  // 1. Seed Services
  for (const service of SERVICES) {
    await prisma.service.upsert({
      where: { id: mapServiceId(service.id) },
      update: { name: service.name, transitLabel: service.transitLabel, description: service.description },
      create: {
        id: mapServiceId(service.id),
        name: service.name,
        transitLabel: service.transitLabel,
        description: service.description,
      },
    });
  }
  console.log(`Seeded ${SERVICES.length} services.`);

  // 2. Seed Warehouses
  const warehouseMilan = await prisma.warehouse.upsert({
    where: { id: "00000000-0000-7000-8000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000001",
      name: "Nauterio Hub Milan",
      countryCode: "IT",
      city: "Milano",
    },
  });

  const warehouseNYC = await prisma.warehouse.upsert({
    where: { id: "00000000-0000-7000-8000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000002",
      name: "Nauterio Gateway New York",
      countryCode: "US",
      city: "Jamaica",
    },
  });
  console.log("Seeded warehouses:", warehouseMilan.name, warehouseNYC.name);

  // 3. Seed Users (Dev tokens match local auth sub)
  const devUser = await prisma.user.upsert({
    where: { cognitoSub: "local-dev-user-id" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000100",
      cognitoSub: "local-dev-user-id",
      email: "customer@example.com",
      emailVerifiedAt: new Date(),
      status: "ACTIVE",
      fullName: "Dev Customer",
      preferredLanguage: "en",
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { cognitoSub: "local-staff-user-id" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000101",
      cognitoSub: "local-staff-user-id",
      email: "operator@nauterio.com",
      emailVerifiedAt: new Date(),
      status: "ACTIVE",
      fullName: "Warehouse Operator",
      staffRole: "LOGISTICS_OPERATOR",
      staffWarehouseIds: [warehouseMilan.id],
      preferredLanguage: "it",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { cognitoSub: "local-admin-user-id" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000102",
      cognitoSub: "local-admin-user-id",
      email: "admin@nauterio.com",
      emailVerifiedAt: new Date(),
      status: "ACTIVE",
      fullName: "System Admin",
      staffRole: "SYSTEM_ADMINISTRATOR",
      preferredLanguage: "en",
    },
  });
  console.log("Seeded 3 users (customer, operator, admin).");

  // 4. Seed Organisation
  const org = await prisma.organisation.upsert({
    where: { id: "00000000-0000-7000-8000-000000000200" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000200",
      legalName: "Acme Logistics S.r.l.",
      tradingName: "Acme Express",
      vatNumber: "IT12345678901",
      eoriNumber: "IT12345678901EORI",
      status: "APPROVED",
      creditLimitAmountMinorUnits: BigInt(500000), // €5,000.00
      creditLimitCurrency: "EUR",
    },
  });

  await prisma.organisationMember.upsert({
    where: { organisationId_userId: { organisationId: org.id, userId: devUser.id } },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000201",
      organisationId: org.id,
      userId: devUser.id,
      role: "ORGANISATION_ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("Seeded organisation:", org.legalName);

  // 5. Seed Addresses
  await prisma.address.upsert({
    where: { id: "00000000-0000-7000-8000-000000000300" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000300",
      userId: devUser.id,
      organisationId: org.id,
      line1: "Via Monte Napoleone 8",
      city: "Milano",
      region: "Lombardia",
      postalCode: "20121",
      countryCode: "IT",
      providerValidated: true,
      customerConfirmed: true,
    },
  });

  await prisma.address.upsert({
    where: { id: "00000000-0000-7000-8000-000000000301" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000301",
      userId: devUser.id,
      organisationId: org.id,
      line1: "350 5th Ave",
      line2: "Suite 500",
      city: "New York",
      region: "NY",
      postalCode: "10118",
      countryCode: "US",
      providerValidated: true,
      customerConfirmed: true,
    },
  });

  // 6. Seed Sample Shipments & Tracking Events
  await seedSampleShipment(prisma, devUser.id, org.id, {
    trackingNumber: "NT-782914-US",
    serviceId: "AIR_EXPRESS",
    sender: { city: "Milano", countryCode: "IT" },
    receiver: { city: "New York", countryCode: "US" },
    lifecycleStatus: "ACTIVE",
    weightKg: 3.2,
    events: [
      { code: "SHIPMENT_CREATED", en: "Shipment created", it: "Spedizione creata", hoursAgo: 54 },
      { code: "PACKAGE_COLLECTED", en: "Package collected", it: "Pacco ritirato", hoursAgo: 48 },
      { code: "DEPARTED_ORIGIN", en: "Departed Italy", it: "Partito dall'Italia", hoursAgo: 26 },
      { code: "INTERNATIONAL_TRANSIT", en: "In international transit", it: "In transito internazionale", hoursAgo: 4 },
    ],
  });

  await seedSampleShipment(prisma, devUser.id, org.id, {
    trackingNumber: "NT-902148-US",
    serviceId: "AIR_ECONOMY",
    sender: { city: "Florence", countryCode: "IT" },
    receiver: { city: "Chicago", countryCode: "US" },
    lifecycleStatus: "ACTION_REQUIRED",
    weightKg: 14.5,
    actionRequiredReason: "Missing commercial invoice copy for FDA clearance of wine goods.",
    events: [
      { code: "SHIPMENT_CREATED", en: "Shipment created", it: "Spedizione creata", hoursAgo: 72 },
      { code: "ARRIVED_DESTINATION", en: "Arrived in the United States", it: "Arrivato negli Stati Uniti", hoursAgo: 26 },
      { code: "CUSTOMS_ACTION_REQUIRED", en: "Customs action required", it: "Azione doganale richiesta", hoursAgo: 6 },
    ],
  });

  await seedSampleShipment(prisma, devUser.id, org.id, {
    trackingNumber: "NT-112349-US",
    serviceId: "AIR_ECONOMY",
    sender: { city: "Venice", countryCode: "IT" },
    receiver: { city: "Los Angeles", countryCode: "US" },
    lifecycleStatus: "DELIVERED",
    weightKg: 1.8,
    deliveredDaysAgo: 3,
    events: [
      { code: "SHIPMENT_CREATED", en: "Shipment created", it: "Spedizione creata", hoursAgo: 144 },
      { code: "DEPARTED_ORIGIN", en: "Departed Italy", it: "Partito dall'Italia", hoursAgo: 120 },
      { code: "ARRIVED_DESTINATION", en: "Arrived in the United States", it: "Arrivato negli Stati Uniti", hoursAgo: 96 },
      { code: "OUT_FOR_DELIVERY", en: "Out for delivery", it: "In consegna", hoursAgo: 76 },
      { code: "DELIVERED", en: "Delivered", it: "Consegnato", hoursAgo: 72 },
    ],
  });

  console.log("Seed complete.");
  await disconnectPrisma();
}

interface SampleShipmentSpec {
  trackingNumber: string;
  serviceId: "AIR_EXPRESS" | "AIR_ECONOMY" | "OCEAN_FREIGHT";
  sender: { city: string; countryCode: string };
  receiver: { city: string; countryCode: string };
  lifecycleStatus: "ACTIVE" | "ACTION_REQUIRED" | "DELIVERED";
  weightKg: number;
  actionRequiredReason?: string;
  deliveredDaysAgo?: number;
  events: { code: string; en: string; it: string; hoursAgo: number }[];
}

async function seedSampleShipment(
  prisma: ReturnType<typeof getPrismaClient>,
  userId: string,
  organisationId: string,
  spec: SampleShipmentSpec
) {
  const existing = await prisma.shipment.findUnique({ where: { trackingNumber: spec.trackingNumber } });
  if (existing) {
    console.log(`Shipment ${spec.trackingNumber} already seeded, skipping.`);
    return;
  }

  const now = Date.now();
  const shipment = await prisma.shipment.create({
    data: {
      trackingNumber: spec.trackingNumber,
      serviceId: spec.serviceId,
      ownerUserId: userId,
      organisationId: organisationId,
      senderNameSnapshot: "Acme Italy S.r.l.",
      senderAddressSnapshot: spec.sender,
      receiverNameSnapshot: "Acme USA Inc.",
      receiverAddressSnapshot: spec.receiver,
      totalActualWeightKg: spec.weightKg,
      totalVolumetricWeightKg: spec.weightKg,
      totalChargeableWeightKg: spec.weightKg,
      declaredValueAmountMinorUnits: BigInt(30000),
      declaredValueCurrency: "EUR",
      totalAmountMinorUnits: BigInt(11300),
      currency: "EUR",
      lifecycleStatus: spec.lifecycleStatus,
      actionRequiredReason: spec.actionRequiredReason,
      deliveredAt: spec.deliveredDaysAgo !== undefined ? new Date(now - spec.deliveredDaysAgo * 86_400_000) : undefined,
    },
  });

  for (const event of spec.events) {
    await prisma.trackingEvent.create({
      data: {
        shipmentId: shipment.id,
        canonicalCode: event.code,
        publicTitleEn: event.en,
        publicTitleIt: event.it,
        sourceType: "SYSTEM_AUTOMATION",
        eventTime: new Date(now - event.hoursAgo * 3_600_000),
        locationJson: { city: event.hoursAgo < 12 ? spec.receiver.city : spec.sender.city },
      },
    });
  }

  console.log(`Seeded shipment ${spec.trackingNumber} with ${spec.events.length} tracking events.`);
}

function mapServiceId(id: string): "AIR_EXPRESS" | "AIR_ECONOMY" | "OCEAN_FREIGHT" {
  const map = { "air-express": "AIR_EXPRESS", "air-economy": "AIR_ECONOMY", "ocean-freight": "OCEAN_FREIGHT" } as const;
  return map[id as keyof typeof map];
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
