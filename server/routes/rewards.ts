import { desc, eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";

import { db } from "../db";
import { rewardTransactions, users } from "../db/schema";
import { requireRole } from "../lib/auth";

export const rewardRoutes: FastifyPluginAsync = async (app) => {
  app.get("/rewards/points", async (request) => {
    const authUser = await requireRole(request, "USER");
    const user = await db.query.users.findFirst({ where: eq(users.id, authUser.sub) });
    if (!user) {
      throw app.httpErrors.notFound("User not found");
    }
    return {
      userId: user.id,
      points: user.points,
    };
  });

  app.get("/rewards/transactions", async (request) => {
    const authUser = await requireRole(request, "USER");
    const items = await db.query.rewardTransactions.findMany({
      where: eq(rewardTransactions.userId, authUser.sub),
      orderBy: desc(rewardTransactions.createdAt),
    });
    return { items };
  });
};
