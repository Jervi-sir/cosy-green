import { and, desc, eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { db } from "../db";
import { trashSignals, trucks } from "../db/schema";
import { requireAuth, requireRole } from "../lib/auth";
import { nextSignalCode } from "../lib/domain";
import { serializeSignal } from "../lib/serializers";

const signalPayloadSchema = z.object({
  wasteTypes: z.array(z.string().min(1)).min(1),
  note: z.string().min(1),
  address: z.string().min(1),
  coordinate: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

const signalQuerySchema = z.object({
  status: z.string().optional(),
  mine: z.coerce.boolean().optional(),
});

export const trashSignalRoutes: FastifyPluginAsync = async (app) => {
  app.post("/trash-signals", async (request) => {
    const authUser = await requireRole(request, "USER");
    const body = signalPayloadSchema.parse(request.body);
    const ids = await nextSignalCode();
    const [created] = await db
      .insert(trashSignals)
      .values({
        publicId: ids.publicId,
        userId: authUser.sub,
        wasteTypes: body.wasteTypes,
        note: body.note,
        address: body.address,
        latitude: String(body.coordinate.latitude),
        longitude: String(body.coordinate.longitude),
        qrCode: ids.qrCode,
        status: "WAITING",
      })
      .returning();

    return { signal: serializeSignal(created, null) };
  });

  app.get("/trash-signals", async (request) => {
    const authUser = await requireAuth(request);
    const query = signalQuerySchema.parse(request.query);
    const filters = [];
    if (authUser.role === "USER" || query.mine) {
      filters.push(eq(trashSignals.userId, authUser.sub));
    }
    if (query.status) {
      filters.push(eq(trashSignals.status, query.status as never));
    }

    const rows = await db.query.trashSignals.findMany({
      where: filters.length ? and(...filters) : undefined,
      orderBy: desc(trashSignals.createdAt),
    });

    const truckIds = [...new Set(rows.map((row) => row.assignedTruckId).filter(Boolean))] as string[];
    const truckRows = await Promise.all(
      truckIds.map((id) => db.query.trucks.findFirst({ where: eq(trucks.id, id) })),
    );
    const truckMap = new Map(truckRows.filter(Boolean).map((truck) => [truck!.id, truck!]));

    return {
      items: rows.map((row) =>
        serializeSignal(
          row,
          row.assignedTruckId ? truckMap.get(row.assignedTruckId) ?? null : null,
        ),
      ),
    };
  });

  app.get("/trash-signals/:signalId", async (request) => {
    const authUser = await requireAuth(request);
    const params = z.object({ signalId: z.string().uuid() }).parse(request.params);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal) {
      throw app.httpErrors.notFound("Signal not found");
    }
    if (authUser.role === "USER" && signal.userId !== authUser.sub) {
      throw app.httpErrors.forbidden("Cannot view this signal");
    }

    const truck = signal.assignedTruckId
      ? await db.query.trucks.findFirst({ where: eq(trucks.id, signal.assignedTruckId) })
      : null;
    return { signal: serializeSignal(signal, truck) };
  });

  app.patch("/trash-signals/:signalId", async (request) => {
    const authUser = await requireRole(request, "USER");
    const params = z.object({ signalId: z.string().uuid() }).parse(request.params);
    const body = signalPayloadSchema.partial().parse(request.body);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal || signal.userId !== authUser.sub) {
      throw app.httpErrors.notFound("Signal not found");
    }
    if (signal.status !== "WAITING") {
      throw app.httpErrors.badRequest("Only waiting signals can be edited");
    }

    const [updated] = await db
      .update(trashSignals)
      .set({
        wasteTypes: body.wasteTypes ?? signal.wasteTypes,
        note: body.note ?? signal.note,
        address: body.address ?? signal.address,
        latitude: body.coordinate ? String(body.coordinate.latitude) : signal.latitude,
        longitude: body.coordinate ? String(body.coordinate.longitude) : signal.longitude,
        updatedAt: new Date(),
      })
      .where(eq(trashSignals.id, signal.id))
      .returning();

    return { signal: serializeSignal(updated, null) };
  });

  app.delete("/trash-signals/:signalId", async (request) => {
    const authUser = await requireRole(request, "USER");
    const params = z.object({ signalId: z.string().uuid() }).parse(request.params);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal || signal.userId !== authUser.sub) {
      throw app.httpErrors.notFound("Signal not found");
    }
    if (signal.status !== "WAITING") {
      throw app.httpErrors.badRequest("Only waiting signals can be deleted");
    }

    await db.delete(trashSignals).where(eq(trashSignals.id, signal.id));
    return { success: true };
  });

  app.get("/trash-signals/:signalId/qr", async (request) => {
    const authUser = await requireAuth(request);
    const params = z.object({ signalId: z.string().uuid() }).parse(request.params);
    const signal = await db.query.trashSignals.findFirst({ where: eq(trashSignals.id, params.signalId) });
    if (!signal) {
      throw app.httpErrors.notFound("Signal not found");
    }
    if (authUser.role === "USER" && signal.userId !== authUser.sub) {
      throw app.httpErrors.forbidden("Cannot access this QR code");
    }

    return {
      signalId: signal.id,
      qrCode: signal.qrUnlocked ? signal.qrCode : null,
      isUnlocked: signal.qrUnlocked,
      status: signal.status,
    };
  });
};
