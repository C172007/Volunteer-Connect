// src/gemini/matchVolunteers.js
// Sends a need + volunteer list to Gemini, gets back ranked matches
// If Gemini fails or rate limits → local scoring algorithm runs instead

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/* ============================================================
   🔧 LOCAL FALLBACK MATCHER
   Runs entirely in the browser — no API needed.
   Scores each volunteer on 3 factors:
     Skill overlap  → up to 60 pts
     Location match → up to 25 pts
     Availability   → up to 15 pts
   Only used if Gemini fails or rate limits.
   ============================================================ */
function localMatch(need, volunteers) {
  const needSkills   = (need.skillsNeeded || []).map(s => s.toLowerCase());
  const needLocation = (need.location || "").toLowerCase().split(",")[0].trim();

  const scored = volunteers.map(vol => {
    const volSkills = (vol.skills || []).map(s => s.toLowerCase());
    const volLoc    = (vol.location || "").toLowerCase();

    // Skill overlap (0–60)
    const matched   = volSkills.filter(s => needSkills.includes(s));
    const skillScore = needSkills.length > 0
      ? Math.round((matched.length / needSkills.length) * 60)
      : 30;

    // Location match (0–25)
    const locScore = volLoc.includes(needLocation) || needLocation.includes(volLoc.split(",")[0].trim())
      ? 25 : 0;

    // Availability (0–15)
    const avail     = (vol.availability || "").toLowerCase();
    const availScore = avail === "both" || avail === "flexible" ? 15
      : avail === "weekends" ? 10
      : avail === "weekdays" ? 8 : 5;

    const matchScore = Math.min(skillScore + locScore + availScore, 99);

    const reason = matched.length > 0
      ? `Matched on ${matched.join(", ")}${locScore > 0 ? ", located near " + need.location : ""}.`
      : `Available ${avail} — consider if skill requirements are flexible.`;

    return {
      name:         vol.name         || "Unknown",
      matchScore,
      reason,
      phone:        vol.phone        || "",
      email:        vol.email        || "",
      location:     vol.location     || "",
      skills:       vol.skills       || [],
      availability: vol.availability || "",
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return { success: true, fallback: true, data: scored };
}

export async function matchVolunteers(need, volunteers) {
  // ── Guard: no volunteers ──
  if (!volunteers || volunteers.length === 0) {
    return { success: false, error: "No volunteers found in database." };
  }

  try {
    // ── Simplify volunteer data to keep the prompt small ──
    const volunteerList = volunteers.map((v) => ({
      name:         v.name         || "Unknown",
      location:     v.location     || "Unknown",
      skills:       v.skills       || [],
      availability: v.availability || "unknown",
      campsDone:    v.campsDone    || 0,
      phone:        v.phone        || "",
      email:        v.email        || "",
      about:        v.about        || "",
    }));

    const prompt = `
You are a volunteer coordinator. Match the following need to the best volunteers from this list.

Need:
- Description: ${need.summary || need.title || ""}
- Category: ${need.category || ""}
- Location: ${need.location || ""}
- Skills needed: ${(need.skillsNeeded || []).join(", ")}
- Urgency: ${need.urgency || ""}

Volunteers:
${JSON.stringify(volunteerList, null, 2)}

Reply ONLY with a valid JSON array. No extra text, no markdown, no backticks.
Sort best match first. Include ALL volunteers in the response.
Each item must have exactly these fields:
[
  {
    "name": "volunteer name",
    "matchScore": 85,
    "reason": "one sentence explaining why they match",
    "phone": "their phone number",
    "email": "their email",
    "location": "their location",
    "skills": ["skill1", "skill2"],
    "availability": "their availability"
  }
]
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    // ── Check for API-level error in response body (rate limit etc.) ──
    const data = await response.json();
    if (data.error) {
      console.warn("Gemini API error:", data.error.message, "— using local fallback");
      return localMatch(need, volunteers);
    }

    // ── Check HTTP response ──
    if (!response.ok) {
      console.warn("Gemini HTTP error:", response.status, "— using local fallback");
      return localMatch(need, volunteers);
    }

    // ── Guard: check candidates exist ──
    if (!data.candidates || data.candidates.length === 0) {
      console.warn("Gemini returned no candidates — using local fallback");
      return localMatch(need, volunteers);
    }

    // ── Extract text from response ──
    const rawText = data.candidates[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.warn("Gemini response was empty — using local fallback");
      return localMatch(need, volunteers);
    }

    // ── Clean and parse JSON ──
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find the JSON array in the response
    const arrayStart = cleaned.indexOf("[");
    const arrayEnd   = cleaned.lastIndexOf("]");
    if (arrayStart === -1 || arrayEnd === -1) {
      console.warn("Gemini did not return a valid JSON array — using local fallback");
      return localMatch(need, volunteers);
    }

    const jsonString = cleaned.slice(arrayStart, arrayEnd + 1);
    const result     = JSON.parse(jsonString);

    if (!Array.isArray(result)) {
      console.warn("Gemini result was not an array — using local fallback");
      return localMatch(need, volunteers);
    }

    return { success: true, fallback: false, data: result };

  } catch (error) {
    // Network error, JSON parse failure, anything else → local fallback
    console.warn("Gemini matchVolunteers failed, using local fallback:", error.message);
    return localMatch(need, volunteers);
  }
}