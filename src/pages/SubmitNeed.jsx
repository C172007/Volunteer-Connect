/* ============================================================
   📋 SUBMITNEED.JSX — NGO need submission form (PAGE-1)
   Flow:
     Step 1 → NGO types raw text → clicks "Extract with AI"
     Step 2 → GEMINI-1 reads text → returns structured JSON
     Step 3 → Preview panel shows extracted data for review
     Step 4 → NGO confirms → FIREBASE-2 saves to Firestore
     Step 5 → Redirect to Dashboard
   ============================================================ */
 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme, keyframes } from "../theme";
import { submitNeed } from "../firebase/needs";
import { extractNeeds } from "../gemini/extractNeeds";
 
/* ============================================================
   🎨 FORM FIELD CONFIG — Add / remove / rename form fields here
   Each field: { id, label, placeholder, type, required, hint? }
   ============================================================ */
const FORM_FIELDS = [
  {
    id:          "rawText",
    label:       "Describe your need",
    placeholder: "e.g. We need 10 volunteers in Kurla East this Saturday for flood relief. First aid skills preferred...",
    type:        "textarea",
    required:    true,
    hint:        "Write naturally — our AI will extract the details automatically.",
  },
  {
    id:          "location",
    label:       "Location",
    placeholder: "e.g. Kurla East, Mumbai",
    type:        "text",
    required:    true,
  },
  {
    id:          "contactName",
    label:       "Your name",
    placeholder: "NGO coordinator name",
    type:        "text",
    required:    false,
  },
  {
    id:          "contactPhone",
    label:       "Contact number",
    placeholder: "+91 XXXXX XXXXX",
    type:        "tel",
    required:    false,
  },
];
 
/* ── Initial empty form state ── */
const EMPTY_FORM = { rawText: "", location: "", contactName: "", contactPhone: "" };
 
