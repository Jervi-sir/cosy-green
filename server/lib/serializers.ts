import { InferSelectModel } from "drizzle-orm";

import { trucks, trashSignals, users } from "../db/schema";

type SignalRow = InferSelectModel<typeof trashSignals>;
type UserRow = InferSelectModel<typeof users>;
type TruckRow = InferSelectModel<typeof trucks>;

export function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }
  return value == null ? null : Number(value);
}

export function serializeUser(user: UserRow, truck?: TruckRow | null) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    venueType: user.venueType,
    points: user.points,
    truck: truck
      ? {
          id: truck.id,
          name: truck.name,
          plateNumber: truck.plateNumber,
          zone: truck.zone,
        }
      : null,
  };
}

export function serializeSignal(signal: SignalRow, truck?: TruckRow | null) {
  return {
    id: signal.id,
    publicId: signal.publicId,
    wasteTypes: signal.wasteTypes,
    note: signal.note,
    address: signal.address,
    coordinate: {
      latitude: toNumber(signal.latitude),
      longitude: toNumber(signal.longitude),
    },
    status: signal.status,
    qrCode: signal.qrCode,
    qrUnlocked: signal.qrUnlocked,
    acceptedByTruck: Boolean(signal.assignedTruckId),
    acceptedAt: signal.acceptedAt,
    arrivedAt: signal.arrivedAt,
    scannedAt: signal.scannedAt,
    createdAt: signal.createdAt,
    updatedAt: signal.updatedAt,
    truck: truck
      ? {
          id: truck.id,
          name: truck.name,
          plateNumber: truck.plateNumber,
          zone: truck.zone,
        }
      : null,
  };
}
