const BADGE = {
  CRITICAL: { bg: "#FEECEC", color: "#991B1B", label: "Critical" },
  HIGH:     { bg: "#FEF3C7", color: "#92400E", label: "High" },
  MEDIUM:   { bg: "#DBEAFE", color: "#1E40AF", label: "Medium" },
  LOW:      { bg: "#DCFCE7", color: "#166534", label: "Low" },
};

export default function NeedCard({ need, onFindVolunteers }) {
  const badge = BADGE[need.urgency] || BADGE.LOW;

  return (
    <div
      style={{
        background: "#ffffff", border: "1px solid #e5e7eb",
        borderRadius: 14, padding: "16px 18px",
        display: "flex", flexDirection: "column", gap: 10,
        transition: "box-shadow 0.15s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.4, margin: 0 }}>
          {need.title} — {need.location}
        </h3>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px",
          borderRadius: 999, whiteSpace: "nowrap",
          background: badge.bg, color: badge.color,
        }}>
          {badge.label}
        </span>
      </div>

      <div style={{ fontSize: 12, color: "#6b7280", display: "flex", gap: 12 }}>
        <span>📍 {need.location}</span>
        <span>👥 {need.volunteersNeeded} needed</span>
      </div>
      <div style={{ fontSize: 12, color: "#6b7280", display: "flex", gap: 12 }}>
        <span>🗂 {need.category}</span>
        <span>🕐 {need.timing}</span>
      </div>

      <span style={{
        fontSize: 11, padding: "2px 8px", borderRadius: 999,
        background: "#F3F4F6", color: "#374151", alignSelf: "flex-start",
      }}>
        {need.status === "open" ? "Open" : need.status}
      </span>

      <button
        onClick={() => onFindVolunteers(need)}
        style={{
          marginTop: 2, fontSize: 13, fontWeight: 500,
          padding: "8px 14px", width: "100%",
          border: "1px solid #D1FAE5", borderRadius: 8,
          cursor: "pointer", background: "#F0FDF4", color: "#166534",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#DCFCE7"}
        onMouseLeave={e => e.currentTarget.style.background = "#F0FDF4"}
      >
        Find volunteers →
      </button>
    </div>
  );
}