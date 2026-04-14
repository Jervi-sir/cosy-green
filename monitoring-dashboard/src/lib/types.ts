export type MonitoringRequest = {
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
  createdAt: string;
};

export type MonitoringListResponse = {
  items: MonitoringRequest[];
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
