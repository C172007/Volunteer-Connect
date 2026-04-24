/* ============================================================
   🙋 REGISTERVOLUNTEER.JSX — Volunteer signup form (PAGE-4)
   Flow:
     Volunteer fills name, phone, email, location,
     availability, skills, optional about text
     → registerVolunteer() saves to Firestore (FIREBASE-3)
     → Redirect to Dashboard
   ============================================================ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme, keyframes } from "../theme";
import { registerVolunteer } from "../firebase/volunteers";

/* ============================================================
   🏷 SKILLS LIST — Add / remove available skills here
   These render as toggle buttons on the form
   ============================================================ */
const SKILLS_LIST = [
  "First Aid", "Medical",      "Teaching",    "Driving",
  "Cooking",   "Construction", "IT Support",  "Counselling",
  "Logistics", "Translation",  "Photography", "Fundraising",
];

/* ============================================================
   📅 AVAILABILITY OPTIONS — Change availability options here
   Each: { value: "stored-value", label: "Display label" }
   ============================================================ */
const AVAILABILITY_OPTIONS = [
  { value: "weekends",  label: "Weekends only"        },
  { value: "weekdays",  label: "Weekdays only"        },
  { value: "both",      label: "Weekdays + Weekends"  },
  { value: "flexible",  label: "Flexible / on-call"   },
];

/* ── Initial empty form state ── */
const EMPTY_FORM = {
  name:         "",
  phone:        "",
  email:        "",
  location:     "",
  availability: "weekends",
  skills:       [],
  about:        "",
};

