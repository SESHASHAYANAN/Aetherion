import React from "react";
import "../styles/Heatmap.css";

const Heatmap = ({ sentences }) => {
  if (!sentences || sentences.length === 0) {
    return <div className="heatmap-empty">No sentence data available</div>;
  }

  const getHeatColor = (score) => {
    if (score >= 70) return "#ef4444";
    if (score >= 40) return "#f59e0b";
    return "#10b981";
  };

  const getOpacity = (score) => {
    return 0.2 + (score / 100) * 0.6;
  };

  return (
    <div className="heatmap-container">
      {sentences.map((item, index) => (
        <span
          key={index}
          className="heatmap-sentence"
          style={{
            backgroundColor: getHeatColor(item.score),
            opacity: getOpacity(item.score),
          }}
          title={`AI Probability: ${item.score}%`}
        >
          {item.sentence}{" "}
        </span>
      ))}
    </div>
  );
};

export default Heatmap;
