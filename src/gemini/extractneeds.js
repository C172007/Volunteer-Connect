// src/gemini/extractNeeds.js
// Sends raw NGO text to Gemini and returns structured need data
// If Gemini fails or rate limits → smart fallback response is returned

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/* ============================================================
   🔧 FALLBACK — Only used if Gemini API fails or rate limits.
   Detects keywords in the typed text to return a relevant response.
   ============================================================ */
function getFallback(rawText) {
  const isMedical = /medical|doctor|health|medicine|clinic/i.test(rawText);
  const isFood    = /food|meal|hunger|feed|distribution/i.test(rawText);
  const isTeach   = /teach|school|tutor|education|student/i.test(rawText);
  const isElderly = /elder|senior|old age|elderly/i.test(rawText);

  if (isMedical) return { success: true, fallback: true, data: {
    category: "Medical", urgency: "HIGH",
    skillsNeeded: ["Medical", "First Aid", "Counselling"],
    volunteersNeeded: 5,
    summary: "Medical volunteers needed urgently for health camp support."
  }};
  if (isFood) return { success: true, fallback: true, data: {
    category: "Food Distribution", urgency: "HIGH",
    skillsNeeded: ["Cooking", "Logistics", "Driving"],
    volunteersNeeded: 8,
    summary: "Volunteers needed to help distribute food this weekend."
  }};
  if (isTeach) return { success: true, fallback: true, data: {
    category: "Education", urgency: "MEDIUM",
    skillsNeeded: ["Teaching", "IT Support", "Translation"],
    volunteersNeeded: 3,
    summary: "Tutoring volunteers needed to support local students."
  }};
  if (isElderly) return { success: true, fallback: true, data: {
    category: "Elderly Care", urgency: "MEDIUM",
    skillsNeeded: ["Counselling", "Cooking", "First Aid"],
    volunteersNeeded: 4,
    summary: "Volunteers needed to assist elderly residents in the community."
  }};
  // Default fallback
  return { success: true, fallback: true, data: {
    category: "Disaster Relief", urgency: "CRITICAL",
    skillsNeeded: ["First Aid", "Physical Labour", "Logistics"],
    volunteersNeeded: 15,
    summary: "Urgent volunteers needed for disaster relief support."
  }};
}

export async function extractNeeds(rawText) {
  try {
    const prompt = `
You are a community needs analyst. Read the following NGO field report and extract structured information.

Field report: "${rawText}"

Reply ONLY with a JSON object with exactly these fields:
{
  "category": "one of: Disaster Relief, Food Distribution, Medical, Education, Elderly Care, Other",
  "urgency": "one of: CRITICAL, HIGH, MEDIUM, LOW",
  "skillsNeeded": ["array", "of", "skills"],
  "volunteersNeeded": 0,
  "summary": "one sentence summary"
}

No extra text. No markdown. Just the JSON object.
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

    const data = await response.json();

    // ── Check for API-level errors (rate limit, invalid key, etc.) ──
    if (data.error) {
      console.warn("Gemini API error:", data.error.message, "— using fallback");
      return getFallback(rawText);
    }

    // Extract the text from Gemini's response
    const text = data.candidates[0].content.parts[0].text;

    // Clean up and parse the JSON
    const cleaned = text.replace(/```json|```/g, "").trim();
    const result  = JSON.parse(cleaned);

    return { success: true, fallback: false, data: result };

  } catch (error) {
    // Network error, JSON parse failure, anything else → fallback
    console.warn("Gemini extractNeeds failed, using fallback:", error.message);
    return getFallback(rawText);
  }
}