/* ============================================================
   📊 DASHBOARD.JSX — Main dashboard page (PAGE-2)
   Layout (top to bottom):
     1. Page header + Submit Need button
     2. 4 KPI stat cards
     3. AI Smart Match banner
     4. Filter buttons (ALL / CRITICAL / HIGH / MEDIUM / LOW)
     5. 3-column needs grid (live from Firebase)
     6. Google Maps placeholder at the bottom
   ============================================================ */
 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { theme, keyframes } from "../theme";
import NeedCard from "../components/NeedCard";
import { listenToNeeds } from "../firebase/needs";
import { getAllVolunteers } from "../firebase/volunteers";
 
/* ============================================================
   🎨 KPI CARD DATA — Change stat labels / icons / accent colours here
   Values are calculated live from Firebase data
   ============================================================ */
function buildKpiCards(needs, volunteers) {
  const open      = needs.filter(n => n.status === "open").length;
  const critical  = needs.filter(n => n.urgency === "CRITICAL").length;
  const available = volunteers.filter(v => v.availability !== "none").length;
  return [
    { emoji: "📋", label: "Open Needs",        value: open,              color: theme.colors.primary  },
    { emoji: "🚨", label: "Critical",          value: critical,          color: theme.colors.critical },
    { emoji: "🙋", label: "Volunteers Ready",  value: available,         color: theme.colors.accent   },
    { emoji: "🌍", label: "Total Registered",  value: volunteers.length, color: theme.colors.low      },
  ];
}
 
