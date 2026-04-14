import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import type { MonitoringService } from "./monitoring.service";

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  status: z.coerce.number().int().optional(),
  method: z.string().optional(),
  route: z.string().optional(),
  requestId: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export function buildMonitoringRoutes(service: MonitoringService): FastifyPluginAsync {
  return async (app) => {
    app.get("/internal/monitoring/requests", async (request) => {
      const query = listQuerySchema.parse(request.query);
      return service.list(query);
    });

    app.get("/internal/monitoring/requests/:id", async (request) => {
      const { id } = paramsSchema.parse(request.params);
      const item = await service.getById(id);
      if (!item) {
        throw app.httpErrors.notFound("Monitoring request not found");
      }
      return { item };
    });

    app.post("/internal/monitoring/requests/:id/retry", async (request) => {
      const { id } = paramsSchema.parse(request.params);
      const result = await service.retry(id);
      if (!result.allowed) {
        throw app.httpErrors.badRequest(result.reason ?? "Retry is not allowed");
      }
      return result;
    });

    app.get("/internal/monitoring/stats", async () => {
      return service.getStats();
    });
  };
}
