import { desc, eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { db } from "../db";
import { subscriptions, trashSignals, trucks, users } from "../db/schema";
import { requireAuth, requireRole } from "../lib/auth";
import { serializeSignal, serializeUser } from "../lib/serializers";

const updateProfileSchema = z.object({
  venueType: z.enum(["HOUSE", "RESTAURANT"]).optional(),
  fullName: z.string().min(2).max(120).optional(),
});

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.patch("/me/profile", async (request) => {
    const authUser = await requireAuth(request);
    const body = updateProfileSchema.parse(request.body);
    await db.update(users).set({ ...body, updatedAt: new Date() }).where(eq(users.id, authUser.sub));
    const user = await db.query.users.findFirst({ where: eq(users.id, authUser.sub) });
    if (!user) {
      throw app.httpErrors.notFound("User not found");
    }
    const truck = user.truckId
      ? await db.query.trucks.findFirst({ where: eq(trucks.id, user.truckId) })
      : null;
    return { user: serializeUser(user, truck) };
  });

  app.get("/me/dashboard", async (request) => {
    const authUser = await requireRole(request, "USER");
    const user = await db.query.users.findFirst({ where: eq(users.id, authUser.sub) });
    if (!user) {
      throw app.httpErrors.notFound("User not found");
    }

    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, authUser.sub),
      orderBy: desc(subscriptions.createdAt),
    });
    const signals = await db.query.trashSignals.findMany({
      where: eq(trashSignals.userId, authUser.sub),
      orderBy: desc(trashSignals.createdAt),
      limit: 10,
    });
    const truckIds = [...new Set(signals.map((signal) => signal.assignedTruckId).filter(Boolean))] as string[];
    const truckMap = new Map<string, Awaited<ReturnType<typeof db.query.trucks.findFirst>>>();
    await Promise.all(
      truckIds.map(async (truckId) => {
        const truck = await db.query.trucks.findFirst({ where: eq(trucks.id, truckId) });
        if (truck) {
          truckMap.set(truckId, truck);
        }
      }),
    );

    return {
      user: serializeUser(user, null),
      subscription,
      activeSignals: signals.map((signal) => serializeSignal(signal, signal.assignedTruckId ? truckMap.get(signal.assignedTruckId) ?? null : null)),
      latestTruckEta: signals.some((signal) => signal.status === "ARRIVED") ? "وصل" : "قريباً",
    };
  });
};
