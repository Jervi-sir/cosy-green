import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { RequestDetailDrawer } from "./components/request-detail-drawer";
import { RequestsTable } from "./components/requests-table";
import {
  fetchMonitoringRequest,
  fetchMonitoringRequests,
  fetchMonitoringStats,
  retryMonitoringRequest,
} from "./lib/api";
import type { MonitoringRequest, MonitoringStats } from "./lib/types";

export function MonitoringDashboardPage() {
  const [items, setItems] = useState<MonitoringRequest[]>([]);
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [selected, setSelected] = useState<MonitoringRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    method: "",
    status: "",
    route: "",
  });

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: "1", pageSize: "25" });
    if (filters.search) params.set("search", filters.search);
    if (filters.method) params.set("method", filters.method);
    if (filters.status) params.set("status", filters.status);
    if (filters.route) params.set("route", filters.route);
    return params;
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMonitoringRequests(query), fetchMonitoringStats()])
      .then(([listResponse, statsResponse]) => {
        setItems(listResponse.items);
        setStats(statsResponse);
        setError(null);
      })
      .catch((nextError) => {
        setError(nextError instanceof Error ? nextError.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <header style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>Monitoring</h1>
            <p style={{ color: "#667085" }}>Fastify request monitoring dashboard</p>
          </div>
          <div style={statsGridStyle}>
            <StatCard label="Total" value={stats?.totalRequests ?? 0} />
            <StatCard label="Errors" value={stats?.errorCount ?? 0} />
            <StatCard label="Avg Duration" value={`${stats?.averageDurationMs ?? 0} ms`} />
            <StatCard label="Slow" value={stats?.slowRequestsCount ?? 0} />
          </div>
        </header>

        <div style={filterRowStyle}>
          <input placeholder="Search" value={filters.search} onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))} style={inputStyle} />
          <input placeholder="Method" value={filters.method} onChange={(e) => setFilters((current) => ({ ...current, method: e.target.value }))} style={inputStyle} />
          <input placeholder="Status" value={filters.status} onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))} style={inputStyle} />
          <input placeholder="Route" value={filters.route} onChange={(e) => setFilters((current) => ({ ...current, route: e.target.value }))} style={inputStyle} />
        </div>

        {error ? <div style={errorStyle}>{error}</div> : null}

        <RequestsTable
          items={items}
          loading={loading}
          onSelect={(item) => {
            fetchMonitoringRequest(item.id).then(setSelected).catch(() => setSelected(item));
          }}
          onCopyRequestId={(requestId) => navigator.clipboard.writeText(requestId)}
        />
      </div>

      <RequestDetailDrawer
        item={selected}
        onClose={() => setSelected(null)}
        onRetry={async (item) => {
          await retryMonitoringRequest(item.id);
          const fresh = await fetchMonitoringRequest(item.id);
          setSelected(fresh);
        }}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={statCardStyle}>
      <div style={{ color: "#667085", fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  minHeight: "100vh",
  background: "#F8FAFC",
};

const contentStyle: CSSProperties = {
  padding: 24,
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  marginBottom: 24,
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
  gap: 12,
};

const statCardStyle: CSSProperties = {
  padding: 16,
  borderRadius: 16,
  background: "#FFFFFF",
  border: "1px solid #E4E7EC",
};

const filterRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
  marginBottom: 20,
};

const inputStyle: CSSProperties = {
  height: 42,
  borderRadius: 12,
  border: "1px solid #D0D5DD",
  padding: "0 12px",
  background: "#FFFFFF",
};

const errorStyle: CSSProperties = {
  marginBottom: 12,
  padding: 12,
  borderRadius: 12,
  background: "#FEF3F2",
  color: "#B42318",
};
