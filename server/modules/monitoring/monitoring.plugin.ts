import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

import { buildMonitoringRoutes } from "./monitoring.routes";
import { MonitoringService } from "./monitoring.service";
import { createMonitoringConfig, shouldIgnoreRoute } from "./monitoring.utils";
import type { MonitoringCaptureState, MonitoringPluginConfig } from "./monitoring.types";

declare module "fastify" {
  interface FastifyRequest {
    monitoringCapture?: MonitoringCaptureState;
  }

  interface FastifyInstance {
    monitoringService: MonitoringService;
  }
}

const monitoringPluginImpl: FastifyPluginAsync<Partial<MonitoringPluginConfig>> = async (
  app,
  options,
) => {
  const config = createMonitoringConfig(options);
  const service = new MonitoringService({
    app,
    logger: app.log,
    config,
  });

  app.decorate("monitoringService", service);

  if (!config.enabled) {
    await app.register(buildMonitoringRoutes(service));
    return;
  }

  app.addHook("onRequest", async (request) => {
    const url = request.raw.url?.split("?")[0] ?? request.url;
    if (shouldIgnoreRoute(url, config)) {
      return;
    }
    request.monitoringCapture = service.createInitialCapture(request);
  });

  app.addHook("preHandler", async (request) => {
    if (!request.monitoringCapture) {
      return;
    }
    service.captureRequestBody(request, request.monitoringCapture);
  });

  app.addHook("onSend", async (request, reply, payload) => {
    if (!request.monitoringCapture) {
      return payload;
    }
    service.captureResponsePayload(request, reply, payload, request.monitoringCapture);
    return payload;
  });

  app.addHook("onError", async (request, _reply, error) => {
    if (!request.monitoringCapture) {
      return;
    }
    service.captureError(error, request.monitoringCapture);
  });

  app.addHook("onResponse", async (request, reply) => {
    if (!request.monitoringCapture) {
      return;
    }
    void service.persist(request, reply, request.monitoringCapture).catch((error) => {
      app.log.error({ error, requestId: request.id }, "Failed to persist monitoring request");
    });
  });

  await app.register(buildMonitoringRoutes(service));
};

export const monitoringPlugin = fp(monitoringPluginImpl, {
  fastify: "5.x",
  name: "monitoring-plugin",
});
