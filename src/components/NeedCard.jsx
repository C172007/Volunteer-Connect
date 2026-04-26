/* ============================================================
   🃏 NEEDCARD.JSX — Single need card (UPGRADED)
   Now receives urgencyStyle prop from Dashboard for
   per-urgency background, border, and badge colours.

   📍 WHAT TO CHANGE WHERE:
   - Urgency colours   → URGENCY_CARD_STYLES in Dashboard.jsx
   - Card shape        → cardBaseStyle below
   - Title font size   → titleStyle below
   - Badge style       → badgeStyle below
   - Button style      → findBtnStyle below
   - Skill pills       → skillPillStyle below
   - Meta chips        → metaChipStyle below
   ============================================================ */

import { useState } from "react";
import { theme }    from "../theme";

/* ============================================================
   🎨 FALLBACK URGENCY STYLES — Used if no urgencyStyle prop passed
   Main urgency styles live in Dashboard.jsx → URGENCY_CARD_STYLES
   ============================================================ */
const FALLBACK_STYLE = {
  borderLeft:  `4px solid ${theme.colors.primary}`,
  background:  theme.colors.surface,
  badgeBg:     theme.colors.primaryLight,
  badgeColor:  theme.colors.primary,
  dot:         theme.colors.primary,
  label:       "Open",
  glowShadow:  theme.shadows.card,
};

export default function NeedCard({ need, urgencyStyle, onFindVolunteers }) {
  const [hovered, setHovered] = useState(false);

  /* Use passed urgencyStyle or fallback */
  const u = urgencyStyle || FALLBACK_STYLE;

  return (
    /* ============================================================
       🎨 CARD CONTAINER — Change border radius / padding here
       borderLeft and background come from urgencyStyle (per urgency)
       ============================================================ */
    <div
      style={{
        ...cardBaseStyle,
        borderLeft:  u.borderLeft,
        background:  hovered ? u.background : theme.colors.surface,
        boxShadow:   hovered ? u.glowShadow : theme.shadows.card,
        transform:   hovered ? "translateY(-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ── Top row: title + urgency badge ── */}
      <div style={topRowStyle}>
        {/* ============================================================
            🎨 CARD TITLE — Change font size in titleStyle below
            ============================================================ */}
        <h3 style={titleStyle}>
          {need.summary || need.title || "Untitled need"}
        </h3>

        {/* ============================================================
            🎨 URGENCY BADGE — Size/shape set in badgeStyle below
            Colours come from urgencyStyle prop
            ============================================================ */}
        <span style={{ ...badgeStyle, background:u.badgeBg, color:u.badgeColor }}>
          <span style={{ ...dotStyle, background:u.dot }}/>
          {u.label}
        </span>
      </div>

      {/* ── Meta row: location + volunteers needed + category ── */}
      <div style={metaRowStyle}>
        <MetaChip emoji="📍" text={need.location} />
        <MetaChip emoji="👥" text={`${need.volunteersNeeded} needed`} />
        <MetaChip emoji="🗂" text={need.category} />
      </div>

      {/* ── Skills needed ── */}
      {need.skillsNeeded?.length > 0 && (
        /* ============================================================
           🏷 SKILLS PILLS — Change pill colour in skillPillStyle below
           ============================================================ */
        <div style={skillsRowStyle}>
          {need.skillsNeeded.slice(0, 4).map(skill => (
            <span key={skill} style={skillPillStyle}>{skill}</span>
          ))}
          {need.skillsNeeded.length > 4 && (
            <span style={{ ...skillPillStyle, background:theme.colors.surfaceAlt, color:theme.colors.textMuted }}>
              +{need.skillsNeeded.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ height:1, background:theme.colors.border }}/>

      {/* ── Footer: status + find volunteers button ── */}
      <div style={footerRowStyle}>
        <span style={statusStyle}>
          {need.status === "open" ? "🟢 Open" : "⏸ " + need.status}
        </span>

        {/* ============================================================
            🔘 FIND VOLUNTEERS BUTTON — Change style in findBtnStyle below
            On hover: solid teal background
            ============================================================ */}
        <button
          style={{
            ...findBtnStyle,
            background:  hovered ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})` : theme.colors.primaryLight,
            color:       hovered ? "#fff" : theme.colors.primary,
            boxShadow:   hovered ? theme.shadows.button : "none",
          }}
          onClick={() => onFindVolunteers(need)}
        >
          Find volunteers →
        </button>
      </div>

    </div>
  );
}

/* ── Small meta chip ── */
function MetaChip({ emoji, text }) {
  return (
    <span style={metaChipStyle}>
      {emoji} {text || "—"}
    </span>
  );
}

/* ============================================================
   💅 NEEDCARD STYLES
   ============================================================ */

/* 🎨 CARD BASE — Change card border-radius, padding, transition here */
const cardBaseStyle = {
  border:        `1px solid ${theme.colors.border}`,
  borderRadius:  theme.radius.lg,
  padding:       "18px 20px",
  display:       "flex",
  flexDirection: "column",
  gap:           10,
  transition:    "all 0.22s ease",
  fontFamily:    theme.fonts.body,
  cursor:        "default",
};

const topRowStyle = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "flex-start",
  gap:            10,
};

/* 🎨 TITLE — Change font size here */
const titleStyle = {
  fontFamily: theme.fonts.display,
  fontSize:   14,
  fontWeight: 600,
  color:      theme.colors.textPrimary,
  lineHeight: 1.45,
  margin:     0,
  flex:       1,
};

/* 🎨 URGENCY BADGE — Change size/shape here */
const badgeStyle = {
  display:      "flex",
  alignItems:   "center",
  gap:          5,
  fontSize:     11,
  fontWeight:   700,
  padding:      "4px 10px",
  borderRadius: theme.radius.full,
  whiteSpace:   "nowrap",
  flexShrink:   0,
};

const dotStyle = {
  width:        6,
  height:       6,
  borderRadius: "50%",
  flexShrink:   0,
};

const metaRowStyle = {
  display:  "flex",
  flexWrap: "wrap",
  gap:      6,
};

/* 🎨 META CHIP — Change chip background/font here */
const metaChipStyle = {
  fontSize:     12,
  color:        theme.colors.textSecondary,
  background:   theme.colors.surfaceAlt,
  borderRadius: theme.radius.sm,
  padding:      "3px 8px",
};

const skillsRowStyle = {
  display:  "flex",
  flexWrap: "wrap",
  gap:      5,
};

/* 🎨 SKILL PILL — Change pill colour/size here */
const skillPillStyle = {
  fontSize:     11,
  fontWeight:   500,
  padding:      "3px 9px",
  borderRadius: theme.radius.full,
  background:   theme.colors.primaryLight,
  color:        theme.colors.primary,
  border:       `1px solid ${theme.colors.primary}22`,
};

const footerRowStyle = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "center",
};

const statusStyle = {
  fontSize:   12,
  color:      theme.colors.textSecondary,
  fontWeight: 500,
};

/* 🎨 FIND BUTTON — Change padding/font here */
const findBtnStyle = {
  fontSize:     12,
  fontWeight:   600,
  padding:      "8px 16px",
  borderRadius: theme.radius.sm,
  border:       "none",
  cursor:       "pointer",
  transition:   "all 0.2s ease",
  fontFamily:   theme.fonts.body,
};