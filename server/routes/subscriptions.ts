import { and, desc, eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { subscriptionPlans } from "../constants";
import { db } from "../db";
import { payments, subscriptions, users } from "../db/schema";
import { requireAuth, requireRole } from "../lib/auth";

const selectSubscriptionSchema = z.object({
  planId: z.enum(["free", "paid"]),
  venueType: z.enum(["HOUSE", "RESTAURANT"]),
});

const paymentIntentSchema = z.object({
  planId: z.enum(["free", "paid"]),
  paymentMethod: z.string().min(2),
});

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1),
});

export const subscriptionRoutes: FastifyPluginAsync = async (app) => {
  app.get("/subscriptions/plans", async () => ({ plans: subscriptionPlans }));

  app.post("/subscriptions/select", async (request) => {
    const authUser = await requireRole(request, "USER");
    const body = selectSubscriptionSchema.parse(request.body);
    const selectedPlan = subscriptionPlans.find((plan) => plan.id === body.planId);
    if (!selectedPlan) {
      throw app.httpErrors.badRequest("Plan not found");
    }

    await db.update(users).set({ venueType: body.venueType, updatedAt: new Date() }).where(eq(users.id, authUser.sub));
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId: authUser.sub,
        plan: body.planId === "free" ? "FREE" : "PAID",
        status: body.planId === "free" ? "ACTIVE" : "PENDING",
        price: selectedPlan.price,
      })
      .returning();

    return { subscription };
  });

  app.post("/payments/intent", async (request) => {
    const authUser = await requireRole(request, "USER");
    const body = paymentIntentSchema.parse(request.body);
    const selectedPlan = subscriptionPlans.find((plan) => plan.id === body.planId);
    if (!selectedPlan) {
      throw app.httpErrors.badRequest("Plan not found");
    }

    const latestSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, authUser.sub),
      orderBy: desc(subscriptions.createdAt),
    });

    const paymentIntentId = `pi_${randomUUID()}`;
    const [payment] = await db
      .insert(payments)
      .values({
        userId: authUser.sub,
        subscriptionId: latestSubscription?.id ?? null,
        paymentIntentId,
        paymentMethod: body.paymentMethod,
        amount: selectedPlan.price,
      })
      .returning();

    return {
      paymentIntentId,
      payment,
      checkout: {
        amount: selectedPlan.price,
        currency: "DZD",
      },
    };
  });

  app.post("/payments/confirm", async (request) => {
    const authUser = await requireRole(request, "USER");
    const body = confirmPaymentSchema.parse(request.body);
    const payment = await db.query.payments.findFirst({
      where: and(
        eq(payments.userId, authUser.sub),
        eq(payments.paymentIntentId, body.paymentIntentId),
      ),
    });
    if (!payment) {
      throw app.httpErrors.notFound("Payment intent not found");
    }

    await db.update(payments).set({ status: "SUCCEEDED", confirmedAt: new Date() }).where(eq(payments.id, payment.id));

    const latestSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, authUser.sub),
      orderBy: desc(subscriptions.createdAt),
    });
    if (latestSubscription) {
      await db.update(subscriptions).set({ status: "ACTIVE" }).where(eq(subscriptions.id, latestSubscription.id));
    }

    return { success: true, paymentIntentId: body.paymentIntentId };
  });

  app.get("/payments/history", async (request) => {
    const authUser = await requireRole(request, "USER");
    const items = await db.query.payments.findMany({
      where: eq(payments.userId, authUser.sub),
      orderBy: desc(payments.createdAt),
    });
    return { items };
  });
};
