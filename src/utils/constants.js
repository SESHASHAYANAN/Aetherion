export const AI_DETECTION_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
  LOW: 0,
};

export const FACT_CHECK_STATUS = {
  VERIFIED: "verified",
  PARTIALLY_TRUE: "partially-true",
  FALSE: "false",
  UNVERIFIABLE: "unverifiable",
};

export const MAX_TEXT_LENGTH = 10000;

export const SUPPORTED_FILE_TYPES = [".txt", ".docx", ".pdf"];

export const API_ENDPOINTS = {
  AI_DETECTION: "/api/ai-detect",
  FACT_CHECK: "/api/fact-check",
  URL_EXTRACT: "/api/extract-url",
};
