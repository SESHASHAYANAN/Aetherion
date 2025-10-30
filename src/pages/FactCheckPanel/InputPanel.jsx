import React, { useState } from "react";
import { FaFileAlt, FaLink, FaUpload } from "react-icons/fa";
import { analyzeText, analyzeURL } from "../api/aiDetectionAPI";
import { verifyFacts } from "../api/factCheckAPI";
import "../styles/InputPanel.css";

const InputPanel = ({ onAnalysisComplete, setLoading }) => {
  const [inputType, setInputType] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");

    if (inputType === "text" && !textInput.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    if (inputType === "url" && !urlInput.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    if (textInput.length > 10000) {
      setError("Text exceeds 10,000 character limit");
      return;
    }

    setLoading(true);

    try {
      let aiDetectionResult, factCheckResult;

      if (inputType === "text") {
        aiDetectionResult = await analyzeText(textInput);
        factCheckResult = await verifyFacts(textInput);
      } else if (inputType === "url") {
        aiDetectionResult = await analyzeURL(urlInput);
        factCheckResult = await verifyFacts(aiDetectionResult.extractedText);
      }

      onAnalysisComplete({
        aiDetection: aiDetectionResult,
        factCheck: factCheckResult,
        originalInput: inputType === "text" ? textInput : urlInput,
        inputType,
      });
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-panel card">
      <div className="input-type-selector">
        <button
          className={`input-type-btn ${inputType === "text" ? "active" : ""}`}
          onClick={() => setInputType("text")}
        >
          <FaFileAlt /> Text Input
        </button>
        <button
          className={`input-type-btn ${inputType === "url" ? "active" : ""}`}
          onClick={() => setInputType("url")}
        >
          <FaLink /> URL Analysis
        </button>
        <button
          className={`input-type-btn ${inputType === "file" ? "active" : ""}`}
          onClick={() => setInputType("file")}
        >
          <FaUpload /> File Upload
        </button>
      </div>

      <div className="input-area">
        {inputType === "text" && (
          <div className="text-input-container">
            <textarea
              className="text-input"
              placeholder="Paste your text here (up to 10,000 characters)..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              maxLength={10000}
            />
            <div className="char-count">
              {textInput.length} / 10,000 characters
            </div>
          </div>
        )}

        {inputType === "url" && (
          <div className="url-input-container">
            <input
              type="url"
              className="url-input"
              placeholder="Enter URL (e.g., https://example.com/article)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <p className="input-help">
              We'll extract and analyze the main content from the webpage
            </p>
          </div>
        )}

        {inputType === "file" && (
          <div className="file-input-container">
            <div className="file-upload-box">
              <FaUpload className="upload-icon" />
              <p>Drag and drop files here</p>
              <p className="file-types">Supported: .txt, .docx, .pdf</p>
              <button className="btn btn-secondary">Browse Files</button>
            </div>
            <p className="feature-badge">Coming in Phase 2</p>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="input-actions">
        <button
          className="btn btn-primary analyze-btn"
          onClick={handleAnalyze}
          disabled={inputType === "file"}
        >
          Analyze Content
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
