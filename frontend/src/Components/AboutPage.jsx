import React from "react";
import {
  Target,
  Check,
  Users,
  TrendingUp,
  Shield,
  PieChart,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Styles/AboutPage.css";

function AboutPage() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-header-content">
          <h1>Smart Expense Tracker</h1>
          <p>Empowering Financial Clarity and Control</p>
          <button className="home-button" onClick={handleHomeClick}>
            <Home className="home-button-icon" />
            Go to Home
          </button>
        </div>
      </header>

      <main className="about-main">
        <section className="about-section mission-section">
          <div className="section-icon">
            <Target className="icon" />
          </div>
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>
              We are dedicated to transforming financial management by providing
              intuitive, powerful tools that simplify expense tracking,
              budgeting, and financial insights. Our goal is to help individuals
              and businesses make informed financial decisions with ease and
              confidence.
            </p>
          </div>
        </section>

        <section className="about-section features-section">
          <div className="section-icon">
            <Check className="icon" />
          </div>
          <div className="section-content">
            <h2>Why Choose Us?</h2>
            <ul className="feature-list">
              <li>
                <TrendingUp className="feature-icon" />
                Real-time expense tracking and categorization
              </li>
              <li>
                <PieChart className="feature-icon" />
                Smart insights and comprehensive financial reports
              </li>
              <li>
                <Shield className="feature-icon" />
                Advanced budget alerts and subscription management
              </li>
              <li>
                <Users className="feature-icon" />
                Robust admin tools for user management and system analytics
              </li>
            </ul>
          </div>
        </section>

        <section className="about-section team-section">
          <div className="section-icon">
            <Users className="icon" />
          </div>
          <div className="section-content">
            <h2>Meet the Developer</h2>
            <p>
              I'm a passionate developer with a keen interest in financial
              technology. My journey in creating Smart Expense Tracker stems
              from a personal mission to simplify financial management and
              provide insights that empower individuals to take control of their
              financial future.
            </p>
          </div>
        </section>
      </main>

      <footer className="about-footer">
        <div className="footer-content">
          <p>
            © {new Date().getFullYear()} Smart Expense Tracker. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
