import { and, count, desc, eq, isNull } from "drizzle-orm";

import { db } from "../db";
import {
  pickupAssignments,
  subscriptions,
  trashSignals,
  trucks,
  users,
} from "../db/schema";

export async function getUserOrThrow(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function getTruckForUserOrThrow(userId: string) {
  const user = await getUserOrThrow(userId);
  if (!user.truckId) {
    throw new Error("Truck user is not linked to a truck");
  }
  const truck = await db.query.trucks.findFirst({ where: eq(trucks.id, user.truckId) });
  if (!truck) {
    throw new Error("Truck not found");
  }
  return truck;
}

export async function getActiveSubscription(userId: string) {
  return db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
    orderBy: desc(subscriptions.createdAt),
  });
}

export async function nextSignalCode() {
  const [result] = await db.select({ value: count() }).from(trashSignals);
  const next = (result?.value ?? 0) + 1;
  return {
    publicId: `SG-${String(next).padStart(3, "0")}`,
    qrCode: `SG${String(next).padStart(3, "0")}2048`,
  };
}

export async function getAssignment(signalId: string) {
  return db.query.pickupAssignments.findFirst({
    where: and(eq(pickupAssignments.signalId, signalId), isNull(pickupAssignments.cancelledAt)),
  });
}
