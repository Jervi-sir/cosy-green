import { and, eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { db } from "../db";
import { devicePushTokens } from "../db/schema";
import { requireAuth } from "../lib/auth";

const pushTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.string().min(1),
  deviceName: z.string().max(120).optional(),
});

export const deviceRoutes: FastifyPluginAsync = async (app) => {
  app.post("/devices/push-token", async (request) => {
    const authUser = await requireAuth(request);
    const body = pushTokenSchema.parse(request.body);

    const existing = await db.query.devicePushTokens.findFirst({
      where: eq(devicePushTokens.token, body.token),
    });

    if (existing) {
      await db
        .update(devicePushTokens)
        .set({
          userId: authUser.sub,
          platform: body.platform,
          deviceName: body.deviceName ?? existing.deviceName,
          updatedAt: new Date(),
          lastSeenAt: new Date(),
        })
        .where(eq(devicePushTokens.id, existing.id));
    } else {
      await db.insert(devicePushTokens).values({
        userId: authUser.sub,
        token: body.token,
        platform: body.platform,
        deviceName: body.deviceName,
      });
    }

    return { success: true };
  });

  app.delete("/devices/push-token", async (request) => {
    const authUser = await requireAuth(request);
    const body = pushTokenSchema.pick({ token: true }).parse(request.body);
    await db
      .delete(devicePushTokens)
      .where(and(eq(devicePushTokens.userId, authUser.sub), eq(devicePushTokens.token, body.token)));
    return { success: true };
  });
};
