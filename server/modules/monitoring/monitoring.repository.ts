import { and, avg, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";

import { db } from "../../db";
import { monitoringRequests } from "./monitoring.schema";
import type {
  MonitoringListFilters,
  MonitoringListResult,
  MonitoringRecord,
  MonitoringStats,
} from "./monitoring.types";

type CreateMonitoringRequestInput = Omit<MonitoringRecord, "id" | "createdAt"> & {
  createdAt?: Date;
};

export class MonitoringRepository {
  async create(input: CreateMonitoringRequestInput) {
    const [record] = await db
      .insert(monitoringRequests)
      .values({
        ...input,
        createdAt: input.createdAt ?? new Date(),
      })
      .returning();
    return record;
  }

  async findById(id: string) {
    const [record] = await db
      .select()
      .from(monitoringRequests)
      .where(eq(monitoringRequests.id, id))
      .limit(1);
    return record;
  }

  async list(filters: MonitoringListFilters): Promise<MonitoringListResult> {
    const conditions = this.buildConditions(filters);
    const whereClause = conditions.length ? and(...conditions) : undefined;

    const offset = (filters.page - 1) * filters.pageSize;
    const [items, totalRow] = await Promise.all([
      db
        .select()
        .from(monitoringRequests)
        .where(whereClause)
        .orderBy(desc(monitoringRequests.createdAt))
        .limit(filters.pageSize)
        .offset(offset),
      db.select({ value: count() }).from(monitoringRequests).where(whereClause),
    ]);

    return {
      items,
      total: totalRow[0]?.value ?? 0,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }

  async getStats(): Promise<MonitoringStats> {
    const [totalRow, errorRow, avgRow, slowRow] = await Promise.all([
      db.select({ value: count() }).from(monitoringRequests),
      db
        .select({ value: count() })
        .from(monitoringRequests)
        .where(gte(monitoringRequests.statusCode, 500)),
      db.select({ value: avg(monitoringRequests.durationMs) }).from(monitoringRequests),
      db
        .select({ value: count() })
        .from(monitoringRequests)
        .where(gte(monitoringRequests.durationMs, 1000)),
    ]);

    return {
      totalRequests: totalRow[0]?.value ?? 0,
      errorCount: errorRow[0]?.value ?? 0,
      averageDurationMs: Math.round(Number(avgRow[0]?.value ?? 0)),
      slowRequestsCount: slowRow[0]?.value ?? 0,
    };
  }

  private buildConditions(filters: MonitoringListFilters) {
    const conditions = [] as any[];

    if (typeof filters.status === "number") {
      conditions.push(eq(monitoringRequests.statusCode, filters.status));
    }
    if (filters.method) {
      conditions.push(eq(monitoringRequests.method, filters.method.toUpperCase()));
    }
    if (filters.route) {
      conditions.push(ilike(monitoringRequests.routePath, `%${filters.route}%`));
    }
    if (filters.requestId) {
      conditions.push(eq(monitoringRequests.requestId, filters.requestId));
    }
    if (filters.dateFrom) {
      conditions.push(gte(monitoringRequests.createdAt, filters.dateFrom));
    }
    if (filters.dateTo) {
      conditions.push(lte(monitoringRequests.createdAt, filters.dateTo));
    }
    if (filters.search) {
      const search = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(monitoringRequests.url, search),
          ilike(monitoringRequests.routePath, search),
          ilike(monitoringRequests.errorMessage, search),
          ilike(monitoringRequests.requestId, search),
        ) as ReturnType<typeof eq>,
      );
    }

    return conditions;
  }
}
