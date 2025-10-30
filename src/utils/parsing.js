export const extractTextFromHTML = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const splitIntoSentences = (text) => {
  return text.match(/[^.!?]+[.!?]+/g) || [text];
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const sanitizeInput = (text) => {
  return text.trim().replace(/\s+/g, " ");
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
