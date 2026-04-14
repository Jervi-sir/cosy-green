import type { CSSProperties } from "react";

import type { MonitoringRequest } from "../lib/types";

type RequestDetailDrawerProps = {
  item: MonitoringRequest | null;
  onClose: () => void;
  onRetry: (item: MonitoringRequest) => Promise<void>;
};

export function RequestDetailDrawer({ item, onClose, onRetry }: RequestDetailDrawerProps) {
  if (!item) {
    return null;
  }

  return (
    <aside style={drawerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>{item.method} {item.routePath ?? item.url}</h2>
          <p style={{ margin: "6px 0 0", color: "#667085" }}>{item.requestId}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={actionStyle} onClick={() => void onRetry(item)}>Retry</button>
          <button style={ghostStyle} onClick={onClose}>Close</button>
        </div>
      </div>

      <Section title="Overview" value={{
        method: item.method,
        statusCode: item.statusCode,
        durationMs: item.durationMs,
        ip: item.ip,
        userAgent: item.userAgent,
        createdAt: item.createdAt,
        authenticatedUser: item.authenticatedUser,
      }} />
      <Section title="Headers" value={item.requestHeaders} />
      <Section title="Query" value={item.queryParams} />
      <Section title="Params" value={item.routeParams} />
      <Section title="Request Body" value={item.requestBody} />
      <Section title="Response Body" value={item.responseBody} />
      <Section title="Error" value={{ name: item.errorName, message: item.errorMessage, stack: item.errorStack }} />
    </aside>
  );
}

function Section({ title, value }: { title: string; value: unknown }) {
  return (
    <section style={sectionStyle}>
      <h3 style={{ marginTop: 0, fontSize: 14 }}>{title}</h3>
      <pre style={preStyle}>{JSON.stringify(value, null, 2) || "null"}</pre>
    </section>
  );
}

const drawerStyle: CSSProperties = {
  width: 420,
  maxWidth: "100%",
  borderLeft: "1px solid #E4E7EC",
  background: "#FFFFFF",
  padding: 20,
  overflow: "auto",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 20,
};

const sectionStyle: CSSProperties = {
  marginBottom: 16,
  padding: 16,
  borderRadius: 12,
  background: "#F9FAFB",
};

const preStyle: CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: 12,
  color: "#101828",
};

const actionStyle: CSSProperties = {
  border: 0,
  borderRadius: 10,
  background: "#155EEF",
  color: "white",
  padding: "10px 14px",
  cursor: "pointer",
};

const ghostStyle: CSSProperties = {
  border: "1px solid #D0D5DD",
  borderRadius: 10,
  background: "white",
  color: "#344054",
  padding: "10px 14px",
  cursor: "pointer",
};
