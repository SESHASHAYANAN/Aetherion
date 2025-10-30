import React from "react";
import "../styles/LoaderSpinner.css";

const LoaderSpinner = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Analyzing content...</p>
        <p className="loader-subtext">This may take a few seconds</p>
      </div>
    </div>
  );
};

export default LoaderSpinner;