export default function RegisterVolunteer() {
  const navigate = useNavigate();

  const [form,      setForm]      = useState(EMPTY_FORM);
  const [status,    setStatus]    = useState("idle");
  // status values: "idle" | "saving" | "done" | "error"
  const [errorMsg,  setErrorMsg]  = useState("");
  const [focusedId, setFocusedId] = useState(null);

  /* ── Field change handler ── */
  const handleChange = (id, value) =>
    setForm(prev => ({ ...prev, [id]: value }));

  /* ── Skill toggle — adds or removes a skill from the array ── */
  const toggleSkill = skill =>
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));

  /* ============================================================
     🔥 SAVE TO FIREBASE — Calls registerVolunteer() (FIREBASE-3)
     registerVolunteer() is in firebase/volunteers.js (Member 3)
     Returns: { success: true, id: "firestore-doc-id" }
     ============================================================ */
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg("Name and phone number are required.");
      return;
    }
    if (form.skills.length === 0) {
      setErrorMsg("Please select at least one skill.");
      return;
    }
    setErrorMsg("");
    setStatus("saving");
    try {
      const result = await registerVolunteer(form);
      if (result.success) {
        setStatus("done");
        /* 🎨 REDIRECT DELAY — Change ms before redirect here (currently 1800ms) */
        setTimeout(() => navigate("/dashboard"), 1800);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      setErrorMsg("Registration failed: " + e.message);
      setStatus("error");
    }
  };

  return (
    <>
      {/* ── Inject animation keyframes ── */}
      <style>{keyframes}</style>

      {/* ============================================================
          🌐 SPLINE / 3D SLOT — Add decorative 3D element here
          Example: <spline-viewer url="https://prod.spline.design/..."/>
          ============================================================ */}

      <div style={pageStyle}>

        {/* 🎨 BACK BUTTON — Change copy / style in backBtnStyle below */}
        <button style={backBtnStyle} onClick={() => navigate("/dashboard")}>
          ← Back to dashboard
        </button>

        <div style={cardWrapStyle}>

          {/* ── Card header ── */}
          {/* ============================================================
              🎨 FORM HEADER — Change icon emoji / title / subtitle here
              ============================================================ */}
          <div style={cardHeaderStyle}>
            <div style={headerIconStyle}>🙋</div>
            <div>
              <h1 style={formTitleStyle}>Register as Volunteer</h1>
              <p style={formSubStyle}>
                Join the network and get matched to needs that fit your skills and location.
              </p>
            </div>
          </div>

          {/* ── Success ── */}
          {status === "done" && (
            <div style={{ ...alertStyle, background: theme.colors.primaryLight, border: `1px solid ${theme.colors.primary}44`, animation: "popIn 0.4s ease" }}>
              <span style={{ fontSize: 22 }}>🎉</span>
              <div><strong>You're registered!</strong> Redirecting to dashboard...</div>
            </div>
          )}

          {/* ── Error ── */}
          {(status === "error" || errorMsg) && (
            <div style={{ ...alertStyle, background: "#FEE2E2", border: "1px solid #FCA5A5", animation: "popIn 0.3s ease" }}>
              <span>⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {/* ── Form (hidden once done) ── */}
          {status !== "done" && (
            <div style={formBodyStyle}>

              {/* ── Text input fields ── */}
              {/* ============================================================
                  🎨 TEXT FIELDS — Add new fields by copying a block here
                  Focus border colour = theme.colors.primary
                  ============================================================ */}
              {[
                { id: "name",     label: "Full name",    placeholder: "Your full name",           type: "text",  required: true  },
                { id: "phone",    label: "Phone number", placeholder: "+91 XXXXX XXXXX",          type: "tel",   required: true  },
                { id: "email",    label: "Email",        placeholder: "you@example.com",          type: "email", required: false },
                { id: "location", label: "Your area",    placeholder: "e.g. Kurla East, Mumbai",  type: "text",  required: false },
              ].map(field => (
                <div key={field.id} style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    {field.label}
                    {field.required && <span style={{ color: theme.colors.critical }}> *</span>}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.id]}
                    onChange={e => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    onFocus={() => setFocusedId(field.id)}
                    onBlur={() => setFocusedId(null)}
                    style={{
                      ...inputStyle,
                      borderColor: focusedId === field.id ? theme.colors.primary : theme.colors.border,
                      boxShadow:   focusedId === field.id ? `0 0 0 3px ${theme.colors.primary}22` : "none",
                    }}
                  />
                </div>
              ))}

              {/* ── Availability selector ── */}
              {/* ============================================================
                  📅 AVAILABILITY — Change options in AVAILABILITY_OPTIONS above
                  Active option: teal border + teal text
                  ============================================================ */}
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Availability</label>
                <div style={availabilityGridStyle}>
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      style={{
                        ...availOptionStyle,
                        background:  form.availability === opt.value ? theme.colors.primaryLight : theme.colors.surfaceAlt,
                        borderColor: form.availability === opt.value ? theme.colors.primary : theme.colors.border,
                        color:       form.availability === opt.value ? theme.colors.primary : theme.colors.textSecondary,
                      }}
                      onClick={() => handleChange("availability", opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Skills picker ── */}
              {/* ============================================================
                  🏷 SKILLS — Add / remove skills in SKILLS_LIST above
                  Selected: solid teal. Unselected: grey.
                  ============================================================ */}
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Skills <span style={{ color: theme.colors.critical }}>*</span>
                  <span style={{ fontSize: 12, fontWeight: 400, color: theme.colors.textMuted, marginLeft: 8 }}>
                    ({form.skills.length} selected)
                  </span>
                </label>
                <div style={skillsGridStyle}>
                  {SKILLS_LIST.map(skill => {
                    const selected = form.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        style={{
                          ...skillBtnStyle,
                          background:  selected ? theme.colors.primary      : theme.colors.surfaceAlt,
                          color:       selected ? "#fff"                    : theme.colors.textSecondary,
                          borderColor: selected ? theme.colors.primary      : theme.colors.border,
                        }}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── About (optional) ── */}
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>
                  About you{" "}
                  <span style={{ fontWeight: 400, color: theme.colors.textMuted }}>(optional)</span>
                </label>
                <textarea
                  value={form.about}
                  onChange={e => handleChange("about", e.target.value)}
                  placeholder="Any additional context — languages spoken, past experience, etc."
                  rows={3}
                  onFocus={() => setFocusedId("about")}
                  onBlur={() => setFocusedId(null)}
                  style={{
                    ...inputStyle,
                    resize:      "vertical",
                    minHeight:   80,
                    borderColor: focusedId === "about" ? theme.colors.primary : theme.colors.border,
                    boxShadow:   focusedId === "about" ? `0 0 0 3px ${theme.colors.primary}22` : "none",
                  }}
                />
              </div>

              {/* ============================================================
                  🔘 REGISTER BUTTON — Change copy / style in primaryBtnStyle
                  Disabled + faded while saving to Firebase
                  ============================================================ */}
              <button
                style={{ ...primaryBtnStyle, opacity: status === "saving" ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={status === "saving"}
                onMouseEnter={e => { if (status !== "saving") e.currentTarget.style.background = theme.colors.primaryDark; }}
                onMouseLeave={e => { if (status !== "saving") e.currentTarget.style.background = theme.colors.primary; }}
              >
                {status === "saving"
                  ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Registering...</>
                  : "🌱 Register as Volunteer"
                }
              </button>

            </div>
          )}

        </div>
      </div>
    </>
  );
}

/* ============================================================
   💅 REGISTER STYLES
   ============================================================ */

const pageStyle = {
  minHeight:  "100vh",
  background: theme.colors.bg,
  padding:    "28px 32px",
  fontFamily: theme.fonts.body,
};

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

/* 🎨 CARD WRAPPER — Change max width / border radius / padding here */
const cardWrapStyle = {
  maxWidth:     600,
  margin:       "0 auto",
  background:   theme.colors.surface,
  borderRadius: theme.radius.xl,
  padding:      "32px 36px",
  boxShadow:    theme.shadows.card,
  border:       `1px solid ${theme.colors.border}`,
};

const cardHeaderStyle = {
  display:       "flex",
  gap:           14,
  alignItems:    "flex-start",
  marginBottom:  28,
  paddingBottom: 20,
  borderBottom:  `1px solid ${theme.colors.border}`,
};

/* 🎨 HEADER ICON BOX — Change emoji / background colour here */
const headerIconStyle = {
  fontSize:       28,
  background:     theme.colors.primaryLight,
  borderRadius:   theme.radius.md,
  width:          52,
  height:         52,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  flexShrink:     0,
};

const formTitleStyle = {
  fontFamily: theme.fonts.display,
  fontSize:   22,
  fontWeight: 700,
  color:      theme.colors.textPrimary,
  margin:     "0 0 6px 0",
};

const formSubStyle = {
  fontSize:   13,
  color:      theme.colors.textSecondary,
  lineHeight: 1.5,
  margin:     0,
};

const formBodyStyle = {
  display:       "flex",
  flexDirection: "column",
  gap:           18,
};

const fieldGroupStyle = {
  display:       "flex",
  flexDirection: "column",
  gap:           6,
};

const labelStyle = {
  fontSize:   13,
  fontWeight: 600,
  color:      theme.colors.textPrimary,
};

/* 🎨 INPUT — Change padding / font size / background here */
const inputStyle = {
  width:        "100%",
  padding:      "10px 14px",
  fontSize:     14,
  fontFamily:   theme.fonts.body,
  color:        theme.colors.textPrimary,
  background:   theme.colors.surfaceAlt,
  border:       `1.5px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  outline:      "none",
  transition:   "border-color 0.18s ease, box-shadow 0.18s ease",
  boxSizing:    "border-box",
};

/* 🎨 AVAILABILITY GRID — Change to 1fr for single column */
const availabilityGridStyle = {
  display:             "grid",
  gridTemplateColumns: "1fr 1fr",
  gap:                 8,
};

/* 🎨 AVAILABILITY OPTION — Change padding / font size here
   Active colours are set inline above using theme.colors       */
const availOptionStyle = {
  padding:      "10px 14px",
  borderRadius: theme.radius.sm,
  border:       "1.5px solid",
  cursor:       "pointer",
  fontSize:     13,
  fontWeight:   500,
  textAlign:    "center",
  transition:   "all 0.15s ease",
  fontFamily:   theme.fonts.body,
};

const skillsGridStyle = {
  display:  "flex",
  flexWrap: "wrap",
  gap:      8,
};

/* 🎨 SKILL BUTTON — Change padding / border radius here
   Selected: solid teal. Unselected: grey. Both set inline above. */
const skillBtnStyle = {
  padding:      "7px 14px",
  borderRadius: theme.radius.full,
  border:       "1.5px solid",
  cursor:       "pointer",
  fontSize:     12,
  fontWeight:   500,
  transition:   "all 0.15s ease",
  fontFamily:   theme.fonts.body,
};

const alertStyle = {
  display:      "flex",
  alignItems:   "center",
  gap:          12,
  padding:      "14px 16px",
  borderRadius: theme.radius.md,
  marginBottom: 20,
  fontSize:     14,
};

/* 🎨 PRIMARY BUTTON — Change padding / font size here
   Hover colour is set inline using theme.colors.primaryDark */
const primaryBtnStyle = {
  width:          "100%",
  padding:        "12px 20px",
  background:     theme.colors.primary,
  color:          "#fff",
  border:         "none",
  borderRadius:   theme.radius.sm,
  fontSize:       14,
  fontWeight:     600,
  cursor:         "pointer",
  fontFamily:     theme.fonts.body,
  transition:     "background 0.18s ease",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  gap:            8,
};