// src/gemini/matchVolunteers.js
// Sends a need + volunteer list to Gemini, gets back ranked matches

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function matchVolunteers(need, volunteers) {
  try {
    // ── Guard: no volunteers ──
    if (!volunteers || volunteers.length === 0) {
      return { success: false, error: "No volunteers found in database." };
    }

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

    // ── Check HTTP response ──
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const data = await response.json();

    // ── Guard: check candidates exist ──
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Gemini returned no candidates. Check your API key.");
    }

    // ── Extract text from response ──
    const rawText = data.candidates[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Gemini response was empty.");
    }

    // ── Clean and parse JSON ──
    // Strip markdown code fences if present
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find the JSON array in the response
    const arrayStart = cleaned.indexOf("[");
    const arrayEnd   = cleaned.lastIndexOf("]");
    if (arrayStart === -1 || arrayEnd === -1) {
      throw new Error("Gemini did not return a valid JSON array.");
    }

    const jsonString = cleaned.slice(arrayStart, arrayEnd + 1);
    const result     = JSON.parse(jsonString);

    if (!Array.isArray(result)) {
      throw new Error("Expected an array from Gemini but got: " + typeof result);
    }

    return { success: true, data: result };

  } catch (error) {
    console.error("Gemini matchVolunteers error:", error);
    return { success: false, error: error.message };
  }
}