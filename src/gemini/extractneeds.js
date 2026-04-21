// src/gemini/extractNeeds.js
// Sends raw NGO text to Gemini and returns structured need data

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

    // Extract the text from Gemini's response
    const text = data.candidates[0].content.parts[0].text;

    // Clean up and parse the JSON
    const cleaned = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return { success: true, data: result };

  } catch (error) {
    console.error("Gemini extractNeeds error:", error);
    return { success: false, error: error.message };
  }
}