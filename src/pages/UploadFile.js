import React, { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaQuestionCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "../styles/ClaimsTable.css";

const ClaimsTable = ({ claims }) => {
  const [expandedClaim, setExpandedClaim] = useState(null);

  if (!claims || claims.length === 0) {
    return (
      <div className="claims-empty">
        No factual claims detected in the content
      </div>
    );
  }

  const getStatusIcon = (status) => {
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

  const getStatusBadge = (status) => {
    const badges = {
      verified: "badge-success",
      "partially-true": "badge-warning",
      false: "badge-danger",
      unverifiable: "badge-info",
    };
    return badges[status] || "badge-info";
  };

  const getStatusText = (status) => {
    const text = {
      verified: "Verified",
      "partially-true": "Partially True",
      false: "False",
      unverifiable: "Unverifiable",
    };
    return text[status] || "Unknown";
  };

  return (
    <div className="claims-table-container">
      {claims.map((claim, index) => (
        <div key={index} className="claim-item">
          <div
            className="claim-header"
            onClick={() =>
              setExpandedClaim(expandedClaim === index ? null : index)
            }
          >
            <div className="claim-status">{getStatusIcon(claim.status)}</div>
            <div className="claim-content">
              <p className="claim-text">{claim.claim}</p>
              <span className={`badge ${getStatusBadge(claim.status)}`}>
                {getStatusText(claim.status)}
              </span>
            </div>
          </div>

          {expandedClaim === index && (
            <div className="claim-details">
              <div className="claim-evidence">
                <h4>Evidence & Sources</h4>
                {claim.sources && claim.sources.length > 0 ? (
                  <ul className="sources-list">
                    {claim.sources.map((source, idx) => (
                      <li key={idx}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.title || source.url}
                          <FaExternalLinkAlt className="external-icon" />
                        </a>
                        <div className="source-credibility">
                          Credibility: {source.credibilityScore || "N/A"}%
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-sources">No sources available</p>
                )}
              </div>

              {claim.explanation && (
                <div className="claim-explanation">
                  <h4>Verification Explanation</h4>
                  <p>{claim.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClaimsTable;
