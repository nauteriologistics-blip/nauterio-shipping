import "dotenv/config";
import { getPrismaClient, disconnectPrisma } from "../src/index";
import { SERVICES } from "@nauterio/contracts";

/**
 * Synthetic fixtures only (spec section 32.2: production data must never be
 * copied into development). Safe to run repeatedly - upserts, not inserts.
 */
async function main() {
  const prisma = getPrismaClient();

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

  const warehouse = await prisma.warehouse.upsert({
    where: { id: "00000000-0000-7000-8000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-7000-8000-000000000001",
      name: "Nauterio Hub Milan",
      countryCode: "IT",
      city: "Milano",
    },
  });
  console.log("Seeded warehouse:", warehouse.name);

  await seedSampleShipment(prisma, {
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

  await seedSampleShipment(prisma, {
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

  await seedSampleShipment(prisma, {
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
      senderNameSnapshot: "Sample Shipper",
      senderAddressSnapshot: spec.sender,
      receiverNameSnapshot: "Sample Recipient",
      receiverAddressSnapshot: spec.receiver,
      totalActualWeightKg: spec.weightKg,
      totalVolumetricWeightKg: spec.weightKg,
      totalChargeableWeightKg: spec.weightKg,
      declaredValueAmountMinorUnits: 30000,
      declaredValueCurrency: "EUR",
      totalAmountMinorUnits: 11300,
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