export default function Dashboard() {
  const navigate = useNavigate();
 
  /* ── State ── */
  const [needs,      setNeeds]      = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [aiRunning,  setAiRunning]  = useState(false);
  const [aiMessage,  setAiMessage]  = useState("");
 
  /* ============================================================
     🔘 FILTER STATE — ALL | CRITICAL | HIGH | MEDIUM | LOW
     Add new filter values here and add a button in the filter bar
     ============================================================ */
  const [filter, setFilter] = useState("ALL");
 
  /* ============================================================
     🔥 FIREBASE — Real-time needs listener (FIREBASE-2)
     Streams live updates from Firestore automatically
     ============================================================ */
  useEffect(() => {
    const unsubscribe = listenToNeeds(liveNeeds => {
      setNeeds(liveNeeds);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
 
  /* ============================================================
     🔥 FIREBASE — One-time volunteer fetch on mount (FIREBASE-3)
     ============================================================ */
  useEffect(() => {
    getAllVolunteers().then(setVolunteers);
  }, []);
 
  /* ============================================================
     🤖 AI SMART MATCH — Triggers Gemini matching (GEMINI-2)
     Replace the setTimeout stub with real call once connected:
     import { matchVolunteers } from "../gemini/matchVolunteers";
     const result = await matchVolunteers(needs[0], volunteers);
     ============================================================ */
  const handleAiMatch = async () => {
    setAiRunning(true);
    setAiMessage("");
    // TODO: swap this stub for real Gemini call
    setTimeout(() => {
      setAiMessage(
        `✅ AI found ${volunteers.length} potential matches across ${needs.filter(n => n.urgency === "CRITICAL").length} critical needs.`
      );
      setAiRunning(false);
    }, 1800);
  };
 
  /* ── Derived data ── */
  const kpiCards      = buildKpiCards(needs, volunteers);
  const filteredNeeds = filter === "ALL"
    ? needs
    : needs.filter(n => n.urgency === filter);
 
  return (
    <>
      {/* ── Inject animation keyframes from theme.js ── */}
      <style>{keyframes}</style>
 
      {/* ============================================================
          🌐 SPLINE / 3D BACKGROUND SLOT — Paste <spline-viewer> here
          for a 3D animated background behind the dashboard
          ============================================================ */}
 
      <div style={pageStyle}>
 
        {/* ── 1. Page header ── */}
        {/* ============================================================
            🎨 PAGE TITLE — Change heading text / subtitle here
            ============================================================ */}
        <div style={pageHeaderStyle}>
          <div>
            <h1 style={pageTitleStyle}>Dashboard</h1>
            <p style={pageSubStyle}>Live needs and volunteer overview</p>
          </div>
 
          {/* 🎨 SUBMIT BUTTON — Change copy / colour in submitBtnStyle below */}
          <button
            style={submitBtnStyle}
            onClick={() => navigate("/submit")}
            onMouseEnter={e => e.currentTarget.style.background = theme.colors.primaryDark}
            onMouseLeave={e => e.currentTarget.style.background = theme.colors.primary}
          >
            + Submit Need
          </button>
        </div>
 
        {/* ============================================================
            🔠 MARQUEE SLOT — Scrolling stats / announcement ticker
            Uncomment when ready:
            <div style={{ overflow: "hidden", marginBottom: 20, borderRadius: theme.radius.md, background: theme.colors.primaryLight }}>
              <div style={{ animation: "marquee 20s linear infinite", display: "flex", whiteSpace: "nowrap", padding: "10px 0" }}>
                🚨 3 Critical needs in Mumbai &nbsp;·&nbsp; 🙋 12 volunteers available &nbsp;·&nbsp;
                🚨 3 Critical needs in Mumbai &nbsp;·&nbsp; 🙋 12 volunteers available &nbsp;·&nbsp;
              </div>
            </div>
            ============================================================ */}
 
        {/* ── 2. KPI Cards ── */}
        {/* ============================================================
            🃏 KPI GRID — Change column count in kpiGridStyle below
            Currently: 4 columns. For 2 cols: "repeat(2, 1fr)"
            ============================================================ */}
        <div style={kpiGridStyle}>
          {kpiCards.map((card, i) => (
            <KpiCard key={card.label} card={card} index={i} />
          ))}
        </div>
 
        {/* ── 3. AI Smart Match banner ── */}
        {/* ============================================================
            🤖 AI BANNER — Change banner gradient / copy / button here
            Gradient colours come from theme.colors.primary + accent
            ============================================================ */}
        <div style={aiBannerStyle}>
          <div>
            <div style={aiBannerTitleStyle}>🤖 AI Smart Match</div>
            <div style={aiBannerSubStyle}>
              {aiMessage || "Let Gemini AI rank the best volunteers for every open need."}
            </div>
          </div>
          <button
            style={{ ...aiRunBtnStyle, opacity: aiRunning ? 0.7 : 1 }}
            onClick={handleAiMatch}
            disabled={aiRunning}
          >
            {/* 🎨 AI BUTTON ICON — Change spinner or icon here */}
            {aiRunning
              ? <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> Analysing...</>
              : "⚡ Run AI Match"
            }
          </button>
        </div>
 
        {/* ── 4. Filter bar ── */}
        {/* ============================================================
            🔘 FILTER BUTTONS — Add/remove urgency filters here
            Active button uses theme.colors.primary background
            ============================================================ */}
        <div style={filterBarStyle}>
          <span style={filterLabelStyle}>Filter:</span>
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(f => (
            <button
              key={f}
              style={{
                ...filterBtnStyle,
                background:  filter === f ? theme.colors.primary : theme.colors.surface,
                color:       filter === f ? "#fff" : theme.colors.textSecondary,
                borderColor: filter === f ? theme.colors.primary : theme.colors.border,
              }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
 
        {/* ── 5. Needs Grid ── */}
        {/* ============================================================
            📋 NEEDS GRID — Change column count / gap in needsGridStyle
            Currently: 3-column grid. For 2 cols: "repeat(2, 1fr)"
            ============================================================ */}
        {loading ? (
          <div style={loadingStyle}>
            <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>🌀</span>
            &nbsp; Loading needs from Firebase...
          </div>
        ) : filteredNeeds.length === 0 ? (
          <div style={emptyStyle}>
            No needs found{filter !== "ALL" ? ` with urgency: ${filter}` : ""}. 🌱
          </div>
        ) : (
          <div style={needsGridStyle}>
            {filteredNeeds.map((need, i) => (
              /* 🎞 CARD ANIMATION — Change fadeUp delay / duration here */
              <div key={need.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                <NeedCard
                  need={need}
                  onFindVolunteers={n => navigate("/match", { state: { need: n } })}
                />
              </div>
            ))}
          </div>
        )}
 
        {/* ── 6. Map slot ── */}
        {/* ============================================================
            🗺 MAP SLOT — Replace this placeholder with real map:
            import MapView from "../components/MapView";
            <MapView needs={needs} />
            Change height in mapPlaceholderStyle below (currently 220px)
            ============================================================ */}
        <div style={mapPlaceholderStyle}>
          <span style={{ fontSize: 36 }}>🗺️</span>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, color: theme.colors.textPrimary, fontSize: 15 }}>
            Map View
          </div>
          <div style={{ fontSize: 13, color: theme.colors.textMuted }}>
            Google Maps embed goes here — add VITE_GOOGLE_MAPS_API_KEY to .env.local
          </div>
        </div>
 
      </div>
    </>
  );
}
 
/* ============================================================
   🃏 KPI CARD SUBCOMPONENT
   🎨 KPI CARD — Change individual stat card layout / style here
   Top border colour comes from card.color (set in buildKpiCards)
   ============================================================ */
function KpiCard({ card, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...kpiCardStyle,
        boxShadow: hovered ? theme.shadows.cardHover : theme.shadows.card,
        transform:  hovered ? "translateY(-3px)" : "none",
        animation:  `fadeUp 0.4s ease ${index * 0.08}s both`,
        /* 🎨 TOP ACCENT BAR — Change thickness / colour per card via card.color */
        borderTop:  `3px solid ${card.color}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 🎨 KPI EMOJI — Change icon per stat in buildKpiCards above */}
      <div style={{ fontSize: 28 }}>{card.emoji}</div>
      <div style={{ ...kpiValueStyle, color: card.color }}>{card.value}</div>
      <div style={kpiLabelStyle}>{card.label}</div>
    </div>
  );
}
 
/* ============================================================
   💅 DASHBOARD STYLES
   ============================================================ */
 
/* 🎨 PAGE BACKGROUND — Change bg colour in theme.js → colors.bg */
const pageStyle = {
  minHeight:  "100vh",
  background: theme.colors.bg,
  padding:    "28px 32px",
  fontFamily: theme.fonts.body,
};
 
const pageHeaderStyle = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "flex-end",
  marginBottom:   24,
};
 
const pageTitleStyle = {
  fontFamily:   theme.fonts.display,
  fontSize:     26,
  fontWeight:   700,
  color:        theme.colors.textPrimary,
  margin:       0,
  marginBottom: 4,
};
 
const pageSubStyle = {
  fontSize: 14,
  color:    theme.colors.textMuted,
  margin:   0,
};
 
/* 🎨 SUBMIT BTN — Change padding / font size here
   Hover colour is set inline above using theme.colors.primaryDark */
const submitBtnStyle = {
  background:   theme.colors.primary,
  color:        "#fff",
  border:       "none",
  borderRadius: theme.radius.sm,
  padding:      "10px 20px",
  fontSize:     13,
  fontWeight:   600,
  /* 🖱 CURSOR — Change button cursor here */
  cursor:       "pointer",
  fontFamily:   theme.fonts.body,
  transition:   "background 0.18s ease",
};
 
/* 🎨 KPI GRID — Change column count / gap here */
const kpiGridStyle = {
  display:             "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap:                 16,
  marginBottom:        24,
};
 
const kpiCardStyle = {
  background:    theme.colors.surface,
  border:        `1px solid ${theme.colors.border}`,
  borderRadius:  theme.radius.lg,
  padding:       "20px 18px",
  display:       "flex",
  flexDirection: "column",
  gap:           6,
  transition:    "all 0.22s ease",
  cursor:        "default",
};
 
/* 🎨 KPI VALUE NUMBER — Change font size / weight here */
const kpiValueStyle = {
  fontFamily: theme.fonts.display,
  fontSize:   36,
  fontWeight: 800,
  lineHeight: 1,
};
 
const kpiLabelStyle = {
  fontSize:   13,
  color:      theme.colors.textSecondary,
  fontWeight: 500,
};
 
/* ============================================================
   🎨 AI BANNER — Change gradient / border colours here
   Uses theme.colors.primary + theme.colors.accent for gradient
   ============================================================ */
const aiBannerStyle = {
  background:     `linear-gradient(135deg, ${theme.colors.primary}18, ${theme.colors.accent}12)`,
  border:         `1.5px solid ${theme.colors.primary}33`,
  borderRadius:   theme.radius.lg,
  padding:        "18px 22px",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "space-between",
  gap:            16,
  marginBottom:   22,
};
 
const aiBannerTitleStyle = {
  fontFamily:   theme.fonts.display,
  fontWeight:   700,
  fontSize:     15,
  color:        theme.colors.textPrimary,
  marginBottom: 4,
};
 
const aiBannerSubStyle = {
  fontSize: 13,
  color:    theme.colors.textSecondary,
};
 
/* 🎨 AI RUN BUTTON — Change gradient / padding here */
const aiRunBtnStyle = {
  background:   `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
  color:        "#fff",
  border:       "none",
  borderRadius: theme.radius.sm,
  padding:      "10px 20px",
  fontSize:     13,
  fontWeight:   600,
  cursor:       "pointer",
  fontFamily:   theme.fonts.body,
  whiteSpace:   "nowrap",
  boxShadow:    theme.shadows.button,
  transition:   "opacity 0.2s ease",
  display:      "flex",
  alignItems:   "center",
  gap:          6,
};
 
const filterBarStyle = {
  display:      "flex",
  alignItems:   "center",
  gap:          8,
  marginBottom: 18,
  flexWrap:     "wrap",
};
 
const filterLabelStyle = {
  fontSize:    12,
  fontWeight:  600,
  color:       theme.colors.textMuted,
  marginRight: 4,
};
 
/* 🎨 FILTER BUTTONS — Change pill shape / size here
   Active colours are set inline above using theme.colors.primary */
const filterBtnStyle = {
  fontSize:     11,
  fontWeight:   600,
  padding:      "5px 12px",
  borderRadius: theme.radius.full,
  border:       "1.5px solid",
  cursor:       "pointer",
  transition:   "all 0.15s ease",
  fontFamily:   theme.fonts.body,
};
 
/* 🎨 NEEDS GRID — Change column count / gap here */
const needsGridStyle = {
  display:             "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap:                 16,
  marginBottom:        28,
};
 
const loadingStyle = {
  textAlign:  "center",
  padding:    "60px 20px",
  fontSize:   15,
  color:      theme.colors.textMuted,
  fontFamily: theme.fonts.body,
};
 
const emptyStyle = {
  textAlign:  "center",
  padding:    "60px 20px",
  fontSize:   15,
  color:      theme.colors.textMuted,
  fontFamily: theme.fonts.body,
};
 
/* ============================================================
   🗺 MAP CONTAINER — Replace this with real MapView component
   Change height here (currently 220px)
   ============================================================ */
const mapPlaceholderStyle = {
  background:     theme.colors.surface,
  border:         `1.5px dashed ${theme.colors.border}`,
  borderRadius:   theme.radius.xl,
  height:         220,
  display:        "flex",
  flexDirection:  "column",
  alignItems:     "center",
  justifyContent: "center",
  gap:            10,
  marginTop:      8,
};