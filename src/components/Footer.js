import React from "react";
import ClaimsTable from "./ClaimsTable";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import "../styles/FactCheckPanel.css";

const FactCheckPanel = ({ data }) => {
  if (!data) return null;

  const { claims, overallCredibility, biasDetection } = data;

  const getCredibilityIcon = (status) => {
    switch (status) {
      case "verified":
        return <FaCheckCircle className="status-icon verified" />;
      case "partially-true":
        return <FaExclamationTriangle className="status-icon partial" />;
      case "false":
        return <FaTimesCircle className="status-icon false" />;
      default:
        return <FaQuestionCircle className="status-icon unverified" />;
    }
  };

  const getCredibilityColor = (score) => {
    if (score >= 70) return "var(--success-color)";
    if (score >= 40) return "var(--warning-color)";
    return "var(--danger-color)";
  };

  return (
    <div className="fact-check-panel card">
      <h2 className="section-heading">Fact Verification</h2>

      <div className="credibility-overview">
        <div className="credibility-score">
          <div
            className="credibility-circle"
            style={{ borderColor: getCredibilityColor(overallCredibility) }}
          >
            <div className="credibility-value">{overallCredibility}%</div>
            <div className="credibility-label">Credibility</div>
          </div>
        </div>

        <div className="credibility-stats">
          <div className="stat-item">
            <FaCheckCircle className="stat-icon verified" />
            <div className="stat-content">
              <div className="stat-value">
                {claims?.filter((c) => c.status === "verified").length || 0}
              </div>
              <div className="stat-label">Verified</div>
            </div>
          </div>

          <div className="stat-item">
            <FaExclamationTriangle className="stat-icon partial" />
            <div className="stat-content">
              <div className="stat-value">
                {claims?.filter((c) => c.status === "partially-true").length ||
                  0}
              </div>
              <div className="stat-label">Partial</div>
            </div>
          </div>

          <div className="stat-item">
            <FaTimesCircle className="stat-icon false" />
            <div className="stat-content">
              <div className="stat-value">
                {claims?.filter((c) => c.status === "false").length || 0}
              </div>
              <div className="stat-label">False</div>
            </div>
          </div>
        </div>
      </div>

      {biasDetection && (
        <div className="bias-detection">
          <h3>Bias Analysis</h3>
          <div className="bias-badges">
            {biasDetection.detected &&
              biasDetection.types.map((bias, idx) => (
                <span key={idx} className="badge badge-warning">
                  {bias}
                </span>
              ))}
            {!biasDetection.detected && (
              <span className="badge badge-success">
                No significant bias detected
              </span>
            )}
          </div>
        </div>
      )}

      <div className="claims-section">
        <h3>Factual Claims Analysis</h3>
        <ClaimsTable claims={claims} />
      </div>
    </div>
  );
};

export default FactCheckPanel;
