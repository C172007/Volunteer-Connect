/* ============================================================
   🎨 THEME.JS — Central design system for VolunteerConnect
   All colours, fonts, spacing, shadows live here.
   To change the look of the ENTIRE app, edit this file only.
   ============================================================ */

export const theme = {

  /* ============================================================
     🎨 COLOUR TOKENS — Change app colours here
     Primary: Teal #0D9488
     Accent: Warm orange #F97316
     To swap the whole palette, replace values below
     ============================================================ */
  colors: {
    primary:       "#0D9488",   // teal — main brand colour
    primaryLight:  "#CCFBF1",   // teal tint — backgrounds, badges
    primaryDark:   "#0F766E",   // darker teal — hover states
    accent:        "#F97316",   // orange — highlights, urgency pops
    accentLight:   "#FFF7ED",   // orange tint
    accentDark:    "#EA580C",   // deeper orange — hover

    // Neutrals
    bg:            "#FAFAF9",   // warm off-white page background
    surface:       "#FFFFFF",   // card / panel background
    surfaceAlt:    "#F5F5F4",   // slightly grey surface
    border:        "#E7E5E4",   // subtle border
    borderStrong:  "#A8A29E",   // stronger border

    // Text
    textPrimary:   "#1C1917",   // near-black
    textSecondary: "#57534E",   // warm grey
    textMuted:     "#A8A29E",   // lightest text

    // Status colours
    critical:      "#EF4444",
    high:          "#F97316",
    medium:        "#EAB308",
    low:           "#22C55E",
  },

  /* ============================================================
     🔠 TYPOGRAPHY — Change fonts here
     Currently: DM Sans (body) + Syne (display/headings)
     To swap: change the Google Fonts import in index.html too
     ============================================================ */
  fonts: {
    display: "'Fraunces', serif",    // headings, big numbers
    body:    "'DM Sans', sans-serif", // body text, labels, inputs
  },

  /* ============================================================
     📐 SPACING & RADIUS — Change roundness / spacing here
     ============================================================ */
  radius: {
    sm:   "8px",
    md:   "14px",
    lg:   "20px",
    xl:   "28px",
    full: "9999px",
  },

  /* ============================================================
     🌑 SHADOWS — Change card / button depth here
     ============================================================ */
  shadows: {
    card:      "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    cardHover: "0 8px 28px rgba(13,148,136,0.13), 0 2px 8px rgba(0,0,0,0.06)",
    button:    "0 2px 8px rgba(13,148,136,0.25)",
  },
};

/* ============================================================
   🎞 ANIMATION KEYFRAMES — Injected via <style>{keyframes}</style>
   Add new animations here and reference them in components
   ============================================================ */
export const keyframes = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.92); opacity: 0; }
    60%  { transform: scale(1.03); }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  /* 🔠 MARQUEE ANIMATION — used by marquee ticker component */
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
`;

/* ============================================================
   🌐 GOOGLE FONTS — Paste inside <head> in index.html:
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
   ============================================================ */