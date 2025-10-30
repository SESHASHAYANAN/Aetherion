import React, { useState } from "react";
import InputPanel from "../components/InputPanel";
import AIDetectionViewer from "../components/AIDetectionViewer";
import FactCheckPanel from "../components/FactCheckPanel";
import LoaderSpinner from "../components/LoaderSpinner";
import HistoryExport from "../components/HistoryExport";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setActiveTab("results");
  };

  const handleReset = () => {
    setAnalysisData(null);
    setActiveTab("input");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Content Verification Dashboard</h1>
        <p>Analyze content for AI detection and fact verification</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "input" ? "active" : ""}`}
          onClick={() => setActiveTab("input")}
        >
          Input
        </button>
        <button
          className={`tab-btn ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
          disabled={!analysisData}
        >
          Results
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      <div className="dashboard-content">
        {loading && <LoaderSpinner />}

        {activeTab === "input" && (
          <InputPanel
            onAnalysisComplete={handleAnalysisComplete}
            setLoading={setLoading}
          />
        )}

        {activeTab === "results" && analysisData && (
          <div className="results-container">
            <div className="results-actions">
              <button className="btn btn-secondary" onClick={handleReset}>
                New Analysis
              </button>
            </div>

            <div className="results-grid">
              <AIDetectionViewer data={analysisData.aiDetection} />
              <FactCheckPanel data={analysisData.factCheck} />
            </div>

            <HistoryExport data={analysisData} />
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-container">
            <h2>Analysis History</h2>
            <p className="coming-soon">History feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
