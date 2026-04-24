/* ============================================================
   🎯 VOLUNTEERMATCH.JSX — Volunteer match results page (PAGE-3)
   Flow:
     Arrives from Dashboard with need in router state
     → Fetches all volunteers from Firebase (FIREBASE-3)
     → Calls Gemini to rank volunteers for this need (GEMINI-2)
     → Shows ranked volunteer cards with match %, skills, contact
   ============================================================ */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme, keyframes } from "../theme";
import { getAllVolunteers } from "../firebase/volunteers";
import { matchVolunteers } from "../gemini/matchVolunteers";

export default function VolunteerMatch() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const need       = state?.need;

  const [volunteers, setVolunteers] = useState([]);
  const [matches,    setMatches]    = useState([]);
  const [status,     setStatus]     = useState("idle");
  // status: "idle" | "loading" | "done" | "error"
  const [errorMsg,   setErrorMsg]   = useState("");

  /* ============================================================
     🔥 FETCH + MATCH on mount
     1. getAllVolunteers() — reads all profiles from Firestore
     2. matchVolunteers() — sends need + volunteers to Gemini
        Returns: [{ name, matchScore, reason, ...volunteerFields }]
     ============================================================ */
  useEffect(() => {
    if (!need) return;

    const run = async () => {
      setStatus("loading");
      try {
        const allVols  = await getAllVolunteers();
        setVolunteers(allVols);

        const result = await matchVolunteers(need, allVols);
        if (result.success) {
          setMatches(result.data);
          setStatus("done");
        } else {
          throw new Error(result.error);
        }
      } catch (e) {
        setErrorMsg("Matching failed: " + e.message);
        setStatus("error");
      }
    };

    run();
  }, [need]);

  /* ── Guard: no need passed ── */
  if (!need) {
    return (
      <div style={pageStyle}>
        <div style={emptyWrapStyle}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤷</div>
          <p style={{ color: theme.colors.textMuted, fontFamily: theme.fonts.body }}>
            No need selected. Go back and click "Find volunteers" on a need card.
          </p>
          <button style={backBtnStyle} onClick={() => navigate("/dashboard")}>
            ← Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Inject animation keyframes ── */}
      <style>{keyframes}</style>

      <div style={pageStyle}>

        {/* ── Back button ── */}
        {/* 🎨 BACK BUTTON — Change copy / style in backBtnStyle below */}
        <button style={backBtnStyle} onClick={() => navigate("/dashboard")}>
          ← Back to dashboard
        </button>

        {/* ── Page header ── */}
        {/* ============================================================
            🎨 PAGE HEADER — Change title / subtitle text here
            Need details come from router state (set in Dashboard)
            ============================================================ */}
        <div style={pageHeaderStyle}>
          <div>
            <h1 style={pageTitleStyle}>Volunteer Matches</h1>
            <p style={pageSubStyle}>
              For: <strong style={{ color: theme.colors.textPrimary }}>{need.summary || need.title}</strong>
              {" "}·{" "}
              <span style={{ color: theme.colors.textMuted }}>📍 {need.location}</span>
            </p>
          </div>

          {/* ── Need urgency badge ── */}
          {/* 🎨 URGENCY BADGE — Colours defined in URGENCY_BADGE_STYLES below */}
          <UrgencyBadge urgency={need.urgency} />
        </div>

        {/* ── Need summary card ── */}
        {/* ============================================================
            🃏 NEED SUMMARY — Shows the need details at the top
            Change background / border in needSummaryStyle below
            ============================================================ */}
        <div style={needSummaryStyle}>
          <div style={needSummaryRowStyle}>
            <MetaChip emoji="🗂"  text={need.category} />
            <MetaChip emoji="👥" text={`${need.volunteersNeeded} volunteers needed`} />
            {need.skillsNeeded?.slice(0, 3).map(s => (
              <span key={s} style={skillPillStyle}>{s}</span>
            ))}
            {need.skillsNeeded?.length > 3 && (
              <span style={{ ...skillPillStyle, background: theme.colors.surfaceAlt, color: theme.colors.textMuted }}>
                +{need.skillsNeeded.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* ── Loading state ── */}
        {status === "loading" && (
          <div style={loadingStyle}>
            <span style={{ fontSize: 40, display: "block", animation: "spin 1.2s linear infinite" }}>🤖</span>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 16, color: theme.colors.textPrimary, marginTop: 16 }}>
              Gemini AI is ranking volunteers...
            </div>
            <div style={{ fontSize: 13, color: theme.colors.textMuted, marginTop: 6 }}>
              Analysing skills, location, and availability
            </div>
          </div>
        )}

        {/* ── Error state ── */}
        {status === "error" && (
          <div style={errorBoxStyle}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>{errorMsg}</div>
          </div>
        )}

        {/* ── Results ── */}
        {status === "done" && (
          <>
            {/* ── Results header ── */}
            <div style={resultsHeaderStyle}>
              <span style={resultsCountStyle}>
                {matches.length} match{matches.length !== 1 ? "es" : ""} found
              </span>
              <span style={{ fontSize: 12, color: theme.colors.textMuted }}>
                Ranked by AI · best match first
              </span>
            </div>

            {/* ── Volunteer match cards ── */}
            {/* ============================================================
                📋 MATCH CARDS GRID — Change column count in matchGridStyle
                Currently: 1-column list for clarity on results page
                ============================================================ */}
            {matches.length === 0 ? (
              <div style={emptyWrapStyle}>
                <div style={{ fontSize: 36 }}>🌱</div>
                <p style={{ color: theme.colors.textMuted, fontFamily: theme.fonts.body }}>
                  No matching volunteers found. Try registering more volunteers first.
                </p>
              </div>
            ) : (
              <div style={matchGridStyle}>
                {matches.map((match, i) => (
                  <div key={match.id || match.name} style={{ animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
                    <VolunteerCard match={match} rank={i + 1} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}

/* ============================================================
   🃏 VOLUNTEER CARD SUBCOMPONENT
   Props:
     match — volunteer object + matchScore + reason from Gemini
     rank  — integer rank (1 = best)
   ============================================================ */
function VolunteerCard({ match, rank }) {
  const [hovered,   setHovered]   = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  /* ── Copy phone to clipboard ── */
  const handleCopyPhone = () => {
    if (match.phone) {
      navigator.clipboard.writeText(match.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── Match score colour ── */
  /* 🎨 MATCH SCORE COLOURS — Change score thresholds / colours here */
  const scoreColor =
    match.matchScore >= 80 ? theme.colors.low      :  // green
    match.matchScore >= 60 ? theme.colors.primary   :  // teal
    match.matchScore >= 40 ? theme.colors.accent    :  // orange
                             theme.colors.critical;    // red

  return (
    /* ============================================================
       🎨 VOLUNTEER CARD — Change card shape / shadow / border here
       Rank 1 gets a teal left accent border
       ============================================================ */
    <div
      style={{
        ...volCardStyle,
        boxShadow:  hovered ? theme.shadows.cardHover : theme.shadows.card,
        transform:  hovered ? "translateY(-2px)" : "none",
        /* 🎨 RANK 1 ACCENT — Remove borderLeft for no accent bar */
        borderLeft: rank === 1 ? `4px solid ${theme.colors.primary}` : `4px solid transparent`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ── Top row: rank + name + match score ── */}
      <div style={volCardTopStyle}>

        {/* Left: rank badge + name + location */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* ============================================================
              🏆 RANK BADGE — Change rank badge style in rankBadgeStyle
              Rank 1: solid teal. Others: grey outline.
              ============================================================ */}
          <div style={{
            ...rankBadgeStyle,
            background:  rank === 1 ? theme.colors.primary : theme.colors.surfaceAlt,
            color:       rank === 1 ? "#fff"               : theme.colors.textMuted,
            border:      rank === 1 ? "none"               : `1.5px solid ${theme.colors.border}`,
          }}>
            {rank === 1 ? "🥇" : `#${rank}`}
          </div>

          <div>
            {/* 🎨 VOLUNTEER NAME — Change font size in volNameStyle */}
            <div style={volNameStyle}>{match.name}</div>
            <div style={volLocationStyle}>📍 {match.location || "Location not set"}</div>
          </div>
        </div>

        {/* Right: match score circle */}
        {/* ============================================================
            🎯 MATCH SCORE — Change circle size in scoreCircleStyle
            Colour thresholds set in scoreColor above
            ============================================================ */}
        <div style={{ ...scoreCircleStyle, borderColor: scoreColor, color: scoreColor }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
            {match.matchScore}
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8 }}>%</div>
        </div>

      </div>

      {/* ── AI reason ── */}
      {/* ============================================================
          🤖 AI REASON — The one-line explanation from Gemini
          Change background / text colour in reasonBoxStyle
          ============================================================ */}
      <div style={reasonBoxStyle}>
        <span style={{ fontSize: 14 }}>🤖</span>
        <span style={{ fontSize: 13, color: theme.colors.textSecondary, lineHeight: 1.4 }}>
          {match.reason}
        </span>
      </div>

      {/* ── Skills ── */}
      {/* 🏷 SKILLS PILLS — Change pill colour in skillPillStyle below */}
      {match.skills?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {match.skills.slice(0, 5).map(s => (
            <span key={s} style={skillPillStyle}>{s}</span>
          ))}
          {match.skills.length > 5 && (
            <span style={{ ...skillPillStyle, background: theme.colors.surfaceAlt, color: theme.colors.textMuted }}>
              +{match.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* ── Availability chip ── */}
      {/* 🎨 AVAILABILITY — Change chip style in availChipStyle */}
      <div style={availChipStyle}>
        🗓 {match.availability || "Availability not set"}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: theme.colors.border, margin: "4px 0" }} />

      {/* ── Contact row ── */}
      {/* ============================================================
          📞 CONTACT BUTTONS — Copy phone / send email
          🎨 CONTACT BUTTON — Change style in contactBtnStyle below
          ============================================================ */}
      <div style={contactRowStyle}>

        {/* Phone copy button */}
        <button
          style={{
            ...contactBtnStyle,
            background: copied ? theme.colors.primaryLight : theme.colors.surfaceAlt,
            color:      copied ? theme.colors.primary      : theme.colors.textSecondary,
            borderColor: copied ? theme.colors.primary     : theme.colors.border,
          }}
          onClick={handleCopyPhone}
        >
          {copied ? "✅ Copied!" : `📞 ${match.phone || "No phone"}`}
        </button>

        {/* Email button */}
        {match.email && (
          <a
            href={`mailto:${match.email}`}
            style={emailBtnStyle}
          >
            ✉️ {match.email}
          </a>
        )}

        {/* Expand / collapse more info toggle */}
        {/* ============================================================
            🔽 EXPAND TOGGLE — Shows "about" field if available
            Remove this block if you don't want expandable cards
            ============================================================ */}
        {match.about && (
          <button
            style={toggleBtnStyle}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? "▲ Less" : "▼ More"}
          </button>
        )}

      </div>

      {/* ── Expanded about section ── */}
      {expanded && match.about && (
        <div style={aboutBoxStyle}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
            About
          </div>
          <div style={{ fontSize: 13, color: theme.colors.textSecondary, lineHeight: 1.5 }}>
            {match.about}
          </div>
        </div>
      )}

    </div>
  );
}

/* ── Urgency badge ── */
/* 🎨 URGENCY BADGE COLOURS — Change per-urgency colours here */
const URGENCY_BADGE_STYLES = {
  CRITICAL: { bg: "#FEE2E2", color: "#991B1B", label: "Critical" },
  HIGH:     { bg: "#FEF3C7", color: "#92400E", label: "High"     },
  MEDIUM:   { bg: "#FEF9C3", color: "#713F12", label: "Medium"   },
  LOW:      { bg: "#DCFCE7", color: "#166534", label: "Low"      },
};

function UrgencyBadge({ urgency }) {
  const s = URGENCY_BADGE_STYLES[urgency] || URGENCY_BADGE_STYLES.LOW;
  return (
    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: theme.radius.full, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

/* ── Meta chip ── */
function MetaChip({ emoji, text }) {
  return (
    <span style={{ fontSize: 12, color: theme.colors.textSecondary, background: theme.colors.surfaceAlt, borderRadius: theme.radius.sm, padding: "3px 8px" }}>
      {emoji} {text}
    </span>
  );
}

/* ============================================================
   💅 VOLUNTEERMATCH STYLES
   ============================================================ */

const pageStyle = {
  minHeight:  "100vh",
  background: theme.colors.bg,
  padding:    "28px 32px",
  fontFamily: theme.fonts.body,
};

/* 🎨 BACK BUTTON — Change font size / colour here */
const backBtnStyle = {
  background:   "none",
  border:       "none",
  cursor:       "pointer",
  fontSize:     13,
  color:        theme.colors.textSecondary,
  marginBottom: 20,
  padding:      0,
  fontFamily:   theme.fonts.body,
};

const pageHeaderStyle = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "flex-start",
  marginBottom:   16,
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
  color:    theme.colors.textSecondary,
  margin:   0,
};

/* 🎨 NEED SUMMARY CARD — Change background / border / padding here */
const needSummaryStyle = {
  background:    theme.colors.surface,
  border:        `1.5px solid ${theme.colors.border}`,
  borderRadius:  theme.radius.lg,
  padding:       "14px 18px",
  marginBottom:  24,
};

const needSummaryRowStyle = {
  display:  "flex",
  flexWrap: "wrap",
  gap:      6,
};

/* 🎨 SKILL PILL — Change pill colour / size here */
const skillPillStyle = {
  fontSize:     11,
  fontWeight:   500,
  padding:      "3px 9px",
  borderRadius: theme.radius.full,
  background:   theme.colors.primaryLight,
  color:        theme.colors.primary,
  border:       `1px solid ${theme.colors.primary}22`,
};

const loadingStyle = {
  textAlign:  "center",
  padding:    "80px 20px",
  fontFamily: theme.fonts.body,
};

const errorBoxStyle = {
  display:      "flex",
  alignItems:   "center",
  gap:          10,
  background:   "#FEE2E2",
  border:       "1px solid #FCA5A5",
  borderRadius: theme.radius.md,
  padding:      "14px 18px",
  fontSize:     14,
  color:        "#991B1B",
  fontFamily:   theme.fonts.body,
};

const resultsHeaderStyle = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "center",
  marginBottom:   14,
};

const resultsCountStyle = {
  fontSize:   14,
  fontWeight: 600,
  color:      theme.colors.textPrimary,
  fontFamily: theme.fonts.display,
};

/* 🎨 MATCH GRID — Change gap / columns here
   Currently 1-column list. For 2 cols: "repeat(2, 1fr)" */
const matchGridStyle = {
  display:       "flex",
  flexDirection: "column",
  gap:           14,
};

/* 🎨 VOLUNTEER CARD — Change border radius / padding here */
const volCardStyle = {
  background:    theme.colors.surface,
  border:        `1.5px solid ${theme.colors.border}`,
  borderRadius:  theme.radius.lg,
  padding:       "18px 20px",
  display:       "flex",
  flexDirection: "column",
  gap:           10,
  transition:    "all 0.22s ease",
  fontFamily:    theme.fonts.body,
};

const volCardTopStyle = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "center",
};

/* 🎨 RANK BADGE — Change size / font size here */
const rankBadgeStyle = {
  width:          36,
  height:         36,
  borderRadius:   theme.radius.full,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontSize:       13,
  fontWeight:     700,
  flexShrink:     0,
};

const volNameStyle = {
  fontFamily:   theme.fonts.display,
  fontSize:     16,
  fontWeight:   700,
  color:        theme.colors.textPrimary,
  marginBottom: 2,
};

const volLocationStyle = {
  fontSize: 12,
  color:    theme.colors.textMuted,
};

/* 🎨 SCORE CIRCLE — Change size / border thickness here */
const scoreCircleStyle = {
  width:          58,
  height:         58,
  borderRadius:   "50%",
  border:         "2.5px solid",
  display:        "flex",
  flexDirection:  "column",
  alignItems:     "center",
  justifyContent: "center",
  flexShrink:     0,
};

/* 🎨 AI REASON BOX — Change background / border here */
const reasonBoxStyle = {
  display:      "flex",
  alignItems:   "flex-start",
  gap:          8,
  background:   theme.colors.surfaceAlt,
  borderRadius: theme.radius.sm,
  padding:      "10px 12px",
};

/* 🎨 AVAILABILITY CHIP — Change chip style here */
const availChipStyle = {
  fontSize:     12,
  color:        theme.colors.textSecondary,
  background:   theme.colors.surfaceAlt,
  borderRadius: theme.radius.sm,
  padding:      "4px 10px",
  alignSelf:    "flex-start",
};

const contactRowStyle = {
  display:   "flex",
  gap:       8,
  flexWrap:  "wrap",
  alignItems:"center",
};

/* 🎨 CONTACT BUTTON — Change padding / font size here
   Active (copied) colours set inline above */
const contactBtnStyle = {
  padding:      "8px 14px",
  borderRadius: theme.radius.sm,
  border:       "1.5px solid",
  cursor:       "pointer",
  fontSize:     12,
  fontWeight:   500,
  transition:   "all 0.18s ease",
  fontFamily:   theme.fonts.body,
};

/* 🎨 EMAIL LINK — Change colour / style here */
const emailBtnStyle = {
  padding:        "8px 14px",
  borderRadius:   theme.radius.sm,
  border:         `1.5px solid ${theme.colors.border}`,
  fontSize:       12,
  fontWeight:     500,
  color:          theme.colors.textSecondary,
  background:     theme.colors.surfaceAlt,
  textDecoration: "none",
  fontFamily:     theme.fonts.body,
};

const toggleBtnStyle = {
  marginLeft:   "auto",
  background:   "none",
  border:       "none",
  cursor:       "pointer",
  fontSize:     12,
  color:        theme.colors.textMuted,
  fontFamily:   theme.fonts.body,
};

/* 🎨 ABOUT BOX — Change background / border here */
const aboutBoxStyle = {
  background:   theme.colors.surfaceAlt,
  borderRadius: theme.radius.sm,
  padding:      "10px 12px",
  animation:    "fadeIn 0.2s ease",
};

const emptyWrapStyle = {
  textAlign:   "center",
  padding:     "80px 20px",
  fontFamily:  theme.fonts.body,
};