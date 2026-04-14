import type { CSSProperties } from "react";

import type { MonitoringRequest } from "../lib/types";
import { StatusBadge } from "./status-badge";

type RequestsTableProps = {
  items: MonitoringRequest[];
  loading: boolean;
  onSelect: (item: MonitoringRequest) => void;
  onCopyRequestId: (requestId: string) => void;
};

export function RequestsTable({
  items,
  loading,
  onSelect,
  onCopyRequestId,
}: RequestsTableProps) {
  if (loading) {
    return <div style={emptyStyle}>Loading requests...</div>;
  }

  if (!items.length) {
    return <div style={emptyStyle}>No monitoring requests match the current filters.</div>;
  }

  return (
    <div style={tableWrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Method</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Route</th>
            <th style={thStyle}>Duration</th>
            <th style={thStyle}>Request ID</th>
            <th style={thStyle}>Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} onClick={() => onSelect(item)} style={rowStyle}>
              <td style={tdStyle}>{item.method}</td>
              <td style={tdStyle}>
                <StatusBadge statusCode={item.statusCode} />
              </td>
              <td style={tdStyle}>{item.routePath ?? item.url}</td>
              <td style={tdStyle}>{item.durationMs} ms</td>
              <td style={tdStyle}>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCopyRequestId(item.requestId);
                  }}
                  style={copyButtonStyle}
                >
                  {item.requestId}
                </button>
              </td>
              <td style={tdStyle}>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableWrapperStyle: CSSProperties = {
  overflow: "auto",
  border: "1px solid #E4E7EC",
  borderRadius: 16,
  background: "#FFFFFF",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "14px 16px",
  borderBottom: "1px solid #E4E7EC",
  fontSize: 12,
  color: "#475467",
};

const tdStyle: CSSProperties = {
  padding: "14px 16px",
  borderBottom: "1px solid #F2F4F7",
  fontSize: 14,
  color: "#101828",
};

const rowStyle: CSSProperties = {
  cursor: "pointer",
};

const copyButtonStyle: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#155EEF",
  cursor: "pointer",
  padding: 0,
};

const emptyStyle: CSSProperties = {
  padding: 24,
  borderRadius: 16,
  border: "1px dashed #D0D5DD",
  background: "#FFFFFF",
  color: "#667085",
};
