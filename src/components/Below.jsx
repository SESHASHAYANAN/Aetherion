import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Aetherion</h3>
            <p>
              Restoring trust in digital content with AI detection and fact
              verification.
            </p>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li>
                <a href="/batch">Batch Processing</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="/">Documentation</a>
              </li>
              <li>
                <a href="/">API</a>
              </li>
              <li>
                <a href="/">Support</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="/" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="/" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="/" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Aetherion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
