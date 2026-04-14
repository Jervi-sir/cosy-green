import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { FastifyInstance, FastifyRequest } from "fastify";

import { env } from "../config/env";

export type AuthUser = {
  sub: string;
  role: "USER" | "TRUCK";
  truckId: string | null;
};

export async function hashPassword(value: string) {
  return bcrypt.hash(value, 10);
}

export async function verifyPassword(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export function createRefreshToken() {
  return randomUUID();
}

export function createRefreshExpiry() {
  const next = new Date();
  next.setDate(next.getDate() + env.REFRESH_TOKEN_DAYS);
  return next;
}

export async function signAccessToken(app: FastifyInstance, user: AuthUser) {
  return app.jwt.sign(user, { expiresIn: env.ACCESS_TOKEN_TTL });
}

export async function requireAuth(request: FastifyRequest) {
  await request.jwtVerify<AuthUser>();
  return request.user;
}

export async function requireRole(
  request: FastifyRequest,
  role: AuthUser["role"],
) {
  const user = await requireAuth(request);
  if (user.role !== role) {
    throw request.server.httpErrors.forbidden("Insufficient role");
  }
  return user;
}
