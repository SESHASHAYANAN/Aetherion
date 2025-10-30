import axios from "axios";

const XAI_API_KEY = process.env.REACT_APP_XAI_API_KEY;
const XAI_API_URL = "https://api.x.ai/v1/chat/completions";

export const verifyWithGrok = async (claim) => {
  try {
    const response = await axios.post(
      XAI_API_URL,
      {
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content:
              "You are a fact-checking assistant. Verify the given claim and provide sources. Respond in JSON format with: status (verified/partially-true/false/unverifiable), sources (array of {title, url, credibilityScore}), and explanation.",
          },
          {
            role: "user",
            content: `Verify this claim: "${claim}"`,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Grok API Error:", error);

    // Fallback verification
    return {
      status: "unverifiable",
      sources: [],
      explanation: "Unable to verify with external sources at this time.",
    };
  }
};

export const searchWithGrok = async (query) => {
  try {
    const response = await axios.post(
      XAI_API_URL,
      {
        model: "grok-beta",
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Grok Search Error:", error);
    throw error;
  }
};
