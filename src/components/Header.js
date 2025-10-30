import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaRobot,
  FaChartLine,
} from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Aetherion</span>
          </h1>
          <p className="hero-subtitle">
            AI Detection & Fact-Verification Platform
          </p>
          <p className="hero-description">
            Restore trust and transparency in digital content with dual-layer
            verification: AI content detection and real-time fact-checking
            powered by advanced machine learning.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Start Verification
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/batch")}
            >
              Premium Batch
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaRobot />
            </div>
            <h3>AI Detection</h3>
            <p>
              Sentence-level AI probability scoring with visual heatmaps showing
              AI-generated sections
            </p>
            <ul className="feature-list">
              <li>0-100% confidence score</li>
              <li>Model attribution (GPT, Claude, Gemini)</li>
              <li>Perplexity & burstiness analysis</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaCheckCircle />
            </div>
            <h3>Fact Verification</h3>
            <p>
              Cross-reference claims against trusted databases with real-time
              web search
            </p>
            <ul className="feature-list">
              <li>Multi-source validation</li>
              <li>Source credibility scoring</li>
              <li>Bias detection analysis</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Visual Analytics</h3>
            <p>
              Interactive reports with heatmaps, sentence scoring, and
              exportable results
            </p>
            <ul className="feature-list">
              <li>Real-time analysis</li>
              <li>Export to PDF/CSV</li>
              <li>History tracking</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Multiple Input Methods</h3>
            <p>Flexible content submission for comprehensive verification</p>
            <ul className="feature-list">
              <li>Direct text input (10,000 chars)</li>
              <li>URL extraction & analysis</li>
              <li>Batch processing (Premium)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="users-section">
        <h2 className="section-title">Who Uses Aetherion?</h2>
        <div className="users-grid">
          <div className="user-card">
            <h4>Educators</h4>
            <p>Verify student submissions and maintain academic integrity</p>
          </div>
          <div className="user-card">
            <h4>Students</h4>
            <p>Check research sources and validate reliability</p>
          </div>
          <div className="user-card">
            <h4>Journalists</h4>
            <p>Verify news stories and combat misinformation</p>
          </div>
          <div className="user-card">
            <h4>Marketers</h4>
            <p>Audit content authenticity and protect brand trust</p>
          </div>
          <div className="user-card">
            <h4>Writers</h4>
            <p>Validate research and ensure content credibility</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Verify Your Content?</h2>
        <p>Join thousands of users restoring trust in digital content</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default Home;
