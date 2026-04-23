import { useLocation, useNavigate } from "react-router-dom";

export default function VolunteerMatch() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const need = state?.need;

  if (!need) return (
    <div style={{ padding: 40 }}>
      <p style={{ color: "#6b7280" }}>No need selected.</p>
      <button onClick={() => navigate("/dashboard")}>← Back to dashboard</button>
    </div>
  );

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <button onClick={() => navigate("/dashboard")}
        style={{ fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>
        ← Back to dashboard
      </button>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Find volunteers</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        For: <strong>{need.title}</strong> in {need.location}
      </p>
      <div style={{ background: "#F0FDF4", border: "1px solid #D1FAE5", borderRadius: 12, padding: "16px 20px" }}>
        <p style={{ fontSize: 13, color: "#166534" }}>
          PAGE-3 — Member 2 builds this. Gemini AI ranks volunteers by skills and location.
        </p>
      </div>
    </div>
  );
}