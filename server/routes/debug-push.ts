import { FastifyPluginAsync } from "fastify";

import { getUserPushTokens, sendPushToUser } from "../lib/push";

const HARDCODED_USER_ID: string = "abc80cb2-55f2-49e7-bd1f-eb3904a63420";

export const debugPushRoutes: FastifyPluginAsync = async (app) => {
  app.post("/debug/push-test", async () => {
    const userId = HARDCODED_USER_ID;
    if (userId === "PUT-USER-ID-HERE") {
      throw app.httpErrors.badRequest(
        "Set HARDCODED_USER_ID in server/routes/debug-push.ts first",
      );
    }

    const tokens = await getUserPushTokens(userId);
    if (tokens.length === 0) {
      return {
        success: false,
        reason: "No push tokens found for hardcoded user",
        userId,
        tokens,
      };
    }

    await sendPushToUser(userId, {
      title: "Push Test",
      body: "This is a manual push test from the Fastify debug API.",
      data: {
        type: "debug_push_test",
        sentAt: new Date().toISOString(),
      },
    });

    return {
      success: true,
      userId,
      tokenCount: tokens.length,
      tokens,
    };
  });
};
