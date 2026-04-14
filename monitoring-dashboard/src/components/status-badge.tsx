type StatusBadgeProps = {
  statusCode: number;
};

export function StatusBadge({ statusCode }: StatusBadgeProps) {
  const tone =
    statusCode >= 500
      ? "#B42318"
      : statusCode >= 400
        ? "#B54708"
        : statusCode >= 300
          ? "#1D4ED8"
          : "#027A48";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 54,
        padding: "4px 10px",
        borderRadius: 999,
        background: `${tone}18`,
        color: tone,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {statusCode}
    </span>
  );
}
