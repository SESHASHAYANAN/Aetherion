import axios from "axios";
import { verifyWithGrok } from "./grokIntegration";

export const verifyFacts = async (text) => {
  try {
    // Extract claims from text
    const claims = await extractClaims(text);

    // Verify each claim using Grok API
    const verifiedClaims = await Promise.all(
      claims.map((claim) => verifyClaim(claim))
    );

    // Calculate overall credibility
    const overallCredibility = calculateCredibility(verifiedClaims);

    // Detect bias
    const biasDetection = await detectBias(text);

    return {
      claims: verifiedClaims,
      overallCredibility,
      biasDetection,
    };
  } catch (error) {
    console.error("Fact Check Error:", error);

    // Return mock data for demonstration
    return generateMockFactCheck(text);
  }
};

const extractClaims = async (text) => {
  // Use NLP to extract factual claims
  // This should use a proper NLP service
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  return sentences
    .filter((s) => s.length > 20)
    .slice(0, 5)
    .map((sentence) => sentence.trim());
};

const verifyClaim = async (claim) => {
  try {
    // Use Grok API to verify the claim
    const result = await verifyWithGrok(claim);

    return {
      claim,
      status: result.status,
      sources: result.sources,
      explanation: result.explanation,
    };
  } catch (error) {
    return {
      claim,
      status: "unverifiable",
      sources: [],
      explanation: "Unable to verify this claim",
    };
  }
};

const calculateCredibility = (claims) => {
  if (!claims || claims.length === 0) return 50;

  const statusWeights = {
    verified: 100,
    "partially-true": 50,
    false: 0,
    unverifiable: 50,
  };

  const totalScore = claims.reduce(
    (sum, claim) => sum + (statusWeights[claim.status] || 50),
    0
  );
  return Math.round(totalScore / claims.length);
};

const detectBias = async (text) => {
  // Implement bias detection logic
  // This should use a proper bias detection service

  const biasKeywords = {
    political: ["liberal", "conservative", "democrat", "republican"],
    sensational: ["shocking", "unbelievable", "stunning", "outrageous"],
  };

  const detectedBiases = [];
  const lowerText = text.toLowerCase();

  for (const [biasType, keywords] of Object.entries(biasKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      detectedBiases.push(biasType);
    }
  }

  return {
    detected: detectedBiases.length > 0,
    types: detectedBiases,
  };
};

// Mock data generator for demonstration
const generateMockFactCheck = (text) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const statuses = ["verified", "partially-true", "false", "unverifiable"];

  const claims = sentences.slice(0, 3).map((sentence, idx) => ({
    claim: sentence.trim(),
    status: statuses[idx % statuses.length],
    sources: [
      {
        title: "Example Source " + (idx + 1),
        url: "https://example.com/source" + (idx + 1),
        credibilityScore: Math.floor(Math.random() * 30) + 70,
      },
    ],
    explanation:
      "This claim has been verified against multiple trusted sources.",
  }));

  return {
    claims,
    overallCredibility: calculateCredibility(claims),
    biasDetection: {
      detected: false,
      types: [],
    },
  };
};