export default function SubmitNeed() {
  const navigate = useNavigate();
 
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [step,      setStep]      = useState("idle");
  // step values: "idle" | "extracting" | "preview" | "saving" | "done" | "error"
  const [extracted, setExtracted] = useState(null);
  const [errorMsg,  setErrorMsg]  = useState("");
  const [focusedId, setFocusedId] = useState(null);
 
  /* ── Field change handler ── */
  const handleChange = (id, value) =>
    setForm(prev => ({ ...prev, [id]: value }));
 
  /* ============================================================
     🤖 STEP 1 — Send text to Gemini for extraction (GEMINI-1)
     extractNeeds() is in gemini/extractNeeds.js (Member 4)
     Returns: { success: true, data: { category, urgency, location,
                skillsNeeded, volunteersNeeded, summary } }
     ============================================================ */
  const handleExtract = async () => {
    if (!form.rawText.trim()) {
      setErrorMsg("Please describe the need before submitting.");
      return;
    }
    setErrorMsg("");
    setStep("extracting");
    try {
      const result = await extractNeeds(form.rawText);
      if (result.success) {
        setExtracted({
          ...result.data,
          location: form.location || result.data.location || "Unknown",
        });
        setStep("preview");
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      setErrorMsg("AI extraction failed: " + e.message);
      setStep("error");
    }
  };
 
  /* ============================================================
     🔥 STEP 2 — Save extracted need to Firebase (FIREBASE-2)
     submitNeed() is in firebase/needs.js (Member 3)
     Returns: { success: true, id: "firestore-doc-id" }
     ============================================================ */
  const handleSave = async () => {
    setStep("saving");
    try {
      const result = await submitNeed({
        ...extracted,
        rawText:      form.rawText,
        contactName:  form.contactName,
        contactPhone: form.contactPhone,
      });
      if (result.success) {
        setStep("done");
        /* 🎨 REDIRECT DELAY — Change ms before redirect here (currently 1800ms) */
        setTimeout(() => navigate("/dashboard"), 1800);
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      setErrorMsg("Save failed: " + e.message);
      setStep("error");
    }
  };
 
  /* ── Reset form back to idle ── */
  const reset = () => {
    setForm(EMPTY_FORM);
    setExtracted(null);
    setStep("idle");
    setErrorMsg("");
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
            <div style={headerIconStyle}>📋</div>
            <div>
              <h1 style={formTitleStyle}>Submit a Need</h1>
              <p style={formSubStyle}>
                Describe the situation — our AI will extract skills, urgency, and volunteer count automatically.
              </p>
            </div>
          </div>
 
          {/* ── Success state ── */}
          {step === "done" && (
            <div style={{ ...alertStyle, background: theme.colors.primaryLight, border: `1px solid ${theme.colors.primary}44`, animation: "popIn 0.4s ease" }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div><strong>Need submitted!</strong> Redirecting to dashboard...</div>
            </div>
          )}
 
          {/* ── Error state ── */}
          {(step === "error" || errorMsg) && (
            <div style={{ ...alertStyle, background: "#FEE2E2", border: "1px solid #FCA5A5", animation: "popIn 0.3s ease" }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}
 
          {/* ── Input form (idle / extracting / error states) ── */}
          {(step === "idle" || step === "extracting" || step === "error") && (
            <div style={formBodyStyle}>
 
              {FORM_FIELDS.map(field => (
                /* ============================================================
                   🎨 FORM FIELD — Focused border colour = theme.colors.primary
                   Change inputStyle below to adjust padding / font size
                   ============================================================ */
                <div key={field.id} style={fieldGroupStyle}>
                  <label style={labelStyle}>
                    {field.label}
                    {field.required && <span style={{ color: theme.colors.critical }}> *</span>}
                  </label>
 
                  {field.type === "textarea" ? (
                    <textarea
                      value={form[field.id]}
                      onChange={e => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={5}
                      onFocus={() => setFocusedId(field.id)}
                      onBlur={() => setFocusedId(null)}
                      style={{
                        ...inputStyle,
                        resize:      "vertical",
                        minHeight:   110,
                        borderColor: focusedId === field.id ? theme.colors.primary : theme.colors.border,
                        boxShadow:   focusedId === field.id ? `0 0 0 3px ${theme.colors.primary}22` : "none",
                      }}
                    />
                  ) : (
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
                  )}
 
                  {field.hint && <p style={hintStyle}>{field.hint}</p>}
                </div>
              ))}
 
              {/* ============================================================
                  🔘 EXTRACT BUTTON — Change copy / style in primaryBtnStyle
                  Disabled + faded while Gemini is running
                  ============================================================ */}
              <button
                style={{ ...primaryBtnStyle, opacity: step === "extracting" ? 0.7 : 1 }}
                onClick={handleExtract}
                disabled={step === "extracting"}
                onMouseEnter={e => { if (step !== "extracting") e.currentTarget.style.background = theme.colors.primaryDark; }}
                onMouseLeave={e => { if (step !== "extracting") e.currentTarget.style.background = theme.colors.primary; }}
              >
                {step === "extracting"
                  ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> AI is extracting...</>
                  : "🤖 Extract with AI →"
                }
              </button>
 
            </div>
          )}
 
          {/* ── AI Preview panel (shows extracted data before saving) ── */}
          {/* ============================================================
              🤖 AI PREVIEW — Change preview card style in previewItemStyle
              This shows after Gemini returns structured data
              ============================================================ */}
          {step === "preview" && extracted && (
            <div style={{ animation: "fadeUp 0.35s ease" }}>
 
              <div style={previewHeaderStyle}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: theme.fonts.display, fontSize: 15 }}>
                    AI Extracted Data
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.textMuted }}>
                    Review before saving to Firebase
                  </div>
                </div>
              </div>
 
              {/* ── 2×2 preview grid ── */}
              <div style={previewGridStyle}>
                {[
                  ["Category",   extracted.category],
                  ["Urgency",    extracted.urgency],
                  ["Volunteers", extracted.volunteersNeeded],
                  ["Location",   extracted.location],
                ].map(([label, value]) => (
                  <div key={label} style={previewItemStyle}>
                    <div style={previewLabelStyle}>{label}</div>
                    <div style={previewValueStyle}>{value ?? "—"}</div>
                  </div>
                ))}
              </div>
 
              {/* ── Skills pills ── */}
              <div style={{ marginBottom: 16 }}>
                <div style={previewLabelStyle}>Skills needed</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {(extracted.skillsNeeded || []).map(s => (
                    <span key={s} style={skillTagStyle}>{s}</span>
                  ))}
                </div>
              </div>
 
              {/* ── Summary ── */}
              <div style={{ ...previewItemStyle, marginBottom: 20 }}>
                <div style={previewLabelStyle}>Summary</div>
                <div style={{ fontSize: 14, color: theme.colors.textPrimary, lineHeight: 1.5 }}>
                  {extracted.summary}
                </div>
              </div>
 
              {/* ── Edit / Confirm buttons ── */}
              <div style={{ display: "flex", gap: 10 }}>
                <button style={secondaryBtnStyle} onClick={reset}>← Edit</button>
                <button
                  style={{ ...primaryBtnStyle, flex: 1, opacity: step === "saving" ? 0.7 : 1 }}
                  onClick={handleSave}
                  disabled={step === "saving"}
                  onMouseEnter={e => { e.currentTarget.style.background = theme.colors.primaryDark; }}
                  onMouseLeave={e => { e.currentTarget.style.background = theme.colors.primary; }}
                >
                  {step === "saving" ? "Saving..." : "✅ Confirm & Save to Firebase"}
                </button>
              </div>
 
            </div>
          )}
 
        </div>
      </div>
    </>
  );
}
 
/* ============================================================
   💅 SUBMITNEED STYLES
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
 
/* 🎨 HEADER ICON BOX — Change emoji / bg colour here */
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
 
/* 🎨 INPUT — Change padding / font size / background here
   Focus border colour is set inline using theme.colors.primary */
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
 
const hintStyle = {
  fontSize: 12,
  color:    theme.colors.textMuted,
  margin:   0,
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
 
const secondaryBtnStyle = {
  padding:      "12px 20px",
  background:   theme.colors.surfaceAlt,
  color:        theme.colors.textSecondary,
  border:       `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  fontSize:     13,
  fontWeight:   600,
  cursor:       "pointer",
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
 
const previewHeaderStyle = {
  display:      "flex",
  alignItems:   "center",
  gap:          10,
  background:   theme.colors.primaryLight,
  border:       `1px solid ${theme.colors.primary}33`,
  borderRadius: theme.radius.md,
  padding:      "12px 16px",
  marginBottom: 18,
};
 
/* 🎨 PREVIEW GRID — Change column count here (currently 2 cols) */
const previewGridStyle = {
  display:             "grid",
  gridTemplateColumns: "1fr 1fr",
  gap:                 10,
  marginBottom:        14,
};
 
const previewItemStyle = {
  background:   theme.colors.surfaceAlt,
  borderRadius: theme.radius.sm,
  padding:      "10px 14px",
};
 
const previewLabelStyle = {
  fontSize:      11,
  fontWeight:    600,
  color:         theme.colors.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom:  4,
};
 
const previewValueStyle = {
  fontSize:   14,
  fontWeight: 600,
  color:      theme.colors.textPrimary,
  fontFamily: theme.fonts.display,
};
 
/* 🎨 SKILL TAG — Change pill colour in skillTagStyle here */
const skillTagStyle = {
  fontSize:     11,
  fontWeight:   500,
  padding:      "3px 10px",
  borderRadius: theme.radius.full,
  background:   theme.colors.primaryLight,
  color:        theme.colors.primary,
};