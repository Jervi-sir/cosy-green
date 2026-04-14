import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";

import { env } from "./config/env";
import { authRoutes } from "./routes/auth";
import { deviceRoutes } from "./routes/devices";
import { rewardRoutes } from "./routes/rewards";
import { subscriptionRoutes } from "./routes/subscriptions";
import { trashSignalRoutes } from "./routes/trash-signals";
import { truckRoutes } from "./routes/truck";
import { userRoutes } from "./routes/user";

export async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(sensible);
  await app.register(jwt, { secret: env.JWT_SECRET });

  app.get("/health", async () => ({ status: "ok" }));

  await app.register(authRoutes);
  await app.register(deviceRoutes);
  await app.register(userRoutes);
  await app.register(subscriptionRoutes);
  await app.register(trashSignalRoutes);
  await app.register(truckRoutes);
  await app.register(rewardRoutes);

  return app;
}
