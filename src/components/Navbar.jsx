/* ============================================================
   🧭 NAVBAR.JSX — Top navigation bar
   Sticky nav with logo (clickable → home), links, SOS button.

   📍 WHAT TO CHANGE WHERE:
   - Add/remove nav links  → NAV_LINKS array below
   - Logo icon/text        → Logo section in JSX
   - SOS button style      → sosBtnStyle below
   - Navbar background     → navStyle below
   - 🌐 Spline slot        → marked SPLINE SLOT
   - 🔠 Marquee slot       → marked MARQUEE SLOT
   ============================================================ */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { theme } from "../theme";

/* ============================================================
   🔗 NAV LINKS — Add or remove nav items here
   { to: "/route", label: "Display Name", emoji: "🔥" }
   ============================================================ */
const NAV_LINKS = [
  { to: "/",          label: "Home",        emoji: "🏠" },
  { to: "/dashboard", label: "Dashboard",   emoji: "📊" },
  { to: "/submit",    label: "Submit Need",  emoji: "📋" },
  { to: "/register",  label: "Register",    emoji: "🙋" },
];

/* ============================================================
   🆘 SOS MODAL — Emergency broadcast popup
   Change modal content / styles in SOSModal component below
   ============================================================ */
function SOSModal({ onClose }) {
  const [step,     setStep]     = useState("form"); // "form" | "sent"
  const [title,    setTitle]    = useState("");
  const [location, setLocation] = useState("");
  const [type,     setType]     = useState("🌊 Natural Disaster");

  const handleSend = () => {
    if (!title || !location) return;
    setStep("sent");
  };

  return (
    /* ============================================================
       🆘 SOS MODAL OVERLAY — Change backdrop colour here
       ============================================================ */
    <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalStyle}>

        {step === "form" ? (
          <>
            {/* ── Pulsing SOS icon ── */}
            <div style={sosPulseWrapStyle}>
              <div style={sosPulseStyle}>🆘</div>
            </div>

            {/* ============================================================
                🎨 SOS MODAL TITLE — Change heading / subtext here
                ============================================================ */}
            <h2 style={modalTitleStyle}>Emergency Broadcast</h2>
            <p style={modalSubStyle}>
              Instantly alert ALL available volunteers. Use only for urgent situations where 60-second matching isn't enough.
            </p>

            {/* ── Fields ── */}
            <div style={fieldsStyle}>
              {/* ============================================================
                  🎨 SOS FIELDS — Add/remove input fields here
                  ============================================================ */}
              <input
                style={sosInputStyle}
                placeholder="Emergency title — e.g. Flood Relief Kurla East"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <input
                style={sosInputStyle}
                placeholder="Affected location / area"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
              <select
                style={sosInputStyle}
                value={type}
                onChange={e => setType(e.target.value)}
              >
                {/* ============================================================
                    🎨 EMERGENCY TYPES — Add/remove options here
                    ============================================================ */}
                {["🌊 Natural Disaster","🏥 Medical Emergency","🔥 Fire / Accident","🍱 Urgent Food Relief","⚡ Infrastructure Failure"].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* ── Broadcast button ── */}
            <button
              style={{ ...broadcastBtnStyle, opacity: (!title || !location) ? 0.5 : 1 }}
              onClick={handleSend}
              disabled={!title || !location}
            >
              📡 Broadcast to All Volunteers
            </button>
            <button style={cancelBtnStyle} onClick={onClose}>
              Cancel — not an emergency
            </button>
          </>
        ) : (
          /* ── Success state ── */
          <>
            <div style={{ fontSize:56, textAlign:"center", marginBottom:16, animation:"popIn 0.4s ease" }}>✅</div>
            {/* ============================================================
                🎨 SOS SUCCESS MESSAGE — Change text here
                ============================================================ */}
            <h2 style={{ ...modalTitleStyle, color:"#166534" }}>Broadcast Sent!</h2>
            <p style={modalSubStyle}>
              <strong>"{title}"</strong> has been broadcast to all available volunteers in <strong>{location}</strong>. {type}
            </p>
            <div style={successBoxStyle}>
              <div style={{ fontSize:13, fontWeight:600, color:"#166534", marginBottom:8 }}>
                📊 Broadcast summary
              </div>
              {[
                ["Emergency type", type],
                ["Location",       location],
                ["Status",         "Alerts sent to all available volunteers"],
              ].map(([label, val]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0", borderBottom:`1px solid #D1FAE5` }}>
                  <span style={{ color:"#57534E" }}>{label}</span>
                  <span style={{ fontWeight:600, color:"#1C1917" }}>{val}</span>
                </div>
              ))}
            </div>
            <button style={{ ...broadcastBtnStyle, background:"#16A34A" }} onClick={onClose}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   🧭 MAIN NAVBAR COMPONENT
   ============================================================ */
export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const [showSOS, setShowSOS] = useState(false);

  return (
    <>
      {/* ============================================================
          🌐 SPLINE SLOT — Add 3D element in navbar background here
          ============================================================ */}

      {/* ============================================================
          🔠 MARQUEE SLOT — Add scrolling announcement bar above nav
          ============================================================ */}

      <nav style={navStyle}>

        {/* ── Logo — clicks to home ── */}
        {/* ============================================================
            🎨 LOGO — Change emoji, name, or add image here
            Logo is now clickable and navigates to /  (landing page)
            ============================================================ */}
        <Link to="/" style={logoLinkStyle}>
          <div style={logoIconStyle}>🌱</div>
          <span style={logoTextStyle}>
            Volunteer<span style={{ color: theme.colors.primary }}>Connect</span>
          </span>
        </Link>

        {/* ── Nav links ── */}
        <div style={linksWrapStyle}>
          {NAV_LINKS.map(link => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  ...linkBaseStyle,
                  ...(active ? linkActiveStyle : linkInactiveStyle),
                }}
              >
                <span style={{ fontSize:14 }}>{link.emoji}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── Right: SOS button + avatar ── */}
        <div style={navRightStyle}>
          {/* ============================================================
              🆘 SOS BUTTON — Change label / style in sosBtnStyle below
              Remove this block to hide SOS from navbar
              ============================================================ */}
          <button
            style={sosBtnStyle}
            onClick={() => setShowSOS(true)}
            onMouseEnter={e => e.currentTarget.style.background = "#B91C1C"}
            onMouseLeave={e => e.currentTarget.style.background = "#DC2626"}
          >
            🆘 SOS
          </button>

          {/* ============================================================
              🔘 AVATAR — Change initials or add profile photo here
              ============================================================ */}
          <div style={avatarStyle}>VC</div>
        </div>

      </nav>

      {/* SOS Modal */}
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
    </>
  );
}

/* ============================================================
   💅 NAVBAR STYLES
   ============================================================ */

/* 🎨 NAVBAR — Change background, height, border here */
const navStyle = {
  display:        "flex",
  alignItems:     "center",
  justifyContent: "space-between",
  padding:        "0 28px",
  height:         60,
  background:     theme.colors.surface,
  borderBottom:   `1.5px solid ${theme.colors.border}`,
  position:       "sticky",
  top:            0,
  zIndex:         100,
  fontFamily:     theme.fonts.body,
};

const logoLinkStyle = {
  textDecoration: "none",
  display:        "flex",
  alignItems:     "center",
  gap:            10,
};

const logoIconStyle = {
  width:          36,
  height:         36,
  borderRadius:   theme.radius.sm,
  background:     theme.colors.primaryLight,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontSize:       18,
};

const logoTextStyle = {
  fontFamily: theme.fonts.display,
  fontWeight: 700,
  fontSize:   17,
  color:      theme.colors.textPrimary,
};

const linksWrapStyle = {
  display:    "flex",
  gap:        4,
  alignItems: "center",
};

const linkBaseStyle = {
  display:        "flex",
  alignItems:     "center",
  gap:            6,
  fontSize:       13,
  fontWeight:     500,
  textDecoration: "none",
  padding:        "7px 14px",
  borderRadius:   theme.radius.sm,
  transition:     "all 0.18s ease",
  fontFamily:     theme.fonts.body,
};

const linkActiveStyle = {
  background: theme.colors.primaryLight,
  color:      theme.colors.primary,
  fontWeight: 600,
};

const linkInactiveStyle = {
  color:      theme.colors.textSecondary,
  background: "transparent",
};

const navRightStyle = {
  display:    "flex",
  alignItems: "center",
  gap:        10,
};

/* 🎨 SOS BUTTON — Change colour, size, label here */
const sosBtnStyle = {
  background:   "#DC2626",
  color:        "#fff",
  border:       "none",
  borderRadius: theme.radius.sm,
  padding:      "7px 14px",
  fontSize:     12,
  fontWeight:   700,
  cursor:       "pointer",
  fontFamily:   theme.fonts.body,
  transition:   "background 0.18s ease",
  letterSpacing:"0.3px",
  boxShadow:    "0 2px 8px rgba(220,38,38,0.3)",
};

const avatarStyle = {
  width:          34,
  height:         34,
  borderRadius:   theme.radius.full,
  background:     `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
  color:          "#fff",
  fontSize:       11,
  fontWeight:     700,
  fontFamily:     theme.fonts.display,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  cursor:         "pointer",
};

/* ============================================================
   💅 SOS MODAL STYLES
   ============================================================ */

/* 🎨 OVERLAY — Change backdrop opacity/colour here */
const overlayStyle = {
  position:        "fixed",
  inset:           0,
  background:      "rgba(220,38,38,0.12)",
  backdropFilter:  "blur(6px)",
  zIndex:          200,
  display:         "flex",
  alignItems:      "center",
  justifyContent:  "center",
  padding:         20,
};

/* 🎨 MODAL CARD — Change width, border, radius here */
const modalStyle = {
  background:    "#FFFBFB",
  border:        "2px solid #FCA5A5",
  borderRadius:  24,
  padding:       "36px 32px",
  width:         "100%",
  maxWidth:      480,
  maxHeight:     "90vh",
  overflowY:     "auto",
  fontFamily:    theme.fonts.body,
  animation:     "popIn 0.3s ease",
};

const sosPulseWrapStyle = {
  display:        "flex",
  justifyContent: "center",
  marginBottom:   16,
};

/* 🎨 SOS PULSE ICON — Change size here */
const sosPulseStyle = {
  width:          72,
  height:         72,
  borderRadius:   "50%",
  background:     "#FEE2E2",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontSize:       32,
  animation:      "pulse 1.4s ease-in-out infinite",
};

const modalTitleStyle = {
  fontFamily:   theme.fonts.display,
  fontSize:     22,
  fontWeight:   800,
  color:        "#991B1B",
  textAlign:    "center",
  marginBottom: 8,
  margin:       "0 0 8px 0",
};

const modalSubStyle = {
  fontSize:     13,
  color:        "#78716C",
  textAlign:    "center",
  lineHeight:   1.65,
  marginBottom: 22,
  margin:       "0 0 22px 0",
};

const fieldsStyle = {
  display:       "flex",
  flexDirection: "column",
  gap:           10,
  marginBottom:  18,
};

/* 🎨 SOS INPUT FIELDS — Change border, radius here */
const sosInputStyle = {
  width:        "100%",
  padding:      "10px 14px",
  fontSize:     13,
  fontFamily:   theme.fonts.body,
  color:        "#1C1917",
  background:   "#fff",
  border:       "1.5px solid #FCA5A5",
  borderRadius: theme.radius.sm,
  outline:      "none",
  boxSizing:    "border-box",
};

/* 🎨 BROADCAST BUTTON — Change colour here */
const broadcastBtnStyle = {
  width:        "100%",
  padding:      "13px",
  background:   "#DC2626",
  color:        "#fff",
  border:       "none",
  borderRadius: theme.radius.full,
  fontSize:     14,
  fontWeight:   700,
  cursor:       "pointer",
  fontFamily:   theme.fonts.display,
  marginBottom: 10,
  transition:   "background 0.18s ease",
  letterSpacing:"0.3px",
};

const cancelBtnStyle = {
  width:      "100%",
  background: "none",
  border:     "none",
  cursor:     "pointer",
  fontSize:   12,
  color:      "#A8A29E",
  fontFamily: theme.fonts.body,
  padding:    "6px 0",
};

const successBoxStyle = {
  background:   "#F0FDF4",
  border:       "1px solid #D1FAE5",
  borderRadius: theme.radius.md,
  padding:      "14px 16px",
  marginBottom: 20,
};