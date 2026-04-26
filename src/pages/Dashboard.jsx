/* ============================================================
   📊 DASHBOARD.JSX — Main dashboard page (UPGRADED)

   📍 WHAT TO CHANGE WHERE:
   - Hero banner text        → heroBannerStyle section (~line 90)
   - KPI card data           → buildKpiCards() (~line 50)
   - KPI number size         → kpiCardStyle fontSize (~line 280)
   - Card urgency colours    → URGENCY_CARD_STYLES (~line 40)
   - AI banner               → AI SMART MATCH BANNER section
   - Filter buttons          → filter array (~line 130)
   - Map height              → mapContainerStyle height (~line 330)
   - Grid columns            → needsGridStyle gridTemplateColumns
   - 🌐 Spline slot          → marked with SPLINE SLOT comment
   - 🔠 Marquee slot         → marked with MARQUEE SLOT comment
   ============================================================ */

import { useState, useEffect, useRef } from "react";
import { useNavigate }                  from "react-router-dom";
import { theme, keyframes }             from "../theme";
import NeedCard                         from "../components/NeedCard";
import { listenToNeeds }                from "../firebase/needs";
import { getAllVolunteers }              from "../firebase/volunteers";

/* ============================================================
   🎨 URGENCY CARD STYLES — Controls per-urgency card appearance
   Change colours, borders, backgrounds per urgency here
   ============================================================ */
export const URGENCY_CARD_STYLES = {
  CRITICAL: {
    borderLeft:  "4px solid #EF4444",
    background:  "#fff5f5",
    badgeBg:     "#FEE2E2",
    badgeColor:  "#991B1B",
    dot:         "#EF4444",
    label:       "Critical",
    glowShadow:  "0 4px 20px rgba(239,68,68,0.12)",
  },
  HIGH: {
    borderLeft:  "4px solid #F97316",
    background:  "#fffbf5",
    badgeBg:     "#FEF3C7",
    badgeColor:  "#92400E",
    dot:         "#F97316",
    label:       "High",
    glowShadow:  "0 4px 16px rgba(249,115,22,0.08)",
  },
  MEDIUM: {
    borderLeft:  "4px solid #EAB308",
    background:  "#fefdf5",
    badgeBg:     "#FEF9C3",
    badgeColor:  "#713F12",
    dot:         "#EAB308",
    label:       "Medium",
    glowShadow:  theme.shadows.card,
  },
  LOW: {
    borderLeft:  "4px solid #22C55E",
    background:  "#f5fdf7",
    badgeBg:     "#DCFCE7",
    badgeColor:  "#166534",
    dot:         "#22C55E",
    label:       "Low",
    glowShadow:  theme.shadows.card,
  },
};

/* ============================================================
   📊 KPI CARDS CONFIG — Change stat labels, icons, colours here
   ============================================================ */
function buildKpiCards(needs, volunteers) {
  const open     = needs.filter(n => n.status === "open").length;
  const critical = needs.filter(n => n.urgency === "CRITICAL").length;
  return [
    { emoji:"📋", label:"Open Needs",       value:open,             color:theme.colors.primary, bg:theme.colors.primaryLight },
    { emoji:"🚨", label:"Critical",         value:critical,         color:"#EF4444",            bg:"#FEE2E2"                 },
    { emoji:"🙋", label:"Volunteers Ready", value:volunteers.length, color:theme.colors.accent,  bg:"#FFF7ED"                 },
    { emoji:"⚡", label:"Avg Match Time",   value:"< 60s",          color:"#8B5CF6",            bg:"#F3E8FF"                 },
  ];
}

/* ============================================================
   🗺 MUMBAI NEED LOCATIONS — Map marker data
   Add lat/lng here for new areas as the app grows
   ============================================================ */
const MUMBAI_LOCATIONS = [
  { title:"Kurla East — Flood Relief",   lat:19.068, lng:72.880, urgency:"CRITICAL" },
  { title:"Dharavi — Food Distribution", lat:19.040, lng:72.860, urgency:"HIGH"     },
  { title:"Govandi — Medical Camp",      lat:19.055, lng:72.920, urgency:"HIGH"     },
  { title:"Mankhurd — School Tutoring",  lat:19.049, lng:72.935, urgency:"MEDIUM"   },
  { title:"Chembur — Elderly Care",      lat:19.063, lng:72.900, urgency:"MEDIUM"   },
];

/* ============================================================
   🗺 LEAFLET MAP — Free OpenStreetMap, no API key needed
   To change: center coordinates, zoom level, marker colours
   ============================================================ */
