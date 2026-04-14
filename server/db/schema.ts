import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const appRoleEnum = pgEnum("app_role", ["USER", "TRUCK"]);
export const venueTypeEnum = pgEnum("venue_type", ["HOUSE", "RESTAURANT"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["FREE", "PAID"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["ACTIVE", "PENDING", "CANCELLED"]);
export const trashStatusEnum = pgEnum("trash_status", [
  "WAITING",
  "CONFIRMED",
  "ARRIVING",
  "ARRIVED",
  "PICKED",
  "CANCELLED",
]);
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "SUCCEEDED", "FAILED"]);

export const trucks = pgTable("trucks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  plateNumber: varchar("plate_number", { length: 64 }).notNull().unique(),
  zone: varchar("zone", { length: 120 }).notNull(),
  pickedCount: integer("picked_count").notNull().default(0),
  completedTrips: integer("completed_trips").notNull().default(0),
  currentRouteStep: integer("current_route_step").notNull().default(0),
  currentLatitude: numeric("current_latitude", { precision: 10, scale: 6 }),
  currentLongitude: numeric("current_longitude", { precision: 10, scale: 6 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  role: appRoleEnum("role").notNull(),
  venueType: venueTypeEnum("venue_type"),
  points: integer("points").notNull().default(0),
  truckId: uuid("truck_id").references(() => trucks.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  plan: subscriptionPlanEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("ACTIVE"),
  price: integer("price").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  paymentIntentId: varchar("payment_intent_id", { length: 120 }).notNull().unique(),
  paymentMethod: varchar("payment_method", { length: 80 }).notNull(),
  amount: integer("amount").notNull(),
  status: paymentStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});

export const trashSignals = pgTable("trash_signals", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicId: varchar("public_id", { length: 32 }).notNull().unique(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  assignedTruckId: uuid("assigned_truck_id").references(() => trucks.id, { onDelete: "set null" }),
  wasteTypes: text("waste_types").array().notNull(),
  note: text("note").notNull(),
  address: text("address").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 6 }).notNull(),
  status: trashStatusEnum("status").notNull().default("WAITING"),
  qrCode: varchar("qr_code", { length: 64 }).notNull().unique(),
  qrUnlocked: boolean("qr_unlocked").notNull().default(false),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  arrivedAt: timestamp("arrived_at", { withTimezone: true }),
  scannedAt: timestamp("scanned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pickupAssignments = pgTable("pickup_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  signalId: uuid("signal_id").notNull().references(() => trashSignals.id, { onDelete: "cascade" }).unique(),
  truckId: uuid("truck_id").notNull().references(() => trucks.id, { onDelete: "cascade" }),
  driverUserId: uuid("driver_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }).notNull().defaultNow(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
});

export const qrScanEvents = pgTable("qr_scan_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  signalId: uuid("signal_id").notNull().references(() => trashSignals.id, { onDelete: "cascade" }),
  truckId: uuid("truck_id").notNull().references(() => trucks.id, { onDelete: "cascade" }),
  scannedByUserId: uuid("scanned_by_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  qrCode: varchar("qr_code", { length: 64 }).notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rewardTransactions = pgTable("reward_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  signalId: uuid("signal_id").references(() => trashSignals.id, { onDelete: "set null" }),
  points: integer("points").notNull(),
  reason: varchar("reason", { length: 120 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const devicePushTokens = pgTable("device_push_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  platform: varchar("platform", { length: 20 }).notNull(),
  deviceName: varchar("device_name", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
});

export const truckLocationPings = pgTable("truck_location_pings", {
  id: uuid("id").defaultRandom().primaryKey(),
  truckId: uuid("truck_id").notNull().references(() => trucks.id, { onDelete: "cascade" }),
  latitude: numeric("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 6 }).notNull(),
  heading: integer("heading"),
  speed: integer("speed"),
  routeStep: integer("route_step"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export { monitoringRequests } from "../modules/monitoring/monitoring.schema";
