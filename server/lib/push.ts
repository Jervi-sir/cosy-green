import { eq } from "drizzle-orm";

import { db } from "../db";
import { devicePushTokens } from "../db/schema";

type PushPayload = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export async function getUserPushTokens(userId: string) {
  const items = await db.query.devicePushTokens.findMany({
    where: eq(devicePushTokens.userId, userId),
  });
  return items.map((item) => item.token);
}

export async function sendPushToTokens(tokens: string[], payload: PushPayload) {
  if (tokens.length === 0) {
    return;
  }

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      tokens.map((token) => ({
        to: token,
        sound: "default",
        priority: "high",
        channelId: "cost-green-default",
        title: payload.title,
        body: payload.body,
        data: payload.data ?? {},
      })),
    ),
  }).catch(() => null);

  if (!response) {
    return;
  }

  if (!response.ok) {
    const message = await response.text().catch(() => "Push delivery failed");
    console.warn("[push] expo push request failed", message);
    return;
  }

  const result = await response.text().catch(() => "");
  console.log("[push] expo push accepted", result);
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  const tokens = await getUserPushTokens(userId);
  await sendPushToTokens(tokens, payload);
}