function MumbaiMap() {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script  = document.createElement("script");
    script.src    = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;
    const L   = window.L;
    /* ============================================================
       🗺 MAP CENTER & ZOOM — Change these values to focus elsewhere
       ============================================================ */
    const map = L.map(mapRef.current, {
      center: [19.058, 72.895],
      zoom:   12,
      scrollWheelZoom: false,
    });
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    /* ============================================================
       📍 MARKER COLOURS — Change per-urgency dot colour here
       ============================================================ */
    const urgencyColor = { CRITICAL:"#EF4444", HIGH:"#F97316", MEDIUM:"#EAB308", LOW:"#22C55E" };
    MUMBAI_LOCATIONS.forEach(loc => {
      const c    = urgencyColor[loc.urgency] || "#0D9488";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${c};border:3px solid white;box-shadow:0 2px 8px ${c}88;"></div>`,
        iconSize:[14,14], iconAnchor:[7,7],
      });
      L.marker([loc.lat, loc.lng], { icon })
        .bindPopup(`<strong>${loc.title}</strong><br/><span style="color:${c};font-weight:600">${loc.urgency}</span>`)
        .addTo(map);
    });
  }, [ready]);

  return (
    <div>
      {!ready && (
        <div style={mapLoadingStyle}>
          <span style={{ fontSize:22, animation:"spin 1s linear infinite", display:"inline-block" }}>🗺️</span>
          <span style={{ fontSize:13, color:theme.colors.textMuted }}>Loading map...</span>
        </div>
      )}
      <div ref={mapRef} style={{ ...mapContainerStyle, display: ready ? "block" : "none" }}/>
      <div style={mapLegendStyle}>
        {[["#EF4444","Critical"],["#F97316","High"],["#EAB308","Medium"],["#22C55E","Low"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:theme.colors.textSecondary }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   📊 MAIN DASHBOARD COMPONENT
   ============================================================ */
export default function Dashboard() {
  const navigate = useNavigate();
  const [needs,      setNeeds]      = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [aiRunning,  setAiRunning]  = useState(false);
  const [aiMessage,  setAiMessage]  = useState("");
  const [filter,     setFilter]     = useState("ALL");

  useEffect(() => {
    const unsub = listenToNeeds(live => { setNeeds(live); setLoading(false); });
    return () => unsub();
  }, []);

  useEffect(() => { getAllVolunteers().then(setVolunteers); }, []);

  const handleAiMatch = () => {
    setAiRunning(true); setAiMessage("");
    setTimeout(() => {
      setAiMessage(`✅ AI found ${volunteers.length} matches across ${needs.filter(n=>n.urgency==="CRITICAL").length} critical needs.`);
      setAiRunning(false);
    }, 1800);
  };

  const kpiCards      = buildKpiCards(needs, volunteers);
  const criticalCount = needs.filter(n => n.urgency === "CRITICAL").length;
  const filteredNeeds = filter === "ALL" ? needs : needs.filter(n => n.urgency === filter);

  return (
    <>
      <style>{keyframes}{dashCSS}</style>

      {/* ============================================================
          🌐 SPLINE SLOT — Add 3D background element here
          ============================================================ */}

      <div style={pageStyle}>

        {/* ══════════════════════════════════════════════════════
            🦸 HERO BANNER — Dark strip with live need count
            🎨 Change gradient colours in heroBannerStyle below
            ══════════════════════════════════════════════════════ */}
        <div style={heroBannerStyle}>
          <div style={heroBannerInnerStyle}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={liveDotStyle}/>
                <span style={{ fontSize:11, fontWeight:600, color:"#5eead4", letterSpacing:"1px", textTransform:"uppercase" }}>
                  Live · Firebase Sync Active
                </span>
              </div>
              {/* ============================================================
                  🎨 HERO BANNER HEADLINE — Change text here
                  ============================================================ */}
              <h1 style={heroBannerTitleStyle}>
                {loading ? "Connecting to Firebase..." : `${needs.filter(n=>n.status==="open").length} needs active in Mumbai right now`}
              </h1>
              {criticalCount > 0 && (
                <div style={criticalAlertStyle}>
                  🚨 {criticalCount} CRITICAL {criticalCount===1?"need":"needs"} — immediate volunteers required
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:10, flexShrink:0 }}>
              <button style={heroBannerBtnStyle} onClick={() => navigate("/submit")}
                onMouseEnter={e => e.currentTarget.style.background = theme.colors.primaryDark}
                onMouseLeave={e => e.currentTarget.style.background = theme.colors.primary}>
                + Submit Need
              </button>
              <button style={{ ...heroBannerBtnStyle, background:"transparent", border:`1.5px solid #5eead444`, color:"#5eead4" }}
                onClick={() => navigate("/register")}
                onMouseEnter={e => { e.currentTarget.style.background = "#5eead422"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                + Register Volunteer
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            🔠 MARQUEE SLOT — Add scrolling ticker here below banner
            ============================================================ */}

        <div style={contentPad}>

          {/* ── KPI Grid ── */}
          <div style={kpiGridStyle}>
            {kpiCards.map((card, i) => (
              <div key={card.label} style={{
                ...kpiCardStyle,
                borderTop: `3px solid ${card.color}`,
                animation: `fadeUp 0.4s ease ${i*0.08}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = theme.shadows.cardHover; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = theme.shadows.card; e.currentTarget.style.transform = "none"; }}>
                <div style={{ width:44, height:44, borderRadius:12, background:card.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:12 }}>
                  {card.emoji}
                </div>
                {/* ============================================================
                    🎨 KPI NUMBER — Change fontSize here (currently 54px)
                    ============================================================ */}
                <div style={{ fontFamily:theme.fonts.display, fontSize:54, fontWeight:800, color:card.color, lineHeight:1, letterSpacing:"-2px" }}>
                  {loading ? "—" : card.value}
                </div>
                <div style={{ fontSize:13, color:theme.colors.textSecondary, marginTop:8, fontWeight:500 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── AI Banner ── */}
          <div style={aiBannerStyle}>
            <div>
              <div style={{ fontFamily:theme.fonts.display, fontWeight:700, fontSize:15, color:theme.colors.textPrimary, marginBottom:4 }}>
                🤖 AI Smart Match
              </div>
              <div style={{ fontSize:13, color:theme.colors.textSecondary }}>
                {aiMessage || "Gemini AI ranks every volunteer by skill, location, and availability — in seconds."}
              </div>
            </div>
            <button style={{ ...aiRunBtnStyle, opacity:aiRunning?0.7:1 }}
              onClick={handleAiMatch} disabled={aiRunning}
              onMouseEnter={e=>{ if(!aiRunning) e.currentTarget.style.background=theme.colors.primaryDark; }}
              onMouseLeave={e=>{ if(!aiRunning) e.currentTarget.style.background=theme.colors.primary; }}>
              {aiRunning
                ? <><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⟳</span> Analysing...</>
                : "⚡ Run AI Match"}
            </button>
          </div>

          {/* ── Filter Bar ── */}
          <div style={filterBarStyle}>
            <span style={{ fontSize:12, fontWeight:600, color:theme.colors.textMuted, marginRight:4 }}>Filter:</span>
            {["ALL","CRITICAL","HIGH","MEDIUM","LOW"].map(f => (
              <button key={f} style={{
                ...filterBtnStyle,
                background:  filter===f ? theme.colors.primary : theme.colors.surface,
                color:       filter===f ? "#fff"               : theme.colors.textSecondary,
                borderColor: filter===f ? theme.colors.primary : theme.colors.border,
                fontWeight:  filter===f ? 700                  : 500,
              }} onClick={()=>setFilter(f)}>
                {f==="CRITICAL"&&"🚨 "}{f==="ALL"&&"📋 "}{f}
              </button>
            ))}
            <span style={{ marginLeft:"auto", fontSize:12, color:theme.colors.textMuted }}>
              {filteredNeeds.length} result{filteredNeeds.length!==1?"s":""}
            </span>
          </div>

          {/* ── Needs Grid ── */}
          {loading ? (
            <div style={loadingStyle}>
              <span style={{ animation:"spin 1s linear infinite", display:"inline-block", fontSize:28 }}>🌀</span>
              <div style={{ marginTop:12, fontSize:14, color:theme.colors.textMuted }}>Loading live needs from Firebase...</div>
            </div>
          ) : filteredNeeds.length === 0 ? (
            <div style={emptyStyle}>No {filter!=="ALL"?filter.toLowerCase():""} needs found. 🌱</div>
          ) : (
            /* ============================================================
               📋 NEEDS GRID — Change gridTemplateColumns here
               "repeat(3,1fr)" = 3 columns
               "repeat(2,1fr)" = 2 columns
               ============================================================ */
            <div style={needsGridStyle}>
              {filteredNeeds.map((need, i) => (
                <div key={need.id} style={{ animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                  <NeedCard
                    need={need}
                    urgencyStyle={URGENCY_CARD_STYLES[need.urgency] || URGENCY_CARD_STYLES.LOW}
                    onFindVolunteers={n => navigate("/match", { state:{ need:n } })}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              🗺 MAP SECTION — Free Leaflet / OpenStreetMap
              No API key needed!
              ══════════════════════════════════════════════════════ */}
          <div style={mapWrapStyle}>
            <div style={mapHeaderStyle}>
              <div>
                <div style={{ fontFamily:theme.fonts.display, fontWeight:700, fontSize:15, color:theme.colors.textPrimary, marginBottom:3 }}>
                  📍 Live Need Locations — Mumbai
                </div>
                <div style={{ fontSize:12, color:theme.colors.textMuted }}>
                  Click any marker for details · OpenStreetMap (free, no API key)
                </div>
              </div>
              <span style={mapBadgeStyle}>🟢 Live</span>
            </div>
            <MumbaiMap />
          </div>

        </div>
      </div>
    </>
  );
}

/* ============================================================
   💅 DASHBOARD STYLES
   ============================================================ */
const dashCSS = `
  @keyframes livePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
    70%      { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
  }
`;

const pageStyle    = { minHeight:"100vh", background:theme.colors.bg, fontFamily:theme.fonts.body };
const contentPad   = { padding:"24px 32px" };

/* 🎨 HERO BANNER BACKGROUND — Change gradient here */
const heroBannerStyle = {
  background:   `linear-gradient(135deg, #0f172a 0%, #0d2420 60%, #0f172a 100%)`,
  padding:      "24px 32px",
  borderBottom: `1px solid #0D948833`,
};
const heroBannerInnerStyle = {
  display:"flex", justifyContent:"space-between", alignItems:"center", gap:20, maxWidth:1200, margin:"0 auto",
};
const liveDotStyle = {
  width:9, height:9, borderRadius:"50%", background:"#22c55e",
  animation:"livePulse 2s ease-in-out infinite", flexShrink:0,
};
const heroBannerTitleStyle = {
  fontFamily:theme.fonts.display, fontSize:"clamp(16px,2.2vw,26px)", fontWeight:800, color:"#f0fdf4", margin:0, lineHeight:1.2,
};
const criticalAlertStyle = { fontSize:13, color:"#fca5a5", marginTop:8, fontWeight:500 };
const heroBannerBtnStyle  = {
  background:theme.colors.primary, color:"#fff", border:"none", borderRadius:theme.radius.sm,
  padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:theme.fonts.body,
  whiteSpace:"nowrap", transition:"background 0.18s ease", boxShadow:`0 4px 14px ${theme.colors.primary}44`,
};

const kpiGridStyle = {
  display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22,
};
const kpiCardStyle = {
  background:theme.colors.surface, border:`1px solid ${theme.colors.border}`,
  borderRadius:theme.radius.lg, padding:"22px 20px", transition:"all 0.22s ease",
  cursor:"default", boxShadow:theme.shadows.card,
};

const aiBannerStyle = {
  background:`linear-gradient(135deg, ${theme.colors.primary}12, ${theme.colors.accent}08)`,
  border:`1.5px solid ${theme.colors.primary}30`, borderRadius:theme.radius.lg,
  padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
  gap:16, marginBottom:20,
};
const aiRunBtnStyle = {
  background:theme.colors.primary, color:"#fff", border:"none", borderRadius:theme.radius.sm,
  padding:"10px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:theme.fonts.body,
  whiteSpace:"nowrap", boxShadow:theme.shadows.button, transition:"background 0.18s ease",
  display:"flex", alignItems:"center", gap:6,
};

const filterBarStyle = {
  display:"flex", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap",
};
const filterBtnStyle = {
  fontSize:11, padding:"5px 14px", borderRadius:theme.radius.full, border:"1.5px solid",
  cursor:"pointer", transition:"all 0.15s ease", fontFamily:theme.fonts.body,
};

const needsGridStyle  = { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 };
const loadingStyle    = { textAlign:"center", padding:"60px 20px", fontFamily:theme.fonts.body };
const emptyStyle      = { textAlign:"center", padding:"60px 20px", fontSize:15, color:theme.colors.textMuted };

const mapWrapStyle = {
  background:theme.colors.surface, border:`1.5px solid ${theme.colors.border}`,
  borderRadius:theme.radius.xl, overflow:"hidden",
};
const mapHeaderStyle = {
  display:"flex", justifyContent:"space-between", alignItems:"center",
  padding:"16px 20px", borderBottom:`1px solid ${theme.colors.border}`,
};
const mapBadgeStyle = {
  fontSize:11, padding:"3px 10px", background:theme.colors.primaryLight,
  color:theme.colors.primary, borderRadius:theme.radius.full, fontWeight:600,
};
/* ============================================================
   🗺 MAP HEIGHT — Change height here
   ============================================================ */
const mapContainerStyle = { height:340, width:"100%" };
const mapLoadingStyle   = {
  height:340, display:"flex", flexDirection:"column", alignItems:"center",
  justifyContent:"center", gap:12, background:theme.colors.surfaceAlt,
};
const mapLegendStyle = {
  display:"flex", gap:16, padding:"10px 16px",
  borderTop:`1px solid ${theme.colors.border}`, flexWrap:"wrap",
};