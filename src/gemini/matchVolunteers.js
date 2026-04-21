// src/gemini/matchVolunteers.js
// Sends a need + volunteer list to Gemini, gets back ranked matches

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function matchVolunteers(need, volunteers) {
  try {
    // Simplify volunteer data to keep the prompt small
    const volunteerList = volunteers.map((v) => ({
      name: v.name,
      location: v.location,
      skills: v.skills,
      availability: v.availability,
      campsDone: v.campsDone,
      phone: v.phone,
      email: v.email,
    }));

    const prompt = `
You are a volunteer coordinator. Match the following need to the best volunteers from this list.

Need:
- Description: ${need.summary}
- Category: ${need.category}
- Location: ${need.location}
- Skills needed: ${need.skillsNeeded?.join(", ")}
- Urgency: ${need.urgency}

Volunteers:
${JSON.stringify(volunteerList, null, 2)}

Reply ONLY with a JSON array, sorted best match first. Each item must have:
{
  "name": "volunteer name",
  "matchScore": 0 to 100,
  "reason": "one sentence explaining why they match",
  "phone": "their phone number",
  "email": "their email"
}

No extra text. No markdown. Just the JSON array.
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

    const text = data.candidates[0].content.parts[0].text;
    const cleaned = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return { success: true, data: result };

  } catch (error) {
    console.error("Gemini matchVolunteers error:", error);
    return { success: false, error: error.message };
  }
}