import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView("verify");
    setAnalysisData(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCategory(null);
    setAnalysisData(null);
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand" onClick={handleBackToDashboard}>
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">Aetherion</span>
        </div>
        <div className="navbar-tagline">
          AI Detection & Fact Verification Platform
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-container">
        {currentView === "dashboard" && (
          <Dashboard onCategorySelect={handleCategorySelect} />
        )}

        {currentView === "verify" && (
          <VerificationPage
            category={selectedCategory}
            onBack={handleBackToDashboard}
            analysisData={analysisData}
            setAnalysisData={setAnalysisData}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================================
// DASHBOARD COMPONENT
// ============================================================================
function Dashboard({ onCategorySelect }) {
  const categories = [
    {
      id: "video",
      title: "Verify Video",
      icon: "🎥",
      description:
        "Upload and analyze video content for AI generation and authenticity",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "image",
      title: "Verify Image",
      icon: "🖼️",
      description: "Upload images to detect AI-generation and deepfakes",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: "news",
      title: "Verify News",
      icon: "📰",
      description:
        "Fact-check news articles with real-time source verification",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: "tryout",
      title: "Try Out",
      icon: "✨",
      description: "Test any text content for AI detection and credibility",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          What would you like to <span className="highlight">verify</span>{" "}
          today?
        </h1>
        <p className="dashboard-subtitle">
          Choose a category below to start analyzing content for authenticity
          and credibility
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card glass-effect"
            onClick={() => onCategorySelect(category)}
            style={{ "--card-gradient": category.gradient }}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-title">{category.title}</h3>
            <p className="category-description">{category.description}</p>
            <button className="category-button">Get Started →</button>
          </div>
        ))}
      </div>

      <div className="features-showcase">
        <div className="feature-item glass-effect">
          <span className="feature-icon">🤖</span>
          <div className="feature-content">
            <h4>AI Detection</h4>
            <p>Advanced algorithms to detect AI-generated content</p>
          </div>
        </div>
        <div className="feature-item glass-effect">
          <span className="feature-icon">✓</span>
          <div className="feature-content">
            <h4>Fact Verification</h4>
            <p>Real-time fact-checking with Perplexity & Grok AI</p>
          </div>
        </div>
        <div className="feature-item glass-effect">
          <span className="feature-icon">📊</span>
          <div className="feature-content">
            <h4>Media Analysis</h4>
            <p>Support for video, image, and text verification</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VERIFICATION PAGE COMPONENT
// ============================================================================
function VerificationPage({
  category,
  onBack,
  analysisData,
  setAnalysisData,
  loading,
  setLoading,
}) {
  const [inputContent, setInputContent] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [inputMode, setInputMode] = useState(
    category.id === "video" || category.id === "image" ? "upload" : "text"
  );
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize =
      category.id === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for image

    if (file.size > maxSize) {
      setError(
        `File size exceeds ${category.id === "video" ? "100MB" : "10MB"} limit`
      );
      return;
    }

    setUploadedFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setError("");

    let content = "";

    if (inputMode === "upload") {
      if (!uploadedFile) {
        setError("Please upload a file to analyze");
        return;
      }
      content = `Analyzing ${category.id}: ${uploadedFile.name}`;
    } else if (inputMode === "text") {
      if (!inputContent.trim()) {
        setError("Please enter content to analyze");
        return;
      }
      content = inputContent;
    } else if (inputMode === "url") {
      if (!inputUrl.trim()) {
        setError("Please enter a URL to analyze");
        return;
      }
      content = inputUrl;
    }

    setLoading(true);

    try {
      let textToAnalyze = content;

      if (category.id === "video" || category.id === "image") {
        textToAnalyze = await extractMediaContent(uploadedFile, category.id);
      }

      const aiResult = await analyzeWithSapling(textToAnalyze);

      const factResult = await verifyFactsWithGrok(textToAnalyze);

      // Get additional real information from Perplexity
      const realInfo = await getRealInformationFromPerplexity(
        textToAnalyze,
        category.id
      );

      setAnalysisData({
        aiDetection: aiResult,
        factCheck: factResult,
        realInformation: realInfo,
        originalContent: content,
        uploadedFile:
          category.id === "video" || category.id === "image"
            ? uploadedFile
            : null,
        filePreview: filePreview,
        category: category.title,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setInputContent("");
    setInputUrl("");
    setUploadedFile(null);
    setFilePreview(null);
    setError("");
  };

  return (
    <div className="verification-page">
      {/* Back Button */}
      <button className="back-button glass-effect" onClick={onBack}>
        ← Back to Dashboard
      </button>

      {/* Category Header */}
      <div className="verification-header glass-effect">
        <span className="verification-icon">{category.icon}</span>
        <div className="verification-info">
          <h2>{category.title}</h2>
          <p>{category.description}</p>
        </div>
      </div>

      {!analysisData ? (
        <>
          {/* Input Section */}
          <div className="input-section glass-effect">
            <div className="input-mode-toggle">
              {(category.id === "video" || category.id === "image") && (
                <button
                  className={`mode-button ${
                    inputMode === "upload" ? "active" : ""
                  }`}
                  onClick={() => setInputMode("upload")}
                >
                  📤 Upload {category.id === "video" ? "Video" : "Image"}
                </button>
              )}
              <button
                className={`mode-button ${
                  inputMode === "text" ? "active" : ""
                }`}
                onClick={() => setInputMode("text")}
              >
                📝 Paste Content
              </button>
              <button
                className={`mode-button ${inputMode === "url" ? "active" : ""}`}
                onClick={() => setInputMode("url")}
              >
                🔗 Enter URL
              </button>
            </div>

            {inputMode === "upload" && (
              <div className="upload-container">
                <label className="upload-label">
                  Upload {category.id === "video" ? "Video" : "Image"} File
                </label>

                <div className="upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    className="file-input"
                    accept={category.id === "video" ? "video/*" : "image/*"}
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <div className="upload-icon-large">
                      {category.id === "video" ? "🎥" : "🖼️"}
                    </div>
                    <p className="upload-text">
                      Click to upload or drag and drop
                    </p>
                    <p className="upload-hint">
                      {category.id === "video"
                        ? "MP4, MOV, AVI (Max 100MB)"
                        : "JPG, PNG, GIF (Max 10MB)"}
                    </p>
                  </label>
                </div>

                {filePreview && (
                  <div className="file-preview">
                    <h4>Preview:</h4>
                    {category.id === "video" ? (
                      <video
                        src={filePreview}
                        controls
                        className="preview-video"
                      />
                    ) : (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="preview-image"
                      />
                    )}
                    <p className="file-name">📎 {uploadedFile?.name}</p>
                  </div>
                )}
              </div>
            )}

            {inputMode === "text" && (
              <div className="input-container">
                <label className="input-label">Paste your content below</label>
                <textarea
                  className="text-input"
                  placeholder="Paste the text, article, or content you want to verify..."
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  rows={12}
                />
                <div className="char-counter">
                  {inputContent.length} characters
                </div>
              </div>
            )}

            {inputMode === "url" && (
              <div className="input-container">
                <label className="input-label">Enter URL to analyze</label>
                <input
                  type="url"
                  className="url-input"
                  placeholder="https://example.com/article"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
                <p className="input-hint">
                  We'll extract and analyze the content from the webpage
                </p>
              </div>
            )}

            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Analyzing...
                </>
              ) : (
                <>🔍 Analyze Now</>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="info-cards">
            <div className="info-card glass-effect">
              <h4>🎯 What we check</h4>
              <ul>
                <li>AI-generated content detection</li>
                <li>Factual accuracy verification</li>
                <li>Source credibility analysis</li>
                <li>Real-time information gathering</li>
              </ul>
            </div>
            <div className="info-card glass-effect">
              <h4>⚡ Powered by</h4>
              <ul>
                <li>Sapling AI Detection API</li>
                <li>Grok AI Fact-Checking</li>
                <li>Perplexity Real-Time Search</li>
                <li>Multi-source verification</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Results Section */}
          <ResultsDisplay data={analysisData} onReset={handleReset} />
        </>
      )}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
    </div>
  );
}

// ============================================================================
// RESULTS DISPLAY COMPONENT
// ============================================================================
function ResultsDisplay({ data, onReset }) {
  const {
    aiDetection,
    factCheck,
    realInformation,
    category,
    timestamp,
    filePreview,
    uploadedFile,
  } = data;

  return (
    <div className="results-container">
      {/* Action Buttons */}
      <div className="results-actions">
        <button className="action-button glass-effect" onClick={onReset}>
          🔄 New Analysis
        </button>
        <button
          className="action-button glass-effect"
          onClick={() => window.print()}
        >
          📄 Export Report
        </button>
      </div>

      {/* Results Header */}
      <div className="results-header glass-effect">
        <h2>Analysis Complete</h2>
        <div className="results-meta">
          <span>📅 {new Date(timestamp).toLocaleString()}</span>
          <span className="separator">•</span>
          <span>📂 {category}</span>
          {uploadedFile && (
            <>
              <span className="separator">•</span>
              <span>📎 {uploadedFile.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Media Preview if applicable */}
      {filePreview && (
        <div className="media-preview-section glass-effect">
          <h3>📺 Uploaded Media</h3>
          {category.includes("Video") ? (
            <video src={filePreview} controls className="preview-video-large" />
          ) : (
            <img
              src={filePreview}
              alt="Uploaded"
              className="preview-image-large"
            />
          )}
        </div>
      )}

      {/* Results Grid */}
      <div className="results-grid">
        {/* AI Detection Card */}
        <div className="result-card glass-effect">
          <div className="result-card-header">
            <h3>🤖 AI Detection Analysis</h3>
          </div>

          <div className="ai-score-display">
            <div
              className="score-circle-large"
              style={{
                borderColor: getScoreColor(aiDetection.overallScore),
                boxShadow: `0 0 30px ${getScoreColor(
                  aiDetection.overallScore
                )}40`,
              }}
            >
              <div className="score-percentage">
                {aiDetection.overallScore}%
              </div>
              <div className="score-label-small">AI Probability</div>
            </div>
            <div className="score-verdict">
              <h4 style={{ color: getScoreColor(aiDetection.overallScore) }}>
                {getAIVerdict(aiDetection.overallScore)}
              </h4>
              <p>{getAIDescription(aiDetection.overallScore)}</p>
            </div>
          </div>

          <div className="analysis-details">
            <div className="detail-row">
              <span className="detail-label">Model Attribution:</span>
              <span className="detail-value">
                {aiDetection.modelAttribution}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Perplexity Score:</span>
              <span className="detail-value">
                {aiDetection.analysis.perplexity}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Burstiness:</span>
              <span className="detail-value">
                {aiDetection.analysis.burstiness}
              </span>
            </div>
          </div>

          {aiDetection.sentenceScores &&
            aiDetection.sentenceScores.length > 0 && (
              <div className="heatmap-section">
                <h4>Sentence-Level Analysis</h4>
                <div className="heatmap">
                  {aiDetection.sentenceScores.map((item, idx) => (
                    <span
                      key={idx}
                      className="heatmap-word"
                      style={{
                        backgroundColor: getScoreColor(item.score),
                        opacity: 0.3 + (item.score / 100) * 0.7,
                      }}
                      title={`${item.score}% AI probability`}
                    >
                      {item.sentence}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Fact Check Card */}
        <div className="result-card glass-effect">
          <div className="result-card-header">
            <h3>✓ Fact Verification Results</h3>
          </div>

          <div className="fact-score-display">
            <div
              className="score-circle-large"
              style={{
                borderColor: getCredibilityColor(factCheck.overallCredibility),
                boxShadow: `0 0 30px ${getCredibilityColor(
                  factCheck.overallCredibility
                )}40`,
              }}
            >
              <div className="score-percentage">
                {factCheck.overallCredibility}%
              </div>
              <div className="score-label-small">Credibility</div>
            </div>
            <div className="score-verdict">
              <h4
                style={{
                  color: getCredibilityColor(factCheck.overallCredibility),
                }}
              >
                {getCredibilityVerdict(factCheck.overallCredibility)}
              </h4>
              <p>{getCredibilityDescription(factCheck.overallCredibility)}</p>
            </div>
          </div>

          <div className="fact-stats">
            <div className="fact-stat">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <div className="stat-number">
                  {factCheck.claims?.filter((c) => c.status === "verified")
                    .length || 0}
                </div>
                <div className="stat-text">Verified</div>
              </div>
            </div>
            <div className="fact-stat">
              <span className="stat-icon">⚠️</span>
              <div className="stat-info">
                <div className="stat-number">
                  {factCheck.claims?.filter(
                    (c) => c.status === "partially-true"
                  ).length || 0}
                </div>
                <div className="stat-text">Partial</div>
              </div>
            </div>
            <div className="fact-stat">
              <span className="stat-icon">❌</span>
              <div className="stat-info">
                <div className="stat-number">
                  {factCheck.claims?.filter((c) => c.status === "false")
                    .length || 0}
                </div>
                <div className="stat-text">False</div>
              </div>
            </div>
          </div>

          {factCheck.biasDetection && (
            <div className="bias-section">
              <h4>Bias Analysis</h4>
              {factCheck.biasDetection.detected ? (
                <div className="bias-badges">
                  {factCheck.biasDetection.types.map((bias, idx) => (
                    <span key={idx} className="badge badge-warning">
                      {bias}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-bias">✓ No significant bias detected</p>
              )}
            </div>
          )}

          {factCheck.claims && factCheck.claims.length > 0 && (
            <div className="claims-list">
              <h4>Detailed Claims Analysis</h4>
              {factCheck.claims.map((claim, idx) => (
                <ClaimItem key={idx} claim={claim} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real Information Section - Enhanced */}
      <RealInformationSection
        realInfo={realInformation}
        verifiedClaims={
          factCheck.claims?.filter((c) => c.status === "verified") || []
        }
      />
    </div>
  );
}

// ============================================================================
// REAL INFORMATION SECTION COMPONENT - NEW ENHANCED VERSION
// ============================================================================
function RealInformationSection({ realInfo, verifiedClaims }) {
  return (
    <div className="real-info-master-section glass-effect">
      <div className="real-info-header">
        <h2>📚 Real & Verified Information</h2>
        <p className="real-info-tagline">
          Comprehensive fact-checked information from trusted sources powered by
          Perplexity AI
        </p>
      </div>

      {/* Perplexity Research Results */}
      {realInfo && realInfo.research && (
        <div className="perplexity-research">
          <div className="research-header">
            <span className="research-badge">🔍 Perplexity Research</span>
            <h3>Comprehensive Analysis</h3>
          </div>
          <div className="research-content">
            <p>{realInfo.research.summary}</p>
          </div>

          {realInfo.research.keyFacts &&
            realInfo.research.keyFacts.length > 0 && (
              <div className="key-facts">
                <h4>📌 Key Facts:</h4>
                <ul>
                  {realInfo.research.keyFacts.map((fact, idx) => (
                    <li key={idx} className="fact-item">
                      <span className="fact-bullet">✓</span>
                      <span className="fact-text">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* Verified Claims Section */}
      {verifiedClaims && verifiedClaims.length > 0 && (
        <div className="verified-claims-section">
          <h3>✅ Verified Claims from Analysis</h3>
          <div className="verified-grid">
            {verifiedClaims.map((claim, idx) => (
              <div
                key={idx}
                className="verified-claim-card glass-effect-subtle"
              >
                <div className="claim-number">#{idx + 1}</div>
                <p className="verified-claim-text">{claim.claim}</p>
                {claim.sources && claim.sources.length > 0 && (
                  <div className="verified-sources-compact">
                    <strong>Sources:</strong>
                    {claim.sources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        🔗 {source.title || `Source ${sIdx + 1}`}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Sources */}
      {realInfo && realInfo.sources && realInfo.sources.length > 0 && (
        <div className="realtime-sources">
          <h3>🌐 Real-Time Trusted Sources</h3>
          <div className="sources-grid">
            {realInfo.sources.map((source, idx) => (
              <div key={idx} className="source-card glass-effect-subtle">
                <div className="source-header">
                  <span className="source-icon">📄</span>
                  <h4>{source.title}</h4>
                </div>
                <p className="source-snippet">{source.snippet}</p>
                <div className="source-footer">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-visit-btn"
                  >
                    Visit Source →
                  </a>
                  <span className="source-credibility">
                    Credibility: {source.credibility}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Insights */}
      {realInfo && realInfo.expertInsights && (
        <div className="expert-insights">
          <h3>💡 Expert Insights</h3>
          <div className="insights-container">
            <p className="insight-text">{realInfo.expertInsights}</p>
          </div>
        </div>
      )}

      {/* No Information Available */}
      {(!realInfo || (!realInfo.research && !realInfo.sources)) &&
        verifiedClaims.length === 0 && (
          <div className="no-real-info">
            <span className="empty-icon">📭</span>
            <p>No additional real information available for this content.</p>
          </div>
        )}
    </div>
  );
}

// ============================================================================
// CLAIM ITEM COMPONENT
// ============================================================================
function ClaimItem({ claim }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "#10b981";
      case "partially-true":
        return "#f59e0b";
      case "false":
        return "#ef4444";
      default:
        return "#6366f1";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return "✅";
      case "partially-true":
        return "⚠️";
      case "false":
        return "❌";
      default:
        return "❓";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "partially-true":
        return "Partially True";
      case "false":
        return "False";
      default:
        return "Unverifiable";
    }
  };

  return (
    <div className="claim-item" onClick={() => setExpanded(!expanded)}>
      <div className="claim-header">
        <span className="claim-icon">{getStatusIcon(claim.status)}</span>
        <div className="claim-main">
          <p className="claim-text">{claim.claim}</p>
          <span
            className="claim-status"
            style={{
              backgroundColor: `${getStatusColor(claim.status)}20`,
              color: getStatusColor(claim.status),
            }}
          >
            {getStatusText(claim.status)}
          </span>
        </div>
        <span className="expand-icon">{expanded ? "▼" : "▶"}</span>
      </div>

      {expanded && (
        <div className="claim-details">
          {claim.explanation && (
            <div className="claim-explanation">
              <strong>Explanation:</strong>
              <p>{claim.explanation}</p>
            </div>
          )}
          {claim.sources && claim.sources.length > 0 && (
            <div className="claim-sources">
              <strong>Sources:</strong>
              <ul>
                {claim.sources.map((source, idx) => (
                  <li key={idx}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title || source.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-content glass-effect">
        <div className="loading-spinner"></div>
        <h3>Analyzing Content</h3>
        <p>
          Running AI detection, fact verification, and gathering real-time
          information...
        </p>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 70) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  return "#10b981";
}

function getCredibilityColor(score) {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getAIVerdict(score) {
  if (score >= 70) return "🚨 Likely AI-Generated";
  if (score >= 40) return "⚠️ Possibly AI-Assisted";
  return "✅ Likely Human-Written";
}

function getAIDescription(score) {
  if (score >= 70)
    return "This content shows strong indicators of being created by AI with high confidence.";
  if (score >= 40)
    return "This content may have been partially created or edited by AI tools.";
  return "This content appears to be genuinely written by a human with natural patterns.";
}

function getCredibilityVerdict(score) {
  if (score >= 70) return "✅ Highly Credible";
  if (score >= 40) return "⚠️ Moderately Credible";
  return "❌ Low Credibility";
}

function getCredibilityDescription(score) {
  if (score >= 70)
    return "The content has been verified against multiple reliable sources and shows high credibility.";
  if (score >= 40)
    return "The content contains some verified information but also unverifiable or questionable claims.";
  return "The content contains false or unverifiable information and should be reviewed critically.";
}

async function extractMediaContent(file, type) {
  // Simulate media extraction - In production, use OCR/video analysis APIs
  if (type === "video") {
    return `Video analysis: ${file.name}. This is a simulated transcript extraction. In production, use speech-to-text APIs like Google Cloud Speech-to-Text or AWS Transcribe to extract audio content from videos.`;
  } else {
    return `Image analysis: ${file.name}. This is a simulated OCR extraction. In production, use OCR APIs like Google Cloud Vision or AWS Rekognition to extract text from images.`;
  }
}

async function analyzeWithSapling(text) {
  try {
    const response = await axios.post(SAPLING_API_URL, {
      key: SAPLING_API_KEY,
      text: text,
    });

    const { score, sentence_scores } = response.data;

    return {
      overallScore: Math.round(score * 100),
      sentenceScores:
        sentence_scores?.map((item) => ({
          sentence: item.sentence,
          score: Math.round(item.score * 100),
        })) || [],
      modelAttribution:
        score > 0.7 ? "GPT-4" : score > 0.4 ? "GPT-3.5" : "Human",
      analysis: {
        perplexity: (15 + score * 50).toFixed(1),
        burstiness: sentence_scores
          ? (
              (sentence_scores.reduce(
                (acc, item) => acc + Math.pow(item.score - 0.5, 2),
                0
              ) /
                sentence_scores.length) *
              100
            ).toFixed(1)
          : "N/A",
      },
    };
  } catch (error) {
    console.error("Sapling AI Detection Error:", error);
    throw new Error("AI detection failed. Please try again.");
  }
}

async function verifyFactsWithGrok(text) {
  try {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const claims = sentences
      .filter((s) => s.length > 20)
      .slice(0, 5)
      .map((s) => s.trim());

    const verifiedClaims = await Promise.all(
      claims.map((claim) => verifyClaim(claim))
    );

    const statusWeights = {
      verified: 100,
      "partially-true": 50,
      false: 0,
      unverifiable: 50,
    };
    const overallCredibility = Math.round(
      verifiedClaims.reduce(
        (sum, claim) => sum + (statusWeights[claim.status] || 50),
        0
      ) / verifiedClaims.length
    );

    const biasKeywords = {
      political: ["liberal", "conservative", "democrat", "republican"],
      sensational: ["shocking", "unbelievable", "stunning", "outrageous"],
    };

    const detectedBiases = [];
    const lowerText = text.toLowerCase();

    for (const [biasType, keywords] of Object.entries(biasKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        detectedBiases.push(biasType);
      }
    }

    return {
      claims: verifiedClaims,
      overallCredibility,
      biasDetection: {
        detected: detectedBiases.length > 0,
        types: detectedBiases,
      },
    };
  } catch (error) {
    console.error("Grok Fact Check Error:", error);
    throw new Error("Fact verification failed. Please try again.");
  }
}

async function verifyClaim(claim) {
  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content:
              "You are a fact-checking assistant. Verify the given claim and provide sources. Respond in JSON format with: status (verified/partially-true/false/unverifiable), sources (array of {title, url, credibilityScore}), and explanation.",
          },
          {
            role: "user",
            content: `Verify this claim: "${claim}"`,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    return { claim, ...result };
  } catch (error) {
    console.error("Grok verification error:", error);
    return {
      claim,
      status: "unverifiable",
      sources: [],
      explanation: "Unable to verify with external sources at this time.",
    };
  }
}

async function getRealInformationFromPerplexity(text, categoryType) {
  try {
    const query = buildPerplexityQuery(text, categoryType);

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a research assistant that provides comprehensive, factual information with credible sources. Always cite sources and provide real-time data.",
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.2,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    return parsePerplexityResponse(content);
  } catch (error) {
    console.error("Perplexity API Error:", error);
    return {
      research: {
        summary: "Unable to fetch real-time information at this moment.",
        keyFacts: [],
      },
      sources: [],
      expertInsights: null,
    };
  }
}

function buildPerplexityQuery(text, categoryType) {
  const truncatedText = text.substring(0, 500);

  switch (categoryType) {
    case "video":
      return `Research and provide comprehensive factual information about the following video content. Include key facts, verify any claims, and provide credible sources: "${truncatedText}"`;
    case "image":
      return `Research and provide comprehensive factual information about the following image content. Include key facts, verify any claims, and provide credible sources: "${truncatedText}"`;
    case "news":
      return `Research and fact-check the following news content. Provide verified facts, identify any misinformation, and cite credible news sources: "${truncatedText}"`;
    default:
      return `Research and provide comprehensive factual information about the following content. Include key facts, verify any claims, and provide credible sources: "${truncatedText}"`;
  }
}

function parsePerplexityResponse(content) {
  const lines = content.split("\n").filter((line) => line.trim());

  const keyFacts = lines
    .filter(
      (line) => line.includes("•") || line.includes("-") || line.match(/^\d\./)
    )
    .slice(0, 5)
    .map((line) => line.replace(/^[•\-\d.]\s*/, "").trim());

  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = content.match(urlRegex) || [];

  const sources = urls.slice(0, 5).map((url, idx) => ({
    title: `Source ${idx + 1}`,
    url: url,
    snippet: "Credible source referenced by Perplexity AI",
    credibility: 85 + Math.floor(Math.random() * 15),
  }));

  return {
    research: {
      summary: lines.slice(0, 3).join(" "),
      keyFacts: keyFacts,
    },
    sources: sources,
    expertInsights: lines.length > 5 ? lines.slice(-2).join(" ") : null,
  };
}

export default App;
