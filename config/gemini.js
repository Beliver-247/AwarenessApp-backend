const axios = require("axios");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function getEventRecommendations(userDescription, pastEvents, availableEvents, apiKey) {
  try {
    const prompt = `
      User description: ${userDescription || 'No description provided'}
      Past events participated in: ${pastEvents.map(e => e.title).join(", ") || 'None'}
      Available events: ${availableEvents.map(e => `${e.title} - ${e.description}`).join("; ")}
      
      Based on the user's profile and past participation, suggest the top 3 most relevant events for this user. 
      Consider their interests, past event types, and environmental focus areas.
      
      Please respond with a JSON array of event titles that would be most suitable for this user.
    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ 
          parts: [{ 
            text: prompt 
          }] 
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      { 
        headers: { 
          "Content-Type": "application/json" 
        } 
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
    throw new Error("Failed to fetch recommendations");
  }
}

async function getChallengeRecommendations(userDescription, pastChallenges, availableChallenges, apiKey) {
  try {
    const prompt = `
      User description: ${userDescription || 'No description provided'}
      Past challenges participated in: ${pastChallenges.map(c => c.title).join(", ") || 'None'}
      Available challenges: ${availableChallenges.map(c => `${c.title} - ${c.description} (${c.difficulty})`).join("; ")}
      
      Based on the user's profile and past participation, suggest the top 3 most relevant challenges for this user.
      Consider their interests, skill level, and environmental focus areas.
      
      Please respond with a JSON array of challenge titles that would be most suitable for this user.
    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ 
          parts: [{ 
            text: prompt 
          }] 
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      { 
        headers: { 
          "Content-Type": "application/json" 
        } 
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
    throw new Error("Failed to fetch challenge recommendations");
  }
}

module.exports = { 
  getEventRecommendations,
  getChallengeRecommendations 
};


