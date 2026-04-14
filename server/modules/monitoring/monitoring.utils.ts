import type { FastifyRequest } from "fastify";

import type { MonitoringActor, MonitoringPluginConfig } from "./monitoring.types";

const DEFAULT_REDACT_KEYS = [
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "secret",
];

export function createMonitoringConfig(
  partial: Partial<MonitoringPluginConfig> = {},
): MonitoringPluginConfig {
  return {
    enabled: partial.enabled ?? true,
    maxPayloadSize: partial.maxPayloadSize ?? 16_384,
    ignoredRoutes: partial.ignoredRoutes ?? ["/health", "/metrics", "/internal/monitoring"],
    redactKeys: partial.redactKeys ?? DEFAULT_REDACT_KEYS,
    retentionDays: partial.retentionDays ?? 30,
    retryableMethods: partial.retryableMethods ?? ["GET", "HEAD", "OPTIONS"],
  };
}

export function shouldIgnoreRoute(url: string, config: MonitoringPluginConfig) {
  return config.ignoredRoutes.some((route) => url === route || url.startsWith(route));
}

export function normalizeRoutePath(request: FastifyRequest) {
  return request.routeOptions?.url ?? null;
}

export function isBinaryLikeContentType(contentType?: string | null) {
  if (!contentType) {
    return false;
  }
  const value = contentType.toLowerCase();
  return (
    value.includes("multipart/form-data") ||
    value.includes("application/octet-stream") ||
    value.startsWith("image/") ||
    value.startsWith("audio/") ||
    value.startsWith("video/")
  );
}

function safelyStringify(value: unknown) {
  const seen = new WeakSet<object>();
  return JSON.stringify(
    value,
    (_key, currentValue) => {
      if (typeof currentValue === "bigint") {
        return currentValue.toString();
      }
      if (typeof currentValue === "function") {
        return `[Function ${currentValue.name || "anonymous"}]`;
      }
      if (currentValue instanceof Error) {
        return {
          name: currentValue.name,
          message: currentValue.message,
          stack: currentValue.stack,
        };
      }
      if (currentValue && typeof currentValue === "object") {
        if (seen.has(currentValue as object)) {
          return "[Circular]";
        }
        seen.add(currentValue as object);
      }
      return currentValue;
    },
  );
}

export function truncateString(value: string, maxPayloadSize: number) {
  if (value.length <= maxPayloadSize) {
    return value;
  }
  return `${value.slice(0, maxPayloadSize)}... [truncated ${value.length - maxPayloadSize} chars]`;
}

function redactRecursive(value: unknown, redactKeys: string[]): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => redactRecursive(entry, redactKeys));
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
    (acc, [key, entry]) => {
      const shouldRedact = redactKeys.some(
        (redactKey) => key.toLowerCase().includes(redactKey.toLowerCase()),
      );
      acc[key] = shouldRedact ? "[REDACTED]" : redactRecursive(entry, redactKeys);
      return acc;
    },
    {},
  );
}

export function safeSerialize(
  value: unknown,
  config: MonitoringPluginConfig,
  options: { contentType?: string | null } = {},
) {
  if (value == null) {
    return null;
  }

  if (isBinaryLikeContentType(options.contentType)) {
    return { type: "binary", note: "Binary or multipart payload omitted" };
  }

  if (Buffer.isBuffer(value)) {
    return { type: "buffer", byteLength: value.byteLength };
  }

  if (typeof value === "string") {
    const trimmed = truncateString(value, config.maxPayloadSize);
    try {
      const parsed = JSON.parse(trimmed);
      return redactRecursive(parsed, config.redactKeys);
    } catch {
      return trimmed;
    }
  }

  try {
    const stringified = safelyStringify(value);
    if (typeof stringified !== "string") {
      return null;
    }
    const trimmed = truncateString(stringified, config.maxPayloadSize);
    return redactRecursive(JSON.parse(trimmed), config.redactKeys);
  } catch {
    return { type: typeof value, note: "Payload could not be serialized safely" };
  }
}

export function parseResponsePayload(
  payload: unknown,
  config: MonitoringPluginConfig,
  contentType?: string | null,
) {
  if (typeof payload === "string" || Buffer.isBuffer(payload)) {
    return safeSerialize(payload, config, { contentType });
  }

  if (payload && typeof payload === "object") {
    return safeSerialize(payload, config, { contentType });
  }

  return payload ?? null;
}

export function getAuthenticatedUser(request: FastifyRequest): MonitoringActor | null {
  const user = (request as FastifyRequest & { user?: Record<string, unknown> }).user;
  if (!user) {
    return null;
  }

  return {
    id: typeof user.sub === "string" ? user.sub : undefined,
    role: typeof user.role === "string" ? user.role : undefined,
    email: typeof user.email === "string" ? user.email : undefined,
    truckId: typeof user.truckId === "string" ? user.truckId : null,
  };
}

export function durationFrom(startedAt: bigint) {
  return Math.max(0, Math.round(Number(process.hrtime.bigint() - startedAt) / 1_000_000));
}
