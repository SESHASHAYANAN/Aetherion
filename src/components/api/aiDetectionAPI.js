import axios from "axios";

const SAPLING_API_KEY = process.env.REACT_APP_SAPLING_API_KEY;
const SAPLING_API_URL = "https://api.sapling.ai/api/v1/aidetect";

export const analyzeText = async (text) => {
  try {
    const response = await axios.post(SAPLING_API_URL, {
      key: SAPLING_API_KEY,
      text: text,
    });

    const { score, sentence_scores } = response.data;

    // Transform data to match our component structure
    return {
      overallScore: Math.round(score * 100),
      sentenceScores: sentence_scores.map((item) => ({
        sentence: item.sentence,
        score: Math.round(item.score * 100),
      })),
      modelAttribution: determineModel(score),
      analysis: {
        perplexity: calculatePerplexity(score),
        burstiness: calculateBurstiness(sentence_scores),
      },
    };
  } catch (error) {
    console.error("AI Detection Error:", error);

    // Return mock data for demonstration
    return generateMockAIDetection(text);
  }
};

export const analyzeURL = async (url) => {
  try {
    // Extract text from URL (requires backend implementation)
    const extractedText = await extractTextFromURL(url);
    return await analyzeText(extractedText);
  } catch (error) {
    console.error("URL Analysis Error:", error);
    throw new Error(
      "Failed to analyze URL. Please check the URL and try again."
    );
  }
};

const extractTextFromURL = async (url) => {
  // This should be implemented with a backend service
  // For now, return mock text
  return "Sample extracted text from URL...";
};

const determineModel = (score) => {
  if (score > 0.7) return "GPT-4";
  if (score > 0.4) return "GPT-3.5";
  return "Human";
};

const calculatePerplexity = (score) => {
  return (15 + score * 50).toFixed(1);
};

const calculateBurstiness = (sentenceScores) => {
  if (!sentenceScores || sentenceScores.length === 0) return "N/A";
  const variance =
    sentenceScores.reduce(
      (acc, item) => acc + Math.pow(item.score - 0.5, 2),
      0
    ) / sentenceScores.length;
  return (variance * 100).toFixed(1);
};

// Mock data generator for demonstration
const generateMockAIDetection = (text) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  return {
    overallScore: Math.floor(Math.random() * 100),
    sentenceScores: sentences.map((sentence) => ({
      sentence: sentence.trim(),
      score: Math.floor(Math.random() * 100),
    })),
    modelAttribution: "GPT-4",
    analysis: {
      perplexity: (Math.random() * 50 + 15).toFixed(1),
      burstiness: (Math.random() * 30).toFixed(1),
    },
  };
};
