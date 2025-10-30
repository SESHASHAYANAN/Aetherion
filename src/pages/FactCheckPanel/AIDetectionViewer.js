import React from "react";
import Heatmap from "./Heatmap";
import "../styles/AIDetectionViewer.css";

const AIDetectionViewer = ({ data }) => {
  if (!data) return null;

  const { overallScore, sentenceScores, modelAttribution, analysis } = data;

  const getScoreColor = (score) => {
    if (score >= 70) return "var(--danger-color)";
    if (score >= 40) return "var(--warning-color)";
    return "var(--success-color)";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return "Likely AI-Generated";
    if (score >= 40) return "Possibly AI-Generated";
    return "Likely Human-Written";
  };

  return (
    <div className="ai-detection-viewer card">
      <h2 className="section-heading">AI Detection Analysis</h2>

      <div className="overall-score-container">
        <div
          className="score-circle"
          style={{ borderColor: getScoreColor(overallScore) }}
        >
          <div className="score-value">{overallScore}%</div>
          <div className="score-label">AI Confidence</div>
        </div>
        <div className="score-interpretation">
          <h3>{getScoreLabel(overallScore)}</h3>
          <p className="score-description">
            {overallScore >= 70 &&
              "This content shows strong indicators of AI generation across multiple analysis factors."}
            {overallScore >= 40 &&
              overallScore < 70 &&
              "This content shows mixed patterns that could indicate partial AI assistance."}
            {overallScore < 40 &&
              "This content shows characteristics typical of human writing with natural variation."}
          </p>
        </div>
      </div>

      <div className="analysis-metrics">
        <div className="metric-card">
          <div className="metric-label">Perplexity</div>
          <div className="metric-value">{analysis?.perplexity || "N/A"}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Burstiness</div>
          <div className="metric-value">{analysis?.burstiness || "N/A"}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Model</div>
          <div className="metric-value">{modelAttribution || "Unknown"}</div>
        </div>
      </div>

      <div className="heatmap-section">
        <h3>Sentence-Level Analysis</h3>
        <p className="section-description">
          Color intensity indicates AI probability:{" "}
          <span style={{ color: "var(--success-color)" }}>Low</span> →{" "}
          <span style={{ color: "var(--warning-color)" }}>Medium</span> →{" "}
          <span style={{ color: "var(--danger-color)" }}>High</span>
        </p>
        <Heatmap sentences={sentenceScores} />
      </div>
    </div>
  );
};

export default AIDetectionViewer;
