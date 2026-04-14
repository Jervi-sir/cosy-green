import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { demoRoute, rewardPoints } from "../constants";
import { db } from "../db";
import {
  pickupAssignments,
  qrScanEvents,
  rewardTransactions,
  trashSignals,
  truckLocationPings,
  trucks,
  users,
} from "../db/schema";
import { requireAuth, requireRole } from "../lib/auth";
import { getAssignment, getTruckForUserOrThrow } from "../lib/domain";
import { sendPushToUser } from "../lib/push";
import { serializeSignal } from "../lib/serializers";

const paramsSchema = z.object({ signalId: z.string().uuid() });
const locationSchema = z.object({
  truckId: z.string().uuid().optional(),
  latitude: z.number(),
  longitude: z.number(),
  heading: z.number().int().optional(),
  speed: z.number().int().optional(),
  recordedAt: z.coerce.date(),
  routeStep: z.number().int().min(0).max(demoRoute.length - 1).optional(),
});
const scanSchema = z.object({
  signalId: z.string().uuid().optional(),
  qrCode: z.string().min(1),
  scannedAt: z.coerce.date().optional(),
  truckId: z.string().uuid().optional(),
});

export const truckRoutes: FastifyPluginAsync = async (app) => {
  app.get("/truck/signals/new", async (request) => {
    await requireRole(request, "TRUCK");
    const items = await db.query.trashSignals.findMany({
      where: eq(trashSignals.status, "WAITING"),
      orderBy: desc(trashSignals.createdAt),
    });
    return { items: items.map((item) => serializeSignal(item, null)) };
  });

  app.get("/truck/signals/confirmed", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const items = await db.query.trashSignals.findMany({
      where: eq(trashSignals.assignedTruckId, truck.id),
      orderBy: desc(trashSignals.updatedAt),
    });
    return { items: items.map((item) => serializeSignal(item, truck)) };
  });

  app.post("/truck/signals/:signalId/confirm", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const params = paramsSchema.parse(request.params);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal) {
      throw app.httpErrors.notFound("Signal not found");
    }
    if (signal.status !== "WAITING") {
      throw app.httpErrors.badRequest("Signal cannot be confirmed");
    }

    const now = new Date();
    await db.transaction(async (tx) => {
      await tx.insert(pickupAssignments).values({
        signalId: signal.id,
        truckId: truck.id,
        driverUserId: authUser.sub,
      });
      await tx
        .update(trashSignals)
        .set({
          assignedTruckId: truck.id,
          status: "CONFIRMED",
          qrUnlocked: true,
          acceptedAt: now,
          updatedAt: now,
        })
        .where(eq(trashSignals.id, signal.id));
    });

    const updated = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, signal.id) });
    await sendPushToUser(signal.userId, {
      title: "تم تأكيد طلب النفايات",
      body: "أكدت الشاحنة أنها ستتجه لالتقاط طلبك. تم فتح رمز QR.",
      data: { signalId: signal.id, type: "signal_confirmed" },
    });
    return { signal: serializeSignal(updated!, truck) };
  });

  app.post("/truck/signals/:signalId/unassign", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const params = paramsSchema.parse(request.params);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal || signal.assignedTruckId !== truck.id) {
      throw app.httpErrors.notFound("Assignment not found");
    }

    await db.transaction(async (tx) => {
      await tx
        .update(pickupAssignments)
        .set({ cancelledAt: new Date() })
        .where(and(eq(pickupAssignments.signalId, signal.id), isNull(pickupAssignments.cancelledAt)));
      await tx
        .update(trashSignals)
        .set({
          assignedTruckId: null,
          status: "WAITING",
          qrUnlocked: false,
          acceptedAt: null,
          arrivedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(trashSignals.id, signal.id));
    });

    return { success: true };
  });

  app.post("/truck/signals/:signalId/arrive", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const params = paramsSchema.parse(request.params);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal || signal.assignedTruckId !== truck.id) {
      throw app.httpErrors.notFound("Signal not found");
    }
    if (!["CONFIRMED", "ARRIVING", "ARRIVED"].includes(signal.status)) {
      throw app.httpErrors.badRequest("Signal cannot transition to arrived");
    }

    await db.update(trashSignals).set({ status: "ARRIVED", arrivedAt: new Date(), updatedAt: new Date() }).where(eq(trashSignals.id, signal.id));
    const updated = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, signal.id) });
    await sendPushToUser(signal.userId, {
      title: "الشاحنة وصلت إلى طلبك",
      body: "يمكنك الآن عرض رمز QR لتأكيد استلام النفايات.",
      data: { signalId: signal.id, type: "signal_arrived" },
    });
    return { signal: serializeSignal(updated!, truck) };
  });

  app.get("/truck/route/current", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const activeSignals = await db.query.trashSignals.findMany({
      where: and(eq(trashSignals.assignedTruckId, truck.id), inArray(trashSignals.status, ["CONFIRMED", "ARRIVING", "ARRIVED"])),
      orderBy: desc(trashSignals.updatedAt),
    });
    return {
      truck: {
        id: truck.id,
        name: truck.name,
        plateNumber: truck.plateNumber,
        zone: truck.zone,
        currentRouteStep: truck.currentRouteStep,
        currentLocation: {
          latitude: truck.currentLatitude ? Number(truck.currentLatitude) : demoRoute[truck.currentRouteStep]?.latitude ?? null,
          longitude: truck.currentLongitude ? Number(truck.currentLongitude) : demoRoute[truck.currentRouteStep]?.longitude ?? null,
        },
      },
      route: demoRoute,
      activePickupIds: activeSignals.map((signal) => signal.id),
    };
  });

  app.post("/truck/location", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const body = locationSchema.parse(request.body);
    await db.transaction(async (tx) => {
      await tx.insert(truckLocationPings).values({
        truckId: truck.id,
        latitude: String(body.latitude),
        longitude: String(body.longitude),
        heading: body.heading,
        speed: body.speed,
        routeStep: body.routeStep,
        recordedAt: body.recordedAt,
      });
      await tx
        .update(trucks)
        .set({
          currentLatitude: String(body.latitude),
          currentLongitude: String(body.longitude),
          currentRouteStep: body.routeStep ?? truck.currentRouteStep,
          updatedAt: new Date(),
        })
        .where(eq(trucks.id, truck.id));

      const latestAssignedSignal = await tx.query.trashSignals.findFirst({
        where: and(eq(trashSignals.assignedTruckId, truck.id), inArray(trashSignals.status, ["CONFIRMED", "ARRIVING", "ARRIVED"])),
        orderBy: desc(trashSignals.updatedAt),
      });

      if (latestAssignedSignal) {
        const nextStatus = (body.routeStep ?? truck.currentRouteStep) >= demoRoute.length - 1 ? "ARRIVED" : "ARRIVING";
        const shouldNotifyArrival =
          latestAssignedSignal.status !== "ARRIVED" && nextStatus === "ARRIVED";
        await tx
          .update(trashSignals)
          .set({
            status: nextStatus,
            arrivedAt: nextStatus === "ARRIVED" ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(trashSignals.id, latestAssignedSignal.id));

        if (shouldNotifyArrival) {
          await sendPushToUser(latestAssignedSignal.userId, {
            title: "الشاحنة أصبحت قريبة",
            body: "وصلت الشاحنة إلى نقطة الالتقاط. افتح رمز QR الآن.",
            data: { signalId: latestAssignedSignal.id, type: "signal_arrived" },
          });
        }
      }
    });

    return { success: true };
  });

  app.get("/truck/location/live", async (request) => {
    const authUser = await requireAuth(request);
    const truck = authUser.role === "TRUCK"
      ? await getTruckForUserOrThrow(authUser.sub)
      : await (async () => {
          const latestSignal = await db.query.trashSignals.findFirst({
            where: eq(trashSignals.userId, authUser.sub),
            orderBy: desc(trashSignals.updatedAt),
          });
          if (latestSignal?.assignedTruckId) {
            return db.query.trucks.findFirst({ where: eq(trucks.id, latestSignal.assignedTruckId) });
          }
          return db.query.trucks.findFirst({ orderBy: desc(trucks.updatedAt) });
        })();
    if (!truck) {
      throw app.httpErrors.notFound("Truck not found");
    }
    const latestPing = await db.query.truckLocationPings.findFirst({
      where: eq(truckLocationPings.truckId, truck.id),
      orderBy: desc(truckLocationPings.recordedAt),
    });
    return {
      truckId: truck.id,
      truckName: truck.name,
      routeStep: truck.currentRouteStep,
      location: latestPing
        ? {
            latitude: Number(latestPing.latitude),
            longitude: Number(latestPing.longitude),
            heading: latestPing.heading,
            speed: latestPing.speed,
            recordedAt: latestPing.recordedAt,
          }
        : {
            latitude: truck.currentLatitude ? Number(truck.currentLatitude) : demoRoute[truck.currentRouteStep]?.latitude,
            longitude: truck.currentLongitude ? Number(truck.currentLongitude) : demoRoute[truck.currentRouteStep]?.longitude,
            recordedAt: null,
          },
      eta: "قريباً",
    };
  });

  app.post("/trash-signals/:signalId/simulate-scan", async (request) => {
    const authUser = await requireAuth(request);
    const params = paramsSchema.parse(request.params);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal) {
      throw app.httpErrors.notFound("Signal not found");
    }
    if (authUser.role === "USER" && signal.userId !== authUser.sub) {
      throw app.httpErrors.forbidden("Cannot simulate scan for this signal");
    }
    if (!signal.assignedTruckId) {
      throw app.httpErrors.badRequest("Signal is not assigned to a truck yet");
    }
    if (signal.status === "PICKED") {
      return { success: true, alreadyPicked: true };
    }

    const truck = await db.query.trucks.findFirst({ where: eq(trucks.id, signal.assignedTruckId) });
    if (!truck) {
      throw app.httpErrors.notFound("Assigned truck not found");
    }

    await db.transaction(async (tx) => {
      await tx.insert(qrScanEvents).values({
        signalId: signal.id,
        truckId: truck.id,
        scannedByUserId: authUser.sub,
        qrCode: signal.qrCode,
        payload: { simulated: true },
      });
      await tx
        .update(trashSignals)
        .set({ status: "PICKED", scannedAt: new Date(), updatedAt: new Date() })
        .where(eq(trashSignals.id, signal.id));
      await tx
        .update(users)
        .set({ points: sql`${users.points} + ${rewardPoints.pickupCompleted}`, updatedAt: new Date() })
        .where(eq(users.id, signal.userId));
      await tx.insert(rewardTransactions).values({
        userId: signal.userId,
        signalId: signal.id,
        points: rewardPoints.pickupCompleted,
        reason: "pickup_completed",
      });
      await tx
        .update(trucks)
        .set({
          pickedCount: sql`${trucks.pickedCount} + 1`,
          completedTrips: sql`${trucks.completedTrips} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(trucks.id, truck.id));
    });

    const updated = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, signal.id) });
    await sendPushToUser(signal.userId, {
      title: "تم التقاط النفايات",
      body: "تم تحديد الطلب كمستلم بواسطة الشاحنة وإضافة النقاط إلى حسابك.",
      data: { signalId: signal.id, type: "signal_picked" },
    });
    return { success: true, signal: serializeSignal(updated!, truck) };
  });

  app.post("/truck/scan", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const body = scanSchema.parse(request.body);
    const signal = body.signalId
      ? await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, body.signalId) })
      : await db.query.trashSignals.findFirst({ where: eq(trashSignals.qrCode, body.qrCode) });

    if (!signal || signal.assignedTruckId !== truck.id) {
      throw app.httpErrors.notFound("Assigned signal not found for this QR code");
    }
    if (signal.qrCode !== body.qrCode) {
      throw app.httpErrors.badRequest("QR code does not match the signal");
    }
    if (!["CONFIRMED", "ARRIVING", "ARRIVED"].includes(signal.status)) {
      throw app.httpErrors.badRequest("Signal is not in a scannable state");
    }

    await db.transaction(async (tx) => {
      await tx.insert(qrScanEvents).values({
        signalId: signal.id,
        truckId: truck.id,
        scannedByUserId: authUser.sub,
        qrCode: body.qrCode,
        payload: { scannedAt: (body.scannedAt ?? new Date()).toISOString() },
      });
      await tx
        .update(trashSignals)
        .set({ status: "PICKED", scannedAt: body.scannedAt ?? new Date(), updatedAt: new Date() })
        .where(eq(trashSignals.id, signal.id));
      await tx
        .update(users)
        .set({ points: sql`${users.points} + ${rewardPoints.pickupCompleted}`, updatedAt: new Date() })
        .where(eq(users.id, signal.userId));
      await tx.insert(rewardTransactions).values({
        userId: signal.userId,
        signalId: signal.id,
        points: rewardPoints.pickupCompleted,
        reason: "pickup_completed",
      });
      await tx
        .update(trucks)
        .set({
          pickedCount: sql`${trucks.pickedCount} + 1`,
          completedTrips: sql`${trucks.completedTrips} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(trucks.id, truck.id));
    });

    const updated = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, signal.id) });
    await sendPushToUser(signal.userId, {
      title: "تم التقاط النفايات",
      body: "تم تأكيد استلام النفايات وإضافة نقاط المكافأة إلى حسابك.",
      data: { signalId: signal.id, type: "signal_picked" },
    });
    return {
      success: true,
      signal: serializeSignal(updated!, truck),
      pointsAwarded: rewardPoints.pickupCompleted,
    };
  });

  app.get("/truck/scans/history", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const items = await db.query.qrScanEvents.findMany({
      where: eq(qrScanEvents.truckId, truck.id),
      orderBy: desc(qrScanEvents.createdAt),
    });
    return { items };
  });

  app.get("/truck/profile", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    return {
      id: truck.id,
      name: truck.name,
      plateNumber: truck.plateNumber,
      zone: truck.zone,
      driverUserId: authUser.sub,
    };
  });

  app.get("/truck/stats", async (request) => {
    const authUser = await requireRole(request, "TRUCK");
    const truck = await getTruckForUserOrThrow(authUser.sub);
    const assignedSignals = await db.query.trashSignals.findMany({
      where: eq(trashSignals.assignedTruckId, truck.id),
    });
    return {
      pickedCount: truck.pickedCount,
      completedTrips: truck.completedTrips,
      waitingCount: assignedSignals.filter((signal) => signal.status === "WAITING").length,
      confirmedCount: assignedSignals.filter((signal) => signal.status === "CONFIRMED").length,
      onTheWayCount: assignedSignals.filter((signal) => signal.status === "ARRIVING").length,
      arrivedCount: assignedSignals.filter((signal) => signal.status === "ARRIVED").length,
      pickedActiveCount: assignedSignals.filter((signal) => signal.status === "PICKED").length,
    };
  });
};
