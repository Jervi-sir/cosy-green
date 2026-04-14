import type { MonitoringListResponse, MonitoringRequest, MonitoringStats } from "./types";

const API_BASE_URL = import.meta.env.VITE_MONITORING_API_URL ?? "http://localhost:4000";

export async function fetchMonitoringRequests(query: URLSearchParams) {
  const response = await fetch(`${API_BASE_URL}/internal/monitoring/requests?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load monitoring requests");
  }
  return (await response.json()) as MonitoringListResponse;
}

export async function fetchMonitoringRequest(id: string) {
  const response = await fetch(`${API_BASE_URL}/internal/monitoring/requests/${id}`);
  if (!response.ok) {
    throw new Error("Failed to load monitoring request details");
  }
  const data = (await response.json()) as { item: MonitoringRequest };
  return data.item;
}

export async function fetchMonitoringStats() {
  const response = await fetch(`${API_BASE_URL}/internal/monitoring/stats`);
  if (!response.ok) {
    throw new Error("Failed to load monitoring stats");
  }
  return (await response.json()) as MonitoringStats;
}

export async function retryMonitoringRequest(id: string) {
  const response = await fetch(`${API_BASE_URL}/internal/monitoring/requests/${id}/retry`, {
    method: "POST",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Retry failed");
  }
  return response.json();
}
