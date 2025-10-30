import React from "react";
import { FaDownload, FaFilePdf, FaFileCsv, FaShare } from "react-icons/fa";
import "../styles/HistoryExport.css";

const HistoryExport = ({ data }) => {
  const handleExportPDF = () => {
    console.log("Exporting to PDF...", data);
    alert("PDF export feature coming soon!");
  };

  const handleExportCSV = () => {
    console.log("Exporting to CSV...", data);
    alert("CSV export feature coming soon!");
  };

  const handleShare = () => {
    console.log("Sharing report...", data);
    alert("Share feature coming soon!");
  };

  return (
    <div className="history-export card">
      <h3>Export & Share</h3>
      <p className="export-description">
        Download your analysis report or share it with your team
      </p>

      <div className="export-actions">
        <button className="btn btn-secondary" onClick={handleExportPDF}>
          <FaFilePdf /> Export PDF
        </button>
        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <FaFileCsv /> Export CSV
        </button>
        <button className="btn btn-secondary" onClick={handleShare}>
          <FaShare /> Share Report
        </button>
      </div>

      <div className="report-summary">
        <h4>Report Summary</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Analysis Date:</span>
            <span className="summary-value">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Input Type:</span>
            <span className="summary-value">{data?.inputType || "N/A"}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">AI Confidence:</span>
            <span className="summary-value">
              {data?.aiDetection?.overallScore || 0}%
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Credibility:</span>
            <span className="summary-value">
              {data?.factCheck?.overallCredibility || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryExport;
