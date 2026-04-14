import type { FastifyReply, FastifyRequest } from "fastify";

import { MonitoringRepository } from "./monitoring.repository";
import {
  durationFrom,
  getAuthenticatedUser,
  normalizeRoutePath,
  parseResponsePayload,
  safeSerialize,
} from "./monitoring.utils";
import type {
  MonitoringCaptureState,
  MonitoringListFilters,
  MonitoringRetryResult,
  MonitoringServiceDeps,
} from "./monitoring.types";

export class MonitoringService {
  constructor(
    private readonly deps: MonitoringServiceDeps,
    private readonly repository = new MonitoringRepository(),
  ) {}

  createInitialCapture(request: FastifyRequest): MonitoringCaptureState {
    return {
      startedAt: process.hrtime.bigint(),
      method: request.method,
      url: request.url,
      routePath: null,
      ip: request.ip ?? null,
      userAgent: request.headers["user-agent"] ?? null,
      requestHeaders: safeSerialize(request.headers, this.deps.config),
      queryParams: safeSerialize(request.query, this.deps.config),
      routeParams: safeSerialize(request.params, this.deps.config),
      requestBody: null,
      responseBody: null,
      errorName: null,
      errorMessage: null,
      errorStack: null,
      authenticatedUser: getAuthenticatedUser(request),
    };
  }

  captureRequestBody(request: FastifyRequest, state: MonitoringCaptureState) {
    state.requestBody = safeSerialize(request.body, this.deps.config, {
      contentType: request.headers["content-type"],
    });
    state.routeParams = safeSerialize(request.params, this.deps.config);
    state.authenticatedUser = getAuthenticatedUser(request);
  }

  captureResponsePayload(
    request: FastifyRequest,
    reply: FastifyReply,
    payload: unknown,
    state: MonitoringCaptureState,
  ) {
    state.responseBody = parseResponsePayload(
      payload,
      this.deps.config,
      reply.getHeader("content-type")?.toString(),
    );
    state.routePath = normalizeRoutePath(request);
  }

  captureError(error: Error, state: MonitoringCaptureState) {
    state.errorName = error.name;
    state.errorMessage = error.message;
    state.errorStack = error.stack ?? null;
  }

  persist(request: FastifyRequest, reply: FastifyReply, state: MonitoringCaptureState) {
    return this.repository.create({
      requestId: request.id,
      method: state.method,
      url: state.url,
      routePath: state.routePath ?? normalizeRoutePath(request),
      statusCode: reply.statusCode,
      durationMs: durationFrom(state.startedAt),
      ip: state.ip,
      userAgent: state.userAgent,
      requestHeaders: state.requestHeaders,
      queryParams: state.queryParams,
      routeParams: state.routeParams,
      requestBody: state.requestBody,
      responseBody: state.responseBody,
      errorName: state.errorName,
      errorMessage: state.errorMessage,
      errorStack: state.errorStack,
      authenticatedUser: state.authenticatedUser,
    });
  }

  list(filters: MonitoringListFilters) {
    return this.repository.list(filters);
  }

  getById(id: string) {
    return this.repository.findById(id);
  }

  getStats() {
    return this.repository.getStats();
  }

  async retry(id: string): Promise<MonitoringRetryResult> {
    const record = await this.repository.findById(id);
    if (!record) {
      return { allowed: false, reason: "Monitoring request not found" };
    }

    const method = record.method.toUpperCase();
    if (!this.deps.config.retryableMethods.includes(method)) {
      return {
        allowed: false,
        reason: `Retry is disabled for ${method}. Only idempotent methods are allowed by default.`,
      };
    }

    const headers = this.buildRetryHeaders(record.requestHeaders);
    const response = await (this.deps.app as any).inject({
      method,
      url: record.url,
      headers,
      payload: record.requestBody ?? undefined,
    });

    return {
      allowed: true,
      statusCode: response.statusCode,
      headers: response.headers as Record<string, string | string[] | undefined>,
      body: parseResponsePayload(
        response.payload,
        this.deps.config,
        response.headers?.["content-type"],
      ),
    };
  }

  private buildRetryHeaders(rawHeaders: unknown) {
    if (!rawHeaders || typeof rawHeaders !== "object" || Array.isArray(rawHeaders)) {
      return {};
    }

    return Object.entries(rawHeaders as Record<string, unknown>).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        const normalizedKey = key.toLowerCase();
        if (["host", "content-length", "authorization", "cookie"].includes(normalizedKey)) {
          return acc;
        }
        if (typeof value === "string") {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );
  }
}
