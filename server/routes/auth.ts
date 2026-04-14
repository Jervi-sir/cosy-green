import { eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { db } from "../db";
import { refreshTokens, trucks, users } from "../db/schema";
import {
  createRefreshExpiry,
  createRefreshToken,
  hashPassword,
  requireAuth,
  signAccessToken,
  verifyPassword,
} from "../lib/auth";
import { getActiveSubscription } from "../lib/domain";
import { serializeUser } from "../lib/serializers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(120),
  role: z.enum(["USER", "TRUCK"]),
  truckName: z.string().min(2).max(120).optional(),
  plateNumber: z.string().min(2).max(64).optional(),
  zone: z.string().min(2).max(120).optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/auth/register", async (request) => {
    const body = registerSchema.parse(request.body);
    const existing = await db.query.users.findFirst({ where: eq(users.email, body.email) });
    if (existing) {
      throw app.httpErrors.conflict("Email is already registered");
    }

    const passwordHash = await hashPassword(body.password);
    let truck = null;
    if (body.role === "TRUCK") {
      if (!body.truckName || !body.plateNumber || !body.zone) {
        throw app.httpErrors.badRequest("Truck registration requires truck details");
      }
      [truck] = await db
        .insert(trucks)
        .values({
          name: body.truckName,
          plateNumber: body.plateNumber,
          zone: body.zone,
        })
        .returning();
    }

    const [user] = await db
      .insert(users)
      .values({
        email: body.email,
        passwordHash,
        fullName: body.fullName,
        role: body.role,
        truckId: truck?.id ?? null,
      })
      .returning();

    const accessToken = await signAccessToken(app, {
      sub: user.id,
      role: user.role,
      truckId: user.truckId,
    });
    const refreshToken = createRefreshToken();
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: createRefreshExpiry(),
    });

    return {
      accessToken,
      refreshToken,
      role: user.role,
      user: serializeUser(user, truck),
    };
  });

  app.post("/auth/login", async (request) => {
    const { email, password } = loginSchema.parse(request.body);
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
      throw app.httpErrors.unauthorized("Invalid credentials");
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw app.httpErrors.unauthorized("Invalid credentials");
    }

    const truck = user.truckId
      ? await db.query.trucks.findFirst({ where: eq(trucks.id, user.truckId) })
      : null;
    const accessToken = await signAccessToken(app, {
      sub: user.id,
      role: user.role,
      truckId: user.truckId,
    });
    const refreshToken = createRefreshToken();
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: createRefreshExpiry(),
    });

    return {
      accessToken,
      refreshToken,
      role: user.role,
      user: serializeUser(user, truck),
    };
  });

  app.post("/auth/refresh", async (request) => {
    const { refreshToken } = refreshSchema.parse(request.body);
    const session = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, refreshToken),
    });
    if (!session || session.expiresAt < new Date()) {
      throw app.httpErrors.unauthorized("Refresh token is invalid or expired");
    }

    const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
    if (!user) {
      throw app.httpErrors.unauthorized("User not found");
    }

    const accessToken = await signAccessToken(app, {
      sub: user.id,
      role: user.role,
      truckId: user.truckId,
    });

    return { accessToken };
  });

  app.post("/auth/logout", async (request) => {
    const { refreshToken } = refreshSchema.parse(request.body);
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    return { success: true };
  });

  app.get("/me", async (request) => {
    const authUser = await requireAuth(request);
    const user = await db.query.users.findFirst({ where: eq(users.id, authUser.sub) });
    if (!user) {
      throw app.httpErrors.notFound("User not found");
    }

    const truck = user.truckId
      ? await db.query.trucks.findFirst({ where: eq(trucks.id, user.truckId) })
      : null;
    const subscription = await getActiveSubscription(user.id);

    return {
      user: serializeUser(user, truck),
      subscription,
    };
  });
};
