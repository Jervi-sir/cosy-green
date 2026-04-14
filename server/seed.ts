import { eq } from "drizzle-orm";

import { demoRoute } from "./constants";
import { db } from "./db";
import {
  pickupAssignments,
  subscriptions,
  trashSignals,
  trucks,
  truckLocationPings,
  users,
} from "./db/schema";
import { hashPassword } from "./lib/auth";

export async function seedDemoData() {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, "user@cozygreen.app"),
  });
  if (existingUser) {
    return;
  }

  const passwordHash = await hashPassword("12345678");
  const [truck] = await db
    .insert(trucks)
    .values({
      name: "Oran Truck 1",
      plateNumber: "21345-118-16",
      zone: "Oran West",
      currentRouteStep: 3,
      currentLatitude: String(demoRoute[3].latitude),
      currentLongitude: String(demoRoute[3].longitude),
    })
    .returning();

  const [user] = await db
    .insert(users)
    .values({
      email: "user@cozygreen.app",
      passwordHash,
      fullName: "Demo User",
      role: "USER",
      venueType: "HOUSE",
      points: 30,
    })
    .returning();

  const [driver] = await db
    .insert(users)
    .values({
      email: "truck@cozygreen.app",
      passwordHash,
      fullName: "Demo Driver",
      role: "TRUCK",
      truckId: truck.id,
    })
    .returning();

  await db.insert(subscriptions).values({
    userId: user.id,
    plan: "FREE",
    status: "ACTIVE",
    price: 0,
  });

  const [signal] = await db
    .insert(trashSignals)
    .values({
    publicId: "SG-001",
    userId: user.id,
    assignedTruckId: truck.id,
    wasteTypes: ["بلاستيك"],
    note: "الأكياس جاهزة عند المدخل.",
    address: "بالقرب من مدخل الخدمة، وهران",
    latitude: String(35.7066),
    longitude: String(-0.6386),
    status: "ARRIVED",
    qrCode: "SG0012048",
    qrUnlocked: true,
    acceptedAt: new Date(),
    arrivedAt: new Date(),
    })
    .returning();

  await db.insert(pickupAssignments).values({
    signalId: signal.id,
    truckId: truck.id,
    driverUserId: driver.id,
  });

  await db.insert(truckLocationPings).values({
    truckId: truck.id,
    latitude: String(demoRoute[3].latitude),
    longitude: String(demoRoute[3].longitude),
    routeStep: 3,
    recordedAt: new Date(),
  });
}
