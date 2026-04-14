import type { FastifyBaseLogger, FastifyInstance } from "fastify";

export type MonitoringActor = {
  id?: string;
  role?: string;
  email?: string;
  truckId?: string | null;
};

export type MonitoringRecord = {
  id: string;
  requestId: string;
  method: string;
  url: string;
  routePath: string | null;
  statusCode: number;
  durationMs: number;
  ip: string | null;
  userAgent: string | null;
  requestHeaders: unknown;
  queryParams: unknown;
  routeParams: unknown;
  requestBody: unknown;
  responseBody: unknown;
  errorName: string | null;
  errorMessage: string | null;
  errorStack: string | null;
  authenticatedUser: unknown;
  createdAt: Date;
};

export type MonitoringCaptureState = {
  startedAt: bigint;
  method: string;
  url: string;
  routePath: string | null;
  ip: string | null;
  userAgent: string | null;
  requestHeaders: unknown;
  queryParams: unknown;
  routeParams: unknown;
  requestBody: unknown;
  responseBody: unknown;
  errorName: string | null;
  errorMessage: string | null;
  errorStack: string | null;
  authenticatedUser: MonitoringActor | null;
};

export type MonitoringPluginConfig = {
  enabled: boolean;
  maxPayloadSize: number;
  ignoredRoutes: string[];
  redactKeys: string[];
  retentionDays: number;
  retryableMethods: string[];
};

export type MonitoringListFilters = {
  page: number;
  pageSize: number;
  status?: number;
  method?: string;
  route?: string;
  requestId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export type MonitoringListResult = {
  items: MonitoringRecord[];
  total: number;
  page: number;
  pageSize: number;
};

export type MonitoringStats = {
  totalRequests: number;
  errorCount: number;
  averageDurationMs: number;
  slowRequestsCount: number;
};

export type MonitoringRetryResult = {
  allowed: boolean;
  reason?: string;
  statusCode?: number;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

export type MonitoringServiceDeps = {
  app: FastifyInstance;
  logger: FastifyBaseLogger;
  config: MonitoringPluginConfig;
};
